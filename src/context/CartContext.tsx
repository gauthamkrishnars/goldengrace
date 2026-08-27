"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { CartItem, Product } from "@/data/types";
import { supabase } from "@/lib/supabase";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "golden_grace_cart";

function getLocalCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const userIdRef = useRef<string | null>(null);

  // Keep ref in sync
  useEffect(() => { userIdRef.current = userId; }, [userId]);

  // Fetch cart from Supabase
  const fetchCart = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from("cart_items")
      .select("product_id, quantity")
      .eq("user_id", uid);

    if (data && data.length > 0) {
      // We need to resolve product details from the local products data
      // For now, store product_id + quantity and resolve on the client
      const { products } = await import("@/data/products");
      const resolved: CartItem[] = data
        .map((row) => {
          const product = products.find((p) => p.id === row.product_id);
          if (!product) return null;
          return { product, quantity: row.quantity };
        })
        .filter(Boolean) as CartItem[];
      setItems(resolved);
      saveLocalCart(resolved);
    } else {
      setItems([]);
      saveLocalCart([]);
    }
  }, []);

  // Sync a cart item to Supabase
  const syncToSupabase = useCallback(async (productId: string, quantity: number) => {
    const uid = userIdRef.current;
    if (!uid) return;

    if (quantity <= 0) {
      await supabase.from("cart_items").delete().eq("user_id", uid).eq("product_id", productId);
    } else {
      await supabase.from("cart_items").upsert(
        { user_id: uid, product_id: productId, quantity, updated_at: new Date().toISOString() },
        { onConflict: "user_id,product_id" }
      );
    }
  }, []);

  // Clear all Supabase cart items
  const clearSupabaseCart = useCallback(async () => {
    const uid = userIdRef.current;
    if (!uid) return;
    await supabase.from("cart_items").delete().eq("user_id", uid);
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        await fetchCart(session.user.id);
      } else {
        // Guest: load from localStorage
        setItems(getLocalCart());
      }
      setInitialized(true);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUserId(session.user.id);
        // Merge local cart into Supabase before fetching
        const localCart = getLocalCart();
        if (localCart.length > 0) {
          for (const item of localCart) {
            await supabase.from("cart_items").upsert(
              { user_id: session.user.id, product_id: item.product.id, quantity: item.quantity, updated_at: new Date().toISOString() },
              { onConflict: "user_id,product_id" }
            );
          }
          localStorage.removeItem(CART_STORAGE_KEY);
        }
        await fetchCart(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUserId(null);
        setItems(getLocalCart());
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchCart]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let next: CartItem[];
      if (existing) {
        next = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        next = [...prev, { product, quantity }];
      }
      saveLocalCart(next);
      syncToSupabase(product.id, existing ? existing.quantity + quantity : quantity);
      return next;
    });
  }, [syncToSupabase]);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.product.id !== productId);
      saveLocalCart(next);
      syncToSupabase(productId, 0);
      return next;
    });
  }, [syncToSupabase]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => {
        const next = prev.filter((item) => item.product.id !== productId);
        saveLocalCart(next);
        syncToSupabase(productId, 0);
        return next;
      });
      return;
    }
    setItems((prev) => {
      const next = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      saveLocalCart(next);
      syncToSupabase(productId, quantity);
      return next;
    });
  }, [syncToSupabase]);

  const clearCart = useCallback(() => {
    setItems([]);
    saveLocalCart([]);
    clearSupabaseCart();
  }, [clearSupabaseCart]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (!initialized) return null;

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

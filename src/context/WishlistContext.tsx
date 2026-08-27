"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { Product } from "@/data/types";
import { supabase } from "@/lib/supabase";

interface WishlistContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "golden_grace_wishlist";

function getLocalWishlist(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalWishlist(items: Product[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => { userIdRef.current = userId; }, [userId]);

  const fetchWishlist = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from("wishlist_items")
      .select("product_id")
      .eq("user_id", uid);

    if (data && data.length > 0) {
      const { products } = await import("@/data/products");
      const resolved = data
        .map((row) => products.find((p) => p.id === row.product_id))
        .filter(Boolean) as Product[];
      setItems(resolved);
      saveLocalWishlist(resolved);
    } else {
      setItems([]);
      saveLocalWishlist([]);
    }
  }, []);

  const syncToSupabase = useCallback(async (productId: string, action: "add" | "remove") => {
    const uid = userIdRef.current;
    if (!uid) return;

    if (action === "remove") {
      await supabase.from("wishlist_items").delete().eq("user_id", uid).eq("product_id", productId);
    } else {
      await supabase.from("wishlist_items").insert({ user_id: uid, product_id: productId });
    }
  }, []);

  const clearSupabaseWishlist = useCallback(async () => {
    const uid = userIdRef.current;
    if (!uid) return;
    await supabase.from("wishlist_items").delete().eq("user_id", uid);
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        await fetchWishlist(session.user.id);
      } else {
        setItems(getLocalWishlist());
      }
      setInitialized(true);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUserId(session.user.id);
        // Merge local wishlist into Supabase
        const local = getLocalWishlist();
        if (local.length > 0) {
          for (const product of local) {
            await supabase.from("wishlist_items").insert(
              { user_id: session.user.id, product_id: product.id }
            ).select(); // ignore conflicts
          }
          localStorage.removeItem(WISHLIST_STORAGE_KEY);
        }
        await fetchWishlist(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUserId(null);
        setItems(getLocalWishlist());
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchWishlist]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      const next = [...prev, product];
      saveLocalWishlist(next);
      syncToSupabase(product.id, "add");
      return next;
    });
  }, [syncToSupabase]);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      saveLocalWishlist(next);
      syncToSupabase(productId, "remove");
      return next;
    });
  }, [syncToSupabase]);

  const isInWishlist = useCallback(
    (productId: string) => items.some((p) => p.id === productId),
    [items]
  );

  if (!initialized) return null;

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, totalItems: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}

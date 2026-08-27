"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
}

interface Order {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number; image?: string }[];
  total: number;
  status: string;
  shipping_address?: Record<string, string>;
  payment_method?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  supabaseUser: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  orders: Order[];
  refreshOrders: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  const supabaseUserRef = useRef<User | null>(null);
  const userRef = useRef<UserProfile | null>(null);

  useEffect(() => { supabaseUserRef.current = supabaseUser; }, [supabaseUser]);
  useEffect(() => { userRef.current = user; }, [user]);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) return;

      setUser((prev) => ({
        id: prev?.id || supabaseUserRef.current?.id,
        name: data.full_name || "",
        email: prev?.email || supabaseUserRef.current?.email || "",
        phone: data.phone || "",
      }));
    } catch {
      // Table might not exist yet — that's ok
    }
  }, []);

  const fetchOrders = useCallback(async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_email", email)
        .order("created_at", { ascending: false });

      if (error || !data) return;

      setOrders(data.map((o: Record<string, unknown>) => ({
        id: o.id as string,
        date: new Date(o.created_at as string).toLocaleDateString("en-IN"),
        items: (o.items as { name: string; quantity: number; price: number; image?: string }[]) || [],
        total: o.total as number,
        status: (o.status as string) || "Processing",
        shipping_address: o.shipping_address as Record<string, string> | undefined,
        payment_method: o.payment_method as string | undefined,
      })));
    } catch {
      // Table might not exist
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    const currentUser = supabaseUserRef.current;
    if (currentUser?.email) {
      await fetchOrders(currentUser.email);
    }
  }, [fetchOrders]);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    if (data.user) {
      setSupabaseUser(data.user);
      setUser({
        id: data.user.id,
        name: "",
        email: data.user.email || "",
        phone: "",
      });
      await fetchProfile(data.user.id);
      await fetchOrders(data.user.email || data.user.id);
    }
    return {};
  }, [fetchProfile, fetchOrders]);

  const signup = useCallback(async (name: string, email: string, phone: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone },
      },
    });
    if (error) return { error: error.message };
    if (data.user) {
      setSupabaseUser(data.user);
      setUser({ id: data.user.id, name, email, phone });

      // Try to create/update profile — don't let this fail the signup
      try {
        await supabase.from("user_profiles").upsert({
          id: data.user.id,
          full_name: name,
          phone,
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" });
      } catch {
        // Table might not exist — profile will be created when table is set up
      }
    }
    return {};
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setSupabaseUser(null);
    setUser(null);
    setOrders([]);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/login`,
    });
    if (error) return { error: error.message };
    return {};
  }, []);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    const currentUser = supabaseUserRef.current;
    if (!currentUser) return;
    setUser((prev) => prev ? { ...prev, ...data } : null);
    try {
      await supabase.from("user_profiles").upsert({
        id: currentUser.id,
        full_name: data.name || userRef.current?.name,
        phone: data.phone || userRef.current?.phone,
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" });
    } catch {
      // Table might not exist
    }
  }, []);

  // Initialize: check session on mount
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSupabaseUser(session.user);
          setUser({
            id: session.user.id,
            name: "",
            email: session.user.email || "",
            phone: "",
          });
          await fetchProfile(session.user.id);
          await fetchOrders(session.user.email || session.user.id);
        }
      } catch {
        // Auth not configured
      }
      setLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setSupabaseUser(session.user);
        setUser({
          id: session.user.id,
          name: "",
          email: session.user.email || "",
          phone: "",
        });
        await fetchProfile(session.user.id);
        await fetchOrders(session.user.email || session.user.id);
      } else if (event === "SIGNED_OUT") {
        setSupabaseUser(null);
        setUser(null);
        setOrders([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, fetchOrders]);

  return (
    <AuthContext.Provider value={{
      user, supabaseUser, isLoggedIn: !!supabaseUser, loading,
      login, signup, logout, updateProfile, resetPassword, orders, refreshOrders,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

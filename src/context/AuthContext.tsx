"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  phone: string;
}

interface Order {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "Delivered" | "In Transit" | "Processing" | "Cancelled";
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, phone: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  orders: Order[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockOrders: Order[] = [
  {
    id: "BS-A1B2C3D4",
    date: "2026-08-20",
    items: [{ name: "Eternal Diamond Solitaire", quantity: 1, price: 45999 }],
    total: 45999,
    status: "Delivered",
  },
  {
    id: "BS-E5F6G7H8",
    date: "2026-08-15",
    items: [
      { name: "Diamond Heart Pendant", quantity: 1, price: 24999 },
      { name: "Gold Jhumka Earrings", quantity: 2, price: 15999 },
    ],
    total: 56997,
    status: "In Transit",
  },
  {
    id: "BS-I9J0K1L2",
    date: "2026-08-10",
    items: [{ name: "Tennis Bracelet", quantity: 1, price: 42999 }],
    total: 42999,
    status: "Processing",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders] = useState<Order[]>(mockOrders);

  const login = useCallback((email: string, _password: string) => {
    setUser({
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      phone: "9876543210",
    });
    return true;
  }, []);

  const signup = useCallback((name: string, email: string, phone: string, _password: string) => {
    setUser({ name, email, phone });
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout, updateProfile, orders }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

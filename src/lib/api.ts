import { Product } from "@/data/types";

const API_BASE = typeof window !== "undefined" ? "" : "http://localhost:3000";

// Fetch all products from Supabase API (with fallback to mock data on server)
export async function fetchAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/api/products`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("API fetch failed");
    return await res.json();
  } catch {
    // Fallback: import mock data on server side
    const { products } = await import("@/data/products");
    return products;
  }
}

// Fetch single product by ID from API
export async function fetchProductById(id: string): Promise<Product | undefined> {
  try {
    const res = await fetch(`${API_BASE}/api/products/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return undefined;
    return await res.json();
  } catch {
    const { getProductById } = await import("@/data/products");
    return getProductById(id);
  }
}

// Search products via API
export async function fetchSearchProducts(query: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/api/products`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("API fetch failed");
    const all: Product[] = await res.json();
    const lower = query.toLowerCase();
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.tags.some((t) => t.includes(lower)) ||
        p.category.toLowerCase().includes(lower)
    );
  } catch {
    const { searchProducts } = await import("@/data/products");
    return searchProducts(query);
  }
}

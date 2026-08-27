import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for Supabase
export interface DBProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  category_slug: string;
  price: number;
  original_price?: number;
  discount?: number;
  description: string;
  short_description: string;
  images: string[];
  metal: string;
  metal_weight: string;
  stone?: string;
  stone_weight?: string;
  sku: string;
  rating: number;
  review_count: number;
  in_stock: boolean;
  is_new?: boolean;
  is_bestseller?: boolean;
  tags: string[];
  created_at: string;
}

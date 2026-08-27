import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
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

// Convert DB product to app Product type
export function dbToProduct(db: DBProduct) {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    category: db.category,
    categorySlug: db.category_slug,
    price: db.price,
    originalPrice: db.original_price,
    discount: db.discount,
    description: db.description,
    shortDescription: db.short_description,
    images: db.images,
    metal: db.metal,
    metalWeight: db.metal_weight,
    stone: db.stone,
    stoneWeight: db.stone_weight,
    sku: db.sku,
    rating: db.rating,
    reviewCount: db.review_count,
    inStock: db.in_stock,
    isNew: db.is_new,
    isBestseller: db.is_bestseller,
    tags: db.tags,
  };
}

// Convert app Product type to DB format
export function productToDB(product: Record<string, unknown>) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    category_slug: product.categorySlug,
    price: product.price,
    original_price: product.originalPrice,
    discount: product.discount,
    description: product.description,
    short_description: product.shortDescription,
    images: product.images,
    metal: product.metal,
    metal_weight: product.metalWeight,
    stone: product.stone,
    stone_weight: product.stoneWeight,
    sku: product.sku,
    rating: product.rating,
    review_count: product.reviewCount,
    in_stock: product.inStock,
    is_new: product.isNew,
    is_bestseller: product.isBestseller,
    tags: product.tags,
  };
}

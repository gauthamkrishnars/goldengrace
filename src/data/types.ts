export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  shortDescription: string;
  images: string[];
  metal: string;
  metalWeight: string;
  stone?: string;
  stoneWeight?: string;
  sku: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface Category {
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
}

export interface FilterOption {
  label: string;
  value: string;
  count: number;
}

-- Golden Grace E-Commerce Database Schema
-- Run this in your Supabase SQL Editor

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  discount INTEGER,
  description TEXT NOT NULL,
  short_description TEXT,
  images TEXT[] DEFAULT '{}',
  metal TEXT NOT NULL,
  metal_weight TEXT,
  stone TEXT,
  stone_weight TEXT,
  sku TEXT UNIQUE NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  user_name TEXT,
  user_phone TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'Processing',
  shipping_address JSONB,
  payment_method TEXT DEFAULT 'razorpay',
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Authenticated Delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON orders(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

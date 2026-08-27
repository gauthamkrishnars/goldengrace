"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";

export default function WishlistPage() {
  const { items, removeItem, totalItems } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (productId: string) => {
    const product = items.find((p) => p.id === productId);
    if (product) {
      addItem(product);
      removeItem(productId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalNav />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          My Wishlist ({totalItems} {totalItems === 1 ? "item" : "items"})
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-gray-400 mb-6">Save your favorite pieces here for later</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand/90 transition-colors"
            >
              Explore Collections <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {items.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                {/* Wishlist Actions Overlay */}
                <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => handleMoveToCart(product.id)}
                    className="p-2 bg-brand text-white rounded-full shadow-md hover:bg-brand/90 transition-colors"
                    title="Move to Cart"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="p-2 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50 transition-colors"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suggestion */}
        {items.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-brand text-sm font-medium hover:underline"
            >
              Continue Exploring <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

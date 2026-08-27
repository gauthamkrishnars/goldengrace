"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  const savings = items.reduce(
    (sum, item) => sum + (item.product.originalPrice ? (item.product.originalPrice - item.product.price) * item.quantity : 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalNav />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-sm text-gray-400 mb-6">Discover our exquisite jewellery collections</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand/90 transition-colors"
            >
              Start Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4"
                >
                  <Link href={`/product/${item.product.id}`} className="flex-shrink-0">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-50">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.product.id}`}>
                      <h3 className="text-sm font-semibold text-gray-800 hover:text-brand transition-colors line-clamp-1">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">{item.product.shortDescription}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-50 transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3.5 w-3.5 text-gray-500" />
                        </button>
                        <span className="px-3 text-sm font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-50 transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="h-3.5 w-3.5 text-gray-500" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors mt-2"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Order Summary</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Total Savings</span>
                      <span>-{formatPrice(savings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-4 pt-4">
                  <div className="flex justify-between">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-base font-bold text-gray-900">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full mt-5 py-3 bg-brand text-white text-sm font-semibold rounded-xl text-center hover:bg-brand/90 transition-colors"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/"
                  className="block w-full mt-3 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl text-center hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

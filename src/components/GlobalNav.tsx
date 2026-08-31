"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MapPin, ShoppingCart, Search, ChevronRight, Home, Heart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { categories } from "@/data/products";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Gold", href: "/category/bangles" },
  { label: "Diamond", href: "/category/rings" },
  { label: "Solitaire", href: "/category/rings" },
  { label: "Gemstone", href: "/category/pendants" },
  { label: "Wedding", href: "/category/necklaces" },
  { label: "Gifts", href: "/category/bracelets" },
];

export default function GlobalNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistTotal } = useWishlist();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 max-w-7xl mx-auto">
          {/* Left: Hamburger + Home (Home hidden on mobile) */}
          <div className="flex items-center gap-0.5 md:gap-1 shrink-0">
            <button
              className="p-1.5 md:p-2 -ml-1 md:-ml-2 rounded-md hover:bg-gray-50 transition-colors"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 md:h-6 w-5 md:w-6 text-gray-700" strokeWidth={1.5} />
            </button>
            <Link
              href="/"
              className="p-1.5 md:p-2 rounded-md hover:bg-gray-50 transition-colors hidden md:block"
              aria-label="Home"
            >
              <Home className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
            </Link>
          </div>

          {/* Center: Brand Logo */}
          <Link href="/" className="flex-1 flex justify-center">
            <h1 className="font-serif text-base md:text-2xl font-bold tracking-wide text-gray-800 truncate">
              GOLDEN GRACE - DESIGNED BY GAUTHAM
            </h1>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-0 shrink-0">
            <Link
              href="/search"
              className="p-1.5 md:p-2 rounded-md hover:bg-gray-50 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
            </Link>
            <Link
              href="/wishlist"
              className="relative p-1.5 md:p-2 rounded-md hover:bg-gray-50 transition-colors hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
              {wishlistTotal > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistTotal}
                </span>
              )}
            </Link>
            <Link
              href="/profile"
              className="p-1.5 md:p-2 rounded-md hover:bg-gray-50 transition-colors"
              aria-label="My Account"
            >
              <User className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
            </Link>
            <Link
              href="/cart"
              className="relative p-1.5 md:p-2 rounded-md hover:bg-gray-50 transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent-rose-gold text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Desktop Category Nav */}
        <nav className="hidden md:block border-t border-gray-50 bg-white">
          <div className="flex items-center justify-center gap-6 px-4 py-2 max-w-7xl mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm transition-colors font-medium ${
                  link.label === "Home" ? "text-brand font-bold" : "text-gray-600 hover:text-brand"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-gray-800">GOLDEN GRACE</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Home Link */}
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5 text-brand" />
              <span className="text-sm text-gray-700 font-semibold">Home</span>
            </Link>

            {/* Navigation Links */}
            <nav className="py-2">
              <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Shop By Category
              </p>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-sm text-gray-700 font-medium">{cat.name}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </nav>

            <div className="border-t border-gray-100 py-2">
              <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Quick Links
              </p>
              <Link
                href="/search"
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-sm text-gray-700">Search</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-sm text-gray-700">Wishlist</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link
                href="/cart"
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-sm text-gray-700">Cart</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link
                href="/profile"
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-sm text-gray-700">My Account</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

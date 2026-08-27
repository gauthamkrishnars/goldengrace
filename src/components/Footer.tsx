"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { categories } from "@/data/products";

export default function Footer() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);

  const handleCopyrightClick = useCallback(() => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      setClickCount(0);
      router.push("/admin");
    }
  }, [clickCount, router]);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="font-serif text-2xl font-bold text-white mb-3 inline-block">
              GOLDEN GRACE
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-sm">
              Your most trusted online jewellery brand. Every piece is BIS hallmarked and comes with a lifetime exchange guarantee.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {["Facebook", "Instagram", "Twitter", "YouTube"].map((social) => (
                <a
                  key={social}
                  href={`https://${social.toLowerCase()}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-xs text-gray-400 hover:bg-brand hover:text-white transition-colors"
                  aria-label={social}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/search" className="text-sm text-gray-400 hover:text-white transition-colors">Search</Link></li>
              <li><Link href="/cart" className="text-sm text-gray-400 hover:text-white transition-colors">Cart</Link></li>
              <li><Link href="/wishlist" className="text-sm text-gray-400 hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link href="/profile" className="text-sm text-gray-400 hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/profile" className="text-sm text-gray-400 hover:text-white transition-colors">Track Orders</Link></li>
              <li><Link href="/cart" className="text-sm text-gray-400 hover:text-white transition-colors">Shopping Cart</Link></li>
              <li><Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign In / Register</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-xs text-gray-500 select-none"
            onClick={handleCopyrightClick}
            title={clickCount > 0 ? `${5 - clickCount} more clicks...` : ""}
          >
            &copy; 2026 Golden Grace. All rights reserved. Made by{" "}
            <span className="text-gray-400 font-medium cursor-default">DevCore Studio</span>.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>BIS Hallmarked</span>
            <span>•</span>
            <span>IGI Certified</span>
            <span>•</span>
            <span>Lifetime Exchange</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

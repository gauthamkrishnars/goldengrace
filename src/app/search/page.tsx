"use client";

import { useState, useMemo, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Product } from "@/data/types";
import ProductCard from "@/components/product/ProductCard";
import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => setAllProducts(data))
      .catch(() => {});
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return allProducts;
    const lower = query.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.tags.some((t) => t.includes(lower)) ||
        p.category.toLowerCase().includes(lower)
    );
  }, [query, allProducts]);

  return (
    <div className="min-h-screen bg-white">
      <GlobalNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for jewellery, metals, styles..."
              className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 pl-12 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/40 transition-all shadow-sm"
              autoFocus
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Diamond", "Gold", "Ring", "Necklace", "Pendant", "Earring"].map((tag) => (
              <button key={tag} onClick={() => setQuery(tag)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-4">
            {query.trim() ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"` : `Showing all ${results.length} products`}
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {results.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="text-center py-16">
              <SearchIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No products found. Try a different search term.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

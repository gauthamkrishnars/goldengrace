"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, Grid3X3, LayoutList, ChevronDown } from "lucide-react";
import { categories, getProductsByCategory, products as allProducts } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";

type SortOption = "featured" | "price-low" | "price-high" | "newest" | "rating";

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Newest First", value: "newest" },
  { label: "Top Rated", value: "rating" },
];

const metalFilters = ["All", "18K White Gold", "14K Rose Gold", "14K Yellow Gold", "22K Yellow Gold"];

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const category = categories.find((c) => c.slug === slug);
  const baseProducts = category ? getProductsByCategory(slug) : allProducts;

  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [selectedMetal, setSelectedMetal] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = selectedMetal === "All"
      ? [...baseProducts]
      : baseProducts.filter((p) => p.metal === selectedMetal);

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }
    return result;
  }, [baseProducts, sortBy, selectedMetal]);

  return (
    <div className="min-h-screen bg-white">
      <GlobalNav />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <nav className="text-xs text-gray-400">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-700">{category?.name || "All Products"}</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800">
          {category?.name || "All Products"}
        </h1>
        {category && (
          <p className="text-sm text-gray-500 mt-1">{category.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">{filteredProducts.length} products found</p>
      </div>

      {/* Sort & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/20 cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Metal Type</p>
            <div className="flex flex-wrap gap-2">
              {metalFilters.map((metal) => (
                <button
                  key={metal}
                  onClick={() => setSelectedMetal(metal)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                    selectedMetal === metal
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {metal}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No products found matching your filters.</p>
            <button
              onClick={() => setSelectedMetal("All")}
              className="mt-3 text-brand text-sm font-medium hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

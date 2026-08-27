import GlobalNav from "@/components/GlobalNav";
import HeroSection from "@/components/HeroSection";
import SearchInput from "@/components/SearchInput";
import CategoryGrid from "@/components/CategoryGrid";
import CuratedCollections from "@/components/CuratedCollections";
import Trendspotting from "@/components/Trendspotting";
import GoldMineBanner from "@/components/GoldMineBanner";
import FloatingButton from "@/components/FloatingButton";
import Footer from "@/components/Footer";
import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";

export default function Home() {
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <GlobalNav />

      <main className="flex-1">
        <HeroSection />
        <SearchInput />
        <CategoryGrid />

        {/* Bestsellers */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-gray-800">Bestsellers</h2>
            <Link href="/category/rings" className="text-brand text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <CuratedCollections />
        <Trendspotting />
        <GoldMineBanner />
      </main>

      <Footer />
      <FloatingButton />
    </div>
  );
}

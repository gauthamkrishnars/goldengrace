"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=600&fit=crop&q=80",
    title: "Eternal Brilliance",
    subtitle: "Discover our handcrafted diamond collection",
    cta: "Shop Diamonds",
    href: "/category/rings",
  },
  {
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&h=600&fit=crop&q=80",
    title: "Gold Legacy",
    subtitle: "Timeless 22K gold jewellery for every occasion",
    cta: "Shop Gold",
    href: "/category/bangles",
  },
  {
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=600&fit=crop&q=80",
    title: "Gemstone Magic",
    subtitle: "Vivid rubies, sapphires & emeralds set in gold",
    cta: "Shop Gemstones",
    href: "/category/pendants",
  },
  {
    image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=1200&h=600&fit=crop&q=80",
    title: "Bridal Collection",
    subtitle: "Make your special day truly unforgettable",
    cta: "Shop Bridal",
    href: "/category/necklaces",
  },
];

export default function GoldMineBanner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="relative rounded-2xl overflow-hidden bg-gray-900 group">
        {/* Slides */}
        <div className="relative w-full" style={{ aspectRatio: "16/7" }}>
          {slides.map((s, i) => (
            <div
              key={s.title}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                i === current ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="px-8 md:px-14 max-w-lg">
              <h2 className="font-serif text-white text-2xl md:text-4xl font-bold tracking-tight leading-tight">
                {slide.title}
              </h2>
              <p className="text-white/80 text-sm md:text-base mt-2 leading-relaxed">
                {slide.subtitle}
              </p>
              <Link
                href={slide.href}
                className="inline-block mt-4 px-6 py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-md"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? "bg-white w-6" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

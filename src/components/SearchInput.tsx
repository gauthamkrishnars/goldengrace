"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <section className="w-full px-4 py-3 max-w-7xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for jewellery..."
          className="w-full bg-white border border-gray-200 rounded-md px-4 py-3 pl-11 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/40 transition-all"
        />
        <button type="submit" className="absolute left-0 top-0 bottom-0 px-3.5 flex items-center">
          <Search className="h-4 w-4 text-gray-400" />
        </button>
      </form>
    </section>
  );
}

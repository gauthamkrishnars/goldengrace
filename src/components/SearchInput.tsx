import { Search } from "lucide-react";

export default function SearchInput() {
  return (
    <section className="w-full px-4 py-3 max-w-7xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search by Category"
          className="w-full bg-white border border-gray-200 rounded-md px-4 py-3 pl-11 text-sm text-gray-400 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/40 transition-all"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    </section>
  );
}

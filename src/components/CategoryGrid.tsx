import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Rings",
    slug: "rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop&q=80",
    alt: "Diamond engagement ring",
  },
  {
    name: "Pendants",
    slug: "pendants",
    image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=300&h=300&fit=crop&q=80",
    alt: "Diamond heart pendant",
  },
  {
    name: "Earrings",
    slug: "earrings",
    image: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=300&h=300&fit=crop&q=80",
    alt: "Gold and diamond earrings",
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=300&h=300&fit=crop&q=80",
    alt: "Gold chain necklace",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop&q=80",
    alt: "Gold bracelet",
  },
  {
    name: "Bangles",
    slug: "bangles",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=300&h=300&fit=crop&q=80",
    alt: "Gold bangles",
  },
];

export default function CategoryGrid() {
  return (
    <section className="w-full py-4 max-w-7xl mx-auto">
      <div className="flex overflow-x-auto scrollbar-hide gap-4 px-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/category/${category.slug}`}
            className="flex-shrink-0 w-[120px] md:w-[140px] flex flex-col items-center gap-2 group"
          >
            <div className="w-full aspect-square bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 group-hover:shadow-md transition-shadow">
              <Image
                src={category.image}
                alt={category.alt}
                width={140}
                height={140}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-xs text-gray-700 text-center font-medium leading-tight group-hover:text-brand transition-colors">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

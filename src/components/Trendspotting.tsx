import Image from "next/image";

const trendingItems = [
  {
    title: "Coveted Styles",
    subtitle: "A curated selection of our most coveted jewels.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop&q=80",
    alt: "Ornate bird pendant with gemstones",
  },
  {
    title: "Golden Grace Man",
    subtitle: "Shop the perfect pieces to enhance your man's unique style.",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop&q=80",
    alt: "Men's gold and leather jewellery",
  },
];

export default function Trendspotting() {
  return (
    <section className="w-full bg-accent-pink py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-center font-serif text-accent-rose-gold text-xl md:text-2xl font-bold mb-6">
          Trendspotting
        </h2>

        {/* Horizontal Scroll Cards */}
        <div className="flex overflow-x-auto scrollbar-hide gap-4">
          {trendingItems.map((item) => (
            <div
              key={item.title}
              className="flex-shrink-0 w-[280px] md:w-[340px] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
            >
              <div className="relative w-full h-48 md:h-56">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 280px, 340px"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm mt-1 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

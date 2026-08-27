import Image from "next/image";

const collections = [
  {
    title: "The Curve",
    subtitle: "Every Turn, a New Shine",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=400&fit=crop&q=80",
    alt: "Liquid gold earrings on warm sandy background",
  },
  {
    title: "GEMPHONY",
    subtitle: "Every Color is an Emotion",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=400&fit=crop&q=80",
    alt: "Colorful gemstones on flowing pastel silk",
  },
];

export default function CuratedCollections() {
  return (
    <section className="w-full py-6 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {collections.map((collection) => (
          <div
            key={collection.title}
            className="relative rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300"
            style={{ aspectRatio: "4/3" }}
          >
            <Image
              src={collection.image}
              alt={collection.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            {/* Text Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
              <h3 className="font-serif text-white text-sm md:text-lg font-bold leading-tight">
                {collection.title}
              </h3>
              <p className="text-white/80 text-xs md:text-sm mt-0.5">
                {collection.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

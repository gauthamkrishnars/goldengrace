import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
      <Image
        src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&h=900&fit=crop&q=80"
        alt="Diamond heart pendant on rose petals"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
    </section>
  );
}

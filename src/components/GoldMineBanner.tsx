import Image from "next/image";

export default function GoldMineBanner() {
  return (
    <section className="w-full py-8 max-w-7xl mx-auto px-4">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-accent-pink via-white to-accent-pink">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=1200&h=600&fit=crop&q=80"
            alt="Rose gold and diamond rings"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center py-10 px-6 md:py-14">
          <h2 className="font-serif text-accent-rose-gold text-3xl md:text-5xl font-bold tracking-tight">
            Gold Mine
          </h2>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-serif text-accent-rose-gold text-4xl md:text-6xl font-bold">
              10+1
            </span>
          </div>
          <p className="text-accent-rose-gold/80 text-sm md:text-base font-medium mt-2 tracking-wide uppercase">
            Monthly Installment Plan
          </p>
          <p className="text-gray-600 text-xs md:text-sm mt-3 max-w-md leading-relaxed">
            Pay 10 installments and enjoy 100% savings on the 11th Month!
          </p>
          <button className="mt-5 px-6 py-2.5 bg-accent-rose-gold text-white text-sm font-semibold rounded-full hover:bg-accent-rose-gold/90 transition-colors shadow-md">
            Start Saving Now
          </button>
        </div>
      </div>
    </section>
  );
}

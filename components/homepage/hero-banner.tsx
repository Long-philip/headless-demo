import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="relative w-full bg-gradient-to-br from-brand/90 via-brand to-emerald-800 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-24 md:py-32 lg:py-40">
        <div className="flex flex-col items-center text-center text-white">
          <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-tight max-w-3xl">
            Simple Swaps. Less Waste. No Guesswork.
          </h1>
          <p className="mt-4 text-lg max-w-xl opacity-90">
            Discover sustainable products and subscription plans for everyday
            living.
          </p>
          <Link
            href="/search"
            className="mt-8 bg-white text-brand px-8 py-4 rounded-[14px] font-medium text-base hover:bg-white/90 transition-colors"
          >
            Shop Best Sellers
          </Link>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
    </section>
  );
}

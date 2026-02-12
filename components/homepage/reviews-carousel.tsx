"use client";

const REVIEWS = [
  {
    name: "Sarah M.",
    text: "Love the quality and sustainability focus! Every product I've tried has exceeded my expectations.",
    rating: 5,
  },
  {
    name: "James K.",
    text: "Great products, fast shipping. The subscription option makes it so convenient.",
    rating: 5,
  },
  {
    name: "Emily R.",
    text: "Finally, eco-friendly products that actually work! No more guesswork.",
    rating: 5,
  },
  {
    name: "Michael T.",
    text: "The subscription box is amazing. Every month I discover something new and useful.",
    rating: 5,
  },
  {
    name: "Lisa W.",
    text: "Love this new direction! The products are actually useful and affordable.",
    rating: 5,
  },
  {
    name: "David H.",
    text: "Sustainable shopping made easy. The quality is consistently excellent.",
    rating: 4,
  },
];

export function ReviewsCarousel() {
  const duplicatedReviews = [...REVIEWS, ...REVIEWS, ...REVIEWS];

  return (
    <section className="py-16 overflow-hidden">
      <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-center mb-10">
        What Our Customers Say
      </h2>
      <div className="relative flex gap-6 overflow-x-hidden">
        <div className="flex gap-6 animate-[scroll_30s_linear_infinite]">
          {duplicatedReviews.map((review, i) => (
            <div
              key={i}
              className="flex-none w-80 rounded-[14px] border border-brand/20 bg-white p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold text-sm">
                  {review.name[0]}
                </div>
                <div>
                  <p className="font-medium text-sm">{review.name}</p>
                  <div className="flex text-yellow-400 text-xs">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-black/70 leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
      `}</style>
    </section>
  );
}

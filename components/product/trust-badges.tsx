import Image from "next/image";
import cartImage from "app/asset/cart-image.avif";
import labImage from "app/asset/lab-image.avif";
import leafImage from "app/asset/leaf-image.png";
import verifyImage from "app/asset/verify-image.avif";

const badges = [
  {
    image: cartImage,
    alt: "Cart",
    text: "We pick products like we're buying for our own family (because we are).",
  },
  {
    image: labImage,
    alt: "Lab",
    text: "Fair prices, no nasties — and real suppliers get paid properly.",
  },
  {
    image: leafImage,
    alt: "Leaf",
    text: "Fresh from our suppliers, packed to stay cool 'til you get home.",
  },
  {
    image: verifyImage,
    alt: "Verify",
    text: "100% happiness guarantee — if you receive any item you're unhappy with, we'll gladly replace it for you.",
  },
];

export function TrustBadges() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3">
      {badges.map((badge, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-3 rounded-xl border border-neutral-200 p-5 text-center"
        >
          <Image
            src={badge.image}
            alt={badge.alt}
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <p className="text-xs leading-relaxed text-black/60">{badge.text}</p>
        </div>
      ))}
    </div>
  );
}

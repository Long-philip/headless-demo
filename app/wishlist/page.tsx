import Footer from "components/layout/footer";
import type { Metadata } from "next";
import { WishlistContent } from "./wishlist-content";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved products.",
};

export default function WishlistPage() {
  return (
    <>
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 pb-4">
        <h1 className="mb-8 text-3xl font-bold">Wishlist</h1>
        <WishlistContent />
      </div>
      <Footer />
    </>
  );
}

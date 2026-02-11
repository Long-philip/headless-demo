"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import type { Product } from "lib/shopify/types";
import { useWishlist } from "./wishlist-context";

export function WishlistButton({ product }: { product: Product }) {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  return (
    <button
      type="button"
      onClick={() => {
        if (isWishlisted) {
          removeItem(product.id);
        } else {
          addItem(product);
        }
      }}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white transition-colors hover:border-red-300 hover:bg-red-50 dark:border-neutral-700 dark:bg-black dark:hover:border-red-600 dark:hover:bg-red-900/20"
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isWishlisted ? (
        <HeartSolidIcon className="h-5 w-5 text-red-500" />
      ) : (
        <HeartIcon className="h-5 w-5 text-neutral-500" />
      )}
    </button>
  );
}

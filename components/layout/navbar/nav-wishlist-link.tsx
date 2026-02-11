"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { useWishlist } from "components/wishlist/wishlist-context";
import Link from "next/link";

export function NavWishlistLink() {
  const { itemCount } = useWishlist();

  return (
    <Link
      href="/wishlist"
      className="relative text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-300"
      aria-label="Wishlist"
    >
      <HeartIcon className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-medium text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

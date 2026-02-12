"use client";

import { GridTileImage } from "components/grid/tile";
import Price from "components/price";
import { useWishlist } from "components/wishlist/wishlist-context";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function WishlistContent() {
  const { items, removeItem } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center">
        <p className="text-lg text-neutral-500 dark:text-neutral-400">
          Your wishlist is empty.
        </p>
        <Link
          href="/search"
          className="mt-4 rounded-md bg-brand px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.id} className="group relative">
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-neutral-500 hover:bg-white hover:text-red-500 dark:bg-black/80 dark:hover:bg-black"
            aria-label={`Remove ${item.title} from wishlist`}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
          <Link
            href={`/product/${item.handle}`}
            className="block aspect-square overflow-hidden"
          >
            <GridTileImage
              alt={item.title}
              label={{
                title: item.title,
                amount: item.price,
                currencyCode: item.currencyCode,
              }}
              src={item.featuredImageUrl}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </div>
      ))}
    </div>
  );
}

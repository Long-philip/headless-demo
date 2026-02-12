"use client";

import Image from "next/image";
import Link from "next/link";
import Price from "components/price";
import { Product } from "lib/shopify/types";
import { useCart } from "components/cart/cart-context";
import { addItem } from "components/cart/actions";
import { useActionState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const { addCartItem } = useCart();
  const [message, formAction] = useActionState(addItem, null);

  const defaultVariant = product.variants[0];
  const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
  const maxPrice = parseFloat(product.priceRange.maxVariantPrice.amount);
  const isOnSale = maxPrice > minPrice;
  const isSoldOut = !product.availableForSale;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[14px] border border-brand/20 bg-white transition-shadow hover:shadow-lg">
      <Link
        href={`/product/${product.handle}`}
        className="relative aspect-square overflow-hidden"
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="h-full w-full bg-neutral-100" />
        )}
        {isOnSale && !isSoldOut && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Sale
          </span>
        )}
        {isSoldOut && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-black text-white text-sm font-bold px-4 py-2 rounded">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-col gap-2 p-4">
        <Link href={`/product/${product.handle}`}>
          <h3 className="text-sm font-medium line-clamp-2 hover:text-brand transition-colors">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <Price
            className="text-sm font-bold"
            amount={product.priceRange.minVariantPrice.amount}
            currencyCode={product.priceRange.minVariantPrice.currencyCode}
          />
          {isOnSale && (
            <Price
              className="text-xs text-neutral-400 line-through"
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          )}
        </div>

        {!isSoldOut && defaultVariant && (
          <form
            action={async () => {
              addCartItem(defaultVariant, product);
              formAction(defaultVariant.id);
            }}
          >
            <button className="w-full mt-2 bg-brand text-white py-3 rounded-[14px] text-sm font-medium hover:bg-brand/90 transition-colors">
              Add to Cart
            </button>
            <p aria-live="polite" className="sr-only" role="status">
              {message}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

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
      <div className="relative aspect-square overflow-hidden">
        <Link
          href={`/product/${product.handle}`}
          className="block h-full w-full"
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
        {!isSoldOut && defaultVariant && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addCartItem(defaultVariant, product);
              const formData = new FormData();
              formData.append("merchandiseId", defaultVariant.id);
              formAction(defaultVariant.id);
            }}
            className="group/btn z-10 absolute bottom-3 right-3 flex h-10 items-center gap-0 rounded-full bg-white/90 backdrop-blur-sm shadow-md opacity-0 transition-all duration-300 group-hover:opacity-100 w-10 hover:w-[90px] hover:gap-1.5 px-2.5 overflow-hidden"
            aria-label="Add to cart"
          >
            <svg className="shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="text-sm font-medium whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200">Add</span>
          </button>
        )}
      </div>

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

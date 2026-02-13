"use client";

import Grid from "components/grid";
import { GridTileImage } from "components/grid/tile";
import { Product } from "lib/shopify/types";
import Link from "next/link";
import { useCart } from "components/cart/cart-context";
import { addItem } from "components/cart/actions";
import { useActionState } from "react";

function ProductGridItem({ product }: { product: Product }) {
  const { addCartItem } = useCart();
  const [message, formAction] = useActionState(addItem, null);
  const defaultVariant = product.variants[0];
  const isSoldOut = !product.availableForSale;

  return (
    <Grid.Item className="animate-fadeIn">
      <div className="group/card relative h-full w-full">
        <Link
          className="relative inline-block h-full w-full"
          href={`/product/${product.handle}`}
          prefetch={true}
        >
          <GridTileImage
            alt={product.title}
            label={{
              title: product.title,
              amount: product.priceRange.maxVariantPrice.amount,
              currencyCode: product.priceRange.maxVariantPrice.currencyCode,
            }}
            src={product.featuredImage?.url}
            fill
            sizes="(min-width: 768px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        </Link>
        {!isSoldOut && defaultVariant && (
          <button
            type="button"
            onClick={() => {
              addCartItem(defaultVariant, product);
              formAction(defaultVariant.id);
            }}
            className="group/btn z-10 absolute bottom-4 right-4 flex h-10 items-center gap-0 rounded-full bg-white/90 backdrop-blur-sm shadow-md opacity-0 transition-all duration-300 group-hover/card:opacity-100 w-10 hover:w-[90px] hover:gap-1.5 px-2.5 overflow-hidden"
            aria-label="Add to cart"
          >
            <svg
              className="shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="text-sm font-medium whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200">
              Add
            </span>
          </button>
        )}
        <p aria-live="polite" className="sr-only" role="status">
          {message}
        </p>
      </div>
    </Grid.Item>
  );
}

function FeaturedProductGridItem({ product }: { product: Product }) {
  const { addCartItem } = useCart();
  const [message, formAction] = useActionState(addItem, null);
  const defaultVariant = product.variants[0];
  const isSoldOut = !product.availableForSale;

  const hasSubscription =
    product.sellingPlanGroups && product.sellingPlanGroups.length > 0;
  const firstSellingPlan = hasSubscription
    ? product.sellingPlanGroups[0]?.sellingPlans[0]
    : null;

  const handleAddOneTime = () => {
    if (!defaultVariant) return;
    addCartItem(defaultVariant, product);
    formAction(defaultVariant.id);
  };

  const handleAddSubscription = () => {
    if (!defaultVariant) return;
    addCartItem(defaultVariant, product);
    if (firstSellingPlan) {
      formAction({
        variantId: defaultVariant.id,
        sellingPlanId: firstSellingPlan.id,
      });
    } else {
      formAction(defaultVariant.id);
    }
  };

  return (
    <Grid.Item className="animate-fadeIn">
      <div className="group/card relative h-full w-full">
        <Link
          className="relative inline-block h-full w-full"
          href={`/product/${product.handle}`}
          prefetch={true}
        >
          <GridTileImage
            alt={product.title}
            label={{
              title: product.title,
              amount: product.priceRange.maxVariantPrice.amount,
              currencyCode: product.priceRange.maxVariantPrice.currencyCode,
            }}
            src={product.featuredImage?.url}
            fill
            sizes="(min-width: 768px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        </Link>

        {/* Hover overlay with 2 purchase options */}
        {!isSoldOut && defaultVariant && (
          <div className="z-10 absolute bottom-4 right-4 flex flex-col items-end gap-2 opacity-0 translate-y-2 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:translate-y-0">
            <button
              type="button"
              onClick={handleAddSubscription}
              className="flex items-center gap-2 rounded-full bg-brand text-white px-4 py-2.5 text-xs font-semibold shadow-lg hover:bg-brand/90 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
              Subscribe
            </button>
            <button
              type="button"
              onClick={handleAddOneTime}
              className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm text-black px-4 py-2.5 text-xs font-semibold shadow-lg hover:bg-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              One-time
            </button>
          </div>
        )}

        <p aria-live="polite" className="sr-only" role="status">
          {message}
        </p>
      </div>
    </Grid.Item>
  );
}

export default function ProductGridItems({
  products,
}: {
  products: Product[];
}) {
  // First 4 products (first row) get the featured treatment
  const firstRowCount = 4;

  return (
    <>
      {products.map((product, index) =>
        index < firstRowCount ? (
          <FeaturedProductGridItem key={product.handle} product={product} />
        ) : (
          <ProductGridItem key={product.handle} product={product} />
        )
      )}
    </>
  );
}

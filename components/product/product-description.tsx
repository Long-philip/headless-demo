import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import { SubscriptionProvider } from "components/subscription/subscription-context";
import { SubscriptionWidget } from "components/subscription/subscription-widget";
import { Product } from "lib/shopify/types";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <SubscriptionProvider>
      {/* Title */}
      <h1 className="mb-2 text-4xl font-medium leading-tight lg:text-5xl">
        {product.title}
      </h1>

      {/* Price */}
      <div className="mb-6 text-lg text-black/80">
        <Price
          amount={product.priceRange.maxVariantPrice.amount}
          currencyCode={product.priceRange.maxVariantPrice.currencyCode}
        />
      </div>

      {/* Variants */}
      <VariantSelector options={product.options} variants={product.variants} />

      {/* Subscription Widget */}
      <SubscriptionWidget productHandle={product.handle} />

      {/* Add to Cart */}
      <AddToCart product={product} />

      {/* Vendor */}
      {product.tags.length > 0 && (
        <p className="mt-6 text-sm text-black/60">
          <span className="font-medium text-black/80">From:</span>{" "}
          {product.tags[0]}
        </p>
      )}

      {/* Description */}
      {product.descriptionHtml ? (
        <Prose
          className="mt-4 text-sm leading-relaxed text-black/70"
          html={product.descriptionHtml}
        />
      ) : null}
    </SubscriptionProvider>
  );
}

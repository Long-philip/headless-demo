import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import { SubscriptionProvider } from "components/subscription/subscription-context";
import { SubscriptionWidget } from "components/subscription/subscription-widget";
import { WishlistButton } from "components/wishlist/wishlist-button";
import { Product } from "lib/shopify/types";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <SubscriptionProvider>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <div className="flex items-start justify-between">
          <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
          <WishlistButton product={product} />
        </div>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      <SubscriptionWidget productHandle={product.handle} />
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}
      <AddToCart product={product} />
    </SubscriptionProvider>
  );
}

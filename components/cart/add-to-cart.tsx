"use client";

import clsx from "clsx";
import { addItem } from "components/cart/actions";
import { useSubscriptionOptional } from "components/subscription/subscription-context";
import { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useCart } from "./cart-context";

function SubmitButton({
  availableForSale,
  selectedVariantId,
  isSubscription,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  isSubscription: boolean;
}) {
  const buttonClasses =
    "flex w-full items-center justify-center rounded-full bg-brand p-4 text-sm font-medium tracking-wide text-white";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        Add to cart
      </button>
    );
  }

  return (
    <button
      aria-label={isSubscription ? "Subscribe" : "Add to cart"}
      className={clsx(buttonClasses, "hover:opacity-90")}
    >
      {isSubscription ? "Subscribe" : "Add to cart"}
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [message, formAction] = useActionState(addItem, null);

  const subscription = useSubscriptionOptional();
  const selectedPlan = subscription?.selectedPlan ?? null;

  const sellingPlanId = selectedPlan?.sellingPlanId || undefined;
  const isSubscription = !!sellingPlanId;

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, {
    variantId: selectedVariantId!,
    sellingPlanId,
  });
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  )!;

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        addItemAction();
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        isSubscription={isSubscription}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}

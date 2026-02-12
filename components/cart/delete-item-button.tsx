"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { removeItem } from "components/cart/actions";
import type { CartItem } from "lib/shopify/types";
import { useActionState } from "react";

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: CartItem;
  optimisticUpdate: any;
}) {
  const [message, formAction] = useActionState(removeItem, null);
  const merchandiseId = item.merchandise.id;
  const removeItemAction = formAction.bind(null, merchandiseId);

  return (
    <form
      action={async () => {
        optimisticUpdate(merchandiseId, "delete");
        removeItemAction();
      }}
    >
      <button
        type="submit"
        aria-label="Remove cart item"
        className="flex items-center justify-center text-neutral-400 hover:text-black transition-colors"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}

"use client";

import { Dialog, Transition } from "@headlessui/react";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import LoadingDots from "components/loading-dots";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col bg-white p-6 text-black md:w-[420px]">
              {/* Header */}
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">Cart</h2>
                  {cart && cart.totalQuantity > 0 && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-medium text-white">
                      {cart.totalQuantity}
                    </span>
                  )}
                </div>
                <button
                  aria-label="Close cart"
                  onClick={closeCart}
                  className="text-black/60 hover:text-black transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingCartIcon className="h-16 text-neutral-400" />
                  <p className="mt-6 text-center text-2xl font-bold">
                    Your cart is empty.
                  </p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden">
                  {/* Cart Items */}
                  <ul className="grow overflow-auto divide-y divide-neutral-200">
                    {cart.lines
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title,
                        ),
                      )
                      .map((item, i) => {
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;

                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[name.toLowerCase()] =
                                value;
                            }
                          },
                        );

                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams),
                        );

                        return (
                          <li key={i} className="py-4">
                            {/* Top row: image + info + price */}
                            <div className="flex gap-3">
                              <Link
                                href={merchandiseUrl}
                                onClick={closeCart}
                                className="flex-shrink-0"
                              >
                                <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                                  <Image
                                    className="h-full w-full object-cover"
                                    width={64}
                                    height={64}
                                    alt={
                                      item.merchandise.product.featuredImage
                                        .altText ||
                                      item.merchandise.product.title
                                    }
                                    src={
                                      item.merchandise.product.featuredImage.url
                                    }
                                  />
                                </div>
                              </Link>
                              <div className="flex flex-1 flex-col min-w-0">
                                <div className="flex justify-between gap-2">
                                  <Link
                                    href={merchandiseUrl}
                                    onClick={closeCart}
                                    className="min-w-0"
                                  >
                                    <p className="text-sm font-medium leading-tight line-clamp-2">
                                      {item.merchandise.product.title}
                                    </p>
                                  </Link>
                                  <Price
                                    className="text-sm font-medium flex-shrink-0"
                                    amount={item.cost.totalAmount.amount}
                                    currencyCode={
                                      item.cost.totalAmount.currencyCode
                                    }
                                  />
                                </div>
                                {item.merchandise.title !== DEFAULT_OPTION ? (
                                  <p className="mt-0.5 text-sm text-neutral-500">
                                    {item.merchandise.title}
                                  </p>
                                ) : null}
                                {item.sellingPlanAllocation?.sellingPlan
                                  ?.name ? (
                                  <p className="mt-0.5 text-xs text-brand font-medium">
                                    {
                                      item.sellingPlanAllocation.sellingPlan
                                        .name
                                    }
                                  </p>
                                ) : null}
                                <Price
                                  className="mt-0.5 text-sm text-neutral-500"
                                  amount={item.cost.totalAmount.amount}
                                  currencyCode={
                                    item.cost.totalAmount.currencyCode
                                  }
                                />
                              </div>
                            </div>
                            {/* Bottom row: quantity + delete */}
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex h-9 items-center rounded-full border border-neutral-300">
                                <EditItemQuantityButton
                                  item={item}
                                  type="minus"
                                  optimisticUpdate={updateCartItem}
                                />
                                <span className="w-8 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <EditItemQuantityButton
                                  item={item}
                                  type="plus"
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>
                              <DeleteItemButton
                                item={item}
                                optimisticUpdate={updateCartItem}
                              />
                            </div>
                          </li>
                        );
                      })}
                  </ul>

                  {/* Bottom section */}
                  <div className="border-t border-neutral-200 pt-4">
                    {/* Discount */}
                    <button
                      onClick={() => setDiscountOpen(!discountOpen)}
                      className="flex w-full items-center justify-between py-3 text-sm font-medium"
                    >
                      <span>Discount</span>
                      <PlusMinusIcon open={discountOpen} />
                    </button>
                    {discountOpen && (
                      <div className="pb-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Discount code"
                            className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-brand"
                          />
                          <button className="rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-300 transition-colors">
                            Apply
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="h-px bg-brand" />

                    {/* Estimated total */}
                    <div className="flex items-center justify-between py-4">
                      <span className="text-sm font-medium">
                        Estimated total
                      </span>
                      <Price
                        className="text-lg font-bold"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>

                    {/* Shipping note */}
                    <p className="text-xs text-neutral-500 mb-4">
                      Taxes and shipping calculated at checkout.
                    </p>

                    {/* Checkout button */}
                    <form action={redirectToCheckout}>
                      <CheckoutButton />
                    </form>

                    {/* Express payment buttons */}
                    <div className="mt-3 flex gap-2">
                      <button className="flex h-12 flex-1 items-center justify-center rounded-lg bg-[#5A31F4] hover:opacity-90 transition-opacity">
                        <span className="text-white text-sm font-bold italic">shop</span>
                      </button>
                      <button className="flex h-12 flex-1 items-center justify-center rounded-lg bg-[#FFC439] hover:opacity-90 transition-opacity">
                        <span className="text-sm font-bold italic">
                          <span className="text-[#253B80]">Pay</span>
                          <span className="text-[#179BD7]">Pal</span>
                        </span>
                      </button>
                      <button className="flex h-12 flex-1 items-center justify-center rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 transition-colors">
                        <span className="text-sm font-medium text-[#5F6368]">
                          <span className="font-bold">G</span> Pay
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function PlusMinusIcon({ open }: { open: boolean }) {
  return (
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
      {open ? (
        <line x1="5" y1="12" x2="19" y2="12" />
      ) : (
        <>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </>
      )}
    </svg>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="block w-full rounded-full bg-brand p-3.5 text-center text-sm font-medium text-white hover:opacity-90 transition-opacity"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-white" /> : "Check out"}
    </button>
  );
}

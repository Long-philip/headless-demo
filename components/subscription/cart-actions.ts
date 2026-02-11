'use server';

import { TAGS } from 'lib/constants';
import { addToCart, updateCartDiscountCodes } from 'lib/shopify';
import { CartLineInput } from 'lib/shopify/types';
import { updateTag } from 'next/cache';

export async function addSubscriptionItems(lines: CartLineInput[]) {
  try {
    await addToCart(lines);
    updateTag(TAGS.cart);
  } catch (e) {
    console.error('Error adding subscription items to cart:', e);
    return 'Error adding subscription items to cart';
  }
}

export async function applyDiscountCodes(discountCodes: string[]) {
  try {
    await updateCartDiscountCodes(discountCodes);
    updateTag(TAGS.cart);
  } catch (e) {
    console.error('Error applying discount codes:', e);
    return 'Error applying discount codes';
  }
}

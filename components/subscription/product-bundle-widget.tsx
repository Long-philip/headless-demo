'use client';

import { useEffect, useRef } from 'react';
import { ProductBundleSDK } from 'joy-subscription-sdk/productBundle';
import { addSubscriptionItems, applyDiscountCodes } from './cart-actions';

export function ProductBundleWidget({ productHandle }: { productHandle: string }) {
  const sdkRef = useRef<ProductBundleSDK | null>(null);

  useEffect(() => {
    const sdk = new ProductBundleSDK({
      shopDomain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!,
      storefrontAccessToken: process.env.NEXT_PUBLIC_STOREFRONT_TOKEN!,
    });
    sdkRef.current = sdk;

    const unsubscribe = sdk.on('add-to-cart', async (data: any) => {
      await addSubscriptionItems(data.lines);
      if (data.discountCodes?.length > 0) {
        await applyDiscountCodes(data.discountCodes);
      }
    });

    sdk.initProductBundle(productHandle);

    return () => {
      unsubscribe();
      sdk.destroy();
    };
  }, [productHandle]);

  return (
    <div
      className="Avada-ProductBundleData-Block"
      data-product={JSON.stringify({ handle: productHandle })}
    />
  );
}

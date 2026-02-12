'use client';

import { useEffect, useRef } from 'react';
import { BoxSDK } from 'joy-subscription-sdk/box';
import { addSubscriptionItems, applyDiscountCodes } from './cart-actions';

export function SubscriptionBox() {
  const sdkRef = useRef<BoxSDK | null>(null);

  useEffect(() => {
    const sdk = new BoxSDK({
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

    sdk.initSubscriptionBox({ boxId: '5KGbH2BjqdUYBNXsuBDq' });

    return () => {
      unsubscribe();
      sdk.destroySubscriptionBox();
    };
  }, []);

  return <div className="Avada-SubscriptionBox__Wrapper" />;
}

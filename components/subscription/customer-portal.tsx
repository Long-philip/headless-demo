'use client';

import { useEffect, useRef } from 'react';
import { PortalSDK } from 'joy-subscription-sdk/portal';
import { addSubscriptionItems } from './cart-actions';

export function CustomerPortal() {
  const sdkRef = useRef<PortalSDK | null>(null);

  useEffect(() => {
    const sdk = new PortalSDK({
      shopDomain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!,
      storefrontAccessToken: process.env.NEXT_PUBLIC_STOREFRONT_TOKEN!,
    });
    sdkRef.current = sdk;

    const unsubscribe = sdk.on('add-to-cart', async (data: any) => {
      await addSubscriptionItems(data.lines);
      window.location.href = '/checkout';
    });

    sdk.initCustomerPortal();

    return () => {
      unsubscribe();
      sdk.destroyCustomerPortal();
    };
  }, []);

  return <div id="Avada-SubscriptionManagement__Container" />;
}

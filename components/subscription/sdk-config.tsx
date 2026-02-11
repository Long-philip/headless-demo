'use client';

import { useEffect } from 'react';
import { SubscriptionSDK } from 'joy-subscription-sdk';

let configured = false;

export function SubscriptionSDKConfig() {
  useEffect(() => {
    if (configured) return;
    configured = true;

    SubscriptionSDK.configure({
      shopDomain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!,
      storefrontAccessToken: process.env.NEXT_PUBLIC_STOREFRONT_TOKEN!,
    });
  }, []);

  return null;
}

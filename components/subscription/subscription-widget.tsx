'use client';

import { useEffect, useRef } from 'react';
import { WidgetSDK } from 'joy-subscription-sdk/widget';
import { useSubscription } from './subscription-context';

export function SubscriptionWidget({ productHandle }: { productHandle: string }) {
  const sdkRef = useRef<WidgetSDK | null>(null);
  const { setSelectedPlan, registerSetVariant } = useSubscription();

  useEffect(() => {
    const sdk = new WidgetSDK({
      shopDomain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!,
      storefrontAccessToken: process.env.NEXT_PUBLIC_STOREFRONT_TOKEN!,
    });
    sdkRef.current = sdk;

    const unsubscribe = sdk.on('plan:selected', (data: any) => {
      setSelectedPlan({
        productId: data.productId,
        variantId: data.variantId,
        sellingPlanId: data.sellingPlanId || null,
        plan: data.plan || null,
      });
    });

    registerSetVariant((variantId: string) => {
      sdk.setVariant(variantId);
    });

    sdk.initProduct(productHandle);

    return () => {
      unsubscribe();
      sdk.destroy();
    };
  }, [productHandle, setSelectedPlan, registerSetVariant]);

  return <div className="Avada-SubscriptionWidget-Block" />;
}

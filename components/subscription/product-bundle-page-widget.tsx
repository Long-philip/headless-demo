'use client';

import { useEffect, useRef } from 'react';
import { ProductBundleSDK } from 'joy-subscription-sdk/productBundle';
import { addSubscriptionItems, applyDiscountCodes } from './cart-actions';

export function ProductBundlePageWidget({ bundleId }: { bundleId: string }) {
  const sdkRef = useRef<ProductBundleSDK | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

    async function init() {
      // Fetch shop data to find the bundle by ID
      const shopData = await (sdk as any).client.getShopData();
      const bundles: any[] = shopData.bundleSettings?.bundles || [];
      const bundle = bundles.find((b) => b.id === bundleId);

      if (!bundle?.products?.[0]?.handle) {
        console.warn(`[ProductBundle] Bundle "${bundleId}" not found or has no products`);
        return;
      }

      const handle: string = bundle.products[0].handle;

      // Set data-product on the container before script loads so the widget finds it
      if (containerRef.current) {
        containerRef.current.dataset.product = JSON.stringify({ handle });
      }

      await sdk.initProductBundle(handle);
    }

    init();

    return () => {
      unsubscribe();
      sdk.destroy();
    };
  }, [bundleId]);

  return <div ref={containerRef} className="Avada-ProductBundleData-Block" />;
}

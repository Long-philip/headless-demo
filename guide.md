# Joy Subscription SDK – Headless Integration Guide

A step-by-step guide for merchants using a headless Shopify storefront (Next.js) who want to integrate Joy Subscription features: **Product Widget**, **Product Bundle**, **Subscription Box**, and **Customer Portal**.

> **Demo reference**: This guide is based on the [Vercel Commerce](https://github.com/vercel/commerce) template (Next.js 15, App Router, React 19, Tailwind CSS).

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Install the SDK](#2-install-the-sdk)
3. [Environment Variables](#3-environment-variables)
4. [TypeScript Declarations](#4-typescript-declarations)
5. [Subscription Context (Shared State)](#5-subscription-context-shared-state)
6. [Product Subscription Widget](#6-product-subscription-widget)
7. [Connect Widget to Add-to-Cart](#7-connect-widget-to-add-to-cart)
8. [Connect Widget to Variant Selector](#8-connect-widget-to-variant-selector)
9. [Product Bundle Widget](#9-product-bundle-widget)
10. [Subscription Box Page](#10-subscription-box-page)
11. [Customer Portal Page](#11-customer-portal-page)
12. [Cart Infrastructure (sellingPlanId & Discount Codes)](#12-cart-infrastructure)
13. [Navigation Links](#13-navigation-links)
14. [Shopify Admin Setup](#14-shopify-admin-setup)
15. [Deploy to Vercel](#15-deploy-to-vercel)
16. [Troubleshooting](#16-troubleshooting)

---

## 1. Prerequisites

Before starting, make sure you have:

- A **Shopify store** with the [Joy Subscription](https://apps.shopify.com/) app installed
- Products with **selling plans** configured in Shopify Admin
- A **headless storefront** built with Next.js (App Router)
- **Storefront API access token** from Shopify Admin → Settings → Apps and sales channels → Develop apps
- **Node.js** ≥ 18 and **pnpm** (or npm/yarn)

---

## 2. Install the SDK

```bash
pnpm add joy-subscription-sdk
```

This package provides 4 standalone SDK modules:

| Module | Import Path | Purpose |
|--------|------------|---------|
| WidgetSDK | `joy-subscription-sdk/widget` | Product subscription plan selector |
| ProductBundleSDK | `joy-subscription-sdk/productBundle` | Product bundle builder |
| BoxSDK | `joy-subscription-sdk/box` | Subscription box builder |
| PortalSDK | `joy-subscription-sdk/portal` | Customer subscription management |

---

## 3. Environment Variables

Create a `.env.local` file at the project root:

```env
# Store info
COMPANY_NAME="Your Store Name"
SITE_NAME="Your Site Name"

# Server-side Shopify credentials
SHOPIFY_STORE_DOMAIN="your-store.myshopify.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN="your-storefront-access-token"
SHOPIFY_REVALIDATION_SECRET=""

# Client-side credentials (used by Joy Subscription SDK)
NEXT_PUBLIC_SHOPIFY_DOMAIN="your-store.myshopify.com"
NEXT_PUBLIC_STOREFRONT_TOKEN="your-storefront-access-token"
```

> **Important**: The `NEXT_PUBLIC_` prefixed variables are exposed to the browser. The SDK runs on the client side and needs these to fetch subscription data from Shopify metafields.

---

## 4. TypeScript Declarations

The `joy-subscription-sdk` package does not include TypeScript type definitions. Create a declaration file:

**File: `types/joy-subscription-sdk.d.ts`**

```typescript
declare module 'joy-subscription-sdk' {
  export class SubscriptionSDK {
    static configure(config: {
      shopDomain: string;
      storefrontAccessToken: string;
      apiVersion?: string;
      apiBaseUrl?: string;
    }): void;
  }

  export class SubscriptionClient {
    constructor(config: { shopDomain: string; storefrontAccessToken: string });
    getShopData(): Promise<any>;
    getProductData(handle: string): Promise<any>;
  }
}

declare module 'joy-subscription-sdk/widget' {
  export class WidgetSDK {
    constructor(config?: { shopDomain: string; storefrontAccessToken: string });
    initProduct(handle: string, options?: Record<string, unknown>): void;
    setVariant(variantId: string): void;
    setQuantity(quantity: number): void;
    on(event: string, callback: (data: any) => void): () => void;
    getSelectedPlan(): any;
    destroy(): void;
  }
}

declare module 'joy-subscription-sdk/portal' {
  export class PortalSDK {
    constructor(config?: { shopDomain: string; storefrontAccessToken: string });
    initCustomerPortal(options?: Record<string, unknown>): void;
    destroyCustomerPortal(): void;
    on(event: string, callback: (data: any) => void): () => void;
    destroy(): void;
  }
}

declare module 'joy-subscription-sdk/box' {
  export class BoxSDK {
    constructor(config?: { shopDomain: string; storefrontAccessToken: string });
    initSubscriptionBox(options?: Record<string, unknown>): void;
    destroySubscriptionBox(): void;
    on(event: string, callback: (data: any) => void): () => void;
    destroy(): void;
  }
}

declare module 'joy-subscription-sdk/productBundle' {
  export class ProductBundleSDK {
    constructor(config?: { shopDomain: string; storefrontAccessToken: string });
    initProductBundle(handle: string, options?: Record<string, unknown>): void;
    on(event: string, callback: (data: any) => void): () => void;
    destroy(): void;
  }
}
```

---

## 5. Subscription Context (Shared State)

The Widget, Add-to-Cart button, and Variant Selector need to share state. Create a React Context:

**File: `components/subscription/subscription-context.tsx`**

```tsx
'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { ReactNode } from 'react';

type PlanSelection = {
  productId: string;
  variantId: string;
  sellingPlanId: string | null;
  plan: Record<string, unknown> | null;
};

type SubscriptionContextType = {
  selectedPlan: PlanSelection | null;
  setSelectedPlan: (plan: PlanSelection | null) => void;
  registerSetVariant: (fn: (variantId: string) => void) => void;
  notifyVariantChange: (variantId: string) => void;
};

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [selectedPlan, setSelectedPlan] = useState<PlanSelection | null>(null);
  const setVariantRef = useRef<((variantId: string) => void) | null>(null);

  const registerSetVariant = useCallback((fn: (variantId: string) => void) => {
    setVariantRef.current = fn;
  }, []);

  const notifyVariantChange = useCallback((variantId: string) => {
    setVariantRef.current?.(variantId);
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{ selectedPlan, setSelectedPlan, registerSetVariant, notifyVariantChange }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}

export function useSubscriptionOptional() {
  return useContext(SubscriptionContext);
}
```

**How it works:**

```
┌─────────────────────────────────────────────┐
│           SubscriptionProvider               │
│                                             │
│  ┌───────────────┐   plan:selected event    │
│  │ WidgetSDK     │ ──────────────────────►  │
│  │ (Widget)      │       setSelectedPlan()  │
│  └───────────────┘                          │
│                                             │
│  ┌───────────────┐   reads selectedPlan     │
│  │ Add-to-Cart   │ ◄──────────────────────  │
│  │ Button        │   shows "Subscribe" btn  │
│  └───────────────┘                          │
│                                             │
│  ┌───────────────┐   notifyVariantChange()  │
│  │ Variant       │ ──────────────────────►  │
│  │ Selector      │       sdk.setVariant()   │
│  └───────────────┘                          │
└─────────────────────────────────────────────┘
```

---

## 6. Product Subscription Widget

This component renders the subscription plan selector on product pages.

**File: `components/subscription/subscription-widget.tsx`**

```tsx
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
```

> **Critical**: You MUST pass `shopDomain` and `storefrontAccessToken` directly to the constructor. The standalone bundles (`joy-subscription-sdk/widget`, etc.) do NOT share global config from `SubscriptionSDK.configure()`. Each standalone bundle has its own module scope.

### Add Widget to Product Page

Wrap your product description with `SubscriptionProvider` and place the widget:

**File: `components/product/product-description.tsx`**

```tsx
import { SubscriptionProvider } from 'components/subscription/subscription-context';
import { SubscriptionWidget } from 'components/subscription/subscription-widget';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <SubscriptionProvider>
      {/* Product title, price, etc. */}
      <VariantSelector options={product.options} variants={product.variants} />
      <SubscriptionWidget productHandle={product.handle} />
      {/* Product description HTML */}
      <AddToCart product={product} />
    </SubscriptionProvider>
  );
}
```

---

## 7. Connect Widget to Add-to-Cart

Update your Add-to-Cart button to support subscription purchases:

**File: `components/cart/add-to-cart.tsx`**

```tsx
'use client';

import { useSubscriptionOptional } from 'components/subscription/subscription-context';

export function AddToCart({ product }: { product: Product }) {
  const subscription = useSubscriptionOptional();
  const selectedPlan = subscription?.selectedPlan;
  const isSubscription = !!selectedPlan?.sellingPlanId;

  // Build the payload
  const payload = isSubscription
    ? { variantId: selectedVariantId, sellingPlanId: selectedPlan.sellingPlanId }
    : selectedVariantId;

  return (
    <button onClick={() => addItem(payload)}>
      {isSubscription ? 'Subscribe' : 'Add To Cart'}
    </button>
  );
}
```

### Update Server Action to Support sellingPlanId

**File: `components/cart/actions.ts`**

```tsx
export async function addItem(
  prevState: any,
  payload: { variantId: string; sellingPlanId?: string } | string | undefined
) {
  const cartId = cookies().get('cartId')?.value;
  if (!cartId) {
    return 'Missing cart ID';
  }

  const variantId = typeof payload === 'object' ? payload.variantId : payload;
  const sellingPlanId = typeof payload === 'object' ? payload.sellingPlanId : undefined;

  if (!variantId) return 'Missing variant ID';

  const line: CartLineInput = {
    merchandiseId: variantId,
    quantity: 1,
    ...(sellingPlanId && { sellingPlanId }),
  };

  await addToCart([line]);
  revalidateTag(TAGS.cart);
}
```

---

## 8. Connect Widget to Variant Selector

When a customer selects a different variant, notify the SDK:

**File: `components/product/variant-selector.tsx`**

```tsx
import { useSubscriptionOptional } from 'components/subscription/subscription-context';

export function VariantSelector({ options, variants }: Props) {
  const subscription = useSubscriptionOptional();

  // When variant changes:
  const handleOptionChange = (variantId: string) => {
    // ... existing URL update logic ...

    // Notify SDK of variant change
    subscription?.notifyVariantChange(variantId);
  };
}
```

---

## 9. Product Bundle Widget

For products that support bundle purchasing:

**File: `components/subscription/product-bundle-widget.tsx`**

```tsx
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
      if (data.items?.length) {
        await addSubscriptionItems(
          data.items.map((item: any) => ({
            merchandiseId: item.variantId,
            quantity: item.quantity || 1,
            ...(item.sellingPlanId && { sellingPlanId: item.sellingPlanId }),
          }))
        );
      }
      if (data.discountCodes?.length) {
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
```

### Add to Product Page

```tsx
// app/product/[handle]/page.tsx
import { ProductBundleWidget } from 'components/subscription/product-bundle-widget';

export default async function ProductPage({ params }) {
  return (
    <>
      <ProductDescription product={product} />
      <ProductBundleWidget productHandle={params.handle} />
      {/* ... */}
    </>
  );
}
```

---

## 10. Subscription Box Page

A standalone page where customers can build custom subscription boxes.

**File: `components/subscription/subscription-box.tsx`**

```tsx
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
      if (data.items?.length) {
        await addSubscriptionItems(
          data.items.map((item: any) => ({
            merchandiseId: item.variantId,
            quantity: item.quantity || 1,
            ...(item.sellingPlanId && { sellingPlanId: item.sellingPlanId }),
          }))
        );
      }
      if (data.discountCodes?.length) {
        await applyDiscountCodes(data.discountCodes);
      }
    });

    sdk.initSubscriptionBox();

    return () => {
      unsubscribe();
      sdk.destroy();
    };
  }, []);

  return <div className="Avada-SubscriptionBox__Wrapper" />;
}
```

**File: `app/pages/subscription-box/page.tsx`**

```tsx
import { SubscriptionBox } from 'components/subscription/subscription-box';

export const metadata = {
  title: 'Subscription Box',
  description: 'Build your custom subscription box',
};

export default function SubscriptionBoxPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      <SubscriptionBox />
    </div>
  );
}
```

---

## 11. Customer Portal Page

A page where logged-in customers can manage their subscriptions.

**File: `components/subscription/customer-portal.tsx`**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { PortalSDK } from 'joy-subscription-sdk/portal';
import { addSubscriptionItems, applyDiscountCodes } from './cart-actions';

export function CustomerPortal() {
  const sdkRef = useRef<PortalSDK | null>(null);

  useEffect(() => {
    const sdk = new PortalSDK({
      shopDomain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!,
      storefrontAccessToken: process.env.NEXT_PUBLIC_STOREFRONT_TOKEN!,
    });
    sdkRef.current = sdk;

    const unsubscribe = sdk.on('add-to-cart', async (data: any) => {
      if (data.items?.length) {
        await addSubscriptionItems(
          data.items.map((item: any) => ({
            merchandiseId: item.variantId,
            quantity: item.quantity || 1,
            ...(item.sellingPlanId && { sellingPlanId: item.sellingPlanId }),
          }))
        );
      }
      if (data.discountCodes?.length) {
        await applyDiscountCodes(data.discountCodes);
      }
    });

    sdk.initCustomerPortal();

    return () => {
      unsubscribe();
      sdk.destroy();
    };
  }, []);

  return <div id="Avada-SubscriptionManagement__Container" />;
}
```

**File: `app/pages/joy-subscription/[[...slug]]/page.tsx`**

```tsx
import { CustomerPortal } from 'components/subscription/customer-portal';

export const metadata = {
  title: 'My Subscriptions',
  description: 'Manage your subscriptions',
};

export default function CustomerPortalPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      <CustomerPortal />
    </div>
  );
}
```

> **Note**: The `[[...slug]]` catch-all route allows the portal to handle sub-pages like `/pages/joy-subscription/orders`.

---

## 12. Cart Infrastructure

### Add sellingPlanId Support to Shopify Cart Mutations

Update your Storefront API cart mutation to include `sellingPlanId`:

**File: `lib/shopify/mutations/cart.ts`**

```graphql
mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      ...cart
    }
  }
}
```

The Shopify `CartLineInput` type natively supports `sellingPlanId` — no schema changes needed.

### Add Discount Codes Mutation

```graphql
mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
  cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
    cart { id }
    userErrors { field message }
  }
}
```

### Server Actions for SDK Events

**File: `components/subscription/cart-actions.ts`**

```tsx
'use server';

import { TAGS } from 'lib/constants';
import { addToCart, updateCartDiscountCodes } from 'lib/shopify';
import { CartLineInput } from 'lib/shopify/types';
import { revalidateTag } from 'next/cache';

export async function addSubscriptionItems(lines: CartLineInput[]) {
  await addToCart(lines);
  revalidateTag(TAGS.cart);
}

export async function applyDiscountCodes(discountCodes: string[]) {
  await updateCartDiscountCodes(discountCodes);
  revalidateTag(TAGS.cart);
}
```

### CartLineInput Type

```typescript
export type CartLineInput = {
  merchandiseId: string;
  quantity: number;
  sellingPlanId?: string;
  attributes?: { key: string; value: string }[];
};
```

---

## 13. Navigation Links

Add subscription pages to your navigation:

```tsx
// components/layout/navbar/index.tsx
const staticLinks = [
  { title: 'Collections', path: '/collections' },
  { title: 'Subscription Box', path: '/pages/subscription-box' },
  { title: 'My Subscriptions', path: '/pages/joy-subscription' },
  { title: 'Search', path: '/search' },
];
```

---

## 14. Shopify Admin Setup

### Step 1: Install Joy Subscription App

Install the Joy Subscription app from the Shopify App Store and complete the setup wizard.

### Step 2: Create Selling Plans

1. Go to **Shopify Admin** → **Apps** → **Joy Subscription**
2. Create a subscription plan (e.g., "Monthly Subscription - Every 1 month")
3. Assign the selling plan to your products

### Step 3: Verify Product Has Selling Plans

Go to **Products** → Select a product → Check the **Purchase options** section. You should see your selling plan listed (e.g., "Every 1 month").

### Step 4: Redirect Shopify Theme to Headless Store

Since checkout will link back to the Shopify storefront, add a redirect in your Shopify theme:

1. Go to **Online Store** → **Themes** → **Edit code**
2. Open `layout/theme.liquid`
3. Add this right after `<link rel="preconnect" ...>`:

```liquid
{% if request.path == '/' or request.path == '' %}
  <script>
    window.location.href = 'https://your-headless-domain.vercel.app';
  </script>
{% endif %}
```

### Step 5: Customer Account (Optional)

To use Shopify's New Customer Accounts for login:

Link your account button to `https://your-store.myshopify.com/account` instead of a local route:

```tsx
<a href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/account`}>
  Account
</a>
```

---

## 15. Deploy to Vercel

### Step 1: Push to GitHub

```bash
git add -A
git commit -m "Add Joy Subscription SDK integration"
git push
```

### Step 2: Import Project on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework preset: **Next.js**

### Step 3: Set Environment Variables

In Vercel Dashboard → **Settings** → **Environment Variables**, add ALL variables from `.env.local`:

| Variable | Value | Required |
|----------|-------|----------|
| `COMPANY_NAME` | Your Store Name | Yes |
| `SITE_NAME` | Your Site Name | Yes |
| `SHOPIFY_STORE_DOMAIN` | your-store.myshopify.com | Yes |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | your-token | Yes |
| `NEXT_PUBLIC_SHOPIFY_DOMAIN` | your-store.myshopify.com | **Yes (SDK)** |
| `NEXT_PUBLIC_STOREFRONT_TOKEN` | your-token | **Yes (SDK)** |
| `SHOPIFY_REVALIDATION_SECRET` | (optional) | No |

> **Important**: The `NEXT_PUBLIC_*` variables are baked into the JavaScript bundle at **build time**. If you add them after deploying, you must **Redeploy** for them to take effect.

### Step 4: Deploy & Verify

Vercel auto-deploys on every push. After deployment:

1. Visit a product page → Subscription widget should appear
2. Select a plan → Button changes to "Subscribe"
3. Click "Subscribe" → Item added to cart with selling plan
4. Visit `/pages/subscription-box` → Subscription box loads
5. Visit `/pages/joy-subscription` → Customer portal loads

---

## 16. Troubleshooting

### Widget not showing on product page

| Cause | Solution |
|-------|----------|
| `NEXT_PUBLIC_*` env vars not set on Vercel | Add them in Vercel dashboard → Redeploy |
| Config not passed to SDK constructor | Pass `{ shopDomain, storefrontAccessToken }` directly to `new WidgetSDK({...})` |
| Product has no selling plan | Add a selling plan to the product in Shopify Admin |
| Wrong product handle | Verify the product handle matches Shopify |

### "Subscribe" button not appearing

- Ensure `SubscriptionProvider` wraps both the `SubscriptionWidget` and `AddToCart` components
- Check that `useSubscriptionOptional()` is used in AddToCart (not `useSubscription()` which throws outside provider)

### SDK console error: "SDK requires configuration"

This means config was not passed to the constructor. **Do NOT rely on `SubscriptionSDK.configure()`** — standalone bundles have separate module scopes and don't read the global config. Always pass config directly:

```tsx
// ✅ Correct
const sdk = new WidgetSDK({
  shopDomain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!,
  storefrontAccessToken: process.env.NEXT_PUBLIC_STOREFRONT_TOKEN!,
});

// ❌ Wrong - standalone bundles ignore global config
SubscriptionSDK.configure({ shopDomain: '...', storefrontAccessToken: '...' });
const sdk = new WidgetSDK(); // config is empty!
```

### Checkout redirects back to Shopify theme

Add the JavaScript redirect in `layout/theme.liquid` as described in [Step 4 of Shopify Admin Setup](#step-4-redirect-shopify-theme-to-headless-store).

### Variant change not reflected in widget

Ensure your Variant Selector calls `subscription?.notifyVariantChange(variantId)` when the selected variant changes.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     Next.js App (Headless)                    │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Product Page (/product/[handle])                       │  │
│  │                                                        │  │
│  │  SubscriptionProvider                                  │  │
│  │    ├── VariantSelector  ←→  notifyVariantChange()      │  │
│  │    ├── SubscriptionWidget (WidgetSDK)                  │  │
│  │    │     └── plan:selected → setSelectedPlan()         │  │
│  │    └── AddToCart                                       │  │
│  │          └── reads selectedPlan → "Subscribe" button   │  │
│  │                                                        │  │
│  │  ProductBundleWidget (ProductBundleSDK)                │  │
│  │    └── add-to-cart → addSubscriptionItems()            │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────┐  ┌───────────────────────────┐    │
│  │ Subscription Box     │  │ Customer Portal           │    │
│  │ (/pages/sub-box)     │  │ (/pages/joy-subscription) │    │
│  │                      │  │                           │    │
│  │ BoxSDK               │  │ PortalSDK                 │    │
│  │ └── add-to-cart      │  │ └── add-to-cart           │    │
│  └──────────────────────┘  └───────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Server Actions                                         │  │
│  │  addSubscriptionItems() → Shopify cartLinesAdd         │  │
│  │  applyDiscountCodes()   → Shopify cartDiscountCodes    │  │
│  └────────────────────────────────────────────────────────┘  │
│                              │                               │
│                              ▼                               │
│                   Shopify Storefront API                      │
│                   (GraphQL + Metafields)                      │
└──────────────────────────────────────────────────────────────┘
```

---

## Quick Reference: SDK Events

| SDK | Event | Data | Usage |
|-----|-------|------|-------|
| WidgetSDK | `plan:selected` | `{ productId, variantId, sellingPlanId, plan }` | Update context with selected plan |
| ProductBundleSDK | `add-to-cart` | `{ items: [...], discountCodes: [...] }` | Add bundle items to cart |
| BoxSDK | `add-to-cart` | `{ items: [...], discountCodes: [...] }` | Add box items to cart |
| PortalSDK | `add-to-cart` | `{ items: [...], discountCodes: [...] }` | Add items from portal |

## Quick Reference: SDK Container Elements

| SDK | HTML Element | Purpose |
|-----|-------------|---------|
| WidgetSDK | `<div class="Avada-SubscriptionWidget-Block" />` | Widget renders here |
| ProductBundleSDK | `<div class="Avada-ProductBundleData-Block" />` | Bundle renders here |
| BoxSDK | `<div class="Avada-SubscriptionBox__Wrapper" />` | Box renders here |
| PortalSDK | `<div id="Avada-SubscriptionManagement__Container" />` | Portal renders here |

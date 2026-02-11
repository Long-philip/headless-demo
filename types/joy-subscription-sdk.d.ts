declare module 'joy-subscription-sdk' {
  export class SubscriptionSDK {
    static configure(config: {
      shopDomain: string;
      storefrontAccessToken: string;
      apiVersion?: string;
      apiBaseUrl?: string;
    }): void;
  }
}

declare module 'joy-subscription-sdk/widget' {
  export class WidgetSDK {
    constructor(config?: {
      shopDomain?: string;
      storefrontAccessToken?: string;
    });
    static getInstance(): WidgetSDK;
    initProduct(handle: string, options?: {
      variantId?: string;
      autoLoadScript?: boolean;
    }): Promise<void>;
    initShop(): Promise<any>;
    preloadWidget(): void;
    setVariant(variantId: string | number): void;
    setQuantity(quantity: number): void;
    on(event: string, callback: (data: any) => void): () => void;
    getSelectedPlan(): any;
    destroy(): void;
  }
}

declare module 'joy-subscription-sdk/portal' {
  export class PortalSDK {
    constructor(config?: {
      shopDomain?: string;
      storefrontAccessToken?: string;
    });
    static getInstance(): PortalSDK;
    initCustomerPortal(options?: {
      autoLoadScript?: boolean;
      customer?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
      };
    }): Promise<void>;
    destroyCustomerPortal(): void;
    preloadPortal(): void;
    on(event: string, callback: (data: any) => void): () => void;
    destroy(): void;
  }
}

declare module 'joy-subscription-sdk/box' {
  export class BoxSDK {
    constructor(config?: {
      shopDomain?: string;
      storefrontAccessToken?: string;
    });
    static getInstance(): BoxSDK;
    initSubscriptionBox(options?: {
      autoLoadScript?: boolean;
      includeFixedBundle?: boolean;
    }): Promise<void>;
    destroySubscriptionBox(): void;
    preloadSubscriptionBox(): void;
    on(event: string, callback: (data: any) => void): () => void;
    destroy(): void;
  }
}

declare module 'joy-subscription-sdk/productBundle' {
  export class ProductBundleSDK {
    constructor(config?: {
      shopDomain?: string;
      storefrontAccessToken?: string;
    });
    static getInstance(): ProductBundleSDK;
    initProductBundle(handle: string, options?: {
      autoLoadScript?: boolean;
    }): Promise<void>;
    preloadProductBundle(): void;
    on(event: string, callback: (data: any) => void): () => void;
    destroy(): void;
  }
}

declare module 'joy-subscription-sdk/core' {
  export class SubscriptionClient {
    constructor(config: {
      shopDomain: string;
      storefrontAccessToken: string;
    });
    getShopData(): Promise<any>;
    getProductData(handle: string): Promise<any>;
    getShopAndProductData(handle: string): Promise<any>;
  }

  export function loadScript(script: string): Promise<void>;
  export function isScriptLoaded(script: string): boolean;
  export function preloadScript(script: string): void;
  export function getScriptUrl(script: string): string;
  export const SCRIPTS: {
    WIDGET: string;
    PORTAL: string;
    BOX: string;
    BOX_FIXED_BUNDLE: string;
    PRODUCT_BUNDLE: string;
  };
}

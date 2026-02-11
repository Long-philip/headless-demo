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
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

export function useSubscriptionOptional() {
  return useContext(SubscriptionContext);
}

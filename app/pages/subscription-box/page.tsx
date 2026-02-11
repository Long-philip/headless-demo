import Footer from 'components/layout/footer';
import { SubscriptionBox } from 'components/subscription/subscription-box';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscription Box',
  description: 'Build your custom subscription box',
};

export default function SubscriptionBoxPage() {
  return (
    <>
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
        <SubscriptionBox />
      </div>
      <Footer />
    </>
  );
}

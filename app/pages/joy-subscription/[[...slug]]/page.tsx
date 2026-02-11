import Footer from 'components/layout/footer';
import { CustomerPortal } from 'components/subscription/customer-portal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Subscriptions',
  description: 'Manage your subscriptions',
};

export default function CustomerPortalPage() {
  return (
    <>
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
        <CustomerPortal />
      </div>
      <Footer />
    </>
  );
}

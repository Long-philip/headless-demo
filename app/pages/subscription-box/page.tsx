import Footer from 'components/layout/footer';
import { SubscriptionBox } from 'components/subscription/subscription-box';
import type { Metadata } from 'next';

const DEFAULT_BOX_ID = '4rmrAgnK48wqn6CcPqts';

export const metadata: Metadata = {
  title: 'Subscription Box',
  description: 'Build your custom subscription box',
};

export default async function SubscriptionBoxPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const boxId = (searchParams?.boxId as string) || DEFAULT_BOX_ID;

  return (
    <>
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
        <SubscriptionBox boxId={boxId} />
      </div>
      <Footer />
    </>
  );
}

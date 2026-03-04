import Footer from 'components/layout/footer';
import { ProductBundlePageWidget } from 'components/subscription/product-bundle-page-widget';
import type { Metadata } from 'next';

const DEFAULT_BUNDLE_ID = 'JOFooGJYq9bxSsQNI8qd';

export const metadata: Metadata = {
  title: 'Product Bundle',
  description: 'Shop our curated product bundles',
};

export default async function ProductBundlePage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const bundleId = (searchParams?.bundleId as string) || DEFAULT_BUNDLE_ID;

  return (
    <>
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
        <ProductBundlePageWidget bundleId={bundleId} />
      </div>
      <Footer />
    </>
  );
}

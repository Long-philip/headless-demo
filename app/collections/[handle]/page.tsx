import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import Footer from "components/layout/footer";
import { defaultSort, sorting } from "lib/constants";
import { getCollection, getCollectionProducts } from "lib/shopify";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.handle);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description ||
      collection.description ||
      `${collection.title} products`,
  };
}

export default async function CollectionPage(props: {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sort } = (searchParams as { [key: string]: string }) || {};
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const collection = await getCollection(params.handle);
  if (!collection) return notFound();

  const products = await getCollectionProducts({
    collection: params.handle,
    sortKey,
    reverse,
  });

  return (
    <>
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 pb-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{collection.title}</h1>
          {collection.description && (
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              {collection.description}
            </p>
          )}
        </div>

        {products.length === 0 ? (
          <p className="text-lg text-neutral-500">
            No products found in this collection.
          </p>
        ) : (
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products} />
          </Grid>
        )}
      </div>
      <Footer />
    </>
  );
}

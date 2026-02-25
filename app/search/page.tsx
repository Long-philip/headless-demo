import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { defaultSort, sorting } from "lib/constants";
import { getCollectionProductsById, getProducts } from "lib/shopify";

const SUBSCRIPTION_COLLECTION_ID = "513844085018";

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const [subscriptionProducts, products] = await Promise.all([
    searchValue ? [] : getCollectionProductsById(SUBSCRIPTION_COLLECTION_ID),
    getProducts({ sortKey, reverse, query: searchValue }),
  ]);

  // Remove duplicates: exclude subscription products from the main list
  const subscriptionHandles = new Set(
    subscriptionProducts.map((p) => p.handle),
  );
  const remainingProducts = products.filter(
    (p) => !subscriptionHandles.has(p.handle),
  );

  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? "There are no products that match "
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {subscriptionProducts.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <ProductGridItems products={subscriptionProducts} />
        </Grid>
      ) : null}
      {remainingProducts.length > 0 ? (
        <Grid
          className={`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${subscriptionProducts.length > 0 ? "mt-4" : ""}`}
        >
          <ProductGridItems products={remainingProducts} />
        </Grid>
      ) : null}
    </>
  );
}

import { getCollectionProducts } from "lib/shopify";
import { ProductCard } from "./product-card";

export async function FeaturedProducts() {
  const products = await getCollectionProducts({
    collection: "hidden-homepage-featured-items",
  });

  if (!products?.length) return null;

  const displayProducts = products.slice(0, 9);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-center mb-10">
        Popular Products
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayProducts.map((product) => (
          <ProductCard key={product.handle} product={product} />
        ))}
      </div>
    </section>
  );
}

import { getCollections } from "lib/shopify";
import Image from "next/image";
import Link from "next/link";

export async function ShopByCollection() {
  const allCollections = await getCollections();

  // Filter out hidden collections and take up to 4 with images
  const displayCollections = allCollections
    .filter((c) => !c.handle.startsWith("hidden-") && c.handle !== "all")
    .slice(0, 4);

  if (!displayCollections.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-center mb-10">
        Shop by Collection
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {displayCollections.map((collection) => (
          <Link
            key={collection.handle}
            href={collection.path}
            className="group relative aspect-[3/4] overflow-hidden rounded-[14px]"
          >
            {collection.image ? (
              <Image
                src={collection.image.url}
                alt={collection.image.altText || collection.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
            ) : (
              <div className="h-full w-full bg-brand/10 flex items-center justify-center">
                <span className="text-brand text-lg font-bold">
                  {collection.title}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-bold text-white">
                {collection.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

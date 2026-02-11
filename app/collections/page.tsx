import Footer from "components/layout/footer";
import { getCollections } from "lib/shopify";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse all product collections.",
};

export default async function CollectionsPage() {
  const collections = await getCollections();
  // Filter out the "All" placeholder collection
  const filteredCollections = collections.filter((c) => c.handle !== "");

  return (
    <>
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 pb-4">
        <h1 className="mb-8 text-3xl font-bold">Collections</h1>
        {filteredCollections.length === 0 ? (
          <p className="text-neutral-500">No collections found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCollections.map((collection) => (
              <Link
                key={collection.handle}
                href={`/collections/${collection.handle}`}
                className="group overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all hover:border-blue-600 dark:border-neutral-800 dark:bg-black"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                  {collection.image ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-12 w-12"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{collection.title}</h2>
                  {collection.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
                      {collection.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

import CartModal from "components/cart/modal";
import LogoSquare from "components/logo-square";
import { getMenu } from "lib/shopify";
import { Menu } from "lib/shopify/types";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";
import { NavWishlistLink } from "./nav-wishlist-link";

const { SITE_NAME } = process.env;

const staticLinks: Menu[] = [
  { title: "Shop All", path: "/search" },
  { title: "Collections", path: "/collections" },
  { title: "Subscription Box", path: "/pages/subscription-box" },
  { title: "My Subscriptions", path: "/pages/joy-subscription" },
];

export async function Navbar() {
  const menu = await getMenu("next-js-frontend-header-menu");
  const allMenuItems = [...staticLinks, ...menu];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-brand/30 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={allMenuItems} />
          </Suspense>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            prefetch={true}
            className="flex items-center gap-2"
          >
            <LogoSquare />
          </Link>
          <ul className="hidden gap-6 text-sm md:flex md:items-center">
            {allMenuItems.map((item: Menu) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  prefetch={true}
                  className="font-medium text-black/[0.81] underline-offset-4 hover:text-brand transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>
          <NavWishlistLink />
          <a
            href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/account`}
            className="text-black/60 hover:text-brand transition-colors"
            aria-label="Account"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </a>
          <CartModal />
        </div>
      </div>
    </nav>
  );
}

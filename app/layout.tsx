import { CartProvider } from "components/cart/cart-context";
import { AnnouncementBar } from "components/layout/announcement-bar";
import { Navbar } from "components/layout/navbar";
import { WelcomeToast } from "components/welcome-toast";
import { WishlistProvider } from "components/wishlist/wishlist-context";
import { Inter } from "next/font/google";
import { getCart } from "lib/shopify";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { baseUrl } from "lib/utils";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
});

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cart = getCart();

  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-black/[0.81] font-sans selection:bg-brand/30">
        <WishlistProvider>
          <CartProvider cartPromise={cart}>
            <AnnouncementBar />
            <Navbar />
            <main>
              {children}
              <Toaster closeButton />
              <WelcomeToast />
            </main>
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}

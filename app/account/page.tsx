import Footer from "components/layout/footer";
import Price from "components/price";
import { getCustomer } from "lib/shopify/customer";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "./logout-button";

export const metadata: Metadata = {
  title: "My Account",
  description: "View your account details and order history.",
};

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    redirect("/account/login");
  }

  const customer = await getCustomer(token);

  if (!customer) {
    redirect("/account/login");
  }

  return (
    <>
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 pb-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="mt-1 text-neutral-500 dark:text-neutral-400">
              Welcome back, {customer.firstName || customer.email}
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <Link
            href="/pages/joy-subscription"
            className="inline-flex items-center gap-2 rounded-lg border border-brand bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            My Subscriptions
          </Link>
        </div>

        {/* Account Info */}
        <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
          <h2 className="mb-4 text-xl font-semibold">Account Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Name
              </p>
              <p className="font-medium">
                {customer.firstName} {customer.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Email
              </p>
              <p className="font-medium">{customer.email}</p>
            </div>
            {customer.phone && (
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Phone
                </p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order History */}
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
          <h2 className="mb-4 text-xl font-semibold">Order History</h2>
          {customer.orders.length === 0 ? (
            <p className="text-neutral-500 dark:text-neutral-400">
              You haven&apos;t placed any orders yet.
            </p>
          ) : (
            <div className="space-y-4">
              {customer.orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border border-neutral-100 p-4 dark:border-neutral-800"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold">
                        Order #{order.orderNumber}
                      </span>
                      <span className="ml-2 text-sm text-neutral-500">
                        {new Date(order.processedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs capitalize dark:bg-neutral-800">
                        {order.financialStatus.toLowerCase().replace("_", " ")}
                      </span>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs capitalize dark:bg-neutral-800">
                        {order.fulfillmentStatus.toLowerCase().replace("_", " ")}
                      </span>
                      <Price
                        amount={order.totalPrice.amount}
                        currencyCode={order.totalPrice.currencyCode}
                        className="font-semibold"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 overflow-x-auto">
                    {order.lineItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-none items-center gap-2"
                      >
                        {item.variant?.image ? (
                          <Image
                            src={item.variant.image.url}
                            alt={item.variant.image.altText || item.title}
                            width={48}
                            height={48}
                            className="rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-neutral-100 dark:bg-neutral-800" />
                        )}
                        <div className="text-sm">
                          <p className="line-clamp-1 font-medium">
                            {item.title}
                          </p>
                          <p className="text-neutral-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

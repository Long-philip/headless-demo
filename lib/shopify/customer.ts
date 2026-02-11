import { shopifyFetch } from "lib/shopify";
import { getCustomerQuery } from "./queries/customer";
import {
  customerAccessTokenCreateMutation,
  customerAccessTokenDeleteMutation,
  customerCreateMutation,
} from "./mutations/customer";
import type {
  Connection,
  Customer,
  CustomerOrderLineItem,
  ShopifyCustomerAccessTokenCreateOperation,
  ShopifyCustomerCreateOperation,
  ShopifyCustomerOperation,
} from "./types";

function removeEdgesAndNodes<T>(array: Connection<T>): T[] {
  return array.edges.map((edge) => edge?.node);
}

export async function getCustomer(
  customerAccessToken: string,
): Promise<Customer | null> {
  const res = await shopifyFetch<ShopifyCustomerOperation>({
    query: getCustomerQuery,
    variables: { customerAccessToken },
  });

  const customer = res.body.data.customer;
  if (!customer) return null;

  return {
    ...customer,
    orders: removeEdgesAndNodes(customer.orders).map((order) => ({
      ...order,
      lineItems: removeEdgesAndNodes(
        order.lineItems as Connection<CustomerOrderLineItem>,
      ),
    })),
  };
}

export async function createCustomer(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<{
  customer: { id: string; email: string } | null;
  errors: string[];
}> {
  const res = await shopifyFetch<ShopifyCustomerCreateOperation>({
    query: customerCreateMutation,
    variables: { input },
  });

  const { customer, customerUserErrors } = res.body.data.customerCreate;

  return {
    customer,
    errors: customerUserErrors.map((e) => e.message),
  };
}

export async function createCustomerAccessToken(input: {
  email: string;
  password: string;
}): Promise<{
  accessToken: string | null;
  expiresAt: string | null;
  errors: string[];
}> {
  const res = await shopifyFetch<ShopifyCustomerAccessTokenCreateOperation>({
    query: customerAccessTokenCreateMutation,
    variables: { input },
  });

  const { customerAccessToken, customerUserErrors } =
    res.body.data.customerAccessTokenCreate;

  return {
    accessToken: customerAccessToken?.accessToken || null,
    expiresAt: customerAccessToken?.expiresAt || null,
    errors: customerUserErrors.map((e) => e.message),
  };
}

export async function deleteCustomerAccessToken(
  customerAccessToken: string,
): Promise<void> {
  await shopifyFetch<{
    data: Record<string, unknown>;
    variables: { customerAccessToken: string };
  }>({
    query: customerAccessTokenDeleteMutation,
    variables: { customerAccessToken },
  });
}

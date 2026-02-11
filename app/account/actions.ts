"use server";

import {
  createCustomer,
  createCustomerAccessToken,
  deleteCustomerAccessToken,
} from "lib/shopify/customer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(
  _prevState: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const { accessToken, expiresAt, errors } = await createCustomerAccessToken({
    email,
    password,
  });

  if (errors.length > 0) {
    return { error: errors[0]! };
  }

  if (!accessToken) {
    return { error: "Invalid email or password." };
  }

  const cookieStore = await cookies();
  cookieStore.set("customerAccessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt ? new Date(expiresAt) : undefined,
  });

  redirect("/account");
}

export async function registerAction(
  _prevState: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = (formData.get("firstName") as string) || undefined;
  const lastName = (formData.get("lastName") as string) || undefined;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 5) {
    return { error: "Password must be at least 5 characters." };
  }

  const { errors } = await createCustomer({
    email,
    password,
    firstName,
    lastName,
  });

  if (errors.length > 0) {
    return { error: errors[0]! };
  }

  // Auto-login after registration
  const { accessToken, expiresAt, errors: loginErrors } =
    await createCustomerAccessToken({ email, password });

  if (loginErrors.length > 0 || !accessToken) {
    redirect("/account/login");
  }

  const cookieStore = await cookies();
  cookieStore.set("customerAccessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt ? new Date(expiresAt) : undefined,
  });

  redirect("/account");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (token) {
    await deleteCustomerAccessToken(token).catch(() => {
      // Ignore errors on token deletion
    });
  }

  cookieStore.delete("customerAccessToken");
  redirect("/account/login");
}

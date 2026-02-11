import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account.",
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;
  if (token) redirect("/account");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16">
      <div className="w-full rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black">
        <h1 className="mb-6 text-2xl font-bold">Sign In</h1>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-neutral-500">
          Don&apos;t have an account?{" "}
          <a
            href="/account/register"
            className="text-blue-600 hover:underline"
          >
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}

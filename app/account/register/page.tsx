import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account.",
};

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;
  if (token) redirect("/account");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16">
      <div className="w-full rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black">
        <h1 className="mb-6 text-2xl font-bold">Create Account</h1>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <a href="/account/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

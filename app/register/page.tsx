import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/auth-forms";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create an Account",
  alternates: { canonical: "/register" },
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  if (await getUser()) redirect("/my-bookings");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Create Account", href: "/register" },
        ]}
      />
      <h1 className="text-lit mt-8 font-display text-display-sm uppercase text-foreground">
        Create an account
      </h1>
      <p className="mt-4 text-body-sm leading-relaxed text-muted-foreground">
        So you can track your bookings, download vouchers and rebook without
        filling everything in again.
      </p>
      <div className="mt-10">
        <Suspense fallback={<p className="text-body-sm text-muted-foreground">Loading…</p>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}

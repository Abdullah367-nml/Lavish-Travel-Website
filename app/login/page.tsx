import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/auth-forms";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign In",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Already signed in — no reason to show a login form.
  if (await getUser()) redirect("/my-bookings");

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Sign In", href: "/login" },
        ]}
      />
      <h1 className="text-lit mt-8 font-display text-display-sm uppercase text-foreground">
        Sign in
      </h1>
      <p className="mt-4 text-body-sm leading-relaxed text-muted-foreground">
        To view your bookings and complete a reservation.
      </p>
      <div className="mt-10">
        <Suspense fallback={<p className="text-body-sm text-muted-foreground">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

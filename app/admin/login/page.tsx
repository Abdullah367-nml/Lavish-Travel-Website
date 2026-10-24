import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/auth-forms";
import { getProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Admin sign-in.
 *
 * Reuses the customer LoginForm rather than duplicating it — same Supabase
 * Auth, same validation, same error handling. What differs is only where you
 * land afterwards, and that is a query parameter.
 *
 * There is no separate admin password. One identity per person, with the
 * role deciding what they can reach; two credential systems would double the
 * surface area for no benefit.
 */
export default async function AdminLoginPage() {
  const profile = await getProfile();
  if (profile?.role === "admin") redirect("/admin");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck aria-hidden className="size-6 text-accent" />
          <div>
            <p className="font-display text-heading-sm uppercase tracking-[0.2em] text-foreground">
              Lavish
            </p>
            <p className="text-caption uppercase tracking-[0.18em] text-accent">
              Admin
            </p>
          </div>
        </div>

        <h1 className="mt-8 font-display text-display-sm uppercase text-foreground">
          Sign in
        </h1>
        <p className="mt-3 text-body-sm leading-relaxed text-muted-foreground">
          Staff access only. If your account is not an administrator you will
          be signed in but the dashboard will stay hidden.
        </p>

        <div className="mt-8">
          <Suspense fallback={<p className="text-body-sm text-muted-foreground">Loading…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

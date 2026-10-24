"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { z } from "zod";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

/**
 * Sign-in and registration.
 *
 * Passwords go straight to Supabase Auth over HTTPS and are hashed with
 * bcrypt there. This application never sees, stores or logs a password, and
 * there is deliberately no code here that could.
 *
 * Note what registration does NOT send: a role. The `handle_new_user`
 * database trigger hard-codes every new account to 'customer'. If role came
 * from the signup payload, anyone could register as an administrator by
 * editing one field in their browser.
 */

const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "Enter your first name").max(80),
    lastName: z.string().trim().min(2, "Enter your last name").max(80),
    email: z.email("Enter a valid email address"),
    phone: z
      .string()
      .trim()
      .min(7, "Enter a contact number")
      .refine(
        (v) => /^\+?[0-9]{7,18}$/.test(v.replace(/[\s()\-.]/g, "")),
        "Enter a valid phone number, including the country code",
      ),
    country: z.string().trim().max(80).optional().or(z.literal("")),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .max(72, "Too long — 72 characters maximum"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Errors = Partial<Record<string, string>>;

function useNextPath() {
  const params = useSearchParams();
  const next = params.get("next");
  // Only ever redirect within this site. An open redirect is a phishing
  // vector: /login?next=https://evil.example would otherwise bounce a
  // freshly-authenticated user straight off-site.
  return next && next.startsWith("/") && !next.startsWith("//")
    ? next
    : "/my-bookings";
}

export function LoginForm() {
  const router = useRouter();
  const nextPath = useNextPath();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const { error: signInError } = await supabaseBrowser().auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      /**
       * Credential failures stay deliberately vague — "no account with that
       * email" would let someone enumerate which addresses are registered.
       *
       * "Email not confirmed" is treated differently on purpose. It is a
       * state the person created themselves and can only fix if told, and
       * collapsing it into the generic message made a perfectly diagnosable
       * problem look like a forgotten password.
       */
      const raw = signInError.message.toLowerCase();

      if (raw.includes("not confirmed") || raw.includes("confirm")) {
        setError(
          "Your email address has not been confirmed yet. Check your inbox for the confirmation link, or ask the site owner to disable email confirmation.",
        );
      } else if (raw.includes("rate") || signInError.status === 429) {
        setError("Too many attempts. Wait a minute and try again.");
      } else {
        setError("That email and password combination is not recognised.");
      }

      // The real reason, for the developer console only. Without this, a
      // misconfiguration is indistinguishable from a typo.
      if (process.env.NODE_ENV === "development") {
        console.error("[auth] sign-in failed:", signInError.status, signInError.message);
      }

      setBusy(false);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <Field label="Email" htmlFor="email" required>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>

      <Field label="Password" htmlFor="password" required>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>

      {error && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-body-sm text-foreground"
        >
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-destructive" />
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={busy}>
        {busy ? (
          <>
            <Loader2 aria-hidden className="animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <ArrowRight aria-hidden />
          </>
        )}
      </Button>

      <p className="text-body-sm text-muted-foreground">
        No account yet?{" "}
        <Link href="/register" className="text-accent underline-offset-4 hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const nextPath = useNextPath();
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof values, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      const flat = z.flattenError(parsed.error).fieldErrors as Record<
        string,
        string[] | undefined
      >;
      const next: Errors = {};
      for (const [k, v] of Object.entries(flat)) if (v?.length) next[k] = v[0];
      setErrors(next);
      return;
    }

    setBusy(true);
    const { data, error } = await supabaseBrowser().auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        // Read by the handle_new_user trigger to populate `profiles`.
        // `role` is intentionally absent — the trigger sets it to 'customer'.
        data: {
          first_name: parsed.data.firstName,
          last_name: parsed.data.lastName,
          phone: parsed.data.phone,
          country: parsed.data.country || null,
        },
      },
    });

    if (error) {
      const raw = error.message.toLowerCase();
      setFormError(
        raw.includes("already")
          ? "An account with that email already exists. Try signing in instead."
          : raw.includes("password")
            ? "That password was rejected. Use at least 8 characters."
            : `We could not create the account: ${error.message}`,
      );
      if (process.env.NODE_ENV === "development") {
        console.error("[auth] sign-up failed:", error.status, error.message);
      }
      setBusy(false);
      return;
    }

    /**
     * If the project requires email confirmation, signUp succeeds but returns
     * no session — the user is NOT signed in. Pushing them to /my-bookings
     * would bounce them straight back to /login with no explanation, which
     * looks like the registration silently failed.
     */
    if (!data.session) {
      setNeedsConfirmation(true);
      setBusy(false);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  if (needsConfirmation) {
    return (
      <div className="rounded-md border border-accent/30 bg-accent/5 p-6">
        <h2 className="font-display text-heading-md uppercase tracking-wide text-foreground">
          Confirm your email
        </h2>
        <p className="mt-3 text-body-sm leading-relaxed text-muted-foreground">
          Your account was created, but this site requires you to confirm your
          email address before signing in. Check your inbox for a link from
          Supabase.
        </p>
        <p className="mt-3 text-body-sm leading-relaxed text-muted-foreground">
          Not seeing it? The site owner can switch confirmation off under
          Authentication &rarr; Sign In / Providers &rarr; Email in the
          Supabase dashboard.
        </p>
        <Button asChild className="mt-6">
          <Link href="/login">Go to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="First name" htmlFor="firstName" required error={errors.firstName}>
          <Input
            id="firstName"
            autoComplete="given-name"
            value={values.firstName}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby="firstName-error"
            onChange={(e) => set("firstName", e.target.value)}
          />
        </Field>
        <Field label="Last name" htmlFor="lastName" required error={errors.lastName}>
          <Input
            id="lastName"
            autoComplete="family-name"
            value={values.lastName}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby="lastName-error"
            onChange={(e) => set("lastName", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Email" htmlFor="email" required error={errors.email}>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby="email-error"
          onChange={(e) => set("email", e.target.value)}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Phone"
          htmlFor="phone"
          required
          error={errors.phone}
          hint="Include the country code"
        >
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+27 82 555 1234"
            value={values.phone}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby="phone-error"
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
        <Field label="Country" htmlFor="country" error={errors.country}>
          <Input
            id="country"
            autoComplete="country-name"
            value={values.country}
            aria-describedby="country-error"
            onChange={(e) => set("country", e.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Password"
          htmlFor="password"
          required
          error={errors.password}
          hint="At least 8 characters"
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={values.password}
            aria-invalid={Boolean(errors.password)}
            aria-describedby="password-error"
            onChange={(e) => set("password", e.target.value)}
          />
        </Field>
        <Field
          label="Confirm password"
          htmlFor="confirmPassword"
          required
          error={errors.confirmPassword}
        >
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={values.confirmPassword}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby="confirmPassword-error"
            onChange={(e) => set("confirmPassword", e.target.value)}
          />
        </Field>
      </div>

      {formError && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-body-sm text-foreground"
        >
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-destructive" />
          {formError}
        </p>
      )}

      <Button type="submit" size="lg" disabled={busy}>
        {busy ? (
          <>
            <Loader2 aria-hidden className="animate-spin" />
            Creating account…
          </>
        ) : (
          <>
            Create account
            <ArrowRight aria-hidden />
          </>
        )}
      </Button>

      <p className="text-body-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-accent underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

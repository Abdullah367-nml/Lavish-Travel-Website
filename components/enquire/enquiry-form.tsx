// =============================================================================
// REPLACE THE WHOLE FILE: components/enquire/enquiry-form.tsx
//
// What changed from your original:
//  1. Added a "Where would you like to go?" field in Step 1, right after
//     the service picker — this is the actual fix for "couples choose their
//     own destination". Optional, since someone wanting a transfer has no
//     reason to fill it in.
//  2. Step 2's pickup/dropoff/flight-number fields now only render when the
//     service isn't "tours" — a couple planning a custom multi-day trip has
//     no single pickup/dropoff point the way an airport transfer does.
//  3. The review screen (Step 4) now shows "Destination" when one was given.
// Everything else — persistence, accessibility, consent handling, the
// multi-step mechanics — is untouched.
// =============================================================================
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Card, CardBody } from "@/components/ui/card";
import {
  SERVICE_LABELS,
  SERVICE_TYPES,
  STEP_FIELDS,
  enquirySchema,
  type ServiceType,
} from "@/lib/enquiry-schema";

const STORAGE_KEY = "lavish.enquiry.v1";
const TOTAL_STEPS = 4;

const STEP_TITLES = [
  "What do you need?",
  "When, and how many?",
  "How do we reach you?",
  "Anything else?",
];

type FormValues = {
  serviceType: ServiceType;
  itemSlug: string;
  destination: string;
  startDate: string;
  endDate: string;
  paxAdults: string;
  paxChildren: string;
  pickupAddress: string;
  dropoffAddress: string;
  flightNumber: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  companyName: string;
  specialRequests: string;
  consentProcessing: boolean;
  consentMarketing: boolean;
  website: string;
};

const EMPTY: FormValues = {
  serviceType: "transfers",
  itemSlug: "",
  destination: "",
  startDate: "",
  endDate: "",
  paxAdults: "2",
  paxChildren: "0",
  pickupAddress: "",
  dropoffAddress: "",
  flightNumber: "",
  fullName: "",
  email: "",
  phone: "",
  country: "",
  companyName: "",
  specialRequests: "",
  consentProcessing: false,
  consentMarketing: false,
  website: "",
};

type FieldErrors = Partial<Record<string, string>>;

export function EnquiryForm() {
  const searchParams = useSearchParams();

  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const [restored, setRestored] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);

  // A couple planning a custom trip has no single pickup/dropoff point —
  // those fields only make sense for a point-to-point transfer/chauffeur/
  // car-hire/group-shuttle style service.
  const showTransferFields = values.serviceType !== "tours";

  useEffect(() => {
    let next: FormValues = { ...EMPTY };

    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FormValues>;
        next = { ...next, ...parsed };
      }
    } catch {
      // Corrupt or unavailable storage (private mode, quota) — start clean.
    }

    const service = searchParams.get("service");
    if (service && (SERVICE_TYPES as readonly string[]).includes(service)) {
      next.serviceType = service as ServiceType;
    }
    const item = searchParams.get("item");
    if (item) next.itemSlug = item;

    /* eslint-disable react-hooks/set-state-in-effect -- hydration-safe
       restore from sessionStorage; see the comment above this effect. */
    setValues(next);
    setRestored(true);
    setMinDate(new Date().toISOString().slice(0, 10));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [searchParams]);

  useEffect(() => {
    if (!restored) return;
    try {
      const { website, consentProcessing, consentMarketing, ...safe } = values;
      void website;
      void consentProcessing;
      void consentMarketing;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    } catch {
      // Storage full or blocked — the form still works, it just will not
      // survive a reload.
    }
  }, [values, restored]);

  const set = useCallback(
    <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
      setValues((v) => ({ ...v, [key]: value }));
      setErrors((e) => {
        if (!e[key as string]) return e;
        const next = { ...e };
        delete next[key as string];
        return next;
      });
    },
    [],
  );

  const validateStep = useCallback(
    (index: number): boolean => {
      const result = enquirySchema.safeParse(values);
      if (result.success) return true;

      const all = z.flattenError(result.error).fieldErrors as Record<
        string,
        string[] | undefined
      >;
      const stepKeys = STEP_FIELDS[index] as readonly string[];
      const stepErrors: FieldErrors = {};
      for (const key of stepKeys) {
        const messages = all[key];
        if (messages?.length) stepErrors[key] = messages[0];
      }

      setErrors(stepErrors);
      return Object.keys(stepErrors).length === 0;
    },
    [values],
  );

  const goTo = useCallback((index: number) => {
    setStep(index);
    setFormError(null);
    requestAnimationFrame(() => headingRef.current?.focus());
  }, []);

  const next = useCallback(() => {
    if (!validateStep(step)) return;
    goTo(Math.min(step + 1, TOTAL_STEPS - 1));
  }, [goTo, step, validateStep]);

  const back = useCallback(() => {
    goTo(Math.max(step - 1, 0));
  }, [goTo, step]);

  const submit = useCallback(async () => {
    const result = enquirySchema.safeParse(values);
    if (!result.success) {
      const all = z.flattenError(result.error).fieldErrors as Record<
        string,
        string[] | undefined
      >;
      const flat: FieldErrors = {};
      for (const [key, messages] of Object.entries(all)) {
        if (messages?.length) flat[key] = messages[0];
      }
      setErrors(flat);

      const firstBadStep = STEP_FIELDS.findIndex((fields) =>
        (fields as readonly string[]).some((f) => flat[f]),
      );
      if (firstBadStep >= 0 && firstBadStep !== step) goTo(firstBadStep);
      setFormError("Some details need checking before we can send this.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as {
        ok: boolean;
        reference?: string;
        error?: string;
        fieldErrors?: Record<string, string[]>;
      };

      if (!response.ok || !data.ok) {
        if (data.fieldErrors) {
          const flat: FieldErrors = {};
          for (const [key, messages] of Object.entries(data.fieldErrors)) {
            if (messages?.length) flat[key] = messages[0];
          }
          setErrors(flat);
        }
        setFormError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setReference(data.reference ?? null);
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* nothing to clean up */
      }
    } catch {
      setFormError(
        "We could not reach the server. Check your connection, or WhatsApp us instead.",
      );
    } finally {
      setSubmitting(false);
    }
  }, [goTo, step, values]);

  const summary = useMemo(
    () => [
      { label: "Service", value: SERVICE_LABELS[values.serviceType] },
      ...(values.destination
        ? [{ label: "Destination", value: values.destination }]
        : []),
      { label: "Travelling from", value: values.startDate || "Not set" },
      { label: "Returning", value: values.endDate || "One way / not set" },
      {
        label: "Guests",
        value: `${values.paxAdults} adult${values.paxAdults === "1" ? "" : "s"}${
          Number(values.paxChildren) > 0 ? `, ${values.paxChildren} children` : ""
        }`,
      },
      { label: "Name", value: values.fullName || "—" },
      { label: "Email", value: values.email || "—" },
      { label: "Phone", value: values.phone || "—" },
    ],
    [values],
  );

  // --- Success -----------------------------------------------------------
  if (reference) {
    return (
      <Card className="rim-top">
        <CardBody className="flex flex-col items-start gap-5 p-8 sm:p-10">
          <CircleCheck aria-hidden className="size-9 text-success" />
          <h2 className="font-display text-display-sm uppercase text-foreground">
            Enquiry received
          </h2>
          <p className="text-body-md leading-relaxed text-muted-foreground">
            Your reference is{" "}
            <span className="font-display text-foreground">{reference}</span>.
            A consultant will come back to you with a quote and a suggested
            itinerary, usually within one working day.
          </p>
          <p className="text-body-sm leading-relaxed text-muted-foreground">
            If it is urgent, call us or send a WhatsApp and quote that
            reference — it saves repeating everything.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/tours">Browse tours</Link>
            </Button>
            <Button asChild variant="outline">
              <a href="tel:+27000000000">Call us</a>
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div>
      {/* --- Progress ------------------------------------------------------ */}
      <ol className="flex items-center gap-2" aria-label="Progress">
        {STEP_TITLES.map((title, index) => {
          const state =
            index < step ? "done" : index === step ? "current" : "todo";
          return (
            <li key={title} className="flex flex-1 items-center gap-2">
              <span className="flex flex-1 flex-col gap-2">
                <span
                  aria-hidden
                  className={
                    "h-0.5 w-full rounded-full transition-colors " +
                    (state === "todo" ? "bg-border" : "bg-accent")
                  }
                />
                <span
                  className={
                    "flex items-center gap-1.5 text-caption uppercase tracking-[0.14em] " +
                    (state === "todo" ? "text-muted-foreground" : "text-accent")
                  }
                >
                  {state === "done" && <Check aria-hidden className="size-3" />}
                  <span className="hidden sm:inline">{title}</span>
                  <span className="sm:hidden">
                    {index + 1}
                    <span className="sr-only"> — {title}</span>
                  </span>
                  {state === "current" && (
                    <span className="sr-only">(current step)</span>
                  )}
                </span>
              </span>
            </li>
          );
        })}
      </ol>

      <form
        className="mt-10"
        onSubmit={(e) => {
          e.preventDefault();
          if (step === TOTAL_STEPS - 1) void submit();
          else next();
        }}
        noValidate
      >
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-display-sm uppercase text-foreground outline-none"
        >
          {STEP_TITLES[step]}
        </h2>

        <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </div>

        <div className="mt-8">
          {/* --- Step 1 --------------------------------------------------- */}
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <fieldset>
                <legend className="text-caption font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Service needed
                </legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {SERVICE_TYPES.map((type) => {
                    const active = values.serviceType === type;
                    return (
                      <label
                        key={type}
                        className={
                          "flex min-h-[56px] cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 transition-colors " +
                          (active
                            ? "border-accent bg-accent/10"
                            : "border-border bg-surface hover:border-border-strong")
                        }
                      >
                        <input
                          type="radio"
                          name="serviceType"
                          value={type}
                          checked={active}
                          onChange={() => set("serviceType", type)}
                          className="size-4 accent-[var(--accent)]"
                        />
                        <span
                          className={
                            "text-body-sm " +
                            (active ? "text-foreground" : "text-muted-foreground")
                          }
                        >
                          {SERVICE_LABELS[type]}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <p
                  role="alert"
                  className={
                    "mt-3 text-caption text-destructive " +
                    (errors.serviceType ? "" : "sr-only")
                  }
                >
                  {errors.serviceType ?? ""}
                </p>
              </fieldset>

              <Field
                label="Where would you like to go?"
                htmlFor="destination"
                error={errors.destination}
                hint="One place, a few, or just a region — 'Stellenbosch and Hermanus', 'the Garden Route', 'not sure yet'. Leave blank if this isn't a trip."
              >
                <Input
                  id="destination"
                  name="destination"
                  placeholder="e.g. Cape Winelands, Kruger, a honeymoon somewhere coastal…"
                  value={values.destination}
                  aria-describedby="destination-error"
                  onChange={(e) => set("destination", e.target.value)}
                />
              </Field>

              {values.itemSlug ? (
                <p className="rounded-sm border border-border bg-surface px-4 py-3 text-body-sm text-muted-foreground">
                  Enquiring about{" "}
                  <span className="text-accent">{values.itemSlug}</span>. We
                  have kept that against your enquiry.
                </p>
              ) : null}
            </div>
          )}

          {/* --- Step 2 --------------------------------------------------- */}
          {step === 1 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <Field
                label="Travelling from"
                htmlFor="startDate"
                required
                error={errors.startDate}
                hint="An approximate date is fine"
              >
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  min={minDate}
                  value={values.startDate}
                  aria-invalid={Boolean(errors.startDate)}
                  aria-describedby="startDate-error"
                  onChange={(e) => set("startDate", e.target.value)}
                />
              </Field>

              <Field
                label="Returning"
                htmlFor="endDate"
                error={errors.endDate}
                hint="Leave blank for a one-way transfer"
              >
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  min={values.startDate || minDate}
                  value={values.endDate}
                  aria-invalid={Boolean(errors.endDate)}
                  aria-describedby="endDate-error"
                  onChange={(e) => set("endDate", e.target.value)}
                />
              </Field>

              <Field
                label="Adults"
                htmlFor="paxAdults"
                required
                error={errors.paxAdults}
              >
                <Input
                  id="paxAdults"
                  name="paxAdults"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={200}
                  value={values.paxAdults}
                  aria-invalid={Boolean(errors.paxAdults)}
                  aria-describedby="paxAdults-error"
                  onChange={(e) => set("paxAdults", e.target.value)}
                />
              </Field>

              <Field label="Children" htmlFor="paxChildren" error={errors.paxChildren}>
                <Input
                  id="paxChildren"
                  name="paxChildren"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={200}
                  value={values.paxChildren}
                  aria-describedby="paxChildren-error"
                  onChange={(e) => set("paxChildren", e.target.value)}
                />
              </Field>

              {showTransferFields && (
                <>
                  <Field
                    label="Pickup address"
                    htmlFor="pickupAddress"
                    error={errors.pickupAddress}
                    className="sm:col-span-2"
                  >
                    <Input
                      id="pickupAddress"
                      name="pickupAddress"
                      autoComplete="street-address"
                      placeholder="Hotel, airport or street address"
                      value={values.pickupAddress}
                      aria-describedby="pickupAddress-error"
                      onChange={(e) => set("pickupAddress", e.target.value)}
                    />
                  </Field>

                  <Field
                    label="Drop-off address"
                    htmlFor="dropoffAddress"
                    error={errors.dropoffAddress}
                  >
                    <Input
                      id="dropoffAddress"
                      name="dropoffAddress"
                      placeholder="Where you are going"
                      value={values.dropoffAddress}
                      aria-describedby="dropoffAddress-error"
                      onChange={(e) => set("dropoffAddress", e.target.value)}
                    />
                  </Field>

                  <Field
                    label="Flight number"
                    htmlFor="flightNumber"
                    error={errors.flightNumber}
                    hint="So we can track delays"
                  >
                    <Input
                      id="flightNumber"
                      name="flightNumber"
                      placeholder="e.g. BA 057"
                      value={values.flightNumber}
                      aria-describedby="flightNumber-error"
                      onChange={(e) => set("flightNumber", e.target.value)}
                    />
                  </Field>
                </>
              )}
            </div>
          )}

          {/* --- Step 3 --------------------------------------------------- */}
          {step === 2 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <Field
                label="Full name"
                htmlFor="fullName"
                required
                error={errors.fullName}
                className="sm:col-span-2"
              >
                <Input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  value={values.fullName}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby="fullName-error"
                  onChange={(e) => set("fullName", e.target.value)}
                />
              </Field>

              <Field label="Email" htmlFor="email" required error={errors.email}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={values.email}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby="email-error"
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>

              <Field
                label="Phone"
                htmlFor="phone"
                required
                error={errors.phone}
                hint="Include the country code"
              >
                <Input
                  id="phone"
                  name="phone"
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
                  name="country"
                  autoComplete="country-name"
                  value={values.country}
                  aria-describedby="country-error"
                  onChange={(e) => set("country", e.target.value)}
                />
              </Field>

              <Field
                label="Company"
                htmlFor="companyName"
                error={errors.companyName}
                hint="For corporate bookings"
              >
                <Input
                  id="companyName"
                  name="companyName"
                  autoComplete="organization"
                  value={values.companyName}
                  aria-describedby="companyName-error"
                  onChange={(e) => set("companyName", e.target.value)}
                />
              </Field>
            </div>
          )}

          {/* --- Step 4 --------------------------------------------------- */}
          {step === 3 && (
            <div className="flex flex-col gap-8">
              <Field
                label="Anything we should know"
                htmlFor="specialRequests"
                error={errors.specialRequests}
                hint="Dietary needs, mobility requirements, child seats, a rough budget — whatever helps"
              >
                <Textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows={5}
                  value={values.specialRequests}
                  aria-describedby="specialRequests-error"
                  onChange={(e) => set("specialRequests", e.target.value)}
                />
              </Field>

              {/* Review */}
              <div className="rounded-md border border-border bg-surface p-5">
                <h3 className="text-caption font-medium uppercase tracking-[0.18em] text-accent">
                  Review
                </h3>
                <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {summary.map((row) => (
                    <div key={row.label} className="flex flex-col">
                      <dt className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                        {row.label}
                      </dt>
                      <dd className="mt-0.5 text-body-sm text-foreground">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="mt-4 px-0"
                  onClick={() => goTo(0)}
                >
                  Change any of this
                </Button>
              </div>

              {/* POPIA consent — explicit, granular, never pre-ticked. */}
              <fieldset className="flex flex-col gap-4">
                <legend className="text-caption font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Permissions
                </legend>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    name="consentProcessing"
                    checked={values.consentProcessing}
                    onChange={(e) =>
                      set("consentProcessing", e.target.checked)
                    }
                    aria-invalid={Boolean(errors.consentProcessing)}
                    aria-describedby="consentProcessing-error"
                    className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
                  />
                  <span className="text-body-sm leading-relaxed text-muted-foreground">
                    I agree that Lavish Travels &amp; Tours may process these
                    details in order to prepare and send me a quote.{" "}
                    <Link href="/privacy" className="text-accent underline-offset-4 hover:underline">
                      Privacy policy
                    </Link>
                    .
                  </span>
                </label>
                <p
                  id="consentProcessing-error"
                  role="alert"
                  className={
                    "text-caption text-destructive " +
                    (errors.consentProcessing ? "" : "sr-only")
                  }
                >
                  {errors.consentProcessing ?? ""}
                </p>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    name="consentMarketing"
                    checked={values.consentMarketing}
                    onChange={(e) =>
                      set("consentMarketing", e.target.checked)
                    }
                    className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
                  />
                  <span className="text-body-sm leading-relaxed text-muted-foreground">
                    Optional: send me seasonal travel guidance and occasional
                    offers. You can unsubscribe at any time.
                  </span>
                </label>
              </fieldset>
            </div>
          )}
        </div>

        {/* --- Form-level error --------------------------------------------- */}
        {formError && (
          <p
            role="alert"
            className="mt-8 flex items-start gap-2.5 rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-body-sm text-foreground"
          >
            <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-destructive" />
            {formError}
          </p>
        )}

        {/* --- Navigation --------------------------------------------------- */}
        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={back}>
              <ArrowLeft aria-hidden />
              Back
            </Button>
          ) : (
            <span aria-hidden />
          )}

          {step < TOTAL_STEPS - 1 ? (
            <Button type="submit" size="lg">
              Continue
              <ArrowRight aria-hidden />
            </Button>
          ) : (
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 aria-hidden className="animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  Send enquiry
                  <ArrowRight aria-hidden />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
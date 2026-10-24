"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Loader2, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import type { Profile, TourDate, TourPackage } from "@/lib/types";
import { formatDate, formatZar } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Card, CardBody, CardMeta } from "@/components/ui/card";
import { createBooking, type BookingResult } from "@/app/book/[slug]/actions";

/**
 * Booking wizard: travellers → your details → review → confirm.
 *
 * The running total shown here is a *preview*. The authoritative figure is
 * calculated inside the database when the booking is created, from the tour's
 * own prices. If the two ever disagreed, the database wins — which is why the
 * form never submits a price.
 *
 * The seat cap comes from the departure the customer picked, so they cannot
 * even select more travellers than exist. The server enforces it again
 * regardless; this just avoids a pointless round trip.
 */


/**
 * Defined at module scope, not inside the wizard.
 *
 * A component declared during render is a brand-new type on every render, so
 * React unmounts and remounts the whole subtree each time — losing focus and
 * any internal state. The lint rule that catches this is worth heeding.
 */
function Counter({
  label,
  hint,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-5">
      <div>
        <p className="text-body-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-caption text-muted-foreground">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Remove one ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          <Minus aria-hidden />
        </Button>
        <span
          aria-live="polite"
          className="w-8 text-center font-display text-heading-md text-foreground"
        >
          {value}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Add one ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          <Plus aria-hidden />
        </Button>
      </div>
    </div>
  );
}

const STEPS = ["Travellers", "Your details", "Review"];

export function BookingWizard({
  tour,
  departure,
  profile,
}: {
  tour: TourPackage;
  departure: TourDate;
  profile: Profile;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [contact, setContact] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone ?? "",
    country: profile.country ?? "",
    pickupLocation: "",
    specialRequirements: "",
  });

  const [result, formAction, pending] = useActionState<BookingResult | null, FormData>(
    createBooking,
    null,
  );

  const childPrice = tour.priceChildZar ?? 0;
  const seats = adults + children;
  const maxSeats = departure.seatsRemaining;

  const totals = useMemo(() => {
    const adultTotal = adults * tour.priceFromZar;
    const childTotal = children * childPrice;
    return { adultTotal, childTotal, total: adultTotal + childTotal };
  }, [adults, children, childPrice, tour.priceFromZar]);

  /**
   * Navigate on success from an effect, not from the render body. Calling
   * router.push() during render mutates the router while React is still
   * rendering, which React warns about and which can fire twice.
   */
  useEffect(() => {
    if (result?.ok) router.push(`/booking/${result.reference}`);
  }, [result, router]);

  const set = (key: keyof typeof contact, value: string) =>
    setContact((c) => ({ ...c, [key]: value }));

  const contactValid =
    contact.firstName.trim().length >= 2 &&
    contact.lastName.trim().length >= 2 &&
    /.+@.+\..+/.test(contact.email) &&
    contact.phone.trim().length >= 7;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
      <div className="min-w-0">
        {/* Progress */}
        <ol className="flex items-center gap-2" aria-label="Booking progress">
          {STEPS.map((title, i) => (
            <li key={title} className="flex flex-1 flex-col gap-2">
              <span
                aria-hidden
                className={`h-0.5 w-full rounded-full ${i <= step ? "bg-accent" : "bg-border"}`}
              />
              <span
                className={`text-caption uppercase tracking-[0.14em] ${
                  i <= step ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {title}
                {i === step && <span className="sr-only"> (current step)</span>}
              </span>
            </li>
          ))}
        </ol>

        <form action={formAction} className="mt-10">
          {/* Values the server needs, regardless of which step is visible. */}
          <input type="hidden" name="tourDateId" value={departure.id} />
          <input type="hidden" name="adults" value={adults} />
          <input type="hidden" name="children" value={children} />
          <input type="hidden" name="firstName" value={contact.firstName} />
          <input type="hidden" name="lastName" value={contact.lastName} />
          <input type="hidden" name="email" value={contact.email} />
          <input type="hidden" name="phone" value={contact.phone} />
          <input type="hidden" name="country" value={contact.country} />
          <input type="hidden" name="pickupLocation" value={contact.pickupLocation} />
          <input
            type="hidden"
            name="specialRequirements"
            value={contact.specialRequirements}
          />

          {step === 0 && (
            <section aria-labelledby="travellers-heading">
              <h2
                id="travellers-heading"
                className="font-display text-heading-lg uppercase tracking-wide text-foreground"
              >
                How many travelling?
              </h2>
              <p className="mt-2 text-body-sm text-muted-foreground">
                {maxSeats} seat{maxSeats === 1 ? "" : "s"} left on this departure.
              </p>

              <div className="mt-6">
                <Counter
                  label="Adults"
                  hint={`${formatZar(tour.priceFromZar)} each`}
                  value={adults}
                  min={1}
                  max={Math.max(1, maxSeats - children)}
                  onChange={setAdults}
                />
                {childPrice > 0 ? (
                  <Counter
                    label="Children"
                    hint={`${formatZar(childPrice)} each`}
                    value={children}
                    min={0}
                    max={Math.max(0, maxSeats - adults)}
                    onChange={setChildren}
                  />
                ) : (
                  <p className="border-b border-border py-5 text-body-sm text-muted-foreground">
                    This tour is adults only.
                  </p>
                )}
              </div>

              {seats >= maxSeats && (
                <p className="mt-5 text-caption text-accent">
                  That is every remaining seat on this departure.
                </p>
              )}
            </section>
          )}

          {step === 1 && (
            <section aria-labelledby="details-heading">
              <h2
                id="details-heading"
                className="font-display text-heading-lg uppercase tracking-wide text-foreground"
              >
                Who is travelling?
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <Field label="First name" htmlFor="bk-first" required>
                  <Input
                    id="bk-first"
                    value={contact.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                  />
                </Field>
                <Field label="Last name" htmlFor="bk-last" required>
                  <Input
                    id="bk-last"
                    value={contact.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                  />
                </Field>
                <Field label="Email" htmlFor="bk-email" required>
                  <Input
                    id="bk-email"
                    type="email"
                    value={contact.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </Field>
                <Field label="Phone" htmlFor="bk-phone" required>
                  <Input
                    id="bk-phone"
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </Field>
                <Field label="Country" htmlFor="bk-country">
                  <Input
                    id="bk-country"
                    value={contact.country}
                    onChange={(e) => set("country", e.target.value)}
                  />
                </Field>
                <Field
                  label="Pickup location"
                  htmlFor="bk-pickup"
                  hint="Hotel or address"
                >
                  <Input
                    id="bk-pickup"
                    value={contact.pickupLocation}
                    onChange={(e) => set("pickupLocation", e.target.value)}
                  />
                </Field>
                <Field
                  label="Special requirements"
                  htmlFor="bk-special"
                  hint="Dietary needs, mobility, child seats"
                  className="sm:col-span-2"
                >
                  <Textarea
                    id="bk-special"
                    rows={4}
                    value={contact.specialRequirements}
                    onChange={(e) => set("specialRequirements", e.target.value)}
                  />
                </Field>
              </div>
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="review-heading">
              <h2
                id="review-heading"
                className="font-display text-heading-lg uppercase tracking-wide text-foreground"
              >
                Review your booking
              </h2>
              <dl className="mt-6 flex flex-col divide-y divide-border border-y border-border">
                {[
                  ["Tour", tour.title],
                  ["Departure", formatDate(departure.date)],
                  [
                    "Travellers",
                    `${adults} adult${adults === 1 ? "" : "s"}${
                      children > 0 ? `, ${children} child${children === 1 ? "" : "ren"}` : ""
                    }`,
                  ],
                  ["Name", `${contact.firstName} ${contact.lastName}`],
                  ["Email", contact.email],
                  ["Phone", contact.phone],
                  ["Pickup", contact.pickupLocation || "To be confirmed"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-6 py-3.5">
                    <dt className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="text-right text-body-sm text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 text-caption leading-relaxed text-muted-foreground">
                Your booking is created as <strong className="text-foreground">pending</strong>.
                A consultant confirms it and sends payment instructions — no card
                details are taken on this site.
              </p>
            </section>
          )}

          {result && !result.ok && (
            <p
              role="alert"
              className="mt-8 flex items-start gap-2.5 rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-body-sm text-foreground"
            >
              <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-destructive" />
              {result.error}
            </p>
          )}

          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-border pt-8 sm:flex-row sm:justify-between">
            {step > 0 ? (
              <Button type="button" variant="ghost" onClick={() => setStep(step - 1)}>
                <ArrowLeft aria-hidden />
                Back
              </Button>
            ) : (
              <span aria-hidden />
            )}

            {step < 2 ? (
              <Button
                type="button"
                size="lg"
                disabled={step === 1 && !contactValid}
                onClick={() => setStep(step + 1)}
              >
                Continue
                <ArrowRight aria-hidden />
              </Button>
            ) : (
              <Button type="submit" size="lg" disabled={pending}>
                {pending ? (
                  <>
                    <Loader2 aria-hidden className="animate-spin" />
                    Confirming…
                  </>
                ) : (
                  <>
                    Confirm booking
                    <ArrowRight aria-hidden />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Running summary — visible at every step, per Part 6. */}
      <aside>
        <div className="lg:sticky lg:top-24">
          <Card className="rim-top">
            <CardBody className="flex flex-col gap-4">
              <div>
                <CardMeta>Your booking</CardMeta>
                <p className="mt-2 text-body-sm text-foreground">{tour.title}</p>
                <p className="mt-1 text-caption text-muted-foreground">
                  {formatDate(departure.date)}
                </p>
              </div>

              <dl className="flex flex-col gap-2 border-t border-border pt-4">
                <div className="flex justify-between text-body-sm">
                  <dt className="text-muted-foreground">
                    {adults} × adult
                  </dt>
                  <dd className="text-foreground">{formatZar(totals.adultTotal)}</dd>
                </div>
                {children > 0 && (
                  <div className="flex justify-between text-body-sm">
                    <dt className="text-muted-foreground">
                      {children} × child
                    </dt>
                    <dd className="text-foreground">{formatZar(totals.childTotal)}</dd>
                  </div>
                )}
              </dl>

              <div className="flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                  Total
                </span>
                <span className="font-display text-heading-lg uppercase text-foreground">
                  {formatZar(totals.total)}
                </span>
              </div>

              <p className="text-caption text-muted-foreground">
                VAT inclusive. Confirmed against the tour price by the server
                when you submit.
              </p>
            </CardBody>
          </Card>
        </div>
      </aside>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Ticket } from "lucide-react";
import { getMyBookings, splitBookings } from "@/lib/bookings";
import { getProfile, requireUser } from "@/lib/auth";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { BookingCard } from "@/components/booking/booking-card";

/** A customer's own bookings — never cached, never shared between users. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Bookings",
  alternates: { canonical: "/my-bookings" },
  robots: { index: false, follow: false },
};

export default async function MyBookingsPage() {
  await requireUser("/my-bookings");
  const [profile, bookings] = await Promise.all([getProfile(), getMyBookings()]);
  const { upcoming, past } = splitBookings(bookings);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "My Bookings", href: "/my-bookings" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs items={crumbs} />

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-lit font-display text-display-sm uppercase text-foreground">
            My Bookings
          </h1>
          {profile && (
            <p className="mt-2 text-body-sm text-muted-foreground">
              Signed in as {profile.email}
            </p>
          )}
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/tours">Book another tour</Link>
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="rim-top surface-metal relative mt-12 rounded-md border border-border p-8 text-center sm:p-12">
          <Ticket aria-hidden className="mx-auto size-7 text-accent" />
          <h2 className="mt-5 font-display text-heading-md uppercase tracking-wide text-foreground">
            No bookings yet
          </h2>
          <p className="mx-auto mt-3 max-w-md text-body-sm leading-relaxed text-muted-foreground">
            When you book a tour it will appear here, with its reference
            number, date, travellers and payment status.
          </p>
          <Button asChild className="mt-7">
            <Link href="/tours">Browse tours</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-12 flex flex-col gap-14">
          <section aria-labelledby="upcoming-heading">
            <h2
              id="upcoming-heading"
              className="font-display text-heading-lg uppercase tracking-wide text-foreground"
            >
              Upcoming
            </h2>
            {upcoming.length > 0 ? (
              <ul className="mt-6 flex flex-col gap-4">
                {upcoming.map((b) => (
                  <li key={b.id}>
                    <BookingCard booking={b} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-body-sm text-muted-foreground">
                Nothing coming up.
              </p>
            )}
          </section>

          {past.length > 0 && (
            <section aria-labelledby="past-heading">
              <h2
                id="past-heading"
                className="font-display text-heading-lg uppercase tracking-wide text-foreground"
              >
                Past &amp; cancelled
              </h2>
              <ul className="mt-6 flex flex-col gap-4">
                {past.map((b) => (
                  <li key={b.id}>
                    <BookingCard booking={b} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

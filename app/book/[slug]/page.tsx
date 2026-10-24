import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { getTourDateById, getTours, getBookableTourDates } from "@/lib/data";
import { getProfile, requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookingWizard } from "@/components/booking/booking-wizard";

/** Seat counts change by the second — never serve a cached copy of this. */
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "Complete your booking",
    alternates: { canonical: `/book/${slug}` },
    robots: { index: false, follow: false },
  };
}

export default async function BookPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { date: dateId } = await searchParams;

  const tours = await getTours();
  const tour = tours.find((t) => t.slug === slug);
  if (!tour) notFound();

  // Sign-in required, returning here afterwards with the chosen date intact.
  const returnTo = `/book/${slug}${dateId ? `?date=${dateId}` : ""}`;
  await requireUser(returnTo);
  const profile = await getProfile();
  if (!profile) notFound();

  const departure = dateId ? await getTourDateById(dateId) : null;
  const detailHref = `/tours/${tour.destinationSlug}/${tour.slug}`;

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Tours", href: "/tours" },
    { label: tour.title, href: detailHref },
    { label: "Book", href: `/book/${slug}` },
  ];

  // No date chosen, or the chosen one is no longer bookable — offer the
  // alternatives rather than a dead end.
  const bookable =
    departure &&
    (departure.availability === "available" || departure.availability === "limited");

  if (!bookable) {
    const options = await getBookableTourDates(tour.slug);
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Breadcrumbs items={crumbs} />
        <h1 className="text-lit mt-8 font-display text-display-sm uppercase text-foreground">
          Choose a departure
        </h1>
        <p className="mt-4 text-body-sm leading-relaxed text-muted-foreground">
          {departure
            ? "That departure is no longer available. Here is what is still open."
            : "Pick a date to continue with your booking."}
        </p>

        {options.length > 0 ? (
          <ul className="mt-8 flex flex-col gap-3">
            {options.slice(0, 10).map((d) => (
              <li key={d.id}>
                <Card interactive>
                  <Link
                    href={`/book/${slug}?date=${d.id}`}
                    className="flex items-center justify-between gap-4 p-5 outline-none"
                  >
                    <span className="flex items-center gap-3">
                      <CalendarDays aria-hidden className="size-4 text-accent" />
                      <span className="text-body-sm text-foreground">
                        {formatDate(d.date)}
                      </span>
                    </span>
                    <span className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                      {d.seatsRemaining} left
                    </span>
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 rounded-md border border-border bg-surface p-6 text-body-sm text-muted-foreground">
            Every scheduled departure is full. Request a custom date and we will
            see what we can arrange.
          </p>
        )}

        <div className="mt-8 flex gap-3">
          <Button asChild variant="outline">
            <Link href={detailHref}>Back to the tour</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={`/enquire?service=tours&item=${tour.slug}`}>
              Request a custom date
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs items={crumbs} />
      <h1 className="text-lit mt-8 font-display text-display-sm uppercase text-foreground">
        Book {tour.title}
      </h1>
      <div className="mt-10">
        <BookingWizard tour={tour} departure={departure} profile={profile} />
      </div>
    </div>
  );
}

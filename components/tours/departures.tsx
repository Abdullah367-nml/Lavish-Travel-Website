import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import type { TourDate } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * Live departure list.
 *
 * Seat counts come from the `tour_date_availability` view — the same
 * definition the booking function enforces — so what a customer is told here
 * and what the database will actually allow can never drift apart.
 *
 * Sold-out and closed dates are shown rather than hidden. Seeing that the
 * 15th is full is useful information; a date silently missing from the list
 * just looks like an incomplete schedule.
 */

const LABELS: Record<
  TourDate["availability"],
  { text: string; variant: "accent" | "subtle" | "outline" | "default" }
> = {
  available: { text: "Available", variant: "subtle" },
  limited: { text: "Almost full", variant: "accent" },
  sold_out: { text: "Fully booked", variant: "outline" },
  closed: { text: "Closed", variant: "outline" },
  past: { text: "Departed", variant: "outline" },
};

export function Departures({
  dates,
  tourSlug,
  limit = 8,
}: {
  dates: TourDate[];
  tourSlug: string;
  limit?: number;
}) {
  if (dates.length === 0) {
    return (
      <div className="rounded-md border border-border bg-surface p-6">
        <p className="text-body-sm leading-relaxed text-muted-foreground">
          No scheduled departures are loaded for this tour yet. We run it on
          request — tell us your dates and we will confirm availability.
        </p>
        <Button asChild className="mt-5">
          <Link href={`/enquire?service=tours&item=${tourSlug}`}>
            Request these dates
          </Link>
        </Button>
      </div>
    );
  }

  const shown = dates.slice(0, limit);

  return (
    <div>
      <ul className="flex flex-col gap-3">
        {shown.map((date) => {
          const label = LABELS[date.availability];
          const bookable =
            date.availability === "available" || date.availability === "limited";

          return (
            <li key={date.id}>
              <Card className={bookable ? "" : "opacity-60"}>
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <CalendarDays
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-accent"
                    />
                    <div>
                      <p className="text-body-sm font-medium text-foreground">
                        {formatDate(date.date)}
                      </p>
                      <p className="mt-1 text-caption uppercase tracking-[0.14em] text-muted-foreground">
                        {date.availability === "sold_out"
                          ? "No seats left"
                          : date.availability === "closed"
                            ? "Not open for booking"
                            : `${date.seatsRemaining} of ${date.capacity} seats left`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:justify-end">
                    <Badge variant={label.variant}>{label.text}</Badge>
                    {bookable && (
                      <Button asChild size="sm">
                        <Link href={`/book/${tourSlug}?date=${date.id}`}>
                          Book
                          <ArrowRight aria-hidden />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>

      {dates.length > limit && (
        <p className="mt-4 text-caption text-muted-foreground">
          Showing the next {limit} of {dates.length} departures. Ask us if you
          need a date further out.
        </p>
      )}
    </div>
  );
}

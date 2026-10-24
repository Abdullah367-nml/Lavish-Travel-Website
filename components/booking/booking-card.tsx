import Link from "next/link";
import { CalendarDays, MapPin, Users, ArrowRight } from "lucide-react";
import type { Booking } from "@/lib/types";
import { formatDate, formatZar } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardMeta } from "@/components/ui/card";
import { CancelBookingButton } from "./cancel-booking-button";

/**
 * A booking, as the customer sees it.
 *
 * Both statuses are shown because they answer different questions: booking
 * status is "am I going?", payment status is "do I still owe money?". Showing
 * only one is how support calls start.
 */

const BOOKING_BADGE: Record<
  Booking["bookingStatus"],
  { label: string; variant: "accent" | "subtle" | "outline" | "default" }
> = {
  pending: { label: "Pending", variant: "default" },
  confirmed: { label: "Confirmed", variant: "subtle" },
  cancelled: { label: "Cancelled", variant: "outline" },
  completed: { label: "Completed", variant: "outline" },
  no_show: { label: "No show", variant: "outline" },
};

const PAYMENT_BADGE: Record<
  NonNullable<Booking["paymentStatus"]>,
  { label: string; variant: "accent" | "subtle" | "outline" | "default" }
> = {
  pending: { label: "Payment pending", variant: "default" },
  paid: { label: "Paid", variant: "subtle" },
  failed: { label: "Payment failed", variant: "outline" },
  refunded: { label: "Refunded", variant: "outline" },
};

export function BookingCard({ booking }: { booking: Booking }) {
  const status = BOOKING_BADGE[booking.bookingStatus];
  const payment = PAYMENT_BADGE[booking.paymentStatus ?? "pending"];
  const dimmed =
    booking.bookingStatus === "cancelled" || booking.bookingStatus === "no_show";

  return (
    <Card className={dimmed ? "opacity-70" : ""}>
      <CardBody className="flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardMeta>Booking {booking.reference}</CardMeta>
            <h3 className="mt-2 font-display text-heading-md uppercase tracking-wide text-foreground">
              {booking.tourName ?? "Tour"}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={status.variant}>{status.label}</Badge>
            <Badge variant={payment.variant}>{payment.label}</Badge>
          </div>
        </div>

        <dl className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {booking.destinationName && (
            <div className="flex items-start gap-2.5">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              <div>
                <dt className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                  Destination
                </dt>
                <dd className="mt-0.5 text-body-sm text-foreground">
                  {booking.destinationName}
                </dd>
              </div>
            </div>
          )}
          {booking.tourDate && (
            <div className="flex items-start gap-2.5">
              <CalendarDays aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              <div>
                <dt className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                  Date
                </dt>
                <dd className="mt-0.5 text-body-sm text-foreground">
                  {formatDate(booking.tourDate)}
                </dd>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2.5">
            <Users aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
            <div>
              <dt className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                Travellers
              </dt>
              <dd className="mt-0.5 text-body-sm text-foreground">
                {booking.adults} adult{booking.adults === 1 ? "" : "s"}
                {booking.children > 0 &&
                  `, ${booking.children} child${booking.children === 1 ? "" : "ren"}`}
              </dd>
            </div>
          </div>
          <div>
            <dt className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
              Total
            </dt>
            <dd className="mt-0.5 font-display text-heading-sm uppercase text-foreground">
              {formatZar(booking.totalAmountZar)}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <Button asChild variant="outline" size="sm">
            <Link href={`/booking/${booking.reference}`}>
              View Details
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          {booking.bookingStatus !== "cancelled" && booking.bookingStatus !== "completed" && (
            <CancelBookingButton
              bookingId={booking.id}
              reference={booking.reference}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
}

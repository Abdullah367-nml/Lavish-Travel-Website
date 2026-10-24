import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleCheck, ArrowLeft } from "lucide-react";
import { getBookingByReference } from "@/lib/bookings";
import { requireUser } from "@/lib/auth";
import { formatDate, formatZar } from "@/lib/format";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardMeta } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DownloadVoucherButton } from "@/components/booking/download-voucher-button";
import { CancelBookingButton } from "@/components/booking/cancel-booking-button";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ reference: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { reference } = await params;
  return {
    title: `Booking ${reference}`,
    robots: { index: false, follow: false },
  };
}

/**
 * Booking detail and confirmation.
 *
 * Note there is no ownership check written here. There does not need to be:
 * the row-level security policy on `bookings` means a query for someone
 * else's reference simply returns nothing, and the customer sees a 404. The
 * check lives in the database, where it cannot be forgotten.
 */
export default async function BookingDetailPage({ params }: Props) {
  const { reference } = await params;
  await requireUser(`/booking/${reference}`);

  const booking = await getBookingByReference(reference);
  if (!booking) notFound();

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "My Bookings", href: "/my-bookings" },
    { label: booking.reference, href: `/booking/${booking.reference}` },
  ];

  const rows: [string, string][] = [
    ["Booking ID", booking.reference],
    ["Tour", booking.tourName ?? "—"],
    ["Destination", booking.destinationName ?? "—"],
    ["Date", booking.tourDate ? formatDate(booking.tourDate) : "—"],
    [
      "Travellers",
      `${booking.adults} adult${booking.adults === 1 ? "" : "s"}` +
        (booking.children > 0
          ? `, ${booking.children} child${booking.children === 1 ? "" : "ren"}`
          : ""),
    ],
    ["Pickup location", booking.pickupLocation || "To be confirmed"],
    ["Lead traveller", `${booking.contactFirstName} ${booking.contactLastName}`],
    ["Email", booking.contactEmail],
    ["Phone", booking.contactPhone],
    ["Total", formatZar(booking.totalAmountZar)],
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs items={crumbs} />

      <div className="mt-8 flex items-start gap-4">
        <CircleCheck aria-hidden className="mt-1 size-8 shrink-0 text-success" />
        <div>
          <h1 className="text-lit font-display text-display-sm uppercase text-foreground">
            Booking {booking.bookingStatus === "cancelled" ? "cancelled" : "received"}
          </h1>
          <p className="mt-2 text-body-sm text-muted-foreground">
            Reference{" "}
            <span className="font-display text-foreground">{booking.reference}</span>
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge variant="subtle">Booking: {booking.bookingStatus}</Badge>
        <Badge variant="default">Payment: {booking.paymentStatus}</Badge>
      </div>

      <Card className="rim-top mt-8">
        <CardBody>
          <CardMeta>Booking details</CardMeta>
          <dl className="mt-4 flex flex-col divide-y divide-border">
            {rows.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-6 py-3.5">
                <dt className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                  {label}
                </dt>
                <dd className="text-right text-body-sm text-foreground">{value}</dd>
              </div>
            ))}
          </dl>

          {booking.specialRequirements && (
            <div className="mt-6 border-t border-border pt-4">
              <CardMeta>Special requirements</CardMeta>
              <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">
                {booking.specialRequirements}
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="mt-8 rounded-md border border-accent/30 bg-accent/5 p-6">
        <h2 className="font-display text-heading-sm uppercase tracking-wide text-foreground">
          What happens next
        </h2>
        <p className="mt-3 text-body-sm leading-relaxed text-muted-foreground">
          Your seats are held. A consultant confirms the booking and sends
          payment instructions by email. No card details are taken on this
          site — payment is by EFT or a secure gateway link.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/my-bookings">
              <ArrowLeft aria-hidden className="mr-2 size-4" />
              View My Booking
            </Link>
          </Button>
          <DownloadVoucherButton reference={booking.reference} />
          <Button asChild variant="outline">
            <Link href="/tours">Back to Tours</Link>
          </Button>
        </div>
        {booking.bookingStatus !== "cancelled" && booking.bookingStatus !== "completed" && (
          <CancelBookingButton
            bookingId={booking.id}
            reference={booking.reference}
          />
        )}
      </div>
    </div>
  );
}

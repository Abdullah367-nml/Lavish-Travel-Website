import Link from "next/link";
import { Search } from "lucide-react";
import { getAdminBookings, type BookingFilters } from "@/lib/admin";
import { formatDate, formatZar } from "@/lib/format";
import type { BookingStatus, PaymentStatus } from "@/lib/types";
import { Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { BookingActions } from "@/components/admin/booking-actions";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const BOOKING_STATUSES: BookingStatus[] = [
  "pending", "confirmed", "completed", "cancelled", "no_show",
];
const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

/**
 * Booking management.
 *
 * Filters are a plain GET form, so a filtered view is a URL an admin can
 * bookmark or paste to a colleague — "here are today's unpaid bookings" is a
 * link rather than a set of instructions. No JavaScript involved.
 */
export default async function AdminBookingsPage({ searchParams }: Props) {
  const params = await searchParams;

  const statusParam = first(params.status);
  const paymentParam = first(params.payment);
  const search = first(params.search)?.slice(0, 80) ?? "";

  const filters: BookingFilters = {
    status: BOOKING_STATUSES.find((s) => s === statusParam),
    payment: PAYMENT_STATUSES.find((s) => s === paymentParam),
    search: search || undefined,
  };

  const bookings = await getAdminBookings(filters);
  const hasFilters = Boolean(filters.status || filters.payment || filters.search);
  const totalValue = bookings
    .filter((b) => b.bookingStatus !== "cancelled")
    .reduce((sum, b) => sum + b.totalAmountZar, 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm uppercase text-foreground">
            Bookings
          </h1>
          <p className="mt-2 text-body-sm text-muted-foreground">
            {bookings.length} booking{bookings.length === 1 ? "" : "s"}
            {hasFilters && " matching your filters"} &middot;{" "}
            {formatZar(totalValue)} excluding cancellations
          </p>
        </div>
      </div>

      {/* --- Filters: a plain GET form, so the URL carries the state ------- */}
      <form
        method="get"
        className="mt-8 flex flex-wrap items-end gap-3 rounded-md border border-border bg-surface p-4"
      >
        <div className="min-w-[220px] flex-1">
          <label
            htmlFor="search"
            className="block text-caption uppercase tracking-[0.16em] text-muted-foreground"
          >
            Search
          </label>
          <div className="relative mt-2">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="search"
              name="search"
              defaultValue={search}
              placeholder="Reference, name or email"
              className="pl-9"
            />
          </div>
        </div>

        <div className="w-[160px]">
          <label
            htmlFor="status"
            className="block text-caption uppercase tracking-[0.16em] text-muted-foreground"
          >
            Booking status
          </label>
          <div className="mt-2">
            <Select id="status" name="status" defaultValue={statusParam ?? ""}>
              <option value="">Any</option>
              {BOOKING_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="w-[150px]">
          <label
            htmlFor="payment"
            className="block text-caption uppercase tracking-[0.16em] text-muted-foreground"
          >
            Payment
          </label>
          <div className="mt-2">
            <Select id="payment" name="payment" defaultValue={paymentParam ?? ""}>
              <option value="">Any</option>
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <Button type="submit">Filter</Button>
        {hasFilters && (
          <Button asChild variant="ghost">
            <Link href="/admin/bookings">Clear</Link>
          </Button>
        )}
      </form>

      {/* --- Results -------------------------------------------------------- */}
      {bookings.length === 0 ? (
        <p className="mt-8 rounded-md border border-border bg-surface p-8 text-center text-body-sm text-muted-foreground">
          {hasFilters
            ? "No bookings match those filters."
            : "No bookings yet."}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-surface">
                {[
                  "Reference", "Customer", "Tour", "Departure",
                  "Guests", "Pickup", "Total", "Status",
                ].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-3 text-caption font-medium uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className={
                    "border-b border-border last:border-0 " +
                    (b.bookingStatus === "cancelled" ? "opacity-60" : "")
                  }
                >
                  <td className="px-4 py-4 align-top">
                    <p className="font-display text-body-sm text-foreground">
                      {b.reference}
                    </p>
                    <p className="mt-1 text-caption text-muted-foreground">
                      {formatDate(b.createdAt.slice(0, 10))}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="text-body-sm text-foreground">
                      {b.contactFirstName} {b.contactLastName}
                    </p>
                    <p className="mt-1 text-caption text-muted-foreground">
                      {b.contactEmail}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {b.contactPhone}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="text-body-sm text-foreground">{b.tourName ?? "—"}</p>
                    <p className="mt-1 text-caption text-muted-foreground">
                      {b.destinationName ?? ""}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top text-body-sm text-muted-foreground">
                    {b.tourDate ? formatDate(b.tourDate) : "—"}
                  </td>
                  <td className="px-4 py-4 align-top text-body-sm text-muted-foreground">
                    {b.adults}A{b.children > 0 && ` + ${b.children}C`}
                  </td>
                  <td className="px-4 py-4 align-top text-caption text-muted-foreground">
                    {b.pickupLocation || "—"}
                  </td>
                  <td className="px-4 py-4 align-top text-body-sm text-foreground">
                    {formatZar(b.totalAmountZar)}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <BookingActions booking={b} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-caption leading-relaxed text-muted-foreground">
        Cancelling a booking releases its seats back to the departure
        immediately. Reinstating one is refused if those seats have since been
        sold — the database checks under a lock rather than trusting this page.
      </p>
    </div>
  );
}

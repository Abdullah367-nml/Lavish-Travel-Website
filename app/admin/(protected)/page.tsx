import Link from "next/link";
import {
  Map,
  Ticket,
  Users,
  CalendarDays,
  Banknote,
  Clock,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { getAdminBookings, getAdminStats } from "@/lib/admin";
import { formatDate, formatZar } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardMeta } from "@/components/ui/card";

export const dynamic = "force-dynamic";

/**
 * Admin dashboard.
 *
 * Six numbers and a recent-bookings table. Deliberately not more: a
 * dashboard nobody can read at a glance is a dashboard nobody reads. The
 * charts the brief mentions belong on the Reports page, where someone has
 * gone looking for them.
 */
export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([
    getAdminStats(),
    getAdminBookings(),
  ]);

  const tiles = [
    { label: "Tours", value: String(stats.totalTours), hint: `${stats.publishedTours} published`, icon: Map, href: "/admin/tours" },
    { label: "Bookings", value: String(stats.totalBookings), hint: `${stats.pendingBookings} pending`, icon: Ticket, href: "/admin/bookings" },
    { label: "Upcoming departures", value: String(stats.upcomingDepartures), hint: "open for booking", icon: CalendarDays, href: "/admin/tour-dates" },
    { label: "Customers", value: String(stats.totalCustomers), hint: "registered", icon: Users, href: "/admin/customers" },
    { label: "Booked value", value: formatZar(stats.totalRevenueZar), hint: "excludes cancelled", icon: Banknote, href: "/admin/reports" },
    { label: "Received", value: formatZar(stats.paidRevenueZar), hint: "payments marked paid", icon: Clock, href: "/admin/payments" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm uppercase text-foreground">
            Dashboard
          </h1>
          <p className="mt-2 text-body-sm text-muted-foreground">
            Everything below is live from the database.
          </p>
        </div>
        {stats.newEnquiries > 0 && (
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-2 rounded-sm border border-accent/40 bg-accent/10 px-4 py-2.5 text-body-sm text-foreground transition-colors hover:bg-accent/20"
          >
            <Inbox aria-hidden className="size-4 text-accent" />
            {stats.newEnquiries} new custom-trip enquir
            {stats.newEnquiries === 1 ? "y" : "ies"}
          </Link>
        )}
      </div>

      {/* --- Stat tiles ---------------------------------------------------- */}
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map((tile) => (
          <li key={tile.label}>
            <Card interactive className="h-full">
              <Link href={tile.href} className="block outline-none">
                <CardBody className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <CardMeta>{tile.label}</CardMeta>
                    <p className="mt-2 font-display text-display-sm uppercase text-foreground">
                      {tile.value}
                    </p>
                    <p className="mt-1 text-caption text-muted-foreground">
                      {tile.hint}
                    </p>
                  </div>
                  <tile.icon aria-hidden className="size-5 shrink-0 text-accent" />
                </CardBody>
              </Link>
            </Card>
          </li>
        ))}
      </ul>

      {/* --- Recent bookings ------------------------------------------------ */}
      <section className="mt-12" aria-labelledby="recent-heading">
        <div className="flex items-end justify-between gap-4">
          <h2
            id="recent-heading"
            className="font-display text-heading-lg uppercase tracking-wide text-foreground"
          >
            Recent bookings
          </h2>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-2 text-caption uppercase tracking-[0.16em] text-accent hover:text-accent-hover"
          >
            All bookings
            <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="mt-6 rounded-md border border-border bg-surface p-6 text-body-sm text-muted-foreground">
            No bookings yet. They will appear here the moment a customer
            completes one.
          </p>
        ) : (
          /* Horizontal scroll rather than a squashed table — on a phone,
             a table that fits is a table you cannot read. */
          <div className="mt-6 overflow-x-auto rounded-md border border-border">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-surface">
                  {["Reference", "Customer", "Tour", "Date", "Guests", "Total", "Status"].map((h) => (
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
                {recent.slice(0, 8).map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/bookings?search=${b.reference}`}
                        className="font-display text-body-sm text-accent hover:underline"
                      >
                        {b.reference}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-body-sm text-foreground">
                      {b.contactFirstName} {b.contactLastName}
                    </td>
                    <td className="px-4 py-3 text-body-sm text-muted-foreground">
                      {b.tourName ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-body-sm text-muted-foreground">
                      {b.tourDate ? formatDate(b.tourDate) : "—"}
                    </td>
                    <td className="px-4 py-3 text-body-sm text-muted-foreground">
                      {b.adults + b.children}
                    </td>
                    <td className="px-4 py-3 text-body-sm text-foreground">
                      {formatZar(b.totalAmountZar)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant={b.bookingStatus === "confirmed" ? "subtle" : "default"}>
                          {b.bookingStatus}
                        </Badge>
                        <Badge variant={b.paymentStatus === "paid" ? "subtle" : "outline"}>
                          {b.paymentStatus}
                        </Badge>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

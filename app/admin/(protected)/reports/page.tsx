import { getAdminReports } from "@/lib/admin";
import { formatZar } from "@/lib/format";
import {
  TrendingUp,
  Ticket,
  DollarSign,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const reports = await getAdminReports();

  const confirmedCount =
    reports.bookingsByStatus.find((s) => s.status === "confirmed")?.count ?? 0;
  const pendingCount =
    reports.bookingsByStatus.find((s) => s.status === "pending")?.count ?? 0;
  const completedCount =
    reports.bookingsByStatus.find((s) => s.status === "completed")?.count ?? 0;
  const cancelledCount =
    reports.bookingsByStatus.find((s) => s.status === "cancelled")?.count ?? 0;

  return (
    <div>
      <div>
        <h1 className="font-display text-display-sm uppercase text-foreground">
          Business Reports &amp; Analytics
        </h1>
        <p className="mt-2 text-body-sm text-muted-foreground">
          Financial performance, booking volume, popular destinations, and tour demand.
        </p>
      </div>

      {/* Top Level Summary Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border border-border bg-surface p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-caption uppercase tracking-[0.14em]">Total Bookings</span>
            <Ticket className="size-4 text-accent" />
          </div>
          <p className="mt-3 font-display text-display-sm text-foreground">
            {reports.totalBookings}
          </p>
          <p className="mt-1 text-caption text-muted-foreground">All customer bookings</p>
        </div>

        <div className="rounded-md border border-border bg-surface p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-caption uppercase tracking-[0.14em]">Gross Revenue</span>
            <DollarSign className="size-4 text-accent" />
          </div>
          <p className="mt-3 font-display text-display-sm text-foreground">
            {formatZar(reports.totalRevenueZar)}
          </p>
          <p className="mt-1 text-caption text-muted-foreground">Excludes cancelled bookings</p>
        </div>

        <div className="rounded-md border border-border bg-surface p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-caption uppercase tracking-[0.14em]">Settled / Paid</span>
            <TrendingUp className="size-4 text-success" />
          </div>
          <p className="mt-3 font-display text-display-sm text-success">
            {formatZar(reports.paidRevenueZar)}
          </p>
          <p className="mt-1 text-caption text-muted-foreground">Verified payments</p>
        </div>

        <div className="rounded-md border border-border bg-surface p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-caption uppercase tracking-[0.14em]">Avg Booking Value</span>
            <DollarSign className="size-4 text-accent" />
          </div>
          <p className="mt-3 font-display text-display-sm text-foreground">
            {formatZar(reports.averageBookingValueZar)}
          </p>
          <p className="mt-1 text-caption text-muted-foreground">Per non-cancelled reservation</p>
        </div>
      </div>

      {/* Booking Status Breakdown */}
      <div className="mt-8 rounded-md border border-border bg-surface p-6">
        <h2 className="font-display text-heading-md uppercase text-foreground">
          Booking Pipeline Status
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <div className="rounded border border-border/60 bg-background/50 p-4">
            <div className="flex items-center gap-2 text-caption uppercase tracking-wider text-muted-foreground">
              <Clock className="size-3.5 text-accent" />
              Pending
            </div>
            <p className="mt-2 font-display text-heading-lg text-foreground">{pendingCount}</p>
          </div>

          <div className="rounded border border-border/60 bg-background/50 p-4">
            <div className="flex items-center gap-2 text-caption uppercase tracking-wider text-success">
              <CheckCircle2 className="size-3.5" />
              Confirmed
            </div>
            <p className="mt-2 font-display text-heading-lg text-success">{confirmedCount}</p>
          </div>

          <div className="rounded border border-border/60 bg-background/50 p-4">
            <div className="flex items-center gap-2 text-caption uppercase tracking-wider text-muted-foreground">
              <CheckCircle2 className="size-3.5 text-muted-foreground" />
              Completed
            </div>
            <p className="mt-2 font-display text-heading-lg text-foreground">{completedCount}</p>
          </div>

          <div className="rounded border border-border/60 bg-background/50 p-4">
            <div className="flex items-center gap-2 text-caption uppercase tracking-wider text-danger">
              <XCircle className="size-3.5" />
              Cancelled
            </div>
            <p className="mt-2 font-display text-heading-lg text-danger">{cancelledCount}</p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Monthly Trends & Popular Tours */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Monthly Performance */}
        <div className="rounded-md border border-border bg-surface p-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-display text-heading-md uppercase text-foreground">
              Monthly Trends
            </h2>
            <Calendar className="size-4 text-muted-foreground" />
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border text-caption uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="py-2.5">Month</th>
                  <th className="py-2.5">Bookings</th>
                  <th className="py-2.5 text-right">Revenue (ZAR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reports.monthlyBookings.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-caption text-muted-foreground">
                      No monthly booking history available.
                    </td>
                  </tr>
                ) : (
                  reports.monthlyBookings.map((m) => (
                    <tr key={m.month} className="text-body-sm text-foreground">
                      <td className="py-3 font-medium">{m.month}</td>
                      <td className="py-3 text-muted-foreground">{m.bookings}</td>
                      <td className="py-3 text-right font-display text-accent">
                        {formatZar(m.revenueZar)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Popular Tours */}
        <div className="rounded-md border border-border bg-surface p-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-display text-heading-md uppercase text-foreground">
              Most Popular Tours
            </h2>
            <Ticket className="size-4 text-muted-foreground" />
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border text-caption uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="py-2.5">Tour</th>
                  <th className="py-2.5">Bookings</th>
                  <th className="py-2.5 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reports.popularTours.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-caption text-muted-foreground">
                      No tours booked yet.
                    </td>
                  </tr>
                ) : (
                  reports.popularTours.map((t) => (
                    <tr key={t.tourName} className="text-body-sm text-foreground">
                      <td className="py-3 font-medium">{t.tourName}</td>
                      <td className="py-3 text-muted-foreground">{t.bookingCount}</td>
                      <td className="py-3 text-right font-display text-accent">
                        {formatZar(t.revenueZar)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Popular Destinations Breakdown */}
      <div className="mt-8 rounded-md border border-border bg-surface p-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="font-display text-heading-md uppercase text-foreground">
            Bookings by Destination
          </h2>
          <MapPin className="size-4 text-muted-foreground" />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {reports.popularDestinations.length === 0 ? (
            <p className="text-caption text-muted-foreground">No destination bookings recorded yet.</p>
          ) : (
            reports.popularDestinations.map((d) => (
              <div
                key={d.destinationName}
                className="flex items-center justify-between rounded border border-border/60 bg-background/50 p-4"
              >
                <div>
                  <p className="font-medium text-body-sm text-foreground">{d.destinationName}</p>
                  <p className="text-caption text-muted-foreground">
                    {d.bookingCount} booking{d.bookingCount === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="font-display text-heading-md text-accent">
                  {Math.round(
                    (d.bookingCount / Math.max(reports.totalBookings, 1)) * 100,
                  )}
                  %
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { getAdminPayments } from "@/lib/admin";
import { formatDate, formatZar } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { PaymentStatusActionMenu } from "./payment-actions";
import { CreditCard, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ status?: string; search?: string }>;
};

const STATUS_BADGE: Record<
  string,
  { label: string; variant: "accent" | "subtle" | "outline" | "default" }
> = {
  pending: { label: "Pending", variant: "default" },
  paid: { label: "Paid", variant: "subtle" },
  failed: { label: "Failed", variant: "outline" },
  refunded: { label: "Refunded", variant: "outline" },
};

export default async function AdminPaymentsPage({ searchParams }: Props) {
  const { status: statusFilter = "all", search: searchTerm = "" } =
    await searchParams;
  const payments = await getAdminPayments({
    status: statusFilter,
    search: searchTerm,
  });

  const totalAmount = payments.reduce((sum, p) => sum + p.amountZar, 0);
  const paidAmount = payments
    .filter((p) => p.paymentStatus === "paid")
    .reduce((sum, p) => sum + p.amountZar, 0);
  const pendingAmount = payments
    .filter((p) => p.paymentStatus === "pending")
    .reduce((sum, p) => sum + p.amountZar, 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm uppercase text-foreground">
            Payments Ledger
          </h1>
          <p className="mt-2 text-body-sm text-muted-foreground">
            {payments.length} transactions recorded &middot;{" "}
            <span className="font-medium text-foreground">
              {formatZar(paidAmount)}
            </span>{" "}
            settled &middot; {formatZar(pendingAmount)} pending
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-border bg-surface p-4">
          <p className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
            Total Ledger Volume
          </p>
          <p className="mt-2 font-display text-heading-lg text-foreground">
            {formatZar(totalAmount)}
          </p>
        </div>

        <div className="rounded-md border border-border bg-surface p-4">
          <p className="text-caption uppercase tracking-[0.14em] text-success">
            Settled / Paid
          </p>
          <p className="mt-2 font-display text-heading-lg text-success">
            {formatZar(paidAmount)}
          </p>
        </div>

        <div className="rounded-md border border-border bg-surface p-4">
          <p className="text-caption uppercase tracking-[0.14em] text-accent">
            Awaiting Payment (EFT / Link)
          </p>
          <p className="mt-2 font-display text-heading-lg text-accent">
            {formatZar(pendingAmount)}
          </p>
        </div>
      </div>

      {/* Filters and search */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {["all", "pending", "paid", "failed", "refunded"].map((s) => (
            <a
              key={s}
              href={`/admin/payments?status=${s}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}`}
              className={`rounded px-3 py-1.5 text-caption uppercase tracking-wider transition-colors ${
                statusFilter === s
                  ? "bg-accent text-accent-foreground font-medium"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </a>
          ))}
        </div>

        <form method="GET" className="flex items-center gap-2">
          {statusFilter !== "all" && (
            <input type="hidden" name="status" value={statusFilter} />
          )}
          <input
            type="search"
            name="search"
            defaultValue={searchTerm}
            placeholder="Search booking ref, customer, tx ID..."
            className="w-64 rounded-sm border border-border bg-surface px-3 py-1.5 text-body-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-sm bg-surface-elevated px-3 py-1.5 text-caption uppercase tracking-wider text-foreground hover:bg-border"
          >
            Search
          </button>
        </form>
      </div>

      {/* Payments Table */}
      <div className="mt-6 overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[840px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface">
              {[
                "Booking ID",
                "Customer",
                "Amount",
                "Method",
                "Date",
                "Status",
                "Actions",
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
            {payments.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-body-sm text-muted-foreground"
                >
                  No payment records match the current filter.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border transition-colors hover:bg-surface/50 last:border-0"
                >
                  <td className="px-4 py-3 font-display text-body-sm text-foreground">
                    <a
                      href={`/admin/bookings?search=${p.bookingReference}`}
                      className="hover:text-accent hover:underline"
                    >
                      {p.bookingReference}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-body-sm text-foreground">
                      {p.customerName}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {p.customerEmail}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-display text-body-sm text-foreground">
                    {formatZar(p.amountZar)}
                  </td>
                  <td className="px-4 py-3 text-caption uppercase tracking-wide text-muted-foreground">
                    {p.provider.replace("_", " ")}
                  </td>
                  <td className="px-4 py-3 text-caption text-muted-foreground">
                    {formatDate(p.createdAt)}
                    {p.paidAt && (
                      <span className="block text-[11px] text-success">
                        Paid: {formatDate(p.paidAt)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        STATUS_BADGE[p.paymentStatus]?.variant ?? "default"
                      }
                    >
                      {STATUS_BADGE[p.paymentStatus]?.label ?? p.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <PaymentStatusActionMenu
                      paymentId={p.id}
                      currentStatus={p.paymentStatus}
                      transactionId={p.transactionId}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PCI-DSS / Architecture Note */}
      <div className="mt-8 flex items-start gap-3 rounded-md border border-border bg-surface p-5">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" />
        <div className="text-body-sm leading-relaxed text-muted-foreground">
          <p className="font-medium text-foreground">
            Payment Architecture &amp; Security Compliance
          </p>
          <p className="mt-1 text-caption leading-relaxed">
            The platform supports secure payment transitions without storing raw credit card
            numbers or CVVs, complying with PCI-DSS. South African gateways like
            <strong> Paystack</strong>, <strong>Ozow</strong>, and <strong>PayFast</strong>
            use webhook callbacks to transition payments from <code className="text-accent">pending</code> to <code className="text-success">paid</code> using provider transaction tokens.
          </p>
        </div>
      </div>
    </div>
  );
}

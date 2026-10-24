import { getAdminCustomers } from "@/lib/admin";
import { formatDate, formatZar } from "@/lib/format";

export const dynamic = "force-dynamic";

/**
 * Customer list.
 *
 * There is no password column here, and there could not be one: Supabase
 * Auth owns credentials and this table has never held them.
 */
export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div>
      <h1 className="font-display text-display-sm uppercase text-foreground">Customers</h1>
      <p className="mt-2 text-body-sm text-muted-foreground">
        {customers.length} registered customer{customers.length === 1 ? "" : "s"}
      </p>

      {customers.length === 0 ? (
        <p className="mt-8 rounded-md border border-border bg-surface p-8 text-center text-body-sm text-muted-foreground">
          No customers have registered yet.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[780px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-surface">
                {["Name", "Email", "Phone", "Country", "Joined", "Bookings", "Value"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 text-caption font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-body-sm text-foreground">
                    {c.firstName} {c.lastName}
                  </td>
                  <td className="px-4 py-3 text-body-sm text-muted-foreground">{c.email}</td>
                  <td className="px-4 py-3 text-body-sm text-muted-foreground">{c.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-body-sm text-muted-foreground">{c.country ?? "—"}</td>
                  <td className="px-4 py-3 text-caption text-muted-foreground">
                    {formatDate(c.createdAt.slice(0, 10))}
                  </td>
                  <td className="px-4 py-3 text-body-sm text-muted-foreground">{c.bookingCount}</td>
                  <td className="px-4 py-3 text-body-sm text-foreground">{formatZar(c.totalSpentZar)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

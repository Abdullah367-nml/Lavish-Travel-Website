import { getAdminTourDatesFull, getAdminTours } from "@/lib/admin";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  AddTourDateButton,
  TourDateRowActions,
} from "./tour-date-controls";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ tour?: string }>;
};

export default async function AdminTourDatesPage({ searchParams }: Props) {
  const { tour: tourFilter } = await searchParams;
  const [dates, tours] = await Promise.all([
    getAdminTourDatesFull(tourFilter),
    getAdminTours(),
  ]);

  const soldOut = dates.filter((d) => d.seatsRemaining === 0).length;
  const closed = dates.filter((d) => d.status === "closed").length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm uppercase text-foreground">
            Tour Dates / Availability
          </h1>
          <p className="mt-2 text-body-sm text-muted-foreground">
            {dates.length} upcoming departure{dates.length === 1 ? "" : "s"} &middot;{" "}
            {soldOut} fully booked &middot; {closed} closed
          </p>
        </div>

        <AddTourDateButton
          tours={tours.map((t) => ({ id: t.id, name: t.name }))}
        />
      </div>

      {/* Filter by Tour */}
      <div className="mt-6 flex items-center gap-3">
        <label className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
          Filter Tour:
        </label>
        <div className="flex flex-wrap gap-2">
          <a
            href="/admin/tour-dates"
            className={`rounded px-2.5 py-1 text-caption uppercase tracking-wider transition-colors ${
              !tourFilter
                ? "bg-accent text-accent-foreground font-medium"
                : "bg-surface border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All Tours
          </a>
          {tours.map((t) => (
            <a
              key={t.id}
              href={`/admin/tour-dates?tour=${t.id}`}
              className={`rounded px-2.5 py-1 text-caption uppercase tracking-wider transition-colors ${
                tourFilter === t.id
                  ? "bg-accent text-accent-foreground font-medium"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.name}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[780px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface">
              {[
                "Tour",
                "Date",
                "Capacity",
                "Booked",
                "Remaining",
                "State",
                "Manage",
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
            {dates.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-body-sm text-muted-foreground"
                >
                  No departure dates found matching the selection.
                </td>
              </tr>
            ) : (
              dates.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-border transition-colors hover:bg-surface/50 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-body-sm text-foreground">
                    {d.tourName}
                  </td>
                  <td className="px-4 py-3 text-body-sm text-muted-foreground">
                    {formatDate(d.tourDate)}
                  </td>
                  <td className="px-4 py-3 text-body-sm text-muted-foreground">
                    {d.capacity}
                  </td>
                  <td className="px-4 py-3 text-body-sm text-muted-foreground">
                    <span
                      className={d.seatsBooked > 0 ? "font-semibold text-accent" : ""}
                    >
                      {d.seatsBooked}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-body-sm text-foreground">
                    {d.seatsRemaining}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        d.status === "closed"
                          ? "outline"
                          : d.availability === "available"
                            ? "subtle"
                            : d.availability === "limited"
                              ? "accent"
                              : "outline"
                      }
                    >
                      {d.status === "closed"
                        ? "Closed"
                        : d.availability.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <TourDateRowActions
                      id={d.id}
                      capacity={d.capacity}
                      seatsBooked={d.seatsBooked}
                      status={d.status}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-caption leading-relaxed text-muted-foreground">
        Seat counts here are enforced live by the PostgreSQL database transaction.
        Reducing capacity below currently booked seats is prevented to guarantee data integrity.
      </p>
    </div>
  );
}

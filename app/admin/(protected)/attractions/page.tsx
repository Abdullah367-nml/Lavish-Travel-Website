import Link from "next/link";
import { Plus, Edit2, MapPin } from "lucide-react";
import { getAdminAttractionsList, getAdminDestinations } from "@/lib/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteAttractionButton } from "./delete-button";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ dest?: string; q?: string }>;
};

export default async function AdminAttractionsPage({ searchParams }: Props) {
  const { dest: destFilter, q: searchQuery } = await searchParams;
  const [attractions, destinations] = await Promise.all([
    getAdminAttractionsList(destFilter),
    getAdminDestinations(),
  ]);

  const filtered = attractions.filter((a) => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    return (
      a.name.toLowerCase().includes(term) ||
      a.description.toLowerCase().includes(term) ||
      (a.location && a.location.toLowerCase().includes(term))
    );
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm uppercase text-foreground">
            Attractions
          </h1>
          <p className="mt-2 text-body-sm text-muted-foreground">
            Manage tourist landmarks and attractions associated with Cape Town,
            Stellenbosch, and other destinations.
          </p>
        </div>

        <Button asChild size="sm">
          <Link href="/admin/attractions/new">
            <Plus aria-hidden className="mr-1.5 size-4" />
            Add Attraction
          </Link>
        </Button>
      </div>

      {/* Destination filter chips */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
          Destination:
        </span>
        <a
          href="/admin/attractions"
          className={`rounded px-2.5 py-1 text-caption uppercase tracking-wider transition-colors ${
            !destFilter
              ? "bg-accent text-accent-foreground font-medium"
              : "bg-surface border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </a>
        {destinations.map((d) => (
          <a
            key={d.id}
            href={`/admin/attractions?dest=${d.id}`}
            className={`rounded px-2.5 py-1 text-caption uppercase tracking-wider transition-colors ${
              destFilter === d.id
                ? "bg-accent text-accent-foreground font-medium"
                : "bg-surface border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {d.name} ({d.attractionCount})
          </a>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface">
              {["Attraction", "Destination", "Location", "Tours", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-3 text-caption font-medium uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-body-sm text-muted-foreground"
                >
                  No attractions found matching the criteria.
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-border transition-colors hover:bg-surface/50 last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-body-sm text-foreground">
                      {a.name}
                    </p>
                    <p className="line-clamp-1 max-w-sm text-caption text-muted-foreground">
                      {a.description}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-body-sm text-foreground">
                    {a.destinationName}
                  </td>
                  <td className="px-4 py-3 text-caption text-muted-foreground">
                    {a.location ? (
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3 text-accent" />
                        {a.location}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {a.relatedTours.length > 0 ? (
                      <span className="rounded bg-accent/10 px-2 py-0.5 text-caption font-medium text-accent">
                        {a.relatedTours.length} tour{a.relatedTours.length === 1 ? "" : "s"}
                      </span>
                    ) : (
                      <span className="text-caption text-muted-foreground">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        a.status === "published"
                          ? "subtle"
                          : a.status === "draft"
                            ? "outline"
                            : "default"
                      }
                    >
                      {a.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link
                          href={`/admin/attractions/${a.id}/edit`}
                          title="Edit attraction"
                        >
                          <Edit2 className="size-4" />
                        </Link>
                      </Button>
                      <DeleteAttractionButton id={a.id} name={a.name} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

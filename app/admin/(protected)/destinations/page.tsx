import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { getAdminDestinations } from "@/lib/admin";
import { Badge } from "@/components/ui/badge";
import { DestinationActions } from "@/components/admin/destination-actions";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  destination: "City",
  area: "Area",
  town: "Town",
  wine_area: "Winelands",
  coastal_town: "Coastal",
  nature: "Nature",
};

/**
 * Destination management.
 *
 * Grouped by region, with areas shown under their parent city, because a
 * flat alphabetical list of 44 places tells you nothing about which of them
 * is inside which.
 *
 * The warning at the top should stay until the content has been reviewed.
 * Publishing a destination is a public claim that the agency operates there,
 * so unverified rows stay in draft.
 *
 * A place with no attractions is flagged rather than blocked: a city page can
 * be worth having on its own, but it should never be published by accident.
 */
export default async function AdminDestinationsPage() {
  const all = await getAdminDestinations();
  const drafts = all.filter((d) => d.status !== "published").length;
  const published = all.length - drafts;
  const empties = all.filter(
    (d) => d.status !== "published" && d.attractionCount === 0,
  ).length;

  // Region → parent city → areas
  const regions = new Map<string, typeof all>();
  for (const d of all) {
    const key = d.region ?? "Unassigned";
    if (!regions.has(key)) regions.set(key, []);
    regions.get(key)!.push(d);
  }

  return (
    <div>
      <h1 className="font-display text-display-sm uppercase text-foreground">
        Destinations
      </h1>
      <p className="mt-2 text-body-sm text-muted-foreground">
        {all.length} places &middot; {published} live &middot; {drafts} draft
      </p>

      {drafts > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-md border border-accent/40 bg-accent/10 p-5">
          <AlertTriangle aria-hidden className="mt-0.5 size-5 shrink-0 text-accent" />
          <div>
            <h2 className="font-display text-heading-sm uppercase tracking-wide text-foreground">
              Review before publishing
            </h2>
            <p className="mt-2 max-w-2xl text-body-sm leading-relaxed text-muted-foreground">
              {drafts} places are loaded but unverified. Check names, opening
              times and any operators mentioned, and publish only where the
              agency operates — a live page tells customers you sell trips
              there. Nothing in draft is visible to the public.
            </p>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-col gap-12">
        {[...regions.entries()].map(([region, places]) => {
          const parents = places.filter((p) => !p.parentName);
          const children = places.filter((p) => p.parentName);

          return (
            <section key={region} aria-labelledby={`region-${region}`}>
              <h2
                id={`region-${region}`}
                className="font-display text-heading-lg uppercase tracking-wide text-foreground"
              >
                {region}
              </h2>

              <div className="mt-5 overflow-x-auto rounded-md border border-border">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border bg-surface">
                      {["Place", "Type", "Attractions", "Tours", "Status", "Action"].map((h) => (
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
                    {[...parents, ...children].map((d) => (
                      <tr key={d.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-4">
                          <p
                            className={
                              "text-body-sm text-foreground " +
                              (d.parentName ? "pl-4" : "font-medium")
                            }
                          >
                            {d.parentName && (
                              <span aria-hidden className="mr-2 text-muted-foreground">
                                ↳
                              </span>
                            )}
                            {d.name}
                          </p>
                          <p
                            className={
                              "mt-1 text-caption text-muted-foreground " +
                              (d.parentName ? "pl-4" : "")
                            }
                          >
                            {d.parentName ? `in ${d.parentName} · ` : ""}
                            {d.slug}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant="outline">
                            {TYPE_LABELS[d.areaType] ?? d.areaType}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          {d.attractionCount === 0 ? (
                            <span className="flex items-center gap-1.5 text-caption text-accent">
                              <AlertTriangle aria-hidden className="size-3.5 shrink-0" />
                              None yet
                            </span>
                          ) : (
                            <span className="text-body-sm text-muted-foreground">
                              {d.publishedAttractionCount} / {d.attractionCount}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-body-sm text-muted-foreground">
                          {d.tourCount || "—"}
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={d.status === "published" ? "subtle" : "default"}>
                            {d.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-2">
                            <DestinationActions
                              id={d.id}
                              status={d.status}
                              attractionCount={d.attractionCount}
                              publishedAttractionCount={d.publishedAttractionCount}
                            />
                            {d.status === "published" && (
                              <Link
                                href={`/destinations/${d.slug}`}
                                className="text-caption uppercase tracking-[0.14em] text-accent hover:underline"
                              >
                                View page
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-2 text-caption leading-relaxed text-muted-foreground">
        <p>
          Publishing a destination also publishes its draft attractions, so
          the page is not empty. Hiding one leaves its attractions untouched.
          Changes appear on the public site within a minute.
        </p>
        {empties > 0 && (
          <p className="text-accent">
            {empties} place{empties === 1 ? " has" : "s have"} no attractions
            loaded. Publishing {empties === 1 ? "it" : "them"} gives a page
            with an empty &ldquo;what to see&rdquo; section — add attractions
            first, or leave {empties === 1 ? "it" : "them"} in draft.
          </p>
        )}
      </div>
    </div>
  );
}

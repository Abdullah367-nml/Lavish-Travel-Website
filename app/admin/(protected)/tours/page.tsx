import Link from "next/link";
import { getAdminTours } from "@/lib/admin";
import { formatZar } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

/**
 * Tour list. Read-only for now — the create/edit forms are the next build.
 * Status is shown prominently because "why isn't my tour on the site?" is
 * almost always "it is still a draft".
 */
export default async function AdminToursPage() {
  const tours = await getAdminTours();

  return (
    <div>
      <h1 className="font-display text-display-sm uppercase text-foreground">Tours</h1>
            <div className="mt-2 flex items-center justify-between">
        <p className="text-body-sm text-muted-foreground">
          {tours.length} tour{tours.length === 1 ? "" : "s"} &middot;{" "}
          {tours.filter((t) => t.status === "published").length} live on the public site
        </p>
        <Button asChild size="sm">
          <Link href="/admin/tours/new">+ New Tour</Link>
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface">
              {["Tour", "Destination", "Adult", "Child", "Capacity", "Status", ""].map((h) => (
                <th key={h} scope="col" className="px-4 py-3 text-caption font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tours.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0">
                <td className="px-4 py-4">
                  <p className="text-body-sm text-foreground">{t.name}</p>
                  <p className="mt-1 text-caption text-muted-foreground">{t.slug}</p>
                </td>
                <td className="px-4 py-4 text-body-sm text-muted-foreground">
                  {t.destinations?.name ?? "—"}
                </td>
                <td className="px-4 py-4 text-body-sm text-foreground">{formatZar(t.price_adult_zar)}</td>
                <td className="px-4 py-4 text-body-sm text-muted-foreground">
                  {t.price_child_zar > 0 ? formatZar(t.price_child_zar) : "Adults only"}
                </td>
                <td className="px-4 py-4 text-body-sm text-muted-foreground">{t.capacity}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant={t.status === "published" ? "subtle" : "outline"}>{t.status}</Badge>
                    {t.is_featured && <Badge variant="accent">Featured</Badge>}
                  </div>
                </td>
                                <td className="px-4 py-4">
                  <div className="flex gap-4">
                    <Link
                      href={`/admin/tours/${t.id}/edit`}
                      className="text-caption uppercase tracking-[0.14em] text-accent hover:underline"
                    >
                      Edit
                    </Link>
                    {t.destinations?.slug && (
                      <Link
                        href={`/tours/${t.destinations.slug}/${t.slug}`}
                        className="text-caption uppercase tracking-[0.14em] text-muted-foreground hover:underline"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-caption leading-relaxed text-muted-foreground">
        ⚠ Prices shown here are the placeholder figures from the seed data, and
        they are what customers are charged. Replace them before the site is
        public. Editing forms are the next build step; until then they can be
        changed in the Supabase Table Editor.
      </p>
    </div>
  );
}

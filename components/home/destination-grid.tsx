import Link from "next/link";
import type { Destination } from "@/lib/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { BrandImage } from "@/components/shared/brand-image";
import { destinations as fallbackDestinations } from "@/lib/data/destinations";

/**
 * Destination grid. The first tile spans two columns on larger screens so
 * the grid has a focal point rather than reading as a uniform sheet of
 * boxes — the "stock-photo sameness" failure mode the brief warns about.
 */
export function DestinationGrid({
  destinations,
}: {
  destinations: Destination[];
}) {
  const items =
    destinations && destinations.length > 0
      ? destinations
      : fallbackDestinations.slice(0, 5);

  if (items.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="DESTINATIONS"
          title="Where to go, and when"
          lead="Seasons here run in opposite directions. Kruger is at its best in the dry winter; Cape Town and the Garden Route peak in high summer. Plan accordingly."
          href="/destinations"
          linkLabel="All destinations"
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((destination, index) => (
            <li
              key={destination.id}
              className={index === 0 ? "sm:col-span-2 lg:col-span-2" : ""}
            >
              <Link
                href={`/destinations/${destination.slug}`}
                className="group relative block h-full min-h-[220px] overflow-hidden rounded-xl border border-border outline-none transition-all duration-300 hover:border-accent/60 hover:shadow-[0_0_25px_rgba(255,149,0,0.2)] sm:min-h-[260px]"
              >
                <BrandImage
                  src={destination.heroImage}
                  alt={destination.name}
                  fill
                  width={index === 0 ? 1200 : 600}
                  height={600}
                  sizes={
                    index === 0
                      ? "(max-width: 640px) 100vw, 66vw"
                      : "(max-width: 640px) 100vw, 33vw"
                  }
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <div aria-hidden className="scrim-bottom absolute inset-0" />

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent backdrop-blur-sm border border-accent/20">
                      {destination.country}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-heading-md uppercase tracking-wide text-foreground group-hover:text-accent transition-colors">
                    {destination.name}
                  </h3>
                  <p className="mt-1 text-caption uppercase tracking-[0.14em] text-accent">
                    Best {destination.bestMonths}
                  </p>
                  {index === 0 && (
                    <p className="mt-3 max-w-md text-body-sm leading-relaxed text-foreground/75">
                      {destination.intro}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

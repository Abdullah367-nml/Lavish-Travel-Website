import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Compass, MapPin, Sparkles } from "lucide-react";
import { getDestinations, getToursByDestination } from "@/lib/data";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { BrandImage } from "@/components/shared/brand-image";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/structured-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "South African & African Destinations — Kruger, Cape Town, Victoria Falls",
  description:
    "Explore iconic African destinations: Kruger National Park safari, Cape Town & Table Mountain, Victoria Falls, Drakensberg, Garden Route and Cape Winelands with private chauffeured tours.",
  alternates: { canonical: "/destinations" },
};

export default async function DestinationsPage() {
  const destinations = await getDestinations();
  const tourCounts = await Promise.all(
    destinations.map(async (d) => (await getToursByDestination(d.slug)).length),
  );

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={itemListJsonLd(
          destinations.map((d) => ({
            name: d.name,
            url: `/destinations/${d.slug}`,
          })),
          "South African destinations",
        )}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Breadcrumbs items={crumbs} />

        {/* Page Hero */}
        <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
              <Compass className="size-3.5" />
              <span>Iconic African Destinations</span>
            </div>
            <h1 className="text-lit mt-4 font-display text-display-sm uppercase tracking-tight text-foreground sm:text-display-md">
              Where Wild Africa Meets Luxury
            </h1>
            <p className="mt-4 text-body-md leading-relaxed text-muted-foreground">
              From the thunderous majesty of Victoria Falls and the Big Five wilderness
              of Kruger National Park, to the coastal heights of Table Mountain and the
              dramatic amphitheatre of the Drakensberg — curated journeys for international travellers.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-accent" />
              {destinations.length} Premier Destinations
            </span>
          </div>
        </div>

        {/* Destination Cards Grid with Real Photography */}
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination, index) => (
            <li key={destination.id} className="group">
              <Link
                href={`/destinations/${destination.slug}`}
                className="relative flex h-full min-h-[380px] flex-col justify-end overflow-hidden rounded-xl border border-border/80 bg-zinc-950 outline-none transition-all duration-300 hover:border-accent/60 hover:shadow-[0_0_35px_rgba(255,149,0,0.22)]"
              >
                {/* Real photo background */}
                <BrandImage
                  src={destination.heroImage}
                  alt={destination.name}
                  fill
                  width={800}
                  height={600}
                  priority={index < 3}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Dark luxury gradient scrim */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity group-hover:opacity-80"
                />

                {/* Top Badges */}
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                  <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent backdrop-blur-md border border-accent/20">
                    {destination.country}
                  </span>
                  <span className="text-xs font-medium text-foreground/80 drop-shadow">
                    {destination.province}
                  </span>
                </div>

                {/* Card Content */}
                <div className="relative p-6 pt-12">
                  <h2 className="flex items-start justify-between gap-3 font-display text-heading-lg uppercase tracking-wide text-foreground transition-colors group-hover:text-accent">
                    {destination.name}
                    <ArrowUpRight
                      aria-hidden
                      className="mt-1 size-5 shrink-0 text-accent transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </h2>
                  <p className="mt-2.5 line-clamp-2 text-body-sm leading-relaxed text-foreground/80">
                    {destination.intro}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-caption uppercase tracking-[0.14em]">
                    <span className="text-accent font-medium">
                      Best: {destination.bestMonths}
                    </span>
                    {tourCounts[index] > 0 ? (
                      <span className="text-foreground/70 font-medium">
                        {tourCounts[index]} {tourCounts[index] === 1 ? "Tour Package" : "Tour Packages"}
                      </span>
                    ) : (
                      <span className="text-accent/90 flex items-center gap-1">
                        Explore Guide →
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

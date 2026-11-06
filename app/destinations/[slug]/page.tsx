import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarRange, MapPin } from "lucide-react";
import {
  getAttractions,
  getChildAreas,
  getDestinationBySlug,
  getDestinations,
  getToursByDestination,
} from "@/lib/data";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { BrandImage } from "@/components/shared/brand-image";
import { TourCard } from "@/components/shared/tour-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd, destinationJsonLd } from "@/lib/structured-data";

/**
 * Content comes from Supabase and an admin can change it at any time, so this
 * page is revalidated rather than frozen at build time. 60 seconds is a
 * deliberate compromise: an admin edit shows up on the public site within a
 * minute, while normal visitors are still served a cached page rather than
 * hitting the database on every request.
 */
export const revalidate = 60;


type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) return {};

  return {
    title: destination.seoTitle,
    description: destination.seoDescription,
    alternates: { canonical: `/destinations/${slug}` },
    openGraph: { title: destination.seoTitle, type: "article" },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const [tours, attractions, areas] = await Promise.all([
    getToursByDestination(slug),
    getAttractions(slug),
    getChildAreas(slug),
  ]);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
    { label: destination.name, href: `/destinations/${slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={destinationJsonLd(destination)} />

      <section className="relative isolate flex min-h-[380px] items-end overflow-hidden border-b border-border sm:min-h-[460px]">
        <BrandImage
          src={destination.heroImage}
          alt={destination.name}
          fill
          width={1920}
          height={900}
          priority
          sizes="100vw"
          className="-z-10"
        />
        <div aria-hidden className="scrim-full absolute inset-0 -z-10" />
        <div className="mx-auto w-full max-w-5xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
          <Breadcrumbs items={crumbs} />
          <p className="mt-6 flex items-center gap-2 text-caption font-medium tracking-[0.28em] text-accent">
            <MapPin aria-hidden className="size-3.5" />
            {destination.province.toUpperCase()}
            {destination.country !== "South Africa" && (
              <span className="text-muted-foreground">
                &middot; {destination.country.toUpperCase()}
              </span>
            )}
          </p>
          <h1 className="text-lit mt-3 font-display text-display-sm uppercase text-foreground sm:text-display-md">
            {destination.name}
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <p className="text-body-lg leading-relaxed text-foreground/85">
          {destination.intro}
        </p>

        <p className="mt-6 inline-flex items-center gap-2 rounded-sm border border-border bg-surface px-4 py-2.5">
          <CalendarRange aria-hidden className="size-4 text-accent" />
          <span className="text-body-sm text-muted-foreground">
            Best time to visit
          </span>
          <span className="text-body-sm font-medium text-foreground">
            {destination.bestMonths}
          </span>
        </p>

        <div className="mt-10 flex flex-col gap-6">
          {destination.body.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="text-body-md leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Attractions / Route Points with Photography */}
        {attractions.length > 0 && (
          <section className="mt-16 border-t border-border pt-12" aria-labelledby="dest-attractions">
            <h2
              id="dest-attractions"
              className="font-display text-display-sm uppercase text-foreground"
            >
              Key Route Points &amp; Sights in {destination.name}
            </h2>
            <p className="mt-2 text-body-sm text-muted-foreground">
              Explore the signature stops, coastal lookouts, and landmarks included across our private {destination.name} itineraries.
            </p>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {attractions.map((a, idx) => (
                <li
                  key={a.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:border-accent/50"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                    <BrandImage
                      src={a.image}
                      alt={a.name}
                      fill
                      width={640}
                      height={400}
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                    />
                    <div className="absolute left-3.5 top-3.5 flex flex-wrap items-center gap-2">
                      <span className="flex size-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-black shadow">
                        {idx + 1}
                      </span>
                      {a.category && <Badge variant="default">{a.category}</Badge>}
                    </div>
                    {a.suggestedTime && (
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/75 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-accent border border-accent/30 backdrop-blur-sm">
                        {a.suggestedTime}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-heading-sm uppercase tracking-wide text-foreground group-hover:text-accent transition-colors">
                      {a.name}
                    </h3>
                    {a.location && (
                      <p className="mt-1 flex items-center gap-1.5 text-caption uppercase tracking-[0.14em] text-accent/90">
                        <MapPin aria-hidden className="size-3 shrink-0" />
                        {a.location}
                      </p>
                    )}
                    <p className="mt-3 flex-1 text-body-sm leading-relaxed text-muted-foreground">
                      {a.description}
                    </p>
                    {a.visitorNote && (
                      <p className="mt-4 rounded-md border border-border/80 bg-background/60 px-3.5 py-2.5 text-caption leading-relaxed text-muted-foreground">
                        <span className="font-semibold text-accent">Tip: </span>
                        {a.visitorNote}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Areas nested inside this destination */}
        {areas.length > 0 && (
          <section className="mt-16 border-t border-border pt-12" aria-labelledby="dest-areas">
            <h2
              id="dest-areas"
              className="font-display text-display-sm uppercase text-foreground"
            >
              Areas of {destination.name}
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {areas.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/destinations/${a.slug}`}
                    className="group block h-full rounded-md border border-border bg-surface p-5 outline-none transition-colors hover:border-border-strong"
                  >
                    <h3 className="font-display text-heading-sm uppercase tracking-wide text-foreground transition-colors group-hover:text-accent">
                      {a.name}
                    </h3>
                    {a.suggestedTime && (
                      <p className="mt-1 text-caption uppercase tracking-[0.14em] text-accent">
                        {a.suggestedTime}
                      </p>
                    )}
                    <p className="mt-3 text-body-sm leading-relaxed text-muted-foreground">
                      {a.intro}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tours.length > 0 && (
          <section className="mt-16 border-t border-border pt-12" aria-labelledby="dest-tours">
            <h2
              id="dest-tours"
              className="font-display text-display-sm uppercase text-foreground"
            >
              Tours in {destination.name}
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour) => (
                <li key={tour.id}>
                  <TourCard tour={tour} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-10 sm:flex-row">
          <Button asChild>
            <Link href="/enquire">Plan a trip here</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/tours/${slug}`}>All {destination.name} tours</Link>
          </Button>
        </div>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestinationBySlug, getDestinations, getToursByDestination } from "@/lib/data";
import { TourCard } from "@/components/shared/tour-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/structured-data";
import { Button } from "@/components/ui/button";
import { BrandImage } from "@/components/shared/brand-image";

/**
 * Content comes from Supabase and an admin can change it at any time, so this
 * page is revalidated rather than frozen at build time. 60 seconds is a
 * deliberate compromise: an admin edit shows up on the public site within a
 * minute, while normal visitors are still served a cached page rather than
 * hitting the database on every request.
 */
export const revalidate = 60;


type Props = { params: Promise<{ destination: string }> };

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((d) => ({ destination: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destination: slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) return {};

  return {
    title: `${destination.name} Tours & Packages`,
    description: `Guided tours and multi-day packages in ${destination.name}, ${destination.province}. Best time to visit: ${destination.bestMonths}.`,
    alternates: { canonical: `/tours/${slug}` },
  };
}

/**
 * Destination-scoped tour listing — /tours/garden-route.
 *
 * A distinct page from `/tours?destination=garden-route`: this one has its
 * own H1, its own intro copy and its own seasonal guidance, which is what
 * makes it worth indexing rather than being a thin duplicate of the filtered
 * view.
 */
export default async function DestinationToursPage({ params }: Props) {
  const { destination: slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const tours = await getToursByDestination(slug);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Tours", href: "/tours" },
    { label: destination.name, href: `/tours/${slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={itemListJsonLd(
          tours.map((t) => ({
            name: t.title,
            url: `/tours/${t.destinationSlug}/${t.slug}`,
          })),
          `${destination.name} tours`,
        )}
      />

      <section className="relative isolate flex min-h-[320px] items-end overflow-hidden border-b border-border sm:min-h-[400px]">
        <BrandImage
          src={destination.heroImage}
          alt={destination.name}
          fill
          width={1920}
          height={800}
          priority
          sizes="100vw"
          className="-z-10"
        />
        <div aria-hidden className="scrim-full absolute inset-0 -z-10" />
        <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
          <Breadcrumbs items={crumbs} />
          <p className="mt-6 text-caption font-medium tracking-[0.3em] text-accent">
            {destination.province.toUpperCase()}
          </p>
          <h1 className="text-lit mt-3 font-display text-display-sm uppercase text-foreground sm:text-display-md">
            {destination.name} tours
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-2xl">
          <p className="text-body-lg leading-relaxed text-muted-foreground">
            {destination.intro}
          </p>
          <p className="mt-5 text-body-sm uppercase tracking-[0.14em] text-accent">
            Best time to visit &middot; {destination.bestMonths}
          </p>
        </div>

        {tours.length > 0 ? (
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <li key={tour.id}>
                <TourCard tour={tour} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-12 rounded-md border border-border bg-surface p-8">
            <p className="text-body-sm text-muted-foreground">
              We do not have a packaged itinerary listed here yet, but we run
              this destination regularly on a tailored basis.
            </p>
            <Button asChild className="mt-5">
              <Link href="/enquire">Request a tailored itinerary</Link>
            </Button>
          </div>
        )}

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-10 sm:flex-row">
          <Button asChild variant="outline">
            <Link href={`/destinations/${slug}`}>
              Read the {destination.name} guide
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/tours">All tours</Link>
          </Button>
        </div>
      </div>
    </>
  );
}

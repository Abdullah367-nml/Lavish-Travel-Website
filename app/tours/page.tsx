import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { getDestinations, getTours } from "@/lib/data";
import {
  describeFilters,
  parseTourSearchParams,
  type RawSearchParams,
} from "@/lib/tour-search";
import { TourCard } from "@/components/shared/tour-card";
import { TourFilters } from "@/components/tours/tour-filters";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/structured-data";
import { Button } from "@/components/ui/button";

/**
 * Prop shapes are declared locally rather than using Next 16's generated
 * `PageProps<'/tours'>` global. The generated ParamMap only contains routes
 * that existed at the last build, so a freshly added dynamic route fails
 * type-checking until a build has run — an ordering dependency worth
 * avoiding. The shape below is what Next passes either way.
 */
type ToursPageProps = { searchParams: Promise<RawSearchParams> };

/**
 * Metadata reflects the active filters.
 *
 * A filtered view is genuinely a different page, so it gets its own title
 * and description — otherwise every filter combination reads as duplicate
 * content. The canonical follows the filtered URL when filters are active
 * so the shareable link is the one that gets indexed.
 */
export async function generateMetadata({
  searchParams,
}: ToursPageProps): Promise<Metadata> {
  const params = await searchParams;
  const parts = describeFilters(params);
  const destination =
    typeof params.destination === "string" ? params.destination : undefined;

  if (parts.length === 0 && !destination) {
    return {
      title: "Tours & Safari Packages in South Africa",
      description:
        "Day tours and multi-day packages across South Africa — Cape Peninsula, Winelands, Garden Route, Kruger, Panorama Route and Drakensberg. Private, guided, and fully tailored.",
      alternates: { canonical: "/tours" },
    };
  }

  const query = new URLSearchParams(
    Object.entries(params).flatMap(([k, v]) =>
      typeof v === "string" ? [[k, v] as [string, string]] : [],
    ),
  ).toString();

  const label = [...parts, destination].filter(Boolean).join(", ");
  return {
    title: `${label} tours in South Africa`,
    description: `South African tour packages filtered by ${label}. Privately guided, with bespoke quotes and instant booking via WhatsApp.`,
    alternates: { canonical: query ? `/tours?${query}` : "/tours" },
  };
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const params = await searchParams;
  const filters = parseTourSearchParams(params);

  const [tours, destinations] = await Promise.all([
    getTours(filters),
    getDestinations(),
  ]);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Tours", href: "/tours" },
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
          "South African tour packages",
        )}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 max-w-3xl">
          <p className="text-caption font-medium tracking-[0.3em] text-accent">
            CAPE TOWN &amp; SOUTHERN AFRICA
          </p>
          <h1 className="text-lit mt-4 font-display text-display-sm uppercase text-foreground sm:text-display-md">
            Private Tours &amp; Safaris
          </h1>
          <p className="mt-5 text-body-md leading-relaxed text-muted-foreground">
            Bespoke day tours around Cape Town, Table Mountain, the Cape Peninsula,
            Stellenbosch winelands, and Big Five safaris. All itineraries are privately
            guided with flexible timings and direct booking via our 24/7 WhatsApp concierge.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* useSearchParams requires a Suspense boundary in an otherwise
              statically-rendered tree. */}
          <Suspense
            fallback={
              <div aria-hidden className="hidden lg:block lg:w-64 lg:shrink-0" />
            }
          >
            <TourFilters
              destinations={destinations.map((d) => ({
                slug: d.slug,
                name: d.name,
              }))}
              resultCount={tours.length}
            />
          </Suspense>

          <div className="min-w-0 flex-1">
            {tours.length > 0 ? (
              <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {tours.map((tour) => (
                  <li key={tour.id}>
                    <TourCard tour={tour} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rim-top surface-metal relative rounded-md border border-border p-8 text-center sm:p-12">
                <SearchX aria-hidden className="mx-auto size-7 text-accent" />
                <h2 className="mt-5 font-display text-heading-md uppercase tracking-wide text-foreground">
                  Nothing matches that combination
                </h2>
                <p className="mx-auto mt-3 max-w-md text-body-sm leading-relaxed text-muted-foreground">
                  Try widening the budget or the duration. Or tell us what you
                  had in mind and we will build it — most of what we run is
                  tailored anyway.
                </p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button asChild>
                    <Link href="/tours">Clear all filters</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/enquire">Request something custom</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

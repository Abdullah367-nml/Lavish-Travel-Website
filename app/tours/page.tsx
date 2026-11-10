import type { Metadata } from "next";
import { Suspense } from "react";
import { getDestinations, getTours } from "@/lib/data";
import { TourCard } from "@/components/shared/tour-card";
import {
  ToursCatalogue,
  type PreRenderedTourItem,
} from "@/components/tours/tours-catalogue";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Tours & Safari Packages in South Africa",
  description:
    "Day tours and multi-day packages across South Africa — Cape Peninsula, Winelands, Garden Route, Kruger, Panorama Route and Drakensberg. Private, guided, and fully tailored.",
  alternates: { canonical: "/tours" },
};

export default async function ToursPage() {
  const [tours, destinations] = await Promise.all([
    getTours(),
    getDestinations(),
  ]);

  const destinationOptions = destinations.map((d) => ({
    slug: d.slug,
    name: d.name,
  }));

  const items: PreRenderedTourItem[] = tours.map((tour) => ({
    id: tour.id,
    destinationSlug: tour.destinationSlug,
    category: tour.category,
    durationDays: tour.durationDays,
    priceFromZar: tour.priceFromZar,
    groupMin: tour.groupMin,
    groupMax: tour.groupMax,
    card: <TourCard tour={tour} />,
  }));

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
            guided with flexible timings and direct booking via WhatsApp.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:gap-12">
              <div aria-hidden className="hidden lg:block lg:w-64 lg:shrink-0" />
              <div className="min-w-0 flex-1">
                <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => (
                    <li key={item.id}>{item.card}</li>
                  ))}
                </ul>
              </div>
            </div>
          }
        >
          <ToursCatalogue items={items} destinations={destinationOptions} />
        </Suspense>
      </div>
    </>
  );
}

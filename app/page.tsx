import type { Metadata } from "next";
import {
  getAggregateRating,
  getDestinations,
  getFeaturedTours,
  getReviews,
  getServices,
  getVehicles,
} from "@/lib/data";
import { JsonLd } from "@/components/shared/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { Hero } from "@/components/home/hero";
import { ServiceCards } from "@/components/home/service-cards";
import { FeaturedTours } from "@/components/home/featured-tours";
import { TrustBand } from "@/components/home/trust-band";
import { FleetPreview } from "@/components/home/fleet-preview";
import { DestinationGrid } from "@/components/home/destination-grid";
import { FinalCta } from "@/components/home/final-cta";
import { Testimonials } from "@/components/home/testimonials";
import { FeaturedAfrica } from "@/components/home/featured-africa";

/**
 * Content comes from Supabase and an admin can change it at any time, so this
 * page is revalidated rather than frozen at build time. 60 seconds is a
 * deliberate compromise: an admin edit shows up on the public site within a
 * minute, while normal visitors are still served a cached page rather than
 * hitting the database on every request.
 */
export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description:
    "Luxury airport transfers, chauffeur hire, self‑drive car rental and tailored tours across South Africa. Fixed transfer pricing, professional drivers, 24/7 operations.",
};

export default async function HomePage() {
  const [services, featuredTours, fleet, destinations, reviews, aggregate] =
    await Promise.all([
      getServices(),
      getFeaturedTours(4),
      getVehicles(),
      getDestinations(),
      getReviews(3),
      getAggregateRating(),
    ]);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      <Hero />
      <ServiceCards services={services} />
      <FeaturedTours tours={featuredTours} />
      <TrustBand />
      <FleetPreview vehicles={fleet.slice(0, 3)} />
      <DestinationGrid destinations={destinations.slice(0, 5)} />
      {/* Iconic African destinations — fully static, always visible */}
      <FeaturedAfrica />
      <Testimonials reviews={reviews} aggregate={aggregate} />
      <FinalCta />
    </>
  );
}

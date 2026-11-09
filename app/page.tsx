import type { Metadata } from "next";
import {
  getAggregateRating,
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
  title: "Lavish Travels & Tours | South African Luxury Private Tours & Chauffeur Services",
  description:
    "Official website for Lavish Travels & Tours (Pvt) Ltd. Private guided tours in Cape Town, Garden Route, safari transfers, and luxury chauffeur services across South Africa.",
  alternates: { canonical: "/" },
  keywords: [
    "Lavish Travels",
    "Lavish Travels & Tours",
    "Lavish Travels SA",
    "Cape Town Private Tours",
    "South Africa Luxury Tours",
    "Cape Town Airport Transfers",
    "Garden Route Tours",
    "Private Chauffeur Cape Town",
  ],
};

export default async function HomePage() {
  const [services, featuredTours, fleet, reviews, aggregate] =
    await Promise.all([
      getServices(),
      getFeaturedTours(3),
      getVehicles(),
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
      {/* Iconic African destinations — curated highlights for international visitors */}
      <FeaturedAfrica />
      <Testimonials reviews={reviews} aggregate={aggregate} />
      <FinalCta />
    </>
  );
}

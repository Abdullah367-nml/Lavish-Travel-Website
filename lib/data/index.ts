import type {
  Attraction,
  BlogPost,
  Destination,
  Review,
  TourCategory,
  TourDate,
  TourPackage,
  TransferRoute,
  Vehicle,
  VehicleClass,
} from "@/lib/types";

import {
  fetchAttractions,
  fetchChildAreas,
  fetchDestinationBySlug,
  fetchDestinations,
  fetchTourBySlug,
  fetchTourDateById,
  fetchTourDates,
  fetchTours,
} from "./catalogue";

import { vehicles } from "./vehicles";
import { transferRoutes } from "./transfer-routes";
import { reviews } from "./reviews";
import { blogPosts } from "./blog";
import { services } from "./services";
import { cities, type City } from "./cities";

/**
 * THE DATA-ACCESS LAYER.
 *
 * Every page and component reads through here and nothing else. That single
 * rule is what made switching from TypeScript arrays to a live Postgres
 * database a change to this file rather than a rewrite of the site.
 *
 * Current split:
 *
 *   FROM SUPABASE — destinations, attractions, tours, availability.
 *     These are the booking platform. An admin edits them and the public
 *     site reflects it.
 *
 *   STILL STATIC — vehicles, transfer routes, cities, blog, reviews.
 *     Not part of the booking system. Moving them would be churn with no
 *     benefit, and the brief was explicit about not breaking what works.
 *
 * Filtering for tours happens in memory. With a catalogue this size that is
 * faster than a round trip per filter; past a few hundred tours it should be
 * pushed into the query instead.
 */

// --- destinations ------------------------------------------------------------

export async function getDestinations(): Promise<Destination[]> {
  return fetchDestinations();
}

export async function getDestinationBySlug(
  slug: string,
): Promise<Destination | null> {
  return fetchDestinationBySlug(slug);
}

// --- attractions (new) -------------------------------------------------------

export async function getAttractions(
  destinationSlug?: string,
): Promise<Attraction[]> {
  return fetchAttractions(destinationSlug);
}

/** Published areas nested inside a destination (Camps Bay under Cape Town). */
export async function getChildAreas(
  parentSlug: string,
): Promise<Destination[]> {
  return fetchChildAreas(parentSlug);
}

// --- tours -------------------------------------------------------------------

export type TourFilters = {
  destination?: string;
  category?: TourCategory;
  duration?: { min: number; max: number };
  maxPriceZar?: number;
  groupSize?: number;
};

export async function getTours(
  filters: TourFilters = {},
): Promise<TourPackage[]> {
  const all = await fetchTours();
  return all
    .filter((t) =>
      filters.destination ? t.destinationSlug === filters.destination : true,
    )
    .filter((t) => (filters.category ? t.category === filters.category : true))
    .filter((t) =>
      filters.duration
        ? t.durationDays >= filters.duration.min &&
          t.durationDays <= filters.duration.max
        : true,
    )
    .filter((t) =>
      filters.maxPriceZar ? t.priceFromZar <= filters.maxPriceZar : true,
    )
    .filter((t) =>
      filters.groupSize
        ? t.groupMin <= filters.groupSize && t.groupMax >= filters.groupSize
        : true,
    )
    .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
}

export async function getFeaturedTours(limit = 4): Promise<TourPackage[]> {
  const all = await fetchTours();
  return all.filter((t) => t.isFeatured).slice(0, limit);
}

export async function getTourBySlug(
  destinationSlug: string,
  slug: string,
): Promise<TourPackage | null> {
  return fetchTourBySlug(destinationSlug, slug);
}

/**
 * Params for prerendering tour pages.
 *
 * Returns [] when the database is unreachable — during a build with no
 * network, for instance. Next.js then renders those routes on demand rather
 * than failing the build, which is the behaviour we want: a build should not
 * depend on a third-party service being up.
 */
export async function getAllTourParams(): Promise<
  { destination: string; slug: string }[]
> {
  const all = await fetchTours();
  return all.map((t) => ({ destination: t.destinationSlug, slug: t.slug }));
}

export async function getToursByDestination(
  destinationSlug: string,
): Promise<TourPackage[]> {
  return getTours({ destination: destinationSlug });
}

export async function getRelatedTours(
  tour: TourPackage,
  limit = 3,
): Promise<TourPackage[]> {
  const all = await fetchTours();
  return all
    .filter((t) => t.id !== tour.id)
    .map((t) => ({
      tour: t,
      score:
        (t.destinationSlug === tour.destinationSlug ? 2 : 0) +
        (t.category === tour.category ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.tour.priceFromZar - b.tour.priceFromZar)
    .slice(0, limit)
    .map((s) => s.tour);
}

// --- availability (new) ------------------------------------------------------

export async function getTourDates(tourSlug: string): Promise<TourDate[]> {
  return fetchTourDates(tourSlug);
}

/** Only departures a customer could actually book right now. */
export async function getBookableTourDates(
  tourSlug: string,
): Promise<TourDate[]> {
  const dates = await fetchTourDates(tourSlug);
  return dates.filter(
    (d) => d.availability === "available" || d.availability === "limited",
  );
}

export async function getTourDateById(id: string): Promise<TourDate | null> {
  return fetchTourDateById(id);
}

// --- vehicles (static) -------------------------------------------------------

export async function getVehicles(options?: {
  vehicleClass?: VehicleClass;
  city?: string;
}): Promise<Vehicle[]> {
  return vehicles
    .filter((v) => v.isActive)
    .filter((v) =>
      options?.vehicleClass ? v.class === options.vehicleClass : true,
    )
    .filter((v) =>
      options?.city ? v.citiesAvailable.includes(options.city) : true,
    )
    .sort((a, b) => a.ratePerDayZar - b.ratePerDayZar);
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  return vehicles.find((v) => v.slug === slug && v.isActive) ?? null;
}

export async function getVehiclesBySlugs(slugs: string[]): Promise<Vehicle[]> {
  return vehicles.filter((v) => v.isActive && slugs.includes(v.slug));
}

export async function getSelfDriveVehicles(city?: string): Promise<Vehicle[]> {
  const all = await getVehicles({ city });
  return all.filter((v) => v.selfDriveRateZar > 0);
}

// --- transfer routes (static) ------------------------------------------------

export async function getTransferRoutes(options?: {
  airportCode?: string;
}): Promise<TransferRoute[]> {
  return transferRoutes
    .filter((r) =>
      options?.airportCode ? r.airportCode === options.airportCode : true,
    )
    .sort((a, b) => a.basePriceZar - b.basePriceZar);
}

export async function getTransferRouteBySlug(
  slug: string,
): Promise<TransferRoute | null> {
  return transferRoutes.find((r) => r.slug === slug) ?? null;
}

export async function getTransferRoutesBySlugs(
  slugs: string[],
): Promise<TransferRoute[]> {
  return transferRoutes.filter((r) => slugs.includes(r.slug));
}

// --- reviews (static for now) ------------------------------------------------
// The `reviews` table exists and the moderation UI is part of the admin build.
// Until reviews are actually collected, these seeded testimonials keep the
// homepage honest-looking rather than empty.

export async function getReviews(limit?: number): Promise<Review[]> {
  const approved = reviews
    .filter((r) => r.isApproved)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return limit ? approved.slice(0, limit) : approved;
}

export async function getReviewsForPackage(
  packageId: string,
): Promise<Review[]> {
  return reviews.filter((r) => r.isApproved && r.packageId === packageId);
}

export async function getAggregateRating(
  packageId?: string,
): Promise<{ ratingValue: number; reviewCount: number } | null> {
  const pool = reviews.filter(
    (r) => r.isApproved && (packageId ? r.packageId === packageId : true),
  );
  if (pool.length === 0) return null;
  const total = pool.reduce((sum, r) => sum + r.rating, 0);
  return {
    ratingValue: Math.round((total / pool.length) * 10) / 10,
    reviewCount: pool.length,
  };
}

// --- blog (static) -----------------------------------------------------------

export async function getBlogPosts(options?: {
  category?: string;
  limit?: number;
}): Promise<BlogPost[]> {
  const posts = blogPosts
    .filter((p) => (options?.category ? p.category === options.category : true))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return options?.limit ? posts.slice(0, options.limit) : posts;
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}

export async function getBlogCategories(): Promise<string[]> {
  return [...new Set(blogPosts.map((p) => p.category))].sort();
}

export async function getRelatedBlogPosts(
  post: BlogPost,
  limit = 3,
): Promise<BlogPost[]> {
  return blogPosts
    .filter((p) => p.id !== post.id)
    .sort((a, b) => {
      const aScore = a.category === post.category ? 1 : 0;
      const bScore = b.category === post.category ? 1 : 0;
      return bScore - aScore || b.publishedAt.localeCompare(a.publishedAt);
    })
    .slice(0, limit);
}

// --- static content ----------------------------------------------------------

export async function getServices() {
  return services;
}

export async function getCities(): Promise<City[]> {
  return cities;
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  return cities.find((c) => c.slug === slug) ?? null;
}

export type { City };

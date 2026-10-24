import type { MetadataRoute } from "next";
import {
  getBlogPosts,
  getCities,
  getDestinations,
  getTours,
  getTransferRoutes,
  getVehicles,
} from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

/**
 * Content comes from Supabase and an admin can change it at any time, so this
 * page is revalidated rather than frozen at build time. 60 seconds is a
 * deliberate compromise: an admin edit shows up on the public site within a
 * minute, while normal visitors are still served a cached page rather than
 * hitting the database on every request.
 */
export const revalidate = 60;


/**
 * Sitemap, generated from the data layer.
 *
 * Because it reads through the same async getters as the pages, it can never
 * list a route that does not exist or miss one that does — which is the
 * usual failure mode of a hand-maintained sitemap. When Section 2 swaps the
 * data layer for Supabase, this file needs no changes.
 *
 * `/account` and `/admin` are deliberately absent, and also disallowed in
 * robots.ts.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, destinations, vehicles, routes, posts, cities] =
    await Promise.all([
      getTours(),
      getDestinations(),
      getVehicles(),
      getTransferRoutes(),
      getBlogPosts(),
      getCities(),
    ]);

  const now = new Date();

  /**
   * Annotated before `.map()` rather than after — mapping over a bare array
   * literal widens `changeFrequency` from its union to `string`, which the
   * Sitemap type rejects.
   */
  const staticEntries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/tours"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/transfers"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/chauffeur"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/car-hire"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/destinations"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/fleet"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/enquire"), changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/faq"), changeFrequency: "monthly", priority: 0.5 },
    // Legal pages: low priority, but they must be indexable — ECTA and POPIA
    // both require the disclosures to be publicly findable.
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/popia"), changeFrequency: "yearly", priority: 0.3 },
    {
      url: absoluteUrl("/cancellation-policy"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const staticPages: MetadataRoute.Sitemap = staticEntries.map((entry) => ({
    ...entry,
    lastModified: now,
  }));

  return [
    ...staticPages,

    // Transfer routes first — the highest-intent pages on the site.
    ...routes.map((route) => ({
      url: absoluteUrl(`/transfers/${route.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),

    ...tours.map((tour) => ({
      url: absoluteUrl(`/tours/${tour.destinationSlug}/${tour.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    ...destinations.flatMap((destination) => [
      {
        url: absoluteUrl(`/destinations/${destination.slug}`),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      {
        url: absoluteUrl(`/tours/${destination.slug}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
    ]),

    ...cities.flatMap((city) => [
      {
        url: absoluteUrl(`/chauffeur/${city.slug}`),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
      {
        url: absoluteUrl(`/car-hire/${city.slug}`),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
    ]),

    ...vehicles.map((vehicle) => ({
      url: absoluteUrl(`/car-hire/vehicle/${vehicle.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),

    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}

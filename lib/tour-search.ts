import type { TourCategory } from "@/lib/types";
import type { TourFilters } from "@/lib/data";

/**
 * URL <-> filter translation for the tours listing.
 *
 * Section 4 requires filters to be URL-driven (`?destination=kruger&duration=3-5`)
 * so every combination is shareable and crawlable. That means the *server*
 * component reads the query string and does the filtering, and the client
 * control's only job is to rewrite the URL.
 *
 * Both sides import the option lists and the parser from this one file, so a
 * value the control can produce is always a value the parser understands.
 */

export const CATEGORY_OPTIONS: { value: TourCategory; label: string }[] = [
  { value: "day_tour", label: "Day tours" },
  { value: "multi_day", label: "Multi-day" },
  { value: "safari", label: "Safari" },
  { value: "wine", label: "Winelands" },
  { value: "cultural", label: "Cultural" },
  { value: "adventure", label: "Adventure" },
  { value: "cross_border", label: "Cross-border" },
];

export const DURATION_OPTIONS = [
  { value: "1", label: "Single day", min: 1, max: 1 },
  { value: "2-4", label: "2 to 4 days", min: 2, max: 4 },
  { value: "5-7", label: "5 to 7 days", min: 5, max: 7 },
  { value: "8+", label: "8 days or more", min: 8, max: 365 },
] as const;

export const PRICE_OPTIONS = [
  { value: "2000", label: "Up to R2 000" },
  { value: "5000", label: "Up to R5 000" },
  { value: "15000", label: "Up to R15 000" },
  { value: "25000", label: "Up to R25 000" },
  { value: "40000", label: "Up to R40 000" },
] as const;

export const GROUP_OPTIONS = [
  { value: "1", label: "Travelling solo" },
  { value: "2", label: "2 guests" },
  { value: "4", label: "4 guests" },
  { value: "6", label: "6 guests" },
  { value: "10", label: "10 guests" },
  { value: "20", label: "20+ guests" },
] as const;

/** The raw query shape. Next.js gives repeated keys as arrays. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v;

/**
 * Parse a query string into filters, ignoring anything unrecognised.
 *
 * Validating against the option lists rather than trusting the URL matters:
 * these pages are crawled and linked from anywhere, so `?duration=<script>`
 * has to fall through to "no filter" rather than reaching the data layer.
 */
export function parseTourSearchParams(params: RawSearchParams): TourFilters {
  const filters: TourFilters = {};

  const destination = first(params.destination);
  if (destination && /^[a-z0-9-]{1,64}$/.test(destination)) {
    filters.destination = destination;
  }

  const category = first(params.category);
  if (category && CATEGORY_OPTIONS.some((o) => o.value === category)) {
    filters.category = category as TourCategory;
  }

  const duration = first(params.duration);
  const band = DURATION_OPTIONS.find((o) => o.value === duration);
  if (band) filters.duration = { min: band.min, max: band.max };

  const price = first(params.price);
  if (price && PRICE_OPTIONS.some((o) => o.value === price)) {
    filters.maxPriceZar = Number(price);
  }

  const group = first(params.group);
  if (group && GROUP_OPTIONS.some((o) => o.value === group)) {
    filters.groupSize = Number(group);
  }

  return filters;
}

/** How many filters are active — drives the badge on the mobile trigger. */
export function countActiveFilters(filters: TourFilters): number {
  return Object.keys(filters).length;
}

/**
 * Human-readable summary of the active filters, used in the results count
 * line and — importantly — in the page's <title> and description, so a
 * filtered view is not a duplicate of the unfiltered one.
 */
export function describeFilters(params: RawSearchParams): string[] {
  const parts: string[] = [];
  const category = first(params.category);
  const categoryOption = CATEGORY_OPTIONS.find((o) => o.value === category);
  if (categoryOption) parts.push(categoryOption.label);

  const durationOption = DURATION_OPTIONS.find(
    (o) => o.value === first(params.duration),
  );
  if (durationOption) parts.push(durationOption.label);

  const priceOption = PRICE_OPTIONS.find((o) => o.value === first(params.price));
  if (priceOption) parts.push(priceOption.label);

  const groupOption = GROUP_OPTIONS.find((o) => o.value === first(params.group));
  if (groupOption) parts.push(groupOption.label);

  return parts;
}

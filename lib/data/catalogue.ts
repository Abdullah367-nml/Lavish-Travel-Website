import "server-only";
import type {
  Attraction,
  Destination,
  ItineraryDay,
  Province,
  TourDate,
  TourPackage,
} from "@/lib/types";
import { isSupabaseConfigured, supabasePublic } from "@/lib/supabase/server";
import { destinations as staticDestinations } from "./destinations";
import { tourPackages as staticTours } from "./tours";

/**
 * Supabase-backed catalogue: destinations, attractions, tours, availability.
 *
 * THE POINT OF THIS FILE is that it maps database rows into the exact
 * TypeScript shapes the site already used when the data lived in arrays. Not
 * one card, listing or detail page had to change to move onto a real
 * database — which is what the async data-access seam was built for.
 *
 * Vehicles, transfer routes, cities and blog posts deliberately stay as
 * static files. They are not part of the booking system, and moving them
 * would be churn for no benefit.
 *
 * Every function fails soft. If Supabase is unreachable — no keys yet, no
 * network during a build, an outage — it logs once and returns empty rather
 * than crashing the render. A missing tour list is a bad page; an exception
 * is a broken site.
 */

let warned = false;
function warnOnce(context: string, error: unknown) {
  if (!warned) {
    warned = true;
    console.warn(
      `[catalogue] Supabase unavailable (${context}). Falling back to empty results. ` +
        `Check NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.`,
      error instanceof Error ? error.message : error,
    );
  }
}

/**
 * Wraps a Supabase query promise with a 3-second timeout.
 * Without this, a DNS failure (ENOTFOUND) causes every page to hang for
 * 30-45 seconds before Node's TCP timeout fires.
 */
async function withTimeout<T>(
  queryPromise: Promise<T>,
  context: string,
  fallback: T,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const result = await Promise.race([
      queryPromise,
      new Promise<never>((_, reject) =>
        controller.signal.addEventListener("abort", () =>
          reject(new Error(`Supabase query timed out after 3 s (${context})`)),
        ),
      ),
    ]);
    return result;
  } catch (err) {
    warnOnce(context, err);
    return fallback;
  } finally {
    clearTimeout(timer);
  }
}


// --- row shapes --------------------------------------------------------------

type DestinationRow = {
  id: string;
  slug: string;
  name: string;
  province: string | null;
  country: string;
  description: string;
  body: string[] | null;
  image: string | null;
  lat: number | null;
  lng: number | null;
  best_months: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: string;
  parent_id: string | null;
  region: string | null;
  area_type: string | null;
  suggested_time: string | null;
  best_for: string[] | null;
  parent?: { slug: string; name: string } | null;
};

type AttractionRow = {
  id: string;
  destination_id: string;
  slug: string;
  name: string;
  description: string;
  image: string | null;
  location: string | null;
  sort_order: number;
  category: string | null;
  suggested_time: string | null;
  visitor_note: string | null;
};

type TourRow = {
  id: string;
  slug: string;
  destination_id: string;
  name: string;
  summary: string;
  description: string | null;
  duration_days: number;
  price_adult_zar: number;
  price_child_zar: number;
  capacity: number;
  images: string[] | null;
  itinerary: { day: number; title: string; description: string }[] | null;
  inclusions: string[] | null;
  exclusions: string[] | null;
  what_to_pack: string[] | null;
  faqs: { question: string; answer: string }[] | null;
  pickup_info: string | null;
  difficulty: string;
  category: string;
  is_featured: boolean;
  status: string;
  seo_title: string | null;
  seo_description: string | null;
  destinations?: { slug: string; name: string } | null;
};

// --- mappers -----------------------------------------------------------------

function toDestination(row: DestinationRow): Destination {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    province: (row.province ?? "Western Cape") as Province,
    country: row.country,
    heroImage: row.image,
    intro: row.description,
    body: row.body ?? [],
    lat: Number(row.lat ?? 0),
    lng: Number(row.lng ?? 0),
    seoTitle: row.seo_title ?? row.name,
    seoDescription: row.seo_description ?? row.description,
    isPublished: row.status === "published",
    bestMonths: row.best_months ?? "All year",
    parentId: row.parent_id,
    parentSlug: row.parent?.slug ?? null,
    parentName: row.parent?.name ?? null,
    region: row.region,
    areaType: (row.area_type ?? "destination") as Destination["areaType"],
    suggestedTime: row.suggested_time,
    bestFor: row.best_for ?? [],
  };
}

function toAttraction(row: AttractionRow): Attraction {
  return {
    id: row.id,
    destinationId: row.destination_id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    image: row.image,
    location: row.location,
    sortOrder: row.sort_order,
    category: row.category,
    suggestedTime: row.suggested_time,
    visitorNote: row.visitor_note,
  };
}

function toItinerary(row: TourRow): ItineraryDay[] {
  return (row.itinerary ?? []).map((day, index) => ({
    id: `${row.id}-day-${day.day ?? index + 1}`,
    packageId: row.id,
    dayNumber: day.day ?? index + 1,
    title: day.title,
    description: day.description,
    overnightLocation: null,
    meals: [],
  }));
}

function toTour(row: TourRow, destinationSlug?: string): TourPackage {
  return {
    id: row.id,
    slug: row.slug,
    title: row.name,
    destinationId: row.destination_id,
    destinationSlug: destinationSlug ?? row.destinations?.slug ?? "",
    category: row.category as TourPackage["category"],
    durationDays: row.duration_days,
    groupMin: 1,
    groupMax: row.capacity,
    priceFromZar: row.price_adult_zar,
    summary: row.summary,
    inclusions: row.inclusions ?? [],
    exclusions: row.exclusions ?? [],
    gallery: row.images ?? [],
    difficulty: row.difficulty as TourPackage["difficulty"],
    isFeatured: row.is_featured,
    isPublished: row.status === "published",
    seoTitle: row.seo_title ?? row.name,
    seoDescription: row.seo_description ?? row.summary,
    itinerary: toItinerary(row),
    departsFrom: row.destinations?.name ? [row.destinations.name] : [],
    faqs: row.faqs ?? [],
    whatToPack: row.what_to_pack ?? [],
    priceChildZar: row.price_child_zar,
    capacity: row.capacity,
    pickupInfo: row.pickup_info,
  };
}

const TOUR_SELECT =
  "id,slug,destination_id,name,summary,description,duration_days,price_adult_zar," +
  "price_child_zar,capacity,images,itinerary,inclusions,exclusions,what_to_pack," +
  "faqs,pickup_info,difficulty,category,is_featured,status,seo_title,seo_description," +
  "destinations(slug,name)";

// --- destinations ------------------------------------------------------------

export async function fetchDestinations(): Promise<Destination[]> {
  if (!isSupabaseConfigured()) return staticDestinations;
  const result = await withTimeout(
    Promise.resolve(
      supabasePublic()
        .from("destinations")
        .select("*, parent:parent_id(slug, name)")
        .eq("status", "published")
        .order("sort_order")
        .order("name")
    ).then(({ data, error }) => {
      if (error) throw error;
      return (data as DestinationRow[]).map(toDestination);
    }),
    "fetchDestinations",
    [],
  );
  return result && result.length > 0 ? result : staticDestinations;
}

export async function fetchDestinationBySlug(
  slug: string,
): Promise<Destination | null> {
  if (!isSupabaseConfigured()) {
    return staticDestinations.find((d) => d.slug === slug) ?? null;
  }
  try {
    const data = await withTimeout(
      Promise.resolve(
        supabasePublic()
          .from("destinations")
          .select("*, parent:parent_id(slug, name)")
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle()
      ).then(({ data, error }) => {
        if (error) throw error;
        return data ? toDestination(data as DestinationRow) : null;
      }),
      "fetchDestinationBySlug",
      null,
    );
    return data ?? staticDestinations.find((d) => d.slug === slug) ?? null;
  } catch (error) {
    warnOnce("fetchDestinationBySlug", error);
    return staticDestinations.find((d) => d.slug === slug) ?? null;
  }
}

// --- attractions -------------------------------------------------------------

export async function fetchAttractions(
  destinationSlug?: string,
): Promise<Attraction[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    let query = supabasePublic()
      .from("attractions")
      .select("*, destinations!inner(slug)")
      .eq("status", "published")
      .order("sort_order");
    if (destinationSlug) query = query.eq("destinations.slug", destinationSlug);
    const { data, error } = await query;
    if (error) throw error;
    return (data as AttractionRow[]).map(toAttraction);
  } catch (error) {
    warnOnce("fetchAttractions", error);
    return [];
  }
}

/** Attractions linked to a tour, via the tour_attractions join table. */
export async function fetchTourAttractions(
  tourId: string,
): Promise<Attraction[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabasePublic()
      .from("tour_attractions")
      .select("sort_order, attractions(*)")
      .eq("tour_id", tourId)
      .order("sort_order");
    if (error) throw error;
    return (data as unknown as { attractions: AttractionRow | null }[])
      .map((row) => row.attractions)
      .filter((a): a is AttractionRow => Boolean(a))
      .map(toAttraction);
  } catch (error) {
    warnOnce("fetchTourAttractions", error);
    return [];
  }
}

// --- tours -------------------------------------------------------------------

export async function fetchTours(): Promise<TourPackage[]> {
  if (!isSupabaseConfigured()) return staticTours;
  const result = await withTimeout(
    Promise.resolve(
      supabasePublic()
        .from("tours")
        .select(TOUR_SELECT)
        .eq("status", "published")
        .order("price_adult_zar")
    ).then(({ data, error }) => {
      if (error) throw error;
      return (data as unknown as TourRow[]).map((row) => toTour(row));
    }),
    "fetchTours",
    [],
  );
  return result && result.length > 0 ? result : staticTours;
}

export async function fetchTourBySlug(
  destinationSlug: string,
  slug: string,
): Promise<TourPackage | null> {
  const fallback =
    staticTours.find(
      (t) => t.slug === slug && t.destinationSlug === destinationSlug,
    ) ?? null;

  if (!isSupabaseConfigured()) return fallback;
  try {
    const { data, error } = await supabasePublic()
      .from("tours")
      .select(TOUR_SELECT)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw error;
    if (!data) return fallback;
    const tour = toTour(data as unknown as TourRow);
    // Guard the URL: /tours/stellenbosch/cape-town-explorer must not resolve.
    if (tour.destinationSlug !== destinationSlug) return null;
    tour.attractions = await fetchTourAttractions(tour.id);
    return tour;
  } catch (error) {
    warnOnce("fetchTourBySlug", error);
    return fallback;
  }
}

// --- availability ------------------------------------------------------------

/**
 * Upcoming departures for a tour, read from the `tour_date_availability`
 * view — the single definition of "seats left" shared by the public site,
 * the booking wizard and the admin screens.
 */
export async function fetchTourDates(tourSlug: string): Promise<TourDate[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabasePublic()
      .from("tour_date_availability")
      .select("*")
      .eq("tour_slug", tourSlug)
      .gte("tour_date", today)
      .order("tour_date");
    if (error) throw error;
    return (
      data as {
        tour_date_id: string;
        tour_id: string;
        tour_slug: string;
        tour_date: string;
        capacity: number;
        seats_booked: number;
        seats_remaining: number;
        availability: TourDate["availability"];
      }[]
    ).map((row) => ({
      id: row.tour_date_id,
      tourId: row.tour_id,
      tourSlug: row.tour_slug,
      date: row.tour_date,
      capacity: row.capacity,
      seatsBooked: row.seats_booked,
      seatsRemaining: row.seats_remaining,
      availability: row.availability,
    }));
  } catch (error) {
    warnOnce("fetchTourDates", error);
    return [];
  }
}

export async function fetchTourDateById(id: string): Promise<TourDate | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabasePublic()
      .from("tour_date_availability")
      .select("*")
      .eq("tour_date_id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const row = data as Record<string, never> & {
      tour_date_id: string;
      tour_id: string;
      tour_slug: string;
      tour_date: string;
      capacity: number;
      seats_booked: number;
      seats_remaining: number;
      availability: TourDate["availability"];
    };
    return {
      id: row.tour_date_id,
      tourId: row.tour_id,
      tourSlug: row.tour_slug,
      date: row.tour_date,
      capacity: row.capacity,
      seatsBooked: row.seats_booked,
      seatsRemaining: row.seats_remaining,
      availability: row.availability,
    };
  } catch (error) {
    warnOnce("fetchTourDateById", error);
    return null;
  }
}

/**
 * Published areas nested inside a destination — Camps Bay and Sea Point
 * under Cape Town, for instance.
 *
 * Only published children are returned, so a city page never advertises an
 * area that has not been reviewed yet.
 */
export async function fetchChildAreas(
  parentSlug: string,
): Promise<Destination[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const parent = await fetchDestinationBySlug(parentSlug);
    if (!parent) return [];
    const { data, error } = await supabasePublic()
      .from("destinations")
      .select("*, parent:parent_id(slug, name)")
      .eq("parent_id", parent.id)
      .eq("status", "published")
      .order("name");
    if (error) throw error;
    return (data as unknown as DestinationRow[]).map(toDestination);
  } catch (error) {
    warnOnce("fetchChildAreas", error);
    return [];
  }
}

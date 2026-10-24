/**
 * Domain model for Lavish Travels & Tours.
 *
 * These types mirror the Supabase tables specified in Section 2 field for
 * field, so the demo's mock data and the eventual database rows are the
 * same shape. When Section 2 lands, only `lib/data/index.ts` changes —
 * every component keeps consuming these types unchanged.
 *
 * Conventions carried over from the schema:
 *  - ids are uuid strings
 *  - money is stored in ZAR as a whole-rand integer (never a float, never
 *    a display string) and formatted at the edge by `lib/format.ts`
 *  - dates are ISO-8601 strings (`timestamptz` / `date` in Postgres)
 */

export type Uuid = string;
/** ISO-8601 date, e.g. "2026-11-14". */
export type IsoDate = string;

// --- destinations ----------------------------------------------------------

export type Province =
  | "Western Cape"
  | "Gauteng"
  | "KwaZulu-Natal"
  | "Mpumalanga"
  | "Limpopo"
  | "Eastern Cape"
  | "Free State"
  | "North West"
  | "Northern Cape"
  | "Cross-border";

export type Destination = {
  id: Uuid;
  slug: string;
  name: string;
  province: Province;
  country: string;
  heroImage: string | null;
  /** Short lead paragraph used on cards and listings. */
  intro: string;
  /** Long-form body copy for the destination page. */
  body: string[];
  lat: number;
  lng: number;
  seoTitle: string;
  seoDescription: string;
  isPublished: boolean;
  /** Months this destination is at its best — drives seasonal copy. */
  bestMonths: string;

  // --- hierarchy (added with the Cape Town area guide) ---------------------
  /** Null for a city or standalone town; set for an area inside one. */
  parentId?: Uuid | null;
  parentSlug?: string | null;
  parentName?: string | null;
  /** Groups top-level destinations on the listing page. */
  region?: string | null;
  areaType?:
    | "destination"
    | "area"
    | "town"
    | "wine_area"
    | "coastal_town"
    | "nature";
  /** "Half day", "One to two days" — guidance, not a booking field. */
  suggestedTime?: string | null;
  /** The guide's "Best for" line, as tags. */
  bestFor?: string[];
  /** Areas nested inside this destination. */
  areas?: Destination[];
  /** Populated on the destination page. */
  attractions?: Attraction[];
};

// --- tour packages ---------------------------------------------------------

export type TourCategory =
  | "day_tour"
  | "multi_day"
  | "safari"
  | "wine"
  | "cultural"
  | "adventure"
  | "cross_border";

export type Difficulty = "easy" | "moderate" | "challenging";

export type ItineraryDay = {
  id: Uuid;
  packageId: Uuid;
  dayNumber: number;
  title: string;
  description: string;
  overnightLocation: string | null;
  meals: ("breakfast" | "lunch" | "dinner")[];
};

export type TourPackage = {
  id: Uuid;
  slug: string;
  title: string;
  destinationId: Uuid;
  /** Denormalised for routing: /tours/{destinationSlug}/{slug} */
  destinationSlug: string;
  category: TourCategory;
  durationDays: number;
  groupMin: number;
  groupMax: number;
  /** "From" price per person, whole rands. */
  priceFromZar: number;
  summary: string;
  inclusions: string[];
  exclusions: string[];
  gallery: string[];
  difficulty: Difficulty;
  isFeatured: boolean;
  isPublished: boolean;
  seoTitle: string;
  seoDescription: string;
  itinerary: ItineraryDay[];
  /** Departure cities this package can start from. */
  departsFrom: string[];
  faqs: { question: string; answer: string }[];
  whatToPack: string[];

  // --- booking-platform fields ----------------------------------------------
  // Optional so every component written before the database existed still
  // type-checks unchanged.
  /** Per-child price. 0 means the tour does not take children. */
  priceChildZar?: number;
  /** Default seats per departure; individual dates may differ. */
  capacity?: number;
  pickupInfo?: string | null;
  /** Populated on the detail page via the tour_attractions join. */
  attractions?: Attraction[];
};

// --- vehicles --------------------------------------------------------------

export type VehicleClass =
  | "executive_sedan"
  | "luxury_suv"
  | "minibus"
  | "coach"
  | "4x4";

export type Vehicle = {
  id: Uuid;
  slug: string;
  name: string;
  class: VehicleClass;
  make: string;
  model: string;
  seats: number;
  /** Number of large suitcases. */
  luggage: number;
  features: string[];
  image: string | null;
  gallery: string[];
  ratePerDayZar: number;
  ratePerKmZar: number;
  /** Day rate with a professional driver. */
  chauffeurRateZar: number;
  /** Day rate driving it yourself. */
  selfDriveRateZar: number;
  citiesAvailable: string[];
  isActive: boolean;
};

// --- transfer routes -------------------------------------------------------

export type TransferRoute = {
  id: Uuid;
  slug: string;
  origin: string;
  destination: string;
  /** IATA code where the route starts or ends at an airport. */
  airportCode: string | null;
  basePriceZar: number;
  durationMinutes: number;
  distanceKm: number;
  /** Vehicle slugs offered on this route. */
  vehicleSlugs: string[];
  notes: string;
};

// --- reviews ---------------------------------------------------------------

export type TravellerType =
  | "couple"
  | "family"
  | "solo"
  | "business"
  | "group";

export type Review = {
  id: Uuid;
  authorName: string;
  authorCountry: string;
  packageId: Uuid | null;
  vehicleId: Uuid | null;
  /** 1–5, enforced by a check constraint in Postgres. */
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  travellerType: TravellerType;
  isApproved: boolean;
  createdAt: IsoDate;
};

// --- blog ------------------------------------------------------------------

export type BlogPost = {
  id: Uuid;
  slug: string;
  title: string;
  excerpt: string;
  /** Paragraphs; becomes MDX once the CMS lands in Phase 3. */
  body: string[];
  coverImage: string | null;
  author: string;
  category: string;
  publishedAt: IsoDate;
  readingMinutes: number;
  seoTitle: string;
  seoDescription: string;
};

// --- services (static content, not a database table) -----------------------

export type ServiceSummary = {
  slug: string;
  name: string;
  tagline: string;
  href: string;
  /** Lucide icon name, resolved by the card component. */
  icon: "plane" | "steering" | "car" | "map" | "users" | "gift";
};

// =============================================================================
// Booking platform additions.
//
// These arrived with the Supabase database. The types above are unchanged on
// purpose: the data layer maps database rows INTO those existing shapes, so
// every card, listing and detail page built earlier keeps working untouched.
// New capability is added here rather than by rewriting what already worked.
// =============================================================================

/** A place of interest within a destination. */
export type Attraction = {
  id: Uuid;
  destinationId: Uuid;
  slug: string;
  name: string;
  description: string;
  image: string | null;
  location: string | null;
  sortOrder: number;
  category?: string | null;
  suggestedTime?: string | null;
  /** Practical warning or tip — booking ahead, weather, safety. */
  visitorNote?: string | null;
};

export type AvailabilityState =
  | "available"
  | "limited"
  | "sold_out"
  | "closed"
  | "past";

/** A single departure of a tour, with live seat counts. */
export type TourDate = {
  id: Uuid;
  tourId: Uuid;
  tourSlug: string;
  date: IsoDate;
  capacity: number;
  seatsBooked: number;
  seatsRemaining: number;
  availability: AvailabilityState;
};

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type Booking = {
  id: Uuid;
  reference: string;
  userId: Uuid;
  tourId: Uuid;
  tourDateId: Uuid;
  adults: number;
  children: number;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  contactCountry: string | null;
  pickupLocation: string | null;
  specialRequirements: string | null;
  unitPriceAdultZar: number;
  unitPriceChildZar: number;
  totalAmountZar: number;
  bookingStatus: BookingStatus;
  createdAt: string;
  /** Joined for display in My Bookings and the admin list. */
  tourName?: string;
  tourSlug?: string;
  destinationName?: string;
  destinationSlug?: string;
  tourDate?: IsoDate;
  paymentStatus?: PaymentStatus;
};

export type Profile = {
  id: Uuid;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string | null;
  role: "customer" | "admin";
  createdAt: string;
};

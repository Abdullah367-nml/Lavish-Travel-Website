import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import type { Booking, BookingStatus, PaymentStatus } from "@/lib/types";

/**
 * Admin data access.
 *
 * Every function here calls `requireAdmin()` first, which reads the caller's
 * role from `profiles` and 404s anyone else. Only after that gate passes does
 * it use the service-role client, which bypasses row-level security.
 *
 * That ordering is the whole safety argument, so it is worth being explicit:
 * the service-role key can read and write every row in the database. It is
 * used here because an admin legitimately needs to see other people's
 * bookings — something RLS is specifically designed to prevent. The gate is
 * what makes that acceptable, and it must never be removed "temporarily".
 *
 * Reading the role from `profiles` rather than the JWT is deliberate too: it
 * means promoting someone to admin is a single UPDATE, with no need to also
 * edit auth metadata and have them sign out and back in.
 */

// --- dashboard ----------------------------------------------------------------

export type AdminStats = {
  totalTours: number;
  publishedTours: number;
  totalBookings: number;
  pendingBookings: number;
  upcomingDepartures: number;
  totalCustomers: number;
  totalRevenueZar: number;
  paidRevenueZar: number;
  newEnquiries: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  await requireAdmin();
  const db = supabaseAdmin();
  const today = new Date().toISOString().slice(0, 10);

  const [
    tours,
    publishedTours,
    bookings,
    pending,
    departures,
    customers,
    revenueRows,
    enquiries,
  ] = await Promise.all([
    db.from("tours").select("id", { count: "exact", head: true }),
    db.from("tours").select("id", { count: "exact", head: true }).eq("status", "published"),
    db.from("bookings").select("id", { count: "exact", head: true }),
    db.from("bookings").select("id", { count: "exact", head: true }).eq("booking_status", "pending"),
    db.from("tour_dates").select("id", { count: "exact", head: true }).gte("tour_date", today).eq("status", "open"),
    db.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
    // Cancelled bookings are excluded from revenue — counting them would
    // inflate every figure on the dashboard.
    db.from("bookings").select("total_amount_zar, booking_status").neq("booking_status", "cancelled"),
    db.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  const rows = (revenueRows.data ?? []) as { total_amount_zar: number; booking_status: string }[];
  const totalRevenueZar = rows.reduce((sum, r) => sum + r.total_amount_zar, 0);

  // "Paid" is derived from the payments table, not from booking status —
  // a confirmed booking is not necessarily a paid one.
  const { data: paidRows } = await db
    .from("payments")
    .select("amount_zar")
    .eq("payment_status", "paid");
  const paidRevenueZar = ((paidRows ?? []) as { amount_zar: number }[]).reduce(
    (sum, r) => sum + r.amount_zar,
    0,
  );

  return {
    totalTours: tours.count ?? 0,
    publishedTours: publishedTours.count ?? 0,
    totalBookings: bookings.count ?? 0,
    pendingBookings: pending.count ?? 0,
    upcomingDepartures: departures.count ?? 0,
    totalCustomers: customers.count ?? 0,
    totalRevenueZar,
    paidRevenueZar,
    newEnquiries: enquiries.count ?? 0,
  };
}

// --- bookings -----------------------------------------------------------------

const BOOKING_SELECT = `
  id, reference, user_id, tour_id, tour_date_id, adults, children,
  contact_first_name, contact_last_name, contact_email, contact_phone,
  contact_country, pickup_location, special_requirements,
  unit_price_adult_zar, unit_price_child_zar, total_amount_zar,
  booking_status, created_at,
  tours ( name, slug, destinations ( name, slug ) ),
  tour_dates ( tour_date ),
  payments ( payment_status )
`;

type Row = {
  id: string; reference: string; user_id: string; tour_id: string;
  tour_date_id: string; adults: number; children: number;
  contact_first_name: string; contact_last_name: string;
  contact_email: string; contact_phone: string; contact_country: string | null;
  pickup_location: string | null; special_requirements: string | null;
  unit_price_adult_zar: number; unit_price_child_zar: number;
  total_amount_zar: number; booking_status: BookingStatus; created_at: string;
  tours: { name: string; slug: string; destinations: { name: string; slug: string } | null } | null;
  tour_dates: { tour_date: string } | null;
  payments: { payment_status: PaymentStatus }[] | null;
};

function toBooking(row: Row): Booking {
  return {
    id: row.id,
    reference: row.reference,
    userId: row.user_id,
    tourId: row.tour_id,
    tourDateId: row.tour_date_id,
    adults: row.adults,
    children: row.children,
    contactFirstName: row.contact_first_name,
    contactLastName: row.contact_last_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    contactCountry: row.contact_country,
    pickupLocation: row.pickup_location,
    specialRequirements: row.special_requirements,
    unitPriceAdultZar: row.unit_price_adult_zar,
    unitPriceChildZar: row.unit_price_child_zar,
    totalAmountZar: row.total_amount_zar,
    bookingStatus: row.booking_status,
    createdAt: row.created_at,
    tourName: row.tours?.name,
    tourSlug: row.tours?.slug,
    destinationName: row.tours?.destinations?.name,
    destinationSlug: row.tours?.destinations?.slug,
    tourDate: row.tour_dates?.tour_date,
    paymentStatus: row.payments?.[0]?.payment_status ?? "pending",
  };
}

export type BookingFilters = {
  status?: BookingStatus;
  payment?: PaymentStatus;
  tourSlug?: string;
  search?: string;
};

export async function getAdminBookings(
  filters: BookingFilters = {},
): Promise<Booking[]> {
  await requireAdmin();
  const db = supabaseAdmin();

  let query = db.from("bookings").select(BOOKING_SELECT).order("created_at", { ascending: false });

  if (filters.status) query = query.eq("booking_status", filters.status);
  if (filters.search) {
    // Reference, name or email. `or()` takes a PostgREST filter string, so
    // the term is stripped of the characters that would let someone break
    // out of it — commas and parentheses are syntax here.
    const term = filters.search.replace(/[,()*]/g, "").trim();
    if (term) {
      query = query.or(
        `reference.ilike.%${term}%,contact_email.ilike.%${term}%,contact_last_name.ilike.%${term}%,contact_first_name.ilike.%${term}%`,
      );
    }
  }

  const { data, error } = await query.limit(200);
  if (error) {
    console.error("[admin] bookings query failed:", error.message);
    return [];
  }

  let bookings = (data as unknown as Row[]).map(toBooking);

  // Payment status and tour slug live on joined rows, so they are filtered
  // after mapping rather than in the query.
  if (filters.payment) {
    bookings = bookings.filter((b) => b.paymentStatus === filters.payment);
  }
  if (filters.tourSlug) {
    bookings = bookings.filter((b) => b.tourSlug === filters.tourSlug);
  }

  return bookings;
}

export async function getAdminBookingById(id: string): Promise<Booking | null> {
  await requireAdmin();
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("bookings")
    .select(BOOKING_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return toBooking(data as unknown as Row);
}

// --- customers ----------------------------------------------------------------

export type AdminCustomer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string | null;
  createdAt: string;
  bookingCount: number;
  totalSpentZar: number;
};

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  await requireAdmin();
  const db = supabaseAdmin();

  const [{ data: profiles }, { data: bookings }] = await Promise.all([
    db.from("profiles").select("*").eq("role", "customer").order("created_at", { ascending: false }),
    db.from("bookings").select("user_id, total_amount_zar, booking_status"),
  ]);

  const stats = new Map<string, { count: number; total: number }>();
  for (const b of (bookings ?? []) as {
    user_id: string;
    total_amount_zar: number;
    booking_status: string;
  }[]) {
    const cur = stats.get(b.user_id) ?? { count: 0, total: 0 };
    cur.count += 1;
    if (b.booking_status !== "cancelled") cur.total += b.total_amount_zar;
    stats.set(b.user_id, cur);
  }

  return ((profiles ?? []) as {
    id: string; first_name: string; last_name: string; email: string;
    phone: string | null; country: string | null; created_at: string;
  }[]).map((p) => ({
    id: p.id,
    firstName: p.first_name,
    lastName: p.last_name,
    email: p.email,
    phone: p.phone,
    country: p.country,
    createdAt: p.created_at,
    bookingCount: stats.get(p.id)?.count ?? 0,
    totalSpentZar: stats.get(p.id)?.total ?? 0,
  }));
  // Note: no password field is selected, because none exists in this table.
  // Supabase Auth owns credentials; the admin panel cannot expose them.
}

// --- catalogue (for admin lists) ----------------------------------------------

export async function getAdminTours() {
  await requireAdmin();
  const db = supabaseAdmin();
  const { data } = await db
    .from("tours")
    .select("id, slug, name, status, price_adult_zar, price_child_zar, capacity, is_featured, destinations(name, slug)")
    .order("name");
  return (data ?? []) as unknown as {
    id: string; slug: string; name: string; status: string;
    price_adult_zar: number; price_child_zar: number; capacity: number;
    is_featured: boolean; destinations: { name: string; slug: string } | null;
  }[];
}

export async function getAdminTourDates() {
  await requireAdmin();
  const db = supabaseAdmin();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await db
    .from("tour_date_availability")
    .select("*")
    .gte("tour_date", today)
    .order("tour_date")
    .limit(200);
  return (data ?? []) as {
    tour_date_id: string; tour_id: string; tour_slug: string; tour_date: string;
    capacity: number; seats_booked: number; seats_remaining: number;
    status: string; availability: string;
  }[];
}

// --- destinations & attractions -----------------------------------------------

export type AdminDestination = {
  id: string;
  slug: string;
  name: string;
  status: string;
  region: string | null;
  areaType: string;
  parentName: string | null;
  attractionCount: number;
  publishedAttractionCount: number;
  tourCount: number;
};

/**
 * Every destination, published or draft, grouped-ready for the admin list.
 *
 * Counts are computed in one pass rather than per-row, because 44
 * destinations x 2 count queries is 88 round trips for information that fits
 * in two.
 */
export async function getAdminDestinations(): Promise<AdminDestination[]> {
  await requireAdmin();
  const db = supabaseAdmin();

  const [{ data: dests }, { data: attrs }, { data: tours }] = await Promise.all([
    db
      .from("destinations")
      .select("id, slug, name, status, region, area_type, parent:parent_id(name)")
      .order("region", { nullsFirst: false })
      .order("name"),
    db.from("attractions").select("destination_id, status"),
    db.from("tours").select("destination_id"),
  ]);

  const attrCounts = new Map<string, { total: number; published: number }>();
  for (const a of (attrs ?? []) as { destination_id: string; status: string }[]) {
    const cur = attrCounts.get(a.destination_id) ?? { total: 0, published: 0 };
    cur.total += 1;
    if (a.status === "published") cur.published += 1;
    attrCounts.set(a.destination_id, cur);
  }

  const tourCounts = new Map<string, number>();
  for (const t of (tours ?? []) as { destination_id: string }[]) {
    tourCounts.set(t.destination_id, (tourCounts.get(t.destination_id) ?? 0) + 1);
  }

  return ((dests ?? []) as unknown as {
    id: string; slug: string; name: string; status: string;
    region: string | null; area_type: string;
    parent: { name: string } | null;
  }[]).map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    status: d.status,
    region: d.region,
    areaType: d.area_type,
    parentName: d.parent?.name ?? null,
    attractionCount: attrCounts.get(d.id)?.total ?? 0,
    publishedAttractionCount: attrCounts.get(d.id)?.published ?? 0,
    tourCount: tourCounts.get(d.id) ?? 0,
  }));
}
// =============================================================================
// APPEND THIS to the END of lib/admin.ts (after the existing content).
// Do not replace the file — these are new functions alongside what's there.
// =============================================================================

// --- tours: single record + writes -------------------------------------------

const ADMIN_TOUR_SELECT = `
  id, slug, destination_id, name, summary, description, duration_days,
  price_adult_zar, price_child_zar, capacity, images, itinerary,
  inclusions, exclusions, what_to_pack, faqs, pickup_info, difficulty,
  category, is_featured, status, seo_title, seo_description,
  tour_attractions ( attraction_id )
`;

type AdminTourRow = {
  id: string; slug: string; destination_id: string; name: string;
  summary: string; description: string | null; duration_days: number;
  price_adult_zar: number; price_child_zar: number; capacity: number;
  images: string[] | null;
  itinerary: { day: number; title: string; description: string }[] | null;
  inclusions: string[] | null; exclusions: string[] | null;
  what_to_pack: string[] | null;
  faqs: { question: string; answer: string }[] | null;
  pickup_info: string | null; difficulty: string; category: string;
  is_featured: boolean; status: string;
  seo_title: string | null; seo_description: string | null;
  tour_attractions: { attraction_id: string }[] | null;
};

export type AdminTourDetail = {
  id: string;
  slug: string;
  destinationId: string;
  name: string;
  summary: string;
  description: string | null;
  durationDays: number;
  priceAdultZar: number;
  priceChildZar: number;
  capacity: number;
  images: string[];
  itinerary: { day: number; title: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
  whatToPack: string[];
  faqs: { question: string; answer: string }[];
  pickupInfo: string | null;
  difficulty: string;
  category: string;
  isFeatured: boolean;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
  attractionIds: string[];
};

/**
 * Full detail for one tour, for the edit form. Unlike the public
 * fetchTourBySlug in catalogue.ts, this does not filter by status — a
 * draft tour must still be editable.
 */
export async function getAdminTourById(id: string): Promise<AdminTourDetail | null> {
  await requireAdmin();
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("tours")
    .select(ADMIN_TOUR_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;

  const row = data as unknown as AdminTourRow;
  return {
    id: row.id,
    slug: row.slug,
    destinationId: row.destination_id,
    name: row.name,
    summary: row.summary,
    description: row.description,
    durationDays: row.duration_days,
    priceAdultZar: row.price_adult_zar,
    priceChildZar: row.price_child_zar,
    capacity: row.capacity,
    images: row.images ?? [],
    itinerary: row.itinerary ?? [],
    inclusions: row.inclusions ?? [],
    exclusions: row.exclusions ?? [],
    whatToPack: row.what_to_pack ?? [],
    faqs: row.faqs ?? [],
    pickupInfo: row.pickup_info,
    difficulty: row.difficulty,
    category: row.category,
    isFeatured: row.is_featured,
    status: row.status,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    attractionIds: (row.tour_attractions ?? []).map((a) => a.attraction_id),
  };
}

export type TourWriteInput = {
  slug: string;
  destinationId: string;
  name: string;
  summary: string;
  description: string | null;
  durationDays: number;
  priceAdultZar: number;
  priceChildZar: number;
  capacity: number;
  images: string[];
  itinerary: { day: number; title: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
  whatToPack: string[];
  faqs: { question: string; answer: string }[];
  pickupInfo: string | null;
  difficulty: string;
  category: string;
  isFeatured: boolean;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
  attractionIds: string[];
};

function toTourRow(input: TourWriteInput) {
  return {
    slug: input.slug,
    destination_id: input.destinationId,
    name: input.name,
    summary: input.summary,
    description: input.description,
    duration_days: input.durationDays,
    price_adult_zar: input.priceAdultZar,
    price_child_zar: input.priceChildZar,
    capacity: input.capacity,
    images: input.images,
    itinerary: input.itinerary,
    inclusions: input.inclusions,
    exclusions: input.exclusions,
    what_to_pack: input.whatToPack,
    faqs: input.faqs,
    pickup_info: input.pickupInfo,
    difficulty: input.difficulty,
    category: input.category,
    is_featured: input.isFeatured,
    status: input.status,
    seo_title: input.seoTitle,
    seo_description: input.seoDescription,
  };
}

/**
 * Replaces the full set of attraction links for a tour. Delete-then-insert
 * rather than diffing — simpler, and the join table carries no data of its
 * own beyond sort_order, so there is nothing a diff would preserve.
 */
async function syncTourAttractions(
  db: ReturnType<typeof supabaseAdmin>,
  tourId: string,
  attractionIds: string[],
) {
  await db.from("tour_attractions").delete().eq("tour_id", tourId);
  if (attractionIds.length === 0) return;
  await db.from("tour_attractions").insert(
    attractionIds.map((attractionId, index) => ({
      tour_id: tourId,
      attraction_id: attractionId,
      sort_order: index,
    })),
  );
}

export async function createAdminTour(
  input: TourWriteInput,
): Promise<{ id: string } | { error: string }> {
  await requireAdmin();
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("tours")
    .insert(toTourRow(input))
    .select("id")
    .single();
  if (error) {
    // 23505 = unique_violation. The slug column has a unique constraint.
    if (error.code === "23505") return { error: "A tour with that slug already exists." };
    return { error: error.message };
  }
  await syncTourAttractions(db, data.id, input.attractionIds);
  return { id: data.id };
}

export async function updateAdminTour(
  id: string,
  input: TourWriteInput,
): Promise<{ id: string } | { error: string }> {
  await requireAdmin();
  const db = supabaseAdmin();
  const { error } = await db.from("tours").update(toTourRow(input)).eq("id", id);
  if (error) {
    if (error.code === "23505") return { error: "A tour with that slug already exists." };
    return { error: error.message };
  }
  await syncTourAttractions(db, id, input.attractionIds);
  return { id };
}

// --- attractions, flattened for the checkbox picker ---------------------------

export type AdminAttractionOption = {
  id: string;
  name: string;
  destinationName: string;
};

/**
 * Every attraction regardless of status, for the tour form's checkbox
 * list. An admin building a tour around a not-yet-published attraction is
 * a normal editing order, not an error case.
 */
export async function getAdminAttractionOptions(): Promise<AdminAttractionOption[]> {
  await requireAdmin();
  const db = supabaseAdmin();
  const { data } = await db
    .from("attractions")
    .select("id, name, destinations(name)")
    .order("name");
  return (
    (data ?? []) as unknown as {
      id: string;
      name: string;
      destinations: { name: string } | null;
    }[]
  ).map((a) => ({
    id: a.id,
    name: a.name,
    destinationName: a.destinations?.name ?? "Unassigned",
  }));
}
// =============================================================================
// APPEND THIS to the END of lib/admin.ts, after everything else (including
// the tour functions you added earlier).
// =============================================================================

// --- destinations: single record + writes -------------------------------------

const ADMIN_DESTINATION_SELECT = `
  id, slug, name, province, country, description, body, image, lat, lng,
  best_months, seo_title, seo_description, status, sort_order, parent_id,
  region, area_type, suggested_time, best_for
`;

type AdminDestinationRow = {
  id: string; slug: string; name: string; province: string | null;
  country: string; description: string; body: string[] | null;
  image: string | null; lat: number | null; lng: number | null;
  best_months: string | null; seo_title: string | null;
  seo_description: string | null; status: string; sort_order: number;
  parent_id: string | null; region: string | null; area_type: string;
  suggested_time: string | null; best_for: string[] | null;
};

export type AdminDestinationDetail = {
  id: string;
  slug: string;
  name: string;
  province: string | null;
  country: string;
  description: string;
  body: string[];
  image: string | null;
  lat: number | null;
  lng: number | null;
  bestMonths: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: string;
  sortOrder: number;
  parentId: string | null;
  region: string | null;
  areaType: string;
  suggestedTime: string | null;
  bestFor: string[];
};

export async function getAdminDestinationById(
  id: string,
): Promise<AdminDestinationDetail | null> {
  await requireAdmin();
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("destinations")
    .select(ADMIN_DESTINATION_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;

  const row = data as unknown as AdminDestinationRow;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    province: row.province,
    country: row.country,
    description: row.description,
    body: row.body ?? [],
    image: row.image,
    lat: row.lat,
    lng: row.lng,
    bestMonths: row.best_months,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    status: row.status,
    sortOrder: row.sort_order,
    parentId: row.parent_id,
    region: row.region,
    areaType: row.area_type,
    suggestedTime: row.suggested_time,
    bestFor: row.best_for ?? [],
  };
}

export type DestinationWriteInput = {
  slug: string;
  name: string;
  province: string | null;
  country: string;
  description: string;
  body: string[];
  image: string | null;
  lat: number | null;
  lng: number | null;
  bestMonths: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: string;
  sortOrder: number;
  parentId: string | null;
  region: string | null;
  areaType: string;
  suggestedTime: string | null;
  bestFor: string[];
};

function toDestinationRow(input: DestinationWriteInput) {
  return {
    slug: input.slug,
    name: input.name,
    province: input.province,
    country: input.country,
    description: input.description,
    body: input.body,
    image: input.image,
    lat: input.lat,
    lng: input.lng,
    best_months: input.bestMonths,
    seo_title: input.seoTitle,
    seo_description: input.seoDescription,
    status: input.status,
    sort_order: input.sortOrder,
    parent_id: input.parentId,
    region: input.region,
    area_type: input.areaType,
    suggested_time: input.suggestedTime,
    best_for: input.bestFor,
  };
}

export async function createAdminDestination(
  input: DestinationWriteInput,
): Promise<{ id: string } | { error: string }> {
  await requireAdmin();
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("destinations")
    .insert(toDestinationRow(input))
    .select("id")
    .single();
  if (error) {
    if (error.code === "23505") return { error: "A destination with that slug already exists." };
    return { error: error.message };
  }
  return { id: data.id };
}

export async function updateAdminDestination(
  id: string,
  input: DestinationWriteInput,
): Promise<{ id: string } | { error: string }> {
  await requireAdmin();
  const db = supabaseAdmin();

  // Friendlier than letting the database's own check constraint
  // (destinations_no_self_parent) surface a raw Postgres error.
  if (input.parentId === id) {
    return { error: "A destination cannot be set as its own parent." };
  }

  const { error } = await db.from("destinations").update(toDestinationRow(input)).eq("id", id);
  if (error) {
    if (error.code === "23505") return { error: "A destination with that slug already exists." };
    if (error.code === "23514") return { error: "A destination cannot be its own parent." };
    return { error: error.message };
  }
  return { id };
}

// =============================================================================
// TOUR DATES / AVAILABILITY WRITES (Part 20)
// =============================================================================

export type AdminTourDateRow = {
  id: string;
  tourId: string;
  tourName: string;
  tourSlug: string;
  tourDate: string;
  capacity: number;
  seatsBooked: number;
  seatsRemaining: number;
  status: "open" | "closed" | "cancelled";
  availability: "available" | "limited" | "sold_out" | "closed" | "past";
};

export async function getAdminTourDatesFull(tourIdFilter?: string): Promise<AdminTourDateRow[]> {
  await requireAdmin();
  const db = supabaseAdmin();
  const today = new Date().toISOString().slice(0, 10);

  let query = db
    .from("tour_dates")
    .select("id, tour_id, tour_date, capacity, seats_booked, status, tours(name, slug)")
    .gte("tour_date", today)
    .order("tour_date");

  if (tourIdFilter) {
    query = query.eq("tour_id", tourIdFilter);
  }

  const { data, error } = await query.limit(300);
  if (error || !data) return [];

  return (data as unknown as {
    id: string;
    tour_id: string;
    tour_date: string;
    capacity: number;
    seats_booked: number;
    status: "open" | "closed" | "cancelled";
    tours: { name: string; slug: string } | null;
  }[]).map((r) => {
    const remaining = Math.max(r.capacity - r.seats_booked, 0);
    let availability: AdminTourDateRow["availability"] = "available";
    if (r.status !== "open") availability = "closed";
    else if (r.tour_date < today) availability = "past";
    else if (remaining === 0) availability = "sold_out";
    else if (remaining <= 5) availability = "limited";

    return {
      id: r.id,
      tourId: r.tour_id,
      tourName: r.tours?.name ?? "Unknown tour",
      tourSlug: r.tours?.slug ?? "",
      tourDate: r.tour_date,
      capacity: r.capacity,
      seatsBooked: r.seats_booked,
      seatsRemaining: remaining,
      status: r.status,
      availability,
    };
  });
}

export async function createAdminTourDate(input: {
  tourId: string;
  tourDate: string;
  capacity: number;
}): Promise<{ success?: boolean; error?: string }> {
  await requireAdmin();
  const db = supabaseAdmin();

  if (!input.tourId || !input.tourDate || input.capacity < 1) {
    return { error: "Please provide valid tour, date, and positive capacity." };
  }

  const { error } = await db.from("tour_dates").insert({
    tour_id: input.tourId,
    tour_date: input.tourDate,
    capacity: input.capacity,
    seats_booked: 0,
    status: "open",
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "A departure date for this tour already exists on that day." };
    }
    return { error: error.message };
  }

  return { success: true };
}

export async function updateAdminTourDateCapacity(
  id: string,
  capacity: number,
): Promise<{ success?: boolean; error?: string }> {
  await requireAdmin();
  const db = supabaseAdmin();

  if (capacity < 1) return { error: "Capacity must be at least 1." };

  const { data: current } = await db
    .from("tour_dates")
    .select("seats_booked")
    .eq("id", id)
    .single();

  if (current && capacity < current.seats_booked) {
    return {
      error: `Cannot reduce capacity below currently booked seats (${current.seats_booked}).`,
    };
  }

  const { error } = await db.from("tour_dates").update({ capacity }).eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function toggleAdminTourDateStatus(
  id: string,
  status: "open" | "closed",
): Promise<{ success?: boolean; error?: string }> {
  await requireAdmin();
  const db = supabaseAdmin();

  const { error } = await db.from("tour_dates").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteAdminTourDate(
  id: string,
): Promise<{ success?: boolean; error?: string }> {
  await requireAdmin();
  const db = supabaseAdmin();

  const { data: dateRow } = await db
    .from("tour_dates")
    .select("seats_booked")
    .eq("id", id)
    .single();

  if (dateRow && dateRow.seats_booked > 0) {
    return {
      error: `Cannot delete departure with ${dateRow.seats_booked} booked seat(s). Close the date instead.`,
    };
  }

  const { error } = await db.from("tour_dates").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

// =============================================================================
// ATTRACTION MANAGEMENT (Part 19)
// =============================================================================

export type AdminAttractionItem = {
  id: string;
  destinationId: string;
  destinationName: string;
  slug: string;
  name: string;
  description: string;
  image: string | null;
  location: string | null;
  status: "draft" | "published" | "archived";
  sortOrder: number;
  createdAt: string;
  relatedTours: { id: string; name: string; slug: string }[];
};

export async function getAdminAttractionsList(destinationId?: string): Promise<AdminAttractionItem[]> {
  await requireAdmin();
  const db = supabaseAdmin();

  let query = db
    .from("attractions")
    .select(`
      id, destination_id, slug, name, description, image, location, status, sort_order, created_at,
      destinations(id, name),
      tour_attractions(
        tours(id, name, slug)
      )
    `)
    .order("name");

  if (destinationId) {
    query = query.eq("destination_id", destinationId);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return (data as unknown as {
    id: string;
    destination_id: string;
    slug: string;
    name: string;
    description: string;
    image: string | null;
    location: string | null;
    status: "draft" | "published" | "archived";
    sort_order: number;
    created_at: string;
    destinations: { id: string; name: string } | null;
    tour_attractions: { tours: { id: string; name: string; slug: string } | null }[] | null;
  }[]).map((a) => ({
    id: a.id,
    destinationId: a.destination_id,
    destinationName: a.destinations?.name ?? "Unknown",
    slug: a.slug,
    name: a.name,
    description: a.description,
    image: a.image,
    location: a.location,
    status: a.status,
    sortOrder: a.sort_order,
    createdAt: a.created_at,
    relatedTours: (a.tour_attractions ?? [])
      .map((ta) => ta.tours)
      .filter((t): t is { id: string; name: string; slug: string } => Boolean(t)),
  }));
}

export async function getAdminAttractionById(id: string): Promise<AdminAttractionItem | null> {
  await requireAdmin();
  const db = supabaseAdmin();

  const { data, error } = await db
    .from("attractions")
    .select(`
      id, destination_id, slug, name, description, image, location, status, sort_order, created_at,
      destinations(id, name),
      tour_attractions(
        tours(id, name, slug)
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const a = data as unknown as {
    id: string;
    destination_id: string;
    slug: string;
    name: string;
    description: string;
    image: string | null;
    location: string | null;
    status: "draft" | "published" | "archived";
    sort_order: number;
    created_at: string;
    destinations: { id: string; name: string } | null;
    tour_attractions: { tours: { id: string; name: string; slug: string } | null }[] | null;
  };

  return {
    id: a.id,
    destinationId: a.destination_id,
    destinationName: a.destinations?.name ?? "Unknown",
    slug: a.slug,
    name: a.name,
    description: a.description,
    image: a.image,
    location: a.location,
    status: a.status,
    sortOrder: a.sort_order,
    createdAt: a.created_at,
    relatedTours: (a.tour_attractions ?? [])
      .map((ta) => ta.tours)
      .filter((t): t is { id: string; name: string; slug: string } => Boolean(t)),
  };
}

export async function createAdminAttraction(input: {
  destinationId: string;
  slug: string;
  name: string;
  description: string;
  image?: string | null;
  location?: string | null;
  status?: string;
  sortOrder?: number;
}): Promise<{ id?: string; error?: string }> {
  await requireAdmin();
  const db = supabaseAdmin();

  const { data, error } = await db
    .from("attractions")
    .insert({
      destination_id: input.destinationId,
      slug: input.slug,
      name: input.name,
      description: input.description,
      image: input.image ?? null,
      location: input.location ?? null,
      status: input.status ?? "published",
      sort_order: input.sortOrder ?? 0,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { error: "An attraction with this slug already exists for this destination." };
    return { error: error.message };
  }

  return { id: data.id };
}

export async function updateAdminAttraction(
  id: string,
  input: {
    destinationId: string;
    slug: string;
    name: string;
    description: string;
    image?: string | null;
    location?: string | null;
    status?: string;
    sortOrder?: number;
  },
): Promise<{ success?: boolean; error?: string }> {
  await requireAdmin();
  const db = supabaseAdmin();

  const { error } = await db
    .from("attractions")
    .update({
      destination_id: input.destinationId,
      slug: input.slug,
      name: input.name,
      description: input.description,
      image: input.image ?? null,
      location: input.location ?? null,
      status: input.status ?? "published",
      sort_order: input.sortOrder ?? 0,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { error: "An attraction with this slug already exists for this destination." };
    return { error: error.message };
  }

  return { success: true };
}

export async function deleteAdminAttraction(id: string): Promise<{ success?: boolean; error?: string }> {
  await requireAdmin();
  const db = supabaseAdmin();

  const { error } = await db.from("attractions").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

// =============================================================================
// PAYMENTS MANAGEMENT (Part 23)
// =============================================================================

export type AdminPaymentItem = {
  id: string;
  bookingId: string;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  amountZar: number;
  provider: string;
  transactionId: string | null;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
  paidAt: string | null;
};

export async function getAdminPayments(filters?: {
  status?: string;
  search?: string;
}): Promise<AdminPaymentItem[]> {
  await requireAdmin();
  const db = supabaseAdmin();

  let query = db
    .from("payments")
    .select(`
      id, booking_id, amount_zar, provider, transaction_id, payment_status, created_at, paid_at,
      bookings (
        reference, contact_first_name, contact_last_name, contact_email
      )
    `)
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("payment_status", filters.status);
  }

  const { data, error } = await query.limit(200);
  if (error || !data) return [];

  let payments = (data as unknown as {
    id: string;
    booking_id: string;
    amount_zar: number;
    provider: string;
    transaction_id: string | null;
    payment_status: "pending" | "paid" | "failed" | "refunded";
    created_at: string;
    paid_at: string | null;
    bookings: {
      reference: string;
      contact_first_name: string;
      contact_last_name: string;
      contact_email: string;
    } | null;
  }[]).map((p) => ({
    id: p.id,
    bookingId: p.booking_id,
    bookingReference: p.bookings?.reference ?? "Unknown",
    customerName: p.bookings
      ? `${p.bookings.contact_first_name} ${p.bookings.contact_last_name}`
      : "Unknown",
    customerEmail: p.bookings?.contact_email ?? "",
    amountZar: p.amount_zar,
    provider: p.provider,
    transactionId: p.transaction_id,
    paymentStatus: p.payment_status,
    createdAt: p.created_at,
    paidAt: p.paid_at,
  }));

  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    payments = payments.filter(
      (p) =>
        p.bookingReference.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.customerEmail.toLowerCase().includes(q) ||
        (p.transactionId && p.transactionId.toLowerCase().includes(q)),
    );
  }

  return payments;
}

export async function updateAdminPaymentStatus(
  paymentId: string,
  status: "pending" | "paid" | "failed" | "refunded",
  transactionId?: string,
): Promise<{ success?: boolean; error?: string }> {
  await requireAdmin();
  const db = supabaseAdmin();

  const updates: Record<string, unknown> = { payment_status: status };
  if (status === "paid") {
    updates.paid_at = new Date().toISOString();
  }
  if (transactionId !== undefined) {
    updates.transaction_id = transactionId;
  }

  const { error } = await db.from("payments").update(updates).eq("id", paymentId);
  if (error) return { error: error.message };
  return { success: true };
}

// =============================================================================
// REVIEWS MANAGEMENT (Part 24)
// =============================================================================

export type AdminReviewItem = {
  id: string;
  userId: string | null;
  tourId: string;
  tourName: string;
  tourSlug: string;
  bookingId: string | null;
  bookingReference: string | null;
  authorName: string;
  rating: number;
  title: string | null;
  comment: string;
  status: "pending" | "approved" | "hidden";
  createdAt: string;
};

export async function getAdminReviews(statusFilter?: string): Promise<AdminReviewItem[]> {
  await requireAdmin();
  const db = supabaseAdmin();

  let query = db
    .from("reviews")
    .select(`
      id, user_id, tour_id, booking_id, author_name, rating, title, comment, status, created_at,
      tours(name, slug),
      bookings(reference)
    `)
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query.limit(200);
  if (error || !data) return [];

  return (data as unknown as {
    id: string;
    user_id: string | null;
    tour_id: string;
    booking_id: string | null;
    author_name: string;
    rating: number;
    title: string | null;
    comment: string;
    status: "pending" | "approved" | "hidden";
    created_at: string;
    tours: { name: string; slug: string } | null;
    bookings: { reference: string } | null;
  }[]).map((r) => ({
    id: r.id,
    userId: r.user_id,
    tourId: r.tour_id,
    tourName: r.tours?.name ?? "Unknown Tour",
    tourSlug: r.tours?.slug ?? "",
    bookingId: r.booking_id,
    bookingReference: r.bookings?.reference ?? null,
    authorName: r.author_name,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    status: r.status,
    createdAt: r.created_at,
  }));
}

export async function updateAdminReviewStatus(
  reviewId: string,
  status: "pending" | "approved" | "hidden",
): Promise<{ success?: boolean; error?: string }> {
  await requireAdmin();
  const db = supabaseAdmin();

  const { error } = await db.from("reviews").update({ status }).eq("id", reviewId);
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteAdminReview(
  reviewId: string,
): Promise<{ success?: boolean; error?: string }> {
  await requireAdmin();
  const db = supabaseAdmin();

  const { error } = await db.from("reviews").delete().eq("id", reviewId);
  if (error) return { error: error.message };
  return { success: true };
}

// =============================================================================
// REPORTS & ANALYTICS (Part 25)
// =============================================================================

export type AdminReportData = {
  totalBookings: number;
  totalRevenueZar: number;
  paidRevenueZar: number;
  averageBookingValueZar: number;
  bookingsByStatus: { status: string; count: number }[];
  paymentsByStatus: { status: string; count: number; totalZar: number }[];
  popularTours: { tourName: string; bookingCount: number; revenueZar: number }[];
  popularDestinations: { destinationName: string; bookingCount: number }[];
  monthlyBookings: { month: string; bookings: number; revenueZar: number }[];
};

export async function getAdminReports(): Promise<AdminReportData> {
  await requireAdmin();
  const db = supabaseAdmin();

  const [{ data: bookingsData }, { data: paymentsData }] = await Promise.all([
    db.from("bookings").select(`
      id, total_amount_zar, booking_status, created_at,
      tours ( name, destinations ( name ) )
    `),
    db.from("payments").select("amount_zar, payment_status"),
  ]);

  type RawBooking = {
    id: string;
    total_amount_zar: number;
    booking_status: string;
    created_at: string;
    tours: { name: string; destinations: { name: string } | null } | null;
  };

  const bookings = (bookingsData ?? []) as unknown as RawBooking[];
  const payments = (paymentsData ?? []) as { amount_zar: number; payment_status: string }[];

  const totalBookings = bookings.length;
  const nonCancelled = bookings.filter((b) => b.booking_status !== "cancelled");
  const totalRevenueZar = nonCancelled.reduce((sum, b) => sum + b.total_amount_zar, 0);
  const paidRevenueZar = payments
    .filter((p) => p.payment_status === "paid")
    .reduce((sum, p) => sum + p.amount_zar, 0);
  const averageBookingValueZar =
    nonCancelled.length > 0 ? Math.round(totalRevenueZar / nonCancelled.length) : 0;

  // Bookings by status
  const statusMap = new Map<string, number>();
  for (const b of bookings) {
    statusMap.set(b.booking_status, (statusMap.get(b.booking_status) ?? 0) + 1);
  }
  const bookingsByStatus = [...statusMap.entries()].map(([status, count]) => ({
    status,
    count,
  }));

  // Payments by status
  const paymentMap = new Map<string, { count: number; totalZar: number }>();
  for (const p of payments) {
    const cur = paymentMap.get(p.payment_status) ?? { count: 0, totalZar: 0 };
    cur.count += 1;
    cur.totalZar += p.amount_zar;
    paymentMap.set(p.payment_status, cur);
  }
  const paymentsByStatus = [...paymentMap.entries()].map(([status, val]) => ({
    status,
    count: val.count,
    totalZar: val.totalZar,
  }));

  // Popular Tours
  const tourMap = new Map<string, { count: number; revenueZar: number }>();
  for (const b of nonCancelled) {
    const name = b.tours?.name ?? "Custom / Unspecified";
    const cur = tourMap.get(name) ?? { count: 0, revenueZar: 0 };
    cur.count += 1;
    cur.revenueZar += b.total_amount_zar;
    tourMap.set(name, cur);
  }
  const popularTours = [...tourMap.entries()]
    .map(([tourName, val]) => ({
      tourName,
      bookingCount: val.count,
      revenueZar: val.revenueZar,
    }))
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, 10);

  // Popular Destinations
  const destMap = new Map<string, number>();
  for (const b of nonCancelled) {
    const dest = b.tours?.destinations?.name ?? "Other";
    destMap.set(dest, (destMap.get(dest) ?? 0) + 1);
  }
  const popularDestinations = [...destMap.entries()]
    .map(([destinationName, bookingCount]) => ({ destinationName, bookingCount }))
    .sort((a, b) => b.bookingCount - a.bookingCount);

  // Monthly trends (group by YYYY-MM)
  const monthMap = new Map<string, { bookings: number; revenueZar: number }>();
  for (const b of bookings) {
    const m = b.created_at.slice(0, 7); // YYYY-MM
    const cur = monthMap.get(m) ?? { bookings: 0, revenueZar: 0 };
    cur.bookings += 1;
    if (b.booking_status !== "cancelled") cur.revenueZar += b.total_amount_zar;
    monthMap.set(m, cur);
  }
  const monthlyBookings = [...monthMap.entries()]
    .map(([month, val]) => ({ month, bookings: val.bookings, revenueZar: val.revenueZar }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    totalBookings,
    totalRevenueZar,
    paidRevenueZar,
    averageBookingValueZar,
    bookingsByStatus,
    paymentsByStatus,
    popularTours,
    popularDestinations,
    monthlyBookings,
  };
}


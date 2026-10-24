import "server-only";
import type { Booking } from "@/lib/types";
import { supabaseServer } from "@/lib/supabase/server";

/**
 * Booking reads for the customer area.
 *
 * There is no `where user_id = me` clause anywhere in this file, and that is
 * deliberate — the row-level security policy on `bookings` already restricts
 * every query to the signed-in user's own rows. Adding an app-level filter
 * would imply the database was not trusted to do it, and would quietly break
 * the admin views that share these helpers.
 */

const SELECT = `
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
  id: string;
  reference: string;
  user_id: string;
  tour_id: string;
  tour_date_id: string;
  adults: number;
  children: number;
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_phone: string;
  contact_country: string | null;
  pickup_location: string | null;
  special_requirements: string | null;
  unit_price_adult_zar: number;
  unit_price_child_zar: number;
  total_amount_zar: number;
  booking_status: Booking["bookingStatus"];
  created_at: string;
  tours: {
    name: string;
    slug: string;
    destinations: { name: string; slug: string } | null;
  } | null;
  tour_dates: { tour_date: string } | null;
  payments: { payment_status: Booking["paymentStatus"] }[] | null;
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
    // A booking has at most one payment row in Phase 1; deposits and balances
    // will make this an array worth summing.
    paymentStatus: row.payments?.[0]?.payment_status ?? "pending",
  };
}

export async function getMyBookings(): Promise<Booking[]> {
  try {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("bookings")
      .select(SELECT)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as unknown as Row[]).map(toBooking);
  } catch {
    return [];
  }
}

export async function getBookingByReference(
  reference: string,
): Promise<Booking | null> {
  try {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("bookings")
      .select(SELECT)
      .eq("reference", reference)
      .maybeSingle();
    if (error) throw error;
    return data ? toBooking(data as unknown as Row) : null;
  } catch {
    return null;
  }
}

/** Split for the "upcoming" and "past" sections of My Bookings. */
export function splitBookings(bookings: Booking[]) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming: Booking[] = [];
  const past: Booking[] = [];
  for (const b of bookings) {
    const isPast =
      (b.tourDate ?? "") < today ||
      b.bookingStatus === "completed" ||
      b.bookingStatus === "cancelled";
    (isPast ? past : upcoming).push(b);
  }
  return { upcoming, past };
}

"use server";

import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";

/**
 * Server Action that creates a booking.
 *
 * This is a thin wrapper. Every decision that matters — is the departure
 * open, are there enough seats, what does it cost — happens inside the
 * `create_booking()` Postgres function, under a row lock, in one
 * transaction. Deliberately so: capacity checks written in application code
 * are racy by construction, because two requests can both read "3 seats
 * left" before either writes.
 *
 * Note what this action does NOT accept: a price. The total is computed in
 * the database from the tours table. A tampered payload cannot buy a
 * R28 500 tour for R1.
 */

const bookingSchema = z.object({
  tourDateId: z.uuid("Choose a departure date"),
  adults: z.coerce.number().int().min(1, "At least one adult").max(50),
  children: z.coerce.number().int().min(0).max(50),
  firstName: z.string().trim().min(2, "Enter a first name").max(80),
  lastName: z.string().trim().min(2, "Enter a last name").max(80),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a contact number")
    .refine(
      (v) => /^\+?[0-9]{7,18}$/.test(v.replace(/[\s()\-.]/g, "")),
      "Enter a valid phone number, including the country code",
    ),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  pickupLocation: z.string().trim().max(200).optional().or(z.literal("")),
  specialRequirements: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type BookingResult =
  | { ok: true; reference: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/**
 * Turn the database's machine-readable error codes into something a
 * traveller can act on. The codes are stable; the prose is not, which is
 * why the function raises `NO_SEATS:3` rather than a sentence.
 */
function friendlyError(message: string): string {
  if (message.includes("AUTH_REQUIRED"))
    return "Please sign in again — your session has expired.";
  if (message.includes("DATE_CLOSED"))
    return "That departure has just been closed for booking. Please choose another date.";
  if (message.includes("DATE_PAST"))
    return "That departure date has already passed.";
  if (message.includes("DATE_NOT_FOUND"))
    return "That departure no longer exists. Please choose another date.";
  if (message.includes("TOUR_UNAVAILABLE"))
    return "This tour is not currently on sale.";
  if (message.includes("INVALID_PARTY"))
    return "Check the number of travellers — at least one adult is required.";
  if (message.includes("PROFILE_MISSING"))
    return "Your profile is incomplete. Please sign out and in again.";

  const seats = message.match(/NO_SEATS:(\d+)/);
  if (seats) {
    const left = Number(seats[1]);
    return left === 0
      ? "This departure sold out while you were booking. Please choose another date."
      : `Only ${left} seat${left === 1 ? " is" : "s are"} available for this date.`;
  }

  return "We could not complete the booking. Please try again, or call us.";
}

export async function createBooking(
  _prev: BookingResult | null,
  formData: FormData,
): Promise<BookingResult> {
  const user = await getUser();
  if (!user) {
    return { ok: false, error: "Please sign in to complete your booking." };
  }

  const parsed = bookingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error).fieldErrors as Record<
      string,
      string[] | undefined
    >;
    const fieldErrors: Record<string, string> = {};
    for (const [k, v] of Object.entries(flat)) if (v?.length) fieldErrors[k] = v[0];
    return { ok: false, error: "Some details need checking.", fieldErrors };
  }

  const input = parsed.data;

  try {
    const supabase = await supabaseServer();
    const { data, error } = await supabase.rpc("create_booking", {
      p_tour_date_id: input.tourDateId,
      p_adults: input.adults,
      p_children: input.children,
      p_contact_first_name: input.firstName,
      p_contact_last_name: input.lastName,
      p_contact_email: input.email,
      p_contact_phone: input.phone,
      p_contact_country: input.country || null,
      p_pickup_location: input.pickupLocation || null,
      p_special_requirements: input.specialRequirements || null,
    });

    if (error) return { ok: false, error: friendlyError(error.message) };

    const booking = Array.isArray(data) ? data[0] : data;
    if (!booking?.reference) {
      return { ok: false, error: "Booking did not complete. Please try again." };
    }

    return { ok: true, reference: booking.reference as string };
  } catch {
    return {
      ok: false,
      error: "We could not reach the booking system. Check your connection and try again.",
    };
  }
}

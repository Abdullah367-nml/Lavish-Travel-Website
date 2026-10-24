"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

/**
 * Admin booking mutations.
 *
 * Both actions call `requireAdmin()` first. A Server Action is a public HTTP
 * endpoint — being reachable only from an admin page in the UI protects
 * nothing, because anyone can invoke it directly once they know it exists.
 */

const statusSchema = z.object({
  bookingId: z.uuid(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed", "no_show"]),
});

const paymentSchema = z.object({
  bookingId: z.uuid(),
  status: z.enum(["pending", "paid", "failed", "refunded"]),
});

export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Booking status goes through the `admin_set_booking_status()` function
 * rather than a direct UPDATE, because cancelling has to release seats and
 * reinstating has to re-take them — under a row lock, and refusing if the
 * seats have since been sold. Doing that in application code would duplicate
 * the one calculation that must never drift.
 */
export async function setBookingStatus(
  bookingId: string,
  status: string,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = statusSchema.safeParse({ bookingId, status });
  if (!parsed.success) return { ok: false, error: "Invalid status change." };

  const { error } = await supabaseAdmin().rpc("admin_set_booking_status", {
    p_booking_id: parsed.data.bookingId,
    p_status: parsed.data.status,
  });

  if (error) {
    if (error.message.includes("NO_SEATS")) {
      return {
        ok: false,
        error:
          "Cannot reinstate this booking — the seats have been sold to someone else since it was cancelled.",
      };
    }
    if (error.message.includes("BOOKING_NOT_FOUND")) {
      return { ok: false, error: "That booking no longer exists." };
    }
    console.error("[admin] status change failed:", error.message);
    return { ok: false, error: "Could not change the status. Please try again." };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  return { ok: true };
}

/**
 * Payment status is a plain UPDATE — it moves no seats.
 *
 * This exists so a consultant can mark a manual EFT as received. When a real
 * gateway is wired in, its webhook writes the same column and this becomes
 * the manual fallback rather than the main path.
 */
export async function setPaymentStatus(
  bookingId: string,
  status: string,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = paymentSchema.safeParse({ bookingId, status });
  if (!parsed.success) return { ok: false, error: "Invalid payment status." };

  const db = supabaseAdmin();
  const { error } = await db
    .from("payments")
    .update({
      payment_status: parsed.data.status,
      paid_at: parsed.data.status === "paid" ? new Date().toISOString() : null,
    })
    .eq("booking_id", parsed.data.bookingId);

  if (error) {
    console.error("[admin] payment update failed:", error.message);
    return { ok: false, error: "Could not update the payment." };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  return { ok: true };
}

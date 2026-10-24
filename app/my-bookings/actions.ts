"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

export async function cancelMyBooking(bookingId: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await supabaseServer();
    const { error } = await supabase.rpc("cancel_booking", {
      p_booking_id: bookingId,
    });

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/my-bookings");
    revalidatePath("/admin/bookings");
    revalidatePath("/admin/tour-dates");
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to cancel booking",
    };
  }
}

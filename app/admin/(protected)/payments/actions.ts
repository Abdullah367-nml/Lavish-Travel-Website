"use server";

import { revalidatePath } from "next/cache";
import { updateAdminPaymentStatus } from "@/lib/admin";

export async function updatePaymentStatusAction(
  paymentId: string,
  status: "pending" | "paid" | "failed" | "refunded",
  transactionId?: string,
) {
  const res = await updateAdminPaymentStatus(paymentId, status, transactionId);
  if (res.error) return { error: res.error };

  revalidatePath("/admin/payments");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  return { success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { updateAdminReviewStatus, deleteAdminReview } from "@/lib/admin";

export async function updateReviewStatusAction(
  reviewId: string,
  status: "pending" | "approved" | "hidden",
) {
  const res = await updateAdminReviewStatus(reviewId, status);
  if (res.error) return { error: res.error };

  revalidatePath("/admin/reviews");
  revalidatePath("/tours");
  return { success: true };
}

export async function deleteReviewAction(reviewId: string) {
  const res = await deleteAdminReview(reviewId);
  if (res.error) return { error: res.error };

  revalidatePath("/admin/reviews");
  revalidatePath("/tours");
  return { success: true };
}

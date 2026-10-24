"use server";

import { revalidatePath } from "next/cache";
import {
  createAdminTourDate,
  updateAdminTourDateCapacity,
  toggleAdminTourDateStatus,
  deleteAdminTourDate,
} from "@/lib/admin";

export async function addTourDateAction(formData: FormData) {
  const tourId = String(formData.get("tourId") || "");
  const tourDate = String(formData.get("tourDate") || "");
  const capacity = Number(formData.get("capacity") || 20);

  const res = await createAdminTourDate({ tourId, tourDate, capacity });
  if (res.error) return { error: res.error };

  revalidatePath("/admin/tour-dates");
  revalidatePath("/tours");
  return { success: true };
}

export async function updateCapacityAction(id: string, capacity: number) {
  const res = await updateAdminTourDateCapacity(id, capacity);
  if (res.error) return { error: res.error };

  revalidatePath("/admin/tour-dates");
  revalidatePath("/tours");
  return { success: true };
}

export async function toggleStatusAction(id: string, status: "open" | "closed") {
  const res = await toggleAdminTourDateStatus(id, status);
  if (res.error) return { error: res.error };

  revalidatePath("/admin/tour-dates");
  revalidatePath("/tours");
  return { success: true };
}

export async function deleteTourDateAction(id: string) {
  const res = await deleteAdminTourDate(id);
  if (res.error) return { error: res.error };

  revalidatePath("/admin/tour-dates");
  revalidatePath("/tours");
  return { success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAdminAttraction,
  updateAdminAttraction,
  deleteAdminAttraction,
} from "@/lib/admin";

export async function saveAttractionAction(formData: FormData) {
  const id = formData.get("id") ? String(formData.get("id")) : undefined;
  const destinationId = String(formData.get("destinationId") || "");
  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const image = String(formData.get("image") || "").trim() || null;
  const location = String(formData.get("location") || "").trim() || null;
  const status = String(formData.get("status") || "published");
  const sortOrder = Number(formData.get("sortOrder") || 0);

  if (!destinationId || !name || !slug || !description) {
    return { error: "Please fill in Destination, Name, Slug, and Description." };
  }

  if (id) {
    const res = await updateAdminAttraction(id, {
      destinationId,
      name,
      slug,
      description,
      image,
      location,
      status,
      sortOrder,
    });
    if (res.error) return { error: res.error };
  } else {
    const res = await createAdminAttraction({
      destinationId,
      name,
      slug,
      description,
      image,
      location,
      status,
      sortOrder,
    });
    if (res.error) return { error: res.error };
  }

  revalidatePath("/admin/attractions");
  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  redirect("/admin/attractions");
}

export async function deleteAttractionAction(id: string) {
  const res = await deleteAdminAttraction(id);
  if (res.error) return { error: res.error };

  revalidatePath("/admin/attractions");
  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  return { success: true };
}

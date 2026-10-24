// =============================================================================
// SAVE AS (replacing the existing file):
// app/admin/(protected)/destinations/actions.ts
//
// This is your existing setDestinationStatus function, unchanged, with the
// new saveDestinationAction (create/edit) appended after it. Nothing from
// the original file was removed.
// =============================================================================
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import {
  createAdminDestination,
  updateAdminDestination,
  type DestinationWriteInput,
} from "@/lib/admin";

/**
 * Publish / unpublish a destination, and optionally its attractions.
 *
 * Publishing a destination WITHOUT its attractions gives a page with an
 * empty "what to see" section, so the default is to bring them along. The
 * reverse — unpublishing — deliberately leaves attractions alone, because
 * hiding a city page should not silently discard the review status of
 * everything inside it.
 */
const schema = z.object({
  id: z.uuid(),
  status: z.enum(["draft", "published", "archived"]),
  includeAttractions: z.boolean(),
});

export type Result = { ok: true; message: string } | { ok: false; error: string };

export async function setDestinationStatus(
  id: string,
  status: string,
  includeAttractions = true,
): Promise<Result> {
  await requireAdmin();

  const parsed = schema.safeParse({ id, status, includeAttractions });
  if (!parsed.success) return { ok: false, error: "Invalid request." };

  const db = supabaseAdmin();

  const { error } = await db
    .from("destinations")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("[admin] destination status failed:", error.message);
    return { ok: false, error: "Could not change the status." };
  }

  let attractionNote = "";
  if (parsed.data.status === "published" && parsed.data.includeAttractions) {
    const { count, error: aError } = await db
      .from("attractions")
      .update({ status: "published" }, { count: "exact" })
      .eq("destination_id", parsed.data.id)
      .eq("status", "draft");
    if (aError) {
      console.error("[admin] attraction publish failed:", aError.message);
    } else if (count) {
      attractionNote = ` and ${count} attraction${count === 1 ? "" : "s"}`;
    }
  }

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  return {
    ok: true,
    message:
      parsed.data.status === "published"
        ? `Published${attractionNote}. Live within a minute.`
        : "Hidden from the public site.",
  };
}

// =============================================================================
// NEW: create / edit form action
// =============================================================================

const destinationSchema = z.object({
  slug: z
    .string()
    .min(1, "Required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  name: z.string().min(1, "Required"),
  province: z.string().optional(),
  country: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  body: z.string().optional(),
  image: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  bestMonths: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  sortOrder: z.coerce.number().int().min(0),
  parentId: z.string().optional(),
  region: z.string().optional(),
  areaType: z.enum(["destination", "area", "town", "wine_area", "coastal_town", "nature"]),
  suggestedTime: z.string().optional(),
  bestFor: z.string().optional(),
});

function linesToArray(value: string | undefined): string[] {
  return (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toNullableNumber(value: string | undefined): number | null {
  if (!value || value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export type DestinationFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function saveDestinationAction(
  destinationId: string | null,
  _prevState: DestinationFormState,
  formData: FormData,
): Promise<DestinationFormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = destinationSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  const input: DestinationWriteInput = {
    slug: parsed.data.slug,
    name: parsed.data.name,
    province: parsed.data.province || null,
    country: parsed.data.country,
    description: parsed.data.description,
    body: linesToArray(parsed.data.body),
    image: parsed.data.image || null,
    lat: toNullableNumber(parsed.data.lat),
    lng: toNullableNumber(parsed.data.lng),
    bestMonths: parsed.data.bestMonths || null,
    seoTitle: parsed.data.seoTitle || null,
    seoDescription: parsed.data.seoDescription || null,
    status: parsed.data.status,
    sortOrder: parsed.data.sortOrder,
    parentId: parsed.data.parentId || null,
    region: parsed.data.region || null,
    areaType: parsed.data.areaType,
    suggestedTime: parsed.data.suggestedTime || null,
    bestFor: linesToArray(parsed.data.bestFor),
  };

  const result = destinationId
    ? await updateAdminDestination(destinationId, input)
    : await createAdminDestination(input);

  if ("error" in result) {
    return { error: result.error };
  }

  revalidatePath("/destinations", "layout");
  revalidatePath("/tours", "layout");
  revalidatePath("/admin/destinations");
  redirect("/admin/destinations");
}
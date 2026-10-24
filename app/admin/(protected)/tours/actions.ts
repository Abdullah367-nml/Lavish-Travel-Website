// =============================================================================
// REPLACE THE WHOLE FILE: app/admin/tours/actions.ts
//
// What changed: the itinerary/FAQ parsing now reports exactly which row and
// field is incomplete, instead of one generic message for both. This is a
// backstop only — the form itself (tour-form.tsx) now catches this before
// the browser ever submits, so most people will never see this path at all.
// =============================================================================
"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminTour, updateAdminTour, type TourWriteInput } from "@/lib/admin";

const itineraryDaySchema = z.object({
  day: z.coerce.number().int().min(1),
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
});

const faqSchema = z.object({
  question: z.string().min(1, "Required"),
  answer: z.string().min(1, "Required"),
});

const tourSchema = z.object({
  slug: z
    .string()
    .min(1, "Required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  destinationId: z.string().uuid("Choose a destination"),
  name: z.string().min(1, "Required"),
  summary: z.string().min(1, "Required"),
  description: z.string().optional(),
  durationDays: z.coerce.number().int().min(1).max(60, "60 days maximum"),
  priceAdultZar: z.coerce.number().int().min(0, "Cannot be negative"),
  priceChildZar: z.coerce.number().int().min(0, "Cannot be negative"),
  capacity: z.coerce.number().int().min(1).max(500, "500 maximum"),
  difficulty: z.enum(["easy", "moderate", "challenging"]),
  category: z.enum([
    "day_tour",
    "multi_day",
    "safari",
    "wine",
    "cultural",
    "adventure",
    "cross_border",
  ]),
  status: z.enum(["draft", "published", "archived"]),
  isFeatured: z.coerce.boolean().optional(),
  pickupInfo: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  images: z.string().optional(),
  inclusions: z.string().optional(),
  exclusions: z.string().optional(),
  whatToPack: z.string().optional(),
  itinerary: z.string(),
  faqs: z.string(),
  attractionIds: z.string().optional(),
});

function linesToArray(value: string | undefined): string[] {
  return (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Turns a ZodError from parsing the itinerary/FAQ JSON into a message that
 * names the specific row and field, e.g. "Row 2 is missing its description."
 * Falls back to a generic message if the error shape is unexpected.
 */
function describeListError(err: unknown, label: string): string {
  if (err instanceof z.ZodError && err.issues.length > 0) {
    const issue = err.issues[0];
    const rowIndex = typeof issue.path[0] === "number" ? issue.path[0] + 1 : null;
    const field = issue.path[1];
    if (rowIndex && field) {
      return `${label} ${rowIndex} is missing its ${String(field)}.`;
    }
  }
  return `There's a problem with the ${label.toLowerCase()} list.`;
}

export type TourFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

/**
 * Bound with the tour id (or null for create) via .bind() in tour-form.tsx,
 * so the signature useActionState expects — (prevState, formData) — is
 * preserved while still knowing which record to write to.
 */
export async function saveTourAction(
  tourId: string | null,
  _prevState: TourFormState,
  formData: FormData,
): Promise<TourFormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = tourSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  let itinerary: { day: number; title: string; description: string }[] = [];
  try {
    itinerary = z.array(itineraryDaySchema).parse(JSON.parse(parsed.data.itinerary));
  } catch (err) {
    return {
      error: `${describeListError(err, "Itinerary day")} Fill it in, or remove that row and try again.`,
    };
  }

  let faqs: { question: string; answer: string }[] = [];
  try {
    faqs = z.array(faqSchema).parse(JSON.parse(parsed.data.faqs || "[]"));
  } catch (err) {
    return {
      error: `${describeListError(err, "FAQ")} Fill it in, or remove that row and try again.`,
    };
  }

  const input: TourWriteInput = {
    slug: parsed.data.slug,
    destinationId: parsed.data.destinationId,
    name: parsed.data.name,
    summary: parsed.data.summary,
    description: parsed.data.description || null,
    durationDays: parsed.data.durationDays,
    priceAdultZar: parsed.data.priceAdultZar,
    priceChildZar: parsed.data.priceChildZar,
    capacity: parsed.data.capacity,
    images: linesToArray(parsed.data.images),
    itinerary,
    inclusions: linesToArray(parsed.data.inclusions),
    exclusions: linesToArray(parsed.data.exclusions),
    whatToPack: linesToArray(parsed.data.whatToPack),
    faqs,
    pickupInfo: parsed.data.pickupInfo || null,
    difficulty: parsed.data.difficulty,
    category: parsed.data.category,
    isFeatured: Boolean(parsed.data.isFeatured),
    status: parsed.data.status,
    seoTitle: parsed.data.seoTitle || null,
    seoDescription: parsed.data.seoDescription || null,
    attractionIds: (parsed.data.attractionIds ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };

  const result = tourId ? await updateAdminTour(tourId, input) : await createAdminTour(input);

  if ("error" in result) {
    return { error: result.error };
  }

  revalidatePath("/tours", "layout");
  revalidatePath("/admin/tours");
  redirect("/admin/tours");
}
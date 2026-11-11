import { NextResponse } from "next/server";
import { z } from "zod";
import {
  isSupabaseConfigured,
  supabaseAdmin,
  supabasePublic,
} from "@/lib/supabase/server";
import { reviews as staticReviews } from "@/lib/data/reviews";
import type { Review, TravellerType } from "@/lib/types";

const createReviewSchema = z.object({
  authorName: z.string().trim().min(1, "Please enter your name").max(80),
  authorCountry: z.string().trim().max(60).optional().default("Verified Guest"),
  serviceOrTour: z.string().trim().max(140).optional().default("Lavish Travels & Tours"),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional().default(""),
  body: z.string().trim().max(1200).optional().default(""),
  travellerType: z
    .enum(["couple", "family", "solo", "business", "group"])
    .optional()
    .default("couple"),
  packageId: z.string().optional().nullable(),
});

type DbReviewRow = {
  id: string;
  tour_id: string;
  author_name: string;
  rating: number;
  title: string | null;
  comment: string;
  status: string;
  created_at: string;
};

function mapDbRowToReview(row: DbReviewRow): Review & { serviceLabel?: string } {
  // author_name can store "Name | Country | travellerType"
  const parts = row.author_name.split(" | ");
  const authorName = parts[0] || row.author_name;
  const authorCountry = parts[1] || "International Guest";
  const travellerType = (parts[2] as TravellerType) || "couple";

  let title = row.title ?? "Verified Experience";
  let serviceLabel: string | undefined;
  const match = title.match(/^\[(.+?)\]\s*(.*)$/);
  if (match) {
    serviceLabel = match[1];
    title = match[2] || match[1];
  }

  return {
    id: row.id,
    authorName,
    authorCountry,
    packageId: row.tour_id,
    vehicleId: null,
    rating: Math.min(5, Math.max(1, row.rating)) as 1 | 2 | 3 | 4 | 5,
    title,
    body: row.comment,
    travellerType,
    isApproved: row.status === "approved",
    createdAt: row.created_at.slice(0, 10),
    serviceLabel,
  };
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ reviews: staticReviews });
  }

  try {
    const { data, error } = await supabasePublic()
      .from("reviews")
      .select("id, tour_id, author_name, rating, title, comment, status, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    const dbReviews = ((data ?? []) as DbReviewRow[]).map(mapDbRowToReview);
    const merged = [...dbReviews, ...staticReviews];
    return NextResponse.json({ reviews: merged });
  } catch {
    return NextResponse.json({ reviews: staticReviews });
  }
}

const REVIEW_WINDOW_MS = 60_000;
const MAX_REVIEWS_PER_WINDOW = 5;
const reviewHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (reviewHits.get(ip) ?? []).filter((t) => now - t < REVIEW_WINDOW_MS);
  recent.push(now);
  reviewHits.set(ip, recent);
  if (reviewHits.size > 2000) {
    for (const [k, times] of reviewHits) {
      if (times.every((t) => now - t >= REVIEW_WINDOW_MS)) reviewHits.delete(k);
    }
  }
  return recent.length > MAX_REVIEWS_PER_WINDOW;
}

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "local";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a minute and try again." },
        { status: 429 },
      );
    }

    const json = await request.json();
    const parsed = createReviewSchema.safeParse(json);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid review details." },
        { status: 400 },
      );
    }

    const {
      authorName,
      authorCountry: rawCountry,
      serviceOrTour: rawService,
      rating,
      title: rawTitle,
      body: rawBody,
      travellerType,
      packageId,
    } = parsed.data;

    const authorCountry = rawCountry || "Verified Guest";
    const serviceOrTour = rawService || "Lavish Travels & Tours";
    const body =
      rawBody ||
      "Highly recommended! Exceptional service and experience with Lavish Travels & Tours.";
    const title =
      rawTitle ||
      (rawBody
        ? rawBody.length > 48
          ? `${rawBody.slice(0, 48).trim()}…`
          : rawBody
        : `${rating}-Star Experience`);

    const newReview: Review & { serviceLabel?: string } = {
      id: crypto.randomUUID(),
      authorName,
      authorCountry,
      packageId: packageId ?? null,
      vehicleId: null,
      rating: rating as 1 | 2 | 3 | 4 | 5,
      title,
      body,
      travellerType,
      isApproved: true,
      createdAt: new Date().toISOString().slice(0, 10),
      serviceLabel: serviceOrTour,
    };

    if (isSupabaseConfigured()) {
      try {
        const admin = supabaseAdmin();
        // Find a valid tour_id in Supabase to satisfy the foreign key constraint
        let targetTourId: string | null = null;
        if (packageId) {
          const { data: exactTour } = await admin
            .from("tours")
            .select("id")
            .eq("id", packageId)
            .maybeSingle();
          if (exactTour) targetTourId = exactTour.id;
        }
        if (!targetTourId) {
          const { data: anyTour } = await admin
            .from("tours")
            .select("id")
            .limit(1)
            .maybeSingle();
          if (anyTour) targetTourId = anyTour.id;
        }

        if (targetTourId) {
          const { data: inserted } = await admin
            .from("reviews")
            .insert({
              tour_id: targetTourId,
              author_name: `${authorName} | ${authorCountry} | ${travellerType}`,
              rating,
              title: `[${serviceOrTour}] ${title}`,
              comment: body,
              status: "approved",
            })
            .select("id, tour_id, author_name, rating, title, comment, status, created_at")
            .maybeSingle();

          if (inserted) {
            return NextResponse.json(
              { review: mapDbRowToReview(inserted as DbReviewRow) },
              { status: 201 },
            );
          }
        }
      } catch (dbErr) {
        console.warn("[reviews] Could not persist to DB, returning optimistic review", dbErr);
      }
    }

    return NextResponse.json({ review: newReview }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit your rating right now. Please try again." },
      { status: 500 },
    );
  }
}

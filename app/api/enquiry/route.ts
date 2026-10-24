// =============================================================================
// REPLACE THE WHOLE FILE: app/api/enquiry/route.ts
//
// What changed: this is "Section 2" from your original file's own comment,
// now implemented. The enquiry is inserted into `enquiries` for real (it
// previously only reached console.log), plus a consent_records audit row
// for both data_processing and marketing — including when marketing
// consent is declined, since that is exactly what POPIA needs proof of.
//
// The reference number is no longer invented in JavaScript. It comes from
// the database's own next_enquiry_reference() function (added via a new
// migration), which uses a real Postgres sequence — guaranteed unique,
// exactly as your original comment said Section 2 should do.
//
// Email (Resend) is still not wired — that remains a separate, later step.
// =============================================================================
import { NextResponse } from "next/server";
import { z } from "zod";
import { enquirySchema } from "@/lib/enquiry-schema";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Enquiry submission endpoint.
 *
 * Order of defence, cheapest check first:
 *   1. content-type — reject anything that is not JSON
 *   2. body size cap — refuse to parse a huge payload at all
 *   3. honeypot — a filled `website` field is a bot; answer 200 so it
 *      cannot tell it was caught, but do nothing
 *   4. rate limit per IP
 *   5. full Zod re-validation — the client already validated, but anything
 *      arriving over HTTP is untrusted
 *
 * Only after all five does this touch the database, using the service-role
 * client — appropriate here because there is no user session to act as (an
 * enquiry needs no account), and because everything above is the gate that
 * makes a privileged, RLS-bypassing write acceptable, the same pattern
 * lib/admin.ts uses after requireAdmin().
 */

const MAX_BODY_BYTES = 16 * 1024;

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const raw = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip");
  // consent_records.ip_address is a real Postgres `inet` column — passing
  // "unknown" (the old fallback) would fail to cast and error the insert.
  // No usable IP just means a null, not a string that looks like one.
  return raw && raw.length > 0 ? raw : null;
}

/**
 * A plausible-looking reference for the honeypot branch only. A bot that
 * trips the honeypot never reaches the database, so it must not consume a
 * real sequence number from next_enquiry_reference() — that would burn real
 * reference numbers on traffic that was never a real enquiry.
 */
function fakeReferenceForHoneypot(): string {
  const year = new Date().getUTCFullYear();
  const n = Math.floor(Math.random() * 90000) + 10000;
  return `LVE-${year}-${n}`;
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { ok: false, error: "Expected application/json" },
      { status: 415 },
    );
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Payload too large" },
      { status: 413 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed JSON" },
      { status: 400 },
    );
  }

  // Honeypot: succeed silently so a bot gets no signal that it was detected.
  if (
    typeof payload === "object" &&
    payload !== null &&
    "website" in payload &&
    typeof (payload as { website?: unknown }).website === "string" &&
    (payload as { website: string }).website.length > 0
  ) {
    return NextResponse.json({ ok: true, reference: fakeReferenceForHoneypot() });
  }

  const ip = clientIp(request);
  if (rateLimited(ip ?? "unknown-ip")) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many enquiries from this connection. Please try again shortly, or call us.",
      },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Some details need checking",
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 422 },
    );
  }

  const enquiry = parsed.data;
  const db = supabaseAdmin();

  const { data: inserted, error: insertError } = await db
    .from("enquiries")
    .insert({
      full_name: enquiry.fullName,
      email: enquiry.email,
      phone: enquiry.phone,
      country: enquiry.country || null,
      company_name: enquiry.companyName || null,
      service_type: enquiry.serviceType,
      item_slug: enquiry.itemSlug || null,
      destination: enquiry.destination || null,
      start_date: enquiry.startDate || null,
      end_date: enquiry.endDate || null,
      adults: enquiry.paxAdults,
      children: enquiry.paxChildren,
      pickup_address: enquiry.pickupAddress || null,
      dropoff_address: enquiry.dropoffAddress || null,
      flight_number: enquiry.flightNumber || null,
      message: enquiry.specialRequests || null,
      // reference: generated by the database default (next_enquiry_reference())
      // status: defaults to 'new'
      // source: defaults to 'form'
    })
    .select("reference")
    .single();

  if (insertError || !inserted) {
    console.error("[enquiry] insert failed:", insertError?.message);
    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong saving your enquiry. Please try again, or call us.",
      },
      { status: 500 },
    );
  }

  const reference = inserted.reference as string;

  // Consent audit trail. Two rows, always — including when marketing
  // consent is false, because "they declined" is exactly what POPIA
  // requires proof of, not just "they agreed".
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const { error: consentError } = await db.from("consent_records").insert([
    {
      email: enquiry.email,
      consent_type: "data_processing",
      granted: enquiry.consentProcessing,
      ip_address: ip,
      user_agent: userAgent,
    },
    {
      email: enquiry.email,
      consent_type: "marketing",
      granted: enquiry.consentMarketing,
      ip_address: ip,
      user_agent: userAgent,
    },
  ]);

  if (consentError) {
    // The enquiry itself is already saved and matters more to the business
    // than the audit trail — do not fail the whole request over this, but
    // log loudly, since a missing consent record is a compliance gap that
    // needs catching, not silently swallowing.
    console.error("[enquiry] consent_records insert failed:", consentError.message);
  }

  return NextResponse.json({ ok: true, reference });
}

/** Anything other than POST is not allowed here. */
export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
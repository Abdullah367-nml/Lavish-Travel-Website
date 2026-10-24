// =============================================================================
// REPLACE THE WHOLE FILE: lib/enquiry-schema.ts
//
// What changed: added `destination` (freeform, optional) to Step 1, for a
// couple/traveller planning a custom trip with no specific tour in mind yet.
// Everything else is unchanged from your original file.
// =============================================================================
import { z } from "zod";

/**
 * One Zod schema, used by the client form and the route handler.
 *
 * Client-side validation is a convenience; the route handler re-validates
 * the same payload because anything arriving over HTTP is untrusted. Sharing
 * the schema is what stops the two drifting apart.
 *
 * Zod 4 API: `z.email()` / `z.iso.date()` as standalone validators rather
 * than the v3 `z.string().email()` chain.
 */

export const SERVICE_TYPES = [
  "transfers",
  "chauffeur",
  "car-hire",
  "tours",
  "groups",
  "events",
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export const SERVICE_LABELS: Record<ServiceType, string> = {
  transfers: "Airport transfer",
  chauffeur: "Chauffeur hire",
  "car-hire": "Self-drive car hire",
  tours: "Tour or safari package",
  groups: "Group or charter",
  events: "Wedding or event transport",
};

/**
 * E.164-ish. Deliberately permissive: a visitor typing "+27 82 555 1234"
 * with spaces should not be rejected, so we strip separators before testing
 * and let a consultant normalise the rest.
 */
const phoneSchema = z
  .string()
  .trim()
  .min(7, "Enter a contact number so we can reach you")
  .max(24, "That number looks too long")
  .refine(
    (v) => /^\+?[0-9]{7,18}$/.test(v.replace(/[\s()\-.]/g, "")),
    "Enter a valid phone number, including the country code",
  );

export const enquirySchema = z
  .object({
    // --- Step 1: what they need ------------------------------------------
    serviceType: z.enum(SERVICE_TYPES, {
      message: "Choose the service you need",
    }),
    /** Slug of the specific tour, vehicle or route they came from. */
    itemSlug: z.string().trim().max(120).optional().or(z.literal("")),
    /**
     * Freeform destination(s) of interest — for a custom trip request with
     * no specific tour decided yet. Distinct from itemSlug: this is the
     * traveller's own words ("Stellenbosch and Hermanus, maybe Franschhoek"),
     * not a known catalogue slug.
     */
    destination: z.string().trim().max(200).optional().or(z.literal("")),

    // --- Step 2: when and how many ---------------------------------------
    startDate: z.string().trim().min(1, "Tell us roughly when you travel"),
    endDate: z.string().trim().optional().or(z.literal("")),
    paxAdults: z.coerce
      .number()
      .int()
      .min(1, "At least one adult")
      .max(200, "For groups this large, please call us"),
    paxChildren: z.coerce.number().int().min(0).max(200).default(0),
    pickupAddress: z.string().trim().max(200).optional().or(z.literal("")),
    dropoffAddress: z.string().trim().max(200).optional().or(z.literal("")),
    flightNumber: z.string().trim().max(20).optional().or(z.literal("")),

    // --- Step 3: who they are ---------------------------------------------
    fullName: z
      .string()
      .trim()
      .min(2, "Enter your name")
      .max(120, "That name is too long"),
    email: z.email("Enter a valid email address").max(200),
    phone: phoneSchema,
    country: z.string().trim().max(80).optional().or(z.literal("")),
    companyName: z.string().trim().max(120).optional().or(z.literal("")),

    // --- Step 4: detail and consent ---------------------------------------
    specialRequests: z.string().trim().max(2000).optional().or(z.literal("")),

    /**
     * POPIA requires explicit, granular, opt-in consent — never pre-ticked.
     * Processing consent is required to submit at all; marketing consent is
     * genuinely optional and defaults to false.
     */
    consentProcessing: z.literal(true, {
      message: "We need your permission to process this enquiry",
    }),
    consentMarketing: z.boolean().default(false),

    /** Honeypot. Must stay empty — real users never see this field. */
    website: z.string().max(0).optional().or(z.literal("")),
  })
  .refine(
    (data) =>
      !data.endDate || !data.startDate || data.endDate >= data.startDate,
    { message: "The return date cannot be before the departure date", path: ["endDate"] },
  );

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryData = z.output<typeof enquirySchema>;

/** The fields belonging to each step, so the form validates progressively. */
export const STEP_FIELDS = [
  ["serviceType", "itemSlug", "destination"],
  [
    "startDate",
    "endDate",
    "paxAdults",
    "paxChildren",
    "pickupAddress",
    "dropoffAddress",
    "flightNumber",
  ],
  ["fullName", "email", "phone", "country", "companyName"],
  ["specialRequests", "consentProcessing", "consentMarketing"],
] as const;
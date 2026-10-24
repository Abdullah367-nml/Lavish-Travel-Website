# Handover — Lavish Travels & Tours booking platform

Paste this whole file as your first message in the new chat.

---

You are continuing work on an existing, working project. **Read this before
changing anything, and do not rebuild what already works.**

## The project

**Lavish Travels & Tours** — a South African luxury travel agency. Airport
transfers, chauffeur hire, self-drive car hire, and bookable tours in Cape
Town and Stellenbosch. Dark/near-black premium brand with an amber accent,
built from the client's own logo (a sports car rear with lit tail lights).

**Location on disk (Windows):**
`C:\Users\Abdullah Saghir\source\repos\lavish-travels-tours`

**Run it:** `npm run dev` → http://localhost:3000
Keep that terminal open; the site only exists while it runs.

## Stack

- **Next.js 16.3** App Router, Turbopack, TypeScript strict
- **React 19**, **Tailwind CSS v4** (CSS-first `@theme` in `app/globals.css`,
  there is NO tailwind.config file), Radix primitives, lucide icons
- **Supabase** — Postgres + Auth, region `eu-central-1` (Frankfurt).
  Supabase has **no African region**; POPIA s.72 is satisfied by the DPA plus
  EU hosting, which must be documented in the privacy policy.
- Fonts self-hosted via `next/font/local` (files vendored in `app/fonts/`)

## Architecture — the one thing to understand

**`lib/data/index.ts` is the only data seam.** Every page and component reads
through it. It maps database rows into the TypeScript types in `lib/types.ts`.

- **From Supabase:** destinations, attractions, tours, tour dates/availability
  (`lib/data/catalogue.ts`)
- **Still static TypeScript files:** vehicles, transfer routes, city pages,
  blog, testimonial reviews. These are not part of the booking system —
  leave them alone unless asked.

Do not query Supabase directly from a page. Add a function to the data layer.

## Database

Migrations in `supabase/migrations/`, applied via the Supabase SQL Editor:

| File | Contents |
|---|---|
| `0001_schema.sql` | 11 tables, enums, indexes, constraints |
| `0002_functions.sql` | `create_booking()`, `cancel_booking()`, `admin_set_booking_status()`, `handle_new_user()`, `tour_date_availability` view |
| `0003_rls.sql` | Row Level Security policies + grants |
| `0004_fix_profile_trigger.sql` | Fixes dashboard-created users failing on a name constraint |
| `0005_admin_service_role.sql` | Lets the service role satisfy `is_admin()` |
| `seed.sql` | 2 destinations, 19 attractions, 7 tours, ~196 departures |

**Critical invariants — do not work around these:**

- `create_booking()` takes a row lock (`SELECT ... FOR UPDATE`) on the
  departure, checks seats, reads the price from the `tours` table, inserts,
  and increments `seats_booked` — all in one transaction. **Overbooking is
  structurally impossible.** Verified with six simultaneous bookings racing
  for four seats: exactly two succeeded.
- **No price is ever sent from the browser.** The total is computed in the
  database. Never add a price field to a booking payload.
- Customers can only read their own bookings — enforced by RLS, not by page
  code. Do not add app-level ownership filters; they are redundant and will
  break the admin views that share the same helpers.
- Errors are raised with stable codes (`NO_SEATS:3`, `DATE_CLOSED`,
  `AUTH_REQUIRED`) and mapped to friendly text in
  `app/book/[slug]/actions.ts`.

## Auth

- Supabase Auth, email + password. **Email confirmation is ON** — new users
  must click the link before they can sign in.
- Roles live in `profiles.role` (`customer` | `admin`). The signup payload
  deliberately carries **no role**; the `handle_new_user` trigger hard-codes
  `customer`.
- Make someone an admin:
  `update public.profiles set role='admin' where email='...';`
- Always `getUser()`, never `getSession()`, for authorisation — see
  `lib/auth.ts`.
- `requireAdmin()` calls `notFound()` for non-admins, not a redirect.

## What is built and working

**Public:** homepage, tours listing with URL-driven filters, tour detail with
itinerary accordion + live departures + attractions, fleet, vehicle detail,
transfer routes with fixed prices, chauffeur/car-hire city pages,
destinations, blog, custom-trip enquiry form, sitemap, robots, JSON-LD,
full favicon/PWA icon set.

**Booking:** register → sign in → pick a departure → travellers → details →
review → confirm → confirmation page → My Bookings. Seat counts drop
correctly and the sold-out state is respected. **Tested end to end.**

**Admin** at `/admin` (no link from the public site — type the URL):
dashboard with live stats, bookings management (search, filter, change
booking and payment status inline), tours list, tour dates list, customers
list. `/admin/login` sits outside the auth gate via the `(protected)` route
group.

## What is NOT built

- Admin **create/edit forms** — tours, destinations, attractions, tour dates
  are read-only in the panel. `/admin/destinations`, `/payments`, `/reviews`,
  `/reports`, `/settings` are honest placeholder pages.
- **Payment gateway.** Architecture only. Payments start `pending`; an admin
  marks them paid. Never store card numbers or CVV.
- **Transactional email.** Resend is in `.env.example` but not wired. Nobody
  is emailed when a booking is made.
- Reviews collection, PDF vouchers, multi-currency display.

## ⚠ Placeholders that MUST be replaced before going public

- **Every tour price is invented** (R1 650, R2 450, R2 650…). They are live
  and bookable. The client has not supplied a real rate card.
- `lib/site.ts` — company registration number, VAT number, physical address,
  phone, WhatsApp number, and the TGCSA / SATSA / ASATA accreditations.
  **Do not publish an accreditation the agency does not hold; that is a
  compliance issue, not marketing licence.**
- No real photography. Every image slot renders a CSS gradient. Dropping a
  file into `public/images/...` at the referenced path makes it appear
  automatically — see `lib/image-manifest.ts`.
- Cancellation/refund tiers are not written (CPA requires them disclosed
  before payment).

## Credentials

`.env.local` (git-ignored) holds the Supabase URL, anon key and service-role
key. **The service-role key bypasses all row-level security** — server-side
only, never `NEXT_PUBLIC_`, never in chat.

## Gotchas already hit — do not repeat

- A nested layout does not override its parent. `/admin/login` must stay
  outside the `(protected)` group or admins get locked out.
- Zod 4: `z.coerce.number()` has an `unknown` input type, so don't derive
  React form state from `z.input<>`. Use `z.email()`, not
  `z.string().email()`.
- Don't define components inside a render, and don't call `router.push()` in
  a render body.
- `logging.browserToTerminal: false` in `next.config.ts` stops browser
  extensions flooding the terminal with hydration warnings.

## Suggested next steps

1. Admin create/edit forms for tours, destinations, attractions, tour dates
   (Parts 17–20 of the original brief) — so an admin can add a tour and see
   it appear on the public site.
2. Resend emails on booking (team notification + customer confirmation).
3. Reviews moderation, reports, settings.
4. Payment gateway — Paystack or Ozow; Stripe is not available to SA
   merchants.

## How to work

Verify before claiming something works: `npx tsc --noEmit`, `npm run lint`,
`npm run build`. Keep the existing dark/amber design system — do not
redesign. Reuse `components/ui` and `components/shared` rather than adding
parallel components.

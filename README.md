# Lavish Travels & Tours

Production website for **Lavish Travels & Tours** — a luxury travel, tours,
and chauffeur/transfer company based in South Africa. Dark, premium,
automotive-luxury brand; lead-capture first, online payment second.

This repo is being built section by section against the master build
prompt. **This commit covers Section 0 (brief) + Section 1 (stack &
scaffold) only** — no feature pages yet, by design. See
[Status](#status--whats-next) below.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15+ (App Router), TypeScript strict | Server-rendered HTML for SEO — the reference competitor ships an empty-body SPA |
| Rendering | React Server Components by default | Interactivity isolated to small Client Component islands → low INP |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) + shadcn/ui (Radix primitives) | Fast to build, accessible primitives, no runtime CSS-in-JS |
| Fonts | `next/font` (Oswald display / Inter body), self-hosted | Zero layout shift, no third-party font request |
| Validation | Zod | One schema shared by client forms and server actions/route handlers |
| Backend | Supabase (Postgres, Auth, Storage, RLS) — **af-south-1 (Cape Town)** | Latency for SA users + POPIA s.72 data-residency |
| Payments | Pluggable `PaymentProvider` interface — Paystack (primary), Ozow (Instant EFT), Payfast (alternative), manual EFT fallback | Stripe isn't available to SA merchants directly; SA customers strongly prefer EFT/QR over card |
| Email | Resend + React Email | Transactional confirmations, enquiry auto-ack |
| Hosting | Vercel (Cape Town / Johannesburg edge) | Closest PoPs to target users |
| Analytics | GA4, Microsoft Clarity, Vercel Speed Insights | Free heatmaps + Core Web Vitals monitoring |

Full stack rationale and every non-negotiable (SEO, Core Web Vitals
budgets, POPIA, WCAG 2.2 AA) is in the master build prompt, Sections 0–1.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real keys — see comments in the file
npm run dev
```

Open http://localhost:3000.

### Environment variables

See `.env.example` for the full list, grouped by service, with inline
comments on which are server-only vs. `NEXT_PUBLIC_*`. Nothing in this repo
should ever read a real secret from a committed file — `.env.example` is
the only env file tracked in git.

Notably: **the Supabase project must be provisioned in `af-south-1` (Cape
Town)** before `NEXT_PUBLIC_SUPABASE_URL` is filled in — this is a POPIA
data-residency requirement (Section 9), not just a latency choice.

## Folder structure (current)

```
app/
  layout.tsx        root layout — fonts, header/footer shells, skip link, metadata defaults
  fonts.ts           next/font setup (Oswald display + Inter body)
  page.tsx           placeholder home route (real homepage is Section 4)
  globals.css        design tokens: dark-luxury palette, type scale, focus rings, scrims
components/
  layout/
    site-header.tsx  desktop nav + mobile trigger (Server Component)
    mobile-nav.tsx    full-screen overlay nav (Client Component — the only
                       interactive island in the header)
    nav-links.tsx     shared nav model (desktop + mobile read from one source)
    logo.tsx           text wordmark placeholder — swap for the real mark in Section 8
    site-footer.tsx   rich footer shell: services / destinations / company / legal
                       columns + ECTA s.43 supplier-disclosure placeholder
    page-shell.tsx    shared shell for routes whose full content lands in
                       Section 4 (eyebrow / H1 / intro / "coming to this page")
  ui/
    button.tsx        shadcn/ui-style Button (variants: default/outline/ghost/link)
lib/
  utils.ts            `cn()` class-merge helper (shadcn convention)
components.json        shadcn/ui config (style: new-york, RSC on)
.env.example
```

### Routes that exist today

Every route reachable by clicking a link in the header or footer is built
and prerendered static, each with its own `title`, `description` and
`alternates.canonical`:

```
/                       /tours          /transfers      /chauffeur
/car-hire               /destinations   /enquire        /blog
/about                  /contact        /faq            /fleet
/terms                  /privacy        /popia          /cancellation-policy
```

The eight legal/marketing routes sit in an `app/(marketing)/` route
group — the parenthesised folder name groups files without appearing in
the URL, so `app/(marketing)/about/page.tsx` serves `/about`.

These pages carry real metadata, headings and intro copy, but their
bodies are placeholders: Section 4 replaces the content of each without
touching the routing.

**Dynamic routes are deliberately not scaffolded yet** —
`/tours/[destination]/[slug]`, `/transfers/[route]`, `/chauffeur/[city]`,
`/car-hire/vehicle/[slug]`, `/destinations/[slug]`, `/blog/[slug]`,
`/booking/[reference]`, plus `/account` and `/admin`. They need the
database from Section 2 to render anything real, and stubbing them would
mean guessing at data shapes.

## Design tokens

All colour, spacing-radius, and type-scale tokens live in `app/globals.css`
under `:root` / `@theme inline` (Tailwind v4's CSS-first config — there is
no `tailwind.config.ts`). Palette:

- Background `#0A0A0A`, surface `#141414`, elevated surface `#1C1C1C`, border `#242424`
- Text: `#F5F5F5` primary, `#A3A3A3` muted
- Accent: champagne/brass `#C9A961` — used only for CTAs and key highlights

Every text/background pairing is contrast-checked against WCAG 2.2 AA in
the comments above each token. Two things worth knowing:

1. **Never put light foreground text on the accent colour** — white on
   `#C9A961` is ~2.1:1 and fails AA. Always pair the accent background
   with `--accent-foreground` (`#0A0A0A`), which gets 8.8:1.
2. The hairline `--border` colour is intentionally subtle (~1.3:1 against
   the background) and is treated as **decorative only**. Anything that
   needs to communicate an interactive boundary (inputs, focus, buttons)
   relies on the accent-coloured focus ring (8.8:1) or a lighter surface
   on hover/active instead of the border colour, to satisfy WCAG 1.4.11
   non-text contrast.

## Typography

- Display face: **Oswald** (condensed, wide-letter-spacing uppercase —
  echoes the "LAVISH / TRAVELS & TOURS" wordmark). Headings only.
- Body face: **Inter**. Paragraphs, forms, UI chrome.
- Both loaded through `next/font/google` in `app/fonts.ts`, which
  self-hosts them at build time (no runtime request to Google Fonts,
  `display: swap`, automatic fallback metrics — this is what keeps CLS at
  zero from fonts).

## Accessibility

- Skip link (`.skip-link` in `globals.css`) as the first focusable element.
- Semantic landmarks: `<header>`, `<nav aria-label>`, `<main id="main-content">`, `<footer>`.
- Visible 2px accent focus ring on every interactive element
  (`:focus-visible` in `globals.css`), not just the default browser outline.
- Mobile nav overlay is a labelled `role="dialog"` with `aria-modal`,
  traps scroll while open, and closes on `Escape`.
- `prefers-reduced-motion` is respected globally.
- All touch targets in header/nav components are ≥44px.

## Scripts

```bash
npm run dev      # local dev server
npm run build    # production build
npm run start    # run the production build
npm run lint     # eslint
```

## Status & what's next

Done so far: **Sections 0, 1, 3, 4, 6 and 8**, running against a typed mock
dataset instead of a database.

- Full route tree, static and dynamic, all prerendered where possible
- Homepage, tours listing with URL-driven filters, tour detail with
  itinerary accordion, fleet + vehicle detail, programmatic transfer route
  pages, city landing pages, destinations, blog, and the four-step enquiry
  form with a validated API endpoint
- JSON-LD on every page type, generated `sitemap.ts` and `robots.ts`,
  per-page canonicals
- Brand assets and the full favicon/PWA icon set, generated from the logo

**Still to do:** **Section 2** (Supabase schema, RLS policies, the
row-locking availability function), **Section 5** (accounts, payments,
CMS, admin), **Section 7's** remaining polish, and **Section 9's**
compliance content. There is still no database, no auth and no payments —
by design, so the front end could be demoed first.

### How the data layer swap works

Every page reads through `lib/data/index.ts`, where each function is
already `async` and carries a comment naming the Supabase query that will
replace it. Types in `lib/types.ts` mirror the Section 2 tables field for
field. When the database lands, that one file changes and no component
does.
- **Section 4** — Phase 1 feature pages (homepage, tours, fleet, transfers, enquiry flow, WhatsApp button, blog, cookie consent)
- **Section 5** — Phase 2/3 (accounts, payments, CMS, admin) — deferred until Phase 1 ships
- **Section 6** — technical SEO implementation (JSON-LD, sitemap, robots, Core Web Vitals)
- **Section 7** — design system & responsive rules (deepened beyond the base tokens here)
- **Section 8** — real brand assets & favicon set (replacing the text-wordmark placeholder)
- **Section 9** — POPIA / CPA / ECTA compliance implementation

## A note on things this scaffold deliberately does *not* do

- No Supabase project has been provisioned (requires real credentials/an
  account decision on the `af-south-1` region — see `.env.example`).
- No Vercel deployment has been configured.
- `shadcn`'s CLI registry (`ui.shadcn.com`) was unreachable from the build
  environment that produced this scaffold, so `components/ui/button.tsx`
  was hand-written to the same conventions (CVA variants, `cn()`, Radix
  `Slot` for `asChild`) rather than pulled via `npx shadcn add`. Running
  `npx shadcn@latest add <component>` should work normally in a
  environment with standard internet access, and will slot into the
  existing `components.json` config.

/**
 * Shared primary navigation model — consumed by both the desktop header
 * and the mobile full-screen overlay so the two never drift out of sync.
 * Hrefs point at routes defined in Section 3; most don't exist yet
 * (Phase 1 scaffold only ships the layout shell), so these are `<Link>`s
 * to be filled in as each section's pages land.
 */
export type NavLink = {
  label: string;
  href: string;
};

export const PRIMARY_NAV: NavLink[] = [
  { label: "Tours", href: "/tours" },
  { label: "Transfers", href: "/transfers" },
  { label: "Chauffeur", href: "/chauffeur" },
  { label: "Car Hire", href: "/car-hire" },
  { label: "Destinations", href: "/destinations" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "My Bookings", href: "/my-bookings" },
];

/**
 * The two calls to action, kept here so the header, the mobile overlay and
 * the sticky mobile bar can never disagree about where they point.
 *
 * BOOK NOW is the primary action and leads into the booking flow: browse
 * tours, pick a departure, pay. "Request a Custom Trip" is the secondary
 * path for travellers who want an itinerary built for them — the agency's
 * tailored work, which is quoted rather than bought off the shelf. Both
 * matter; only one gets the accent colour.
 */
export const PRIMARY_CTA = { label: "Book Now", href: "/tours" };
export const SECONDARY_CTA = {
  label: "Request a Custom Trip",
  href: "/enquire",
};

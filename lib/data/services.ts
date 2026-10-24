import type { ServiceSummary } from "@/lib/types";

/**
 * The six things the business sells, as presented on the homepage service
 * cards. Static content rather than a database table.
 */
export const services: ServiceSummary[] = [
  {
    slug: "transfers",
    name: "Airport Transfers",
    tagline:
      "Fixed prices from OR Tambo, Cape Town and King Shaka. We track your flight, so delays cost you nothing.",
    href: "/transfers",
    icon: "plane",
  },
  {
    slug: "chauffeur",
    name: "Chauffeur Hire",
    tagline:
      "Executive sedans and luxury people carriers with a professional driver, by the hour or the week.",
    href: "/chauffeur",
    icon: "steering",
  },
  {
    slug: "car-hire",
    name: "Self-Drive Hire",
    tagline:
      "Premium sedans, SUVs and safari 4x4s delivered to your hotel or the airport, fully insured.",
    href: "/car-hire",
    icon: "car",
  },
  {
    slug: "tours",
    name: "Tours & Safaris",
    tagline:
      "Day tours and multi-day journeys — Cape Peninsula, Winelands, Garden Route, Kruger and beyond.",
    href: "/tours",
    icon: "map",
  },
  {
    slug: "groups",
    name: "Groups & Charters",
    tagline:
      "Minibuses and coaches for conferences, incentives and MICE movements on a single manifest.",
    href: "/enquire?service=groups",
    icon: "users",
  },
  {
    slug: "events",
    name: "Weddings & Events",
    tagline:
      "Guest shuttles that run all evening, coordinated with your venue and your timeline.",
    href: "/enquire?service=events",
    icon: "gift",
  },
];

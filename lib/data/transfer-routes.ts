import type { TransferRoute } from "@/lib/types";

/**
 * DEMO DATA — replaced by a Supabase `transfer_routes` query in Section 2.
 *
 * These are the highest-intent SEO pages on the site: someone searching
 * "OR Tambo to Sandton transfer" is ready to book. Each row becomes its
 * own page at /transfers/{slug} with a fixed price, so the number is
 * visible without an enquiry — which is exactly what the competition
 * hides behind a form.
 *
 * `basePriceZar` is the fixed all-in price for the standard executive
 * sedan, VAT inclusive, with no waiting-time surcharge.
 */
export const transferRoutes: TransferRoute[] = [
  {
    id: "t1000000-0000-4000-8000-000000000001",
    slug: "or-tambo-to-sandton",
    origin: "OR Tambo International Airport",
    destination: "Sandton",
    airportCode: "JNB",
    basePriceZar: 850,
    durationMinutes: 35,
    distanceKm: 28,
    vehicleSlugs: [
      "mercedes-benz-e-class",
      "bmw-5-series",
      "mercedes-benz-v-class",
      "toyota-quantum",
    ],
    notes:
      "The standard corporate run. Allow closer to an hour between 06:30 and 08:30 or 16:00 and 18:30, when the M1 northbound backs up. We track your flight, so a late landing costs nothing extra.",
  },
  {
    id: "t1000000-0000-4000-8000-000000000002",
    slug: "or-tambo-to-johannesburg-cbd",
    origin: "OR Tambo International Airport",
    destination: "Johannesburg CBD",
    airportCode: "JNB",
    basePriceZar: 780,
    durationMinutes: 30,
    distanceKm: 25,
    vehicleSlugs: [
      "mercedes-benz-e-class",
      "bmw-5-series",
      "mercedes-benz-v-class",
    ],
    notes:
      "Direct on the R24 and the M2. Straightforward outside peak hours; we will suggest a departure time if you are heading to the airport rather than from it.",
  },
  {
    id: "t1000000-0000-4000-8000-000000000003",
    slug: "or-tambo-to-pretoria",
    origin: "OR Tambo International Airport",
    destination: "Pretoria",
    airportCode: "JNB",
    basePriceZar: 1350,
    durationMinutes: 55,
    distanceKm: 58,
    vehicleSlugs: [
      "mercedes-benz-e-class",
      "mercedes-benz-v-class",
      "toyota-quantum",
    ],
    notes:
      "North on the R21. Reliable run, and the price covers any Pretoria address including Centurion, Hatfield and Menlyn.",
  },
  {
    id: "t1000000-0000-4000-8000-000000000004",
    slug: "or-tambo-to-midrand",
    origin: "OR Tambo International Airport",
    destination: "Midrand",
    airportCode: "JNB",
    basePriceZar: 890,
    durationMinutes: 35,
    distanceKm: 32,
    vehicleSlugs: ["mercedes-benz-e-class", "mercedes-benz-v-class"],
    notes:
      "Covers Waterfall City, Kyalami and the Gallagher Convention Centre. A common conference transfer, and we handle group arrivals on one manifest.",
  },
  {
    id: "t1000000-0000-4000-8000-000000000005",
    slug: "cape-town-airport-to-city-centre",
    origin: "Cape Town International Airport",
    destination: "Cape Town City Centre",
    airportCode: "CPT",
    basePriceZar: 750,
    durationMinutes: 25,
    distanceKm: 22,
    vehicleSlugs: [
      "mercedes-benz-e-class",
      "bmw-5-series",
      "mercedes-benz-v-class",
      "toyota-quantum",
    ],
    notes:
      "Covers the City Bowl, Foreshore, Green Point and the V&A Waterfront. Short and predictable outside the afternoon peak on the N2.",
  },
  {
    id: "t1000000-0000-4000-8000-000000000006",
    slug: "cape-town-airport-to-camps-bay",
    origin: "Cape Town International Airport",
    destination: "Camps Bay",
    airportCode: "CPT",
    basePriceZar: 950,
    durationMinutes: 35,
    distanceKm: 30,
    vehicleSlugs: [
      "mercedes-benz-e-class",
      "mercedes-benz-v-class",
      "toyota-quantum",
    ],
    notes:
      "Over Kloof Nek or round the Atlantic Seaboard depending on traffic. Also covers Bakoven, Bantry Bay and Clifton at the same price.",
  },
  {
    id: "t1000000-0000-4000-8000-000000000007",
    slug: "cape-town-airport-to-stellenbosch",
    origin: "Cape Town International Airport",
    destination: "Stellenbosch",
    airportCode: "CPT",
    basePriceZar: 1050,
    durationMinutes: 35,
    distanceKm: 35,
    vehicleSlugs: [
      "mercedes-benz-e-class",
      "mercedes-benz-v-class",
      "toyota-quantum",
    ],
    notes:
      "Straight out on the N2 and R310. Popular with wine-country arrivals; ask us to add a cellar stop on the way in if you land before midday.",
  },
  {
    id: "t1000000-0000-4000-8000-000000000008",
    slug: "king-shaka-to-umhlanga",
    origin: "King Shaka International Airport",
    destination: "Umhlanga Rocks",
    airportCode: "DUR",
    basePriceZar: 650,
    durationMinutes: 20,
    distanceKm: 18,
    vehicleSlugs: ["mercedes-benz-e-class", "mercedes-benz-v-class"],
    notes:
      "The shortest of our airport runs. Covers Umhlanga Ridge, Gateway and La Lucia at the same rate.",
  },
  {
    id: "t1000000-0000-4000-8000-000000000009",
    slug: "king-shaka-to-durban-cbd",
    origin: "King Shaka International Airport",
    destination: "Durban CBD & Beachfront",
    airportCode: "DUR",
    basePriceZar: 950,
    durationMinutes: 35,
    distanceKm: 36,
    vehicleSlugs: [
      "mercedes-benz-e-class",
      "mercedes-benz-v-class",
      "toyota-quantum",
    ],
    notes:
      "South on the M4 along the coast. Covers the Golden Mile hotels, uShaka and the ICC.",
  },
  {
    id: "t1000000-0000-4000-8000-000000000010",
    slug: "sandton-to-pretoria",
    origin: "Sandton",
    destination: "Pretoria",
    airportCode: null,
    basePriceZar: 1150,
    durationMinutes: 50,
    distanceKm: 48,
    vehicleSlugs: [
      "mercedes-benz-e-class",
      "bmw-5-series",
      "mercedes-benz-v-class",
    ],
    notes:
      "A corporate point-to-point rather than an airport run. If you need the return leg the same day, an hourly chauffeur booking usually works out cheaper than two transfers.",
  },
];

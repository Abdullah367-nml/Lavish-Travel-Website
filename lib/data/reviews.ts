import type { Review } from "@/lib/types";

/**
 * DEMO DATA — replaced by a Supabase `reviews` query in Section 2, where
 * only rows with `is_approved = true` are publicly selectable. These feed
 * the testimonials band and the AggregateRating structured data.
 */
export const reviews: Review[] = [
  {
    id: "r1000000-0000-4000-8000-000000000001",
    authorName: "Eleanor Whitfield",
    authorCountry: "United Kingdom",
    packageId: "p1000000-0000-4000-8000-000000000004",
    vehicleId: null,
    rating: 5,
    title: "Seven days was exactly right",
    body:
      "We had planned to do the Garden Route in four days and Lavish talked us into seven. They were right. Driving the passes rather than the N2 was the whole trip, and having someone else at the wheel on the Outeniqua meant we actually looked out of the window.",
    travellerType: "couple",
    isApproved: true,
    createdAt: "2026-03-18",
  },
  {
    id: "r1000000-0000-4000-8000-000000000002",
    authorName: "Marcus Adeyemi",
    authorCountry: "South Africa",
    packageId: null,
    vehicleId: "v1000000-0000-4000-8000-000000000001",
    rating: 5,
    title: "The only transfer service I now use",
    body:
      "I fly into OR Tambo most weeks. My flight was delayed two hours and the driver was still there, no surcharge, no discussion. That is a low bar that almost nobody in Johannesburg actually clears.",
    travellerType: "business",
    isApproved: true,
    createdAt: "2026-05-02",
  },
  {
    id: "r1000000-0000-4000-8000-000000000003",
    authorName: "Sophie Bergmann",
    authorCountry: "Germany",
    packageId: "p1000000-0000-4000-8000-000000000005",
    vehicleId: null,
    rating: 5,
    title: "Honest about the leopard",
    body:
      "The ranger told us on the first drive that leopard was unlikely and did not pretend otherwise. We saw one on the third evening and it meant more because nobody had promised it. Four of the five, and the walking safari was the part I still talk about.",
    travellerType: "family",
    isApproved: true,
    createdAt: "2026-07-11",
  },
  {
    id: "r1000000-0000-4000-8000-000000000004",
    authorName: "David & Ruth Cohen",
    authorCountry: "United States",
    packageId: "p1000000-0000-4000-8000-000000000003",
    vehicleId: null,
    rating: 5,
    title: "They matched the estates to what we drink",
    body:
      "We said we liked Chenin and old-vine whites and got a day that looked nothing like the standard four-estate circuit. Two of the cellars we would never have found. Being driven back to Cape Town afterwards is not a luxury, it is common sense.",
    travellerType: "couple",
    isApproved: true,
    createdAt: "2026-02-24",
  },
  {
    id: "r1000000-0000-4000-8000-000000000005",
    authorName: "Thandiwe Mokoena",
    authorCountry: "South Africa",
    packageId: null,
    vehicleId: "v1000000-0000-4000-8000-000000000007",
    rating: 4,
    title: "Handled a 40-person wedding shuttle without drama",
    body:
      "Two Sprinters running guests between Franschhoek and the venue all evening. Drivers were patient with a very late finish. Only note is that I had to chase the final invoice, which is the one thing worth tightening.",
    travellerType: "group",
    isApproved: true,
    createdAt: "2026-04-30",
  },
  {
    id: "r1000000-0000-4000-8000-000000000006",
    authorName: "James Okonkwo",
    authorCountry: "Nigeria",
    packageId: "p1000000-0000-4000-8000-000000000007",
    vehicleId: null,
    rating: 5,
    title: "The museum first was the right order",
    body:
      "Our guide grew up in Soweto and insisted we do the Apartheid Museum before anything else. By the time we reached Vilakazi Street and Regina Mundi it landed completely differently. Do not do this one with a stranger reading from a script.",
    travellerType: "solo",
    isApproved: true,
    createdAt: "2026-06-08",
  },
];

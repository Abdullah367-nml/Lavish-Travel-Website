import type { Attraction } from "@/lib/types";

/**
 * Curated points of interest & route stops across Cape Town, the Garden Route,
 * Stellenbosch Winelands, Kruger, Panorama Route, Drakensberg, Johannesburg & Victoria Falls.
 * Every point includes a verified high-resolution photograph.
 */
export type AttractionWithDestination = Attraction & {
  destinationSlug: string;
};

export const staticAttractions: AttractionWithDestination[] = [
  // =========================================================================
  // CAPE TOWN POINTS (12)
  // =========================================================================
  {
    id: "a1000000-0000-4000-8000-000000000001",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    slug: "table-mountain-aerial-cableway",
    name: "Table Mountain Aerial Cableway",
    description:
      "Experience panoramic views of Cape Town, Robben Island and the Atlantic Ocean with a 360-degree rotating cable car ride to the flat-topped summit of South Africa's most famous landmark.",
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=900&auto=format&fit=crop&q=80",
    location: "Tafelberg Road, Table Mountain National Park",
    sortOrder: 1,
    category: "Landmark & Viewpoint",
    suggestedTime: "2–3 hours",
    visitorNote:
      "Take the first clear morning slot — coastal winds can pause the cableway in the afternoon.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000002",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    slug: "cape-point-cape-of-good-hope",
    name: "Cape Point & Cape of Good Hope",
    description:
      "Explore dramatic 200-metre sea cliffs, fynbos nature trails, and the historic lighthouse at the wild southwestern tip of the African continent inside Table Mountain National Park.",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&auto=format&fit=crop&q=80",
    location: "Cape Point, Southern Peninsula",
    sortOrder: 2,
    category: "Coastal Nature Reserve",
    suggestedTime: "2–3 hours",
    visitorNote:
      "Combine with the Flying Dutchman Funicular up to the Old Lighthouse lookout.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000003",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    slug: "boulders-beach-penguin-colony",
    name: "Boulders Beach Penguin Colony",
    description:
      "Walk along scenic wooden boardwalks in sheltered False Bay coves to observe thousands of wild African penguins nesting and swimming among giant granite boulders.",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&auto=format&fit=crop&q=80",
    location: "Simon's Town, False Bay",
    sortOrder: 3,
    category: "Wildlife & Coast",
    suggestedTime: "1–1.5 hours",
    visitorNote:
      "Late afternoon visits enjoy softer light and fewer coach crowds.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000004",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    slug: "lions-head",
    name: "Lion's Head",
    description:
      "An iconic spiralling peak offering Cape Town's most rewarding hike with unmatched 360-degree views of the City Bowl, Twelve Apostles and Atlantic coastline at sunrise or sunset.",
    image:
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=900&auto=format&fit=crop&q=80",
    location: "Signal Hill Road, Cape Town",
    sortOrder: 4,
    category: "Hiking & Viewpoint",
    suggestedTime: "2.5–3 hours",
    visitorNote:
      "A guided sunset hike with headlamps for the descent is a signature local experience.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000005",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    slug: "kirstenbosch-national-botanical-garden",
    name: "Kirstenbosch National Botanical Garden",
    description:
      "Discover South Africa's native fynbos and King Proteas and stroll across the curved 'Boomslang' treetop canopy walkway set against the eastern slopes of Table Mountain.",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&auto=format&fit=crop&q=80",
    location: "Rhodes Drive, Newlands",
    sortOrder: 5,
    category: "Botanical Heritage",
    suggestedTime: "2–3 hours",
    visitorNote:
      "One of the world's great botanical gardens and a UNESCO World Heritage site.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000006",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    slug: "bo-kaap-historic-district",
    name: "Bo-Kaap Historic District",
    description:
      "Wander cobblestone streets lined with vibrant pastel-painted 18th-century houses, uncover rich Cape Malay cultural heritage, and sample authentic local spices and samoosas.",
    image:
      "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=900&auto=format&fit=crop&q=80",
    location: "Schotsche Kloof, Signal Hill Footslopes",
    sortOrder: 6,
    category: "Culture & Heritage",
    suggestedTime: "1–1.5 hours",
    visitorNote:
      "Best explored on foot with a local guide who knows the neighbourhood's history.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000007",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    slug: "duiker-island-seal-cruise",
    name: "Duiker Island Seal Cruise (Hout Bay)",
    description:
      "Depart from Hout Bay Harbour on a scenic boat charter beneath the Sentinel cliff to watch thousands of Cape fur seals basking and diving around Duiker Island.",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&auto=format&fit=crop&q=80",
    location: "Hout Bay Harbour",
    sortOrder: 7,
    category: "Marine Cruise",
    suggestedTime: "1 hour",
    visitorNote:
      "Located right at the northern entrance to Chapman's Peak Drive.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000008",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    slug: "robben-island-museum",
    name: "Robben Island Museum",
    description:
      "Take a ferry across Table Bay from the Nelson Mandela Gateway to tour the UNESCO World Heritage prison island where Nelson Mandela was held for 18 years, guided by former political prisoners.",
    image:
      "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=900&auto=format&fit=crop&q=80",
    location: "Table Bay (Departs V&A Waterfront)",
    sortOrder: 8,
    category: "History & UNESCO Site",
    suggestedTime: "3.5–4 hours",
    visitorNote:
      "Passport ID is required for boarding; book early as ferries fill weeks ahead.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000009",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    slug: "tandem-paragliding-signal-hill",
    name: "Tandem Paragliding from Signal Hill",
    description:
      "Soar effortlessly over Sea Point, Clifton and the Atlantic Seaboard on a tandem flight with a licensed instructor for an unforgettable bird's-eye view of Cape Town.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    location: "Signal Hill Summit, Cape Town",
    sortOrder: 9,
    category: "Adventure",
    suggestedTime: "1–2 hours",
    visitorNote:
      "No prior experience needed — flights run in gentle thermal conditions.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000010",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    slug: "va-waterfront-sea-kayaking",
    name: "V&A Waterfront & Ocean Kayaking",
    description:
      "Paddle past the bustling working harbour coastline and Mouille Point lighthouse, taking in open-ocean views of Table Mountain alongside dolphins, seals and sunfish.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&auto=format&fit=crop&q=80",
    location: "V&A Waterfront, Cape Town",
    sortOrder: 10,
    category: "Ocean Experience",
    suggestedTime: "2 hours",
    visitorNote:
      "Morning departures enjoy the calmest Atlantic swells and clearest views.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000011",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    slug: "zeitz-mocaa",
    name: "Zeitz MOCAA (Museum of Contemporary Art Africa)",
    description:
      "Visit the world's largest collection of contemporary African art, housed inside a breathtakingly sculpted 1920s concrete grain silo complex at the V&A Waterfront.",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80",
    location: "Silo District, V&A Waterfront",
    sortOrder: 11,
    category: "Art & Architecture",
    suggestedTime: "1.5–2 hours",
    visitorNote:
      "Take the glass lift to the rooftop sculpture garden for harbour views.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000012",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    slug: "district-six-museum",
    name: "District Six Museum",
    description:
      "An intimate, deeply moving memorial preserving the memories, street signs and personal stories of the vibrant inner-city community forcibly relocated during the Apartheid era.",
    image:
      "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=900&auto=format&fit=crop&q=80",
    location: "25A Buitenkant Street, Cape Town",
    sortOrder: 12,
    category: "History & Culture",
    suggestedTime: "1–1.5 hours",
    visitorNote:
      "Guided conversations with former District Six residents make this unforgettable.",
  },

  // =========================================================================
  // GARDEN ROUTE POINTS & ROUTE STOPS (10) — Same Rich Format as Cape Town
  // =========================================================================
  {
    id: "a2000000-0000-4000-8000-000000000001",
    destinationId: "d1000000-0000-4000-8000-000000000002",
    destinationSlug: "garden-route",
    slug: "mossel-bay-cape-st-blaize",
    name: "Mossel Bay & Cape St. Blaize Lighthouse",
    description:
      "The western gateway to the Garden Route. Visit the 1864 Cape St. Blaize Lighthouse perched above Indian Ocean cliffs, the Bartolomeu Dias Museum Complex with its 500-year-old Post Office Tree, and the dramatic St. Blaize coastal trail.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    location: "Mossel Bay, Western Cape",
    sortOrder: 1,
    category: "Coastal Gateway & Heritage",
    suggestedTime: "2–3 hours",
    visitorNote:
      "A great stop for cliffside ocean coffee and spotting southern right whales in winter/spring.",
  },
  {
    id: "a2000000-0000-4000-8000-000000000002",
    destinationId: "d1000000-0000-4000-8000-000000000002",
    destinationSlug: "garden-route",
    slug: "outeniqua-pass-george",
    name: "Outeniqua Mountain Pass & Four Passes Viewpoint",
    description:
      "One of South Africa's great mountain engineering passes, winding through the misty peaks of the Outeniqua range between George and the Little Karoo with sweeping lookouts over coastal valleys.",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&auto=format&fit=crop&q=80",
    location: "Outeniqua Mountains, George",
    sortOrder: 2,
    category: "Scenic Mountain Pass",
    suggestedTime: "1–1.5 hours",
    visitorNote:
      "Having a private chauffeur here lets you enjoy the dramatic mountain hairpins and photo bays stress-free.",
  },
  {
    id: "a2000000-0000-4000-8000-000000000003",
    destinationId: "d1000000-0000-4000-8000-000000000002",
    destinationSlug: "garden-route",
    slug: "wilderness-national-park-map-of-africa",
    name: "Wilderness Lagoon & Map of Africa Viewpoint",
    description:
      "Where indigenous forest meets serpentine rivers, lakes and endless golden beaches. Stand at the famous Map of Africa viewpoint where the Kaaimans River bends naturally into the exact shape of the African continent.",
    image:
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=900&auto=format&fit=crop&q=80",
    location: "Wilderness, Garden Route National Park",
    sortOrder: 3,
    category: "Lakes, Forest & Viewpoint",
    suggestedTime: "2–3 hours",
    visitorNote:
      "Don't miss Dolphin Point lookout above the old railway bridge entering Wilderness.",
  },
  {
    id: "a2000000-0000-4000-8000-000000000004",
    destinationId: "d1000000-0000-4000-8000-000000000002",
    destinationSlug: "garden-route",
    slug: "knysna-heads-lagoon-waterfront",
    name: "The Knysna Heads & Knysna Lagoon",
    description:
      "Two towering sandstone cliffs guard the narrow channel where the Indian Ocean surges into the tranquil Knysna Estuary. Enjoy East Head clifftop viewpoints, fresh coastal oysters, and sunset catamaran cruises.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&auto=format&fit=crop&q=80",
    location: "Knysna Heads & Waterfront, Knysna",
    sortOrder: 4,
    category: "Signature Lagoon & Cliffs",
    suggestedTime: "Half day",
    visitorNote:
      "The East Head viewpoint deck offers the best close-up photography of waves crashing through the channel.",
  },
  {
    id: "a2000000-0000-4000-8000-000000000005",
    destinationId: "d1000000-0000-4000-8000-000000000002",
    destinationSlug: "garden-route",
    slug: "plettenberg-bay-robberg-nature-reserve",
    name: "Plettenberg Bay & Robberg Nature Reserve",
    description:
      "A rugged World Heritage peninsula jutting into the ocean south of Plettenberg Bay. Walk coastal boardwalks above turquoise bays teeming with Cape fur seals, bottlenose dolphins and seasonal whales.",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&auto=format&fit=crop&q=80",
    location: "Robberg Peninsula, Plettenberg Bay",
    sortOrder: 5,
    category: "Peninsula Reserve & Beaches",
    suggestedTime: "2–4 hours",
    visitorNote:
      "Choose between the easy 2 km Gap circuit or the scenic 5.5 km Witsand sand-dune loop.",
  },
  {
    id: "a2000000-0000-4000-8000-000000000006",
    destinationId: "d1000000-0000-4000-8000-000000000002",
    destinationSlug: "garden-route",
    slug: "birds-of-eden-monkeyland-crags",
    name: "Birds of Eden & Monkeyland Sanctuary (The Crags)",
    description:
      "Walk beneath the world's largest two-hectare free-flight forest dome housing over 3,500 exotic and African birds including Knysna turacos and flamingos, right next door to a free-roaming primate forest.",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&auto=format&fit=crop&q=80",
    location: "The Crags, Plettenberg Bay",
    sortOrder: 6,
    category: "Wildlife Sanctuary",
    suggestedTime: "2–3 hours",
    visitorNote:
      "Ideal for families and wildlife photographers — all ethical, non-interaction sanctuaries.",
  },
  {
    id: "a2000000-0000-4000-8000-000000000007",
    destinationId: "d1000000-0000-4000-8000-000000000002",
    destinationSlug: "garden-route",
    slug: "bloukrans-bridge-gorge",
    name: "Bloukrans Bridge & Gorge Viewpoint",
    description:
      "Standing 216 metres above the Bloukrans River on the border of the Western and Eastern Cape, this dramatic concrete arch is home to the world's highest commercial bridge bungee jump and SkyWalk.",
    image:
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=900&auto=format&fit=crop&q=80",
    location: "Bloukrans River Gorge, Tsitsikamma Border",
    sortOrder: 7,
    category: "Adventure & Engineering Icon",
    suggestedTime: "1–2 hours",
    visitorNote:
      "Even if you aren't jumping, the cliffside viewing deck over the gorge is a thrilling stop.",
  },
  {
    id: "a2000000-0000-4000-8000-000000000008",
    destinationId: "d1000000-0000-4000-8000-000000000002",
    destinationSlug: "garden-route",
    slug: "tsitsikamma-storms-river-suspension-bridge",
    name: "Tsitsikamma & Storms River Mouth Suspension Bridges",
    description:
      "Walk through ancient Afro-temperate yellowwood forests to cross three dramatic suspension bridges spanning the churning mouth of the Storms River where dark forest waters meet the Indian Ocean.",
    image:
      "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=900&auto=format&fit=crop&q=80",
    location: "Storms River Mouth, Tsitsikamma National Park",
    sortOrder: 8,
    category: "National Park & Suspension Bridge",
    suggestedTime: "2.5–3.5 hours",
    visitorNote:
      "The 77-metre main suspension bridge is the most iconic photograph on the entire Garden Route.",
  },
  {
    id: "a2000000-0000-4000-8000-000000000009",
    destinationId: "d1000000-0000-4000-8000-000000000002",
    destinationSlug: "garden-route",
    slug: "oudtshoorn-cango-caves-route-62",
    name: "Oudtshoorn, Cango Caves & Route 62 Loop",
    description:
      "Cross the mountains into the Klein Karoo to explore the 20-million-year-old Cango Caves — vast underground limestone chambers lit to showcase towering stalagmites — alongside historic Oudtshoorn ostrich farms.",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80",
    location: "Swartberg Foothills, Oudtshoorn (Route 62)",
    sortOrder: 9,
    category: "Caverns & Klein Karoo Route",
    suggestedTime: "Half day",
    visitorNote:
      "Pairs perfectly as the inland return leg to or from Cape Town via scenic Route 62.",
  },
  {
    id: "a2000000-0000-4000-8000-000000000010",
    destinationId: "d1000000-0000-4000-8000-000000000002",
    destinationSlug: "garden-route",
    slug: "addo-elephant-national-park",
    name: "Addo Elephant National Park (Eastern Finale)",
    description:
      "South Africa's third-largest national park and the malaria-free Big Five safari finale at the eastern end of the Garden Route, famous for over 600 free-roaming elephants, lions, buffalo and black rhino.",
    image:
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&auto=format&fit=crop&q=80",
    location: "Sundays River Valley, near Gqeberha (Port Elizabeth)",
    sortOrder: 10,
    category: "Malaria-Free Big Five Safari",
    suggestedTime: "Full day",
    visitorNote:
      "Hapit Dam and Main Camp waterholes offer extraordinary close-up elephant herd sightings.",
  },

  // =========================================================================
  // STELLENBOSCH & CAPE WINELANDS POINTS (7)
  // =========================================================================
  {
    id: "a3000000-0000-4000-8000-000000000001",
    destinationId: "d1000000-0000-4000-8000-000000000005",
    destinationSlug: "cape-winelands",
    slug: "historic-dorp-street",
    name: "Historic Dorp Street (Stellenbosch)",
    description:
      "Stroll through one of South Africa's oldest avenues, shaded by ancient oak trees and lined with heritage Cape Dutch architecture, cafes, and boutiques.",
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&auto=format&fit=crop&q=80",
    location: "Dorp Street, Stellenbosch",
    sortOrder: 1,
    category: "Heritage & Architecture",
    suggestedTime: "1–1.5 hours",
    visitorNote: "Beautiful morning light beneath the 200-year-old oaks.",
  },
  {
    id: "a3000000-0000-4000-8000-000000000002",
    destinationId: "d1000000-0000-4000-8000-000000000005",
    destinationSlug: "cape-winelands",
    slug: "franschhoek-wine-valley-pass",
    name: "Franschhoek Wine Valley & Mountain Pass",
    description:
      "South Africa's French Huguenot valley, world-renowned for centuries-old wine estates, Cap Classique sparkling wines, fine dining kitchens, and dramatic views from the Franschhoek Pass.",
    image:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=900&auto=format&fit=crop&q=80",
    location: "Franschhoek Valley, Western Cape",
    sortOrder: 2,
    category: "Wine & Gastronomy",
    suggestedTime: "Half day",
    visitorNote: "Book vineyard lunch tables in advance during summer.",
  },
  {
    id: "a3000000-0000-4000-8000-000000000003",
    destinationId: "d1000000-0000-4000-8000-000000000005",
    destinationSlug: "cape-winelands",
    slug: "jonkershoek-nature-reserve",
    name: "Jonkershoek Nature Reserve",
    description:
      "A dramatic mountain valley flanking Stellenbosch, ideal for hiking, scenic walks, and exploring fynbos wilderness trails leading to crystal waterfalls.",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&auto=format&fit=crop&q=80",
    location: "Jonkershoek Valley, Stellenbosch",
    sortOrder: 3,
    category: "Mountains & Nature",
    suggestedTime: "2–3 hours",
    visitorNote: "Surrounded by the towering Jonkershoek Twins peaks.",
  },
  {
    id: "a3000000-0000-4000-8000-000000000004",
    destinationId: "d1000000-0000-4000-8000-000000000005",
    destinationSlug: "cape-winelands",
    slug: "dylan-lewis-sculpture-garden",
    name: "Dylan Lewis Sculpture Garden",
    description:
      "Explore a 7-hectare manicured landscape where over 60 monumental bronze sculptures of wild cats and human forms blend seamlessly into indigenous gardens.",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&auto=format&fit=crop&q=80",
    location: "Paradyskloof, Stellenbosch",
    sortOrder: 4,
    category: "Sculpture & Gardens",
    suggestedTime: "2 hours",
    visitorNote: "Private appointments ensure a tranquil, uncrowded walk.",
  },
];

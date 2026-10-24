import type { TourPackage } from "@/lib/types";

/**
 * Lavish Travels & Tours — Curated Tour Packages.
 * All prices removed in favour of bespoke quotes via 24/7 WhatsApp concierge.
 */
export const tourPackages: TourPackage[] = [
  // =========================================================================
  // 🏆 BEST PACKAGE TO SELL TO INTERNATIONAL CLIENTS
  // =========================================================================
  {
    id: "p1000000-0000-4000-8000-000000000010",
    slug: "4-day-cape-town-ultimate-experience",
    title: "4-Day Cape Town Ultimate Experience",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    category: "multi_day",
    durationDays: 4,
    groupMin: 1,
    groupMax: 8,
    priceFromZar: 0,
    summary:
      "The premier 4-day private itinerary recommended for international visitors. Day 1: City & Table Mountain; Day 2: Peninsula & Penguins; Day 3: Winelands & Franschhoek; Day 4: Big Five Safari. (Optional 5th Day: Hermanus Whale Watching / Garden Route).",
    inclusions: [
      "Private luxury vehicle with dedicated professional driver-guide throughout",
      "Daily hotel pickup and drop-off in Cape Town & Atlantic Seaboard",
      "Chapman's Peak scenic toll drive",
      "Wine tastings at 2-3 premier estates across Stellenbosch & Franschhoek",
      "Open-vehicle Big Five game drive at private safari reserve with reserve ranger",
      "Full buffet lunch at the safari reserve",
      "Chilled bottled water and on-board Wi-Fi",
      "Flexible timings customized around your pace",
    ],
    exclusions: [
      "Table Mountain Cableway ticket (weather dependent — booked at cost or at gate)",
      "Cape Point Nature Reserve & Boulders Beach penguin conservation entry fees",
      "Lunches on Days 1, 2, and 3",
      "Optional 5th day Hermanus extension",
      "Gratuities",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&auto=format&fit=crop&q=80",
    ],
    difficulty: "easy",
    isFeatured: true,
    isPublished: true,
    seoTitle: "4-Day Cape Town Ultimate Private Tour Experience",
    seoDescription:
      "The complete 4-day Cape Town private tour: Table Mountain, Cape Peninsula penguins, Stellenbosch winelands, and Big Five safari.",
    departsFrom: ["Cape Town", "V&A Waterfront", "Camps Bay"],
    itinerary: [
      {
        id: "i-4d-1",
        packageId: "p1000000-0000-4000-8000-000000000010",
        dayNumber: 1,
        title: "Day 1 — 🏙️ Cape Town City & Table Mountain",
        description:
          "Ascend Table Mountain via the rotating cableway, wander the vibrant pastel houses of Bo-Kaap, explore the historic Company's Garden and Castle of Good Hope, take in panoramic ocean views from Signal Hill, and end along the bustling V&A Waterfront.",
        overnightLocation: "Cape Town",
        meals: [],
      },
      {
        id: "i-4d-2",
        packageId: "p1000000-0000-4000-8000-000000000010",
        dayNumber: 2,
        title: "Day 2 — 🌊 Cape Peninsula & Cape Point",
        description:
          "Drive the world-famous Chapman's Peak Drive through Hout Bay to the wild Cape of Good Hope and Cape Point Old Lighthouse. Walk alongside the African Penguin Colony at Boulders Beach, followed by historic Simon's Town, Kalk Bay and Muizenberg.",
        overnightLocation: "Cape Town",
        meals: [],
      },
      {
        id: "i-4d-3",
        packageId: "p1000000-0000-4000-8000-000000000010",
        dayNumber: 3,
        title: "Day 3 — 🍷 Cape Winelands (Stellenbosch & Franschhoek)",
        description:
          "Traverse the oak-shaded avenues of historic Stellenbosch, experience cellar tours and private wine tastings, cross over the dramatic Franschhoek Pass, and savour gourmet lunch and wine tram options in the French culinary capital of South Africa.",
        overnightLocation: "Cape Town",
        meals: [],
      },
      {
        id: "i-4d-4",
        packageId: "p1000000-0000-4000-8000-000000000010",
        dayNumber: 4,
        title: "Day 4 — 🦁 Big Five Safari Day Trip",
        description:
          "Depart early for a premier private game reserve. Welcome drinks on arrival, followed by an exhilarating 2 to 3-hour open-vehicle game drive tracking lion, elephant, rhino, buffalo, and cheetah with a ranger. Enjoy a full reserve buffet lunch before your scenic return to Cape Town.",
        overnightLocation: "Cape Town",
        meals: ["lunch"],
      },
    ],
    faqs: [
      {
        question: "Can we add an optional 5th day?",
        answer:
          "Yes! We offer an optional 5th day covering Hermanus Whale Watching (seasonal) or a coastal Garden Route taster, as well as Kirstenbosch Botanical Gardens.",
      },
      {
        question: "Is this package fully private?",
        answer:
          "Yes. Your vehicle, chauffeur-guide, and itinerary pacing are 100% private and reserved exclusively for your party.",
      },
      {
        question: "How do we book and get a quotation?",
        answer:
          "Tap the WhatsApp button on this page to chat with our booking concierge. We confirm vehicle class, dates, and group specifics in minutes.",
      },
    ],
    whatToPack: [
      "Comfortable walking shoes for Table Mountain and Cape Point",
      "Light jacket / windbreaker for coastal drives and sunset lookouts",
      "Sun protection (sunscreen, sunglasses, wide-brim hat)",
      "Camera or smartphone with zoom for wildlife and penguin photography",
    ],
  },

  // =========================================================================
  // 1. 🏙️ CAPE TOWN CITY & TABLE MOUNTAIN TOUR
  // =========================================================================
  {
    id: "p1000000-0000-4000-8000-000000000002",
    slug: "cape-town-city-table-mountain",
    title: "Cape Town City & Table Mountain Tour",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    category: "day_tour",
    durationDays: 1,
    groupMin: 1,
    groupMax: 8,
    priceFromZar: 0,
    summary:
      "Table Mountain, Bo-Kaap and the City Bowl are among the core Cape Town sightseeing experiences. Explore Table Mountain Cableway, colourful Bo-Kaap, Company's Garden, Castle of Good Hope, Signal Hill, Clifton, Camps Bay and the V&A Waterfront.",
    inclusions: [
      "Private luxury vehicle with professional driver-guide",
      "Hotel pickup and drop-off in Cape Town & Atlantic Seaboard",
      "Guided walking tour through colourful Bo-Kaap",
      "Visit to Company's Garden & Greenmarket Square",
      "Photo stop at Castle of Good Hope and Parliament buildings",
      "Scenic coastal drive through Clifton and Camps Bay",
      "Signal Hill viewpoint stop",
      "Bottled water and on-board Wi-Fi",
    ],
    exclusions: [
      "Table Mountain Cableway ticket (can be booked in advance or at gate)",
      "Lunch and personal refreshments",
      "Optional harbour cruise / Waterfront activities",
      "Optional Robben Island ferry ticket",
      "Gratuities",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=1200&auto=format&fit=crop&q=80",
    ],
    difficulty: "easy",
    isFeatured: true,
    isPublished: true,
    seoTitle: "Cape Town City & Table Mountain Tour | Full Day & Half Day",
    seoDescription:
      "Private Cape Town city tour featuring Table Mountain Cableway, Bo-Kaap, Company's Garden, Castle of Good Hope, Signal Hill and V&A Waterfront.",
    departsFrom: ["Cape Town", "V&A Waterfront", "Camps Bay", "Sea Point"],
    itinerary: [
      {
        id: "i-ct-1",
        packageId: "p1000000-0000-4000-8000-000000000002",
        dayNumber: 1,
        title: "Table Mountain, Bo-Kaap, City Bowl & Atlantic Coast",
        description:
          "Start early at the Lower Table Mountain Cableway for breathtaking 360-degree summit views. Descend into the vibrant Malay Quarter of Bo-Kaap with its candy-coloured heritage homes. Stroll the historic tree-lined avenues of the Company's Garden, view the Castle of Good Hope and Parliament, browse Greenmarket Square, and wind past the luxury beaches of Clifton and Camps Bay before concluding at the V&A Waterfront.",
        overnightLocation: null,
        meals: [],
      },
    ],
    faqs: [
      {
        question: "What happens if Table Mountain Cableway is closed due to wind?",
        answer:
          "If the cableway is temporarily closed for wind or cloud cover, your guide will rearrange the sequence of stops (visiting Signal Hill or Kirstenbosch first) and monitor conditions so you can ascend as soon as it clears.",
      },
      {
        question: "Is this available as both Full Day and Half Day?",
        answer:
          "Yes! We tailor the itinerary to either a relaxed 8-hour Full Day or an efficient 4.5-hour Half Day tour depending on your schedule.",
      },
      {
        question: "Can we include a Sunset at Signal Hill or Harbour Cruise?",
        answer:
          "Absolutely. Signal Hill sunset champagne stops and V&A Waterfront harbour cruises are popular add-ons easily coordinated with your driver.",
      },
    ],
    whatToPack: [
      "Warm layer or windbreaker (the top of Table Mountain can be cooler and windy)",
      "Comfortable flat walking shoes for cobblestone Bo-Kaap streets",
      "Camera or phone for iconic Table Mountain and pastel house photography",
    ],
  },

  // =========================================================================
  // 2. 🌊 CAPE PENINSULA / CAPE POINT TOUR
  // =========================================================================
  {
    id: "p1000000-0000-4000-8000-000000000001",
    slug: "cape-peninsula-cape-point",
    title: "Cape Peninsula / Cape Point Tour",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    category: "day_tour",
    durationDays: 1,
    groupMin: 1,
    groupMax: 8,
    priceFromZar: 0,
    summary:
      "Cape Point tours commonly combine the Cape of Good Hope, Cape Point, Boulders Beach penguins and scenic coastal routes such as Chapman's Peak Drive. Includes Clifton, Camps Bay, Hout Bay, Simon's Town, Kalk Bay and Muizenberg.",
    inclusions: [
      "Private luxury vehicle with professional driver-guide",
      "Hotel pickup and drop-off in Cape Town",
      "Clifton & Camps Bay scenic drive",
      "Hout Bay Harbour visit (optional Seal Island boat trip stop)",
      "Chapman's Peak Drive toll fees included",
      "Noordhoek & coastal lookout stops",
      "Cape Point & Cape of Good Hope Nature Reserve exploration",
      "Visit to the Old Lighthouse viewpoint",
      "Boulders Beach African Penguin Colony stop",
      "Simon's Town, Kalk Bay & Muizenberg colourful beach huts route",
    ],
    exclusions: [
      "Cape Point conservation entry fee (shown separately in quote; subject to annual adjustments)",
      "Boulders Beach penguin conservation entry fee (shown separately in quote)",
      "Flying Dutchman Funicular ticket (optional)",
      "Seal Island boat trip ticket (optional)",
      "Lunch and drinks",
      "Gratuities",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=1200&auto=format&fit=crop&q=80",
    ],
    difficulty: "easy",
    isFeatured: true,
    isPublished: true,
    seoTitle: "Cape Peninsula & Cape Point Private Day Tour",
    seoDescription:
      "Full-day Cape Peninsula tour — Chapman's Peak Drive, Cape Point, Cape of Good Hope, Boulders Beach penguins and Simon's Town.",
    departsFrom: ["Cape Town", "Camps Bay", "V&A Waterfront", "Hout Bay"],
    itinerary: [
      {
        id: "i-cp-1",
        packageId: "p1000000-0000-4000-8000-000000000001",
        dayNumber: 1,
        title: "Atlantic Coast, Chapman's Peak, Cape Point & Penguins (8–10 Hours)",
        description:
          "Depart along the Atlantic Seaboard through Clifton and Camps Bay to Hout Bay harbour. Drive over the engineering marvel of Chapman's Peak Drive with sheer drops into the roaring ocean. Enter the Cape of Good Hope Nature Reserve and reach Cape Point's dramatic cliffs and historic lighthouse. Afterwards, walk the boardwalks at Boulders Beach among wild African penguins, before cruising back via historic Simon's Town naval base, Kalk Bay fishing village and Muizenberg's colourful beach huts.",
        overnightLocation: null,
        meals: [],
      },
    ],
    faqs: [
      {
        question: "Why are Cape Point and Boulders Beach entry fees separate?",
        answer:
          "SANParks and CapeNature conservation fees differ for international visitors vs South African residents, and are subject to official annual government updates. We detail them transparently on your quotation.",
      },
      {
        question: "Can we do the Seal Island boat trip?",
        answer:
          "Yes, we can include a 45-minute boat excursion from Hout Bay to Duiker Island to watch thousands of Cape Fur Seals in their natural marine habitat.",
      },
    ],
    whatToPack: [
      "Windproof jacket for the Cape of Good Hope coastline",
      "Comfortable walking shoes with good grip",
      "Sun protection and camera for penguin close-ups",
    ],
  },

  // =========================================================================
  // 3. 🍷 CAPE WINELANDS TOUR
  // =========================================================================
  {
    id: "p1000000-0000-4000-8000-000000000003",
    slug: "cape-winelands-tour",
    title: "Cape Winelands Tour (Stellenbosch & Franschhoek)",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    category: "wine",
    durationDays: 1,
    groupMin: 1,
    groupMax: 8,
    priceFromZar: 0,
    summary:
      "Stellenbosch is one of South Africa's major wine destinations, while Franschhoek is known for its vineyards, mountain scenery and Wine Tram experience. Choose between our Classic Wine Tour or Premium Luxury Wine Tour.",
    inclusions: [
      "Private luxury vehicle with dedicated driver so nobody has to count tastings",
      "Hotel pickup and return to Cape Town",
      "Historic Stellenbosch town walk & Cape Dutch architecture",
      "Visits to premier wine estates across Stellenbosch & Franschhoek valleys",
      "Guided wine tastings of award-winning Chenin Blanc, Pinotage, Cabernet & MCC",
      "Franschhoek village & Franschhoek Pass mountain viewpoint",
      "Optional Wine Tram experience coordination",
      "Bottled water on board",
    ],
    exclusions: [
      "Lunch (we reserve your table at a top vineyard restaurant of your choice)",
      "Wine purchases and international shipping fees",
      "Optional cheese, chocolate, or biltong pairings",
      "Franschhoek Wine Tram tickets (optional add-on)",
      "Gratuities",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&auto=format&fit=crop&q=80",
    ],
    difficulty: "easy",
    isFeatured: true,
    isPublished: true,
    seoTitle: "Cape Winelands Private Tour | Stellenbosch & Franschhoek",
    seoDescription:
      "Private full-day Cape Winelands tour to Stellenbosch and Franschhoek. Wine tastings, cellar tours, gourmet food pairings and Wine Tram options.",
    departsFrom: ["Cape Town", "Stellenbosch", "Franschhoek"],
    itinerary: [
      {
        id: "i-cw-1",
        packageId: "p1000000-0000-4000-8000-000000000003",
        dayNumber: 1,
        title: "Stellenbosch & Franschhoek Valleys (8–9 Hours)",
        description:
          "Depart Cape Town for Stellenbosch. Wander historic Dorp Street lined with ancient oak trees. Visit prestigious estates for private tastings and cellar visits. Cross the Helshoogte Pass into Franschhoek for a gourmet vineyard lunch, village boutiques, or hop aboard the open-air Franschhoek Wine Tram, with an optional Paarl extension.",
        overnightLocation: null,
        meals: [],
      },
    ],
    faqs: [
      {
        question: "What is the difference between Classic and Premium?",
        answer:
          "Classic Wine Tour covers 2–3 renowned estates with curated tastings and scenic drive. Premium Wine Tour adds private reserve cellar master tours, specialized food pairings, luxury vehicle upgrade, and priority reservations at Michelin-level estate kitchens.",
      },
      {
        question: "Can we buy wine and ship it overseas?",
        answer:
          "Yes! Most estates offer worldwide consolidated shipping to the UK, USA, Europe, and Asia. Your driver-guide handles the logistics directly at the cellar.",
      },
    ],
    whatToPack: [
      "Smart-casual attire suitable for fine-dining vineyard settings",
      "Light jacket for underground cellar tours which stay chilled year-round",
      "Sunglasses and camera for sweeping vineyard & mountain panoramas",
    ],
  },

  // =========================================================================
  // 4. 🦁 CAPE TOWN SAFARI / BIG FIVE SAFARI
  // =========================================================================
  {
    id: "p1000000-0000-4000-8000-000000000004",
    slug: "cape-town-safari-big-five",
    title: "Cape Town Safari / Big Five Safari",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    category: "safari",
    durationDays: 1,
    groupMin: 1,
    groupMax: 8,
    priceFromZar: 0,
    summary:
      "Experience Africa's legendary Big Five within convenient reach of Cape Town. Available as a full-day safari day trip or an immersive 2-Day / 1-Night luxury safari lodge experience tracking lion, elephant, rhino, buffalo and cheetah.",
    inclusions: [
      "Private luxury transfer between Cape Town and the private game reserve",
      "Welcome refreshments and orientation on arrival",
      "2.5 to 3-hour guided game drive in an open 4x4 safari vehicle",
      "Experienced registered field ranger & wildlife tracker",
      "Buffet lunch at the private safari lodge",
      "Opportunities to spot lion, elephant, rhino, buffalo, giraffe, and cheetah",
      "On-board vehicle refreshments and Wi-Fi",
    ],
    exclusions: [
      "Overnight accommodation (included on 2-Day Option B)",
      "Alcoholic beverages and premium cellar drinks",
      "Gratuities for rangers and safari staff",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=1200&auto=format&fit=crop&q=80",
    ],
    difficulty: "easy",
    isFeatured: true,
    isPublished: true,
    seoTitle: "Cape Town Big Five Safari Tour | Day Trip & Overnight Lodge",
    seoDescription:
      "Big Five safari experience from Cape Town. Open-vehicle 4x4 game drives, lions, elephants, rhinos and luxury lodge lunch. Day trip or 2-day overnight.",
    departsFrom: ["Cape Town", "V&A Waterfront", "Camps Bay"],
    itinerary: [
      {
        id: "i-cts-1",
        packageId: "p1000000-0000-4000-8000-000000000004",
        dayNumber: 1,
        title: "Option A (Day Trip) or Day 1 of Option B (Overnight)",
        description:
          "Scenic early morning transfer through the Hex River Valley to the private game reserve. Board an open safari 4x4 with a seasoned ranger to track free-roaming wildlife. Enjoy a traditional South African buffet lunch. Day-trip guests return by late afternoon; overnight guests enjoy an evening sundowner game drive and lodge dinner under the African stars.",
        overnightLocation: "Private Safari Lodge (Option B)",
        meals: ["lunch"],
      },
      {
        id: "i-cts-2",
        packageId: "p1000000-0000-4000-8000-000000000004",
        dayNumber: 2,
        title: "Day 2 of Option B — Sunrise Game Drive & Return",
        description:
          "Dawn wake-up call for an early morning game drive when predators are most active. Return to the lodge for a hearty breakfast, check out, and enjoy a relaxed private transfer back to Cape Town.",
        overnightLocation: null,
        meals: ["breakfast"],
      },
    ],
    faqs: [
      {
        question: "Are we guaranteed to see all of the Big Five?",
        answer:
          "Private reserves have excellent track records for lion, elephant, rhino, and buffalo. Leopards are naturally elusive nocturnal animals, so sightings can never be 100% guaranteed, but guides maximize every opportunity.",
      },
      {
        question: "Is this malaria-free?",
        answer:
          "Yes! Western Cape safari reserves are 100% malaria-free, making them safe for families with young children and seniors.",
      },
    ],
    whatToPack: [
      "Neutral-coloured clothing (khaki, beige, olive green)",
      "Warm fleece jacket or scarf for chilly open-vehicle morning drives",
      "Camera with telephoto lens or smartphone zoom",
      "Binoculars and sunglasses",
    ],
  },

  // =========================================================================
  // 5. 🐋 HERMANUS WHALE WATCHING TOUR
  // =========================================================================
  {
    id: "p1000000-0000-4000-8000-000000000005",
    slug: "hermanus-whale-watching",
    title: "Hermanus Whale Watching Tour",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    category: "day_tour",
    durationDays: 1,
    groupMin: 1,
    groupMax: 8,
    priceFromZar: 0,
    summary:
      "A scenic coastal drive to Hermanus, recognized worldwide as the premier land-based whale watching capital. Walk the famed Cliff Path, explore the Old Harbour, or take an optional boat-based whale excursion.",
    inclusions: [
      "Private vehicle with dedicated chauffeur-guide",
      "Hotel pickup and drop-off in Cape Town",
      "Spectacular Clarence Drive coastal route via Gordon's Bay & Betty's Bay",
      "Visit to Stony Point penguin colony in Betty's Bay",
      "Guided walk along the 12km Hermanus Cliff Path lookouts",
      "Time to explore Hermanus town centre, galleries & craft markets",
      "Bottled water on board",
    ],
    exclusions: [
      "Optional boat-based whale watching catamaran ticket",
      "Stony Point penguin reserve entry fee",
      "Lunch at Hermanus harbour",
      "Gratuities",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&auto=format&fit=crop&q=80",
    ],
    difficulty: "easy",
    isFeatured: false,
    isPublished: true,
    seoTitle: "Hermanus Whale Watching Private Tour from Cape Town",
    seoDescription:
      "Private day tour from Cape Town to Hermanus. Land-based and boat-based whale watching, scenic Clarence Drive, Cliff Path and coastal villages.",
    departsFrom: ["Cape Town", "V&A Waterfront", "Camps Bay"],
    itinerary: [
      {
        id: "i-hww-1",
        packageId: "p1000000-0000-4000-8000-000000000005",
        dayNumber: 1,
        title: "Clarence Drive, Hermanus Cliff Path & Whales (Full Day)",
        description:
          "Depart along scenic Clarence Drive hugging False Bay cliffs. Arrive in Hermanus to view Southern Right whales breaching close to the cliff edges. Enjoy seaside lunch overlooking Walker Bay. Optional 2-hour boat cruise gets you within metres of these gentle ocean giants. Return through the apple orchards of the Elgin Valley.",
        overnightLocation: null,
        meals: [],
      },
    ],
    faqs: [
      {
        question: "When is the whale watching season?",
        answer:
          "Southern Right whales visit Hermanus between June and November to mate and calve, with peak sightings from August to October.",
      },
    ],
    whatToPack: [
      "Warm windbreaker jacket for coastal paths",
      "Binoculars for long-range breaching sightings",
      "Camera with telephoto lens",
    ],
  },

  // =========================================================================
  // 6. 🌅 SUNSET TOUR
  // =========================================================================
  {
    id: "p1000000-0000-4000-8000-000000000006",
    slug: "cape-town-sunset-tour",
    title: "Cape Town Sunset & Scenic Drive",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    category: "day_tour",
    durationDays: 1,
    groupMin: 1,
    groupMax: 8,
    priceFromZar: 0,
    summary:
      "Golden hour along the Atlantic Seaboard. Take in Camps Bay, Clifton, and the summit of Signal Hill for breathtaking panoramic sunset photography over the ocean with an optional champagne toast.",
    inclusions: [
      "Private luxury chauffeur-driven vehicle",
      "Hotel pickup in Cape Town / Atlantic Seaboard",
      "Scenic golden-hour cruise through Clifton & Camps Bay",
      "Signal Hill lookout for 360-degree ocean and Table Mountain views",
      "Complimentary chilled sparkling wine or non-alcoholic refreshments",
      "Photography stops at prime panoramic points",
    ],
    exclusions: ["Dinner reservations / personal bar tabs", "Gratuities"],
    gallery: [
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&auto=format&fit=crop&q=80",
    ],
    difficulty: "easy",
    isFeatured: false,
    isPublished: true,
    seoTitle: "Cape Town Sunset Scenic Tour | Signal Hill & Camps Bay",
    seoDescription:
      "Private sunset tour in Cape Town. Camps Bay, Clifton, Signal Hill panoramic photography and champagne at golden hour.",
    departsFrom: ["Cape Town", "Camps Bay", "V&A Waterfront"],
    itinerary: [
      {
        id: "i-sst-1",
        packageId: "p1000000-0000-4000-8000-000000000006",
        dayNumber: 1,
        title: "Golden Hour Along the Atlantic Coastline (3–4 Hours)",
        description:
          "Pick up in the late afternoon. Cruise the Atlantic Seaboard through Sea Point, Clifton and Camps Bay. Ascend Signal Hill to watch the sun sink below the Atlantic horizon while the city lights begin to glow across Table Bay.",
        overnightLocation: null,
        meals: [],
      },
    ],
    faqs: [
      {
        question: "Can we be dropped off at a restaurant afterwards?",
        answer:
          "Yes! Your chauffeur will happily drop you off at any Camps Bay or V&A Waterfront restaurant following the sunset.",
      },
    ],
    whatToPack: ["Warm evening layer (ocean breezes pick up after sunset)", "Camera / smartphone"],
  },

  // =========================================================================
  // 7. 🚤 WATERFRONT & OCEAN EXPERIENCES
  // =========================================================================
  {
    id: "p1000000-0000-4000-8000-000000000007",
    slug: "waterfront-ocean-experiences",
    title: "V&A Waterfront & Ocean Experiences",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    category: "adventure",
    durationDays: 1,
    groupMin: 1,
    groupMax: 8,
    priceFromZar: 0,
    summary:
      "Cape Town's bustling working harbour and ocean playground. Enjoy harbour cruises, sunset catamaran sailing, marine wildlife spotting, premier shopping, and waterfront dining.",
    inclusions: [
      "Private chauffeur transfers to and from the V&A Waterfront",
      "V&A Waterfront orientation & insider recommendations",
      "Assistance with boat charter and catamaran bookings",
      "Time for designer shopping and craft market exploration",
    ],
    exclusions: [
      "Specific boat tour tickets (harbour cruise or sunset catamaran)",
      "Meals, drinks and shopping expenses",
      "Gratuities",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&auto=format&fit=crop&q=80",
    ],
    difficulty: "easy",
    isFeatured: false,
    isPublished: true,
    seoTitle: "V&A Waterfront & Ocean Cruises Experience | Cape Town",
    seoDescription:
      "Explore the V&A Waterfront with private transfers. Harbour cruises, catamaran sailing, marine life and world-class dining.",
    departsFrom: ["Cape Town", "Atlantic Seaboard"],
    itinerary: [
      {
        id: "i-woe-1",
        packageId: "p1000000-0000-4000-8000-000000000007",
        dayNumber: 1,
        title: "Harbour Sailing, Seal Spotting & Waterfront Dining",
        description:
          "Private transfer to the Victoria & Alfred Waterfront. Embark on a luxury catamaran cruise into Table Bay to spot seals, dolphins, and seasonal whales against Table Mountain. Explore designer boutiques, the Watershed craft market, and fine waterside dining.",
        overnightLocation: null,
        meals: [],
      },
    ],
    faqs: [
      {
        question: "Can this be booked as a private yacht charter?",
        answer:
          "Yes! We coordinate private motor yachts and catamarans for private parties, corporate events, and romantic sunset cruises.",
      },
    ],
    whatToPack: ["Deck shoes or sneakers", "Sunscreen and light jacket for the water"],
  },

  // =========================================================================
  // 8. 🏝️ ROBBEN ISLAND
  // =========================================================================
  {
    id: "p1000000-0000-4000-8000-000000000008",
    slug: "robben-island-tour",
    title: "Robben Island & Mandela Heritage Tour",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    category: "cultural",
    durationDays: 1,
    groupMin: 1,
    groupMax: 8,
    priceFromZar: 0,
    summary:
      "A profound journey through South African history. Ferry transfer from the Nelson Mandela Gateway at the V&A Waterfront to the Robben Island Museum, where former political prisoners guide you through Nelson Mandela's cell.",
    inclusions: [
      "Private hotel pickup and return transfer to the Nelson Mandela Gateway",
      "Coordination of official Robben Island ferry tickets",
      "Scenic ferry crossing across Table Bay with mountain views",
      "Guided bus tour of the island and historic Lime Quarry",
      "Prison tour guided by a former political prisoner",
      "View of Nelson Mandela's Maximum Security cell",
    ],
    exclusions: ["Meals and personal souvenirs", "Gratuities"],
    gallery: [
      "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&auto=format&fit=crop&q=80",
    ],
    difficulty: "easy",
    isFeatured: false,
    isPublished: true,
    seoTitle: "Robben Island Tour & Nelson Mandela Prison Visit",
    seoDescription:
      "Visit Robben Island Museum with private Cape Town transfers. Ferry tickets, guided prison tour, and Nelson Mandela's cell.",
    departsFrom: ["Cape Town", "V&A Waterfront"],
    itinerary: [
      {
        id: "i-ri-1",
        packageId: "p1000000-0000-4000-8000-000000000008",
        dayNumber: 1,
        title: "Nelson Mandela Gateway & Robben Island (3.5–4 Hours)",
        description:
          "Private chauffeur transfer to the Nelson Mandela Gateway. Board the passenger ferry for a 30-minute crossing to Robben Island. Board the island bus tour to view Robert Sobukwe's house, the limestone quarry, and wartime fortifications. Walk through the prison blocks led by a former political prisoner, concluding inside Cell 5 where Nelson Mandela spent 18 of his 27 years incarcerated.",
        overnightLocation: null,
        meals: [],
      },
    ],
    faqs: [
      {
        question: "Do tickets need to be booked well in advance?",
        answer:
          "Yes! Robben Island tickets sell out weeks in advance during high season. We strongly advise booking your tour date early.",
      },
    ],
    whatToPack: ["Original Passport / ID (required by port authorities)", "Warm layer for the ferry"],
  },

  // =========================================================================
  // 9. 🌊 WEST COAST TOUR
  // =========================================================================
  {
    id: "p1000000-0000-4000-8000-000000000009",
    slug: "west-coast-tour",
    title: "West Coast & Wildflowers Tour",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    category: "day_tour",
    durationDays: 1,
    groupMin: 1,
    groupMax: 8,
    priceFromZar: 0,
    summary:
      "Iconic postcard views of Table Mountain from Bloubergstrand, sweeping West Coast scenery, seasonal carpets of wildflowers (August–September), and tranquil fishing villages along the Langebaan lagoon.",
    inclusions: [
      "Private luxury vehicle with professional driver-guide",
      "Hotel pickup and drop-off in Cape Town",
      "Bloubergstrand postcard Table Mountain photography stop",
      "West Coast National Park scenic drive & lagoon views",
      "Seasonal Postberg Wildflower Reserve access (August & September)",
      "Visit to traditional fishing villages such as Paternoster",
      "Bottled water on board",
    ],
    exclusions: [
      "West Coast National Park conservation entry fee",
      "Seafood lunch at Langebaan or Paternoster",
      "Gratuities",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200&auto=format&fit=crop&q=80",
    ],
    difficulty: "easy",
    isFeatured: false,
    isPublished: true,
    seoTitle: "West Coast & Wildflowers Tour from Cape Town",
    seoDescription:
      "Private day tour from Cape Town to the West Coast. Bloubergstrand views, seasonal wildflowers, Langebaan lagoon and fresh seafood.",
    departsFrom: ["Cape Town", "V&A Waterfront"],
    itinerary: [
      {
        id: "i-wct-1",
        packageId: "p1000000-0000-4000-8000-000000000009",
        dayNumber: 1,
        title: "Bloubergstrand, West Coast National Park & Langebaan",
        description:
          "Depart north to Bloubergstrand for the iconic panoramic photograph of Table Mountain across the bay. Travel along the coast into the West Coast National Park, surrounding the azure waters of Langebaan Lagoon. During spring (August–September), witness millions of wildflowers carpeting the landscape. Savor lunch at an open-air coastal seafood restaurant before returning.",
        overnightLocation: null,
        meals: [],
      },
    ],
    faqs: [
      {
        question: "When is the wildflower season?",
        answer:
          "The flower season peaks from early August to late September following winter rains.",
      },
    ],
    whatToPack: ["Camera with macro and landscape lenses", "Sun hat and comfortable walking shoes"],
  },

  // =========================================================================
  // 10. 🌿 KIRSTENBOSCH HIGHLIGHTS
  // =========================================================================
  {
    id: "p1000000-0000-4000-8000-000000000011",
    slug: "kirstenbosch-botanical-highlights",
    title: "Kirstenbosch Botanical Gardens & Canopy Walk",
    destinationId: "d1000000-0000-4000-8000-000000000001",
    destinationSlug: "cape-town",
    category: "day_tour",
    durationDays: 1,
    groupMin: 1,
    groupMax: 8,
    priceFromZar: 0,
    summary:
      "World-renowned botanical gardens set against the dramatic eastern slopes of Table Mountain. Stroll through indigenous fynbos, walk the Boomslang Treetop Canopy Walkway, and admire ancient cycads.",
    inclusions: [
      "Private vehicle transfer and driver-guide service",
      "Hotel pickup and drop-off in Cape Town",
      "Guided walk of the world-famous Kirstenbosch National Botanical Garden",
      "Experience the Boomslang Treetop Canopy Walkway",
      "Exploration of indigenous Cape Floral Kingdom fynbos and proteas",
      "Stop at the garden tea room or Moyo restaurant (optional refreshment)",
      "Bottled water on board",
    ],
    exclusions: [
      "Kirstenbosch garden admission ticket (paid at entrance)",
      "Café refreshments or lunch",
      "Gratuities",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop&q=80",
    ],
    difficulty: "easy",
    isFeatured: false,
    isPublished: true,
    seoTitle: "Kirstenbosch Botanical Gardens Private Tour | Cape Town",
    seoDescription:
      "Private tour of Kirstenbosch Botanical Gardens: Boomslang Canopy Walkway, proteas, indigenous flora and dramatic Table Mountain backdrop.",
    departsFrom: ["Cape Town", "V&A Waterfront", "Camps Bay"],
    itinerary: [
      {
        id: "i-kbh-1",
        packageId: "p1000000-0000-4000-8000-000000000011",
        dayNumber: 1,
        title: "Indigenous Flora, Proteas & Boomslang Canopy Walk",
        description:
          "Enjoy a scenic drive around the back of Table Mountain to Kirstenbosch, recognized as one of the great botanical gardens of the world. Stroll paved paths surrounded by King Proteas, cycads, and fynbos. Step onto the curved Boomslang (Tree Snake) elevated walkway for panoramic views above the forest canopy.",
        overnightLocation: null,
        meals: [],
      },
    ],
    faqs: [
      {
        question: "Can Kirstenbosch be combined with the Winelands or Peninsula?",
        answer:
          "Yes! Due to its location in Newlands/Constantia, it pairs seamlessly with Constantia wine estates or an extended Peninsula day.",
      },
    ],
    whatToPack: ["Comfortable walking shoes", "Sun hat and sunglasses"],
  },

  // =========================================================================
  // ADDITIONAL ICONIC SOUTHERN AFRICAN TOURS
  // =========================================================================
  {
    id: "p1000000-0000-4000-8000-000000000012",
    slug: "4-day-kruger-big-five-safari",
    title: "4-Day Kruger Big Five Safari Package",
    destinationId: "d1000000-0000-4000-8000-000000000003",
    destinationSlug: "kruger-national-park",
    category: "safari",
    durationDays: 4,
    groupMin: 2,
    groupMax: 8,
    priceFromZar: 0,
    summary:
      "Two million hectares of Big Five wilderness. Three nights at a luxury safari lodge with daily dawn and dusk open-vehicle game drives, bush walks, and expert rangers.",
    inclusions: [
      "Return private transfers between Johannesburg (O.R. Tambo) and Kruger",
      "Three nights in a luxury safari lodge on a private concession",
      "Daily breakfast, lunch, and dinner prepared by lodge chefs",
      "Six open-vehicle game drives with registered rangers and trackers",
      "Guided bush walk",
      "All Kruger conservation and park entrance fees",
    ],
    exclusions: ["Flights", "Premium cellar drinks", "Gratuities"],
    gallery: [
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=1200&auto=format&fit=crop&q=80",
    ],
    difficulty: "easy",
    isFeatured: true,
    isPublished: true,
    seoTitle: "4-Day Kruger National Park Luxury Safari Package",
    seoDescription:
      "Four-day private luxury Kruger safari: open-vehicle Big Five game drives, safari lodge accommodation, all meals and transfers.",
    departsFrom: ["Johannesburg", "O.R. Tambo Airport", "Nelspruit"],
    itinerary: [
      {
        id: "i-k4-1",
        packageId: "p1000000-0000-4000-8000-000000000012",
        dayNumber: 1,
        title: "Day 1 — Johannesburg to Kruger Private Reserve",
        description:
          "Private road transfer or lodge shuttle through the scenic highveld down to Kruger. Afternoon check-in, followed by an exhilarating late afternoon sunset game drive and boma dinner under the stars.",
        overnightLocation: "Kruger Safari Lodge",
        meals: ["dinner"],
      },
      {
        id: "i-k4-2",
        packageId: "p1000000-0000-4000-8000-000000000012",
        dayNumber: 2,
        title: "Day 2 — Dawn & Dusk Big Five Game Drives",
        description:
          "Wake at dawn for a morning safari tracking lions, leopards, and elephant herds as the bush awakens. Midday relaxation at the pool, followed by high tea and an afternoon safari into the night with spotlights.",
        overnightLocation: "Kruger Safari Lodge",
        meals: ["breakfast", "lunch", "dinner"],
      },
      {
        id: "i-k4-3",
        packageId: "p1000000-0000-4000-8000-000000000012",
        dayNumber: 3,
        title: "Day 3 — Bush Walking Safari & Game Drives",
        description:
          "Join an armed ranger on foot for a guided bush walk discovering animal tracks and indigenous medicine. Afternoon game drive in search of rhino, wild dogs, and birdlife.",
        overnightLocation: "Kruger Safari Lodge",
        meals: ["breakfast", "lunch", "dinner"],
      },
      {
        id: "i-k4-4",
        packageId: "p1000000-0000-4000-8000-000000000012",
        dayNumber: 4,
        title: "Day 4 — Sunrise Game Drive & Return",
        description:
          "Final morning safari game drive, full lodge breakfast, and private departure transfer back to Johannesburg or Kruger Mpumalanga International Airport.",
        overnightLocation: null,
        meals: ["breakfast"],
      },
    ],
    faqs: [
      {
        question: "What is the best season for Kruger?",
        answer:
          "May to September (dry winter) offers the highest concentration of animals around waterholes with clear sightlines.",
      },
    ],
    whatToPack: ["Neutral safari clothing", "Warm jacket for open vehicle drives", "Binoculars and camera"],
  },

  {
    id: "p1000000-0000-4000-8000-000000000013",
    slug: "victoria-falls-chobe-package",
    title: "4-Day Victoria Falls & Chobe Experience",
    destinationId: "d1000000-0000-4000-8000-000000000008",
    destinationSlug: "victoria-falls",
    category: "cross_border",
    durationDays: 4,
    groupMin: 2,
    groupMax: 8,
    priceFromZar: 0,
    summary:
      "The Smoke That Thunders. Guided walking tour of Victoria Falls, a sunset cruise on the Zambezi River, and an unforgettable day trip into Chobe National Park in Botswana.",
    inclusions: [
      "Return airport transfers at Victoria Falls",
      "Three nights in a 4-star Victoria Falls hotel or lodge",
      "Daily breakfast",
      "Guided walking tour of Victoria Falls rainforest & viewpoints",
      "Zambezi River luxury sunset cruise with drinks and canapés",
      "Full-day Chobe National Park safari in Botswana (boat cruise + 4x4 game drive + lunch)",
    ],
    exclusions: ["International flights & visa fees", "National park entry fees", "Gratuities"],
    gallery: [
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&auto=format&fit=crop&q=80",
    ],
    difficulty: "easy",
    isFeatured: true,
    isPublished: true,
    seoTitle: "4-Day Victoria Falls & Chobe Botswana Safari Package",
    seoDescription:
      "Private 4-day Victoria Falls package with Zambezi sunset cruise and full-day Chobe Botswana safari.",
    departsFrom: ["Victoria Falls Airport", "Johannesburg"],
    itinerary: [
      {
        id: "i-vf-1",
        packageId: "p1000000-0000-4000-8000-000000000013",
        dayNumber: 1,
        title: "Day 1 — Arrival & Zambezi Sunset Cruise",
        description:
          "Airport greeting and transfer to your hotel. In the late afternoon, board a luxury catamaran for a Zambezi River sunset cruise with hippos, crocodiles, and drinks.",
        overnightLocation: "Victoria Falls",
        meals: [],
      },
      {
        id: "i-vf-2",
        packageId: "p1000000-0000-4000-8000-000000000013",
        dayNumber: 2,
        title: "Day 2 — Guided Tour of Victoria Falls",
        description:
          "Walk the rainforest trails along the edge of Victoria Falls with an expert guide experiencing the thunderous cascade and rainbows of Mosi-oa-Tunya.",
        overnightLocation: "Victoria Falls",
        meals: ["breakfast"],
      },
      {
        id: "i-vf-3",
        packageId: "p1000000-0000-4000-8000-000000000013",
        dayNumber: 3,
        title: "Day 3 — Full-Day Chobe Safari (Botswana)",
        description:
          "Cross the border into Botswana for a morning river safari on the Chobe River among thousands of elephants and buffalo, followed by lodge buffet lunch and an afternoon 4x4 game drive.",
        overnightLocation: "Victoria Falls",
        meals: ["breakfast", "lunch"],
      },
      {
        id: "i-vf-4",
        packageId: "p1000000-0000-4000-8000-000000000013",
        dayNumber: 4,
        title: "Day 4 — Departure",
        description:
          "Enjoy breakfast and morning craft market shopping before your transfer to Victoria Falls Airport.",
        overnightLocation: null,
        meals: ["breakfast"],
      },
    ],
    faqs: [
      {
        question: "Do I need a visa for both Zimbabwe and Botswana?",
        answer:
          "The KAZA UniVisa covers entry into Zimbabwe and day trips into Botswana. Passports must have at least 6 months validity.",
      },
    ],
    whatToPack: ["Passport with 6 months validity", "Light waterproof poncho for waterfall spray", "Sun protection"],
  },
];

import type { Destination } from "@/lib/types";

/**
 * Curated destinations catalogue with real high-resolution African photography.
 * Serves as the primary catalogue and static fallback whenever remote database is syncing.
 */
export const destinations: Destination[] = [
  {
    id: "d1000000-0000-4000-8000-000000000001",
    slug: "cape-town",
    name: "Cape Town",
    province: "Western Cape",
    country: "South Africa",
    heroImage:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&auto=format&fit=crop&q=80",
    intro:
      "Table Mountain on one side, two oceans on the other, and a working harbour in between. Cape Town rewards travellers who give it more days than they planned.",
    body: [
      "Cape Town is the easiest South African city to fall for and the hardest to leave on schedule. Table Mountain dominates every sightline, the Cape Peninsula runs south for sixty kilometres of coastal road, and the Winelands begin forty minutes inland.",
      "The city works best as a base rather than a stop. Most visitors underestimate how much sits within an hour of the V&A Waterfront: Boulders Beach penguins, Cape Point, Chapman's Peak Drive, Stellenbosch and Franschhoek, and the whale coast at Hermanus.",
      "Weather is the one thing to plan around. Summer, from November to March, is dry, hot and windy — the south-easter can shut the cable car for a day at a time. Book Table Mountain for the first clear morning you get rather than a fixed date.",
    ],
    lat: -33.9249,
    lng: 18.4241,
    seoTitle: "Cape Town Tours, Transfers & Chauffeur Hire",
    seoDescription:
      "Private Cape Town day tours, airport transfers and chauffeur hire. Table Mountain, Cape Point, Boulders Beach and the Winelands with a local driver-guide.",
    isPublished: true,
    bestMonths: "November to March",
  },
  {
    id: "d1000000-0000-4000-8000-000000000002",
    slug: "garden-route",
    name: "Garden Route",
    province: "Western Cape",
    country: "South Africa",
    heroImage:
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200&auto=format&fit=crop&q=80",
    intro:
      "Seven hundred kilometres of coastal forest, lagoons and passes between Cape Town and Port Elizabeth. The drive is the destination.",
    body: [
      "The Garden Route runs east from Mossel Bay to Storms River along a strip of coast where indigenous forest reaches almost to the sea. Knysna sits on a lagoon behind sandstone cliffs, Wilderness is a string of lakes, and Tsitsikamma is old-growth forest with suspension bridges over river mouths.",
      "Most people try to do it in three days and regret it. Five to seven days lets you drive the passes rather than the N2, stop at Nature's Valley, and add Addo Elephant Park at the eastern end — which, being malaria-free, is the practical safari option for families with young children.",
      "It is a self-drive route by nature, but the passes are demanding and the distances deceptive. A good number of our clients take a chauffeur for the driving days and keep their attention on the view.",
    ],
    lat: -34.0351,
    lng: 23.0465,
    seoTitle: "Garden Route Tour Packages & Self-Drive Itineraries",
    seoDescription:
      "Multi-day Garden Route packages from Cape Town — Knysna, Wilderness, Tsitsikamma and Addo Elephant Park. Chauffeur-driven or self-drive with a planned itinerary.",
    isPublished: true,
    bestMonths: "October to April",
  },
  {
    id: "d1000000-0000-4000-8000-000000000003",
    slug: "kruger-national-park",
    name: "Kruger National Park",
    province: "Limpopo",
    country: "South Africa",
    heroImage:
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&auto=format&fit=crop&q=80",
    intro:
      "Two million hectares and the most reliable Big Five viewing in Africa. Come in the dry winter, when the bush thins out and animals concentrate at water.",
    body: [
      "Kruger is the size of Wales and holds the full Big Five along with roughly 500 bird species. Unlike most private reserves, it is genuinely accessible: tarred roads, rest camps, and the option to drive yourself if you would rather not sit in a group vehicle.",
      "Seasonality matters more here than anywhere else in the country, and it runs opposite to Cape Town. The dry winter from May to September is the time to go — grass is short, foliage is sparse, and animals gather at the remaining waterholes, so sightings are dramatically better. Summer is green, beautiful and much harder for spotting.",
      "The southern section around Skukuza has the highest game density and the easiest access from Johannesburg. Private concessions on the western boundary, in the Sabi Sand area, permit off-road driving and night drives that the national park itself does not.",
    ],
    lat: -24.0134,
    lng: 31.4856,
    seoTitle: "Kruger National Park Safari Packages",
    seoDescription:
      "Guided Kruger safari packages from Johannesburg — Big Five game drives, Skukuza and Sabi Sand, combined with the Panorama Route. Best in the dry season, May to September.",
    isPublished: true,
    bestMonths: "May to September",
  },
  {
    id: "d1000000-0000-4000-8000-000000000004",
    slug: "panorama-route",
    name: "Panorama Route",
    province: "Mpumalanga",
    country: "South Africa",
    heroImage:
      "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=1200&auto=format&fit=crop&q=80",
    intro:
      "The Blyde River Canyon, the third-largest canyon on earth and the greenest. Almost always driven in the same trip as Kruger, and almost always the surprise of it.",
    body: [
      "The Panorama Route follows the edge of the Drakensberg escarpment where it drops away into the lowveld. The Blyde River Canyon is the centrepiece — twenty-six kilometres of red sandstone, and unlike Grand Canyon or Fish River, it is covered in subtropical vegetation.",
      "The stops are close together and genuinely worth the time: God's Window, Bourke's Luck Potholes, the Three Rondavels, Lisbon and Berlin Falls, and the old gold-rush village of Pilgrim's Rest.",
      "It sits directly between Johannesburg and Kruger's northern gates, so the sensible itinerary drives the escarpment on the way in and enters the park at Orpen or Phalaborwa. Morning mist in the canyon is common and clears by mid-morning.",
    ],
    lat: -24.5833,
    lng: 30.8,
    seoTitle: "Panorama Route Tours — Blyde River Canyon",
    seoDescription:
      "Panorama Route tours taking in the Blyde River Canyon, God's Window, Bourke's Luck Potholes and the Three Rondavels. Combines naturally with a Kruger safari.",
    isPublished: true,
    bestMonths: "April to October",
  },
  {
    id: "d1000000-0000-4000-8000-000000000005",
    slug: "cape-winelands",
    name: "Cape Winelands",
    province: "Western Cape",
    country: "South Africa",
    heroImage:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop&q=80",
    intro:
      "Stellenbosch, Franschhoek and Paarl — three centuries of vines under granite mountains, forty minutes from the middle of Cape Town.",
    body: [
      "The Winelands are close enough to Cape Town to be a day trip and good enough to deserve two. Stellenbosch is a university town with oak-lined streets and Cape Dutch architecture; Franschhoek is a single valley with an outsized concentration of serious restaurants; Paarl is bigger, quieter and less visited.",
      "Tastings are inexpensive by international standards and generally waived if you buy a bottle. The estates that reward a detour are not always the famous ones — part of what a driver-guide is for.",
      "The practical argument for a chauffeur here is simple: South Africa enforces a 0.05% blood-alcohol limit strictly, and the drive back to Cape Town is on a busy motorway. Nobody in your party should be counting tastings.",
    ],
    lat: -33.9321,
    lng: 18.8602,
    seoTitle: "Cape Winelands Wine Tours — Stellenbosch & Franschhoek",
    seoDescription:
      "Private Winelands wine tours from Cape Town. Stellenbosch, Franschhoek and Paarl estates with a professional driver, so nobody has to count tastings.",
    isPublished: true,
    bestMonths: "November to April",
  },
  {
    id: "d1000000-0000-4000-8000-000000000006",
    slug: "drakensberg",
    name: "Drakensberg",
    province: "KwaZulu-Natal",
    country: "South Africa",
    heroImage:
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&auto=format&fit=crop&q=80",
    intro:
      "A thousand-metre basalt wall running the length of KwaZulu-Natal, with San rock art in the caves beneath it. A World Heritage Site on both counts.",
    body: [
      "The uKhahlamba-Drakensberg is listed by UNESCO twice over — once for the landscape, once for the largest concentration of San rock paintings anywhere. The Amphitheatre in the northern range is a five-kilometre wall of rock, and the Tugela Falls dropping off it is among the highest waterfalls on earth.",
      "Walking is the point. Trails run from gentle valley paths to the chain ladders up the Amphitheatre, so it suits mixed-ability groups better than most mountain destinations.",
      "Winter, from May to August, brings clear dry days, cold nights and occasional snow on the high peaks. Summer afternoons bring dramatic thunderstorms that roll in fast — hike early.",
    ],
    lat: -28.75,
    lng: 29.0,
    seoTitle: "Drakensberg Tours & Hiking Packages",
    seoDescription:
      "Drakensberg tour packages from Durban and Johannesburg — the Amphitheatre, Tugela Falls, San rock art and guided hikes for all abilities.",
    isPublished: true,
    bestMonths: "April to September",
  },
  {
    id: "d1000000-0000-4000-8000-000000000007",
    slug: "johannesburg",
    name: "Johannesburg & Soweto",
    province: "Gauteng",
    country: "South Africa",
    heroImage:
      "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=1200&auto=format&fit=crop&q=80",
    intro:
      "The city that gold built and apartheid shaped. Soweto and the Apartheid Museum together make the most important half-day in the country.",
    body: [
      "Johannesburg is not a pretty city and is not trying to be. It is the economic engine of the continent, and its interest is historical and human rather than scenic. Most visitors pass through on the way to Kruger; the ones who stay a day are usually glad they did.",
      "The essential pairing is the Apartheid Museum and Soweto. The museum is unflinching and superbly built. Soweto is a city of well over a million people, and a guided visit takes in Vilakazi Street — the only street in the world to have housed two Nobel Peace laureates — the Hector Pieterson Memorial, and Regina Mundi church.",
      "Maboneng and Braamfontein in the inner city have become genuinely good for food and design. Both are best visited with someone who knows which blocks to walk.",
    ],
    lat: -26.2041,
    lng: 28.0473,
    seoTitle: "Johannesburg & Soweto Tours",
    seoDescription:
      "Guided Johannesburg and Soweto tours — the Apartheid Museum, Vilakazi Street, Hector Pieterson Memorial and Constitution Hill with a local guide.",
    isPublished: true,
    bestMonths: "All year",
  },
  {
    id: "d1000000-0000-4000-8000-000000000008",
    slug: "victoria-falls",
    name: "Victoria Falls",
    province: "Cross-border",
    country: "Zimbabwe",
    heroImage:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&auto=format&fit=crop&q=80",
    intro:
      "Mosi-oa-Tunya, the smoke that thunders. Twice the height of Niagara and more than twice as wide, an easy add-on to any Johannesburg itinerary.",
    body: [
      "Victoria Falls is a two-hour flight from Johannesburg and works as a three-night extension to almost any South African trip. The falls are 1 700 metres wide and drop 108 metres into the Batoka Gorge — at full flow the spray is visible from thirty kilometres away.",
      "Water level changes the experience completely. February to May is peak flow, spectacular but so misted that you see less of the rock face. September to December is low water, when the Zambian side reveals the geology and Devil's Pool opens for swimming.",
      "Visa and border formalities are straightforward but worth getting right in advance. The KAZA UniVisa covers Zimbabwe and Zambia together, which matters if you want to see the falls from both sides.",
    ],
    lat: -17.9243,
    lng: 25.8572,
    seoTitle: "Victoria Falls Packages from Johannesburg",
    seoDescription:
      "Victoria Falls packages from Johannesburg — flights, transfers, guided tours of the falls, sunset Zambezi cruises and Chobe day trips into Botswana.",
    isPublished: true,
    bestMonths: "February to May for full flow",
  },
];

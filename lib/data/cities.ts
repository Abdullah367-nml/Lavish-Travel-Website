/**
 * City landing-page content for /chauffeur/{city} and /car-hire/{city}.
 *
 * Section 4 is explicit that these must never be templated duplicate text
 * — near-duplicate city pages are the classic way a travel site gets its
 * local landing pages ignored by search engines. So each city carries its
 * own copy for both services, written about that city specifically.
 */
export type City = {
  slug: string;
  name: string;
  province: string;
  /** Nearest airport IATA code. */
  airportCode: string;
  airportName: string;
  /** Unique copy for the chauffeur service in this city. */
  chauffeurIntro: string;
  chauffeurBody: string[];
  /** Unique copy for self-drive hire in this city. */
  carHireIntro: string;
  carHireBody: string[];
  /** Destination slugs whose tours are relevant from this city. */
  nearbyDestinationSlugs: string[];
  /** Transfer route slugs starting or ending here. */
  transferRouteSlugs: string[];
  /** Areas covered at the standard rate. */
  areasCovered: string[];
};

export const cities: City[] = [
  {
    slug: "johannesburg",
    name: "Johannesburg",
    province: "Gauteng",
    airportCode: "JNB",
    airportName: "OR Tambo International Airport",
    chauffeurIntro:
      "Johannesburg runs on the car. There is no meaningful metro for business districts, distances between Sandton, Rosebank, the CBD and Midrand are real, and the traffic on the M1 is unforgiving. A chauffeur here is not indulgence, it is logistics.",
    chauffeurBody: [
      "Most of our Johannesburg work is corporate: roadshows across three or four office parks in a day, client hosting, and airport runs timed against flights out of OR Tambo. Drivers know which routes fail at which hour, which matters more here than in any other South African city.",
      "The practical case for an hourly booking rather than point-to-point transfers is strong in Gauteng. If your day involves more than two stops, a driver waiting with your bags in the boot works out cheaper and considerably less stressful than three separate pickups.",
      "Security is the other reason clients book here rather than hail. Our drivers are vetted, the vehicles are tracked, and there is no waiting on a kerb in an unfamiliar part of the city at night.",
    ],
    carHireIntro:
      "Self-drive from Johannesburg makes most sense as the start of a longer journey — the Panorama Route and Kruger are a comfortable day east, and the roads out of Gauteng are good.",
    carHireBody: [
      "Within the city, self-drive is harder to recommend to a first-time visitor. Signage is inconsistent, the highway interchanges are complex, and minibus taxi behaviour takes acclimatising to. If Johannesburg is only a transit stop, take a chauffeur.",
      "If you are heading to Kruger, a Fortuner or similar is the sensible choice: the raised ride height matters on gravel approach roads, and self-drive inside the national park is genuinely one of the best ways to experience it.",
      "We deliver to OR Tambo, Lanseria, or any Johannesburg or Sandton hotel, and we will collect from a different city if you are driving one way.",
    ],
    nearbyDestinationSlugs: [
      "johannesburg",
      "kruger-national-park",
      "panorama-route",
      "victoria-falls",
    ],
    transferRouteSlugs: [
      "or-tambo-to-sandton",
      "or-tambo-to-johannesburg-cbd",
      "or-tambo-to-midrand",
      "sandton-to-pretoria",
    ],
    areasCovered: [
      "Sandton",
      "Rosebank",
      "Johannesburg CBD",
      "Midrand",
      "Waterfall City",
      "Fourways",
      "Melrose Arch",
      "Bryanston",
    ],
  },
  {
    slug: "cape-town",
    name: "Cape Town",
    province: "Western Cape",
    airportCode: "CPT",
    airportName: "Cape Town International Airport",
    chauffeurIntro:
      "Cape Town is compact but the good stuff is spread along the coast and over the mountain. A driver turns the Peninsula, the Winelands and the whale coast from three logistical problems into three easy days.",
    chauffeurBody: [
      "The strongest argument for a chauffeur in Cape Town is the Winelands. South Africa enforces a 0.05% blood-alcohol limit and the drive back to the city is on a busy motorway — nobody in your party should be counting tastings. It is the single most common reason clients book us here.",
      "The second is the passes. Chapman's Peak Drive and Kloof Nek are spectacular and demand attention, which means the driver sees least of them. Our Cape Town drivers double as guides, so the commentary comes with the route.",
      "Parking is the quiet third reason. The V&A Waterfront, Camps Bay and Kalk Bay are all difficult in season, and a driver simply drops you at the door.",
    ],
    carHireIntro:
      "Cape Town is the one South African city where self-drive is genuinely pleasant. Distances are short, the coastal roads are a pleasure, and signage to the obvious destinations is good.",
    carHireBody: [
      "A sedan is enough for the city, the Peninsula and the Winelands — none of it needs ground clearance. If you are continuing along the Garden Route, an SUV is more comfortable over a week and takes the luggage without argument.",
      "Two local notes. Chapman's Peak Drive is a toll road and closes in high wind or after rockfalls, so check before committing to it. And load shedding can take traffic lights out, in which case a dead intersection is treated as a four-way stop.",
      "We deliver to Cape Town International, the Waterfront, or any city hotel, and we can collect in Port Elizabeth if you are driving the Garden Route one way.",
    ],
    nearbyDestinationSlugs: [
      "cape-town",
      "cape-winelands",
      "garden-route",
    ],
    transferRouteSlugs: [
      "cape-town-airport-to-city-centre",
      "cape-town-airport-to-camps-bay",
      "cape-town-airport-to-stellenbosch",
    ],
    areasCovered: [
      "City Bowl",
      "V&A Waterfront",
      "Camps Bay",
      "Clifton",
      "Sea Point",
      "Constantia",
      "Hout Bay",
      "Stellenbosch",
    ],
  },
  {
    slug: "durban",
    name: "Durban",
    province: "KwaZulu-Natal",
    airportCode: "DUR",
    airportName: "King Shaka International Airport",
    chauffeurIntro:
      "Durban is a working port and a conference city with a subtropical beachfront attached. Most of our work here is the ICC, the Umhlanga hotel strip, and the run up the coast.",
    chauffeurBody: [
      "King Shaka sits well north of the city, which makes Umhlanga the shorter and more popular transfer and the Golden Mile the longer one. Both are straightforward on the M4 outside peak.",
      "Conference and incentive work dominates. We routinely run multiple vehicles against a single delegate manifest between King Shaka, the ICC and the beachfront hotels, with one point of contact rather than a driver per booking.",
      "The Midlands Meander and the Drakensberg are the two day trips worth a driver. The Drakensberg is a three-hour run inland and the mountain roads at the end of it are not the place to be navigating from a phone.",
    ],
    carHireIntro:
      "Self-drive from Durban opens up the north coast, the Midlands and the Drakensberg, all on good roads and all within a comfortable half day.",
    carHireBody: [
      "The city itself is easy enough to drive, and the M4 coastal road north through Umhlanga and Ballito is a genuinely nice drive rather than a commute.",
      "If the Drakensberg is on your list, take an SUV. The approach roads to the trailheads in the Northern Berg are gravel in places and the ground clearance earns its keep.",
      "Note that the Hluhluwe-iMfolozi and iSimangaliso reserves to the north are within self-drive range and are malaria-low-risk rather than malaria-free — worth a word with a travel clinic if you are heading up there.",
    ],
    nearbyDestinationSlugs: ["drakensberg"],
    transferRouteSlugs: ["king-shaka-to-umhlanga", "king-shaka-to-durban-cbd"],
    areasCovered: [
      "Umhlanga Rocks",
      "Umhlanga Ridge",
      "La Lucia",
      "Ballito",
      "Durban CBD",
      "Golden Mile",
      "Morningside",
      "Westville",
    ],
  },
  {
    slug: "pretoria",
    name: "Pretoria",
    province: "Gauteng",
    airportCode: "JNB",
    airportName: "OR Tambo International Airport",
    chauffeurIntro:
      "Pretoria is the administrative capital, which shapes the work: embassies, government departments, the university, and a steady flow of diplomatic and corporate transfers to OR Tambo.",
    chauffeurBody: [
      "The R21 between OR Tambo and Pretoria is the most reliable airport corridor in Gauteng, and the run is more predictable than the equivalent trip into Sandton. Our fixed price covers any Pretoria address, Centurion and Hatfield included.",
      "Discretion matters disproportionately in this city. Drivers on diplomatic and government work are briefed accordingly, and we will hold a vehicle on standby for the length of a meeting rather than turning the trip into two bookings.",
      "For anyone here in late September or October, the jacarandas are worth a slow drive through the older suburbs. Ask your driver to route through Waterkloof or Brooklyn.",
    ],
    carHireIntro:
      "Pretoria is an easier city to drive than Johannesburg — wider roads, more logical layout, and considerably less congestion outside the R21 and N1 peaks.",
    carHireBody: [
      "It also works well as a quieter base for Gauteng generally, with the Cradle of Humankind and the Magaliesberg both under an hour away.",
      "A sedan is entirely sufficient here. Step up to an SUV only if you are continuing north towards Limpopo or the Waterberg, where gravel starts appearing on lodge approach roads.",
      "We deliver to OR Tambo, Wonderboom, or any Pretoria or Centurion address.",
    ],
    nearbyDestinationSlugs: ["johannesburg", "panorama-route", "kruger-national-park"],
    transferRouteSlugs: ["or-tambo-to-pretoria", "sandton-to-pretoria"],
    areasCovered: [
      "Hatfield",
      "Brooklyn",
      "Waterkloof",
      "Menlyn",
      "Centurion",
      "Pretoria CBD",
      "Lynnwood",
      "Silver Lakes",
    ],
  },
];

-- =============================================================================
-- Infill: attractions for the seven areas that loaded with none.
--
-- Ceres, Worcester, Observatory, Scarborough, Gansbaai, Pringle Bay and
-- Yzerfontein each had a description in the supplied guide but no named
-- sights, so their pages would have published with an empty "what to see"
-- section. These rows were researched from the sources cited above each
-- insert.
--
-- Every row is status='draft', for the same reason as the rest of the area
-- content: a published destination page is a public claim that the agency
-- operates there, and that has not been confirmed.
--
-- Rows marked "confidence: medium" rest on travel directories rather than an
-- official or tourism-board page. They are the ones to check first.
--
-- Landmarks already in the catalogue under a neighbouring area are NOT
-- repeated here (Slangkop Lighthouse under Kommetjie, Cape of Good Hope under
-- the Cape Point area, Clarence Drive under Gordon's Bay, West Coast National
-- Park under Langebaan).
--
-- Additive and idempotent — no TRUNCATE, ON CONFLICT DO NOTHING throughout.
-- Safe to re-run, and it cannot destroy bookings.
--
-- Run AFTER seed-areas.sql.
-- =============================================================================

begin;

-- --- ceres ---------------------------------------------------------------

-- source: https://www.matroosberg.com/
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$matroosberg-reserve$q$, $q$Matroosberg Private Nature Reserve$q$,
       $q$A working farm and private reserve on the slopes of Matroosberg, the highest peak in the Boland at 2 247 m. Hiking, mountain biking, abseiling and birding, with a 4x4 route towards the summit ridge.$q$,
       $q$Farm Erfdeel, about 35 km from Ceres$q$, $q$Nature reserve$q$,
       $q$Half day$q$, $q$Snow on the upper slopes is a winter possibility rather than a certainty, and the higher altitudes need a 4x4.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$ceres$q$
on conflict (destination_id, slug) do nothing;

-- source: https://ceresmuseum.co.za/main/about/
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$ceres-togryers-museum$q$, $q$Ceres Togryers Museum$q$,
       $q$The town museum, built around the transport riders who carried goods over the mountain passes. Collections cover ox wagons, the 1838 Ceres meteorite, the 1969 earthquake and the Galant slave rebellion.$q$,
       $q$Oranje Street, Ceres$q$, $q$Museum$q$,
       $q$1 hour$q$, null, 'draft', 1
from public.destinations d
where d.slug = $q$ceres$q$
on conflict (destination_id, slug) do nothing;

-- source: https://ceresmuseum.co.za/main/history/tollhouses-and-passes/
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$michells-pass$q$, $q$Michell's Pass$q$,
       $q$The historic pass on the R46 between Wolseley and Ceres, built by Andrew Geddes Bain in the 1840s. The old tollhouse and sections of Bain's original stone retaining walls survive beside the road.$q$,
       $q$R46 between Wolseley and Ceres$q$, $q$Mountain pass$q$,
       $q$1 hour$q$, $q$A surfaced public road on the main approach to Ceres, so no special vehicle is needed.$q$, 'draft', 2
from public.destinations d
where d.slug = $q$ceres$q$
on conflict (destination_id, slug) do nothing;

-- source: https://ceresadventures.co.za/
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$ceres-zipline-adventures$q$, $q$Ceres Zipline Adventures$q$,
       $q$A course of eight cable slides through the Skurweberg mountains above Ceres, totalling roughly 1.4 km, with individual spans of 100 to 291 m and a maximum height of about 40 m.$q$,
       $q$Voortrekker Street, at the foot of Michell's Pass, Ceres$q$, $q$Adventure activity$q$,
       $q$2-3 hours$q$, $q$Tours run at set departure times, so a slot is worth arranging ahead.$q$, 'draft', 3
from public.destinations d
where d.slug = $q$ceres$q$
on conflict (destination_id, slug) do nothing;

-- source: https://www.cherryfarm.co.za/
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$klondyke-cherry-farm$q$, $q$Klondyke Cherry Farm$q$,
       $q$A working cherry farm in the Koue Bokkeveld at about 1 260 m, roughly 30 km from Ceres. Visitors pick cherries in the orchards during harvest, and the farm also has walking and cycling routes.$q$,
       $q$Koue Bokkeveld, about 30 km from Ceres$q$, $q$Fruit farm$q$,
       $q$Half day$q$, $q$Cherry picking runs only through the November to December harvest, and the dates move each year with the crop.$q$, 'draft', 4
from public.destinations d
where d.slug = $q$ceres$q$
on conflict (destination_id, slug) do nothing;

-- --- worcester -----------------------------------------------------------

-- source: https://www.sanbi.org/gardens/karoo-desert/
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$karoo-desert-botanical-garden$q$, $q$Karoo Desert National Botanical Garden$q$,
       $q$A national botanical garden of some 154 hectares at the foot of the Hex River Mountains, growing arid and semi-arid southern African plants. It holds a planted quiver tree grove and three walking trails.$q$,
       $q$Roux Road, Panorama, Worcester$q$, $q$Botanical garden$q$,
       $q$1-2 hours$q$, $q$Spring is the main flowering period for the annuals and vygies.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$worcester$q$
on conflict (destination_id, slug) do nothing;

-- source: https://capewinelandsmuseums.co.za/worcester/
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$kleinplasie-museum$q$, $q$Worcester Museum at Kleinplasie$q$,
       $q$An open-air museum on the old Roodewal farm showing Cape farming life, with live farm animals and working demonstrations of milling, baking, soap and candle making and coffee roasting.$q$,
       $q$Robertson Road, Worcester$q$, $q$Open-air museum$q$,
       $q$2-3 hours$q$, $q$Most of the site is outdoors and spread across the old farmyard, so allow for walking in the sun.$q$, 'draft', 1
from public.destinations d
where d.slug = $q$worcester$q$
on conflict (destination_id, slug) do nothing;

-- source: https://worcestertourism.com/wp-content/uploads/2018/01/BOEK.pdf
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$worcester-heritage-walk$q$, $q$Worcester Heritage Walking Route$q$,
       $q$A signposted route through central Worcester linking numbered heritage sites, among them the neo-classical Drostdy of 1823, Beck House of 1841, the Dutch Reformed Mother Church and Church Square.$q$,
       $q$Central Worcester, starting in Baring Street$q$, $q$Heritage walk$q$,
       $q$2 hours$q$, $q$The route follows level streets in the town centre, and Worcester Tourism publishes a booklet for it.$q$, 'draft', 2
from public.destinations d
where d.slug = $q$worcester$q$
on conflict (destination_id, slug) do nothing;

-- source: https://willowcreek.co.za/tasting-room/
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$willow-creek-olive-estate$q$, $q$Willow Creek Olive Estate$q$,
       $q$An olive farm and press in the Nuy Valley outside Worcester, with a tasting room where visitors sample extra virgin and flavoured olive oils, balsamic vinegars, table olives and pastes.$q$,
       $q$Nuy Road, Nuy Valley, Worcester$q$, $q$Olive estate$q$,
       $q$1 hour$q$, $q$Groups of ten or more should book the tasting room ahead, and picnic baskets need ordering in advance.$q$, 'draft', 3
from public.destinations d
where d.slug = $q$worcester$q$
on conflict (destination_id, slug) do nothing;

-- source: https://nuywinery.co.za/
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$nuy-winery$q$, $q$Nuy Winery$q$,
       $q$A cellar founded in 1963 in the Nuy Valley at the foot of the Langeberg. The tasting room pours chenin blanc, sauvignon blanc, chardonnay, muscadel, syrah, cabernet sauvignon and pinotage.$q$,
       $q$Nuy Valley, near Worcester$q$, $q$Wine cellar$q$,
       $q$1-2 hours$q$, $q$An eatery shares the site, so a tasting can be combined with lunch.$q$, 'draft', 4
from public.destinations d
where d.slug = $q$worcester$q$
on conflict (destination_id, slug) do nothing;

-- --- observatory ---------------------------------------------------------

-- source: https://www.saao.ac.za/visit-capetown/
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$south-african-astronomical-observatory$q$, $q$South African Astronomical Observatory$q$,
       $q$The headquarters of the South African Astronomical Observatory, on the site of the former Royal Observatory and a declared national heritage site. The historic Main Building, the McClean building and a small museum.$q$,
       $q$Observatory Road, Observatory, Cape Town$q$, $q$Science site$q$,
       $q$2 hours$q$, $q$A working research site rather than a walk-in museum: access is by scheduled open evening or pre-booked tour, paid in advance.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$observatory$q$
on conflict (destination_id, slug) do nothing;

-- source: https://heartofcapetown.co.za/tour-information/
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$heart-of-cape-town-museum$q$, $q$Heart of Cape Town Museum$q$,
       $q$A museum in the old main building of Groote Schuur Hospital covering the world's first human heart transplant, carried out here in 1967. It includes the theatres where the operation took place.$q$,
       $q$Old Main Building, Groote Schuur Hospital, Main Road, Observatory$q$, $q$Museum$q$,
       $q$1-2 hours$q$, $q$Entry is by guided tour only and the later tours need booking ahead.$q$, 'draft', 1
from public.destinations d
where d.slug = $q$observatory$q$
on conflict (destination_id, slug) do nothing;

-- source: https://www.capetown.travel/listing/cape-town-science-centre-3/
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$cape-town-science-centre$q$, $q$Cape Town Science Centre$q$,
       $q$An interactive science centre on Main Road with hands-on exhibits, demonstrations and science shows. The programming is built around children, families and school groups.$q$,
       $q$Main Road, Observatory, Cape Town$q$, $q$Science centre$q$,
       $q$1-2 hours$q$, $q$Most relevant for clients travelling with children.$q$, 'draft', 2
from public.destinations d
where d.slug = $q$observatory$q$
on conflict (destination_id, slug) do nothing;

-- source: https://www.capetown.gov.za/Family%20and%20home/See-all-city-facilities/Our-recreational-facilities/Biodiversity%20parks/Raapenberg-Bird-Sanctuary
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$raapenberg-bird-sanctuary$q$, $q$Raapenberg Bird Sanctuary$q$,
       $q$A City of Cape Town biodiversity site protecting a reeded stretch of the Liesbeek River and its wetland, inside the Two Rivers Urban Park. Herons, sacred ibis, coots and breeding ducks are recorded here.$q$,
       $q$Observatory Road and Liesbeek Parkway, Observatory$q$, $q$Urban nature reserve$q$,
       $q$1 hour$q$, $q$Open riverside parkland rather than a gated reserve, so there are no facilities or staff on site.$q$, 'draft', 3
from public.destinations d
where d.slug = $q$observatory$q$
on conflict (destination_id, slug) do nothing;

-- --- scarborough ---------------------------------------------------------

-- source: https://www.sa-venues.com/things-to-do/westerncape/scarborough-beach/
-- confidence: medium
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$scarborough-beach$q$, $q$Scarborough Beach$q$,
       $q$A long white-sand beach backed by mountain slopes on the Atlantic side of the peninsula, with rock pools along the shoreline. Used mainly for walking, surfing and beachcombing rather than swimming.$q$,
       $q$Main Road (M65), Scarborough$q$, $q$Beach$q$,
       $q$1-2 hours$q$, $q$Rip currents run just off the beach, so it suits walking and surfing better than swimming.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$scarborough$q$
on conflict (destination_id, slug) do nothing;

-- source: https://capetownbeaches.com/misty-cliffs-beach/
-- confidence: medium
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$misty-cliffs-beach$q$, $q$Misty Cliffs Beach$q$,
       $q$A small, largely undeveloped beach beside the M65 in the hamlet of Misty Cliffs, immediately north of Scarborough on the Atlantic coast.$q$,
       $q$M65, Misty Cliffs$q$, $q$Beach$q$,
       $q$30 minutes$q$, $q$There are no shops or restaurants in the hamlet, so it works as a short stop on the coastal drive.$q$, 'draft', 1
from public.destinations d
where d.slug = $q$scarborough$q$
on conflict (destination_id, slug) do nothing;

-- source: https://capetownbeaches.com/witsands-beach/
-- confidence: medium
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$witsand-beach$q$, $q$Witsand Beach$q$,
       $q$A wide sand beach backed by dunes and fynbos on the M65 between Misty Cliffs and Kommetjie. Consistent Atlantic wind makes it a regular kitesurfing and windsurfing spot, and it remains undeveloped.$q$,
       $q$M65 between Misty Cliffs and Kommetjie, near Scarborough$q$, $q$Beach$q$,
       $q$1 hour$q$, $q$Facilities amount to little more than parking, and this is an exposed stretch of coast with strong wind.$q$, 'draft', 2
from public.destinations d
where d.slug = $q$scarborough$q$
on conflict (destination_id, slug) do nothing;

-- --- gansbaai ------------------------------------------------------------

-- source: https://www.capenature.co.za/activities/klipgat-cave-walker-bay-nature-reserve-1
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$klipgat-cave$q$, $q$Klipgat Cave$q$,
       $q$A limestone sea cave in the Walker Bay Nature Reserve occupied by Middle and Later Stone Age people. A circular boardwalk runs through the main chamber above the Walker Bay shoreline.$q$,
       $q$De Kelders, Gansbaai$q$, $q$Cave$q$,
       $q$1 hour$q$, $q$Entry is through the CapeNature De Kelders gate, and the approach mixes boardwalk with a short stretch of rock-hopping.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$gansbaai$q$
on conflict (destination_id, slug) do nothing;

-- source: https://sharkwatchsa.com/ethical-shark-cage-diving-in-south-africa-why-it-matters-beyond-great-white-sharks/
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$kleinbaai-marine-wildlife-trips$q$, $q$Marine wildlife trips from Kleinbaai Harbour$q$,
       $q$Boats launch from the Kleinbaai slipway into the channel around Dyer Island and Geyser Rock, where a large Cape fur seal colony and seabird breeding sites draw sharks. Cage diving operates from here.$q$,
       $q$Kleinbaai, Gansbaai$q$, $q$Marine wildlife$q$,
       $q$Half day$q$, $q$Great white sightings have been scarce and unpredictable since around 2017, and trips now often show bronze whaler sharks instead — do not promise white sharks. All sailings depend on sea conditions.$q$, 'draft', 1
from public.destinations d
where d.slug = $q$gansbaai$q$
on conflict (destination_id, slug) do nothing;

-- source: https://dict.org.za/dict-projects/african-penguin-seabird-sanctuary/
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$african-penguin-seabird-sanctuary$q$, $q$African Penguin and Seabird Sanctuary$q$,
       $q$A marine bird rehabilitation centre run by the Dyer Island Conservation Trust. Visitors see African penguins and other seabirds in the recovery pens, with a shop and cafe on site.$q$,
       $q$Kleinbaai, Gansbaai$q$, $q$Wildlife sanctuary$q$,
       $q$1 hour$q$, $q$Bird numbers depend on the current rescue caseload, so the pens can be quiet outside the moult and oiling seasons.$q$, 'draft', 2
from public.destinations d
where d.slug = $q$gansbaai$q$
on conflict (destination_id, slug) do nothing;

-- source: https://xplorio.com/gansbaai/en/about/areas/danger-point/
-- confidence: medium
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$danger-point-lighthouse$q$, $q$Danger Point Lighthouse$q$,
       $q$A late nineteenth-century octagonal lighthouse on the reef-fringed peninsula south of Kleinbaai. It carries a memorial to the HMS Birkenhead, wrecked offshore in 1852.$q$,
       $q$Danger Point, Gansbaai$q$, $q$Lighthouse$q$,
       $q$1 hour$q$, $q$Access to the tower interior is limited and not offered daily, so arrange it in advance.$q$, 'draft', 3
from public.destinations d
where d.slug = $q$gansbaai$q$
on conflict (destination_id, slug) do nothing;

-- source: https://xplorio.com/gansbaai/duiwelsgat-hiking-trail/
-- confidence: medium
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$duiwelsgat-hiking-trail$q$, $q$Duiwelsgat Hiking Trail$q$,
       $q$A coastal path of about seven kilometres from Gansbaai along the limestone cliffs and milkwood of De Kelders to Klipgat Cave, passing tidal pools, coves and freshwater springs.$q$,
       $q$De Kelders, Gansbaai$q$, $q$Cliff walk$q$,
       $q$Half day$q$, $q$One of the better land-based whale-watching stretches on this coast, with southern right whales in the bay from roughly June to December.$q$, 'draft', 4
from public.destinations d
where d.slug = $q$gansbaai$q$
on conflict (destination_id, slug) do nothing;

-- --- pringle-bay ---------------------------------------------------------

-- source: https://whalecoast.info/attraction/pringle-bay/
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$pringle-bay-beach$q$, $q$Pringle Bay Beach$q$,
       $q$A white-sand beach of roughly two kilometres backed by dunes and fynbos-covered mountains, with a shallow lagoon where the Buffels River meets the sea and rock pools at either end.$q$,
       $q$Buffels River mouth, Pringle Bay$q$, $q$Beach$q$,
       $q$Half day$q$, $q$The open sea is cold and exposed to wind, while the river mouth is warmer, shallower and better for children.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$pringle-bay$q$
on conflict (destination_id, slug) do nothing;

-- source: https://xplorio.com/pringle-bay/cape-hangklip-lighthouse/
-- confidence: medium
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$cape-hangklip-lighthouse$q$, $q$Cape Hangklip Lighthouse$q$,
       $q$A white cylindrical tower with a black band, built in 1960 to mark the eastern entrance to False Bay. It stands on the shore near Skuitbaai and is reached on foot through coastal fynbos.$q$,
       $q$Cape Hangklip, Pringle Bay$q$, $q$Lighthouse$q$,
       $q$1 hour$q$, $q$The lighthouse is closed to the public and seen from outside, and the walk in crosses an isolated stretch of coast.$q$, 'draft', 1
from public.destinations d
where d.slug = $q$pringle-bay$q$
on conflict (destination_id, slug) do nothing;

-- source: https://conservationmag.org/en/hiking/hangklip-hike-pringle-bay-cape-town
-- confidence: medium
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$hangklip-peak$q$, $q$Hangklip Peak$q$,
       $q$The 454 m peak rising directly behind the village, climbed on a trail from a gate at the top of Stream Road. The route crosses mountain fynbos and looks across False Bay to the Cape Peninsula.$q$,
       $q$Cape Hangklip, Pringle Bay$q$, $q$Mountain hike$q$,
       $q$Half day$q$, $q$Allow three to four hours return, carry water, and expect a resident baboon troop on the mountain.$q$, 'draft', 2
from public.destinations d
where d.slug = $q$pringle-bay$q$
on conflict (destination_id, slug) do nothing;

-- source: https://www.capebirdclub.org.za/rooi-els-site-guide/
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$rooi-els-birding-track$q$, $q$Rooi Els Birding Track$q$,
       $q$A gravel track above the neighbouring village of Rooi Els crossing boulder-strewn fynbos slopes. Among the most reliable sites for Cape rockjumper, alongside ground woodpecker and Cape sugarbird.$q$,
       $q$Rooi Els, near Pringle Bay$q$, $q$Birding trail$q$,
       $q$Half day$q$, $q$Park at the gate and continue on foot; the site is about five kilometres north of Pringle Bay and best walked early.$q$, 'draft', 3
from public.destinations d
where d.slug = $q$pringle-bay$q$
on conflict (destination_id, slug) do nothing;

-- --- yzerfontein ---------------------------------------------------------

-- source: https://www.westcoastway.co.za/top-things-to-see-and-do-in-yzerfontein/
-- confidence: medium
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$sixteen-mile-beach$q$, $q$Sixteen Mile Beach$q$,
       $q$One of the longest uninterrupted beaches on the South African coast, running south from Yzerfontein's main beach to the boundary of the West Coast National Park. Used for walking, surfing and kitesurfing.$q$,
       $q$Sixteen Mile Beach, Yzerfontein$q$, $q$Beach$q$,
       $q$2 hours$q$, $q$Fully exposed to the West Coast wind, strongest on summer afternoons; the southern end falls inside a marine protected area where shore angling is restricted.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$yzerfontein$q$
on conflict (destination_id, slug) do nothing;

-- source: https://www.westcoastway.co.za/yzerfontein/
-- confidence: medium
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$yzerfontein-harbour$q$, $q$Yzerfontein Harbour$q$,
       $q$A working small-craft harbour with slipways used by recreational and commercial boats. Catches are landed here and sold at the fish market on the main road, which is busiest in snoek season.$q$,
       $q$Yzerfontein harbour, Yzerfontein$q$, $q$Harbour$q$,
       $q$1 hour$q$, $q$Dassen Island, visible offshore, is a CapeNature seabird reserve and is not open to general public access.$q$, 'draft', 1
from public.destinations d
where d.slug = $q$yzerfontein$q$
on conflict (destination_id, slug) do nothing;

-- source: https://www.westcoastway.co.za/yzerfontein/
-- confidence: medium
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$schaapeiland-trail$q$, $q$Schaapen Island Coastal Trail$q$,
       $q$A self-guided coastal walk of about two kilometres following the rocky shore from the tidal pool near the main beach to Schaapen Island, a headland cut off from the shore at high tide.$q$,
       $q$Main Beach to Schaapen Island, Yzerfontein$q$, $q$Walking trail$q$,
       $q$1 hour$q$, $q$Check the tide before setting out, as the headland is separated from the shore at high water.$q$, 'draft', 2
from public.destinations d
where d.slug = $q$yzerfontein$q$
on conflict (destination_id, slug) do nothing;

-- source: https://khwattu.org/
-- confidence: high
insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$khwa-ttu-san-centre$q$, $q$!Khwa ttu San Culture and Education Centre$q$,
       $q$A San-run heritage centre on Grootwater Farm beside the R27, south of the Yzerfontein turnoff. Three exhibition buildings cover San history and contemporary life, and San guides lead cultural walks.$q$,
       $q$Grootwater Farm, R27, south of the Yzerfontein turnoff$q$, $q$Heritage centre$q$,
       $q$Half day$q$, $q$The San-led guided experiences are arranged in advance rather than joined on arrival.$q$, 'draft', 3
from public.destinations d
where d.slug = $q$yzerfontein$q$
on conflict (destination_id, slug) do nothing;

commit;

-- Expected after a first run: 30 new attractions across 7 areas, all draft.

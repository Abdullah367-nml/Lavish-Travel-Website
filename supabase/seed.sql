-- =============================================================================
-- Seed data.
--
-- Destinations and attractions are the CLIENT'S OWN COPY, used verbatim.
-- The only edit is one article correction ("A iconic peak" -> "An iconic
-- peak") on Lion's Head.
--
-- ⚠ TOUR PRICES ARE STILL PLACEHOLDERS. They are plausible market rates, not
--   the agency's real rate card. They are seeded as `published` because that
--   was the explicit instruction, which means they ARE bookable — replace
--   them from the admin panel before this site is public.
--
-- Dates are generated relative to current_date so the demo never goes stale.
-- Descriptions use dollar quoting ($q$...$q$) so apostrophes need no escaping.
-- =============================================================================

-- Idempotent: wipe transactional + catalogue data, keep auth users/profiles.
truncate table
  public.payments, public.bookings, public.reviews,
  public.tour_dates, public.tour_attractions, public.tours,
  public.attractions, public.destinations
restart identity cascade;

-- =============================================================================
-- DESTINATIONS
-- =============================================================================
insert into public.destinations
  (slug, name, province, country, description, image, lat, lng, best_months,
   seo_title, seo_description, status, sort_order)
values
  ('cape-town', 'Cape Town', 'Western Cape', 'South Africa',
   $q$Table Mountain on one side, two oceans on the other, and a working harbour in between. Cape Town rewards travellers who give it more days than they planned.$q$,
   '/images/destinations/cape-town.jpg', -33.924870, 18.424055, 'November to March',
   'Cape Town Tours, Attractions & Day Trips',
   'Guided Cape Town tours covering Table Mountain, Cape Point, Boulders Beach penguins, Bo-Kaap and Robben Island. Private vehicles and local guides.',
   'published', 1),

  ('stellenbosch', 'Stellenbosch', 'Western Cape', 'South Africa',
   $q$Oak-lined streets, Cape Dutch architecture and three centuries of vines under granite mountains, forty minutes from the middle of Cape Town.$q$,
   '/images/destinations/stellenbosch.jpg', -33.936100, 18.860600, 'November to April',
   'Stellenbosch Tours, Wine & Attractions',
   'Stellenbosch day tours — historic Dorp Street, the Village Museum, Jonkershoek Nature Reserve, the Dylan Lewis Sculpture Garden and the winelands.',
   'published', 2);

-- =============================================================================
-- ATTRACTIONS — Cape Town (12), client copy verbatim
-- =============================================================================
insert into public.attractions (destination_id, slug, name, description, image, location, sort_order)
select d.id, v.slug, v.name, v.description, v.image, v.location, v.sort_order
from public.destinations d,
(values
 ('table-mountain-aerial-cableway','Table Mountain Aerial Cableway',
  $q$Experience panoramic views of Cape Town and the Atlantic Ocean with a 360-degree rotating cable car ride to the summit of South Africa's most famous landmark.$q$,
  '/images/attractions/table-mountain.jpg','Tafelberg Road, Cape Town',1),
 ('cape-point-cape-of-good-hope','Cape Point & Cape of Good Hope',
  $q$Explore dramatic sea cliffs, rugged hiking paths, and historic lighthouses at the southwestern tip of the African continent inside Table Mountain National Park.$q$,
  '/images/attractions/cape-point.jpg','Cape Point, Table Mountain National Park',2),
 ('lions-head','Lion''s Head',
  $q$An iconic peak offering a popular round-trip hike with unmatched 360-degree views of the city, ocean, and coastal mountains at sunrise or sunset.$q$,
  '/images/attractions/lions-head.jpg','Signal Hill Road, Cape Town',3),
 ('kirstenbosch-national-botanical-garden','Kirstenbosch National Botanical Garden',
  $q$Discover South Africa's native fynbos flora and stroll along the famous "Boomslang" tree canopy walkway set against the backdrop of Table Mountain.$q$,
  '/images/attractions/kirstenbosch.jpg','Rhodes Drive, Newlands',4),
 ('boulders-beach-penguin-colony','Boulders Beach Penguin Colony',
  $q$Walk along scenic coastal boardwalks in Simon's Town to observe wild African penguins thriving in their natural habitat.$q$,
  '/images/attractions/boulders-beach.jpg','Simon''s Town',5),
 ('duiker-island-seal-cruise','Duiker Island Seal Cruise',
  $q$Depart from Hout Bay Harbor on a short boat charter to see thousands of Cape fur seals resting and swimming around a rugged rocky outcrop.$q$,
  '/images/attractions/duiker-island.jpg','Hout Bay Harbour',6),
 ('tandem-paragliding-signal-hill','Tandem Paragliding from Signal Hill',
  $q$Soar over Camps Bay and the Atlantic Seaboard on a tandem flight for an exhilarating aerial view of Cape Town's coastline.$q$,
  '/images/attractions/paragliding.jpg','Signal Hill, Cape Town',7),
 ('va-waterfront-sea-kayaking','V&A Waterfront Sea Kayaking',
  $q$Paddle past the harbor coastline and coastal canals, taking in unique ocean views of Table Mountain while spotting local marine life.$q$,
  '/images/attractions/sea-kayaking.jpg','V&A Waterfront, Cape Town',8),
 ('bo-kaap-historic-district','Bo-Kaap Historic District',
  $q$Wander through vibrant, pastel-painted streets, uncover rich Cape Malay heritage, and sample authentic local spices and cuisine.$q$,
  '/images/attractions/bo-kaap.jpg','Bo-Kaap, Cape Town',9),
 ('robben-island-museum','Robben Island Museum',
  $q$Take a short ferry ride across Table Bay to tour the historic maximum-security prison where Nelson Mandela spent 18 years of his life.$q$,
  '/images/attractions/robben-island.jpg','Robben Island, Table Bay',10),
 ('zeitz-mocaa','Zeitz MOCAA',
  $q$Visit the world's largest collection of contemporary African art, housed inside a transformed industrial grain silo complex at the V&A Waterfront.$q$,
  '/images/attractions/zeitz-mocaa.jpg','Silo District, V&A Waterfront',11),
 ('district-six-museum','District Six Museum',
  $q$Learn about Cape Town's history and the stories of thousands of residents forcibly relocated during the Apartheid era.$q$,
  '/images/attractions/district-six.jpg','25A Buitenkant Street, Cape Town',12)
) as v(slug, name, description, image, location, sort_order)
where d.slug = 'cape-town';

-- =============================================================================
-- ATTRACTIONS — Stellenbosch (7), client copy verbatim
-- =============================================================================
insert into public.attractions (destination_id, slug, name, description, image, location, sort_order)
select d.id, v.slug, v.name, v.description, v.image, v.location, v.sort_order
from public.destinations d,
(values
 ('historic-dorp-street','Historic Dorp Street',
  $q$Stroll through one of South Africa's oldest avenues, shaded by ancient oak trees and lined with heritage Cape Dutch architecture, cafes, and boutiques.$q$,
  '/images/attractions/dorp-street.jpg','Dorp Street, Stellenbosch',1),
 ('stellenbosch-village-museum','Stellenbosch Village Museum',
  $q$Step back in time through four meticulously restored historical houses showcasing life in the town from the early 1700s to the mid-1800s.$q$,
  '/images/attractions/village-museum.jpg','18 Ryneveld Street, Stellenbosch',2),
 ('jonkershoek-nature-reserve','Jonkershoek Nature Reserve',
  $q$A dramatic mountain valley ideal for hiking, mountain biking, and exploring scenic wilderness trails leading to pristine waterfalls.$q$,
  '/images/attractions/jonkershoek.jpg','Jonkershoek Valley, Stellenbosch',3),
 ('dylan-lewis-sculpture-garden','Dylan Lewis Sculpture Garden',
  $q$Explore a 7-hectare manicured landscape where over 60 bronze sculptures of wild cats and human forms blend seamlessly into nature.$q$,
  '/images/attractions/dylan-lewis.jpg','Paradyskloof, Stellenbosch',4),
 ('rupert-museum','Rupert Museum',
  $q$Discover an exceptional private collection showcasing seminal 20th-century South African artwork, painting, and sculpture.$q$,
  '/images/attractions/rupert-museum.jpg','Stellentia Avenue, Stellenbosch',5),
 ('stellenbosch-university-botanical-garden','Stellenbosch University Botanical Garden',
  $q$Explore the country's oldest university garden, featuring specialized glasshouses filled with rare succulents, water lilies, and tropical plants.$q$,
  '/images/attractions/su-botanical-garden.jpg','Neethling Street, Stellenbosch',6),
 ('root44-market','Root44 Market',
  $q$A bustling destination offering local artisan craft stalls, street food vendors, live acoustic music, and a lively atmosphere.$q$,
  '/images/attractions/root44.jpg','Audacia Wine Farm, Stellenbosch',7)
) as v(slug, name, description, image, location, sort_order)
where d.slug = 'stellenbosch';

-- =============================================================================
-- TOURS — every one built from the attractions above
-- =============================================================================
insert into public.tours
  (slug, destination_id, name, summary, description, duration_days,
   price_adult_zar, price_child_zar, capacity, category, difficulty,
   is_featured, status, pickup_info, images, inclusions, exclusions, itinerary,
   seo_title, seo_description)
select v.slug, d.id, v.name, v.summary, v.description, v.duration_days,
       v.price_adult, v.price_child, v.capacity, v.category, v.difficulty,
       v.is_featured, 'published', v.pickup_info,
       v.images::jsonb, v.inclusions::jsonb, v.exclusions::jsonb, v.itinerary::jsonb,
       v.seo_title, v.seo_description
from public.destinations d,
(values
 ('cape-town-explorer','cape-town','Cape Town Explorer',
  $q$The full sweep of the city in one day — the summit, the Cape, the penguins and the painted streets of Bo-Kaap.$q$,
  $q$Our most complete Cape Town day. We start at the cableway before the queue builds, run south along the Atlantic seaboard to Cape Point, reach Boulders Beach in the late afternoon once the coach tours have left, and finish in Bo-Kaap.$q$,
  1, 2450, 1225, 14, 'day_tour', 'easy', true,
  'Hotel pickup anywhere in the Cape Town bowl, Atlantic Seaboard or V&A Waterfront, from 07:45.',
  '["/images/tours/cape-town-explorer-1.jpg","/images/tours/cape-town-explorer-2.jpg","/images/tours/cape-town-explorer-3.jpg"]',
  '["Private air-conditioned vehicle with driver-guide","Table Mountain cableway ticket","Cape Point Nature Reserve entrance","Boulders Beach entrance","Bottled water and on-board Wi-Fi","Hotel pickup and drop-off"]',
  '["Lunch and drinks","Flying Dutchman funicular at Cape Point","Gratuities"]',
  '[{"day":1,"title":"Summit, Cape and penguins","description":"Cableway at opening, then Chapman''s Peak Drive to Cape Point and the Cape of Good Hope. Boulders Beach mid-afternoon, returning through Bo-Kaap by around 17:30."}]',
  'Cape Town Explorer — Full-Day Private Tour',
  'Full-day private Cape Town tour: Table Mountain, Cape Point, Boulders Beach penguins and Bo-Kaap. Entrance fees and hotel pickup included.'),

 ('cape-town-highlights','cape-town','Cape Town Highlights',
  $q$A half day covering the city''s essentials — the summit, the Bo-Kaap, and the museums that explain how Cape Town came to be.$q$,
  $q$Built for travellers with one spare morning. The cableway first, then the old city on foot, with the District Six Museum and Zeitz MOCAA for anyone who wants the history and the art rather than only the view.$q$,
  1, 1650, 825, 14, 'cultural', 'easy', true,
  'Hotel pickup in the Cape Town bowl or V&A Waterfront at 08:00.',
  '["/images/tours/cape-town-highlights-1.jpg","/images/tours/cape-town-highlights-2.jpg"]',
  '["Private vehicle with driver-guide","Guided walking sections of the city centre and Bo-Kaap","Bottled water","Hotel pickup and drop-off"]',
  '["Table Mountain cableway ticket (booked for you at cost)","Museum entrance fees","Lunch"]',
  '[{"day":1,"title":"Mountain, museums and the Malay Quarter","description":"Cableway at opening, then the Company''s Garden, District Six Museum, Bo-Kaap and Zeitz MOCAA, finishing at the V&A Waterfront around 14:00."}]',
  'Cape Town Highlights — Half-Day City Tour',
  'Half-day Cape Town city tour with an early Table Mountain ascent, Bo-Kaap, District Six Museum and Zeitz MOCAA.'),

 ('cape-town-adventure','cape-town','Cape Town Adventure',
  $q$Paraglide off Signal Hill, kayak the harbour coastline, and hike Lion''s Head for sunset. One day, three ways to see the city from outside a vehicle.$q$,
  $q$For travellers who would rather do than look. Weather decides the running order — paragliding needs the right wind and we will restructure the day rather than fly you in the wrong conditions.$q$,
  1, 3850, 0, 8, 'adventure', 'moderate', true,
  'Hotel pickup in Cape Town or Camps Bay at 07:00. Minimum age 16 for the tandem flight.',
  '["/images/tours/cape-town-adventure-1.jpg","/images/tours/cape-town-adventure-2.jpg"]',
  '["Tandem paragliding flight with a licensed pilot","Guided sea kayaking with all equipment","Guided Lion''s Head sunset hike","Private vehicle between activities","Bottled water and snacks"]',
  '["Lunch","Personal insurance","Photographs and video from the pilot","Gratuities"]',
  '[{"day":1,"title":"Air, sea and summit","description":"Tandem flight from Signal Hill in the morning while the wind is right, kayaking at the V&A after lunch, then the Lion''s Head hike timed for sunset."}]',
  'Cape Town Adventure — Paragliding, Kayaking & Lion''s Head',
  'Full-day Cape Town adventure: tandem paragliding from Signal Hill, sea kayaking at the V&A Waterfront and a guided Lion''s Head sunset hike.'),

 ('cape-peninsula-full-day','cape-town','Cape Peninsula Full-Day Tour',
  $q$Chapman''s Peak, Cape Point and the Boulders Beach penguins, driven anti-clockwise so you reach the penguins after the tour buses have left.$q$,
  $q$The classic peninsula loop, run the opposite way round to everyone else. Coach tours reach Boulders between 11:00 and 13:00; going the other way puts you there in the late afternoon with better light and far fewer people.$q$,
  1, 2250, 1125, 14, 'day_tour', 'easy', false,
  'Hotel pickup in Cape Town, Camps Bay or the V&A Waterfront at 08:30.',
  '["/images/tours/cape-peninsula-1.jpg","/images/tours/cape-peninsula-2.jpg"]',
  '["Private vehicle with driver-guide","Cape Point Nature Reserve entrance","Boulders Beach entrance","Duiker Island seal cruise from Hout Bay","Bottled water"]',
  '["Lunch and drinks","Flying Dutchman funicular","Gratuities"]',
  '[{"day":1,"title":"The peninsula, anti-clockwise","description":"Sea Point and Camps Bay, over Chapman''s Peak to Hout Bay for the seal cruise, south to Cape Point, then Boulders Beach late afternoon."}]',
  'Cape Peninsula Full-Day Private Tour',
  'Private Cape Peninsula tour — Chapman''s Peak, Duiker Island seals, Cape Point and the Boulders Beach penguins. Entrance fees included.'),

 ('robben-island-history','cape-town','Robben Island & Cape Town History',
  $q$The prison, the museum and the neighbourhood — the three places that together explain twentieth-century Cape Town.$q$,
  $q$A deliberately serious day. The Robben Island ferry is weather-dependent and books out well ahead, so we secure your slot at the time of booking rather than on the day.$q$,
  1, 1950, 975, 12, 'cultural', 'easy', false,
  'Hotel pickup at 07:30. Ferry departs from the Nelson Mandela Gateway at the V&A Waterfront.',
  '["/images/tours/robben-island-1.jpg","/images/tours/robben-island-2.jpg"]',
  '["Robben Island ferry and guided prison tour","District Six Museum entrance","Guided walk through Bo-Kaap","Private vehicle with guide","Bottled water"]',
  '["Lunch","Gratuities"]',
  '[{"day":1,"title":"Island, museum, neighbourhood","description":"Morning ferry to Robben Island with a former political prisoner as guide, then District Six Museum and Bo-Kaap in the afternoon."}]',
  'Robben Island & Cape Town History Tour',
  'Guided Robben Island tour with the District Six Museum and Bo-Kaap. Ferry tickets secured at booking.'),

 ('stellenbosch-heritage-wine','stellenbosch','Stellenbosch Heritage & Wine Day',
  $q$Oak-lined Dorp Street, four restored 18th-century houses, the Rupert collection and the Root44 market — with a driver, so nobody has to count tastings.$q$,
  $q$Stellenbosch is close enough to Cape Town to be a day trip and good enough to deserve two. This is the heritage version: architecture and art in the morning, market and tastings in the afternoon.$q$,
  1, 2650, 1325, 12, 'wine', 'easy', true,
  'Hotel pickup in Cape Town at 08:30, or meet us in Stellenbosch at 09:30.',
  '["/images/tours/stellenbosch-heritage-1.jpg","/images/tours/stellenbosch-heritage-2.jpg"]',
  '["Private vehicle with professional driver","Stellenbosch Village Museum entrance","Rupert Museum entrance","Guided walk along Dorp Street","Tastings at two estates","Bottled water"]',
  '["Lunch","Wine purchases","Gratuities"]',
  '[{"day":1,"title":"Heritage, art and the market","description":"Dorp Street and the Village Museum in the morning, the Rupert Museum before lunch, then Root44 Market and two cellar tastings."}]',
  'Stellenbosch Heritage & Wine Day Tour',
  'Private Stellenbosch day tour — historic Dorp Street, the Village Museum, the Rupert Museum, Root44 Market and two wine estates.'),

 ('jonkershoek-sculpture-garden','stellenbosch','Jonkershoek & Sculpture Garden',
  $q$A mountain valley walk in the morning and 60 bronze sculptures set into 7 hectares of landscaped fynbos in the afternoon.$q$,
  $q$The outdoor half of Stellenbosch. Jonkershoek trails run from gentle valley paths to serious ascents, so we match the route to the group rather than the brochure.$q$,
  1, 2150, 1075, 10, 'adventure', 'moderate', false,
  'Hotel pickup in Cape Town at 07:30, or meet us in Stellenbosch at 08:30.',
  '["/images/tours/jonkershoek-1.jpg","/images/tours/jonkershoek-2.jpg"]',
  '["Private vehicle with driver-guide","Jonkershoek Nature Reserve entrance","Dylan Lewis Sculpture Garden entrance and guided walk","Stellenbosch University Botanical Garden entrance","Packed trail lunch and water"]',
  '["Dinner","Hiking equipment","Gratuities"]',
  '[{"day":1,"title":"Valley, sculpture, glasshouse","description":"Morning walk in Jonkershoek matched to the group, then the Dylan Lewis Sculpture Garden after lunch and the university botanical garden glasshouses."}]',
  'Jonkershoek & Dylan Lewis Sculpture Garden Tour',
  'Stellenbosch outdoor day tour — hiking in Jonkershoek Nature Reserve, the Dylan Lewis Sculpture Garden and the university botanical garden.')
) as v(slug, dest_slug, name, summary, description, duration_days, price_adult,
       price_child, capacity, category, difficulty, is_featured, pickup_info,
       images, inclusions, exclusions, itinerary, seo_title, seo_description)
where d.slug = v.dest_slug;

-- =============================================================================
-- TOUR <-> ATTRACTION links
-- =============================================================================
insert into public.tour_attractions (tour_id, attraction_id, sort_order)
select t.id, a.id, v.sort_order
from (values
 ('cape-town-explorer','table-mountain-aerial-cableway',1),
 ('cape-town-explorer','cape-point-cape-of-good-hope',2),
 ('cape-town-explorer','boulders-beach-penguin-colony',3),
 ('cape-town-explorer','bo-kaap-historic-district',4),
 ('cape-town-explorer','va-waterfront-sea-kayaking',5),
 ('cape-town-highlights','table-mountain-aerial-cableway',1),
 ('cape-town-highlights','bo-kaap-historic-district',2),
 ('cape-town-highlights','district-six-museum',3),
 ('cape-town-highlights','zeitz-mocaa',4),
 ('cape-town-adventure','tandem-paragliding-signal-hill',1),
 ('cape-town-adventure','va-waterfront-sea-kayaking',2),
 ('cape-town-adventure','lions-head',3),
 ('cape-peninsula-full-day','cape-point-cape-of-good-hope',1),
 ('cape-peninsula-full-day','boulders-beach-penguin-colony',2),
 ('cape-peninsula-full-day','duiker-island-seal-cruise',3),
 ('robben-island-history','robben-island-museum',1),
 ('robben-island-history','district-six-museum',2),
 ('robben-island-history','bo-kaap-historic-district',3),
 ('stellenbosch-heritage-wine','historic-dorp-street',1),
 ('stellenbosch-heritage-wine','stellenbosch-village-museum',2),
 ('stellenbosch-heritage-wine','rupert-museum',3),
 ('stellenbosch-heritage-wine','root44-market',4),
 ('jonkershoek-sculpture-garden','jonkershoek-nature-reserve',1),
 ('jonkershoek-sculpture-garden','dylan-lewis-sculpture-garden',2),
 ('jonkershoek-sculpture-garden','stellenbosch-university-botanical-garden',3)
) as v(tour_slug, attraction_slug, sort_order)
join public.tours t       on t.slug = v.tour_slug
join public.attractions a on a.slug = v.attraction_slug;

-- =============================================================================
-- TOUR DATES — availability the demo can actually exercise
--
-- Every tour gets departures every 3 days for the next 90 days. Then we
-- deliberately create the three states from the brief on the Cape Town
-- Explorer so the availability UI can be seen working:
--     available  /  only N seats remaining  /  fully booked
-- =============================================================================
insert into public.tour_dates (tour_id, tour_date, capacity, seats_booked, status)
select t.id, d::date, t.capacity, 0, 'open'
from public.tours t
cross join generate_series(current_date + 7, current_date + 90, interval '3 days') as d
on conflict (tour_id, tour_date) do nothing;

-- Nearly full: 3 seats left of 14
update public.tour_dates td
set seats_booked = td.capacity - 3
from public.tours t
where t.id = td.tour_id
  and t.slug = 'cape-town-explorer'
  and td.tour_date = (
    select min(tour_date) from public.tour_dates x
    where x.tour_id = t.id and x.tour_date > current_date + 9
  );

-- Fully booked
update public.tour_dates td
set seats_booked = td.capacity
from public.tours t
where t.id = td.tour_id
  and t.slug = 'cape-town-explorer'
  and td.tour_date = (
    select min(tour_date) from public.tour_dates x
    where x.tour_id = t.id and x.tour_date > current_date + 15
  );

-- A closed date, to prove the status is respected independently of capacity
update public.tour_dates td
set status = 'closed'
from public.tours t
where t.id = td.tour_id
  and t.slug = 'stellenbosch-heritage-wine'
  and td.tour_date = (
    select min(tour_date) from public.tour_dates x
    where x.tour_id = t.id and x.tour_date > current_date + 21
  );

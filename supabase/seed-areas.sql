-- =============================================================================
-- Cape Town & Western Cape areas and attractions.
--
-- Source: the client's A-to-Z guide. That guide is AI-generated (partly cited
-- to Cape Town Tourism), so EVERY row here is inserted as status='draft':
-- visible in the admin panel, invisible to the public, until someone has
-- checked it and confirmed the agency actually operates there.
--
-- Additive and idempotent — no TRUNCATE, ON CONFLICT DO NOTHING throughout.
-- Safe to re-run, and it cannot destroy bookings.
--
-- Run AFTER 0006_destination_hierarchy.sql.
-- =============================================================================


-- --- destinations / areas ---------------------------------------------------

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$city-centre$q$, $q$Cape Town City Centre$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$The historic heart of the city: the Company's Garden, Greenmarket Square, the Castle of Good Hope and the restaurant strips of Long and Bree Street, all walkable in an afternoon.$q$,
  array[$q$First-time visitors$q$,$q$History$q$,$q$Food$q$,$q$Nightlife$q$]::text[], $q$Half day$q$,
  $q$Cape Town City Centre — Travel Guide & Tours$q$,
  $q$The historic heart of the city: the Company's Garden, Greenmarket Square, the Castle of Good Hope and the restaurant strips of Long and Bree Street, all wa$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$va-waterfront$q$, $q$V&A Waterfront$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$A working harbour turned into the city's busiest visitor precinct — restaurants, shopping, the Two Oceans Aquarium, harbour cruises, and the departure point for Robben Island ferries.$q$,
  array[$q$Families$q$,$q$Shopping$q$,$q$Dining$q$,$q$First-time visitors$q$]::text[], $q$Half to full day$q$,
  $q$V&A Waterfront — Travel Guide & Tours$q$,
  $q$A working harbour turned into the city's busiest visitor precinct — restaurants, shopping, the Two Oceans Aquarium, harbour cruises, and the departure poin$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$sea-point$q$, $q$Sea Point$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$A dense seaside neighbourhood built along a paved promenade that runs for kilometres beside the Atlantic. Best walked in the late afternoon, into the sunset.$q$,
  array[$q$Families$q$,$q$Couples$q$,$q$Walking$q$,$q$Ocean views$q$]::text[], $q$2-3 hours$q$,
  $q$Sea Point — Travel Guide & Tours$q$,
  $q$A dense seaside neighbourhood built along a paved promenade that runs for kilometres beside the Atlantic. Best walked in the late afternoon, into the sunse$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$green-point$q$, $q$Green Point$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$Between the Waterfront and Sea Point, with a large urban park, the stadium built for 2010, and the red-and-white Mouille Point lighthouse on the shoreline.$q$,
  array[$q$Families$q$,$q$Parks$q$,$q$Walking$q$]::text[], $q$2 hours$q$,
  $q$Green Point — Travel Guide & Tours$q$,
  $q$Between the Waterfront and Sea Point, with a large urban park, the stadium built for 2010, and the red-and-white Mouille Point lighthouse on the shoreline.$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$signal-hill$q$, $q$Signal Hill$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$A road runs to the top of the ridge beside Lion's Head, giving the easiest high viewpoint in the city — no hiking required. Come for sunset.$q$,
  array[$q$Sunset$q$,$q$Photography$q$,$q$Picnics$q$]::text[], $q$1-2 hours$q$,
  $q$Signal Hill — Travel Guide & Tours$q$,
  $q$A road runs to the top of the ridge beside Lion's Head, giving the easiest high viewpoint in the city — no hiking required. Come for sunset.$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$lions-head$q$, $q$Lion's Head$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$The spiralling path up Lion's Head is Cape Town's most popular hike: a round trip of roughly two hours for 360-degree views over the city, Camps Bay and the Atlantic.$q$,
  array[$q$Hiking$q$,$q$Sunrise and sunset$q$,$q$Photography$q$]::text[], $q$2-3 hours$q$,
  $q$Lion's Head — Travel Guide & Tours$q$,
  $q$The spiralling path up Lion's Head is Cape Town's most popular hike: a round trip of roughly two hours for 360-degree views over the city, Camps Bay and th$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$camps-bay$q$, $q$Camps Bay$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$A white beach below the Twelve Apostles, with a strip of restaurants and bars directly across the road. The most dramatic beach setting in the city, and the busiest in season.$q$,
  array[$q$Beaches$q$,$q$Sunset$q$,$q$Restaurants$q$]::text[], $q$Half day$q$,
  $q$Camps Bay — Travel Guide & Tours$q$,
  $q$A white beach below the Twelve Apostles, with a strip of restaurants and bars directly across the road. The most dramatic beach setting in the city, and th$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$clifton$q$, $q$Clifton$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$Four sheltered coves numbered First to Fourth, reached by steps down from Victoria Road. Sheltered from the south-easter, which is why locals go there when Camps Bay is windy.$q$,
  array[$q$Beaches$q$,$q$Swimming$q$,$q$Sunbathing$q$]::text[], $q$Half day$q$,
  $q$Clifton — Travel Guide & Tours$q$,
  $q$Four sheltered coves numbered First to Fourth, reached by steps down from Victoria Road. Sheltered from the south-easter, which is why locals go there when$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$llandudno$q$, $q$Llandudno$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$A small residential cove with no shops or commercial development at all — which is precisely the appeal. Parking is limited and fills early.$q$,
  array[$q$Quiet beaches$q$,$q$Photography$q$,$q$Sunset$q$]::text[], $q$2-3 hours$q$,
  $q$Llandudno — Travel Guide & Tours$q$,
  $q$A small residential cove with no shops or commercial development at all — which is precisely the appeal. Parking is limited and fills early.$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$hout-bay$q$, $q$Hout Bay$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$A fishing village hemmed in by mountains, with a working harbour, fish-and-chip restaurants, a weekend market, and boat trips out to the Duiker Island seal colony.$q$,
  array[$q$Seafood$q$,$q$Boat trips$q$,$q$Scenic drives$q$]::text[], $q$Half day$q$,
  $q$Hout Bay — Travel Guide & Tours$q$,
  $q$A fishing village hemmed in by mountains, with a working harbour, fish-and-chip restaurants, a weekend market, and boat trips out to the Duiker Island seal$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$noordhoek$q$, $q$Noordhoek$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$At the southern foot of Chapman's Peak, with an eight-kilometre beach wide enough to feel empty, horse riding along the sand, and a farm village of cafes and shops.$q$,
  array[$q$Beach walks$q$,$q$Horse riding$q$,$q$Relaxation$q$]::text[], $q$Half day$q$,
  $q$Noordhoek — Travel Guide & Tours$q$,
  $q$At the southern foot of Chapman's Peak, with an eight-kilometre beach wide enough to feel empty, horse riding along the sand, and a farm village of cafes a$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$kommetjie$q$, $q$Kommetjie$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$A quiet seaside village known for its lighthouse, long reef break and kelp-strewn shoreline. Popular with surfers and almost nobody else.$q$,
  array[$q$Surfing$q$,$q$Beach walks$q$,$q$Photography$q$]::text[], $q$2 hours$q$,
  $q$Kommetjie — Travel Guide & Tours$q$,
  $q$A quiet seaside village known for its lighthouse, long reef break and kelp-strewn shoreline. Popular with surfers and almost nobody else.$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$scarborough$q$, $q$Scarborough$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$The last village before Cape Point, backed by fynbos-covered hills. Undeveloped, exposed, and worth the stop on a peninsula drive.$q$,
  array[$q$Nature$q$,$q$Beach$q$,$q$Relaxation$q$]::text[], $q$1-2 hours$q$,
  $q$Scarborough — Travel Guide & Tours$q$,
  $q$The last village before Cape Point, backed by fynbos-covered hills. Undeveloped, exposed, and worth the stop on a peninsula drive.$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$simons-town$q$, $q$Simon's Town$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$A naval town on the warmer False Bay side, with Victorian shopfronts along St George's Street, the South African Naval Museum, and the Boulders penguin colony minutes away.$q$,
  array[$q$History$q$,$q$Families$q$,$q$Wildlife$q$]::text[], $q$Half day$q$,
  $q$Simon's Town — Travel Guide & Tours$q$,
  $q$A naval town on the warmer False Bay side, with Victorian shopfronts along St George's Street, the South African Naval Museum, and the Boulders penguin col$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$boulders-beach-area$q$, $q$Boulders Beach$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$Granite boulders shelter a colony of several thousand African penguins. Boardwalks keep visitors off the nesting areas while getting you within a few metres of the birds.$q$,
  array[$q$Families$q$,$q$Wildlife$q$,$q$Photography$q$]::text[], $q$1-2 hours$q$,
  $q$Boulders Beach — Travel Guide & Tours$q$,
  $q$Granite boulders shelter a colony of several thousand African penguins. Boardwalks keep visitors off the nesting areas while getting you within a few metre$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$cape-point-area$q$, $q$Cape Point & Cape of Good Hope$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$The rocky tip of the peninsula inside Table Mountain National Park: two lighthouses, cliff-top walks, the Flying Dutchman funicular, and baboons that will open an unattended car.$q$,
  array[$q$Hiking$q$,$q$Viewpoints$q$,$q$Wildlife$q$]::text[], $q$Half to full day$q$,
  $q$Cape Point & Cape of Good Hope — Travel Guide & Tours$q$,
  $q$The rocky tip of the peninsula inside Table Mountain National Park: two lighthouses, cliff-top walks, the Flying Dutchman funicular, and baboons that will $q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$muizenberg$q$, $q$Muizenberg$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$A long, gently shelving beach on False Bay, lined with the painted Victorian bathing boxes that appear on every Cape Town postcard. The best place in the city to learn to surf.$q$,
  array[$q$Surfing$q$,$q$Beginners$q$,$q$Photography$q$]::text[], $q$Half day$q$,
  $q$Muizenberg — Travel Guide & Tours$q$,
  $q$A long, gently shelving beach on False Bay, lined with the painted Victorian bathing boxes that appear on every Cape Town postcard. The best place in the c$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$st-james$q$, $q$St James$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$A tidal pool and a row of brightly painted changing huts, with the coastal railway running along the shoreline. Small, and best combined with Muizenberg and Kalk Bay.$q$,
  array[$q$Photography$q$,$q$Swimming$q$,$q$Families$q$]::text[], $q$1 hour$q$,
  $q$St James — Travel Guide & Tours$q$,
  $q$A tidal pool and a row of brightly painted changing huts, with the coastal railway running along the shoreline. Small, and best combined with Muizenberg an$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$kalk-bay$q$, $q$Kalk Bay$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$A working fishing harbour where boats still land their catch on the quay, surrounded by antique shops, bookshops and some of the best seafood on the peninsula.$q$,
  array[$q$Seafood$q$,$q$Browsing$q$,$q$Harbour life$q$]::text[], $q$Half day$q$,
  $q$Kalk Bay — Travel Guide & Tours$q$,
  $q$A working fishing harbour where boats still land their catch on the quay, surrounded by antique shops, bookshops and some of the best seafood on the penins$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$constantia$q$, $q$Constantia$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$The oldest wine-growing area in South Africa, in a green valley on the mountain's eastern slopes — estates and their restaurants twenty minutes from the city centre.$q$,
  array[$q$Wine$q$,$q$Fine dining$q$,$q$Scenery$q$]::text[], $q$Half to full day$q$,
  $q$Constantia — Travel Guide & Tours$q$,
  $q$The oldest wine-growing area in South Africa, in a green valley on the mountain's eastern slopes — estates and their restaurants twenty minutes from the ci$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$newlands$q$, $q$Newlands$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$Indigenous forest walks on the back of Table Mountain, and the cricket and rugby grounds that share the suburb's name.$q$,
  array[$q$Forest walks$q$,$q$Sport$q$,$q$Nature$q$]::text[], $q$2-3 hours$q$,
  $q$Newlands — Travel Guide & Tours$q$,
  $q$Indigenous forest walks on the back of Table Mountain, and the cricket and rugby grounds that share the suburb's name.$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$woodstock$q$, $q$Woodstock$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$A former industrial suburb now full of galleries, design studios, street art and weekend food markets. Best explored on foot, and best with someone who knows the blocks.$q$,
  array[$q$Art$q$,$q$Markets$q$,$q$Urban culture$q$]::text[], $q$Half day$q$,
  $q$Woodstock — Travel Guide & Tours$q$,
  $q$A former industrial suburb now full of galleries, design studios, street art and weekend food markets. Best explored on foot, and best with someone who kno$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$observatory$q$, $q$Observatory$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$A student neighbourhood of Victorian cottages, cheap restaurants and late-night bars — the least polished and most lived-in part of the city visitors see.$q$,
  array[$q$Nightlife$q$,$q$Cafes$q$,$q$Local culture$q$]::text[], $q$Evening$q$,
  $q$Observatory — Travel Guide & Tours$q$,
  $q$A student neighbourhood of Victorian cottages, cheap restaurants and late-night bars — the least polished and most lived-in part of the city visitors see.$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$bloubergstrand$q$, $q$Bloubergstrand$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$North of the city across Table Bay, and the source of the classic photograph of Table Mountain seen across the water. Strong wind makes it a kitesurfing centre.$q$,
  array[$q$Photography$q$,$q$Kitesurfing$q$,$q$Sunset$q$]::text[], $q$2-3 hours$q$,
  $q$Bloubergstrand — Travel Guide & Tours$q$,
  $q$North of the city across Table Bay, and the source of the classic photograph of Table Mountain seen across the water. Strong wind makes it a kitesurfing ce$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$robben-island$q$, $q$Robben Island$q$, (select id from public.destinations where slug = $q$cape-town$q$), $q$area$q$, $q$Cape Town & Peninsula$q$,
  'Western Cape', 'South Africa',
  $q$A World Heritage Site in Table Bay, reached by ferry from the Waterfront. Tours of the maximum-security prison are led by former political prisoners.$q$,
  array[$q$History$q$,$q$Guided tours$q$]::text[], $q$Half day$q$,
  $q$Robben Island — Travel Guide & Tours$q$,
  $q$A World Heritage Site in Table Bay, reached by ferry from the Waterfront. Tours of the maximum-security prison are led by former political prisoners.$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$franschhoek$q$, $q$Franschhoek$q$, null, $q$wine_area$q$, $q$Cape Winelands$q$,
  'Western Cape', 'South Africa',
  $q$A single valley closed off by mountains on three sides, settled by French Huguenots in 1688. An outsized concentration of serious restaurants, and the wine tram that links the estates.$q$,
  array[$q$Couples$q$,$q$Fine dining$q$,$q$Wine$q$,$q$Luxury$q$]::text[], $q$One to two days$q$,
  $q$Franschhoek — Travel Guide & Tours$q$,
  $q$A single valley closed off by mountains on three sides, settled by French Huguenots in 1688. An outsized concentration of serious restaurants, and the wine$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$paarl$q$, $q$Paarl$q$, null, $q$wine_area$q$, $q$Cape Winelands$q$,
  'Western Cape', 'South Africa',
  $q$Built below three enormous granite domes that give the town its name. Larger and less visited than Stellenbosch or Franschhoek, with the wine estates to match.$q$,
  array[$q$Wine$q$,$q$Hiking$q$,$q$Historic town$q$]::text[], $q$One day$q$,
  $q$Paarl — Travel Guide & Tours$q$,
  $q$Built below three enormous granite domes that give the town its name. Larger and less visited than Stellenbosch or Franschhoek, with the wine estates to ma$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$somerset-west$q$, $q$Somerset West$q$, null, $q$wine_area$q$, $q$Cape Winelands$q$,
  'Western Cape', 'South Africa',
  $q$At the foot of the Helderberg, with cool-climate wine estates on the mountain slopes and the False Bay coastline a few minutes south.$q$,
  array[$q$Wine$q$,$q$Scenic drives$q$,$q$Restaurants$q$]::text[], $q$Half to full day$q$,
  $q$Somerset West — Travel Guide & Tours$q$,
  $q$At the foot of the Helderberg, with cool-climate wine estates on the mountain slopes and the False Bay coastline a few minutes south.$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$hermanus$q$, $q$Hermanus$q$, null, $q$coastal_town$q$, $q$Overberg & Whale Coast$q$,
  'Western Cape', 'South Africa',
  $q$Southern right whales come into Walker Bay to calve between June and November, and the cliff path above the town gives land-based whale watching that beats most boat trips.$q$,
  array[$q$Whale watching$q$,$q$Cliff walks$q$,$q$Ocean views$q$]::text[], $q$One day$q$,
  $q$Hermanus — Travel Guide & Tours$q$,
  $q$Southern right whales come into Walker Bay to calve between June and November, and the cliff path above the town gives land-based whale watching that beats$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$gansbaai$q$, $q$Gansbaai$q$, null, $q$coastal_town$q$, $q$Overberg & Whale Coast$q$,
  'Western Cape', 'South Africa',
  $q$A fishing town east of Hermanus, best known for marine wildlife tours in the channel between the mainland and Dyer Island.$q$,
  array[$q$Marine wildlife$q$,$q$Boat tours$q$,$q$Coastal scenery$q$]::text[], $q$One day$q$,
  $q$Gansbaai — Travel Guide & Tours$q$,
  $q$A fishing town east of Hermanus, best known for marine wildlife tours in the channel between the mainland and Dyer Island.$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$bettys-bay$q$, $q$Betty's Bay$q$, null, $q$coastal_town$q$, $q$Overberg & Whale Coast$q$,
  'Western Cape', 'South Africa',
  $q$A scattered village between mountain and sea, with the Stony Point penguin colony and the Harold Porter botanical garden within a few minutes of each other.$q$,
  array[$q$Penguins$q$,$q$Gardens$q$,$q$Beaches$q$]::text[], $q$Half day$q$,
  $q$Betty's Bay — Travel Guide & Tours$q$,
  $q$A scattered village between mountain and sea, with the Stony Point penguin colony and the Harold Porter botanical garden within a few minutes of each other$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$pringle-bay$q$, $q$Pringle Bay$q$, null, $q$coastal_town$q$, $q$Overberg & Whale Coast$q$,
  'Western Cape', 'South Africa',
  $q$A small holiday village under Hangklip, with an empty beach and almost no commercial development. A stop on the Clarence Drive rather than a destination in itself.$q$,
  array[$q$Beach walks$q$,$q$Nature$q$,$q$Quiet$q$]::text[], $q$1-2 hours$q$,
  $q$Pringle Bay — Travel Guide & Tours$q$,
  $q$A small holiday village under Hangklip, with an empty beach and almost no commercial development. A stop on the Clarence Drive rather than a destination in$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$gordons-bay$q$, $q$Gordon's Bay$q$, null, $q$coastal_town$q$, $q$Overberg & Whale Coast$q$,
  'Western Cape', 'South Africa',
  $q$Where the mountains meet False Bay and the Clarence Drive begins. A harbour, a sheltered beach, and the start of one of the country's great coastal roads.$q$,
  array[$q$Beach$q$,$q$Harbour$q$,$q$Scenic drives$q$]::text[], $q$Half day$q$,
  $q$Gordon's Bay — Travel Guide & Tours$q$,
  $q$Where the mountains meet False Bay and the Clarence Drive begins. A harbour, a sheltered beach, and the start of one of the country's great coastal roads.$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$cape-agulhas$q$, $q$Cape Agulhas$q$, null, $q$coastal_town$q$, $q$Overberg & Whale Coast$q$,
  'Western Cape', 'South Africa',
  $q$The true southernmost point of Africa, where the Atlantic and Indian Oceans are held to meet. A lighthouse, a stone marker, and a long low coastline of rock and sand.$q$,
  array[$q$Landmarks$q$,$q$Lighthouses$q$,$q$Road trips$q$]::text[], $q$Overnight trip$q$,
  $q$Cape Agulhas — Travel Guide & Tours$q$,
  $q$The true southernmost point of Africa, where the Atlantic and Indian Oceans are held to meet. A lighthouse, a stone marker, and a long low coastline of roc$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$worcester$q$, $q$Worcester$q$, null, $q$town$q$, $q$Breede River Valley$q$,
  'Western Cape', 'South Africa',
  $q$The gateway to the Breede River Valley through the Du Toitskloof tunnel, surrounded by vineyards and brandy distilleries under high mountains.$q$,
  array[$q$Wine$q$,$q$Brandy$q$,$q$Mountains$q$]::text[], $q$One day$q$,
  $q$Worcester — Travel Guide & Tours$q$,
  $q$The gateway to the Breede River Valley through the Du Toitskloof tunnel, surrounded by vineyards and brandy distilleries under high mountains.$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$robertson$q$, $q$Robertson$q$, null, $q$wine_area$q$, $q$Breede River Valley$q$,
  'Western Cape', 'South Africa',
  $q$A relaxed wine town on the Breede River, known for Chardonnay and Shiraz, river activities and a slower pace than the Cape Town winelands.$q$,
  array[$q$Wine$q$,$q$River activities$q$,$q$Countryside$q$]::text[], $q$One to two days$q$,
  $q$Robertson — Travel Guide & Tours$q$,
  $q$A relaxed wine town on the Breede River, known for Chardonnay and Shiraz, river activities and a slower pace than the Cape Town winelands.$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$montagu$q$, $q$Montagu$q$, null, $q$town$q$, $q$Breede River Valley$q$,
  'Western Cape', 'South Africa',
  $q$Reached through a narrow river gorge, with hot mineral springs, some of the best rock climbing in the country, and a preserved main street of Victorian houses.$q$,
  array[$q$Hot springs$q$,$q$Rock climbing$q$,$q$Hiking$q$]::text[], $q$One to two days$q$,
  $q$Montagu — Travel Guide & Tours$q$,
  $q$Reached through a narrow river gorge, with hot mineral springs, some of the best rock climbing in the country, and a preserved main street of Victorian hou$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$ceres$q$, $q$Ceres$q$, null, $q$nature$q$, $q$Breede River Valley$q$,
  'Western Cape', 'South Africa',
  $q$A fruit-farming valley ringed by high mountains that hold snow in winter — one of the few places in the Western Cape where it falls at all.$q$,
  array[$q$Mountains$q$,$q$Fruit farms$q$,$q$Winter scenery$q$]::text[], $q$One day$q$,
  $q$Ceres — Travel Guide & Tours$q$,
  $q$A fruit-farming valley ringed by high mountains that hold snow in winter — one of the few places in the Western Cape where it falls at all.$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$tulbagh$q$, $q$Tulbagh$q$, null, $q$town$q$, $q$Breede River Valley$q$,
  'Western Cape', 'South Africa',
  $q$A valley town whose Church Street holds the largest concentration of national monuments in South Africa, rebuilt after the 1969 earthquake.$q$,
  array[$q$Historic architecture$q$,$q$Wine$q$,$q$Mountains$q$]::text[], $q$One to two days$q$,
  $q$Tulbagh — Travel Guide & Tours$q$,
  $q$A valley town whose Church Street holds the largest concentration of national monuments in South Africa, rebuilt after the 1969 earthquake.$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$langebaan$q$, $q$Langebaan$q$, null, $q$coastal_town$q$, $q$West Coast$q$,
  'Western Cape', 'South Africa',
  $q$On a turquoise lagoon sheltered from the Atlantic swell, which makes it the centre for kitesurfing and kayaking on the West Coast, beside the West Coast National Park.$q$,
  array[$q$Water sports$q$,$q$Lagoon$q$,$q$National park$q$]::text[], $q$One to two days$q$,
  $q$Langebaan — Travel Guide & Tours$q$,
  $q$On a turquoise lagoon sheltered from the Atlantic swell, which makes it the centre for kitesurfing and kayaking on the West Coast, beside the West Coast Na$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$paternoster$q$, $q$Paternoster$q$, null, $q$coastal_town$q$, $q$West Coast$q$,
  'Western Cape', 'South Africa',
  $q$Whitewashed fishermen's cottages on an open bay, and a handful of restaurants that draw people from Cape Town for lunch alone.$q$,
  array[$q$Seafood$q$,$q$Photography$q$,$q$Beach$q$]::text[], $q$One to two days$q$,
  $q$Paternoster — Travel Guide & Tours$q$,
  $q$Whitewashed fishermen's cottages on an open bay, and a handful of restaurants that draw people from Cape Town for lunch alone.$q$,
  'draft', 0
) on conflict (slug) do nothing;

insert into public.destinations
  (slug, name, parent_id, area_type, region, province, country, description,
   best_for, suggested_time, seo_title, seo_description, status, sort_order)
values (
  $q$yzerfontein$q$, $q$Yzerfontein$q$, null, $q$coastal_town$q$, $q$West Coast$q$,
  'Western Cape', 'South Africa',
  $q$A small village at the northern end of a sixteen-mile beach, with rocky coves, seasonal whales and a working slipway.$q$,
  array[$q$Beach walks$q$,$q$Fishing$q$,$q$Quiet$q$]::text[], $q$Half day$q$,
  $q$Yzerfontein — Travel Guide & Tours$q$,
  $q$A small village at the northern end of a sixteen-mile beach, with rocky coves, seasonal whales and a working slipway.$q$,
  'draft', 0
) on conflict (slug) do nothing;


-- --- attractions -----------------------------------------------------------

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$castle-of-good-hope$q$, $q$Castle of Good Hope$q$, $q$The oldest surviving colonial building in South Africa, a pentagonal stone fort completed in 1679. Ceremonial key handover and cannon firing take place on weekdays.$q$, $q$Buitenkant Street, Cape Town$q$, $q$Historic site$q$,
       $q$1-2 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$city-centre$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$companys-garden$q$, $q$Company's Garden$q$, $q$Begun in 1652 as a vegetable garden to supply passing ships, now six hectares of lawns and old trees running through the middle of the city.$q$, $q$Queen Victoria Street, Cape Town$q$, $q$Garden$q$,
       $q$1 hour$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$city-centre$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$greenmarket-square$q$, $q$Greenmarket Square$q$, $q$A cobbled square that has held a market since the eighteenth century, now filled with stalls selling crafts and textiles from across the continent.$q$, $q$Burg Street, Cape Town$q$, $q$Market$q$,
       $q$1 hour$q$, $q$Agree a price before you buy; haggling is expected.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$city-centre$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$long-street$q$, $q$Long Street$q$, $q$A kilometre of Victorian buildings with wrought-iron balconies, holding most of the city centre's bars, clubs and backpackers.$q$, $q$Long Street, Cape Town$q$, $q$Nightlife$q$,
       $q$Evening$q$, $q$Lively and generally safe until late, but take a car back rather than walking after midnight.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$city-centre$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$bree-street$q$, $q$Bree Street$q$, $q$The city's main restaurant strip — small independent kitchens, wine bars and bakeries along a few walkable blocks.$q$, $q$Bree Street, Cape Town$q$, $q$Dining$q$,
       $q$Evening$q$, $q$The better restaurants need booking a week ahead.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$city-centre$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$iziko-bo-kaap-museum$q$, $q$Iziko Bo-Kaap Museum$q$, $q$An eighteenth-century house furnished as a Cape Muslim family home of the nineteenth century, telling the story of the Bo-Kaap and its people.$q$, $q$71 Wale Street, Bo-Kaap$q$, $q$Museum$q$,
       $q$1 hour$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$city-centre$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$two-oceans-aquarium$q$, $q$Two Oceans Aquarium$q$, $q$Displays drawn from the two oceans that meet at the Cape, including a kelp forest tank and a predator exhibit with ragged-tooth sharks.$q$, $q$Dock Road, V&A Waterfront$q$, $q$Aquarium$q$,
       $q$2-3 hours$q$, $q$Good wet-weather option.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$va-waterfront$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$cape-wheel$q$, $q$Cape Wheel$q$, $q$A observation wheel at the centre of the Waterfront giving a slow circuit of views over the harbour, the city bowl and Table Mountain.$q$, $q$V&A Waterfront$q$, $q$Viewpoint$q$,
       $q$30 minutes$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$va-waterfront$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$waterfront-harbour-cruise$q$, $q$Harbour & Sunset Cruises$q$, $q$Short boat trips from the Waterfront quays, from half-hour harbour circuits to sunset sailings along the Atlantic seaboard.$q$, $q$V&A Waterfront$q$, $q$Boat trip$q$,
       $q$1-2 hours$q$, $q$Cancelled in strong south-easterly wind.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$va-waterfront$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$zeitz-mocaa-waterfront$q$, $q$Zeitz MOCAA$q$, $q$The largest museum of contemporary African art on the continent, built inside a converted grain silo in the Silo District.$q$, $q$Silo District, V&A Waterfront$q$, $q$Museum$q$,
       $q$2 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$va-waterfront$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$sea-point-promenade$q$, $q$Sea Point Promenade$q$, $q$A wide paved path running several kilometres along the Atlantic shoreline, busy from dawn until dark with walkers, runners and cyclists.$q$, $q$Beach Road, Sea Point$q$, $q$Walk$q$,
       $q$1-2 hours$q$, $q$Best in the late afternoon.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$sea-point$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$sea-point-pavilion$q$, $q$Sea Point Pavilion$q$, $q$Four Olympic-scale outdoor saltwater pools built into the rocks above the sea, opened in 1952 and still run by the city.$q$, $q$Beach Road, Sea Point$q$, $q$Swimming$q$,
       $q$2 hours$q$, $q$Unheated; the water is cold year-round.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$sea-point$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$green-point-park$q$, $q$Green Point Urban Park$q$, $q$Twelve hectares of lawns, wetland and indigenous planting laid out around the stadium after 2010, with a biodiversity garden and children's play areas.$q$, $q$Green Point$q$, $q$Park$q$,
       $q$1-2 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$green-point$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$mouille-point-lighthouse$q$, $q$Mouille Point Lighthouse$q$, $q$The red-and-white banded lighthouse on the Green Point shoreline, in service since 1824 and the oldest operating light on the South African coast.$q$, $q$Beach Road, Mouille Point$q$, $q$Landmark$q$,
       $q$30 minutes$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$green-point$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$cape-town-stadium$q$, $q$Cape Town Stadium$q$, $q$The 55,000-seat stadium built for the 2010 World Cup, now used for football, rugby and concerts, with tours on non-event days.$q$, $q$Green Point$q$, $q$Landmark$q$,
       $q$1-2 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$green-point$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$signal-hill-viewpoint$q$, $q$Signal Hill Viewpoint$q$, $q$A road to the top of the ridge with parking at the summit, giving the easiest sunset view over the city and the Atlantic without a hike.$q$, $q$Signal Hill Road, Cape Town$q$, $q$Viewpoint$q$,
       $q$1 hour$q$, $q$Arrive well before sunset; parking fills up.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$signal-hill$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$noon-gun$q$, $q$The Noon Gun$q$, $q$Two 1794 naval cannon on the slopes of Signal Hill, one of which has been fired at midday almost every day since 1806.$q$, $q$Military Road, Bo-Kaap$q$, $q$Historic site$q$,
       $q$1 hour$q$, $q$Fires at 12:00 sharp, Monday to Saturday.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$signal-hill$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$lions-head-hike$q$, $q$Lion's Head Summit Hike$q$, $q$A spiral path around the peak with chains and staples on the final section, reaching 669 metres for uninterrupted views in every direction.$q$, $q$Signal Hill Road, Cape Town$q$, $q$Hike$q$,
       $q$2-3 hours$q$, $q$Do not hike alone or in the dark without a group. Full-moon hikes are popular but busy.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$lions-head$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$tandem-paragliding-signal-hill-2$q$, $q$Tandem Paragliding from Signal Hill$q$, $q$A tandem flight launching from the Signal Hill slopes and landing at the Sea Point promenade, taking roughly fifteen minutes in the air.$q$, $q$Signal Hill, Cape Town$q$, $q$Adventure$q$,
       $q$2 hours$q$, $q$Entirely wind-dependent and frequently postponed.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$signal-hill$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$camps-bay-beach$q$, $q$Camps Bay Beach$q$, $q$A broad white beach directly below the Twelve Apostles, with tidal pools at the southern end and the restaurant strip across the road.$q$, $q$Victoria Road, Camps Bay$q$, $q$Beach$q$,
       $q$Half day$q$, $q$Exposed to the south-easter, which can make afternoons unpleasant in summer.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$camps-bay$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$glen-beach$q$, $q$Glen Beach$q$, $q$A small beach tucked between Camps Bay and Clifton, favoured by surfers for its beach break.$q$, $q$Camps Bay$q$, $q$Beach$q$,
       $q$2 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$camps-bay$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$clifton-beaches$q$, $q$Clifton Beaches (1st to 4th)$q$, $q$Four coves separated by granite outcrops, reached by long flights of steps. Sheltered from the prevailing wind, which is why they fill up when Camps Bay does not.$q$, $q$Victoria Road, Clifton$q$, $q$Beach$q$,
       $q$Half day$q$, $q$Parking on Victoria Road is very limited in season.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$clifton$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$llandudno-beach$q$, $q$Llandudno Beach$q$, $q$A crescent of sand between granite boulders with no shops, restaurants or lifeguard kiosks — bring whatever you need.$q$, $q$Llandudno$q$, $q$Beach$q$,
       $q$2-3 hours$q$, $q$No facilities. Strong shore break.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$llandudno$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$hout-bay-harbour$q$, $q$Hout Bay Harbour$q$, $q$A working fishing harbour with trawlers alongside, fish-and-chip counters, a craft market and the departure quay for seal-island boats.$q$, $q$Harbour Road, Hout Bay$q$, $q$Harbour$q$,
       $q$2 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$hout-bay$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$duiker-island-cruise$q$, $q$Duiker Island Seal Cruise$q$, $q$A short boat charter from Hout Bay to a rocky outcrop holding several thousand Cape fur seals.$q$, $q$Hout Bay Harbour$q$, $q$Boat trip$q$,
       $q$1 hour$q$, $q$Choppy in swell; not ideal for anyone prone to seasickness.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$hout-bay$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$bay-harbour-market$q$, $q$Bay Harbour Market$q$, $q$A weekend market in a converted fish factory at the harbour, with food stalls, crafts and live music.$q$, $q$Harbour Road, Hout Bay$q$, $q$Market$q$,
       $q$2 hours$q$, $q$Weekends only.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$hout-bay$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$chapmans-peak-drive$q$, $q$Chapman's Peak Drive$q$, $q$Nine kilometres of road cut into a near-vertical cliff face between Hout Bay and Noordhoek, with 114 curves and viewpoints the whole way.$q$, $q$M6 between Hout Bay and Noordhoek$q$, $q$Scenic drive$q$,
       $q$1 hour$q$, $q$A toll road. Closes in high wind and after rockfalls — check before committing to the route.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$hout-bay$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$noordhoek-beach$q$, $q$Noordhoek Beach$q$, $q$An eight-kilometre stretch of open sand backed by dunes, wide enough that it never feels busy. Horses are ridden along it most mornings.$q$, $q$Noordhoek$q$, $q$Beach$q$,
       $q$2-3 hours$q$, $q$Do not leave valuables in a parked car here.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$noordhoek$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$noordhoek-farm-village$q$, $q$Noordhoek Farm Village$q$, $q$A cluster of cafes, a bakery, craft shops and a small brewery around a courtyard at the foot of Chapman's Peak.$q$, $q$Village Lane, Noordhoek$q$, $q$Food & shopping$q$,
       $q$1-2 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$noordhoek$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$slangkop-lighthouse$q$, $q$Slangkop Lighthouse$q$, $q$The tallest cast-iron lighthouse tower on the South African coast, standing on the rocks at Kommetjie since 1919.$q$, $q$Kommetjie$q$, $q$Lighthouse$q$,
       $q$1 hour$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$kommetjie$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$simons-town-naval-museum$q$, $q$South African Naval Museum$q$, $q$Housed in a former dockyard building, covering the history of the navy at Simon's Town with ship models, a submarine control room and diving equipment.$q$, $q$St George's Street, Simon's Town$q$, $q$Museum$q$,
       $q$1-2 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$simons-town$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$boulders-beach-penguins$q$, $q$Boulders Beach Penguin Colony$q$, $q$Boardwalks lead over the dunes to viewing decks above a colony of several thousand African penguins, which have nested here since 1982.$q$, $q$Simon's Town$q$, $q$Wildlife$q$,
       $q$1-2 hours$q$, $q$Part of Table Mountain National Park; an entry fee applies. Busiest between 11:00 and 13:00.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$boulders-beach-area$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$cape-of-good-hope$q$, $q$Cape of Good Hope$q$, $q$The rocky headland at the south-western tip of Africa, with a short walk to the sign that marks it and views back along the peninsula.$q$, $q$Table Mountain National Park$q$, $q$Landmark$q$,
       $q$1-2 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$cape-point-area$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$cape-point-lighthouse$q$, $q$Cape Point Lighthouse & Funicular$q$, $q$The original 1860 lighthouse stands at 249 metres, reached on foot or by the Flying Dutchman funicular from the car park below.$q$, $q$Cape Point$q$, $q$Landmark$q$,
       $q$1-2 hours$q$, $q$The funicular is charged separately from park entry.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$cape-point-area$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$cape-point-trails$q$, $q$Cape Point Coastal Trails$q$, $q$Marked paths along the cliffs and down to secluded beaches such as Diaz and Platboom, through fynbos that flowers through the winter.$q$, $q$Table Mountain National Park$q$, $q$Hike$q$,
       $q$2-4 hours$q$, $q$Baboons here are habituated and will open unlocked cars. Carry no visible food.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$cape-point-area$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$muizenberg-beach$q$, $q$Muizenberg Beach$q$, $q$A wide, gently shelving beach in the warmer water of False Bay, with a long slow wave that makes it the best learner surf spot in the country.$q$, $q$Muizenberg$q$, $q$Beach$q$,
       $q$Half day$q$, $q$Shark spotters operate here; obey the flag system.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$muizenberg$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$muizenberg-beach-huts$q$, $q$Muizenberg Beach Huts$q$, $q$A row of Victorian-era changing boxes painted in primary colours, and the most photographed structures on the False Bay coast.$q$, $q$Muizenberg$q$, $q$Landmark$q$,
       $q$30 minutes$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$muizenberg$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$st-james-tidal-pool$q$, $q$St James Tidal Pool & Huts$q$, $q$A sheltered tidal pool beside another row of painted changing huts, with the railway line running directly behind the beach.$q$, $q$St James$q$, $q$Beach$q$,
       $q$1 hour$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$st-james$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$kalk-bay-harbour$q$, $q$Kalk Bay Harbour$q$, $q$A small working harbour where the catch is sold off the quay in the morning, with seals waiting alongside for scraps.$q$, $q$Kalk Bay$q$, $q$Harbour$q$,
       $q$1-2 hours$q$, $q$The fish market is busiest early.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$kalk-bay$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$kalk-bay-shops$q$, $q$Kalk Bay Antique & Book Shops$q$, $q$A single main road of antique dealers, second-hand bookshops and galleries above the harbour.$q$, $q$Main Road, Kalk Bay$q$, $q$Shopping$q$,
       $q$1-2 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$kalk-bay$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$kirstenbosch-garden$q$, $q$Kirstenbosch National Botanical Garden$q$, $q$Five hundred hectares on the eastern slopes of Table Mountain devoted almost entirely to indigenous flora, including the Boomslang tree-canopy walkway.$q$, $q$Rhodes Drive, Newlands$q$, $q$Garden$q$,
       $q$Half day$q$, $q$Summer sunset concerts on the lawn are a Cape Town institution and sell out.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$newlands$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$newlands-forest$q$, $q$Newlands Forest$q$, $q$Shaded paths through pine and indigenous woodland on the back of the mountain, following streams up towards the contour path.$q$, $q$Union Avenue, Newlands$q$, $q$Forest walk$q$,
       $q$1-3 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$newlands$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$constantia-wine-estates$q$, $q$Constantia Wine Estates$q$, $q$The oldest wine-producing valley in the country, with estates dating to 1685 and restaurants attached to most of them.$q$, $q$Constantia Valley$q$, $q$Wine$q$,
       $q$Half to full day$q$, $q$Take a driver. South Africa enforces a 0.05% blood-alcohol limit strictly.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$constantia$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$woodstock-street-art$q$, $q$Woodstock Street Art$q$, $q$Large-scale murals across the walls of the old industrial quarter, added to steadily since the early 2010s.$q$, $q$Woodstock$q$, $q$Street art$q$,
       $q$1-2 hours$q$, $q$Best seen on a guided walk.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$woodstock$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$old-biscuit-mill$q$, $q$The Old Biscuit Mill$q$, $q$A converted mill housing design studios, galleries and restaurants, with a large food and craft market on Saturday mornings.$q$, $q$373 Albert Road, Woodstock$q$, $q$Market$q$,
       $q$2-3 hours$q$, $q$The market is Saturdays only and very busy.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$woodstock$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$bloubergstrand-viewpoint$q$, $q$Bloubergstrand Beach & Table Mountain View$q$, $q$The classic view of Table Mountain across Table Bay, from a long exposed beach that is one of the best kitesurfing spots in the country.$q$, $q$Bloubergstrand$q$, $q$Viewpoint$q$,
       $q$1-2 hours$q$, $q$Consistently windy — which is the point for kitesurfers.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$bloubergstrand$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$robben-island-prison$q$, $q$Robben Island Prison Tour$q$, $q$A guided tour of the maximum-security prison including the cell where Nelson Mandela spent eighteen years, led by former political prisoners.$q$, $q$Robben Island, Table Bay$q$, $q$Museum$q$,
       $q$Half day$q$, $q$Ferries leave from the Nelson Mandela Gateway and sell out well ahead. Cancelled in rough seas.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$robben-island$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$franschhoek-wine-tram$q$, $q$Franschhoek Wine Tram$q$, $q$An open-sided tram and bus circuit linking the valley's estates on a hop-on, hop-off basis — the practical way to taste without driving.$q$, $q$Franschhoek$q$, $q$Wine$q$,
       $q$Full day$q$, $q$Book a line and a time slot in advance.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$franschhoek$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$huguenot-monument$q$, $q$Huguenot Monument & Museum$q$, $q$A monument at the head of the valley to the French Huguenots who settled here from 1688, with an adjoining museum on their history.$q$, $q$Lambrecht Street, Franschhoek$q$, $q$Monument$q$,
       $q$1-2 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$franschhoek$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$franschhoek-main-road$q$, $q$Franschhoek Village & Restaurants$q$, $q$A single oak-lined main road holding an unusual density of serious restaurants, galleries and boutiques.$q$, $q$Huguenot Road, Franschhoek$q$, $q$Dining$q$,
       $q$Half day$q$, $q$The best kitchens need reserving several weeks ahead.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$franschhoek$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$paarl-rock$q$, $q$Paarl Rock & Afrikaans Language Monument$q$, $q$Three vast granite domes above the town, with a road to the top, walking routes over the rock, and the Afrikaans Language Monument on the slopes.$q$, $q$Paarl Mountain Nature Reserve$q$, $q$Viewpoint$q$,
       $q$2-3 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$paarl$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$somerset-west-estates$q$, $q$Helderberg Wine Estates$q$, $q$Cool-climate estates on the Helderberg slopes, close enough to False Bay that the sea air shows in the wines.$q$, $q$Somerset West$q$, $q$Wine$q$,
       $q$Half to full day$q$, $q$Take a driver.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$somerset-west$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$hermanus-cliff-path$q$, $q$Hermanus Cliff Path$q$, $q$Twelve kilometres of path along the cliffs above Walker Bay, from where southern right whales are visible metres offshore in season.$q$, $q$Hermanus$q$, $q$Walk$q$,
       $q$1-3 hours$q$, $q$Whales are present roughly June to November; peak is August to October.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$hermanus$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$hermanus-old-harbour$q$, $q$Old Harbour Museum$q$, $q$The original fishing harbour cut into the rock, preserved with its boats and winches as an open-air museum.$q$, $q$Marine Drive, Hermanus$q$, $q$Museum$q$,
       $q$1 hour$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$hermanus$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$grotto-beach$q$, $q$Grotto Beach$q$, $q$A long Blue Flag beach at the eastern end of Walker Bay, backed by dunes and milkwood.$q$, $q$Hermanus$q$, $q$Beach$q$,
       $q$2-3 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$hermanus$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$hermanus-whale-cruise$q$, $q$Whale Watching Boat Trips$q$, $q$Permitted boat-based whale watching in Walker Bay, taking you closer than the cliff path allows.$q$, $q$Hermanus New Harbour$q$, $q$Boat trip$q$,
       $q$2-3 hours$q$, $q$Seasonal and weather-dependent. Use an operator holding a whale-watching permit.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$hermanus$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$stony-point-penguins$q$, $q$Stony Point Penguin Colony$q$, $q$A mainland African penguin colony on the rocks at Betty's Bay, quieter than Boulders and set among the ruins of an old whaling station.$q$, $q$Betty's Bay$q$, $q$Wildlife$q$,
       $q$1 hour$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$bettys-bay$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$harold-porter-garden$q$, $q$Harold Porter National Botanical Garden$q$, $q$Two hundred hectares of coastal fynbos between mountain and sea, with waterfalls and a walk up Disa Kloof.$q$, $q$Betty's Bay$q$, $q$Garden$q$,
       $q$2 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$bettys-bay$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$clarence-drive$q$, $q$Clarence Drive (Route 44)$q$, $q$Thirty kilometres of road cut into the cliffs between Gordon's Bay and Rooi-Els, with whales visible from the tarmac in season.$q$, $q$R44, Gordon's Bay to Rooi-Els$q$, $q$Scenic drive$q$,
       $q$1-2 hours$q$, $q$Frequently ranked among the world's best coastal drives. Pull into the laybys rather than stopping on the road.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$gordons-bay$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$agulhas-lighthouse$q$, $q$Cape Agulhas Lighthouse & Southern Tip$q$, $q$The 1849 lighthouse and, a short walk away, the stone marker at the southernmost point of the African continent.$q$, $q$Cape Agulhas$q$, $q$Landmark$q$,
       $q$2 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$cape-agulhas$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$montagu-hot-springs$q$, $q$Montagu Hot Springs$q$, $q$Natural mineral springs emerging at around 43 degrees, channelled into pools at the foot of the Langeberg.$q$, $q$Montagu$q$, $q$Hot springs$q$,
       $q$Half day$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$montagu$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$montagu-climbing$q$, $q$Montagu Rock Climbing$q$, $q$Hundreds of bolted sport routes on the sandstone of the Keisie and Bad Kloof valleys, climbable through the winter.$q$, $q$Montagu$q$, $q$Adventure$q$,
       $q$Full day$q$, $q$For experienced climbers or with a qualified guide.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$montagu$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$tulbagh-church-street$q$, $q$Church Street, Tulbagh$q$, $q$Thirty-two consecutively declared national monuments along one street, restored after the 1969 earthquake that destroyed much of the town.$q$, $q$Church Street, Tulbagh$q$, $q$Historic site$q$,
       $q$1-2 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$tulbagh$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$robertson-wine-route$q$, $q$Robertson Wine Valley$q$, $q$Fifty-odd cellars along the Breede River, known for Chardonnay and Shiraz and considerably quieter than the Cape Town winelands.$q$, $q$Robertson$q$, $q$Wine$q$,
       $q$Full day$q$, $q$Take a driver.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$robertson$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$west-coast-national-park$q$, $q$West Coast National Park$q$, $q$A park wrapped around the Langebaan lagoon, with wading birds year-round and a spring wildflower display in the Postberg section.$q$, $q$Langebaan$q$, $q$National park$q$,
       $q$Half to full day$q$, $q$Postberg opens for the flower season in August and September only.$q$, 'draft', 0
from public.destinations d
where d.slug = $q$langebaan$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$langebaan-lagoon$q$, $q$Langebaan Lagoon$q$, $q$Sixteen kilometres of sheltered turquoise water, shallow and warm, and the centre of West Coast kitesurfing and kayaking.$q$, $q$Langebaan$q$, $q$Water sports$q$,
       $q$Half day$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$langebaan$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$paternoster-beach$q$, $q$Paternoster Beach & Village$q$, $q$Whitewashed cottages above an open bay where wooden fishing boats still launch off the sand.$q$, $q$Paternoster$q$, $q$Beach$q$,
       $q$Half day$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$paternoster$q$
on conflict (destination_id, slug) do nothing;

insert into public.attractions
  (destination_id, slug, name, description, location, category,
   suggested_time, visitor_note, status, sort_order)
select d.id, $q$tietiesbaai$q$, $q$Tietiesbaai & Cape Columbine$q$, $q$A rocky campsite and reserve just north of Paternoster, with the last manually operated lighthouse commissioned in South Africa.$q$, $q$Cape Columbine Nature Reserve$q$, $q$Nature$q$,
       $q$2-3 hours$q$, null, 'draft', 0
from public.destinations d
where d.slug = $q$paternoster$q$
on conflict (destination_id, slug) do nothing;


-- --- summary ----------------------------------------------------------------
do $$
declare d int; a int; dr int; ar int;
begin
  select count(*) into d  from public.destinations;
  select count(*) into dr from public.destinations where status = 'draft';
  select count(*) into a  from public.attractions;
  select count(*) into ar from public.attractions where status = 'draft';
  raise notice 'destinations: % total, % draft | attractions: % total, % draft', d, dr, a, ar;
end $$;


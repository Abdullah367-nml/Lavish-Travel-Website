-- =============================================================================
-- Destination hierarchy and regions.
--
-- WHY THIS IS NEEDED
--
-- The incoming Cape Town guide mixes three different levels of place:
--
--   a region      — Cape Winelands, Overberg, West Coast
--   a destination — Cape Town, Stellenbosch, Hermanus
--   an area       — Camps Bay, Sea Point, Kalk Bay (all INSIDE Cape Town)
--
-- Flattening those into one list would make "V&A Waterfront" a sibling of
-- "Cape Town", which is wrong, produces a nonsensical navigation, and buries
-- the pages that actually have search demand under ones that do not.
--
-- `parent_id` is a self-reference: an area points at its city, a city points
-- at nothing. `region` groups top-level destinations for the listing page.
-- =============================================================================

alter table public.destinations
  add column if not exists parent_id uuid references public.destinations(id) on delete set null,
  add column if not exists region text,
  add column if not exists area_type text not null default 'destination'
    check (area_type in ('destination', 'area', 'town', 'wine_area', 'coastal_town', 'nature')),
  -- Free-form guidance from the guide: "Half day", "One full day", etc.
  add column if not exists suggested_time text,
  -- "Families, couples, walking, ocean views" — the guide's "Best for" line.
  add column if not exists best_for text[];

create index if not exists destinations_parent_idx on public.destinations (parent_id);
create index if not exists destinations_region_idx on public.destinations (region);

-- A destination cannot be its own parent. Deeper cycles are not prevented by
-- a constraint (that needs a trigger), but a two-level model is all this
-- content requires and the admin UI will only ever offer top-level parents.
alter table public.destinations
  drop constraint if exists destinations_no_self_parent;
alter table public.destinations
  add constraint destinations_no_self_parent check (parent_id is distinct from id);

-- Existing rows: Cape Town and Stellenbosch are top-level.
update public.destinations
set region = case
      when slug = 'cape-town'    then 'Cape Town & Peninsula'
      when slug = 'stellenbosch' then 'Cape Winelands'
      else region
    end,
    area_type = 'destination'
where slug in ('cape-town', 'stellenbosch');

-- --- attractions: a couple of fields the guide provides ----------------------
alter table public.attractions
  add column if not exists category text,
  -- "Half day", "1–2 hours"
  add column if not exists suggested_time text,
  -- Practical note: booking ahead, weather dependence, safety
  add column if not exists visitor_note text;

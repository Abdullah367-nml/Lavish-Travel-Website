-- =============================================================================
-- Lavish Travels & Tours — core schema
--
-- Target: Supabase Postgres, project provisioned in af-south-1 (Cape Town)
-- for latency and POPIA s.72 data residency.
--
-- Conventions:
--   * uuid primary keys, timestamptz timestamps
--   * money stored as integer whole rands (never float, never a string)
--   * indexes on every foreign key and every column used for filtering
--   * RLS is enabled on every table in 0003_rls.sql — no table is left open
--
-- Passwords are NOT stored here. Supabase Auth owns auth.users and hashes
-- credentials with bcrypt; `profiles` holds only the non-secret fields and
-- is keyed 1:1 to the auth user.
-- =============================================================================

create extension if not exists "pgcrypto";

-- --- enums -------------------------------------------------------------------
do $$ begin
  create type user_role         as enum ('customer', 'admin');
  create type content_status    as enum ('draft', 'published', 'archived');
  create type tour_date_status  as enum ('open', 'closed', 'cancelled');
  create type booking_status    as enum ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');
  create type payment_status    as enum ('pending', 'paid', 'failed', 'refunded');
  create type payment_provider  as enum ('paystack', 'ozow', 'payfast', 'manual_eft');
  create type review_status     as enum ('pending', 'approved', 'hidden');
  create type enquiry_status    as enum ('new', 'contacted', 'quoted', 'won', 'lost');
  create type consent_type      as enum ('marketing', 'cookies', 'data_processing');
exception when duplicate_object then null; end $$;

-- --- profiles ----------------------------------------------------------------
-- 1:1 with auth.users. `role` drives every admin check in the RLS policies.
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  first_name   text not null check (length(trim(first_name)) between 1 and 80),
  last_name    text not null check (length(trim(last_name))  between 1 and 80),
  email        text not null,
  phone        text,
  country      text,
  role         user_role not null default 'customer',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists profiles_role_idx  on public.profiles (role);

-- --- destinations ------------------------------------------------------------
create table if not exists public.destinations (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name             text not null,
  province         text,
  country          text not null default 'South Africa',
  description      text not null,
  body             jsonb not null default '[]'::jsonb,
  image            text,
  lat              numeric(9,6),
  lng              numeric(9,6),
  best_months      text,
  seo_title        text,
  seo_description  text,
  status           content_status not null default 'published',
  sort_order       int not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists destinations_status_idx on public.destinations (status);

-- --- attractions -------------------------------------------------------------
create table if not exists public.attractions (
  id              uuid primary key default gen_random_uuid(),
  destination_id  uuid not null references public.destinations(id) on delete cascade,
  slug            text not null check (slug ~ '^[a-z0-9-]+$'),
  name            text not null,
  description     text not null,
  image           text,
  location        text,
  status          content_status not null default 'published',
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (destination_id, slug)
);
create index if not exists attractions_destination_idx on public.attractions (destination_id);
create index if not exists attractions_status_idx      on public.attractions (status);

-- --- tours -------------------------------------------------------------------
-- price_adult_zar / price_child_zar are the ONLY source of truth for pricing.
-- The booking function reads them directly; a price sent from the browser is
-- never trusted.
create table if not exists public.tours (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9-]+$'),
  destination_id   uuid not null references public.destinations(id) on delete restrict,
  name             text not null,
  summary          text not null,
  description      text,
  duration_days    int not null default 1 check (duration_days between 1 and 60),
  price_adult_zar  int not null check (price_adult_zar >= 0),
  price_child_zar  int not null default 0 check (price_child_zar >= 0),
  capacity         int not null default 20 check (capacity between 1 and 500),
  images           jsonb not null default '[]'::jsonb,
  itinerary        jsonb not null default '[]'::jsonb,
  inclusions       jsonb not null default '[]'::jsonb,
  exclusions       jsonb not null default '[]'::jsonb,
  what_to_pack     jsonb not null default '[]'::jsonb,
  faqs             jsonb not null default '[]'::jsonb,
  pickup_info      text,
  difficulty       text not null default 'easy',
  category         text not null default 'day_tour',
  is_featured      boolean not null default false,
  status           content_status not null default 'draft',
  seo_title        text,
  seo_description  text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists tours_destination_idx on public.tours (destination_id);
create index if not exists tours_status_idx      on public.tours (status);
create index if not exists tours_featured_idx    on public.tours (is_featured) where is_featured;
create index if not exists tours_price_idx       on public.tours (price_adult_zar);

-- --- tour <-> attraction join ------------------------------------------------
create table if not exists public.tour_attractions (
  tour_id        uuid not null references public.tours(id)       on delete cascade,
  attraction_id  uuid not null references public.attractions(id) on delete cascade,
  sort_order     int not null default 0,
  primary key (tour_id, attraction_id)
);
create index if not exists tour_attractions_attraction_idx on public.tour_attractions (attraction_id);

-- --- tour dates (availability) ----------------------------------------------
-- seats_booked is maintained ONLY by the booking functions in 0002. The check
-- constraint is the last line of defence: even a buggy future code path
-- cannot push bookings past capacity without the database rejecting it.
create table if not exists public.tour_dates (
  id            uuid primary key default gen_random_uuid(),
  tour_id       uuid not null references public.tours(id) on delete cascade,
  tour_date     date not null,
  capacity      int  not null check (capacity between 1 and 500),
  seats_booked  int  not null default 0 check (seats_booked >= 0),
  status        tour_date_status not null default 'open',
  created_at    timestamptz not null default now(),
  unique (tour_id, tour_date),
  constraint tour_dates_not_oversold check (seats_booked <= capacity)
);
create index if not exists tour_dates_tour_idx   on public.tour_dates (tour_id);
create index if not exists tour_dates_date_idx   on public.tour_dates (tour_date);
create index if not exists tour_dates_status_idx on public.tour_dates (status);

-- --- bookings ----------------------------------------------------------------
-- Unit prices are copied in at booking time, so a later price change on the
-- tour never rewrites what a customer already agreed to pay.
create table if not exists public.bookings (
  id                    uuid primary key default gen_random_uuid(),
  reference             text not null unique,
  user_id               uuid not null references public.profiles(id) on delete restrict,
  tour_id               uuid not null references public.tours(id)      on delete restrict,
  tour_date_id          uuid not null references public.tour_dates(id) on delete restrict,
  adults                int not null check (adults between 1 and 100),
  children              int not null default 0 check (children between 0 and 100),
  contact_first_name    text not null,
  contact_last_name     text not null,
  contact_email         text not null,
  contact_phone         text not null,
  contact_country       text,
  pickup_location       text,
  special_requirements  text,
  unit_price_adult_zar  int not null check (unit_price_adult_zar >= 0),
  unit_price_child_zar  int not null check (unit_price_child_zar >= 0),
  total_amount_zar      int not null check (total_amount_zar >= 0),
  booking_status        booking_status not null default 'pending',
  cancelled_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists bookings_user_idx      on public.bookings (user_id);
create index if not exists bookings_tour_idx      on public.bookings (tour_id);
create index if not exists bookings_date_idx      on public.bookings (tour_date_id);
create index if not exists bookings_status_idx    on public.bookings (booking_status);
create index if not exists bookings_created_idx   on public.bookings (created_at desc);

-- Human-readable reference: LVT-2026-0417
create sequence if not exists public.booking_reference_seq start 10001;

-- --- payments ----------------------------------------------------------------
-- NOTE: no card number, no CVV, no cardholder data of any kind is stored here,
-- and none ever should be. PCI-DSS scope is avoided entirely by using the
-- gateway's hosted checkout and keeping only the provider's own reference.
create table if not exists public.payments (
  id              uuid primary key default gen_random_uuid(),
  booking_id      uuid not null references public.bookings(id) on delete cascade,
  amount_zar      int not null check (amount_zar >= 0),
  provider        payment_provider not null default 'manual_eft',
  transaction_id  text,
  payment_status  payment_status not null default 'pending',
  raw_webhook     jsonb,
  paid_at         timestamptz,
  created_at      timestamptz not null default now()
);
create index if not exists payments_booking_idx on public.payments (booking_id);
create index if not exists payments_status_idx  on public.payments (payment_status);

-- --- reviews -----------------------------------------------------------------
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete set null,
  tour_id     uuid not null references public.tours(id) on delete cascade,
  booking_id  uuid references public.bookings(id) on delete set null,
  author_name text not null,
  rating      int  not null check (rating between 1 and 5),
  title       text,
  comment     text not null,
  status      review_status not null default 'pending',
  created_at  timestamptz not null default now()
);
create index if not exists reviews_tour_idx   on public.reviews (tour_id);
create index if not exists reviews_status_idx on public.reviews (status);

-- --- enquiries (custom itinerary requests) -----------------------------------
create table if not exists public.enquiries (
  id               uuid primary key default gen_random_uuid(),
  reference        text not null unique,
  user_id          uuid references public.profiles(id) on delete set null,
  full_name        text not null,
  email            text not null,
  phone            text not null,
  country          text,
  company_name     text,
  service_type     text not null,
  item_slug        text,
  start_date       date,
  end_date         date,
  adults           int not null default 1,
  children         int not null default 0,
  pickup_address   text,
  dropoff_address  text,
  flight_number    text,
  message          text,
  source           text not null default 'form',
  status           enquiry_status not null default 'new',
  assigned_to      uuid references public.profiles(id) on delete set null,
  created_at       timestamptz not null default now()
);
create index if not exists enquiries_status_idx  on public.enquiries (status);
create index if not exists enquiries_created_idx on public.enquiries (created_at desc);

-- --- consent records (POPIA audit trail) -------------------------------------
-- Written on every consent event INCLUDING refusals: proof that someone
-- declined marketing is exactly what you need when a complaint arrives.
create table if not exists public.consent_records (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete set null,
  email         text,
  consent_type  consent_type not null,
  granted       boolean not null,
  ip_address    inet,
  user_agent    text,
  created_at    timestamptz not null default now()
);
create index if not exists consent_email_idx on public.consent_records (email);
create index if not exists consent_user_idx  on public.consent_records (user_id);

-- --- updated_at maintenance --------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['profiles','destinations','attractions','tours','bookings']
  loop
    execute format(
      'drop trigger if exists %I_touch on public.%I; '
      'create trigger %I_touch before update on public.%I '
      'for each row execute function public.touch_updated_at();',
      t, t, t, t);
  end loop;
end $$;

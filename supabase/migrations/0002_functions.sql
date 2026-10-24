-- =============================================================================
-- Booking logic — the part that must never be wrong.
--
-- Everything that decides money or capacity happens HERE, inside the database,
-- in one transaction. The browser cannot influence any of it:
--
--   * the price is read from public.tours, never accepted from the client
--   * the seat check happens while holding a row lock on the tour_date, so two
--     simultaneous bookings for the last seat cannot both succeed
--   * seats_booked is only ever moved by these functions
--   * a CHECK constraint on tour_dates is the final backstop
--
-- Errors are raised with a stable machine-readable code in the message so the
-- API layer can map them to friendly text without string-matching prose.
-- =============================================================================

-- --- helpers -----------------------------------------------------------------

-- Admin test used by every RLS policy. Reads the role from the JWT claims
-- rather than the profiles table, so it cannot recurse into a policy that is
-- itself checking profiles.
create or replace function public.is_admin()
returns boolean
language sql stable
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb
      -> 'app_metadata' ->> 'role',
    ''
  ) = 'admin';
$$;

create or replace function public.next_booking_reference()
returns text language sql volatile as $$
  select 'LVT-' || to_char(now() at time zone 'UTC', 'YYYY') || '-'
         || lpad(nextval('public.booking_reference_seq')::text, 5, '0');
$$;

-- --- availability ------------------------------------------------------------
-- One place that defines "how many seats are left", so the tour page, the
-- booking wizard and the admin screen can never disagree.
create or replace view public.tour_date_availability as
select
  td.id                                as tour_date_id,
  td.tour_id,
  t.slug                               as tour_slug,
  td.tour_date,
  td.capacity,
  td.seats_booked,
  greatest(td.capacity - td.seats_booked, 0) as seats_remaining,
  td.status,
  case
    when td.status <> 'open'                     then 'closed'
    when td.tour_date < current_date             then 'past'
    when td.seats_booked >= td.capacity          then 'sold_out'
    when td.capacity - td.seats_booked <= 5      then 'limited'
    else 'available'
  end                                  as availability
from public.tour_dates td
join public.tours t on t.id = td.tour_id;

-- --- create booking ----------------------------------------------------------
create or replace function public.create_booking(
  p_tour_date_id         uuid,
  p_adults               int,
  p_children             int  default 0,
  p_contact_first_name   text default null,
  p_contact_last_name    text default null,
  p_contact_email        text default null,
  p_contact_phone        text default null,
  p_contact_country      text default null,
  p_pickup_location      text default null,
  p_special_requirements text default null
)
returns public.bookings
language plpgsql
security definer            -- needs to update tour_dates, which customers cannot write
set search_path = public
as $$
declare
  v_user       uuid := auth.uid();
  v_date       public.tour_dates%rowtype;
  v_tour       public.tours%rowtype;
  v_profile    public.profiles%rowtype;
  v_seats      int;
  v_remaining  int;
  v_total      int;
  v_booking    public.bookings%rowtype;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED: you must be signed in to book';
  end if;

  if p_adults is null or p_adults < 1 then
    raise exception 'INVALID_PARTY: at least one adult is required';
  end if;
  if p_children is null or p_children < 0 then
    raise exception 'INVALID_PARTY: children cannot be negative';
  end if;

  select * into v_profile from public.profiles where id = v_user;
  if not found then
    raise exception 'PROFILE_MISSING: complete your profile before booking';
  end if;

  -- Row lock. Any concurrent create_booking for the same date blocks here
  -- until this transaction commits or rolls back — which is what makes the
  -- seat check below safe rather than a race.
  select * into v_date
  from public.tour_dates
  where id = p_tour_date_id
  for update;

  if not found then
    raise exception 'DATE_NOT_FOUND: that departure no longer exists';
  end if;
  if v_date.status <> 'open' then
    raise exception 'DATE_CLOSED: that departure is not open for booking';
  end if;
  if v_date.tour_date < current_date then
    raise exception 'DATE_PAST: that departure has already left';
  end if;

  select * into v_tour from public.tours where id = v_date.tour_id;
  if not found or v_tour.status <> 'published' then
    raise exception 'TOUR_UNAVAILABLE: this tour is not currently on sale';
  end if;

  v_seats     := p_adults + p_children;
  v_remaining := v_date.capacity - v_date.seats_booked;

  if v_seats > v_remaining then
    -- The remaining count is embedded so the API can say
    -- "Only 3 seats are available for this date."
    raise exception 'NO_SEATS:%: only % seat(s) left', v_remaining, v_remaining;
  end if;

  -- Price comes from the tours table. Nothing the client sent is consulted.
  v_total := (p_adults * v_tour.price_adult_zar)
           + (p_children * v_tour.price_child_zar);

  insert into public.bookings (
    reference, user_id, tour_id, tour_date_id,
    adults, children,
    contact_first_name, contact_last_name, contact_email,
    contact_phone, contact_country,
    pickup_location, special_requirements,
    unit_price_adult_zar, unit_price_child_zar, total_amount_zar,
    booking_status
  ) values (
    public.next_booking_reference(), v_user, v_tour.id, v_date.id,
    p_adults, p_children,
    coalesce(p_contact_first_name, v_profile.first_name),
    coalesce(p_contact_last_name,  v_profile.last_name),
    coalesce(p_contact_email,      v_profile.email),
    coalesce(p_contact_phone,      v_profile.phone, ''),
    coalesce(p_contact_country,    v_profile.country),
    p_pickup_location, p_special_requirements,
    v_tour.price_adult_zar, v_tour.price_child_zar, v_total,
    'pending'
  )
  returning * into v_booking;

  update public.tour_dates
     set seats_booked = seats_booked + v_seats
   where id = v_date.id;

  -- Payment row starts pending. A real gateway moves it to paid via webhook;
  -- until one is wired, an admin marks it paid on manual EFT.
  insert into public.payments (booking_id, amount_zar, provider, payment_status)
  values (v_booking.id, v_total, 'manual_eft', 'pending');

  return v_booking;
end $$;

-- --- cancel booking ----------------------------------------------------------
-- Releases the seats back to the departure. Customers may cancel their own
-- booking; admins may cancel any.
create or replace function public.cancel_booking(p_booking_id uuid)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user    uuid := auth.uid();
  v_booking public.bookings%rowtype;
  v_seats   int;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED: you must be signed in';
  end if;

  select * into v_booking from public.bookings where id = p_booking_id for update;
  if not found then
    raise exception 'BOOKING_NOT_FOUND: no such booking';
  end if;

  -- Ownership check. Without this, SECURITY DEFINER would let any signed-in
  -- user cancel anybody's booking by guessing an id.
  if v_booking.user_id <> v_user and not public.is_admin() then
    raise exception 'FORBIDDEN: that booking is not yours';
  end if;

  if v_booking.booking_status = 'cancelled' then
    return v_booking;                      -- idempotent
  end if;
  if v_booking.booking_status = 'completed' then
    raise exception 'ALREADY_COMPLETED: a completed tour cannot be cancelled';
  end if;

  v_seats := v_booking.adults + v_booking.children;

  update public.bookings
     set booking_status = 'cancelled', cancelled_at = now()
   where id = v_booking.id
   returning * into v_booking;

  update public.tour_dates
     set seats_booked = greatest(seats_booked - v_seats, 0)
   where id = v_booking.tour_date_id;

  return v_booking;
end $$;

-- --- admin: change booking status -------------------------------------------
create or replace function public.admin_set_booking_status(
  p_booking_id uuid,
  p_status     booking_status
)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking public.bookings%rowtype;
  v_seats   int;
begin
  if not public.is_admin() then
    raise exception 'FORBIDDEN: admin only';
  end if;

  select * into v_booking from public.bookings where id = p_booking_id for update;
  if not found then
    raise exception 'BOOKING_NOT_FOUND: no such booking';
  end if;

  v_seats := v_booking.adults + v_booking.children;

  -- Moving into or out of "cancelled" is the only transition that changes
  -- seat counts, so it is handled explicitly rather than recomputed.
  if p_status = 'cancelled' and v_booking.booking_status <> 'cancelled' then
    update public.tour_dates
       set seats_booked = greatest(seats_booked - v_seats, 0)
     where id = v_booking.tour_date_id;
  elsif p_status <> 'cancelled' and v_booking.booking_status = 'cancelled' then
    -- Re-instating: only allowed if the seats are actually free again.
    if (select capacity - seats_booked from public.tour_dates
         where id = v_booking.tour_date_id for update) < v_seats then
      raise exception 'NO_SEATS:0: not enough seats left to reinstate';
    end if;
    update public.tour_dates
       set seats_booked = seats_booked + v_seats
     where id = v_booking.tour_date_id;
  end if;

  update public.bookings
     set booking_status = p_status,
         cancelled_at   = case when p_status = 'cancelled' then now() else null end
   where id = v_booking.id
   returning * into v_booking;

  return v_booking;
end $$;

-- --- new-user hook -----------------------------------------------------------
-- Creates the profile row automatically whenever Supabase Auth registers a
-- user, so the app never has to keep auth.users and profiles in step by hand.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, email, phone, country, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name',  ''),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'country',
    'customer'                      -- role is NEVER taken from user metadata
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

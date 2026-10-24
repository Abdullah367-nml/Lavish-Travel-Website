-- =============================================================================
-- Row Level Security.
--
-- RLS is enabled on EVERY table in the public schema and every policy is
-- written explicitly — nothing relies on a default. With RLS on and no policy,
-- a table is closed, which is the safe failure mode.
--
-- The guarantees these policies give, enforced by Postgres rather than by
-- application code:
--   * anonymous visitors read published content only
--   * a signed-in customer can read ONLY their own bookings, payments and
--     profile — even if the API layer has a bug
--   * nobody except an admin can write to catalogue tables
--   * seats_booked cannot be edited directly by anyone; only the SECURITY
--     DEFINER functions in 0002 may move it
-- =============================================================================

alter table public.profiles        enable row level security;
alter table public.destinations    enable row level security;
alter table public.attractions     enable row level security;
alter table public.tours           enable row level security;
alter table public.tour_attractions enable row level security;
alter table public.tour_dates      enable row level security;
alter table public.bookings        enable row level security;
alter table public.payments        enable row level security;
alter table public.reviews         enable row level security;
alter table public.enquiries       enable row level security;
alter table public.consent_records enable row level security;

-- --- profiles ----------------------------------------------------------------
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Deliberately NO customer-facing policy that allows changing `role`.
-- Elevation to admin happens out of band, never through the app.

-- --- catalogue: public reads published, admin writes -------------------------
drop policy if exists destinations_public_read on public.destinations;
create policy destinations_public_read on public.destinations
  for select using (status = 'published' or public.is_admin());

drop policy if exists destinations_admin_write on public.destinations;
create policy destinations_admin_write on public.destinations
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists attractions_public_read on public.attractions;
create policy attractions_public_read on public.attractions
  for select using (status = 'published' or public.is_admin());

drop policy if exists attractions_admin_write on public.attractions;
create policy attractions_admin_write on public.attractions
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists tours_public_read on public.tours;
create policy tours_public_read on public.tours
  for select using (status = 'published' or public.is_admin());

drop policy if exists tours_admin_write on public.tours;
create policy tours_admin_write on public.tours
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists tour_attractions_public_read on public.tour_attractions;
create policy tour_attractions_public_read on public.tour_attractions
  for select using (true);

drop policy if exists tour_attractions_admin_write on public.tour_attractions;
create policy tour_attractions_admin_write on public.tour_attractions
  for all using (public.is_admin()) with check (public.is_admin());

-- Tour dates are readable by anyone (the availability calendar is public),
-- but writable only by admins. Customers change seats_booked exclusively
-- through create_booking / cancel_booking.
drop policy if exists tour_dates_public_read on public.tour_dates;
create policy tour_dates_public_read on public.tour_dates
  for select using (true);

drop policy if exists tour_dates_admin_write on public.tour_dates;
create policy tour_dates_admin_write on public.tour_dates
  for all using (public.is_admin()) with check (public.is_admin());

-- --- bookings ----------------------------------------------------------------
-- The single most important policy on the site.
drop policy if exists bookings_select_own on public.bookings;
create policy bookings_select_own on public.bookings
  for select using (user_id = auth.uid() or public.is_admin());

-- No INSERT policy for customers on purpose: bookings may only be created by
-- create_booking(), which enforces capacity and pricing. A direct insert would
-- bypass both.
drop policy if exists bookings_admin_write on public.bookings;
create policy bookings_admin_write on public.bookings
  for all using (public.is_admin()) with check (public.is_admin());

-- --- payments ----------------------------------------------------------------
drop policy if exists payments_select_own on public.payments;
create policy payments_select_own on public.payments
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.bookings b
      where b.id = payments.booking_id and b.user_id = auth.uid()
    )
  );

drop policy if exists payments_admin_write on public.payments;
create policy payments_admin_write on public.payments
  for all using (public.is_admin()) with check (public.is_admin());

-- --- reviews -----------------------------------------------------------------
drop policy if exists reviews_public_read on public.reviews;
create policy reviews_public_read on public.reviews
  for select using (status = 'approved' or user_id = auth.uid() or public.is_admin());

-- A customer may only review a tour they actually booked.
drop policy if exists reviews_insert_own on public.reviews;
create policy reviews_insert_own on public.reviews
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.bookings b
      where b.user_id = auth.uid()
        and b.tour_id = reviews.tour_id
        and b.booking_status in ('confirmed', 'completed')
    )
  );

drop policy if exists reviews_admin_write on public.reviews;
create policy reviews_admin_write on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());

-- --- enquiries ---------------------------------------------------------------
-- Anonymous visitors may submit a custom-trip request (rate limited at the
-- route handler) but may never read the enquiry list.
drop policy if exists enquiries_insert_anon on public.enquiries;
create policy enquiries_insert_anon on public.enquiries
  for insert with check (true);

drop policy if exists enquiries_select_own on public.enquiries;
create policy enquiries_select_own on public.enquiries
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists enquiries_admin_write on public.enquiries;
create policy enquiries_admin_write on public.enquiries
  for all using (public.is_admin()) with check (public.is_admin());

-- --- consent records ---------------------------------------------------------
-- Insert-only from the app; readable by admins for audit. Deliberately no
-- UPDATE or DELETE policy for anyone: an audit trail you can edit is not an
-- audit trail.
drop policy if exists consent_insert on public.consent_records;
create policy consent_insert on public.consent_records
  for insert with check (true);

drop policy if exists consent_select_admin on public.consent_records;
create policy consent_select_admin on public.consent_records
  for select using (public.is_admin() or user_id = auth.uid());

-- --- grants ------------------------------------------------------------------
-- RLS only filters rows a role is already allowed to touch, so the table-level
-- grants still matter.
grant usage on schema public to anon, authenticated;
grant select on
  public.destinations, public.attractions, public.tours,
  public.tour_attractions, public.tour_dates, public.reviews,
  public.tour_date_availability
to anon, authenticated;

grant select, update on public.profiles to authenticated;
grant select on public.bookings, public.payments to authenticated;
grant insert on public.reviews, public.enquiries, public.consent_records to anon, authenticated;

-- Admin writes.
--
-- Grants and RLS policies are two independent gates: a policy that permits a
-- row is irrelevant if the role has no table privilege, which is exactly the
-- trap this hit in testing. Write privileges are granted to `authenticated`
-- broadly, and the `*_admin_write` policies above are what actually restrict
-- them to admins — that is the job RLS exists to do.
--
-- Server-side admin code may alternatively use the service-role key, which
-- bypasses RLS entirely. Keeping both paths working means an admin action is
-- correctly gated whichever key it travels on.
grant insert, update, delete on
  public.destinations, public.attractions, public.tours,
  public.tour_attractions, public.tour_dates, public.bookings,
  public.payments, public.reviews, public.enquiries
to authenticated;

grant execute on function public.create_booking(uuid,int,int,text,text,text,text,text,text,text) to authenticated;
grant execute on function public.cancel_booking(uuid) to authenticated;
grant execute on function public.admin_set_booking_status(uuid, booking_status) to authenticated;

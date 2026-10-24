-- =============================================================================
-- Let the service role satisfy is_admin().
--
-- `admin_set_booking_status()` guards itself with `is_admin()`, which reads
-- app_metadata.role from the caller's JWT. Admin pages in the application
-- use the service-role key, whose JWT carries role = 'service_role' rather
-- than 'admin' — so the function refused its own admin panel.
--
-- Two ways to fix that. Reimplementing the seat arithmetic in application
-- code would duplicate the one piece of logic that must never diverge, so
-- instead the guard now also accepts the service role.
--
-- This is not a widening of trust: the service-role key already bypasses
-- every row-level security policy in the database. Anything holding it can
-- update bookings directly. Accepting it here simply means those updates go
-- through the function that keeps seats_booked correct, instead of around it.
--
-- The application-level gate is unchanged: requireAdmin() checks the
-- caller's role in `profiles` before any service-role client is created.
-- =============================================================================

create or replace function public.is_admin()
returns boolean
language sql stable
as $$
  select
    -- A human admin, identified by the role claim on their own JWT.
    coalesce(
      nullif(current_setting('request.jwt.claims', true), '')::jsonb
        -> 'app_metadata' ->> 'role',
      ''
    ) = 'admin'
    or
    -- Server-side admin code using the service-role key.
    coalesce(
      nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role',
      ''
    ) = 'service_role'
    or
    -- Direct database access (psql, migrations, the SQL editor).
    current_user = 'postgres';
$$;

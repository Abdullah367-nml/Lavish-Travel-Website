-- =============================================================================
-- Fix: creating a user without name metadata failed outright.
--
-- WHAT WENT WRONG
--
-- `profiles.first_name` carried `check (length(trim(first_name)) between 1
-- and 80)`, and `handle_new_user()` fell back to '' when the new auth user
-- had no `first_name` in its metadata. Any account created outside the
-- website's registration form — the dashboard's "Invite user" and "Add
-- user" dialogs, which collect only an email — therefore inserted an empty
-- name, tripped the constraint, and the whole signup was rolled back with:
--
--   new row for relation "profiles" violates check constraint
--   "profiles_first_name_check"
--
-- TWO SEPARATE MISTAKES, BOTH FIXED HERE
--
-- 1. The constraint was wrong. A profile with no name yet is a legitimate
--    state: an invited user has not told us their name, and an OAuth
--    provider may not supply one. Requiring it at the database level
--    conflates "we need this eventually" with "this row is invalid".
--
-- 2. More importantly, the trigger could raise at all. A trigger on
--    auth.users runs inside the signup transaction, so ANY exception it
--    throws — a constraint, a typo, a future column change — blocks
--    authentication for everybody. An auxiliary side effect must never be
--    able to take down the thing it is attached to. It is now wrapped so
--    that a failure is logged and signup proceeds regardless.
-- =============================================================================

-- --- 1. Relax the name constraints -------------------------------------------
alter table public.profiles drop constraint if exists profiles_first_name_check;
alter table public.profiles drop constraint if exists profiles_last_name_check;

alter table public.profiles
  add constraint profiles_first_name_check check (length(first_name) <= 80);
alter table public.profiles
  add constraint profiles_last_name_check  check (length(last_name)  <= 80);

-- --- 2. Make the trigger tolerant and non-fatal -------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_first   text;
  v_last    text;
  v_full    text;
  v_local   text;
begin
  -- Accept the several shapes different sign-up paths produce:
  --   our form      -> first_name / last_name
  --   OAuth (Google)-> full_name or name
  --   invite dialog -> nothing at all
  v_first := nullif(trim(coalesce(new.raw_user_meta_data ->> 'first_name', '')), '');
  v_last  := nullif(trim(coalesce(new.raw_user_meta_data ->> 'last_name',  '')), '');
  v_full  := nullif(trim(coalesce(
               new.raw_user_meta_data ->> 'full_name',
               new.raw_user_meta_data ->> 'name',
               '')), '');

  if v_first is null and v_full is not null then
    v_first := split_part(v_full, ' ', 1);
    -- Everything after the first space, so "Anna Maria van der Merwe" keeps
    -- its surname intact rather than becoming "Maria".
    v_last  := coalesce(v_last, nullif(trim(substr(v_full, length(split_part(v_full, ' ', 1)) + 2)), ''));
  end if;

  -- Last resort: the local part of the email, so the admin list shows
  -- something recognisable rather than a blank row.
  v_local := split_part(coalesce(new.email, ''), '@', 1);
  v_first := coalesce(v_first, nullif(v_local, ''), 'Guest');
  v_last  := coalesce(v_last, '');

  insert into public.profiles (id, first_name, last_name, email, phone, country, role)
  values (
    new.id,
    left(v_first, 80),
    left(v_last, 80),
    coalesce(new.email, ''),
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'country',
    'customer'          -- never taken from user metadata; see 0002
  )
  on conflict (id) do nothing;

  return new;

exception when others then
  -- Never block authentication because a profile row could not be written.
  -- The account still exists; the profile can be repaired afterwards, and
  -- `getProfile()` in the app handles a missing profile gracefully.
  raise warning 'handle_new_user failed for %: % (%)', new.id, sqlerrm, sqlstate;
  return new;
end $$;

-- --- 3. Backfill any profile that is already blank ----------------------------
update public.profiles
set first_name = coalesce(nullif(first_name, ''), nullif(split_part(email, '@', 1), ''), 'Guest')
where first_name = '' or first_name is null;

-- --- 4. Repair users who have no profile at all -------------------------------
-- If a signup failed the way this migration fixes, the auth user may exist
-- with no profile row. Without one, that person cannot book: create_booking()
-- raises PROFILE_MISSING.
insert into public.profiles (id, first_name, last_name, email, phone, country, role)
select
  u.id,
  coalesce(
    nullif(trim(u.raw_user_meta_data ->> 'first_name'), ''),
    nullif(split_part(coalesce(u.email, ''), '@', 1), ''),
    'Guest'
  ),
  coalesce(nullif(trim(u.raw_user_meta_data ->> 'last_name'), ''), ''),
  coalesce(u.email, ''),
  u.raw_user_meta_data ->> 'phone',
  u.raw_user_meta_data ->> 'country',
  'customer'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

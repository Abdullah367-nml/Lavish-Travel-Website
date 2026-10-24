# Supabase setup — do this once

The database layer is written and tested. It needs a Supabase project to live
in, and only you can create that (I cannot sign up on your behalf).

Budget about 15 minutes.

## 1. Create the project

1. Go to https://supabase.com and sign up (free tier is fine to start).
2. **New project.**
3. Name: `lavish-travels-tours`
4. **Region: `Central EU (Frankfurt) eu-central-1`.**

   Supabase has **no African region** — verified against their published list,
   which covers the Americas, Europe and Asia-Pacific only. AWS has a Cape
   Town region, but Supabase does not deploy into it.

   Frankfurt is the right compromise: South African international traffic
   routes to Europe over the subsea cables, so European latency is materially
   better than Asia-Pacific despite Mumbai looking closer on a map. London
   (`eu-west-2`) or Ireland (`eu-west-1`) are equally acceptable.

   **This is still POPIA-compliant, but it is now something you must document
   rather than something the region choice handles for you.** See
   "Cross-border transfer" below.
5. Set a strong database password and save it in a password manager. You will
   need it in step 3 and it cannot be recovered, only reset.

## 2. Run the migrations

In the Supabase dashboard, open **SQL Editor** and run these four files **in
this exact order**, pasting the contents of each and clicking Run:

| Order | File | What it does |
|---|---|---|
| 1 | `migrations/0001_schema.sql` | Tables, enums, indexes, constraints |
| 2 | `migrations/0002_functions.sql` | Booking logic, availability view, auth trigger |
| 3 | `migrations/0003_rls.sql` | Row Level Security policies and grants |
| 4 | `seed.sql` | Cape Town + Stellenbosch, 19 attractions, 7 tours, dates |

Each should finish with "Success". `NOTICE: ... does not exist, skipping`
lines are normal — the scripts are written to be re-runnable.

## 3. Collect the keys

**Settings → API:**

- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

**Settings → Database → Connection string → URI:**

- → `DATABASE_URL` (replace `[YOUR-PASSWORD]` with the password from step 1)

Put them in `.env.local` in the project root. That file is git-ignored.

> ⚠ The **service_role key bypasses every security policy in the database**.
> It must never appear in a `NEXT_PUBLIC_` variable, never be sent to the
> browser, and never be committed. It is used only in server-side admin code.

## 4. Create your admin user

Roles are deliberately **not** settable through the signup form — otherwise
anyone could register themselves as an administrator.

1. Register normally on the site (or **Authentication → Users → Add user** in
   the dashboard).
2. In **SQL Editor**, run — with your own email:

```sql
update public.profiles
set role = 'admin'
where email = 'you@lavishtravelstours.co.za';
```

3. Then set the matching JWT claim, which is what the security policies
   actually read:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
                        || '{"role":"admin"}'::jsonb
where email = 'you@lavishtravelstours.co.za';
```

Sign out and back in so the new token carries the claim.

## Cross-border transfer — what POPIA actually requires

POPIA section 72 does **not** ban storing personal information outside South
Africa. It requires a lawful basis for the transfer. The usual basis, and the
one that applies here, is that the recipient is bound by an agreement giving
protection substantially similar to POPIA's own principles.

Three things make that basis real, and all three are your responsibility:

1. **Sign Supabase's Data Processing Addendum.** Available in the dashboard
   under Settings → Legal, or from their privacy page. Keep a copy.
2. **Name the transfer in the privacy policy** — that customer data is
   processed by Supabase on infrastructure in the EU, and that the section 72
   basis is the DPA plus the recipient jurisdiction's own data protection
   regime.
3. **Name Supabase in your processor register**, alongside Resend and
   whichever payment gateway you choose.

Hosting in the EU rather than the US genuinely helps here: GDPR is a
recognised comparable regime, which makes the "adequate protection" argument
straightforward. A US region would make the same argument harder.

**If the client insists the data must physically stay in South Africa**, the
options are self-hosting Supabase on AWS `af-south-1` (Cape Town), or running
plain PostgreSQL on AWS RDS in `af-south-1` and dropping Supabase Auth for
another library. Both are real options; both cost meaningfully more time and
money than a managed Supabase project. Worth raising with them explicitly
rather than deciding for them.

## What the database guarantees

These are enforced by Postgres, not by the website, so they hold even if the
application code has a bug:

- **Overbooking is impossible.** `create_booking()` takes a row lock on the
  departure before counting seats, so two people clicking "Book" at the same
  instant cannot both take the last seat. A `CHECK` constraint is the final
  backstop — verified by pushing a direct superuser write, which the database
  refused.
- **Prices cannot be tampered with.** The total is calculated inside the
  database from the `tours` table. No price is accepted from the browser.
- **Customers see only their own bookings.** Verified by querying another
  customer's booking id directly and getting zero rows back.
- **Bookings cannot be created by any route except `create_booking()`**, so
  capacity and pricing can never be bypassed.
- **Consent records cannot be edited or deleted by anyone** — an audit trail
  you can rewrite is not an audit trail.

## Verified before delivery

All of the above was run against a real PostgreSQL 16 instance. 19 tests,
including six simultaneous bookings racing for four seats: exactly two
succeeded, four were correctly refused, and the departure finished at 14 of 14
seats — never oversold.

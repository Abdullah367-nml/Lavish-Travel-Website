import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase clients for server-side use.
 *
 * There are two, and the difference matters enormously:
 *
 *   supabaseServer()  — acts AS THE SIGNED-IN USER. Every query is filtered by
 *                       the row-level security policies. This is what almost
 *                       all application code should use.
 *
 *   supabaseAdmin()   — uses the service-role key and BYPASSES RLS entirely.
 *                       Reserved for admin routes and webhooks, and only after
 *                       the caller's admin role has already been verified.
 *                       Reaching for this "because the query didn't work" is
 *                       how a data leak gets written.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and fill it in — see supabase/SETUP.md.`,
    );
  }
  return value;
}

/** Is Supabase configured at all? Lets pages degrade instead of crashing. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Request-scoped client carrying the user's session cookie.
 * RLS applies, so a query for `bookings` returns only that user's rows.
 */
export async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // Harmless: middleware.ts refreshes the session on every request,
            // so the token stays current regardless.
          }
        },
      },
    },
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let publicClient: SupabaseClient<any, "public", any> | null = null;

/**
 * Anonymous client for public catalogue reads — no cookies, no session.
 * Reused across requests for persistent HTTP/2 connection pooling.
 */
export function supabasePublic() {
  if (!publicClient) {
    publicClient = createClient(
      requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
      requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
      { auth: { persistSession: false } },
    );
  }
  return publicClient;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let adminClient: SupabaseClient<any, "public", any> | null = null;

/**
 * Service-role client. Bypasses every RLS policy.
 * Reused across requests for persistent connection pooling and fast execution.
 *
 * NEVER import this into a Client Component, and never call it on a route
 * that has not already checked that the caller is an admin.
 */
export function supabaseAdmin() {
  if (!adminClient) {
    adminClient = createClient(
      requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return adminClient;
}

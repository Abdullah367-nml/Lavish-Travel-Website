"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser client, for Client Components that need to sign in, sign out, or
 * read the current session.
 *
 * Only ever uses the anon key — which is safe to ship to the browser, because
 * it grants nothing on its own. What a request can actually see is decided by
 * the row-level security policies, evaluated against the user's JWT.
 */
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

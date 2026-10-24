import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Session refresh and route protection.
 *
 * Next.js 16 renamed this convention: the file is `proxy.ts` and the export
 * is `proxy`. `middleware.ts` still runs but logs a deprecation warning, and
 * having BOTH files present is a hard error — so the old one is deleted
 * rather than left behind.
 *
 * Supabase access tokens are short-lived. Without a refresh on each request
 * a user appears signed in in the browser while every server render sees
 * them as anonymous — which shows up as bookings mysteriously vanishing.
 * Refreshing here keeps client and server in agreement.
 *
 * The redirect below is a convenience, not the security boundary. The real
 * enforcement is row-level security in Postgres plus the per-page checks in
 * lib/auth.ts. Middleware alone is never sufficient: it can be bypassed by
 * anything that reaches a route handler or Server Action directly.
 */
const PROTECTED = ["/my-bookings", "/booking", "/profile", "/admin"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Not configured yet — let everything through rather than locking the site.
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Verifies the token with Supabase and refreshes it if needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  if (!user && PROTECTED.some((p) => path.startsWith(p))) {
    const signIn = new URL("/login", request.url);
    signIn.searchParams.set("next", path + request.nextUrl.search);
    return NextResponse.redirect(signIn);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and image optimisation. Running the
     * session refresh on every image request would be pure waste.
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|woff2)$).*)",
  ],
};

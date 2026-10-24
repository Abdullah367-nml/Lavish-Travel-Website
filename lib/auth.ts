import "server-only";
import { notFound, redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";
import { supabaseServer } from "@/lib/supabase/server";

/**
 * Server-side auth helpers.
 *
 * Always `getUser()`, never `getSession()`, when deciding whether someone is
 * allowed to do something. `getSession()` reads the cookie and trusts it;
 * `getUser()` verifies the token against Supabase. On a server that
 * difference is the whole point — a cookie is user-controlled input.
 */

export async function getUser(): Promise<User | null> {
  try {
    const supabase = await supabaseServer();
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user;
  } catch {
    // No Supabase configured, or the service is unreachable. Treat as signed
    // out rather than throwing — a broken auth service should not take the
    // whole site down.
    return null;
  }
}

export async function getProfile(): Promise<Profile | null> {
  const user = await getUser();
  if (!user) return null;

  try {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    if (error || !data) return null;

    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phone: data.phone,
      country: data.country,
      role: data.role,
      createdAt: data.created_at,
    };
  } catch {
    return null;
  }
}

/**
 * Gate a customer page. Sends the visitor to sign in and remembers where they
 * were going, so they land back on the booking they were part-way through
 * rather than on the home page.
 */
export async function requireUser(returnTo: string): Promise<User> {
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  return user;
}

/**
 * Gate an admin page.
 *
 * A non-admin who reaches an admin URL gets notFound(), not a redirect to a
 * login page — there is no reason to confirm that /admin/bookings exists to
 * someone who may be probing. The database policies deny them the data
 * regardless; this just avoids the disclosure.
 */
export async function requireAdmin(): Promise<Profile> {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") notFound();
  return profile;
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.role === "admin";
}

import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";
import { supabaseServer } from "@/lib/supabase/server";

/**
 * Server-side auth helpers with per-request memoization.
 *
 * Wrapped with React `cache` so layout and nested page/action calls share
 * a single validated user and profile per HTTP request rather than firing
 * multiple redundant round-trips to Supabase.
 */

export const getUser = cache(async (): Promise<User | null> => {
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
});

export const getProfile = cache(async (): Promise<Profile | null> => {
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
});

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
 * Uses the memoized profile. If no user session exists, redirects to login.
 * If user exists but is not an admin, returns notFound() (404) to avoid disclosure.
 */
export const requireAdmin = cache(async (): Promise<Profile> => {
  const profile = await getProfile();
  if (!profile) {
    const user = await getUser();
    if (!user) {
      redirect("/admin/login?next=/admin");
    }
    notFound();
  }
  if (profile.role !== "admin") notFound();
  return profile;
});

export const isAdmin = cache(async (): Promise<boolean> => {
  const profile = await getProfile();
  return profile?.role === "admin";
});

import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

/**
 * The admin gate.
 *
 * `requireAdmin()` reads the caller's role from `profiles` and calls
 * notFound() for anyone else — a 404 rather than a redirect, so probing
 * cannot confirm these routes exist. It runs on the server before any admin
 * markup is generated, so nothing leaks even momentarily.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAdmin();
  const name = `${profile.firstName} ${profile.lastName}`.trim() || profile.email;
  return <AdminShell adminName={name}>{children}</AdminShell>;
}

import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Lavish Admin" },
  robots: { index: false, follow: false, nocache: true },
};

/**
 * No authentication check here on purpose.
 *
 * /admin/login sits under this layout and must stay reachable when signed
 * out — a locked door cannot also be the key. The gate lives one level down
 * in (protected)/layout.tsx, which wraps every real admin page.
 *
 * Route groups are what make this possible: the parentheses in (protected)
 * organise files without appearing in the URL, so the dashboard is still
 * /admin, not /admin/protected.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

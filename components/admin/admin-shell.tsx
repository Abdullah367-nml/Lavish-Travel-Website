"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  MapPin,
  Landmark,
  CalendarDays,
  Ticket,
  Users,
  CreditCard,
  Star,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/**
 * Admin shell: sidebar on desktop, slide-over drawer on mobile.
 *
 * Same brand colours as the public site, but a management layout rather than
 * a marketing one — dense, high-contrast, fixed navigation. An admin panel
 * that looks like the storefront makes it easy to forget which one you are
 * looking at, and that is how someone publishes a draft by accident.
 */

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/tours", label: "Tours", icon: Map },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/attractions", label: "Attractions", icon: Landmark },
  { href: "/admin/tour-dates", label: "Tour Dates", icon: CalendarDays },
  { href: "/admin/bookings", label: "Bookings", icon: Ticket },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  children,
  adminName,
}: {
  children: React.ReactNode;
  adminName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  async function signOut() {
    await supabaseBrowser().auth.signOut();
    router.push("/");
    // refresh() after push discards every cached Server Component render
    // tied to the old session. Without it the admin shell can linger on
    // screen after the cookie is already gone.
    router.refresh();
  }

  const nav = (
    <nav aria-label="Admin sections" className="flex flex-1 flex-col gap-1">
      {NAV.map((item) => {
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-[44px] items-center gap-3 rounded-sm px-3 text-body-sm transition-colors",
              active
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
            )}
          >
            <item.icon aria-hidden className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-dvh bg-background">
      {/* --- Desktop sidebar --------------------------------------------- */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface p-4 lg:flex">
        <div className="px-3 py-2">
          <p className="font-display text-heading-sm uppercase tracking-[0.2em] text-foreground">
            Lavish
          </p>
          <p className="mt-0.5 text-caption uppercase tracking-[0.18em] text-accent">
            Admin
          </p>
        </div>

        <div className="mt-6 flex flex-1 flex-col">{nav}</div>

        <div className="mt-4 flex flex-col gap-1 border-t border-border pt-4">
          <Link
            href="/"
            className="flex min-h-[44px] items-center gap-3 rounded-sm px-3 text-body-sm text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
          >
            <ExternalLink aria-hidden className="size-4 shrink-0" />
            View public site
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex min-h-[44px] items-center gap-3 rounded-sm px-3 text-left text-body-sm text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
          >
            <LogOut aria-hidden className="size-4 shrink-0" />
            Log out
          </button>
          <p className="mt-2 px-3 text-caption text-muted-foreground">
            {adminName}
          </p>
        </div>
      </aside>

      {/* --- Mobile drawer ------------------------------------------------ */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-background/80"
            onClick={() => setOpen(false)}
          />
          <div className="animate-rise absolute inset-y-0 left-0 flex w-72 flex-col border-r border-border bg-surface p-4">
            <div className="flex items-center justify-between px-3 py-2">
              <p className="font-display text-heading-sm uppercase tracking-[0.2em] text-foreground">
                Lavish Admin
              </p>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex size-11 items-center justify-center text-muted-foreground"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>
            <div className="mt-4 flex flex-1 flex-col">{nav}</div>
            <button
              type="button"
              onClick={signOut}
              className="flex min-h-[44px] items-center gap-3 rounded-sm border-t border-border px-3 pt-4 text-left text-body-sm text-muted-foreground"
            >
              <LogOut aria-hidden className="size-4" />
              Log out
            </button>
          </div>
        </div>
      )}

      {/* --- Content ------------------------------------------------------ */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-border bg-surface px-4 lg:hidden">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="flex size-11 items-center justify-center text-foreground"
          >
            <Menu aria-hidden className="size-5" />
          </button>
          <p className="font-display text-heading-sm uppercase tracking-[0.2em] text-foreground">
            Lavish Admin
          </p>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

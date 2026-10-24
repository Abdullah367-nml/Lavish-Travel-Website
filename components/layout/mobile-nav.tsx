"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRIMARY_CTA, SECONDARY_CTA } from "./nav-links";
import { PRIMARY_NAV } from "./nav-links";

/**
 * Full-screen overlay navigation for mobile, per Section 7. This is the
 * one genuinely interactive island in the header — everything else in the
 * layout ships as Server Components.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the overlay is open, and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X aria-hidden /> : <Menu aria-hidden />}
      </Button>

      {open && (
        <div
          id="mobile-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="animate-fade-in fixed inset-0 top-16 z-40 flex flex-col overflow-y-auto bg-background px-6 py-8"
        >
          <nav aria-label="Primary">
            <ul className="flex flex-col gap-1">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href} className="border-b border-border">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] items-center py-4 text-base font-medium tracking-wide text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-3 pt-8">
            <Button asChild size="lg">
              <Link href="/enquire" onClick={() => setOpen(false)}>
                Plan Your Journey
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border hover:border-[#25D366] hover:text-[#25D366]">
              <a
                href="https://wa.me/27000000000?text=Hi%20Lavish%20Travels%20%26%20Tours%2C%20I%20would%20like%20to%20enquire%20about%20a%20tour."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
              >
                <MessageCircle className="mr-2 size-4 text-[#25D366]" />
                WhatsApp Concierge
              </a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href="tel:+27000000000" onClick={() => setOpen(false)}>
                Call: +27 (0)00 000 0000
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

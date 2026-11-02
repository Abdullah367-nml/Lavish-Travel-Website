"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRIMARY_NAV } from "./nav-links";
import { Logo } from "./logo";

/**
 * Full-screen overlay navigation for mobile.
 * Uses a React Portal directly to document.body so that header backdrop-filters
 * or parent heights never clip or leak background content through.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        className="text-foreground hover:bg-white/10"
      >
        <Menu aria-hidden className="size-6" />
      </Button>

      {open &&
        mounted &&
        createPortal(
          <div
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-[9999] flex flex-col bg-[#050506] text-foreground"
          >
            {/* Top Bar with Brand Logo and Close Button */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-[#050506] px-4 sm:px-6">
              <Logo />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="text-foreground hover:bg-white/10"
              >
                <X aria-hidden className="size-6" />
              </Button>
            </div>

            {/* Scrollable Nav Links Body */}
            <div className="flex flex-1 flex-col justify-between overflow-y-auto px-6 py-6">
              <nav aria-label="Primary mobile navigation">
                <ul className="flex flex-col divide-y divide-border/60">
                  {PRIMARY_NAV.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex min-h-[52px] items-center py-3 text-lg font-medium tracking-wide text-foreground transition-colors hover:text-accent"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col gap-3 pb-8 pt-4">
                <Button asChild size="lg" className="w-full text-base font-semibold shadow-md">
                  <Link href="/enquire" onClick={() => setOpen(false)}>
                    Plan Your Journey
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-semibold shadow-md"
                >
                  <a
                    href="https://wa.me/27624015042?text=Hi%20Lavish%20Travels%20%26%20Tours%2C%20I%20would%20like%20to%20enquire%20about%20a%20tour."
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                  >
                    <MessageCircle className="mr-2 size-5 fill-black/10 text-black" />
                    Chat on WhatsApp
                  </a>
                </Button>
                <Button asChild variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
                  <a href="tel:+27624015042" onClick={() => setOpen(false)}>
                    Call: +27 62 401 5042
                  </a>
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

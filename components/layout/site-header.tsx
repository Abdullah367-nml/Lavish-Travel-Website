import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { PRIMARY_NAV } from "./nav-links";
import { Button } from "@/components/ui/button";

/**
 * Server Component shell. The only client-side interactivity lives in
 * <MobileNav /> (the overlay toggle) — everything else here is static
 * markup, keeping the header's contribution to INP effectively zero.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-6 lg:flex">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-5 xl:gap-7">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Button
            asChild
            size="sm"
            className="bg-[#25D366] text-black hover:bg-[#20bd5a] font-semibold"
          >
            <a
              href="https://wa.me/27624015042?text=Hi%20Lavish%20Travels%20%26%20Tours%2C%20I%20would%20like%20to%20enquire%20about%20a%20private%20tour."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
            >
              <MessageCircle className="size-4 fill-black/10 text-black" />
              <span>WhatsApp</span>
            </a>
          </Button>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}

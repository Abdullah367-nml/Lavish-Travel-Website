import Link from "next/link";
import { Logo } from "./logo";

/**
 * Rich footer shell (Section 4 #1). Structure and NAP/legal placeholders
 * are wired up now; real copy, TGCSA/SATSA badges, and social links land
 * with the pages that reference them in later sections.
 */
const FOOTER_COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Services",
    links: [
      { label: "Airport Transfers", href: "/transfers" },
      { label: "Chauffeur Hire", href: "/chauffeur" },
      { label: "Self-Drive Car Hire", href: "/car-hire" },
      { label: "Day Tours", href: "/tours" },
      { label: "Multi-Day Packages", href: "/tours" },
      { label: "Corporate & Events", href: "/contact" },
    ],
  },
  {
    heading: "Destinations",
    links: [
      { label: "Cape Town", href: "/destinations" },
      { label: "Garden Route", href: "/destinations" },
      { label: "Kruger & Panorama Route", href: "/destinations" },
      { label: "Drakensberg", href: "/destinations" },
      { label: "Victoria Falls & Cross-Border", href: "/destinations" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Fleet", href: "/fleet" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "POPIA Notice", href: "/popia" },
      { label: "Cancellation Policy", href: "/cancellation-policy" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-6">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Luxury travel, tours and chauffeur transfers across South
              Africa — Cape Town, Johannesburg, Durban and beyond.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="text-sm font-semibold tracking-wide text-foreground">
                {column.heading}
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

                {/* ECTA s.43 supplier disclosure — placeholder values to be
            replaced with the real registration details in Section 9. */}
        <div className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          <p>
            Lavish Travels & Tours (Pty) Ltd &middot; Reg. No.
            [COMPANY-REGISTRATION-NUMBER] &middot; VAT No.
            [VAT-NUMBER] &middot; [PHYSICAL-BUSINESS-ADDRESS], South Africa
          </p>
          <p className="mt-2">
            &copy; {year} Lavish Travels & Tours. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

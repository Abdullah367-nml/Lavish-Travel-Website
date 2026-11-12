import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { Logo } from "./logo";
import { site } from "@/lib/site";
import { getDirectEmailUrl, getWhatsAppGeneralUrl } from "@/lib/whatsapp";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

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
      { label: "Facebook Page", href: site.facebook },
      { label: "Admin Portal", href: "/admin" },
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
            <div className="mt-5 flex flex-col gap-2 text-xs text-muted-foreground">
              <a
                href={getDirectEmailUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-accent"
              >
                <Mail className="size-3.5 text-accent" />
                ilavishtravels@gmail.com
              </a>
              <a
                href={getWhatsAppGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-[#25D366]"
              >
                <MessageCircle className="size-3.5 text-[#25D366]" />
                WhatsApp: +27 62 401 5042
              </a>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-[#1877F2]"
              >
                <FacebookIcon className="size-3.5 text-[#1877F2]" />
                Facebook: Lavish Travels
              </a>
            </div>
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
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
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

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground sm:flex-row sm:items-center">
          <p>Lavish Travels &amp; Tours (Pvt) Ltd</p>
          <Link
            href="/admin"
            className="text-xs font-medium text-muted-foreground/80 transition-colors hover:text-accent"
          >
            Staff &amp; Admin Portal &rarr;
          </Link>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { MessageCircle, FileText } from "lucide-react";

/**
 * Context-aware WhatsApp entry points.
 *
 * The brief asks for the WhatsApp message to be pre-filled with the page
 * the visitor is on, which is why this is a Client Component — it needs
 * `usePathname()`. It is deliberately tiny: two links and a lookup table,
 * so the JavaScript cost against INP is negligible.
 *
 * Phase 1 uses plain wa.me click-to-chat. The WhatsApp Business API (via a
 * BSP) arrives in Phase 2 for automated booking confirmations.
 */

import { WHATSAPP_NUMBER, getWhatsAppBookingUrl } from "@/lib/whatsapp";
export { getWhatsAppBookingUrl };

/**
 * Human-readable context per route prefix, so the message reads like a
 * person wrote it rather than pasting a URL. Longest prefix wins.
 */
const CONTEXT_LABELS: [string, string][] = [
  ["/tours", "a tour package"],
  ["/transfers", "an airport transfer"],
  ["/chauffeur", "chauffeur hire"],
  ["/car-hire", "self-drive car hire"],
  ["/destinations", "a destination"],
  ["/fleet", "your fleet"],
  ["/enquire", "a quote"],
  ["/blog", "a trip"],
];

function buildMessage(pathname: string): string {
  const match = CONTEXT_LABELS.filter(([prefix]) =>
    pathname.startsWith(prefix),
  ).sort((a, b) => b[0].length - a[0].length)[0];

  const subject = match ? match[1] : "your services";
  return `Hi Lavish Travels & Tours, I would like to enquire about ${subject}.`;
}

export function useWhatsAppHref(): string {
  const pathname = usePathname();
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildMessage(pathname),
  )}`;
}

/**
 * Floating action button — desktop and tablet only.
 */
export function WhatsAppFab() {
  const href = useWhatsAppHref();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with our travel concierge on WhatsApp"
      className="group fixed bottom-6 right-6 z-40 hidden items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-black shadow-[0_4px_25px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-105 hover:bg-[#20bd5a] focus-visible:ring-2 focus-visible:ring-[#25D366] md:flex"
    >
      <MessageCircle aria-hidden className="size-5 text-black fill-black/10" />
      <span className="text-xs font-bold uppercase tracking-wider text-black">
        Chat with Concierge
      </span>
    </a>
  );
}

/**
 * Sticky bottom action bar — mobile only.
 */
export function MobileActionBar() {
  const href = useWhatsAppHref();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-px border-t border-border bg-border md:hidden">
      <Link
        href="/tours"
        className="flex min-h-[56px] items-center justify-center gap-2 bg-surface text-caption font-semibold uppercase tracking-[0.16em] text-foreground"
      >
        <FileText aria-hidden className="size-4 text-accent" />
        Explore Tours
      </Link>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[56px] items-center justify-center gap-2 bg-[#25D366] text-caption font-bold uppercase tracking-[0.16em] text-black shadow-md"
      >
        <MessageCircle aria-hidden className="size-4 text-black fill-black/10" />
        WhatsApp Concierge
      </a>
    </div>
  );
}

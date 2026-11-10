import Link from "next/link";
import { cn } from "@/lib/utils";
import { LOGO_DATA_URI } from "@/lib/logo-data-uri";

/**
 * Lavish Travels & Tours — Official Cape Town & Safari Circular Emblem.
 * Uses an inline 3x-Retina WebP data URI (LOGO_DATA_URI) with synchronous
 * decoding so the emblem renders in 0ms on the very first HTML paint with
 * zero network latency and no placeholder circle flash.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-3 outline-none", className)}
      aria-label="Lavish Travels & Tours — South Africa"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_DATA_URI}
        alt="Lavish Travels & Tours — Official Emblem"
        width={52}
        height={52}
        decoding="sync"
        fetchPriority="high"
        className="size-[52px] shrink-0 rounded-full object-contain drop-shadow-[0_0_16px_rgba(245,176,39,0.45)] transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_24px_rgba(245,176,39,0.7)]"
      />

      <div className="flex flex-col">
        <span className="font-display text-base font-bold tracking-[0.22em] text-foreground transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-amber-200 group-hover:to-accent group-hover:bg-clip-text group-hover:text-transparent sm:text-lg">
          LAVISH
        </span>
        <span className="text-[8.5px] font-semibold tracking-[0.32em] text-accent/95">
          TRAVELS &amp; TOURS
        </span>
      </div>
    </Link>
  );
}

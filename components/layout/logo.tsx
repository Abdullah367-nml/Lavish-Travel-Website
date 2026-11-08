import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Lavish Travels & Tours — South African Springbok & Rugby Heritage Luxury Crest.
 * Features the leaping 24K Gold Springbok antelope arching over a golden rugby ball
 * beneath Table Mountain, set in an obsidian & Springbok-green medallion.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-3 outline-none", className)}
      aria-label="Lavish Travels & Tours — South Africa"
    >
      <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[0_0_22px_rgba(245,176,39,0.4)] ring-1 ring-amber-400/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(245,176,39,0.65)] group-hover:ring-amber-300/80">
        <Image
          src="/images/logo-circle.png"
          alt="Lavish Travels & Tours — Official Emblem"
          width={56}
          height={56}
          priority
          unoptimized
          className="size-12 rounded-full object-cover"
        />
      </div>

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

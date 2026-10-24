import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * World-class luxury brand mark.
 * Combines the 24K Gold African Safari & Table Mountain Crest
 * with high-kerning luxury typography.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-3 outline-none", className)}
      aria-label="Lavish Travels & Tours — home"
    >
      <div className="relative flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/30 via-black to-black p-0.5 shadow-[0_0_20px_rgba(255,179,0,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_28px_rgba(255,179,0,0.55)]">
        <Image
          src="/images/logo.svg"
          alt="Lavish Travels & Tours 24K Gold Crest"
          width={48}
          height={48}
          priority
          className="size-10 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
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

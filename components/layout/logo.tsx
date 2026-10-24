import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * State-of-the-art international brand logo.
 * Combines the African landmark crest (Table Mountain, Acacia & Safari Elephant)
 * with refined luxury typography.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-3 outline-none", className)}
      aria-label="Lavish Travels & Tours — home"
    >
      <div className="relative flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 via-black to-black p-0.5 shadow-[0_0_15px_rgba(255,149,0,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_22px_rgba(255,149,0,0.45)]">
        <Image
          src="/images/logo.svg"
          alt="Lavish Travels African crest"
          width={44}
          height={44}
          priority
          className="size-10 object-contain drop-shadow"
        />
      </div>

      <div className="flex flex-col">
        <span className="font-display text-base font-bold tracking-[0.18em] text-foreground transition-colors group-hover:text-accent sm:text-lg">
          LAVISH
        </span>
        <span className="text-[9px] font-semibold tracking-[0.28em] text-accent/90">
          TRAVELS &amp; TOURS
        </span>
      </div>
    </Link>
  );
}

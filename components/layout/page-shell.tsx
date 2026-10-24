import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Shared shell for routes whose full build lands in Section 4.
 *
 * These are NOT throwaway pages — each route carries its own real
 * metadata, canonical URL, H1 and intro copy, so the URL structure and
 * internal linking are crawlable and correct from day one. Section 4
 * replaces the body of each page with its real content (hero galleries,
 * filters, itineraries, pricing tables) without touching the routing.
 *
 * All copy is passed in as props rather than written as JSX text so
 * apostrophes and ampersands in the marketing copy stay plain strings.
 */
export type PageShellProps = {
  /** Small uppercase label above the heading, e.g. "TOURS & PACKAGES". */
  eyebrow: string;
  /** The page H1. */
  title: string;
  /** One or two sentences of real intro copy. */
  intro: string;
  /** What this page will contain once Section 4 is built. */
  upcoming?: string[];
  /** Show the Book Now / Custom Trip CTA pair. Defaults to true. */
  showCta?: boolean;
};

export function PageShell({
  eyebrow,
  title,
  intro,
  upcoming,
  showCta = true,
}: PageShellProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <p className="text-caption font-medium tracking-[0.3em] text-accent">
        {eyebrow}
      </p>

      <h1 className="mt-4 text-display-sm font-display uppercase text-foreground sm:text-display-md">
        {title}
      </h1>

      <p className="mt-6 max-w-2xl text-body-lg leading-relaxed text-muted-foreground">
        {intro}
      </p>

      {upcoming && upcoming.length > 0 && (
        <section
          aria-labelledby="upcoming-heading"
          className="mt-12 rounded-md border border-border bg-surface p-6 sm:p-8"
        >
          <h2
            id="upcoming-heading"
            className="text-heading-sm font-display uppercase tracking-wide text-foreground"
          >
            Coming to this page
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {upcoming.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-body-sm text-muted-foreground"
              >
                <span
                  aria-hidden
                  className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-accent"
                />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {showCta && (
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/tours">Book Now</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/enquire">Request a Custom Trip</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

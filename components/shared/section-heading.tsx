import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The repeated section header pattern: small champagne eyebrow, display
 * heading, optional lead paragraph, optional "view all" link on the right.
 *
 * Using one component for every section is what keeps vertical rhythm
 * consistent down a long homepage.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  href,
  linkLabel = "View all",
  align = "left",
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className="text-caption font-medium tracking-[0.3em] text-accent">
            {eyebrow}
          </p>
        )}
        <Heading className="mt-3 font-display text-display-sm uppercase text-foreground sm:text-[2.25rem]">
          {title}
        </Heading>
        {lead && (
          <p className="mt-4 text-body-md leading-relaxed text-muted-foreground">
            {lead}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-2 text-caption font-medium uppercase tracking-[0.18em] text-accent transition-colors hover:text-accent-hover"
        >
          {linkLabel}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}

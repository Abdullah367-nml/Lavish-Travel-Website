import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Surface panel used for tour cards, vehicle cards, pricing blocks and
 * anything else that needs to sit above the page background.
 *
 * The hover treatment lifts the border to the accent rather than adding a
 * shadow — drop shadows read as muddy smudges on a near-black background.
 */
function Card({
  className,
  interactive = false,
  ...props
}: React.ComponentProps<"div"> & { interactive?: boolean }) {
  return (
    <div
      data-slot="card"
      className={cn(
        // gradient background for modern luxury
        "bg-gradient-to-b from-gradient-from to-gradient-to",
        // rounded corners and border
        "rounded-xl border border-border",
        // surface metal rim top still applies
        "surface-metal rim-top relative overflow-hidden",
        interactive &&
          "transition-all duration-300 hover:border-accent/60 hover:shadow-glow focus-within:border-accent/60",
        className,
      )}
      {...props}
    />
  );
}

function CardBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-5 sm:p-6", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "font-display text-heading-md uppercase tracking-wide text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CardMeta({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-caption font-medium tracking-[0.18em] text-muted-foreground uppercase",
        className,
      )}
      {...props}
    />
  );
}

function CardText({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-body-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Card, CardBody, CardTitle, CardMeta, CardText };

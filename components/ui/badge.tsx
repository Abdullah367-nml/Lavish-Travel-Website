import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Small status and category pills. `accent` is reserved for genuine
 * signals (Featured, Best Value) — overusing the champagne colour is the
 * fastest way to make a luxury palette look cheap.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-caption font-medium uppercase tracking-[0.14em]",
  {
    variants: {
      variant: {
        default: "bg-surface-elevated text-muted-foreground",
        outline: "border border-border text-muted-foreground",
        accent: "bg-accent text-accent-foreground",
        subtle: "bg-accent/12 text-accent",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

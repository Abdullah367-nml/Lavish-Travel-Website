"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Radix accordion, used for the day-by-day itinerary and FAQ blocks.
 *
 * Radix handles the keyboard interaction and aria wiring, which is why we
 * use it rather than a <details> element: the itinerary needs single-open
 * behaviour and controlled default state.
 *
 * The trigger rotates a plus into a cross rather than animating height
 * with JavaScript — the open/close animation is CSS on the content, and
 * the global prefers-reduced-motion rule in globals.css disables it for
 * users who ask.
 */
const Accordion = AccordionPrimitive.Root;

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-border", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-start justify-between gap-4 py-5 text-left",
          "min-h-[44px] text-body-md font-medium text-foreground",
          "transition-colors hover:text-accent",
          className,
        )}
        {...props}
      >
        {children}
        <Plus
          aria-hidden
          className="mt-0.5 size-5 shrink-0 text-accent transition-transform duration-200 group-data-[state=open]:rotate-45"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pb-6 text-body-sm leading-relaxed text-muted-foreground", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

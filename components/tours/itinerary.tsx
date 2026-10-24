"use client";

import { Bed, Utensils } from "lucide-react";
import type { ItineraryDay } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Day-by-day itinerary.
 *
 * Day 1 is open by default so the panel is never a wall of closed rows, and
 * `type="multiple"` lets someone open several days to compare them — which
 * is what people actually do when deciding between itineraries.
 *
 * A single-day tour gets no accordion at all: collapsing one row is pure
 * friction.
 */
export function Itinerary({ days }: { days: ItineraryDay[] }) {
  if (days.length === 0) return null;

  if (days.length === 1) {
    const day = days[0];
    return (
      <div className="border-t border-border pt-6">
        <h3 className="font-display text-heading-sm uppercase tracking-wide text-foreground">
          {day.title}
        </h3>
        <p className="mt-3 text-body-sm leading-relaxed text-muted-foreground">
          {day.description}
        </p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" defaultValue={[days[0].id]} className="border-t border-border">
      {days.map((day) => (
        <AccordionItem key={day.id} value={day.id}>
          <AccordionTrigger>
            <span className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
              <span className="shrink-0 font-display text-caption uppercase tracking-[0.2em] text-accent">
                Day {day.dayNumber}
              </span>
              <span className="font-display text-heading-sm uppercase tracking-wide">
                {day.title}
              </span>
            </span>
          </AccordionTrigger>

          <AccordionContent>
            <p>{day.description}</p>

            {(day.overnightLocation || day.meals.length > 0) && (
              <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                {day.overnightLocation && (
                  <div className="flex items-center gap-2">
                    <Bed aria-hidden className="size-3.5 shrink-0 text-accent" />
                    <dt className="sr-only">Overnight</dt>
                    <dd className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                      {day.overnightLocation}
                    </dd>
                  </div>
                )}
                {day.meals.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Utensils aria-hidden className="size-3.5 shrink-0 text-accent" />
                    <dt className="sr-only">Meals included</dt>
                    <dd className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                      {day.meals.join(", ")}
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

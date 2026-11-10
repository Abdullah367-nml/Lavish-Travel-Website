"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import type { TourCategory } from "@/lib/types";
import { parseTourSearchParams } from "@/lib/tour-search";
import { TourFilters } from "@/components/tours/tour-filters";
import { Button } from "@/components/ui/button";

export type PreRenderedTourItem = {
  id: string;
  destinationSlug: string;
  category: TourCategory;
  durationDays: number;
  priceFromZar: number;
  groupMin: number;
  groupMax: number;
  card: ReactNode;
};

export function ToursCatalogue({
  items,
  destinations,
}: {
  items: PreRenderedTourItem[];
  destinations: { slug: string; name: string }[];
}) {
  const searchParams = useSearchParams();

  const filteredItems = useMemo(() => {
    const rawParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      rawParams[key] = value;
    });
    const filters = parseTourSearchParams(rawParams);

    return items
      .filter((t) =>
        filters.destination ? t.destinationSlug === filters.destination : true,
      )
      .filter((t) => (filters.category ? t.category === filters.category : true))
      .filter((t) =>
        filters.duration
          ? t.durationDays >= filters.duration.min &&
            t.durationDays <= filters.duration.max
          : true,
      )
      .filter((t) =>
        filters.maxPriceZar ? t.priceFromZar <= filters.maxPriceZar : true,
      )
      .filter((t) =>
        filters.groupSize
          ? t.groupMin <= filters.groupSize && t.groupMax >= filters.groupSize
          : true,
      );
  }, [searchParams, items]);

  return (
    <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:gap-12">
      <TourFilters
        destinations={destinations}
        resultCount={filteredItems.length}
      />

      <div className="min-w-0 flex-1">
        {filteredItems.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <li key={item.id}>{item.card}</li>
            ))}
          </ul>
        ) : (
          <div className="rim-top surface-metal relative rounded-md border border-border p-8 text-center sm:p-12">
            <SearchX aria-hidden className="mx-auto size-7 text-accent" />
            <h2 className="mt-5 font-display text-heading-md uppercase tracking-wide text-foreground">
              Nothing matches that combination
            </h2>
            <p className="mx-auto mt-3 max-w-md text-body-sm leading-relaxed text-muted-foreground">
              Try widening the budget or the duration. Or tell us what you
              had in mind and we will build it — most of what we run is
              tailored anyway.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/tours">Clear all filters</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/enquire">Request something custom</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

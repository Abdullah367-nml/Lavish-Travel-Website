import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { TourPackage } from "@/lib/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { TourCard } from "@/components/shared/tour-card";
import { Button } from "@/components/ui/button";

export function FeaturedTours({ tours }: { tours: TourPackage[] }) {
  if (tours.length === 0) return null;

  const displayedTours = tours.slice(0, 3);

  return (
    <section className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="FEATURED JOURNEYS"
          title="Where our guests go"
          lead="A cross-section of what we run most often, from a single day on the Cape Peninsula to a fortnight taking in Kruger and the falls."
          href="/tours"
          linkLabel="All tours"
        />

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedTours.map((tour) => (
            <li key={tour.id}>
              <TourCard tour={tour} showFeaturedBadge={false} />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <Button
            asChild
            size="lg"
            className="px-8 font-semibold shadow-md transition-transform hover:scale-105"
          >
            <Link href="/tours" className="inline-flex items-center gap-2">
              View More Tours
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

import type { TourPackage } from "@/lib/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { TourCard } from "@/components/shared/tour-card";

export function FeaturedTours({ tours }: { tours: TourPackage[] }) {
  if (tours.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="FEATURED JOURNEYS"
          title="Where our guests go"
          lead="A cross-section of what we run most often, from a single day on the Cape Peninsula to a fortnight taking in Kruger and the falls."
          href="/tours"
          linkLabel="All tours"
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tours.map((tour) => (
            <li key={tour.id}>
              <TourCard tour={tour} showFeaturedBadge={false} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

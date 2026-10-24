import type { Vehicle } from "@/lib/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { VehicleCard } from "@/components/shared/vehicle-card";

export function FleetPreview({ vehicles }: { vehicles: Vehicle[] }) {
  if (vehicles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading
        eyebrow="THE FLEET"
        title="Executive to expedition"
        lead="Every vehicle is serviced on schedule, comprehensively insured and tracked. Rates are shown with a driver and, where it applies, driving it yourself."
        href="/fleet"
        linkLabel="Full fleet"
      />

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <li key={vehicle.id}>
            <VehicleCard vehicle={vehicle} />
          </li>
        ))}
      </ul>
    </section>
  );
}

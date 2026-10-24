import type { Metadata } from "next";
import { getVehicles } from "@/lib/data";
import type { VehicleClass } from "@/lib/types";
import { formatVehicleClass } from "@/lib/format";
import { VehicleCard } from "@/components/shared/vehicle-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { FilterChips } from "@/components/shared/filter-chips";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/structured-data";

const CLASSES: VehicleClass[] = [
  "executive_sedan",
  "luxury_suv",
  "minibus",
  "coach",
  "4x4",
];

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const raw = typeof params.class === "string" ? params.class : undefined;
  const active = CLASSES.find((c) => c === raw);

  if (!active) {
    return {
      title: "Our Fleet",
      description:
        "Executive sedans, luxury SUVs, minibuses, coaches and safari 4x4s — seating, luggage capacity, features and rates for chauffeur-driven and self-drive hire.",
      alternates: { canonical: "/fleet" },
    };
  }

  return {
    title: `${formatVehicleClass(active)} Hire`,
    description: `${formatVehicleClass(active)} hire across South Africa, with chauffeur-driven and self-drive day rates shown side by side.`,
    alternates: { canonical: `/fleet?class=${active}` },
  };
}

export default async function FleetPage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = typeof params.class === "string" ? params.class : undefined;
  const active = CLASSES.find((c) => c === raw);

  const [vehicles, all] = await Promise.all([
    getVehicles(active ? { vehicleClass: active } : undefined),
    getVehicles(),
  ]);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Fleet", href: "/fleet" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={itemListJsonLd(
          vehicles.map((v) => ({
            name: v.name,
            url: `/car-hire/vehicle/${v.slug}`,
          })),
          "Lavish Travels & Tours fleet",
        )}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 max-w-3xl">
          <p className="text-caption font-medium tracking-[0.3em] text-accent">
            THE FLEET
          </p>
          <h1 className="text-lit mt-4 font-display text-display-sm uppercase text-foreground sm:text-display-md">
            Executive to expedition
          </h1>
          <p className="mt-5 text-body-md leading-relaxed text-muted-foreground">
            Every vehicle is serviced on schedule, comprehensively insured and
            tracked, and every driver holds a valid Professional Driving
            Permit. Rates below show the day rate with a driver alongside the
            self-drive rate, so the comparison is yours to make.
          </p>
        </div>

        <div className="mt-10">
          <FilterChips
            label="Filter fleet by vehicle class"
            basePath="/fleet"
            paramName="class"
            activeValue={active}
            options={CLASSES.map((c) => ({
              value: c,
              label: formatVehicleClass(c),
              count: all.filter((v) => v.class === c).length,
            }))}
          />
        </div>

        <p aria-live="polite" className="mt-6 text-caption text-muted-foreground">
          {vehicles.length} vehicle{vehicles.length === 1 ? "" : "s"}
        </p>

        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <li key={vehicle.id}>
              <VehicleCard vehicle={vehicle} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

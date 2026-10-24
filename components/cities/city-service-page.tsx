import Link from "next/link";
import { ArrowRight, Phone, PlaneLanding, MapPin } from "lucide-react";
import type { City } from "@/lib/data";
import type { TourPackage, TransferRoute, Vehicle } from "@/lib/types";
import { formatMinutes } from "@/lib/format";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VehicleCard } from "@/components/shared/vehicle-card";
import { TourCard } from "@/components/shared/tour-card";

/**
 * Shared layout for the city landing pages.
 *
 * The *layout* is shared; the *copy* never is. Every paragraph comes from
 * `lib/data/cities.ts`, where each city has separate chauffeur and car-hire
 * text written about that city specifically. Section 4 is explicit that
 * these must not be templated duplicate text — near-identical city pages
 * are the classic way a travel site gets its local landing pages ignored,
 * and it is also just unhelpful to the reader.
 */
export function CityServicePage({
  service,
  city,
  vehicles,
  routes,
  tours,
}: {
  service: "chauffeur" | "car-hire";
  city: City;
  vehicles: Vehicle[];
  routes: TransferRoute[];
  tours: TourPackage[];
}) {
  const isChauffeur = service === "chauffeur";
  const serviceLabel = isChauffeur ? "Chauffeur Hire" : "Car Hire";
  const intro = isChauffeur ? city.chauffeurIntro : city.carHireIntro;
  const body = isChauffeur ? city.chauffeurBody : city.carHireBody;

  const crumbs = [
    { label: "Home", href: "/" },
    { label: serviceLabel, href: `/${service}` },
    { label: city.name, href: `/${service}/${city.slug}` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs items={crumbs} />

      <div className="mt-8 max-w-3xl">
        <p className="flex items-center gap-2 text-caption font-medium tracking-[0.28em] text-accent">
          <MapPin aria-hidden className="size-3.5" />
          {city.province.toUpperCase()}
        </p>
        <h1 className="text-lit mt-4 font-display text-display-sm uppercase text-foreground sm:text-display-md">
          {isChauffeur ? "Chauffeur hire" : "Self-drive car hire"} in {city.name}
        </h1>
        <p className="mt-5 text-body-lg leading-relaxed text-foreground/85">
          {intro}
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href={`/enquire?service=${service}`}>
            Get a {city.name} quote
            <ArrowRight aria-hidden />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="tel:+27000000000">
            <Phone aria-hidden />
            Speak to a consultant
          </a>
        </Button>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
        <div className="min-w-0">
          <div className="flex max-w-2xl flex-col gap-6">
            {body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-body-md leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {vehicles.length > 0 && (
            <section className="mt-14" aria-labelledby="city-vehicles">
              <h2
                id="city-vehicles"
                className="font-display text-display-sm uppercase text-foreground"
              >
                Available in {city.name}
              </h2>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2">
                {vehicles.slice(0, 4).map((vehicle) => (
                  <li key={vehicle.id}>
                    <VehicleCard vehicle={vehicle} />
                  </li>
                ))}
              </ul>
              <Button asChild variant="link" className="mt-6 px-0">
                <Link href="/fleet">See the full fleet</Link>
              </Button>
            </section>
          )}

          {tours.length > 0 && (
            <section className="mt-16" aria-labelledby="city-tours">
              <h2
                id="city-tours"
                className="font-display text-display-sm uppercase text-foreground"
              >
                Worth doing from {city.name}
              </h2>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2">
                {tours.slice(0, 4).map((tour) => (
                  <li key={tour.id}>
                    <TourCard tour={tour} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="flex flex-col gap-10">
          <div>
            <h2 className="text-caption font-medium uppercase tracking-[0.18em] text-accent">
              Areas covered
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {city.areasCovered.map((area) => (
                <li key={area}>
                  <Badge variant="outline">{area}</Badge>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-caption leading-relaxed text-muted-foreground">
              All at the standard rate. Outside these areas we quote on
              distance rather than applying a surcharge.
            </p>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-caption font-medium uppercase tracking-[0.18em] text-accent">
              <PlaneLanding aria-hidden className="size-3.5" />
              Nearest airport
            </h2>
            <p className="mt-3 text-body-sm text-foreground">
              {city.airportName}
            </p>
            <p className="mt-1 text-caption uppercase tracking-[0.16em] text-muted-foreground">
              {city.airportCode}
            </p>
          </div>

          {routes.length > 0 && (
            <div>
              <h2 className="text-caption font-medium uppercase tracking-[0.18em] text-accent">
                Fixed-price transfers
              </h2>
              <ul className="mt-4 flex flex-col gap-2">
                {routes.map((route) => (
                  <li key={route.id}>
                    <Card interactive>
                      <Link
                        href={`/transfers/${route.slug}`}
                        className="group flex items-center justify-between gap-3 p-4 outline-none"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-body-sm text-foreground transition-colors group-hover:text-accent">
                            {route.destination}
                          </span>
                          <span className="mt-0.5 block text-caption uppercase tracking-[0.14em] text-muted-foreground">
                            {formatMinutes(route.durationMinutes)}
                          </span>
                        </span>
                        <span className="shrink-0 text-caption font-semibold uppercase tracking-wider text-accent">
                          View &rarr;
                        </span>
                      </Link>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-md border border-border bg-surface p-5">
            <h2 className="font-display text-heading-sm uppercase tracking-wide text-foreground">
              Other cities
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {["johannesburg", "cape-town", "durban", "pretoria"]
                .filter((s) => s !== city.slug)
                .map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/${service}/${slug}`}
                      className="text-body-sm capitalize text-muted-foreground transition-colors hover:text-accent"
                    >
                      {slug.replace("-", " ")}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

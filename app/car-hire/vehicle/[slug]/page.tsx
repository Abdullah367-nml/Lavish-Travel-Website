import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, Briefcase, MapPin, ArrowRight, Phone, Check } from "lucide-react";
import { getVehicleBySlug, getVehicles } from "@/lib/data";
import { formatVehicleClass } from "@/lib/format";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardMeta } from "@/components/ui/card";
import { BrandImage } from "@/components/shared/brand-image";
import { VehicleCard } from "@/components/shared/vehicle-card";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd, vehicleJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const vehicles = await getVehicles();
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return {};

  return {
    title: `${vehicle.name} Hire`,
    description: `Hire a ${vehicle.name} in South Africa — ${vehicle.seats} seats, ${vehicle.luggage} bags. Available with professional chauffeur or self-drive hire.`,
    alternates: { canonical: `/car-hire/vehicle/${slug}` },
  };
}

export default async function VehiclePage({ params }: Props) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const others = (await getVehicles()).filter((v) => v.slug !== slug).slice(0, 3);
  const selfDrive = vehicle.selfDriveRateZar > 0;

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Car Hire", href: "/car-hire" },
    { label: vehicle.name, href: `/car-hire/vehicle/${slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={vehicleJsonLd(vehicle)} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-border">
              <BrandImage
                src={vehicle.image}
                alt={vehicle.name}
                fill
                width={1000}
                height={625}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {vehicle.gallery.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {vehicle.gallery.slice(0, 3).map((src, i) => (
                  <div
                    key={src}
                    className="relative aspect-[4/3] overflow-hidden rounded-md border border-border"
                  >
                    <BrandImage
                      src={src}
                      alt={`${vehicle.name} — view ${i + 2}`}
                      fill
                      width={320}
                      height={240}
                      sizes="16vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Badge variant="subtle">{formatVehicleClass(vehicle.class)}</Badge>
            <h1 className="text-lit mt-4 font-display text-display-sm uppercase text-foreground sm:text-display-md">
              {vehicle.name}
            </h1>
            <p className="mt-2 text-body-sm uppercase tracking-[0.14em] text-muted-foreground">
              {vehicle.make} {vehicle.model}
            </p>

            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-border py-5">
              <div className="flex items-center gap-2">
                <Users aria-hidden className="size-4 text-accent" />
                <dt className="sr-only">Seats</dt>
                <dd className="text-body-sm text-foreground">
                  {vehicle.seats} seats
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase aria-hidden className="size-4 text-accent" />
                <dt className="sr-only">Luggage</dt>
                <dd className="text-body-sm text-foreground">
                  {vehicle.luggage} large bags
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <MapPin aria-hidden className="size-4 text-accent" />
                <dt className="sr-only">Service Area</dt>
                <dd className="text-body-sm text-foreground">
                  Nationwide Fleet
                </dd>
              </div>
            </dl>

            {/* Rate options */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card className="rim-top">
                <CardBody>
                  <CardMeta>With a driver</CardMeta>
                  <p className="mt-2 font-display text-heading-md uppercase text-accent">
                    Rate on Request
                  </p>
                  <p className="mt-1 text-caption text-muted-foreground">
                    per day, professional driver included
                  </p>
                </CardBody>
              </Card>
              <Card className="rim-top">
                <CardBody>
                  <CardMeta>Self-drive</CardMeta>
                  {selfDrive ? (
                    <>
                      <p className="mt-2 font-display text-heading-md uppercase text-accent">
                        Rate on Request
                      </p>
                      <p className="mt-1 text-caption text-muted-foreground">
                        per day, comprehensive insurance included
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-2 font-display text-heading-sm uppercase text-muted-foreground">
                        Driver only
                      </p>
                      <p className="mt-1 text-caption text-muted-foreground">
                        This vehicle is only supplied with a qualified driver.
                      </p>
                    </>
                  )}
                </CardBody>
              </Card>
            </div>

            <div className="mt-8">
              <h2 className="text-caption font-medium uppercase tracking-[0.18em] text-accent">
                On board
              </h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {vehicle.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                    <span className="text-body-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h2 className="text-caption font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Available in
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {vehicle.citiesAvailable.map((city) => (
                  <li key={city}>
                    <Badge variant="outline">{city}</Badge>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={`/enquire?service=car-hire&item=${vehicle.slug}`}>
                  Request a quote
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="tel:+27624015042">
                  <Phone aria-hidden />
                  Call us
                </a>
              </Button>
            </div>
          </div>
        </div>

        {others.length > 0 && (
          <section className="mt-20 border-t border-border pt-14" aria-labelledby="other-vehicles">
            <h2
              id="other-vehicles"
              className="font-display text-display-sm uppercase text-foreground"
            >
              Other vehicles
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((v) => (
                <li key={v.id}>
                  <VehicleCard vehicle={v} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}

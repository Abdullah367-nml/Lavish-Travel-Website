import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Route as RouteIcon, PlaneLanding } from "lucide-react";
import { getTransferRoutes } from "@/lib/data";
import { formatMinutes } from "@/lib/format";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/structured-data";
import { BrandImage } from "@/components/shared/brand-image";
import { getWhatsAppBookingUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Airport Transfers — OR Tambo, Cape Town & King Shaka",
  description:
    "Private airport transfers from OR Tambo, Cape Town International and King Shaka. Flight tracking included, no waiting-time surcharge. Enquire on WhatsApp for your quote.",
  alternates: { canonical: "/transfers" },
};

/** Airport groupings, so the list reads the way people actually search. */
const GROUPS: { code: string | null; name: string; blurb: string }[] = [
  {
    code: "JNB",
    name: "OR Tambo International",
    blurb:
      "Johannesburg and Pretoria. Allow closer to an hour in either peak — the M1 northbound backs up hard between 06:30 and 08:30.",
  },
  {
    code: "CPT",
    name: "Cape Town International",
    blurb:
      "The City Bowl, Atlantic Seaboard and Winelands. Short and predictable outside the afternoon peak on the N2.",
  },
  {
    code: "DUR",
    name: "King Shaka International",
    blurb:
      "Umhlanga and Durban. King Shaka sits well north of the city, so Umhlanga is the shorter run.",
  },
  {
    code: null,
    name: "City to city",
    blurb:
      "Point-to-point corporate transfers. For more than two stops in a day, an hourly chauffeur booking usually costs less.",
  },
];

export default async function TransfersPage() {
  const routes = await getTransferRoutes();

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Transfers", href: "/transfers" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={itemListJsonLd(
          routes.map((r) => ({
            name: `${r.origin} to ${r.destination}`,
            url: `/transfers/${r.slug}`,
          })),
          "Airport transfer routes",
        )}
      />

      {/* Hero banner — luxury transfer at night */}
      <div className="relative h-64 w-full overflow-hidden sm:h-80">
        <BrandImage
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1400&auto=format&fit=crop"
          alt="Luxury private transfer vehicle at night"
          fill
          width={1400}
          height={500}
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <p className="text-caption font-medium tracking-[0.3em] text-amber-400">
            PRIVATE TRANSFERS
          </p>
          <h1 className="mt-3 font-display text-display-sm uppercase text-white sm:text-display-md">
            Door to Door, On Time
          </h1>
          <p className="mt-3 max-w-xl text-body-sm text-white/80">
            Flight-tracked arrivals · Meet &amp; greet · No waiting-time surcharges
          </p>
          <Link
            href="/enquire?service=transfers"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-black shadow-lg transition-transform hover:scale-105"
          >
            Request a Transfer Quote
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 max-w-3xl">
          <p className="text-caption font-medium tracking-[0.3em] text-accent">
            AIRPORT TRANSFERS
          </p>
          <h2 className="text-lit mt-4 font-display text-display-sm uppercase text-foreground sm:text-display-md">
            Select Your Route
          </h2>
          <p className="mt-5 text-body-md leading-relaxed text-muted-foreground">
            Choose your route below and enquire via WhatsApp for a personalised
            quote. We track your flight, so a delayed landing costs nothing
            extra, and there is no waiting-time surcharge or peak-hour
            multiplier.
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-14">
          {GROUPS.map((group) => {
            const groupRoutes = routes.filter((r) => r.airportCode === group.code);
            if (groupRoutes.length === 0) return null;

            return (
              <section key={group.name} aria-labelledby={`group-${group.code ?? "city"}`}>
                <div className="flex items-start gap-3">
                  {group.code ? (
                    <PlaneLanding aria-hidden className="mt-1 size-5 shrink-0 text-accent" />
                  ) : (
                    <RouteIcon aria-hidden className="mt-1 size-5 shrink-0 text-accent" />
                  )}
                  <div>
                    <h2
                      id={`group-${group.code ?? "city"}`}
                      className="font-display text-heading-lg uppercase tracking-wide text-foreground"
                    >
                      {group.name}
                      {group.code && (
                        <span className="ml-3 text-caption tracking-[0.2em] text-muted-foreground">
                          {group.code}
                        </span>
                      )}
                    </h2>
                    <p className="mt-2 max-w-2xl text-body-sm leading-relaxed text-muted-foreground">
                      {group.blurb}
                    </p>
                  </div>
                </div>

                <ul className="mt-6 flex flex-col gap-3">
                  {groupRoutes.map((route) => (
                    <li key={route.id}>
                      <Card interactive>
                        <Link
                          href={`/transfers/${route.slug}`}
                          className="group flex flex-col gap-4 p-5 outline-none sm:flex-row sm:items-center sm:justify-between sm:p-6"
                        >
                          <div className="min-w-0">
                            <p className="font-display text-heading-sm uppercase tracking-wide text-foreground transition-colors group-hover:text-accent">
                              {route.destination}
                            </p>
                            <dl className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1">
                              <div className="flex items-center gap-1.5">
                                <Clock aria-hidden className="size-3.5 text-accent" />
                                <dt className="sr-only">Duration</dt>
                                <dd className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                                  {formatMinutes(route.durationMinutes)}
                                </dd>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <RouteIcon aria-hidden className="size-3.5 text-accent" />
                                <dt className="sr-only">Distance</dt>
                                <dd className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                                  {route.distanceKm} km
                                </dd>
                              </div>
                            </dl>
                          </div>

                          <div className="flex items-center gap-2 text-accent">
                            <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                              View Route
                            </span>
                            <ArrowRight
                              aria-hidden
                              className="size-4 shrink-0 transition-transform group-hover:translate-x-1"
                            />
                          </div>
                        </Link>
                      </Card>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}

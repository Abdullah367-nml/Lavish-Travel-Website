import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Route as RouteIcon,
  PlaneLanding,
  ArrowRight,
  Phone,
  Check,
} from "lucide-react";
import {
  getTransferRoutes,
  getTransferRouteBySlug,
  getVehiclesBySlugs,
} from "@/lib/data";
import { formatMinutes, formatVehicleClass } from "@/lib/format";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardMeta } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd, faqJsonLd, transferJsonLd } from "@/lib/structured-data";
import { FaqList } from "@/components/shared/faq-list";

type Props = { params: Promise<{ route: string }> };

export async function generateStaticParams() {
  const routes = await getTransferRoutes();
  return routes.map((r) => ({ route: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { route: slug } = await params;
  const route = await getTransferRouteBySlug(slug);
  if (!route) return {};

  const title = `${route.origin} to ${route.destination} Transfer`;
  return {
    title,
    description: `Private transfer from ${route.origin} to ${route.destination}. ${formatMinutes(route.durationMinutes)}, ${route.distanceKm} km. Executive sedan or van, flight tracking, no waiting-time surcharge.`,
    alternates: { canonical: `/transfers/${slug}` },
    openGraph: { title, type: "website" },
  };
}

/**
 * Transfer route page — programmatically generated from `transfer_routes`.
 *
 * These are the highest-intent pages on the site: someone searching
 * "OR Tambo to Sandton transfer" is ready to book. So the price is the first
 * thing on the page, not the last, and it is a real number rather than a
 * "request a quote" placeholder. That single decision is the main way this
 * site beats competitors who hide pricing behind a form.
 */
export default async function TransferRoutePage({ params }: Props) {
  const { route: slug } = await params;
  const route = await getTransferRouteBySlug(slug);
  if (!route) notFound();

  const [vehicles, allRoutes] = await Promise.all([
    getVehiclesBySlugs(route.vehicleSlugs),
    getTransferRoutes(),
  ]);

  const sameAirport = allRoutes
    .filter((r) => r.airportCode === route.airportCode && r.slug !== route.slug)
    .slice(0, 4);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Transfers", href: "/transfers" },
    { label: route.destination, href: `/transfers/${slug}` },
  ];

  const faqs = [
    {
      question: "How do your transfer rates work?",
      answer:
        "All transfer quotes are fully inclusive with VAT, parking, and highway tolls included. Our rates are fixed per vehicle rather than per passenger, with no peak-hour multipliers or waiting-time surcharges.",
    },
    {
      question: "What happens if my flight is delayed?",
      answer:
        "We track the flight number you give us and adjust the pickup automatically. There is no waiting-time surcharge, so a two-hour delay costs you nothing extra.",
    },
    {
      question: "Where will I meet my driver?",
      answer:
        "In the arrivals hall, holding a name board, after you clear customs. You will have the driver's name and mobile number by SMS and WhatsApp the day before.",
    },
    {
      question: "Can you take more passengers or extra luggage?",
      answer: `Yes — the vehicle options on this page carry up to ${Math.max(
        ...vehicles.map((v) => v.seats),
        3,
      )} passengers. Tell us your group size and bag count when you book and we will put you in the right vehicle rather than the cheapest one.`,
    },
    {
      question: "Do you fit child seats?",
      answer:
        "Yes, at no charge, but we need to know the child's age in advance so the correct seat is fitted before your driver leaves for the airport.",
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={transferJsonLd(route)} />
      <JsonLd data={faqJsonLd(faqs)} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
          <div className="min-w-0">
            {route.airportCode && (
              <Badge variant="subtle">
                <PlaneLanding aria-hidden className="size-3" />
                {route.airportCode}
              </Badge>
            )}

            <h1 className="text-lit mt-4 font-display text-display-sm uppercase text-foreground sm:text-display-md">
              {route.origin}
              <span className="mt-1 block text-accent">
                to {route.destination}
              </span>
            </h1>

            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-border py-5">
              <div className="flex items-center gap-2">
                <Clock aria-hidden className="size-4 text-accent" />
                <dt className="sr-only">Journey time</dt>
                <dd className="text-body-sm text-foreground">
                  {formatMinutes(route.durationMinutes)}
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <RouteIcon aria-hidden className="size-4 text-accent" />
                <dt className="sr-only">Distance</dt>
                <dd className="text-body-sm text-foreground">
                  {route.distanceKm} km
                </dd>
              </div>
            </dl>

            <p className="mt-8 max-w-2xl text-body-md leading-relaxed text-muted-foreground">
              {route.notes}
            </p>

            <section className="mt-12" aria-labelledby="included">
              <h2
                id="included"
                className="font-display text-heading-lg uppercase tracking-wide text-foreground"
              >
                Included in the price
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "Flight tracking, so delays cost nothing",
                  "Meet and greet in arrivals with a name board",
                  "60 minutes free waiting on international arrivals",
                  "Child seats fitted on request, at no charge",
                  "Bottled water and on-board Wi-Fi",
                  "All tolls, parking and VAT",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                    <span className="text-body-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {vehicles.length > 0 && (
              <section className="mt-12" aria-labelledby="vehicle-options">
                <h2
                  id="vehicle-options"
                  className="font-display text-heading-lg uppercase tracking-wide text-foreground"
                >
                  Vehicle options
                </h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {vehicles.map((vehicle) => (
                    <li key={vehicle.id}>
                      <Card interactive>
                        <Link
                          href={`/car-hire/vehicle/${vehicle.slug}`}
                          className="group flex items-center justify-between gap-4 p-5 outline-none"
                        >
                          <div className="min-w-0">
                            <p className="font-display text-heading-sm uppercase tracking-wide text-foreground transition-colors group-hover:text-accent">
                              {vehicle.name}
                            </p>
                            <p className="mt-1.5 text-caption uppercase tracking-[0.14em] text-muted-foreground">
                              {formatVehicleClass(vehicle.class)} &middot;{" "}
                              {vehicle.seats} seats &middot; {vehicle.luggage} bags
                            </p>
                          </div>
                          <ArrowRight
                            aria-hidden
                            className="size-5 shrink-0 text-accent transition-transform group-hover:translate-x-1"
                          />
                        </Link>
                      </Card>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-caption leading-relaxed text-muted-foreground">
                  The headline price covers the executive sedan. Larger
                  vehicles carry a supplement, quoted before you confirm.
                </p>
              </section>
            )}

            <section className="mt-12" aria-labelledby="transfer-faq">
              <h2
                id="transfer-faq"
                className="font-display text-heading-lg uppercase tracking-wide text-foreground"
              >
                Questions
              </h2>
              <div className="mt-5">
                <FaqList faqs={faqs} />
              </div>
            </section>
          </div>

          {/* Price rail — the price leads, because these visitors are ready. */}
          <aside>
            <div className="lg:sticky lg:top-24">
              <Card className="rim-top">
                <CardBody className="flex flex-col gap-5">
                  <div>
                    <CardMeta>Transfer Fare</CardMeta>
                    <p className="mt-1 font-display text-display-sm uppercase text-accent">
                      Rate on Request
                    </p>
                    <p className="mt-1 text-caption text-muted-foreground">
                      Executive sedan or luxury van rate tailored to your arrival schedule
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-border pt-5">
                    <Button asChild size="lg">
                      <Link href={`/enquire?service=transfers&item=${route.slug}`}>
                        Book this transfer
                        <ArrowRight aria-hidden />
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <a href="tel:+27000000000">
                        <Phone aria-hidden />
                        Call to book
                      </a>
                    </Button>
                  </div>

                  <p className="text-caption leading-relaxed text-muted-foreground">
                    No card details are taken online for transfers. You confirm
                    by email or WhatsApp and settle by EFT or with the driver.
                  </p>
                </CardBody>
              </Card>
            </div>
          </aside>
        </div>

        {sameAirport.length > 0 && (
          <section className="mt-20 border-t border-border pt-14" aria-labelledby="other-routes">
            <h2
              id="other-routes"
              className="font-display text-display-sm uppercase text-foreground"
            >
              Other routes from {route.origin}
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {sameAirport.map((r) => (
                <li key={r.id}>
                  <Card interactive>
                    <Link
                      href={`/transfers/${r.slug}`}
                      className="group flex items-center justify-between gap-4 p-5 outline-none"
                    >
                      <div>
                        <p className="font-display text-heading-sm uppercase tracking-wide text-foreground transition-colors group-hover:text-accent">
                          {r.destination}
                        </p>
                        <p className="mt-1.5 text-caption uppercase tracking-[0.14em] text-muted-foreground">
                          {formatMinutes(r.durationMinutes)} &middot; {r.distanceKm} km
                        </p>
                      </div>
                      <p className="font-display text-xs font-semibold uppercase tracking-wider text-accent">
                        View Route &rarr;
                      </p>
                    </Link>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}

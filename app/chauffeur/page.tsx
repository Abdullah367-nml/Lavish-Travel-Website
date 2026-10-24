import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { getCities, getVehicles } from "@/lib/data";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { VehicleCard } from "@/components/shared/vehicle-card";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data";
import { FaqList } from "@/components/shared/faq-list";

export const metadata: Metadata = {
  title: "Luxury Chauffeur & Executive Car Hire",
  description:
    "Chauffeur-driven executive sedans and luxury people carriers across Johannesburg, Sandton, Cape Town, Durban and Pretoria. Hourly, daily and multi-day hire.",
  alternates: { canonical: "/chauffeur" },
};

const FAQS = [
  {
    question: "Is it cheaper to book hourly or as separate transfers?",
    answer:
      "If your day involves more than two stops, an hourly booking with the driver waiting is almost always cheaper than separate point-to-point transfers — and considerably less stressful, because your luggage stays in the car.",
  },
  {
    question: "What qualifications do your drivers hold?",
    answer:
      "Every driver holds a valid Professional Driving Permit, is background checked, and carries passenger liability cover. Drivers working on diplomatic or corporate accounts are briefed on discretion.",
  },
  {
    question: "Can the driver act as a guide?",
    answer:
      "In Cape Town and Johannesburg, yes — many of our drivers are registered guides, and on tour work that is who we assign. Say so when you book; a driver-guide and a driver are not the same booking.",
  },
  {
    question: "What is the minimum booking?",
    answer:
      "Four hours for hourly chauffeur work in the major cities. Airport transfers have no minimum and are charged at the fixed route price instead.",
  },
];

export default async function ChauffeurPage() {
  const [cities, vehicles] = await Promise.all([getCities(), getVehicles()]);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Chauffeur Hire", href: "/chauffeur" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(FAQS)} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 max-w-3xl">
          <p className="text-caption font-medium tracking-[0.3em] text-accent">
            CHAUFFEUR SERVICE
          </p>
          <h1 className="text-lit mt-4 font-display text-display-sm uppercase text-foreground sm:text-display-md">
            Chauffeur hire
          </h1>
          <p className="mt-5 text-body-md leading-relaxed text-muted-foreground">
            Executive sedans and luxury people carriers with professional,
            vetted drivers — by the hour, the day or the week. Corporate
            roadshows, client hosting, weddings and events, in every major
            South African city.
          </p>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Vetted drivers with Professional Driving Permits",
            "Vehicles tracked, serviced and fully insured",
            "Waiting time included in hourly bookings",
            "One point of contact for multi-vehicle days",
          ].map((item) => (
            <li key={item} className="flex gap-2.5">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
              <span className="text-body-sm leading-relaxed text-muted-foreground">
                {item}
              </span>
            </li>
          ))}
        </ul>

        {/* City pages — each with its own copy, not a template. */}
        <section className="mt-16" aria-labelledby="cities">
          <h2
            id="cities"
            className="font-display text-display-sm uppercase text-foreground"
          >
            Where we operate
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((city) => (
              <li key={city.slug}>
                <Card interactive className="h-full">
                  <Link
                    href={`/chauffeur/${city.slug}`}
                    className="group block h-full outline-none"
                  >
                    <CardBody className="flex h-full flex-col">
                      <h3 className="flex items-start justify-between gap-3 font-display text-heading-md uppercase tracking-wide text-foreground transition-colors group-hover:text-accent">
                        {city.name}
                        <ArrowUpRight
                          aria-hidden
                          className="mt-1 size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                        />
                      </h3>
                      <p className="mt-1 text-caption uppercase tracking-[0.14em] text-muted-foreground">
                        {city.province}
                      </p>
                      <p className="mt-4 flex-1 text-body-sm leading-relaxed text-muted-foreground">
                        {city.chauffeurIntro.split(". ")[0]}.
                      </p>
                    </CardBody>
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="chauffeur-fleet">
          <h2
            id="chauffeur-fleet"
            className="font-display text-display-sm uppercase text-foreground"
          >
            Chauffeur fleet
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.slice(0, 3).map((vehicle) => (
              <li key={vehicle.id}>
                <VehicleCard vehicle={vehicle} />
              </li>
            ))}
          </ul>
          <Button asChild variant="link" className="mt-6 px-0">
            <Link href="/fleet">See the full fleet</Link>
          </Button>
        </section>

        <section className="mt-16" aria-labelledby="chauffeur-faq">
          <h2
            id="chauffeur-faq"
            className="font-display text-display-sm uppercase text-foreground"
          >
            Questions
          </h2>
          <div className="mt-6 max-w-3xl">
            <FaqList faqs={FAQS} />
          </div>
        </section>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-10 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/enquire?service=chauffeur">Get a quote</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="tel:+27624015042">Call us</a>
          </Button>
        </div>
      </div>
    </>
  );
}

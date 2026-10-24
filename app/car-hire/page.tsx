import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { getCities, getSelfDriveVehicles } from "@/lib/data";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { VehicleCard } from "@/components/shared/vehicle-card";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data";
import { FaqList } from "@/components/shared/faq-list";

export const metadata: Metadata = {
  title: "Self-Drive Luxury Car Hire",
  description:
    "Self-drive luxury car and 4x4 rental across South Africa. Premium sedans, SUVs and safari-ready 4x4s with comprehensive insurance and unlimited-kilometre options.",
  alternates: { canonical: "/car-hire" },
};

const FAQS = [
  {
    question: "What licence do I need?",
    answer:
      "A valid licence in English with a photograph is accepted directly. If your licence is not in English you need an International Driving Permit alongside it. Drivers must be 23 or older with two years' experience for the premium categories.",
  },
  {
    question: "Which side of the road?",
    answer:
      "South Africa drives on the left, with the driver on the right of the car. If you are used to driving on the right, allow yourself a quiet suburb or two before joining a motorway.",
  },
  {
    question: "Do I need a 4x4?",
    answer:
      "For Cape Town, the Winelands and the Garden Route, no — a sedan is entirely sufficient and more comfortable. For Kruger approach roads, Limpopo lodges or the Northern Drakensberg trailheads, the ground clearance genuinely earns its keep.",
  },
  {
    question: "Is the insurance comprehensive?",
    answer:
      "Yes, with a standard excess that can be bought down to zero. Tyres, glass and undercarriage are excluded on the base cover — worth adding if any of your route is gravel.",
  },
  {
    question: "Can I drive across a border?",
    answer:
      "Into Namibia, Botswana, Zimbabwe, Lesotho, Eswatini and Mozambique, yes, but you need a cross-border letter of authority arranged in advance and there are additional fees. Tell us at booking, not at the border.",
  },
];

export default async function CarHirePage() {
  const [cities, vehicles] = await Promise.all([
    getCities(),
    getSelfDriveVehicles(),
  ]);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Car Hire", href: "/car-hire" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(FAQS)} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 max-w-3xl">
          <p className="text-caption font-medium tracking-[0.3em] text-accent">
            SELF-DRIVE HIRE
          </p>
          <h1 className="text-lit mt-4 font-display text-display-sm uppercase text-foreground sm:text-display-md">
            Self-drive car hire
          </h1>
          <p className="mt-5 text-body-md leading-relaxed text-muted-foreground">
            Premium sedans, luxury SUVs and safari-ready 4x4s for travellers
            who would rather drive themselves. Delivered to the airport or your
            hotel, with the paperwork done before you arrive.
          </p>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Comprehensive insurance, excess buy-down available",
            "Unlimited-kilometre options on longer hires",
            "Delivery and collection in different cities",
            "Cross-border letters arranged in advance",
          ].map((item) => (
            <li key={item} className="flex gap-2.5">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
              <span className="text-body-sm leading-relaxed text-muted-foreground">
                {item}
              </span>
            </li>
          ))}
        </ul>

        <section className="mt-16" aria-labelledby="self-drive-fleet">
          <h2
            id="self-drive-fleet"
            className="font-display text-display-sm uppercase text-foreground"
          >
            Available for self-drive
          </h2>
          <p className="mt-3 max-w-2xl text-body-sm text-muted-foreground">
            Not every vehicle in our fleet can be self-driven — open safari
            vehicles and coaches are supplied with a qualified driver only.
            These are the ones you can take the keys to.
          </p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <li key={vehicle.id}>
                <VehicleCard vehicle={vehicle} />
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="car-hire-cities">
          <h2
            id="car-hire-cities"
            className="font-display text-display-sm uppercase text-foreground"
          >
            Collection points
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((city) => (
              <li key={city.slug}>
                <Card interactive className="h-full">
                  <Link
                    href={`/car-hire/${city.slug}`}
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
                        {city.airportCode}
                      </p>
                      <p className="mt-4 flex-1 text-body-sm leading-relaxed text-muted-foreground">
                        {city.carHireIntro.split(". ")[0]}.
                      </p>
                    </CardBody>
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16" aria-labelledby="car-hire-faq">
          <h2
            id="car-hire-faq"
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
            <Link href="/enquire?service=car-hire">Get a quote</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="tel:+27624015042">Call us</a>
          </Button>
        </div>
      </div>
    </>
  );
}

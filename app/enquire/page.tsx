import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, ShieldCheck, MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { EnquiryForm } from "@/components/enquire/enquiry-form";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Tell us what you need and a travel consultant will come back with a tailored quote, usually within one working day. Airport transfers, chauffeur hire, car rental, tours and safaris.",
  alternates: { canonical: "/enquire" },
  // Nothing to index in a form, and a partially-filled URL should never
  // surface in search results.
  robots: { index: true, follow: true },
};

const REASSURANCE = [
  {
    icon: Clock,
    title: "One working day",
    body: "A consultant reads every enquiry and replies with a written quote and a suggested itinerary.",
  },
  {
    icon: ShieldCheck,
    title: "No payment now",
    body: "Nothing is charged at enquiry stage, and no card details are collected on this form.",
  },
  {
    icon: MessageCircle,
    title: "Reply how you like",
    body: "Tell us whether email or WhatsApp suits you better and we will use that.",
  },
];

export default function EnquirePage() {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Request a Quote", href: "/enquire" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 max-w-2xl">
          <p className="text-caption font-medium tracking-[0.3em] text-accent">
            GET A QUOTE
          </p>
          <h1 className="text-lit mt-4 font-display text-display-sm uppercase text-foreground sm:text-display-md">
            Tell us roughly what you want
          </h1>
          <p className="mt-5 text-body-md leading-relaxed text-muted-foreground">
            You do not need dates fixed or a route decided. Four short steps,
            and your answers are kept as you go so nothing is lost if you get
            interrupted.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_280px] lg:gap-16">
          <div className="min-w-0">
            {/* useSearchParams (for ?service= and ?item= deep links) needs a
                Suspense boundary in a statically-rendered tree. */}
            <Suspense
              fallback={
                <p className="text-body-sm text-muted-foreground">
                  Loading the form…
                </p>
              }
            >
              <EnquiryForm />
            </Suspense>
          </div>

          <aside className="lg:pt-2">
            <ul className="flex flex-col gap-8">
              {REASSURANCE.map((item) => (
                <li key={item.title} className="flex flex-col gap-2.5">
                  <item.icon aria-hidden className="size-5 text-accent" />
                  <h2 className="font-display text-heading-sm uppercase tracking-wide text-foreground">
                    {item.title}
                  </h2>
                  <p className="text-body-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
}

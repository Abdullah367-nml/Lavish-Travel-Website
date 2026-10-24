import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, ChevronDown, ArrowRight, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Lavish Travels & Tours",
  description:
    "Everything you need to know about airport transfers, safari booking, payment methods, luggage, child seats and cancellation across South Africa.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    category: "Transfers & Airport Pickups",
    questions: [
      {
        q: "What happens if my flight is delayed?",
        a: "We track every flight live using radar data. If your flight is delayed by an hour or six hours, your chauffeur will adjust their arrival time automatically. There is zero waiting-time fee or late penalty for flight delays.",
      },
      {
        q: "Where do I meet my driver at the airport?",
        a: "Your chauffeur will wait inside the arrivals hall immediately after baggage reclaim, holding a prominent personalized name board. You will also receive their direct cell number via WhatsApp 2 hours prior to landing.",
      },
      {
        q: "Are airport transfer prices fixed?",
        a: "Yes. All transfer pricing published on our website is 100% fixed. It includes airport parking fees, fuel, toll gates, and luggage handling. No hidden surprises.",
      },
    ],
  },
  {
    category: "Safaris & Tour Packages",
    questions: [
      {
        q: "Which season is best for a Kruger National Park safari?",
        a: "The dry winter season from May to September offers optimal Big Five sightings because the vegetation is thin and animals congregate around permanent water sources. Summer (November to March) is lush, green, and ideal for birdwatching and newborn animals.",
      },
      {
        q: "Do I need malaria medication for Kruger or Victoria Falls?",
        a: "Kruger National Park and Victoria Falls lie in low-to-moderate risk malaria areas, especially in warm summer months. We advise consulting your travel doctor prior to arrival regarding preventative medication.",
      },
      {
        q: "Are the tours private or shared?",
        a: "All day tours and private chauffeured packages are exclusively private for your group. For multi-day Kruger safaris, game drives operate in small intimate open 4x4 vehicles with a dedicated ranger.",
      },
    ],
  },
  {
    category: "Bookings, Payments & Cancellations",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Visa, Mastercard, American Express, and secure electronic bank transfers (EFT). Invoices can be settled in South African Rand (ZAR) or major foreign currencies.",
      },
      {
        q: "What is your cancellation policy?",
        a: "Day tours and airport transfers can be cancelled or rescheduled free of charge up to 24 hours prior to pickup. For multi-day packages and luxury safari lodge bookings, full terms are detailed in your confirmation itinerary.",
      },
      {
        q: "Can you provide baby / child booster seats?",
        a: "Yes, complimentary child safety and booster seats are available upon request for all vehicles in our fleet. Simply specify your child's age when booking.",
      },
    ],
  },
];

export default function FaqPage() {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "FAQs", href: "/faq" },
  ];

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 text-center sm:text-left">
          <p className="text-caption font-medium tracking-[0.3em] text-accent">
            FREQUENTLY ASKED QUESTIONS
          </p>
          <h1 className="text-lit mt-3 font-display text-display-sm uppercase tracking-tight text-foreground sm:text-display-md">
            Everything You Need To Know
          </h1>
          <p className="mt-4 max-w-2xl text-body-md leading-relaxed text-muted-foreground">
            Clear, transparent answers about our luxury transfers, safari planning,
            payment security, and operational standards.
          </p>
        </div>

        {/* FAQs by Category */}
        <div className="mt-14 space-y-12">
          {FAQS.map((section) => (
            <div key={section.category} className="space-y-6">
              <h2 className="font-display text-heading-lg uppercase tracking-wide text-accent border-b border-border pb-3">
                {section.category}
              </h2>

              <div className="space-y-4">
                {section.questions.map((faq) => (
                  <div
                    key={faq.q}
                    className="rounded-xl border border-border bg-surface p-6 transition-all hover:border-accent/40"
                  >
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {faq.q}
                    </h3>
                    <p className="mt-3 text-body-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions banner */}
        <div className="mt-16 rounded-2xl border border-border bg-gradient-to-r from-surface to-surface-elevated p-8 text-center sm:p-12">
          <HelpCircle className="mx-auto size-10 text-accent" />
          <h3 className="mt-4 font-display text-heading-md uppercase text-foreground">
            Still Have a Question?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-body-sm text-muted-foreground">
            Our concierge team is available 24/7 to answer custom routing queries,
            group arrangements, or special travel requirements.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">
                Contact Our Team
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="tel:+27000000000">
                <Phone className="mr-2 size-4 text-accent" />
                Call +27 (0) 00 000 0000
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

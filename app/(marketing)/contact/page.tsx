import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact Lavish Travels & Tours — 24/7 Concierge & Operations",
  description:
    "Get in touch with Lavish Travels & Tours: phone, WhatsApp, and email. 24/7 dedicated dispatch for international visitors across South Africa.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Scenic Header */}
      <section className="relative isolate flex min-h-[380px] items-end overflow-hidden border-b border-border sm:min-h-[460px]">
        <Image
          src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&auto=format&fit=crop&q=85"
          alt="Cape Town coastal sunset"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[center_40%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-black/70 to-black/45"
        />

        <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-28 sm:px-6 lg:px-8">
          <Breadcrumbs items={crumbs} />
          <p className="mt-6 text-caption font-medium tracking-[0.3em] text-accent">
            24/7 CLIENT SUPPORT
          </p>
          <h1 className="text-lit mt-3 font-display text-display-sm uppercase tracking-tight text-foreground sm:text-display-md">
            We Are Here For You
          </h1>
          <p className="mt-4 max-w-xl text-body-md leading-relaxed text-foreground/80 sm:text-body-lg">
            Have a question, need an urgent airport transfer, or planning a multi-day
            safari? Our operations team is available around the clock.
          </p>
        </div>
      </section>

      {/* Contact Cards & Form Bridge */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Card 1: WhatsApp */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-8 transition-all hover:border-accent/60 hover:shadow-[0_0_30px_rgba(255,149,0,0.2)]">
            <div>
              <div className="flex size-12 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
                <MessageCircle className="size-6" />
              </div>
              <h2 className="mt-6 font-display text-heading-md uppercase text-foreground">
                WhatsApp Dispatch
              </h2>
              <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">
                Instant messaging for fast quotes, driver tracking, and quick itinerary questions.
              </p>
            </div>
            <div className="mt-8">
              <Button asChild className="w-full">
                <a
                  href="https://wa.me/27000000000?text=Hi%20Lavish%20Travels,%20I%20would%20like%20to%20enquire%20about%20a%20trip"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 size-4" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Card 2: 24/7 Operations Line */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-8 transition-all hover:border-accent/60 hover:shadow-[0_0_30px_rgba(255,149,0,0.2)]">
            <div>
              <div className="flex size-12 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
                <Phone className="size-6" />
              </div>
              <h2 className="mt-6 font-display text-heading-md uppercase text-foreground">
                24/7 Phone Support
              </h2>
              <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">
                A staffed operations line, not an automated machine. Call anytime day or night.
              </p>
            </div>
            <div className="mt-8">
              <Button asChild variant="outline" className="w-full border-accent/40 hover:bg-accent/10">
                <a href="tel:+27000000000">
                  <Phone className="mr-2 size-4 text-accent" />
                  +27 (0) 00 000 0000
                </a>
              </Button>
            </div>
          </div>

          {/* Card 3: Email Concierge */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-8 transition-all hover:border-accent/60 hover:shadow-[0_0_30px_rgba(255,149,0,0.2)]">
            <div>
              <div className="flex size-12 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
                <Mail className="size-6" />
              </div>
              <h2 className="mt-6 font-display text-heading-md uppercase text-foreground">
                Email Concierge
              </h2>
              <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">
                Detailed proposals, corporate contracts, and bespoke private itineraries.
              </p>
            </div>
            <div className="mt-8">
              <Button asChild variant="outline" className="w-full border-border hover:bg-white/5">
                <a href="mailto:info@lavishtravels.co.za">
                  <Mail className="mr-2 size-4 text-accent" />
                  info@lavishtravels.co.za
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Hub Locations & Custom Trip Quote banner */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-elevated p-8 sm:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-caption font-medium tracking-[0.3em] text-accent">
                OPERATING HUBS
              </p>
              <h2 className="mt-3 font-display text-display-sm uppercase tracking-tight text-foreground">
                Across South Africa
              </h2>
              <p className="mt-4 text-body-md leading-relaxed text-muted-foreground">
                We maintain active driver teams and luxury fleet depots in Cape Town,
                Johannesburg (O.R. Tambo &amp; Sandton), Durban, and Kruger Mpumalanga.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 size-5 shrink-0 text-accent" />
                  <div>
                    <p className="font-medium text-foreground">Cape Town Operations Depot</p>
                    <p className="text-sm text-muted-foreground">V&amp;A Waterfront &amp; Cape Town International (CPT)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 size-5 shrink-0 text-accent" />
                  <div>
                    <p className="font-medium text-foreground">Johannesburg &amp; Kruger Depot</p>
                    <p className="text-sm text-muted-foreground">Sandton City &amp; O.R. Tambo International (JNB)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-8 text-center sm:p-10">
              <h3 className="font-display text-heading-lg uppercase text-foreground">
                Need a Custom Quote?
              </h3>
              <p className="mt-3 text-body-sm text-muted-foreground">
                Use our guided trip planner to request dates, vehicles, and destinations in under two minutes.
              </p>
              <Button asChild size="lg" className="mt-6 w-full">
                <Link href="/enquire">
                  Start Online Request
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

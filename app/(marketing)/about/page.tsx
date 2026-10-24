import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  ShieldCheck,
  Star,
  Users,
  Award,
  Clock,
  ArrowRight,
  HeartHandshake,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Lavish Travels & Tours — South African Luxury Safaris & Chauffeur",
  description:
    "Lavish Travels & Tours is an accredited Southern African luxury travel, private safari and chauffeur company serving international visitors with five-star hospitality.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Hero Banner with Cinematic African Landscape */}
      <section className="relative isolate flex min-h-[460px] items-end overflow-hidden border-b border-border sm:min-h-[540px]">
        <Image
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&auto=format&fit=crop&q=85"
          alt="Breathtaking African savanna landscape at sunrise"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[center_55%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-black/65 to-black/40"
        />

        <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-28 sm:px-6 lg:px-8">
          <Breadcrumbs items={crumbs} />
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-black/60 px-4 py-1 backdrop-blur-md">
            <Compass className="size-3.5 text-accent" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Our Heritage &amp; Promise
            </span>
          </div>

          <h1 className="text-lit mt-4 max-w-3xl font-display text-[2.5rem] leading-[0.98] uppercase tracking-tight text-foreground sm:text-display-md lg:text-[4rem]">
            Crafting Africa&apos;s
            <span className="block text-accent">Finest Journeys</span>
          </h1>

          <p className="mt-5 max-w-xl text-body-md leading-relaxed text-foreground/80 sm:text-body-lg">
            We are a premier Southern African private travel and chauffeur company,
            dedicated to revealing the raw majesty of our continent with effortless luxury.
          </p>
        </div>
      </section>

      {/* The Story & Philosophy */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-caption font-medium tracking-[0.3em] text-accent">
              WHO WE ARE
            </p>
            <h2 className="mt-3 font-display text-display-sm uppercase tracking-tight text-foreground sm:text-display-md">
              Born from a Passion for Southern Africa
            </h2>
            <div className="mt-6 space-y-4 text-body-md leading-relaxed text-muted-foreground">
              <p>
                Lavish Travels &amp; Tours was founded with a singular conviction:
                that Africa&apos;s greatest wonders — from the thundering mist of Victoria
                Falls to the ancient granite peaks of Table Mountain and the untamed
                savannas of Kruger — deserve to be experienced in absolute comfort and safety.
              </p>
              <p>
                Unlike generic mass-market operators, we never outsource your journey
                to third-party contractors. Every driver-guide is an in-house professional
                holding valid PDP certification, and every private safari vehicle in our
                fleet is maintained to rigorous international standards.
              </p>
              <p>
                Whether you require an executive airport greeting at Cape Town International,
                a sommelier-curated winelands excursion, or a bespoke multi-day Big Five
                safari, our team looks after every detail from arrival to departure.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/tours">
                  Explore Tour Packages
                  <ArrowRight aria-hidden className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>

          {/* Photographic Collage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border">
              <Image
                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&auto=format&fit=crop&q=80"
                alt="Wild African Elephants in Kruger National Park"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="relative aspect-[4/5] translate-y-6 overflow-hidden rounded-xl border border-border">
              <Image
                src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&auto=format&fit=crop&q=80"
                alt="Victoria Falls aerial wonder"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="relative aspect-[4/5] -translate-y-6 overflow-hidden rounded-xl border border-border">
              <Image
                src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&auto=format&fit=crop&q=80"
                alt="Table Mountain Cape Town skyline"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border">
              <Image
                src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80"
                alt="Cape Winelands vineyard valley"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Excellence */}
      <section className="border-y border-border bg-surface/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-caption font-medium tracking-[0.3em] text-accent">
              STANDARDS
            </p>
            <h2 className="mt-3 font-display text-display-sm uppercase tracking-tight text-foreground sm:text-display-md">
              The Lavish Gold Standard
            </h2>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-surface p-7">
              <ShieldCheck className="size-8 text-accent" />
              <h3 className="mt-4 font-display text-heading-md uppercase text-foreground">
                Fully Bonded &amp; Insured
              </h3>
              <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">
                Comprehensive passenger liability protection on every vehicle with bonded
                industry membership.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-7">
              <Users className="size-8 text-accent" />
              <h3 className="mt-4 font-display text-heading-md uppercase text-foreground">
                Vetted Private Guides
              </h3>
              <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">
                Local specialists with deep regional knowledge, wildlife expertise and
                discretion.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-7">
              <Clock className="size-8 text-accent" />
              <h3 className="mt-4 font-display text-heading-md uppercase text-foreground">
                24/7 Operations Control
              </h3>
              <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">
                Live flight tracking and dispatch team ready to accommodate any schedule adjustments.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-7">
              <Award className="size-8 text-accent" />
              <h3 className="mt-4 font-display text-heading-md uppercase text-foreground">
                Transparent Pricing
              </h3>
              <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">
                Guaranteed fixed rates with zero hidden surge fees or unexpected airport surcharges.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

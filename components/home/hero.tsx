import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Star, Users, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * World-class cinematic homepage hero featuring real African travel scenery:
 * Table Mountain and the South African Atlantic Seaboard at golden hour,
 * layered with luxury dark vignette, metallic gold glows, and floating trust markers.
 */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-[620px] items-end overflow-hidden bg-background sm:min-h-[720px] lg:min-h-[820px]">
      {/* Real High-Resolution African Travel Landscape */}
      <Image
        src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&auto=format&fit=crop&q=85"
        alt="Breathtaking panoramic Table Mountain and Twelve Apostles coastline in South Africa"
        fill
        priority
        sizes="100vw"
        className="-z-30 scale-105 object-cover object-[center_35%] transition-transform duration-1000 ease-out"
      />

      {/* Cinematic dark luxury overlay gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-r from-black/95 via-black/75 to-black/40"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-t from-background via-black/40 to-black/60"
      />

      {/* Warm Golden Safari Sunset Radial Glow */}
      <div
        aria-hidden
        className="animate-pulse-glow absolute -z-10 h-[500px] w-[500px] rounded-full opacity-60 blur-[100px] sm:h-[650px] sm:w-[650px]"
        style={{
          right: "8%",
          top: "15%",
          background:
            "radial-gradient(circle, rgb(255 149 0 / 0.35) 0%, rgb(217 75 35 / 0.15) 50%, transparent 70%)",
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-36 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-black/60 px-4 py-1.5 backdrop-blur-md">
          <Compass className="size-3.5 text-accent animate-spin-slow" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            South Africa &amp; Beyond
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-lit mt-6 max-w-4xl font-display text-[2.75rem] leading-[0.96] uppercase tracking-tight text-foreground sm:text-display-md lg:text-[4.75rem]">
          Arrive the way
          <span className="mt-2 block bg-gradient-to-r from-accent via-amber-200 to-amber-500 bg-clip-text text-transparent">
            you intended
          </span>
        </h1>

        {/* Lead text */}
        <p className="mt-6 max-w-xl text-body-md leading-relaxed text-foreground/85 sm:text-body-lg">
          Private airport transfers, luxury chauffeured days, self-drive journeys
          and tailored safaris across South Africa, Kruger and Victoria Falls.
          Fixed pricing, vetted local drivers, and five-star private service.
        </p>

        {/* CTA Buttons */}
        <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="shadow-[0_0_25px_rgba(255,149,0,0.35)]">
            <Link href="/tours">
              Explore Cape Town Tours
              <ArrowRight aria-hidden className="ml-1.5 size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-accent/40 hover:bg-accent/10">
            <Link href="/enquire">Plan a Custom Journey</Link>
          </Button>
        </div>

        {/* Floating Trust Indicators */}
        <div className="mt-14 grid max-w-3xl grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg border border-accent/30 bg-black/50 text-accent">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">100% Fixed Rates</p>
              <p className="text-[11px] text-muted-foreground">No hidden surge fees</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg border border-accent/30 bg-black/50 text-accent">
              <Star className="size-5 fill-accent" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">4.9 / 5.0 Rating</p>
              <p className="text-[11px] text-muted-foreground">International guests</p>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
            <div className="flex size-10 items-center justify-center rounded-lg border border-accent/30 bg-black/50 text-accent">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Private Guides</p>
              <p className="text-[11px] text-muted-foreground">Local certified experts</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

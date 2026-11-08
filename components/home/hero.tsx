import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Clock, Users, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * World-class cinematic homepage hero featuring real African travel scenery:
 * Table Mountain and the South African Atlantic Seaboard at golden hour,
 * layered with luxury dark vignette, metallic gold glows, and floating trust markers.
 */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-[500px] items-end overflow-hidden bg-background sm:min-h-[560px] lg:min-h-[620px]">
      {/* Real High-Resolution Luxury Resort & Grand Hotel Scenery */}
      <Image
        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=2000&auto=format&fit=crop&q=90"
        alt="Five-star luxury grand hotel and resort illuminated in warm golden light"
        fill
        priority
        sizes="100vw"
        className="-z-30 scale-105 object-cover object-center transition-transform duration-1000 ease-out"
      />

      {/* Balanced luxury overlay gradient so the hero image stays bright and eye-catching */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-r from-black/80 via-black/45 to-black/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-t from-background via-black/20 to-black/25"
      />

      {/* Warm Golden Safari Sunset Radial Glow */}
      <div
        aria-hidden
        className="animate-pulse-glow absolute -z-10 h-[400px] w-[400px] rounded-full opacity-60 blur-[100px] sm:h-[550px] sm:w-[550px]"
        style={{
          right: "8%",
          top: "15%",
          background:
            "radial-gradient(circle, rgb(255 149 0 / 0.35) 0%, rgb(217 75 35 / 0.15) 50%, transparent 70%)",
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-20 sm:px-6 sm:pb-12 sm:pt-24 lg:px-8 lg:pb-14">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-black/60 px-3.5 py-1 backdrop-blur-md">
          <Compass className="size-3 text-accent animate-spin-slow" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
            South Africa &amp; Beyond
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-lit mt-4 max-w-3xl font-display text-[2.25rem] leading-[0.98] uppercase tracking-tight text-foreground sm:text-[3rem] lg:text-[3.75rem]">
          Arrive the way
          <span className="mt-1 block bg-gradient-to-r from-accent via-amber-200 to-amber-500 bg-clip-text text-transparent">
            you intended
          </span>
        </h1>

        {/* Lead text */}
        <p className="mt-4 max-w-xl text-body-sm leading-relaxed text-foreground/85 sm:text-body-md">
          Private airport transfers, luxury chauffeured days, self-drive journeys
          and tailored safaris across South Africa, Kruger and Victoria Falls.
          Fixed pricing, vetted local drivers, and five-star private service.
        </p>

        {/* CTA Buttons */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
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
        <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3.5 border-t border-white/10 pt-5 sm:grid-cols-3 sm:mt-10 sm:pt-6">
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
              <Clock className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">24/7 Door-to-Door</p>
              <p className="text-[11px] text-muted-foreground">Airport &amp; hotel pickup</p>
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

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * High-impact cinematic Final CTA with a majestic African sunset landscape scene,
 * luxury ambient glow, and quick booking access.
 */
export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden border-t border-border bg-black py-24 sm:py-32">
      {/* Real African savanna sunset scene */}
      <Image
        src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&auto=format&fit=crop&q=85"
        alt="African safari savanna sunset landscape"
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[center_60%] opacity-40 transition-transform duration-1000"
      />

      {/* Cinematic dark luxury gradients */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-black/80 to-background/95"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-black/70 to-background"
      />

      {/* Warm Golden Sunset Ambient Light */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[450px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgb(255 149 0 / 0.4) 0%, rgb(217 75 35 / 0.2) 50%, transparent 75%)",
        }}
      />

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-black/60 px-4 py-1 backdrop-blur-md">
          <span className="size-2 rounded-full bg-accent animate-ping" />
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Tailored Southern African Journeys
          </p>
        </div>

        <h2 className="text-lit mt-6 font-display text-[2.5rem] leading-[1.02] uppercase tracking-tight text-foreground sm:text-display-md lg:text-[3.75rem]">
          Your African Journey
          <span className="mt-1 block bg-gradient-to-r from-accent via-amber-200 to-amber-500 bg-clip-text text-transparent">
            Begins Here
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-body-md leading-relaxed text-foreground/80 sm:text-body-lg">
          Whether you seek the thunder of Victoria Falls, the Big Five plains of Kruger,
          or the ocean vistas of Cape Town — our private chauffeurs and safari specialists
          craft an unforgettable itinerary shaped around your schedule.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="shadow-[0_0_25px_rgba(255,149,0,0.35)]">
            <Link href="/enquire">
              Plan Your Custom Journey
              <ArrowRight aria-hidden className="ml-1.5 size-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="border-accent/40 hover:bg-accent/10">
            <Link href="/tours">
              Explore All Tours
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="border-white/20 hover:border-[#25D366] hover:text-[#25D366]">
            <a
              href="https://wa.me/27000000000?text=Hi%20Lavish%20Travels%20%26%20Tours%2C%20I%20would%20like%20to%20enquire%20about%20a%20private%20tour."
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 size-4 text-[#25D366]" />
              Chat with Concierge
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

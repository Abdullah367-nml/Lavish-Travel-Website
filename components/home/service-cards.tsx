import Link from "next/link";
import Image from "next/image";
import {
  Plane,
  Car,
  Map,
  Users,
  Compass,
  ArrowUpRight,
  CircleDot,
} from "lucide-react";
import type { ServiceSummary } from "@/lib/types";
import { SectionHeading } from "@/components/shared/section-heading";

const ICONS = {
  plane: Plane,
  steering: CircleDot,
  car: Car,
  map: Map,
  users: Users,
  gift: Compass,
} as const;

/** Real scenic imagery mapped to each of the six travel services */
const SERVICE_IMAGES: Record<string, string> = {
  transfers:
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80",
  chauffeur:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
  "car-hire":
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
  tours:
    "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=800&auto=format&fit=crop&q=80",
  safaris:
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop&q=80",
  tailored:
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&auto=format&fit=crop&q=80",
};

export function ServiceCards({ services }: { services: ServiceSummary[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading
        eyebrow="PREMIER SERVICES"
        title="Six ways we get you there"
        lead="Whether you need a chauffeur at the airport terminal or a tailored two-week safari across Southern Africa, travel in effortless style."
      />

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = ICONS[service.icon];
          const bgImage =
            SERVICE_IMAGES[service.slug] ||
            "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop&q=80";

          return (
            <li key={service.slug} className="group">
              <Link
                href={service.href}
                className="relative flex h-full min-h-[290px] flex-col justify-end overflow-hidden rounded-xl border border-border/80 bg-zinc-950 p-6 outline-none transition-all duration-300 hover:border-accent/60 hover:shadow-[0_0_30px_rgba(255,149,0,0.22)] sm:p-7"
              >
                {/* Real photographic background */}
                <Image
                  src={bgImage}
                  alt={service.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Dark luxury gradient scrims */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/35 opacity-90 transition-opacity group-hover:opacity-80"
                />

                {/* Top Icon Badge */}
                <div className="absolute left-6 top-6 flex size-11 items-center justify-center rounded-lg border border-accent/30 bg-black/60 text-accent backdrop-blur-md transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-black">
                  <Icon aria-hidden className="size-5" />
                </div>

                {/* Top Arrow */}
                <div className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-all group-hover:bg-accent group-hover:text-black">
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>

                {/* Card Text Content */}
                <div className="relative pt-16">
                  <h3 className="font-display text-heading-md uppercase tracking-wide text-foreground transition-colors group-hover:text-accent">
                    {service.name}
                  </h3>

                  <p className="mt-2 text-body-sm leading-relaxed text-foreground/75">
                    {service.tagline}
                  </p>

                  <span className="mt-4 inline-flex items-center text-xs font-semibold uppercase tracking-wider text-accent opacity-90 group-hover:underline">
                    Learn More →
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

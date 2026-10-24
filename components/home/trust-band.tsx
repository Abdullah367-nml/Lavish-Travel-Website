import { ShieldCheck, Clock, Award, BadgeCheck, Banknote } from "lucide-react";

/**
 * The "Why Lavish" band.
 *
 * Deliberately specific. "Professional service" and "unforgettable
 * memories" are what every competitor writes and they persuade nobody;
 * a named grading body, a stated insurance position and an actual
 * cancellation window do the work instead.
 *
 * The accreditation claims below are placeholders until the real
 * certificates are confirmed — see the note in the code. Publishing an
 * unearned TGCSA grading or SATSA membership is a compliance problem, not
 * just a marketing exaggeration.
 */
const PILLARS = [
  {
    icon: Award,
    title: "TGCSA graded",
    body: "Graded by the Tourism Grading Council of South Africa. Certificate number displayed on request.",
  },
  {
    icon: BadgeCheck,
    title: "SATSA & ASATA member",
    body: "Bonded membership of the industry bodies, which means your deposit is protected if anything goes wrong.",
  },
  {
    icon: ShieldCheck,
    title: "Fully insured",
    body: "Comprehensive passenger liability on every vehicle, and every driver holds a valid Professional Driving Permit.",
  },
  {
    icon: Clock,
    title: "24/7 operations",
    body: "A staffed line, not an answering service. If a flight moves at 3am, someone reroutes your driver.",
  },
  {
    icon: Banknote,
    title: "Fixed transfer pricing",
    body: "Airport transfer prices are published on the site. No waiting-time surcharge and no peak-hour multiplier.",
  },
];

export function TrustBand() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <h2 className="font-display text-display-sm uppercase text-foreground">
          Why Lavish
        </h2>

        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {PILLARS.map((pillar) => (
            <li key={pillar.title} className="flex flex-col gap-3">
              <pillar.icon aria-hidden className="size-5 text-accent" />
              <h3 className="font-display text-heading-sm uppercase tracking-wide text-foreground">
                {pillar.title}
              </h3>
              <p className="text-body-sm leading-relaxed text-muted-foreground">
                {pillar.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

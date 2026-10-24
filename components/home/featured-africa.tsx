// components/home/featured-africa.tsx
import Link from "next/link";
import Image from "next/image";

const HIGHLIGHTS = [
  {
    id: "h1",
    slug: "kruger-national-park",
    name: "Kruger National Park",
    country: "South Africa",
    intro:
      "Two million hectares of Big Five wilderness — the most reliable safari in Africa. Best in the dry winter when animals gather at water.",
    bestMonths: "May to September",
    // Elephant herd at sunset in Kruger
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80",
  },
  {
    id: "h2",
    slug: "victoria-falls",
    name: "Victoria Falls",
    country: "Zimbabwe",
    intro:
      'Mosi-oa-Tunya — "the smoke that thunders." Twice the height of Niagara and a short flight from Johannesburg.',
    bestMonths: "February to May",
    // Victoria Falls aerial view
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80",
  },
  {
    id: "h3",
    slug: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    intro:
      "Table Mountain on one side, two oceans on the other. Africa's most iconic city and gateway for international visitors.",
    bestMonths: "November to March",
    // Cape Town Table Mountain
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
  },
  {
    id: "h4",
    slug: "drakensberg",
    name: "Drakensberg",
    country: "South Africa",
    intro:
      "A UNESCO World Heritage landscape — a thousand-metre basalt wall with ancient San rock art and the towering Tugela Falls.",
    bestMonths: "April to September",
    // Drakensberg mountains
    image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80",
  },
];

/**
 * Fully static section — always renders regardless of Supabase status.
 * Shows four iconic African destinations to attract international visitors.
 */
export function FeaturedAfrica() {
  return (
    <section className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            Discover the Continent
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground">
            Iconic African Destinations
          </h2>
          <p className="mt-3 mx-auto max-w-xl text-sm text-foreground/60">
            From the thundering Victoria Falls to the Big Five plains of Kruger —
            explore Africa&apos;s most celebrated places with expert local guides.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border transition-all duration-300 hover:border-accent/60 hover:shadow-[0_0_30px_rgba(255,149,0,0.25)]"
            >
              {/* Real destination photo */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* Country badge */}
                <span className="absolute top-3 right-3 rounded-full bg-accent/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-black">
                  {dest.country}
                </span>
              </div>

              {/* Text content */}
              <div className="flex flex-grow flex-col bg-gradient-to-b from-zinc-900 to-zinc-950 p-5">
                <h3 className="font-display text-base text-foreground transition-colors group-hover:text-accent">
                  {dest.name}
                </h3>
                <p className="mt-2 flex-grow text-sm leading-relaxed text-foreground/55">
                  {dest.intro}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-foreground/35">
                    Best: {dest.bestMonths}
                  </span>
                  <span className="text-xs font-semibold text-accent group-hover:underline">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

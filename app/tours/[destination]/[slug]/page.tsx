import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Check,
  X,
  Clock,
  Users,
  MapPin,
  Mountain,
  Luggage,
  ArrowRight,
  Phone,
  MessageCircle,
} from "lucide-react";
import {
  getAggregateRating,
  getAllTourParams,
  getDestinationBySlug,
  getRelatedTours,
  getReviewsForPackage,
  getTourBySlug,
  getTourDates,
} from "@/lib/data";
import {
  formatCategory,
  formatDifficulty,
  formatDuration,
} from "@/lib/format";
import { getWhatsAppBookingUrl } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardMeta } from "@/components/ui/card";
import { JsonLd } from "@/components/shared/json-ld";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  tourJsonLd,
} from "@/lib/structured-data";
import { Itinerary } from "@/components/tours/itinerary";
import { Departures } from "@/components/tours/departures";
import { Gallery } from "@/components/tours/gallery";
import { TourCard } from "@/components/shared/tour-card";
import { FaqList } from "@/components/shared/faq-list";

/**
 * Content comes from Supabase and an admin can change it at any time, so this
 * page is revalidated rather than frozen at build time. 60 seconds is a
 * deliberate compromise: an admin edit shows up on the public site within a
 * minute, while normal visitors are still served a cached page rather than
 * hitting the database on every request.
 */
export const revalidate = 60;


type TourPageProps = {
  params: Promise<{ destination: string; slug: string }>;
};

/** Prerender every published tour — these are ISR pages per Section 3. */
export async function generateStaticParams() {
  return getAllTourParams();
}

export async function generateMetadata({
  params,
}: TourPageProps): Promise<Metadata> {
  const { destination, slug } = await params;
  const tour = await getTourBySlug(destination, slug);
  if (!tour) return {};

  return {
    title: tour.seoTitle,
    description: tour.seoDescription,
    alternates: { canonical: `/tours/${destination}/${slug}` },
    openGraph: {
      title: tour.seoTitle,
      description: tour.seoDescription,
      type: "article",
    },
  };
}

export default async function TourDetailPage({ params }: TourPageProps) {
  const { destination: destinationSlug, slug } = await params;
  const tour = await getTourBySlug(destinationSlug, slug);
  if (!tour) notFound();

  const [destination, related, aggregate, reviews, dates] = await Promise.all([
    getDestinationBySlug(destinationSlug),
    getRelatedTours(tour, 3),
    getAggregateRating(tour.id),
    getReviewsForPackage(tour.id),
    getTourDates(tour.slug),
  ]);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Tours", href: "/tours" },
    {
      label: destination?.name ?? destinationSlug,
      href: `/tours/${destinationSlug}`,
    },
    { label: tour.title, href: `/tours/${destinationSlug}/${slug}` },
  ];

  const specs = [
    { icon: Clock, label: "Duration", value: formatDuration(tour.durationDays) },
    {
      icon: Users,
      label: "Group size",
      value: `${tour.groupMin}–${tour.groupMax} guests`,
    },
    { icon: Mountain, label: "Difficulty", value: formatDifficulty(tour.difficulty) },
    { icon: MapPin, label: "Departs from", value: tour.departsFrom.join(", ") },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={tourJsonLd(tour, aggregate)} />
      {tour.faqs.length > 0 && <JsonLd data={faqJsonLd(tour.faqs)} />}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Badge variant="subtle">{formatCategory(tour.category)}</Badge>
          {tour.isFeatured && <Badge variant="accent">Featured</Badge>}
          {destination && (
            <Badge variant="outline">{destination.province}</Badge>
          )}
        </div>

        <h1 className="text-lit mt-5 max-w-3xl font-display text-display-sm uppercase text-foreground sm:text-display-md">
          {tour.title}
        </h1>
        <p className="mt-5 max-w-2xl text-body-md leading-relaxed text-muted-foreground">
          {tour.summary}
        </p>

        <div className="mt-8">
          <Gallery images={tour.gallery} alt={tour.title} />
        </div>

        <div className="mt-12 flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* --- Main column ------------------------------------------------ */}
          <div className="min-w-0 flex-1">
            {/* Specs */}
            <dl className="grid grid-cols-2 gap-6 border-y border-border py-6 sm:grid-cols-4">
              {specs.map((spec) => (
                <div key={spec.label} className="flex flex-col gap-2">
                  <spec.icon aria-hidden className="size-4 text-accent" />
                  <dt className="text-caption uppercase tracking-[0.16em] text-muted-foreground">
                    {spec.label}
                  </dt>
                  <dd className="text-body-sm font-medium text-foreground">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Departures — live seat counts straight from the database */}
            <section className="mt-14 scroll-mt-24" id="dates" aria-labelledby="dates-heading">
              <h2
                id="dates-heading"
                className="font-display text-display-sm uppercase text-foreground"
              >
                Choose a date
              </h2>
              <p className="mt-3 max-w-2xl text-body-sm text-muted-foreground">
                Seat counts are live. If a departure shows as almost full, that
                is the number actually left.
              </p>
              <div className="mt-6">
                <Departures dates={dates} tourSlug={tour.slug} />
              </div>
            </section>

            {/* Attractions this tour covers */}
            {tour.attractions && tour.attractions.length > 0 && (
              <section className="mt-14" aria-labelledby="attractions-heading">
                <h2
                  id="attractions-heading"
                  className="font-display text-display-sm uppercase text-foreground"
                >
                  What you will see
                </h2>
                <ul className="mt-6 flex flex-col gap-5">
                  {tour.attractions.map((attraction) => (
                    <li key={attraction.id} className="flex gap-3">
                      <Check
                        aria-hidden
                        className="mt-1 size-4 shrink-0 text-success"
                      />
                      <div>
                        <h3 className="font-display text-heading-sm uppercase tracking-wide text-foreground">
                          {attraction.name}
                        </h3>
                        <p className="mt-1.5 text-body-sm leading-relaxed text-muted-foreground">
                          {attraction.description}
                        </p>
                        {attraction.location && (
                          <p className="mt-1.5 text-caption uppercase tracking-[0.14em] text-muted-foreground">
                            {attraction.location}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Itinerary */}
            <section className="mt-14" aria-labelledby="itinerary-heading">
              <h2
                id="itinerary-heading"
                className="font-display text-display-sm uppercase text-foreground"
              >
                {tour.durationDays === 1 ? "The day" : "Day by day"}
              </h2>
              <div className="mt-6">
                <Itinerary days={tour.itinerary} />
              </div>
            </section>

            {/* Inclusions / exclusions */}
            <section className="mt-14" aria-labelledby="included-heading">
              <h2
                id="included-heading"
                className="font-display text-display-sm uppercase text-foreground"
              >
                What is included
              </h2>
              <div className="mt-6 grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="text-caption font-medium uppercase tracking-[0.18em] text-accent">
                    Included
                  </h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {tour.inclusions.map((item) => (
                      <li key={item} className="flex gap-3">
                        <Check
                          aria-hidden
                          className="mt-0.5 size-4 shrink-0 text-success"
                        />
                        <span className="text-body-sm leading-relaxed text-muted-foreground">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-caption font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Not included
                  </h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {tour.exclusions.map((item) => (
                      <li key={item} className="flex gap-3">
                        <X
                          aria-hidden
                          className="mt-0.5 size-4 shrink-0 text-muted-foreground/60"
                        />
                        <span className="text-body-sm leading-relaxed text-muted-foreground">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* What to pack */}
            {tour.whatToPack.length > 0 && (
              <section className="mt-14" aria-labelledby="pack-heading">
                <h2
                  id="pack-heading"
                  className="flex items-center gap-3 font-display text-display-sm uppercase text-foreground"
                >
                  <Luggage aria-hidden className="size-6 text-accent" />
                  What to pack
                </h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {tour.whatToPack.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-body-sm leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className="mt-2 inline-block size-1 shrink-0 rounded-full bg-accent"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* FAQs */}
            {tour.faqs.length > 0 && (
              <section className="mt-14" aria-labelledby="faq-heading">
                <h2
                  id="faq-heading"
                  className="font-display text-display-sm uppercase text-foreground"
                >
                  Questions
                </h2>
                <div className="mt-6">
                  <FaqList faqs={tour.faqs} />
                </div>
              </section>
            )}

            {/* Reviews for this tour */}
            {reviews.length > 0 && (
              <section className="mt-14" aria-labelledby="reviews-heading">
                <h2
                  id="reviews-heading"
                  className="font-display text-display-sm uppercase text-foreground"
                >
                  From guests who went
                </h2>
                <ul className="mt-6 flex flex-col gap-4">
                  {reviews.map((review) => (
                    <li key={review.id}>
                      <Card>
                        <CardBody className="flex flex-col gap-3">
                          <h3 className="font-display text-heading-sm uppercase tracking-wide text-foreground">
                            {review.title}
                          </h3>
                          <blockquote className="text-body-sm leading-relaxed text-muted-foreground">
                            {review.body}
                          </blockquote>
                          <CardMeta>
                            {review.authorName} &middot; {review.authorCountry}
                          </CardMeta>
                        </CardBody>
                      </Card>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* --- Sticky booking rail ---------------------------------------- */}
          <aside className="lg:w-80 lg:shrink-0">
            <div className="lg:sticky lg:top-24">
              <Card className="rim-top">
                <CardBody className="flex flex-col gap-5">
                  <div>
                    <CardMeta>Tour Rate</CardMeta>
                    <p className="mt-1 font-display text-heading-md uppercase text-accent">
                      Price on Request
                    </p>
                    <p className="mt-1 text-caption text-muted-foreground">
                      Private vehicle &amp; driver-guide rates tailored to your dates and party size
                    </p>
                  </div>

                  {aggregate && (
                    <p className="text-caption uppercase tracking-[0.14em] text-accent">
                      {aggregate.ratingValue} / 5 &middot; {aggregate.reviewCount}{" "}
                      review{aggregate.reviewCount === 1 ? "" : "s"}
                    </p>
                  )}

                  <div className="flex flex-col gap-3 border-t border-border pt-5">
                    <Button asChild size="lg" className="w-full text-base py-5 font-semibold">
                      <Link href={`/enquire?service=tours&item=${tour.slug}`}>
                        Enquire About This Tour
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full hover:border-[#25D366] hover:text-[#25D366]">
                      <a
                        href={getWhatsAppBookingUrl(tour.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle aria-hidden className="mr-2 size-4 text-[#25D366]" />
                        Chat with a Specialist
                      </a>
                    </Button>
                    <Button asChild variant="outline">
                      <a href="tel:+27624015042">
                        <Phone aria-hidden className="mr-2 size-4 text-accent" />
                        Call Our Concierge
                      </a>
                    </Button>
                  </div>

                  <p className="text-caption leading-relaxed text-muted-foreground">
                    Custom departures, private vehicle options, and personalized itineraries are arranged directly with our dedicated travel concierge.
                  </p>
                </CardBody>
              </Card>
            </div>
          </aside>
        </div>

        {/* Related tours */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-border pt-14" aria-labelledby="related-heading">
            <h2
              id="related-heading"
              className="font-display text-display-sm uppercase text-foreground"
            >
              You might also consider
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <TourCard tour={item} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}

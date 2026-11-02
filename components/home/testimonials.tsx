import { Star } from "lucide-react";
import type { Review } from "@/lib/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardBody, CardMeta } from "@/components/ui/card";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden
          className={
            n <= rating
              ? "size-3.5 fill-accent text-accent"
              : "size-3.5 text-border"
          }
        />
      ))}
    </div>
  );
}

export function Testimonials({
  reviews,
  aggregate,
}: {
  reviews: Review[];
  aggregate: { ratingValue: number; reviewCount: number } | null;
}) {
  if (reviews.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <SectionHeading
        eyebrow="IN THEIR WORDS"
        title="What guests actually said"
        lead={
          aggregate
            ? `Averaging ${aggregate.ratingValue} out of 5 across ${aggregate.reviewCount} reviews, published unedited.`
            : undefined
        }
      />

      <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {reviews.map((review) => (
          <li key={review.id}>
            <Card className="h-full">
              <CardBody className="flex h-full flex-col gap-4">
                <Stars rating={review.rating} />

                <h3 className="font-display text-heading-sm uppercase tracking-wide text-foreground">
                  {review.title}
                </h3>

                <blockquote className="flex-1 text-body-sm leading-relaxed text-muted-foreground">
                  {review.body}
                </blockquote>

                <footer className="border-t border-border pt-4">
                  <CardMeta>
                    {review.authorName} &middot; {review.authorCountry}
                  </CardMeta>
                </footer>
              </CardBody>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

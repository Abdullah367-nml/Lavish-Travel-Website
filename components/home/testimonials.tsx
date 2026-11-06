import type { Review } from "@/lib/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { InteractiveReviewSection } from "@/components/shared/review-form";

export function Testimonials({
  reviews,
  aggregate,
}: {
  reviews: Review[];
  aggregate: { ratingValue: number; reviewCount: number } | null;
}) {
  return (
    <section
      id="reviews"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
    >
      <SectionHeading
        eyebrow="IN THEIR WORDS"
        title="What guests actually said"
        lead={
          aggregate
            ? `Averaging ${aggregate.ratingValue} out of 5 across ${aggregate.reviewCount} verified reviews. Rate any tour, airport transfer, chauffeur or car hire experience below.`
            : "Rate any tour, airport transfer, chauffeur or car hire experience below."
        }
      />

      <div className="mt-8">
        <InteractiveReviewSection
          initialReviews={reviews}
          heading="Verified Ratings Across All Tours & Services"
          subheading="International guests rate our private tours, airport transfers, chauffeur service and self-drive fleet."
        />
      </div>
    </section>
  );
}

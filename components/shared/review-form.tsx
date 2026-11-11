"use client";

import { useState } from "react";
import { Star, CheckCircle2, Loader2 } from "lucide-react";
import type { Review } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardMeta } from "@/components/ui/card";

const RATING_LABELS: Record<number, string> = {
  1: "1/5",
  2: "2/5",
  3: "3/5",
  4: "4/5",
  5: "5/5 ★",
};

export function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const iconClass = size === "md" ? "size-4" : "size-3.5";
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden
          className={
            n <= rating
              ? `${iconClass} fill-accent text-accent`
              : `${iconClass} text-border`
          }
        />
      ))}
    </div>
  );
}

export function InteractiveReviewSection({
  initialReviews,
  defaultServiceOrTour,
  packageId,
  heading = "Guest Reviews & Ratings",
  subheading = "Verified ratings across our private tours, airport transfers, chauffeur service and car hire.",
}: {
  initialReviews: (Review & { serviceLabel?: string })[];
  defaultServiceOrTour?: string;
  packageId?: string;
  heading?: string;
  subheading?: string;
}) {
  const [reviews, setReviews] = useState<(Review & { serviceLabel?: string })[]>(initialReviews);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const totalCount = reviews.length;
  const avgRating =
    totalCount > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / totalCount) * 10) / 10
      : 4.9;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName,
          serviceOrTour: defaultServiceOrTour || "Lavish Travels & Tours",
          rating,
          body,
          packageId: packageId ?? null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Please enter your name and try again.");
        setSubmitting(false);
        return;
      }

      if (data.review) {
        setReviews((prev) => [data.review, ...prev]);
      }
      setSubmittedSuccess(true);
      setSubmitting(false);
      setAuthorName("");
      setBody("");
      setTimeout(() => {
        setSubmittedSuccess(false);
      }, 3000);
    } catch {
      setError("Network error while submitting your rating. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      {/* Compact All-in-One Rating Card */}
      <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl border border-accent/40 bg-accent/10 text-accent">
              <span className="font-display text-xl font-bold leading-none">
                {avgRating.toFixed(1)}
              </span>
              <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider">
                out of 5
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <StarDisplay rating={Math.round(avgRating)} size="md" />
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {totalCount} Verified Reviews
                </span>
              </div>
              <h3 className="mt-0.5 font-display text-heading-sm uppercase tracking-wide text-foreground">
                {heading}
              </h3>
              <p className="text-xs text-muted-foreground">{subheading}</p>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="shrink-0 border-amber-400/50 text-amber-300 hover:bg-amber-400/15"
          >
            <a
              href="https://www.google.com/search?q=Lavish+Travels+%26+Tours+(Pvt)+Ltd"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Star className="mr-1.5 size-3.5 fill-amber-400 text-amber-400" />
              Rate on Google
            </a>
          </Button>
        </div>

        {/* Sleek 1-Line Quick Rating Bar */}
        <form
          onSubmit={handleSubmit}
          className="mt-4 border-t border-border/80 pt-4"
        >
          {submittedSuccess ? (
            <div className="flex items-center justify-center gap-2.5 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm font-medium text-accent">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Thank you! Your rating has been published below.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              {/* Tap Stars */}
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tap to Rate:
                </span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`Rate ${star} out of 5 stars`}
                        className="rounded p-0.5 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={
                            active
                              ? "size-6 fill-accent text-accent"
                              : "size-6 text-muted-foreground/35"
                          }
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-bold text-accent">
                  {RATING_LABELS[hoverRating || rating]}
                </span>
              </div>

              {/* Your Name */}
              <input
                type="text"
                required
                placeholder="Your Name *"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none lg:w-48"
              />

              {/* Optional Short Comment */}
              <input
                type="text"
                placeholder="Write a short comment (optional)…"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none"
              />

              {/* Submit Button */}
              <Button type="submit" size="sm" disabled={submitting} className="h-10 shrink-0 px-5">
                {submitting ? (
                  <>
                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Submit Rating"
                )}
              </Button>
            </div>
          )}

          {error && (
            <p className="mt-2 text-xs text-destructive">{error}</p>
          )}
        </form>
      </div>

      {/* Reviews Grid */}
      {reviews.length > 0 && (
        <ul className="mt-6 grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <li key={review.id}>
              <Card className="h-full">
                <CardBody className="flex h-full flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <StarDisplay rating={review.rating} />
                    {review.serviceLabel && (
                      <span className="truncate rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                        {review.serviceLabel}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-heading-sm uppercase tracking-wide text-foreground">
                    {review.title}
                  </h3>

                  <blockquote className="flex-1 text-body-sm leading-relaxed text-muted-foreground">
                    &ldquo;{review.body}&rdquo;
                  </blockquote>

                  <footer className="border-t border-border pt-3">
                    <CardMeta>
                      {review.authorName} &middot; {review.authorCountry}
                    </CardMeta>
                  </footer>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

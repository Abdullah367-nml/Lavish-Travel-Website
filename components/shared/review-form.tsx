"use client";

import { useState } from "react";
import { Star, CheckCircle2, Loader2, MessageSquarePlus } from "lucide-react";
import type { Review, TravellerType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardMeta } from "@/components/ui/card";

export const RATEABLE_ITEMS = [
  { group: "Our Services", label: "Airport Transfers (CPT / JNB / DUR)" },
  { group: "Our Services", label: "Private Chauffeur Service" },
  { group: "Our Services", label: "Self-Drive Luxury Car Hire" },
  { group: "Our Services", label: "Custom Safari & Bespoke Itinerary" },
  { group: "Cape Town & Winelands Tours", label: "4-Day Cape Town Ultimate Experience" },
  { group: "Cape Town & Winelands Tours", label: "Cape Town City & Table Mountain Tour" },
  { group: "Cape Town & Winelands Tours", label: "Cape Peninsula / Cape Point Tour" },
  { group: "Cape Town & Winelands Tours", label: "Cape Winelands Tour (Stellenbosch & Franschhoek)" },
  { group: "Cape Town & Winelands Tours", label: "Cape Town Safari / Big Five Safari" },
  { group: "Cape Town & Winelands Tours", label: "Hermanus Whale Watching Tour" },
  { group: "Cape Town & Winelands Tours", label: "Cape Town Sunset & Scenic Drive" },
  { group: "Cape Town & Winelands Tours", label: "V&A Waterfront & Ocean Experiences" },
  { group: "Cape Town & Winelands Tours", label: "Robben Island & Mandela Heritage Tour" },
  { group: "Cape Town & Winelands Tours", label: "West Coast & Wildflowers Tour" },
  { group: "Cape Town & Winelands Tours", label: "Kirstenbosch Botanical Gardens & Canopy Walk" },
  { group: "Garden Route & Safari Packages", label: "5-Day Garden Route & Addo Elephant Safari Tour" },
  { group: "Garden Route & Safari Packages", label: "3-Day Garden Route, Knysna & Cango Caves Loop" },
  { group: "Garden Route & Safari Packages", label: "Knysna, Plettenberg Bay & Tsitsikamma Coastal Tour" },
  { group: "Garden Route & Safari Packages", label: "4-Day Kruger Big Five Safari Package" },
  { group: "Garden Route & Safari Packages", label: "4-Day Victoria Falls & Chobe Experience" },
];

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Exceptional — 5 Stars",
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
  const [showForm, setShowForm] = useState(true);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [serviceOrTour, setServiceOrTour] = useState(
    defaultServiceOrTour || RATEABLE_ITEMS[0].label,
  );
  const [authorName, setAuthorName] = useState("");
  const [authorCountry, setAuthorCountry] = useState("");
  const [travellerType, setTravellerType] = useState<TravellerType>("couple");
  const [title, setTitle] = useState("");
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
          authorCountry,
          serviceOrTour,
          rating,
          title,
          body,
          travellerType,
          packageId: packageId ?? null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Please check your entries and try again.");
        setSubmitting(false);
        return;
      }

      if (data.review) {
        setReviews((prev) => [data.review, ...prev]);
      }
      setSubmittedSuccess(true);
      setSubmitting(false);
      setAuthorName("");
      setAuthorCountry("");
      setTitle("");
      setBody("");
      setTimeout(() => {
        setShowForm(false);
        setSubmittedSuccess(false);
      }, 2200);
    } catch {
      setError("Network error while submitting your rating. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      {/* Top Aggregate Rating Banner + Rate CTA */}
      <div className="flex flex-col justify-between gap-6 rounded-xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-3.5">
            <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-xl border border-accent/40 bg-accent/10 text-accent">
              <span className="font-display text-2xl font-bold leading-none">
                {avgRating.toFixed(1)}
              </span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider">
                out of 5
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <StarDisplay rating={Math.round(avgRating)} size="md" />
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Verified Guest Rating
                </span>
              </div>
              <h3 className="mt-1 font-display text-heading-sm uppercase tracking-wide text-foreground">
                {heading}
              </h3>
              <p className="mt-0.5 text-body-sm text-muted-foreground">
                {subheading} ({totalCount} verified reviews)
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            asChild
            variant="outline"
            className="border-amber-400/50 text-amber-300 hover:bg-amber-400/15"
          >
            <a
              href="https://www.google.com/search?q=Lavish+Travels+%26+Tours+(Pvt)+Ltd"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Star className="mr-2 size-4 fill-amber-400 text-amber-400" />
              Rate Us on Google
            </a>
          </Button>
          <Button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="shrink-0"
          >
            <MessageSquarePlus className="mr-2 size-4" />
            {showForm ? "Hide Rating Form" : "Rate a Tour or Service"}
          </Button>
        </div>
      </div>

      {/* Service Rating Breakdown Pills */}
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        {[
          { name: "Private Tours & Safaris", score: "4.9" },
          { name: "Airport Transfers", score: "5.0" },
          { name: "Chauffeur Service", score: "4.9" },
          { name: "Self-Drive Car Hire", score: "4.8" },
        ].map((pill) => (
          <div
            key={pill.name}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 text-xs text-muted-foreground"
          >
            <Star className="size-3 fill-accent text-accent" />
            <span className="font-semibold text-foreground">{pill.score}</span>
            <span>{pill.name}</span>
          </div>
        ))}
      </div>

      {/* Expandable Interactive Rating Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-accent/40 bg-surface p-6 shadow-xl sm:p-8"
        >
          <div className="flex flex-col justify-between gap-2 border-b border-border pb-4 sm:flex-row sm:items-center">
            <div>
              <h4 className="font-display text-heading-md uppercase text-foreground">
                Share Your Rating &amp; Experience
              </h4>
              <p className="text-body-sm text-muted-foreground">
                Rate any tour, safari, airport transfer, chauffeur or car hire experience with Lavish Travels &amp; Tours.
              </p>
            </div>
          </div>

          {submittedSuccess ? (
            <div className="my-8 flex flex-col items-center justify-center gap-3 py-6 text-center">
              <CheckCircle2 className="size-12 text-accent" />
              <h5 className="font-display text-heading-md uppercase text-foreground">
                Thank You for Your Rating!
              </h5>
              <p className="text-body-sm text-muted-foreground">
                Your review has been published below.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {/* Interactive Star Selector */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Your Overall Rating *
                </label>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
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
                          className="rounded p-1 transition-transform hover:scale-110 focus:outline-none"
                        >
                          <Star
                            className={
                              active
                                ? "size-7 fill-accent text-accent"
                                : "size-7 text-muted-foreground/40"
                            }
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                    {RATING_LABELS[hoverRating || rating]}
                  </span>
                </div>
              </div>

              {/* Select Tour or Service */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="review-service-select"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground"
                >
                  Which Tour or Service Are You Rating? *
                </label>
                <select
                  id="review-service-select"
                  value={serviceOrTour}
                  onChange={(e) => setServiceOrTour(e.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3.5 text-sm text-foreground focus:border-accent focus:outline-none"
                >
                  {["Our Services", "Cape Town & Winelands Tours", "Garden Route & Safari Packages"].map(
                    (groupName) => (
                      <optgroup key={groupName} label={groupName}>
                        {RATEABLE_ITEMS.filter((item) => item.group === groupName).map((item) => (
                          <option key={item.label} value={item.label}>
                            {item.label}
                          </option>
                        ))}
                      </optgroup>
                    ),
                  )}
                </select>
              </div>

              {/* Visitor Name */}
              <div>
                <label
                  htmlFor="review-author"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground"
                >
                  Your Name *
                </label>
                <input
                  id="review-author"
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none"
                />
              </div>

              {/* Visitor Country */}
              <div>
                <label
                  htmlFor="review-country"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground"
                >
                  Your Country / City *
                </label>
                <input
                  id="review-country"
                  type="text"
                  required
                  placeholder="e.g. United Kingdom, USA, South Africa"
                  value={authorCountry}
                  onChange={(e) => setAuthorCountry(e.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none"
                />
              </div>

              {/* Review Headline */}
              <div>
                <label
                  htmlFor="review-title"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground"
                >
                  Review Headline *
                </label>
                <input
                  id="review-title"
                  type="text"
                  required
                  placeholder="e.g. Unforgettable Garden Route & Cape Point tour"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none"
                />
              </div>

              {/* Traveller Type */}
              <div>
                <label
                  htmlFor="review-traveller-type"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground"
                >
                  Travelled As
                </label>
                <select
                  id="review-traveller-type"
                  value={travellerType}
                  onChange={(e) => setTravellerType(e.target.value as TravellerType)}
                  className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3.5 text-sm text-foreground focus:border-accent focus:outline-none"
                >
                  <option value="couple">Couple</option>
                  <option value="family">Family</option>
                  <option value="solo">Solo Traveller</option>
                  <option value="group">Group of Friends</option>
                  <option value="business">Business / Corporate</option>
                </select>
              </div>

              {/* Review Comment */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="review-body"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground"
                >
                  Your Experience *
                </label>
                <textarea
                  id="review-body"
                  rows={4}
                  required
                  placeholder="Tell future guests about your driver-guide, vehicle comfort, punctuality, and favourite stops..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="mt-2 w-full rounded-md border border-border bg-background p-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none"
                />
              </div>

              {error && (
                <div className="sm:col-span-2 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2.5 text-xs text-foreground">
                  {error}
                </div>
              )}

              <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Submitting Rating…
                    </>
                  ) : (
                    "Submit Rating"
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Reviews Grid */}
      {reviews.length > 0 && (
        <ul className="mt-8 grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <li key={review.id}>
              <Card className="h-full">
                <CardBody className="flex h-full flex-col gap-3.5">
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

                  <footer className="border-t border-border pt-3.5">
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

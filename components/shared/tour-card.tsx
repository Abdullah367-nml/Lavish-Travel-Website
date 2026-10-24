import Link from "next/link";
import { Clock, Users, MapPin, ArrowRight } from "lucide-react";
import type { TourPackage } from "@/lib/types";
import { Card, CardBody, CardMeta, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrandImage } from "@/components/shared/brand-image";
import { formatCategory, formatDuration } from "@/lib/format";

/**
 * Luxury Tour Card — International standard.
 * Focuses on photography, itinerary value, and a clean "View Itinerary" flow.
 */
export function TourCard({
  tour,
  priority = false,
  showFeaturedBadge = true,
}: {
  tour: TourPackage;
  priority?: boolean;
  showFeaturedBadge?: boolean;
}) {
  const href = `/tours/${tour.destinationSlug}/${tour.slug}`;

  return (
    <Card interactive className="group flex h-full flex-col overflow-hidden">
      <Link href={href} className="flex flex-1 flex-col outline-none">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <BrandImage
            src={tour.gallery[0]}
            alt={tour.title}
            fill
            width={640}
            height={400}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div aria-hidden className="scrim-bottom absolute inset-x-0 bottom-0 h-2/3" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Badge variant="default">{formatCategory(tour.category)}</Badge>
            {showFeaturedBadge && tour.isFeatured && (
              <Badge variant="accent">Featured</Badge>
            )}
          </div>

          <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent border border-accent/30 backdrop-blur-md shadow-md">
            Price on Request
          </span>
        </div>

        <CardBody className="flex flex-1 flex-col pb-4">
          <CardTitle className="text-heading-sm transition-colors group-hover:text-accent">
            {tour.title}
          </CardTitle>

          <p className="mt-3 flex-1 text-body-sm leading-relaxed text-muted-foreground line-clamp-2">
            {tour.summary}
          </p>

          <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4">
            <div className="flex items-center gap-1.5">
              <Clock aria-hidden className="size-3.5 text-accent" />
              <dt className="sr-only">Duration</dt>
              <dd>
                <CardMeta>{formatDuration(tour.durationDays)}</CardMeta>
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Users aria-hidden className="size-3.5 text-accent" />
              <dt className="sr-only">Maximum group size</dt>
              <dd>
                <CardMeta>Max {tour.groupMax}</CardMeta>
              </dd>
            </div>
            {tour.departsFrom[0] && (
              <div className="flex items-center gap-1.5">
                <MapPin aria-hidden className="size-3.5 text-accent" />
                <dt className="sr-only">Departs from</dt>
                <dd>
                  <CardMeta>{tour.departsFrom[0]}</CardMeta>
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent group-hover:underline">
              View Itinerary
            </span>
            <div className="flex size-7 items-center justify-center rounded-full bg-surface-raised text-accent transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-accent group-hover:text-black">
              <ArrowRight aria-hidden className="size-3.5" />
            </div>
          </div>
        </CardBody>
      </Link>
    </Card>
  );
}

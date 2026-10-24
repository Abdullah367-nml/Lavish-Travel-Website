import Link from "next/link";
import { Users, Briefcase, ArrowRight } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { Card, CardBody, CardMeta, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrandImage } from "@/components/shared/brand-image";
import { formatVehicleClass } from "@/lib/format";

/**
 * Luxury Vehicle Card — International Standard.
 * Presents vehicle specs, driver options, and clean navigation to full vehicle profile.
 */
export function VehicleCard({
  vehicle,
  priority = false,
}: {
  vehicle: Vehicle;
  priority?: boolean;
}) {
  const selfDriveAvailable = vehicle.selfDriveRateZar > 0;

  return (
    <Card interactive className="group flex h-full flex-col overflow-hidden">
      <Link
        href={`/car-hire/vehicle/${vehicle.slug}`}
        className="flex h-full flex-col outline-none"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <BrandImage
            src={vehicle.image}
            alt={vehicle.name}
            fill
            width={640}
            height={400}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div aria-hidden className="scrim-bottom absolute inset-x-0 bottom-0 h-1/2" />
          <Badge variant="default" className="absolute left-4 top-4">
            {formatVehicleClass(vehicle.class)}
          </Badge>
        </div>

        <CardBody className="flex flex-1 flex-col">
          <CardTitle className="text-heading-sm transition-colors group-hover:text-accent">
            {vehicle.name}
          </CardTitle>
          <CardMeta className="mt-2">{vehicle.model}</CardMeta>

          <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <div className="flex items-center gap-1.5">
              <Users aria-hidden className="size-3.5 text-accent" />
              <dt className="sr-only">Seats</dt>
              <dd>
                <CardMeta>{vehicle.seats} seats</CardMeta>
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase aria-hidden className="size-3.5 text-accent" />
              <dt className="sr-only">Luggage</dt>
              <dd>
                <CardMeta>{vehicle.luggage} bags</CardMeta>
              </dd>
            </div>
          </dl>

          <div className="mt-auto grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div>
              <CardMeta>With driver</CardMeta>
              <p className="mt-1 font-display text-heading-sm uppercase text-accent">
                Rate on Request
              </p>
            </div>
            <div>
              <CardMeta>Self-drive</CardMeta>
              <p className="mt-1 font-display text-heading-sm uppercase text-accent">
                {selfDriveAvailable ? (
                  "Rate on Request"
                ) : (
                  <span className="text-body-sm normal-case tracking-normal text-muted-foreground">
                    Driver only
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent group-hover:underline">
              View Vehicle &amp; Specs
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

// =============================================================================
// NEW FILE. Save this as: app/admin/tours/[id]/edit/page.tsx
// (create the "[id]/edit" folders inside app/admin/tours/ — note the square
//  brackets are part of the literal folder name, Next.js dynamic route syntax)
// =============================================================================
import { notFound } from "next/navigation";
import { getAdminAttractionOptions, getAdminDestinations, getAdminTourById } from "@/lib/admin";
import { TourForm } from "../../tour-form";

export const dynamic = "force-dynamic";

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [tour, destinations, attractionOptions] = await Promise.all([
    getAdminTourById(id),
    getAdminDestinations(),
    getAdminAttractionOptions(),
  ]);

  if (!tour) notFound();

  return (
    <div>
      <h1 className="font-display text-display-sm uppercase text-foreground">Edit Tour</h1>
      <p className="mt-2 text-body-sm text-muted-foreground">{tour.name}</p>

      <div className="mt-8">
        <TourForm
          mode="edit"
          tourId={tour.id}
          initial={tour}
          destinations={destinations}
          attractionOptions={attractionOptions}
        />
      </div>
    </div>
  );
}

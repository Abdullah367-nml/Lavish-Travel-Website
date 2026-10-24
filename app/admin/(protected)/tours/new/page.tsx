// =============================================================================
// NEW FILE. Save this as: app/admin/tours/new/page.tsx
// (create the "new" folder inside app/admin/tours/)
// =============================================================================
import { getAdminAttractionOptions, getAdminDestinations } from "@/lib/admin";
import { TourForm } from "../tour-form";

export const dynamic = "force-dynamic";

export default async function NewTourPage() {
  const [destinations, attractionOptions] = await Promise.all([
    getAdminDestinations(),
    getAdminAttractionOptions(),
  ]);

  return (
    <div>
      <h1 className="font-display text-display-sm uppercase text-foreground">New Tour</h1>
      <p className="mt-2 text-body-sm text-muted-foreground">
        It will not appear on the public site until status is set to Published.
      </p>

      <div className="mt-8">
        <TourForm mode="create" destinations={destinations} attractionOptions={attractionOptions} />
      </div>
    </div>
  );
}

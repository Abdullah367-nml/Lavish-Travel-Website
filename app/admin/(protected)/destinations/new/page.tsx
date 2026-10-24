// =============================================================================
// NEW FILE. Save this as: app/admin/(protected)/destinations/new/page.tsx
// =============================================================================
import { getAdminDestinations } from "@/lib/admin";
import { DestinationForm } from "../destination-form";

export const dynamic = "force-dynamic";

export default async function NewDestinationPage() {
  const destinations = await getAdminDestinations();

  return (
    <div>
      <h1 className="font-display text-display-sm uppercase text-foreground">New Destination</h1>
      <p className="mt-2 text-body-sm text-muted-foreground">
        It will not appear on the public site until status is set to Published.
      </p>

      <div className="mt-8">
        <DestinationForm mode="create" destinations={destinations} />
      </div>
    </div>
  );
}
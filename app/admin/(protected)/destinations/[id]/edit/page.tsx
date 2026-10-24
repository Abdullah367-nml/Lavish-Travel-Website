// =============================================================================
// NEW FILE. Save this as: app/admin/(protected)/destinations/[id]/edit/page.tsx
// (create literal folders named "[id]" then "edit" inside
//  app/admin/(protected)/destinations/ — you already have an empty "[id]"
//  folder there; put an "edit" folder inside it, then this file inside that)
// =============================================================================
import { notFound } from "next/navigation";
import { getAdminDestinationById, getAdminDestinations } from "@/lib/admin";
import { DestinationForm } from "../../destination-form";

export const dynamic = "force-dynamic";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [destination, allDestinations] = await Promise.all([
    getAdminDestinationById(id),
    getAdminDestinations(),
  ]);

  if (!destination) notFound();

  // A destination can't be its own parent — drop it from its own picker
  // rather than relying only on the server action's runtime check.
  const destinations = allDestinations.filter((d) => d.id !== id);

  return (
    <div>
      <h1 className="font-display text-display-sm uppercase text-foreground">Edit Destination</h1>
      <p className="mt-2 text-body-sm text-muted-foreground">{destination.name}</p>

      <div className="mt-8">
        <DestinationForm
          mode="edit"
          destinationId={destination.id}
          initial={destination}
          destinations={destinations}
        />
      </div>
    </div>
  );
}
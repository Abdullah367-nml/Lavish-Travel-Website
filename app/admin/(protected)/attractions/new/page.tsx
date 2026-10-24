import { getAdminDestinations } from "@/lib/admin";
import { AttractionForm } from "../attraction-form";

export const dynamic = "force-dynamic";

export default async function NewAttractionPage() {
  const destinations = await getAdminDestinations();

  return (
    <div>
      <h1 className="font-display text-display-sm uppercase text-foreground">
        New Attraction
      </h1>
      <p className="mt-2 text-body-sm text-muted-foreground">
        Add a tourist attraction or point of interest to a South African destination.
      </p>

      <div className="mt-8">
        <AttractionForm
          mode="create"
          destinations={destinations.map((d) => ({ id: d.id, name: d.name }))}
        />
      </div>
    </div>
  );
}

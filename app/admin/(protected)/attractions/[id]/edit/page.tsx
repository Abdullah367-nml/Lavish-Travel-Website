import { notFound } from "next/navigation";
import { getAdminAttractionById, getAdminDestinations } from "@/lib/admin";
import { AttractionForm } from "../../attraction-form";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditAttractionPage({ params }: Props) {
  const { id } = await params;
  const [attraction, destinations] = await Promise.all([
    getAdminAttractionById(id),
    getAdminDestinations(),
  ]);

  if (!attraction) notFound();

  return (
    <div>
      <h1 className="font-display text-display-sm uppercase text-foreground">
        Edit Attraction: {attraction.name}
      </h1>
      <p className="mt-2 text-body-sm text-muted-foreground">
        Update details, destination association, or visitor information.
      </p>

      <div className="mt-8">
        <AttractionForm
          mode="edit"
          attraction={attraction}
          destinations={destinations.map((d) => ({ id: d.id, name: d.name }))}
        />
      </div>
    </div>
  );
}

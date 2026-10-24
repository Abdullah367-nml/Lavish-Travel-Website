// =============================================================================
// NEW FILE. Save this as: app/admin/(protected)/destinations/destination-form.tsx
// =============================================================================
"use client";

import { useActionState, useId } from "react";
import Link from "next/link";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { saveDestinationAction, type DestinationFormState } from "./actions";
import type { AdminDestination, AdminDestinationDetail } from "@/lib/admin";

type DestinationFormProps = {
  mode: "create" | "edit";
  destinationId?: string;
  initial?: AdminDestinationDetail;
  /** Candidate parents. The caller excludes the record itself when editing. */
  destinations: AdminDestination[];
};

const initialState: DestinationFormState = {};

export function DestinationForm({
  mode,
  destinationId,
  initial,
  destinations,
}: DestinationFormProps) {
  const formId = useId();
  const boundAction = saveDestinationAction.bind(null, destinationId ?? null);
  const [state, formAction, pending] = useActionState(boundAction, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-10">
      {state.error && (
        <p
          role="alert"
          className="rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-body-sm text-destructive"
        >
          {state.error}
        </p>
      )}

      {/* --- basics -------------------------------------------------------- */}
      <section className="space-y-5">
        <h2 className="text-caption font-medium uppercase tracking-[0.16em] text-accent">
          Basics
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" htmlFor={`${formId}-name`} required error={errors.name}>
            <Input id={`${formId}-name`} name="name" defaultValue={initial?.name} required />
          </Field>
          <Field
            label="Slug"
            htmlFor={`${formId}-slug`}
            required
            error={errors.slug}
            hint="Used in the URL: /destinations/{slug}. Lowercase, hyphens only."
          >
            <Input id={`${formId}-slug`} name="slug" defaultValue={initial?.slug} required />
          </Field>
          <Field label="Area type" htmlFor={`${formId}-areaType`} required>
            <Select
              id={`${formId}-areaType`}
              name="areaType"
              defaultValue={initial?.areaType ?? "destination"}
              required
            >
              <option value="destination">Destination</option>
              <option value="area">Area</option>
              <option value="town">Town</option>
              <option value="wine_area">Wine area</option>
              <option value="coastal_town">Coastal town</option>
              <option value="nature">Nature</option>
            </Select>
          </Field>
          <Field label="Status" htmlFor={`${formId}-status`} required>
            <Select
              id={`${formId}-status`}
              name="status"
              defaultValue={initial?.status ?? "draft"}
              required
            >
              <option value="draft">Draft (hidden from the public site)</option>
              <option value="published">Published (live)</option>
              <option value="archived">Archived (removed, not deleted)</option>
            </Select>
          </Field>
          <Field
            label="Parent destination"
            htmlFor={`${formId}-parentId`}
            hint="Leave blank for a top-level destination. Set this to nest an area inside a city — e.g. Camps Bay under Cape Town."
          >
            <Select id={`${formId}-parentId`} name="parentId" defaultValue={initial?.parentId ?? ""}>
              <option value="">No parent (top-level)</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Region"
            htmlFor={`${formId}-region`}
            hint="Groups destinations on the listing page, e.g. 'Western Cape'."
          >
            <Input id={`${formId}-region`} name="region" defaultValue={initial?.region ?? ""} />
          </Field>
          <Field label="Province" htmlFor={`${formId}-province`}>
            <Input id={`${formId}-province`} name="province" defaultValue={initial?.province ?? ""} />
          </Field>
          <Field label="Country" htmlFor={`${formId}-country`} required>
            <Input
              id={`${formId}-country`}
              name="country"
              defaultValue={initial?.country ?? "South Africa"}
              required
            />
          </Field>
          <Field
            label="Sort order"
            htmlFor={`${formId}-sortOrder`}
            hint="Lower numbers show first on the destinations listing."
          >
            <Input
              id={`${formId}-sortOrder`}
              name="sortOrder"
              type="number"
              min={0}
              step={1}
              defaultValue={initial?.sortOrder ?? 0}
            />
          </Field>
        </div>
      </section>

      {/* --- location ---------------------------------------------------------- */}
      <section className="space-y-5">
        <h2 className="text-caption font-medium uppercase tracking-[0.16em] text-accent">
          Location
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Latitude" htmlFor={`${formId}-lat`}>
            <Input
              id={`${formId}-lat`}
              name="lat"
              type="number"
              step="any"
              defaultValue={initial?.lat ?? ""}
            />
          </Field>
          <Field label="Longitude" htmlFor={`${formId}-lng`}>
            <Input
              id={`${formId}-lng`}
              name="lng"
              type="number"
              step="any"
              defaultValue={initial?.lng ?? ""}
            />
          </Field>
          <Field label="Best months" htmlFor={`${formId}-bestMonths`} hint="e.g. 'October to April'">
            <Input id={`${formId}-bestMonths`} name="bestMonths" defaultValue={initial?.bestMonths ?? ""} />
          </Field>
          <Field label="Suggested time" htmlFor={`${formId}-suggestedTime`} hint="e.g. 'Half day'">
            <Input
              id={`${formId}-suggestedTime`}
              name="suggestedTime"
              defaultValue={initial?.suggestedTime ?? ""}
            />
          </Field>
        </div>
      </section>

      {/* --- copy ------------------------------------------------------------ */}
      <section className="space-y-5">
        <h2 className="text-caption font-medium uppercase tracking-[0.16em] text-accent">
          Copy
        </h2>
        <Field
          label="Intro (short)"
          htmlFor={`${formId}-description`}
          required
          error={errors.description}
          hint="The lead paragraph shown on cards and listings."
        >
          <Textarea
            id={`${formId}-description`}
            name="description"
            defaultValue={initial?.description}
            required
          />
        </Field>
        <Field
          label="Body"
          htmlFor={`${formId}-body`}
          hint="One paragraph per line — becomes the long-form copy on the destination page."
        >
          <Textarea
            id={`${formId}-body`}
            name="body"
            defaultValue={initial?.body.join("\n") ?? ""}
            className="min-h-[160px]"
          />
        </Field>
        <Field
          label="Best for"
          htmlFor={`${formId}-bestFor`}
          hint="One tag per line, e.g. 'Couples', 'History', 'Wine'."
        >
          <Textarea id={`${formId}-bestFor`} name="bestFor" defaultValue={initial?.bestFor.join("\n") ?? ""} />
        </Field>
        <Field
          label="Image path"
          htmlFor={`${formId}-image`}
          hint="Path under public/images/... — see lib/image-manifest.ts. A path with no matching file renders as the usual gradient placeholder."
        >
          <Input id={`${formId}-image`} name="image" defaultValue={initial?.image ?? ""} />
        </Field>
      </section>

      {/* --- seo ------------------------------------------------------------------- */}
      <section className="space-y-5">
        <h2 className="text-caption font-medium uppercase tracking-[0.16em] text-accent">SEO</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="SEO title"
            htmlFor={`${formId}-seoTitle`}
            hint="Falls back to the name if left blank."
          >
            <Input id={`${formId}-seoTitle`} name="seoTitle" defaultValue={initial?.seoTitle ?? ""} />
          </Field>
          <Field
            label="SEO description"
            htmlFor={`${formId}-seoDescription`}
            hint="Falls back to the intro if left blank."
          >
            <Textarea
              id={`${formId}-seoDescription`}
              name="seoDescription"
              defaultValue={initial?.seoDescription ?? ""}
            />
          </Field>
        </div>
      </section>

      {/* --- submit ------------------------------------------------------------------ */}
      <div className="flex items-center gap-4 border-t border-border pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : mode === "create" ? "Create destination" : "Save changes"}
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/destinations">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
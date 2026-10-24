// =============================================================================
// REPLACE THE WHOLE FILE: app/admin/tours/tour-form.tsx
//
// What changed from before:
//  - Empty starter rows (itinerary Day 1, or any FAQ row you never touched)
//    are now silently dropped instead of blocking submission.
//  - A row you DID start filling in, but left half-done, now stops the
//    submit client-side with a specific message ("Day 2 is missing a
//    description") instead of round-tripping to the server for a generic
//    error.
//  - The server-side fallback message (actions.ts) is more specific too,
//    in case JavaScript is off or something slips through.
// =============================================================================
"use client";

import { useActionState, useId, useState } from "react";
import Link from "next/link";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { saveTourAction, type TourFormState } from "./actions";
import type { AdminAttractionOption, AdminTourDetail } from "@/lib/admin";

type ItineraryDay = { day: number; title: string; description: string };
type Faq = { question: string; answer: string };

type TourFormProps = {
  mode: "create" | "edit";
  tourId?: string;
  initial?: AdminTourDetail;
  destinations: { id: string; name: string }[];
  attractionOptions: AdminAttractionOption[];
};

const initialState: TourFormState = {};

export function TourForm({
  mode,
  tourId,
  initial,
  destinations,
  attractionOptions,
}: TourFormProps) {
  const formId = useId();
  const boundAction = saveTourAction.bind(null, tourId ?? null);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    initial?.itinerary.length ? initial.itinerary : [{ day: 1, title: "", description: "" }],
  );
  const [faqs, setFaqs] = useState<Faq[]>(initial?.faqs ?? []);
  const [selectedAttractions, setSelectedAttractions] = useState<Set<string>>(
    new Set(initial?.attractionIds ?? []),
  );
  const [clientError, setClientError] = useState<string | null>(null);

  // Rows the admin never touched (both fields still blank) are dropped
  // automatically rather than treated as an error — this is what makes the
  // default empty "Day 1" row harmless if you don't fill it in.
  const effectiveItinerary = itinerary.filter(
    (day) => day.title.trim() !== "" || day.description.trim() !== "",
  );
  const effectiveFaqs = faqs.filter(
    (f) => f.question.trim() !== "" || f.answer.trim() !== "",
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setClientError(null);

    const incompleteDayIndex = effectiveItinerary.findIndex(
      (day) => !day.title.trim() || !day.description.trim(),
    );
    if (incompleteDayIndex !== -1) {
      e.preventDefault();
      const day = effectiveItinerary[incompleteDayIndex];
      setClientError(
        `Itinerary "Day ${day.day || incompleteDayIndex + 1}" is missing its ${
          !day.title.trim() ? "title" : "description"
        }. Fill it in, or click Remove on that row.`,
      );
      return;
    }

    const incompleteFaqIndex = effectiveFaqs.findIndex(
      (f) => !f.question.trim() || !f.answer.trim(),
    );
    if (incompleteFaqIndex !== -1) {
      e.preventDefault();
      const faq = effectiveFaqs[incompleteFaqIndex];
      setClientError(
        `FAQ ${incompleteFaqIndex + 1} is missing its ${
          !faq.question.trim() ? "question" : "answer"
        }. Fill it in, or click Remove on that row.`,
      );
      return;
    }
  }

  function updateItinerary(index: number, key: keyof ItineraryDay, value: string) {
    setItinerary((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [key]: key === "day" ? Number(value) || 0 : value } : row,
      ),
    );
  }

  function addItineraryDay() {
    setItinerary((prev) => [
      ...prev,
      { day: prev.length + 1, title: "", description: "" },
    ]);
  }

  function removeItineraryDay(index: number) {
    setItinerary((prev) => prev.filter((_, i) => i !== index));
  }

  function updateFaq(index: number, key: keyof Faq, value: string) {
    setFaqs((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  function addFaq() {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  }

  function removeFaq(index: number) {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleAttraction(id: string) {
    setSelectedAttractions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const groupedAttractions = attractionOptions.reduce<Record<string, AdminAttractionOption[]>>(
    (acc, a) => {
      (acc[a.destinationName] ??= []).push(a);
      return acc;
    },
    {},
  );

  const displayError = clientError ?? state.error;

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-10">
      {displayError && (
        <p
          role="alert"
          className="rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-body-sm text-destructive"
        >
          {displayError}
        </p>
      )}

      {/* --- basics -------------------------------------------------------- */}
      <section className="space-y-5">
        <h2 className="text-caption font-medium uppercase tracking-[0.16em] text-accent">
          Basics
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Tour name" htmlFor={`${formId}-name`} required error={state.fieldErrors?.name}>
            <Input
              id={`${formId}-name`}
              name="name"
              defaultValue={initial?.name}
              aria-invalid={Boolean(state.fieldErrors?.name)}
              required
            />
          </Field>
          <Field
            label="Slug"
            htmlFor={`${formId}-slug`}
            required
            error={state.fieldErrors?.slug}
            hint="Used in the URL: /tours/{destination}/{slug}. Lowercase, hyphens only."
          >
            <Input
              id={`${formId}-slug`}
              name="slug"
              defaultValue={initial?.slug}
              aria-invalid={Boolean(state.fieldErrors?.slug)}
              required
            />
          </Field>
          <Field
            label="Destination"
            htmlFor={`${formId}-destination`}
            required
            error={state.fieldErrors?.destinationId}
          >
            <Select
              id={`${formId}-destination`}
              name="destinationId"
              defaultValue={initial?.destinationId ?? ""}
              required
            >
              <option value="" disabled>
                Choose a destination
              </option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Category" htmlFor={`${formId}-category`} required error={state.fieldErrors?.category}>
            <Select
              id={`${formId}-category`}
              name="category"
              defaultValue={initial?.category ?? "day_tour"}
              required
            >
              <option value="day_tour">Day tour</option>
              <option value="multi_day">Multi-day</option>
              <option value="safari">Safari</option>
              <option value="wine">Wine</option>
              <option value="cultural">Cultural</option>
              <option value="adventure">Adventure</option>
              <option value="cross_border">Cross-border</option>
            </Select>
          </Field>
          <Field label="Difficulty" htmlFor={`${formId}-difficulty`} required>
            <Select
              id={`${formId}-difficulty`}
              name="difficulty"
              defaultValue={initial?.difficulty ?? "easy"}
              required
            >
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
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
              <option value="published">Published (live and bookable)</option>
              <option value="archived">Archived (removed, not deleted)</option>
            </Select>
          </Field>
        </div>
        <label className="flex items-center gap-3 text-body-sm text-foreground">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={initial?.isFeatured}
            className="size-5 rounded-sm border border-border accent-[var(--accent)]"
          />
          Feature this tour on the homepage
        </label>
      </section>

      {/* --- copy ------------------------------------------------------------ */}
      <section className="space-y-5">
        <h2 className="text-caption font-medium uppercase tracking-[0.16em] text-accent">
          Copy
        </h2>
        <Field label="Summary" htmlFor={`${formId}-summary`} required error={state.fieldErrors?.summary}>
          <Textarea
            id={`${formId}-summary`}
            name="summary"
            defaultValue={initial?.summary}
            required
          />
        </Field>
        <Field
          label="Full description"
          htmlFor={`${formId}-description`}
          hint="Optional — longer body copy for the tour detail page."
        >
          <Textarea
            id={`${formId}-description`}
            name="description"
            defaultValue={initial?.description ?? ""}
            className="min-h-[160px]"
          />
        </Field>
      </section>

      {/* --- pricing & capacity ------------------------------------------------ */}
      <section className="space-y-5">
        <h2 className="text-caption font-medium uppercase tracking-[0.16em] text-accent">
          Pricing &amp; capacity
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field
            label="Adult price (ZAR)"
            htmlFor={`${formId}-priceAdult`}
            required
            error={state.fieldErrors?.priceAdultZar}
          >
            <Input
              id={`${formId}-priceAdult`}
              name="priceAdultZar"
              type="number"
              min={0}
              step={1}
              defaultValue={initial?.priceAdultZar ?? 0}
              required
            />
          </Field>
          <Field
            label="Child price (ZAR)"
            htmlFor={`${formId}-priceChild`}
            hint="0 if the tour does not take children."
            error={state.fieldErrors?.priceChildZar}
          >
            <Input
              id={`${formId}-priceChild`}
              name="priceChildZar"
              type="number"
              min={0}
              step={1}
              defaultValue={initial?.priceChildZar ?? 0}
            />
          </Field>
          <Field
            label="Duration (days)"
            htmlFor={`${formId}-duration`}
            required
            error={state.fieldErrors?.durationDays}
          >
            <Input
              id={`${formId}-duration`}
              name="durationDays"
              type="number"
              min={1}
              max={60}
              step={1}
              defaultValue={initial?.durationDays ?? 1}
              required
            />
          </Field>
          <Field label="Capacity" htmlFor={`${formId}-capacity`} required error={state.fieldErrors?.capacity}>
            <Input
              id={`${formId}-capacity`}
              name="capacity"
              type="number"
              min={1}
              max={500}
              step={1}
              defaultValue={initial?.capacity ?? 12}
              required
            />
          </Field>
        </div>
        <p className="text-caption leading-relaxed text-muted-foreground">
          ⚠ This is the price customers are charged. create_booking() reads it
          server-side at the moment of booking — changing it here only affects
          bookings made after you save.
        </p>
      </section>

      {/* --- itinerary --------------------------------------------------------- */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-caption font-medium uppercase tracking-[0.16em] text-accent">
            Itinerary
          </h2>
          <Button type="button" variant="outline" size="sm" onClick={addItineraryDay}>
            + Add day
          </Button>
        </div>
        <div className="space-y-4">
          {itinerary.map((day, index) => (
            <div
              key={index}
              className="rounded-sm border border-border bg-surface p-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 shrink-0">
                  <Field label="Day" htmlFor={`${formId}-day-${index}-num`}>
                    <Input
                      id={`${formId}-day-${index}-num`}
                      type="number"
                      min={1}
                      value={day.day}
                      onChange={(e) => updateItinerary(index, "day", e.target.value)}
                    />
                  </Field>
                </div>
                <div className="flex-1">
                  <Field label="Title" htmlFor={`${formId}-day-${index}-title`}>
                    <Input
                      id={`${formId}-day-${index}-title`}
                      value={day.title}
                      onChange={(e) => updateItinerary(index, "title", e.target.value)}
                    />
                  </Field>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-7"
                  onClick={() => removeItineraryDay(index)}
                >
                  Remove
                </Button>
              </div>
              <div className="mt-3">
                <Field label="Description" htmlFor={`${formId}-day-${index}-desc`}>
                  <Textarea
                    id={`${formId}-day-${index}-desc`}
                    value={day.description}
                    onChange={(e) => updateItinerary(index, "description", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          ))}
          {itinerary.length === 0 && (
            <p className="text-body-sm text-muted-foreground">No days yet — add one above.</p>
          )}
        </div>
        <input type="hidden" name="itinerary" value={JSON.stringify(effectiveItinerary)} />
      </section>

      {/* --- lists (inclusions / exclusions / packing / images) ------------------ */}
      <section className="space-y-5">
        <h2 className="text-caption font-medium uppercase tracking-[0.16em] text-accent">
          Lists
        </h2>
        <p className="text-caption text-muted-foreground">One item per line.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Inclusions" htmlFor={`${formId}-inclusions`}>
            <Textarea
              id={`${formId}-inclusions`}
              name="inclusions"
              defaultValue={initial?.inclusions.join("\n") ?? ""}
            />
          </Field>
          <Field label="Exclusions" htmlFor={`${formId}-exclusions`}>
            <Textarea
              id={`${formId}-exclusions`}
              name="exclusions"
              defaultValue={initial?.exclusions.join("\n") ?? ""}
            />
          </Field>
          <Field label="What to pack" htmlFor={`${formId}-whatToPack`}>
            <Textarea
              id={`${formId}-whatToPack`}
              name="whatToPack"
              defaultValue={initial?.whatToPack.join("\n") ?? ""}
            />
          </Field>
          <Field
            label="Image paths"
            htmlFor={`${formId}-images`}
            hint="Paths under public/images/... — see lib/image-manifest.ts. A path with no matching file renders as the usual gradient placeholder."
          >
            <Textarea
              id={`${formId}-images`}
              name="images"
              defaultValue={initial?.images.join("\n") ?? ""}
            />
          </Field>
        </div>
        <Field
          label="Pickup info"
          htmlFor={`${formId}-pickupInfo`}
          hint="Optional — shown on the booking flow."
        >
          <Textarea
            id={`${formId}-pickupInfo`}
            name="pickupInfo"
            defaultValue={initial?.pickupInfo ?? ""}
          />
        </Field>
      </section>

      {/* --- faqs -------------------------------------------------------------- */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-caption font-medium uppercase tracking-[0.16em] text-accent">
            FAQs
          </h2>
          <Button type="button" variant="outline" size="sm" onClick={addFaq}>
            + Add question
          </Button>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-sm border border-border bg-surface p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-3">
                  <Field label="Question" htmlFor={`${formId}-faq-${index}-q`}>
                    <Input
                      id={`${formId}-faq-${index}-q`}
                      value={faq.question}
                      onChange={(e) => updateFaq(index, "question", e.target.value)}
                    />
                  </Field>
                  <Field label="Answer" htmlFor={`${formId}-faq-${index}-a`}>
                    <Textarea
                      id={`${formId}-faq-${index}-a`}
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, "answer", e.target.value)}
                    />
                  </Field>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFaq(index)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        <input type="hidden" name="faqs" value={JSON.stringify(effectiveFaqs)} />
      </section>

      {/* --- attractions --------------------------------------------------------- */}
      <section className="space-y-5">
        <h2 className="text-caption font-medium uppercase tracking-[0.16em] text-accent">
          Included attractions
        </h2>
        <div className="space-y-6">
          {Object.entries(groupedAttractions).map(([destinationName, options]) => (
            <fieldset key={destinationName}>
              <legend className="mb-2 text-caption font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {destinationName}
              </legend>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-2.5 text-body-sm text-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAttractions.has(option.id)}
                      onChange={() => toggleAttraction(option.id)}
                      className="size-5 rounded-sm border border-border accent-[var(--accent)]"
                    />
                    {option.name}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          {attractionOptions.length === 0 && (
            <p className="text-body-sm text-muted-foreground">No attractions exist yet.</p>
          )}
        </div>
        <input
          type="hidden"
          name="attractionIds"
          value={Array.from(selectedAttractions).join(",")}
        />
      </section>

      {/* --- seo ------------------------------------------------------------------- */}
      <section className="space-y-5">
        <h2 className="text-caption font-medium uppercase tracking-[0.16em] text-accent">SEO</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="SEO title"
            htmlFor={`${formId}-seoTitle`}
            hint="Falls back to the tour name if left blank."
          >
            <Input id={`${formId}-seoTitle`} name="seoTitle" defaultValue={initial?.seoTitle ?? ""} />
          </Field>
          <Field
            label="SEO description"
            htmlFor={`${formId}-seoDescription`}
            hint="Falls back to the summary if left blank."
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
          {pending ? "Saving…" : mode === "create" ? "Create tour" : "Save changes"}
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/tours">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
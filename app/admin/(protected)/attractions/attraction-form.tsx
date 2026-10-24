"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { saveAttractionAction } from "./actions";
import type { AdminAttractionItem } from "@/lib/admin";

type DestinationOption = {
  id: string;
  name: string;
};

export function AttractionForm({
  mode,
  attraction,
  destinations,
}: {
  mode: "create" | "edit";
  attraction?: AdminAttractionItem;
  destinations: DestinationOption[];
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(attraction?.name ?? "");
  const [slug, setSlug] = useState(attraction?.slug ?? "");

  function handleNameChange(val: string) {
    setName(val);
    if (mode === "create") {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      );
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await saveAttractionAction(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-6">
      {attraction && <input type="hidden" name="id" value={attraction.id} />}

      {error && (
        <div className="rounded-md border border-danger/40 bg-danger/10 p-4 text-body-sm text-danger">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
            Destination *
          </label>
          <select
            name="destinationId"
            required
            defaultValue={attraction?.destinationId ?? ""}
            className="mt-2 w-full rounded-sm border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-accent focus:outline-none"
          >
            <option value="">Select destination...</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
            Status *
          </label>
          <select
            name="status"
            required
            defaultValue={attraction?.status ?? "published"}
            className="mt-2 w-full rounded-sm border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-accent focus:outline-none"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
            Attraction Name *
          </label>
          <input
            type="text"
            name="name"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Table Mountain Aerial Cableway"
            className="mt-2 w-full rounded-sm border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
            Slug (URL identifier) *
          </label>
          <input
            type="text"
            name="slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="table-mountain-aerial-cableway"
            className="mt-2 w-full rounded-sm border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
          Description *
        </label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={attraction?.description ?? ""}
          placeholder="Detailed description of the attraction for tourists..."
          className="mt-2 w-full rounded-sm border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-accent focus:outline-none"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
            Location / Landmark
          </label>
          <input
            type="text"
            name="location"
            defaultValue={attraction?.location ?? ""}
            placeholder="e.g. Kloof Nek Road, Cape Town"
            className="mt-2 w-full rounded-sm border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
            Sort Order
          </label>
          <input
            type="number"
            name="sortOrder"
            defaultValue={attraction?.sortOrder ?? 0}
            className="mt-2 w-full rounded-sm border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
          Image URL or Path
        </label>
        <input
          type="text"
          name="image"
          defaultValue={attraction?.image ?? ""}
          placeholder="/images/destinations/table-mountain.jpg"
          className="mt-2 w-full rounded-sm border border-border bg-surface px-3 py-2 text-body-sm text-foreground focus:border-accent focus:outline-none"
        />
        <p className="mt-1 text-caption text-muted-foreground">
          Drop files into <code className="text-accent">public/images/</code> or specify an image URL.
        </p>
      </div>

      {attraction?.relatedTours && attraction.relatedTours.length > 0 && (
        <div className="rounded-md border border-border bg-surface/50 p-4">
          <p className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
            Featured in {attraction.relatedTours.length} Tour(s):
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {attraction.relatedTours.map((t) => (
              <li
                key={t.id}
                className="rounded border border-accent/30 bg-accent/10 px-2.5 py-1 text-caption text-accent"
              >
                {t.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-3 border-t border-border pt-6">
        <Button asChild variant="ghost">
          <Link href="/admin/attractions">Cancel</Link>
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : mode === "create"
              ? "Create Attraction"
              : "Update Attraction"}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setDestinationStatus } from "@/app/admin/(protected)/destinations/actions";

/**
 * Publish / hide one destination.
 *
 * Publishing brings its draft attractions with it — a city page with an
 * empty "what to see" section is worse than no page, so where there are no
 * attractions at all the button says so before it is pressed. Hiding
 * leaves attractions as they are, so taking a page down for review does not
 * throw away the review status of everything inside it.
 */
export function DestinationActions({
  id,
  status,
  attractionCount,
  publishedAttractionCount,
}: {
  id: string;
  status: string;
  attractionCount: number;
  publishedAttractionCount: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const draftAttractions = attractionCount - publishedAttractionCount;
  const published = status === "published";

  const run = (next: string) => {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await setDestinationStatus(id, next, true);
      if (result.ok) {
        setMessage(result.message);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {published ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => run("draft")}
          >
            <EyeOff aria-hidden />
            Hide
          </Button>
        ) : (
          <Button type="button" size="sm" disabled={pending} onClick={() => run("published")}>
            <Eye aria-hidden />
            Publish
          </Button>
        )}
        {pending && <Loader2 aria-label="Saving" className="size-4 animate-spin text-accent" />}
      </div>

      {!published && draftAttractions > 0 && (
        <p className="text-caption text-muted-foreground">
          Will also publish {draftAttractions} attraction
          {draftAttractions === 1 ? "" : "s"}
        </p>
      )}
      {!published && attractionCount === 0 && (
        <p className="text-caption text-accent">
          No attractions — page will have an empty section
        </p>
      )}
      {message && <p className="text-caption text-success">{message}</p>}
      {error && (
        <p role="alert" className="text-caption text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

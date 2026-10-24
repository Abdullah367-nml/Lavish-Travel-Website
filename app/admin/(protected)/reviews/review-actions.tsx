"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, EyeOff, Trash2 } from "lucide-react";
import { updateReviewStatusAction, deleteReviewAction } from "./actions";

export function ReviewActions({
  reviewId,
  currentStatus,
}: {
  reviewId: string;
  currentStatus: "pending" | "approved" | "hidden";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleStatus(status: "pending" | "approved" | "hidden") {
    setLoading(true);
    await updateReviewStatusAction(reviewId, status);
    setLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    setLoading(true);
    await deleteReviewAction(reviewId);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {currentStatus !== "approved" && (
        <button
          type="button"
          disabled={loading}
          onClick={() => handleStatus("approved")}
          className="inline-flex items-center gap-1 rounded bg-success/15 px-2 py-0.5 text-body-xs font-medium text-success hover:bg-success/25"
          title="Approve Review"
        >
          <Check className="size-3" />
          Approve
        </button>
      )}

      {currentStatus !== "hidden" && (
        <button
          type="button"
          disabled={loading}
          onClick={() => handleStatus("hidden")}
          className="inline-flex items-center gap-1 rounded bg-muted/20 px-2 py-0.5 text-body-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          title="Hide Review"
        >
          <EyeOff className="size-3" />
          Hide
        </button>
      )}

      <button
        type="button"
        disabled={loading}
        onClick={handleDelete}
        className="rounded p-1 text-muted-foreground hover:bg-danger/20 hover:text-danger"
        title="Delete Review"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

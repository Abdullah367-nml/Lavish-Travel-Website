"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, X, Trash2, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  addTourDateAction,
  updateCapacityAction,
  toggleStatusAction,
  deleteTourDateAction,
} from "./actions";

type TourOption = {
  id: string;
  name: string;
};

export function AddTourDateButton({ tours }: { tours: TourOption[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await addTourDateAction(formData);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)} size="sm">
        <Plus aria-hidden className="mr-1.5 size-4" />
        Add Departure Date
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-md border border-border bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-display text-heading-md uppercase text-foreground">
                New Departure Date
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                  Tour
                </label>
                <select
                  name="tourId"
                  required
                  className="mt-1.5 w-full rounded-sm border border-border bg-background px-3 py-2 text-body-sm text-foreground focus:border-accent focus:outline-none"
                >
                  <option value="">Select a tour...</option>
                  {tours.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                  Departure Date
                </label>
                <input
                  type="date"
                  name="tourDate"
                  required
                  min={new Date().toISOString().slice(0, 10)}
                  className="mt-1.5 w-full rounded-sm border border-border bg-background px-3 py-2 text-body-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                  Capacity (Max Seats)
                </label>
                <input
                  type="number"
                  name="capacity"
                  required
                  min="1"
                  max="100"
                  defaultValue="20"
                  className="mt-1.5 w-full rounded-sm border border-border bg-background px-3 py-2 text-body-sm text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              {error && (
                <div className="rounded-sm border border-danger/40 bg-danger/10 p-2.5 text-caption text-danger">
                  {error}
                </div>
              )}

              <div className="mt-2 flex justify-end gap-2 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={loading}>
                  {loading ? "Adding..." : "Save Departure"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function TourDateRowActions({
  id,
  capacity,
  seatsBooked,
  status,
}: {
  id: string;
  capacity: number;
  seatsBooked: number;
  status: "open" | "closed" | "cancelled";
}) {
  const router = useRouter();
  const [editingCapacity, setEditingCapacity] = useState(false);
  const [capValue, setCapValue] = useState(capacity);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSaveCapacity() {
    setLoading(true);
    setError(null);
    const res = await updateCapacityAction(id, capValue);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setEditingCapacity(false);
      router.refresh();
    }
  }

  async function handleToggleStatus() {
    setLoading(true);
    setError(null);
    const nextStatus = status === "open" ? "closed" : "open";
    const res = await toggleStatusAction(id, nextStatus);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      router.refresh();
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        "Are you sure you want to delete this departure date? This cannot be undone.",
      )
    ) {
      return;
    }
    setLoading(true);
    setError(null);
    const res = await deleteTourDateAction(id);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        {editingCapacity ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={capValue}
              min={seatsBooked}
              max="100"
              onChange={(e) => setCapValue(Number(e.target.value))}
              className="w-16 rounded border border-border bg-background px-1.5 py-0.5 text-xs text-foreground focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSaveCapacity}
              disabled={loading}
              title="Save capacity"
              className="rounded p-1 text-success hover:bg-success/20"
            >
              <Check className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingCapacity(false);
                setCapValue(capacity);
                setError(null);
              }}
              title="Cancel"
              className="rounded p-1 text-muted-foreground hover:bg-surface-elevated"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditingCapacity(true)}
            className="text-body-xs text-muted-foreground underline underline-offset-2 hover:text-accent"
          >
            Edit cap
          </button>
        )}

        <span className="text-border">|</span>

        <button
          type="button"
          onClick={handleToggleStatus}
          disabled={loading}
          className="flex items-center gap-1 text-body-xs text-muted-foreground hover:text-foreground"
          title={status === "open" ? "Close date to bookings" : "Re-open date"}
        >
          {status === "open" ? (
            <>
              <Lock className="size-3" />
              Close
            </>
          ) : (
            <>
              <Unlock className="size-3 text-accent" />
              Reopen
            </>
          )}
        </button>

        {seatsBooked === 0 && (
          <>
            <span className="text-border">|</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              title="Delete departure"
              className="text-body-xs text-muted-foreground hover:text-danger"
            >
              <Trash2 className="size-3" />
            </button>
          </>
        )}
      </div>

      {error && <span className="text-[11px] text-danger">{error}</span>}
    </div>
  );
}

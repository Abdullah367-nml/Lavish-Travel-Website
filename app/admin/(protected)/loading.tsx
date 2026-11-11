import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="animate-fade-in space-y-8" aria-label="Loading admin section">
      {/* Header Skeleton */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-surface-elevated" />
          <div className="h-4 w-72 animate-pulse rounded bg-surface-elevated/70" />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin text-accent" />
          <span>Loading data…</span>
        </div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-md border border-border bg-surface p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 animate-pulse rounded bg-surface-elevated" />
              <div className="size-4 animate-pulse rounded bg-surface-elevated" />
            </div>
            <div className="h-7 w-28 animate-pulse rounded bg-surface-elevated" />
            <div className="h-3 w-32 animate-pulse rounded bg-surface-elevated/60" />
          </div>
        ))}
      </div>

      {/* Table / Content Skeleton */}
      <div className="rounded-md border border-border bg-surface p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="h-4 w-36 animate-pulse rounded bg-surface-elevated" />
          <div className="h-8 w-24 animate-pulse rounded bg-surface-elevated" />
        </div>

        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between gap-4 py-2 border-b border-border/50 last:border-0"
            >
              <div className="h-4 w-1/4 animate-pulse rounded bg-surface-elevated/80" />
              <div className="h-4 w-1/5 animate-pulse rounded bg-surface-elevated/60" />
              <div className="h-4 w-1/6 animate-pulse rounded bg-surface-elevated/60" />
              <div className="h-4 w-16 animate-pulse rounded bg-surface-elevated/80" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

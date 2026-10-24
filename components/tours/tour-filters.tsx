"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { SlidersHorizontal, X, RotateCcw, Loader2 } from "lucide-react";
import { Select, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CATEGORY_OPTIONS,
  DURATION_OPTIONS,
  GROUP_OPTIONS,
} from "@/lib/tour-search";

/**
 * Tour filters. A sidebar on desktop, a bottom-sheet drawer on mobile.
 *
 * The only thing this component does is rewrite the URL. The server
 * component re-renders with the new search params and does the actual
 * filtering, which is what keeps every filtered view a real, shareable,
 * crawlable URL rather than client-side state.
 *
 * `useTransition` gives us the pending state while the server re-renders,
 * so the results area can dim instead of appearing frozen.
 */

type Option = { value: string; label: string };

const FILTER_GROUPS: { key: string; label: string; options: readonly Option[] }[] =
  [
    { key: "category", label: "Type of trip", options: CATEGORY_OPTIONS },
    { key: "duration", label: "Duration", options: DURATION_OPTIONS },
    { key: "group", label: "Group size", options: GROUP_OPTIONS },
  ];

export function TourFilters({
  destinations,
  resultCount,
}: {
  destinations: { slug: string; name: string }[];
  resultCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);

  const activeCount = useMemo(
    () =>
      ["destination", "category", "duration", "group"].filter((k) =>
        searchParams.get(k),
      ).length,
    [searchParams],
  );

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      const query = next.toString();
      startTransition(() => {
        // scroll: false keeps the viewport where it is, so changing a filter
        // does not throw the user back to the top of the page.
        router.push(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router, searchParams],
  );

  const clearAll = useCallback(() => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
    setSheetOpen(false);
  }, [pathname, router]);

  const groups: { key: string; label: string; options: readonly Option[] }[] = [
    {
      key: "destination",
      label: "Destination",
      options: destinations.map((d) => ({ value: d.slug, label: d.name })),
    },
    ...FILTER_GROUPS,
  ];

  const controls = (idPrefix: string) => (
    <div className="flex flex-col gap-5">
      {groups.map((group) => {
        const id = `${idPrefix}-${group.key}`;
        return (
          <div key={group.key} className="flex flex-col gap-2">
            <Label htmlFor={id}>{group.label}</Label>
            <Select
              id={id}
              value={searchParams.get(group.key) ?? ""}
              onChange={(e) => setParam(group.key, e.target.value)}
            >
              <option value="">Any</option>
              {group.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        );
      })}

      {activeCount > 0 && (
        <Button variant="outline" onClick={clearAll} className="mt-1">
          <RotateCcw aria-hidden />
          Clear {activeCount} filter{activeCount === 1 ? "" : "s"}
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* --- Desktop sidebar ------------------------------------------------ */}
      <aside
        aria-label="Filter tours"
        className="hidden lg:block lg:w-64 lg:shrink-0"
      >
        <div className="sticky top-24">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-heading-sm uppercase tracking-wide text-foreground">
              Filter
            </h2>
            {isPending && (
              <Loader2
                aria-label="Updating results"
                className="size-4 animate-spin text-accent"
              />
            )}
          </div>
          <p aria-live="polite" className="mt-1 text-caption text-muted-foreground">
            {resultCount} tour{resultCount === 1 ? "" : "s"}
          </p>
          <div className="mt-6">{controls("desk")}</div>
        </div>
      </aside>

      {/* --- Mobile trigger + bottom sheet --------------------------------- */}
      <div className="lg:hidden">
        <Dialog.Root open={sheetOpen} onOpenChange={setSheetOpen}>
          <div className="flex items-center justify-between gap-4">
            <p aria-live="polite" className="text-body-sm text-muted-foreground">
              {isPending
                ? "Updating…"
                : `${resultCount} tour${resultCount === 1 ? "" : "s"}`}
            </p>
            <Dialog.Trigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal aria-hidden />
                Filters
                {activeCount > 0 && (
                  <Badge variant="accent" className="ml-1">
                    {activeCount}
                  </Badge>
                )}
              </Button>
            </Dialog.Trigger>
          </div>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 data-[state=open]:animate-fade-in" />
            <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-lg border-t border-border bg-surface-elevated p-5 pb-8 data-[state=open]:animate-rise">
              {/* Drag affordance — visual only; the sheet closes via the
                  button, the overlay, or Escape (all handled by Radix). */}
              <div
                aria-hidden
                className="mx-auto mb-5 h-1 w-10 rounded-full bg-border-strong"
              />
              <div className="flex items-center justify-between">
                <Dialog.Title className="font-display text-heading-md uppercase tracking-wide text-foreground">
                  Filter tours
                </Dialog.Title>
                <Dialog.Close asChild>
                  <Button variant="ghost" size="icon" aria-label="Close filters">
                    <X aria-hidden />
                  </Button>
                </Dialog.Close>
              </div>
              <Dialog.Description className="mt-1 text-caption text-muted-foreground">
                {resultCount} tour{resultCount === 1 ? "" : "s"} match
              </Dialog.Description>

              <div className="mt-6">{controls("sheet")}</div>

              <Dialog.Close asChild>
                <Button size="lg" className="mt-6 w-full">
                  Show {resultCount} tour{resultCount === 1 ? "" : "s"}
                </Button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </>
  );
}

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Link-based filter chips.
 *
 * For a single filter dimension this beats a JavaScript control outright:
 * each chip is a real anchor to a real URL, so it is crawlable, shareable,
 * middle-clickable, works with JS disabled, and ships zero kilobytes. The
 * heavier client-side control in `tour-filters.tsx` only earns its weight
 * because tours filter on five dimensions at once.
 */
export function FilterChips({
  options,
  activeValue,
  basePath,
  paramName,
  label,
}: {
  options: { value: string; label: string; count?: number }[];
  activeValue?: string;
  basePath: string;
  paramName: string;
  label: string;
}) {
  const href = (value: string) =>
    value ? `${basePath}?${paramName}=${encodeURIComponent(value)}` : basePath;

  return (
    <nav aria-label={label}>
      <ul className="snap-rail -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {[{ value: "", label: "All" }, ...options].map((option) => {
          const isActive = (activeValue ?? "") === option.value;
          return (
            <li key={option.value || "all"} className="shrink-0">
              <Link
                href={href(option.value)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-[44px] items-center gap-2 rounded-sm border px-4 text-caption font-medium uppercase tracking-[0.14em] transition-colors",
                  isActive
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
                )}
              >
                {option.label}
                {typeof option.count === "number" && (
                  <span className={isActive ? "opacity-70" : "opacity-60"}>
                    {option.count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

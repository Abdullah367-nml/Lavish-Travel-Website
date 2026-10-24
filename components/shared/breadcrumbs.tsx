import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href: string };

/**
 * Breadcrumb UI for every deep page.
 *
 * Section 6 requires the visible trail and the BreadcrumbList structured
 * data to match, so both are generated from the same array — see
 * `lib/structured-data.ts`. Divergence between the two is a common cause
 * of Search Console warnings.
 *
 * The last crumb is the current page and is not a link, marked with
 * aria-current.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex flex-wrap items-center gap-1.5 text-caption text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="text-foreground">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight aria-hidden className="size-3 shrink-0" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

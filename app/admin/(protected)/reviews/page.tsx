import { getAdminReviews } from "@/lib/admin";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { ReviewActions } from "./review-actions";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ status?: string }>;
};

const STATUS_BADGE: Record<
  string,
  { label: string; variant: "accent" | "subtle" | "outline" | "default" }
> = {
  pending: { label: "Pending", variant: "default" },
  approved: { label: "Approved", variant: "subtle" },
  hidden: { label: "Hidden", variant: "outline" },
};

export default async function AdminReviewsPage({ searchParams }: Props) {
  const { status: statusFilter = "all" } = await searchParams;
  const reviews = await getAdminReviews(statusFilter);

  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm uppercase text-foreground">
            Customer Reviews
          </h1>
          <p className="mt-2 text-body-sm text-muted-foreground">
            Moderate tourist reviews and testimonials connected to tours.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-border bg-surface p-4">
          <p className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
            Total Reviews
          </p>
          <p className="mt-2 font-display text-heading-lg text-foreground">
            {reviews.length}
          </p>
        </div>

        <div className="rounded-md border border-border bg-surface p-4">
          <p className="text-caption uppercase tracking-[0.14em] text-accent">
            Pending Moderation
          </p>
          <p className="mt-2 font-display text-heading-lg text-accent">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-md border border-border bg-surface p-4">
          <p className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
            Average Rating
          </p>
          <p className="mt-2 flex items-center gap-1.5 font-display text-heading-lg text-foreground">
            <Star className="size-5 fill-accent text-accent" />
            {avgRating} / 5
          </p>
        </div>
      </div>

      {/* Status filter chips */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
          Status:
        </span>
        {["all", "pending", "approved", "hidden"].map((s) => (
          <a
            key={s}
            href={`/admin/reviews?status=${s}`}
            className={`rounded px-3 py-1 text-caption uppercase tracking-wider transition-colors ${
              statusFilter === s
                ? "bg-accent text-accent-foreground font-medium"
                : "bg-surface border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </a>
        ))}
      </div>

      {/* Reviews Table */}
      <div className="mt-6 overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[780px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface">
              {["Customer", "Tour", "Rating", "Review", "Date", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-3 text-caption font-medium uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-body-sm text-muted-foreground"
                >
                  No customer reviews found under this filter.
                </td>
              </tr>
            ) : (
              reviews.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-border transition-colors hover:bg-surface/50 last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-body-sm text-foreground">
                      {r.authorName}
                    </p>
                    {r.bookingReference && (
                      <p className="text-caption text-muted-foreground">
                        Ref: {r.bookingReference}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-body-sm text-foreground">
                    {r.tourName}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5 text-accent">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${
                            i < r.rating
                              ? "fill-accent text-accent"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-sm">
                    {r.title && (
                      <p className="font-medium text-body-xs text-foreground">
                        {r.title}
                      </p>
                    )}
                    <p className="line-clamp-2 text-caption text-muted-foreground">
                      {r.comment}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-caption text-muted-foreground">
                    {formatDate(r.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_BADGE[r.status]?.variant ?? "default"}>
                      {STATUS_BADGE[r.status]?.label ?? r.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <ReviewActions reviewId={r.id} currentStatus={r.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

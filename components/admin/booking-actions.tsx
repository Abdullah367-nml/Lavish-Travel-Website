"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { Booking } from "@/lib/types";
import { Select } from "@/components/ui/field";
import {
  setBookingStatus,
  setPaymentStatus,
} from "@/app/admin/(protected)/bookings/actions";

/**
 * Inline status controls for one booking row.
 *
 * Native selects again — an admin changing twenty statuses wants keyboard
 * tabbing and type-ahead, both of which a custom dropdown has to reimplement
 * badly.
 *
 * Errors appear next to the row that caused them rather than as a page-level
 * banner, because "cannot reinstate, seats resold" is meaningless unless you
 * can see which booking it refers to.
 */
export function BookingActions({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError(null);
    startTransition(async () => {
      const result = await fn();
      if (!result.ok) setError(result.error ?? "Something went wrong.");
      else router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          aria-label={`Booking status for ${booking.reference}`}
          value={booking.bookingStatus}
          disabled={pending}
          className="min-h-[36px] w-[132px] py-1 text-caption"
          onChange={(e) => run(() => setBookingStatus(booking.id, e.target.value))}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no_show">No show</option>
        </Select>

        <Select
          aria-label={`Payment status for ${booking.reference}`}
          value={booking.paymentStatus ?? "pending"}
          disabled={pending}
          className="min-h-[36px] w-[126px] py-1 text-caption"
          onChange={(e) => run(() => setPaymentStatus(booking.id, e.target.value))}
        >
          <option value="pending">Unpaid</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </Select>

        {pending && (
          <Loader2 aria-label="Saving" className="size-4 animate-spin text-accent" />
        )}
      </div>

      {error && (
        <p role="alert" className="max-w-xs text-caption text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

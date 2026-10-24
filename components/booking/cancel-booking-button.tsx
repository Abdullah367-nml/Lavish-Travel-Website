"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cancelMyBooking } from "@/app/my-bookings/actions";

export function CancelBookingButton({
  bookingId,
  reference,
}: {
  bookingId: string;
  reference: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleCancel() {
    setLoading(true);
    setError(null);
    const res = await cancelMyBooking(bookingId);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setConfirmOpen(false);
      router.refresh();
    }
  }

  if (!confirmOpen) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setConfirmOpen(true)}
        className="text-muted-foreground hover:text-danger"
      >
        Cancel Booking
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-sm border border-danger/40 bg-danger/10 px-3 py-2">
      <span className="text-body-xs text-foreground">
        Cancel {reference}? Seats will be released.
      </span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={handleCancel}
          className="border-danger/50 text-danger hover:bg-danger/20"
        >
          {loading ? "Cancelling..." : "Yes, cancel"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={loading}
          onClick={() => {
            setConfirmOpen(false);
            setError(null);
          }}
        >
          Keep
        </Button>
      </div>
      {error && <span className="w-full text-caption text-danger">{error}</span>}
    </div>
  );
}

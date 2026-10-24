"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, RotateCcw, AlertCircle, Edit3, X, Check } from "lucide-react";
import { updatePaymentStatusAction } from "./actions";

export function PaymentStatusActionMenu({
  paymentId,
  currentStatus,
  transactionId,
}: {
  paymentId: string;
  currentStatus: "pending" | "paid" | "failed" | "refunded";
  transactionId: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editingTx, setEditingTx] = useState(false);
  const [txVal, setTxVal] = useState(transactionId ?? "");

  async function handleStatusChange(
    status: "pending" | "paid" | "failed" | "refunded",
  ) {
    setLoading(true);
    await updatePaymentStatusAction(paymentId, status);
    setLoading(false);
    router.refresh();
  }

  async function handleSaveTx() {
    setLoading(true);
    await updatePaymentStatusAction(paymentId, currentStatus, txVal);
    setLoading(false);
    setEditingTx(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        {currentStatus !== "paid" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleStatusChange("paid")}
            className="inline-flex items-center gap-1 rounded bg-success/15 px-2 py-0.5 text-body-xs font-medium text-success hover:bg-success/25"
            title="Mark as Paid"
          >
            <CheckCircle2 className="size-3" />
            Mark Paid
          </button>
        )}

        {currentStatus === "paid" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleStatusChange("refunded")}
            className="inline-flex items-center gap-1 rounded bg-muted/30 px-2 py-0.5 text-body-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            title="Mark as Refunded"
          >
            <RotateCcw className="size-3" />
            Refund
          </button>
        )}

        {currentStatus === "pending" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleStatusChange("failed")}
            className="inline-flex items-center gap-1 rounded bg-danger/15 px-2 py-0.5 text-body-xs text-danger hover:bg-danger/25"
            title="Mark as Failed"
          >
            <AlertCircle className="size-3" />
            Fail
          </button>
        )}

        {currentStatus !== "pending" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleStatusChange("pending")}
            className="text-body-xs text-muted-foreground hover:underline"
            title="Reset to Pending"
          >
            Set Pending
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-caption text-muted-foreground">
        {editingTx ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={txVal}
              placeholder="Bank/Tx ref"
              onChange={(e) => setTxVal(e.target.value)}
              className="w-28 rounded border border-border bg-background px-1.5 py-0.5 text-xs text-foreground focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSaveTx}
              disabled={loading}
              className="rounded p-0.5 text-success hover:bg-success/20"
            >
              <Check className="size-3" />
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingTx(false);
                setTxVal(transactionId ?? "");
              }}
              className="rounded p-0.5 text-muted-foreground hover:bg-surface-elevated"
            >
              <X className="size-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditingTx(true)}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-accent"
          >
            <Edit3 className="size-2.5" />
            {transactionId ? `Tx: ${transactionId}` : "+ Add Tx Ref"}
          </button>
        )}
      </div>
    </div>
  );
}

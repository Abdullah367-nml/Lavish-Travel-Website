"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteAttractionAction } from "./actions";

export function DeleteAttractionButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setLoading(true);
    const res = await deleteAttractionAction(id);
    setLoading(false);
    if (res?.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      title="Delete attraction"
      className="rounded p-1 text-muted-foreground hover:bg-danger/20 hover:text-danger"
    >
      <Trash2 className="size-4" />
    </button>
  );
}

"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadVoucherButton({ reference }: { reference: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        window.print();
      }}
      className="print:hidden"
    >
      <Printer aria-hidden className="mr-2 size-4" />
      Download Confirmation
    </Button>
  );
}

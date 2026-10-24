import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy",
  description: "Our tiered cancellation and refund schedule, disclosed in full before you pay, in line with the South African Consumer Protection Act.",
  alternates: { canonical: "/cancellation-policy" },
};

export default function Page() {
  return (
    <PageShell
      eyebrow="LEGAL"
      title="Cancellation & Refund Policy"
      intro={"Our cancellation charges on a tiered schedule based on how far ahead you cancel. As required by the Consumer Protection Act, the full schedule is disclosed before you pay, never after."}
      upcoming={[
        "Tiered penalty schedule by notice period, for tours, transfers and vehicle hire",
        "Refund timelines by payment method",
        "No-show and amendment terms",
      ]}
      showCta={false}
    />
  );
}

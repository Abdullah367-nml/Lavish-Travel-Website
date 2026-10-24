import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms governing bookings with Lavish Travels & Tours, including booking confirmation, deposits, liability, insurance and the conduct of tours and transfers.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return (
    <PageShell
      eyebrow="LEGAL"
      title="Terms & Conditions"
      intro={"The terms that govern bookings with Lavish Travels & Tours — how a booking is confirmed, what deposits secure, where liability sits, and what is expected of both sides."}
      upcoming={[
        "Full booking, payment and liability terms",
        "Supplier disclosure required by ECTA section 43: registered name, company registration number, physical address and VAT-inclusive pricing",
      ]}
      showCta={false}
    />
  );
}

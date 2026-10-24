import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Lavish Travels & Tours collects, uses, stores and protects your personal information, and how to exercise your rights under South African law.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return (
    <PageShell
      eyebrow="LEGAL"
      title="Privacy Policy"
      intro={"What personal information we collect, why we need it, how long we keep it, and who we share it with. We collect only what a booking genuinely requires."}
      upcoming={[
        "Named Information Officer with direct contact details",
        "Lawful basis for each category of processing, and named third-party processors",
        "Data-subject request process for access, correction and deletion",
      ]}
      showCta={false}
    />
  );
}

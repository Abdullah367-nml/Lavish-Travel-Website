import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "POPIA Compliance Notice",
  description: "Our compliance with South Africa's Protection of Personal Information Act — consent, data minimisation, in-region data storage, and your rights as a data subject.",
  alternates: { canonical: "/popia" },
};

export default function Page() {
  return (
    <PageShell
      eyebrow="LEGAL"
      title="POPIA Notice"
      intro={"How we comply with South Africa's Protection of Personal Information Act. Consent is always explicit and opt-in, every consent event is logged, and customer data is stored in-region in Cape Town rather than offshore."}
      upcoming={[
        "Consent records with timestamp, IP address and user agent for every consent event",
        "Section 72 basis for any cross-border transfer of personal information",
        "Breach notification procedure to the Information Regulator",
      ]}
      showCta={false}
    />
  );
}

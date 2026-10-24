import { isSupabaseConfigured } from "@/lib/supabase/server";
import { ShieldCheck, Database, Globe, Phone, Mail, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const dbConnected = isSupabaseConfigured();

  return (
    <div>
      <div>
        <h1 className="font-display text-display-sm uppercase text-foreground">
          Platform Settings
        </h1>
        <p className="mt-2 text-body-sm text-muted-foreground">
          System configuration, agency credentials, booking defaults, and compliance controls.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-8 max-w-4xl">
        {/* System & Database Connection */}
        <section className="rounded-md border border-border bg-surface p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <Database className="size-5 text-accent" />
              <h2 className="font-display text-heading-md uppercase text-foreground">
                Database &amp; Engine Status
              </h2>
            </div>
            <Badge variant={dbConnected ? "subtle" : "outline"}>
              {dbConnected ? "Online & Connected" : "Configuration Needed"}
            </Badge>
          </div>

          <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-body-sm">
            <div>
              <dt className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                Database Provider
              </dt>
              <dd className="mt-1 font-medium text-foreground">
                Supabase PostgreSQL (eu-central-1 Frankfurt)
              </dd>
            </div>
            <div>
              <dt className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                Row Level Security (RLS)
              </dt>
              <dd className="mt-1 font-medium text-success">
                Active on all 11 tables
              </dd>
            </div>
            <div>
              <dt className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                Booking Invariant Engine
              </dt>
              <dd className="mt-1 font-medium text-foreground">
                Atomic Postgres Procedure (<code className="text-accent">create_booking</code>)
              </dd>
            </div>
            <div>
              <dt className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                Overbooking Safeguard
              </dt>
              <dd className="mt-1 font-medium text-success">
                Enforced by Row Lock (<code className="text-accent">SELECT FOR UPDATE</code>)
              </dd>
            </div>
          </dl>
        </section>

        {/* Agency Operating Information */}
        <section className="rounded-md border border-border bg-surface p-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Globe className="size-5 text-accent" />
            <h2 className="font-display text-heading-md uppercase text-foreground">
              Agency Information
            </h2>
          </div>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                Agency Name
              </label>
              <p className="mt-1 font-display text-body-md text-foreground">
                Lavish Travels &amp; Tours (Pty) Ltd
              </p>
            </div>

            <div>
              <label className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                Operating Territory
              </label>
              <p className="mt-1 text-body-sm text-foreground">
                Cape Town, Stellenbosch &amp; Western Cape, South Africa
              </p>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-caption uppercase tracking-[0.14em] text-muted-foreground">
                <Phone className="size-3 text-accent" />
                Phone / WhatsApp
              </label>
              <p className="mt-1 text-body-sm text-foreground">
                +27 (0) 21 000 0000 / +27 (0) 70 000 0000
              </p>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-caption uppercase tracking-[0.14em] text-muted-foreground">
                <Mail className="size-3 text-accent" />
                Inquiries &amp; Bookings Email
              </label>
              <p className="mt-1 text-body-sm text-foreground">
                bookings@lavishtravels.co.za
              </p>
            </div>
          </div>
        </section>

        {/* Booking & Currency Defaults */}
        <section className="rounded-md border border-border bg-surface p-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Clock className="size-5 text-accent" />
            <h2 className="font-display text-heading-md uppercase text-foreground">
              Booking Policy &amp; Currency
            </h2>
          </div>

          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            <div>
              <label className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                Base Currency
              </label>
              <p className="mt-1 font-display text-heading-sm text-accent">
                ZAR (South African Rand - R)
              </p>
            </div>

            <div>
              <label className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                Timezone
              </label>
              <p className="mt-1 text-body-sm text-foreground">
                Africa/Johannesburg (SAST, UTC+2)
              </p>
            </div>

            <div>
              <label className="text-caption uppercase tracking-[0.14em] text-muted-foreground">
                Default Tour Capacity
              </label>
              <p className="mt-1 text-body-sm text-foreground">
                20 passengers
              </p>
            </div>
          </div>
        </section>

        {/* Legal & POPIA Compliance */}
        <section className="rounded-md border border-border bg-surface p-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <ShieldCheck className="size-5 text-accent" />
            <h2 className="font-display text-heading-md uppercase text-foreground">
              Data Privacy &amp; POPIA Compliance
            </h2>
          </div>

          <p className="mt-4 text-body-sm leading-relaxed text-muted-foreground">
            South Africa’s Protection of Personal Information Act (POPIA) s.72 requires
            data protection adequacy for cross-border hosting. Our database is provisioned in the
            European Union (Frankfurt) backed by a Data Processing Agreement (DPA) that satisfies
            POPIA regulations. Consent logs and marketing opt-outs are recorded in the
            <code className="text-accent"> consent_records</code> audit ledger.
          </p>
        </section>
      </div>
    </div>
  );
}

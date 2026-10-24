import type { Metadata, Viewport } from "next";
import { fontDisplay, fontSans } from "./fonts";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileActionBar, WhatsAppFab } from "@/components/shared/whatsapp";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lavishtravelstours.co.za";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lavish Travels & Tours | Luxury Travel, Tours & Chauffeur Transfers, South Africa",
    template: "%s | Lavish Travels & Tours",
  },
  description:
    "Luxury airport transfers, chauffeur hire, self-drive car rental, and bespoke tour packages across South Africa. Cape Town, Johannesburg, Durban and beyond.",
  applicationName: "Lavish Travels & Tours",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "Lavish Travels & Tours",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-ZA"
      // globals.css sets `scroll-behavior: smooth` on <html>. This attribute
      // tells Next.js about it so the router can temporarily disable smooth
      // scrolling during route transitions — without it, navigating between
      // pages animates a long scroll instead of landing at the top instantly.
      data-scroll-behavior="smooth"
      className={`${fontDisplay.variable} ${fontSans.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        {/* Bottom padding on mobile so the sticky action bar never covers
            the last of the footer content. */}
        <div aria-hidden className="h-14 md:hidden" />
        <WhatsAppFab />
        <MobileActionBar />
      </body>
    </html>
  );
}

/**
 * Single source of truth for name, address and phone (NAP), plus the legal
 * disclosure fields.
 *
 * Section 6 requires the NAP shown in the footer, the NAP in the
 * TravelAgency structured data, and the NAP on the Google Business Profile
 * to be byte-identical — inconsistent NAP is one of the most common local
 * SEO problems. Keeping one object and rendering it everywhere makes that
 * automatic.
 *
 * Values marked TODO are placeholders that must be replaced with the real
 * registration details before launch. ECTA section 43 requires full
 * supplier disclosure, and TGCSA/SATSA claims must not be published until
 * the certificates are actually held.
 */
export const site = {
  name: "Lavish Travels & Tours",
  legalName: "Lavish Travels & Tours (Pty) Ltd",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lavishtravelstours.co.za",
  description:
    "Luxury airport transfers, chauffeur hire, self-drive car rental and tailored tour packages across South Africa.",

  // --- Contact -------------------------------------------------------------
  telephone: "+27 62 401 5042",
  telephoneHref: "tel:+27624015042",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "27624015042",
  email: "ilavishtravels@gmail.com",

  // --- Address (ECTA s.43 requires a physical address) ---------------------
  // TODO: replace with the registered physical address.
    address: {
    street: "",
    locality: "Johannesburg",
    region: "Gauteng",
    postalCode: "",
    country: "ZA",
  },

  // --- Registration (ECTA s.43) -------------------------------------------
  // TODO: replace before launch. Do not publish invented numbers.
    companyRegistration: "",
  vatNumber: "",

  // --- Accreditation ------------------------------------------------------
  // TODO: only publish these once the certificates are held. Displaying an
  // unearned TGCSA grading or SATSA membership is a compliance issue.
    accreditations: {
    tgcsa: "",
    satsa: "",
    asata: "",
  },

  // --- Operating ----------------------------------------------------------
  openingHours: "Mo-Su 00:00-23:59",
  currency: "ZAR",
  locale: "en-ZA",

  areaServed: [
    "South Africa",
    "Johannesburg",
    "Cape Town",
    "Durban",
    "Pretoria",
    "Zimbabwe",
    "Botswana",
    "Namibia",
    "Mozambique",
  ],

  // TODO: replace with the real profiles, or remove entries that do not exist.
  socials: [] as string[],
} as const;

/** Absolute URL for a site-relative path — required by structured data. */
export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

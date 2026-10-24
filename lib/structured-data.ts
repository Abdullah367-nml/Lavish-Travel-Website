import type {
  BlogPost,
  Destination,
  TourPackage,
  TransferRoute,
  Vehicle,
} from "@/lib/types";
import type { Crumb } from "@/components/shared/breadcrumbs";
import { absoluteUrl, site } from "@/lib/site";

/**
 * JSON-LD builders, one per page type, matching the table in Section 6.
 *
 * All of these return plain objects that get handed to <JsonLd /> inside a
 * Server Component, so the markup ends up in the prerendered HTML.
 */

/** Global: TravelAgency (a LocalBusiness subtype) + Organization. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": absoluteUrl("/#organization"),
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    logo: absoluteUrl("/icon-512.png"),
    image: absoluteUrl("/icon-512.png"),
    telephone: site.telephone,
    email: site.email,
    priceRange: "$$$",
    currenciesAccepted: site.currency,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    openingHours: site.openingHours,
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
    ...(site.socials.length > 0 ? { sameAs: site.socials } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: site.url,
    name: site.name,
    inLanguage: site.locale,
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

/** Every deep page. Mirrors the visible <Breadcrumbs /> exactly. */
export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

/** Listing pages. */
export function itemListJsonLd(
  items: { name: string; url: string }[],
  listName: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.url),
    })),
  };
}

/**
 * Tour detail: TouristTrip, with the itinerary as an ItemList of
 * TouristDestination, plus an Offer and optionally an AggregateRating.
 */
export function tourJsonLd(
  tour: TourPackage,
  aggregate: { ratingValue: number; reviewCount: number } | null,
) {
  const url = absoluteUrl(`/tours/${tour.destinationSlug}/${tour.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.summary,
    url,
    provider: { "@id": absoluteUrl("/#organization") },
    touristType: tour.groupMax > 8 ? "Group" : "Private",
    itinerary: {
      "@type": "ItemList",
      numberOfItems: tour.itinerary.length,
      itemListElement: tour.itinerary.map((day) => ({
        "@type": "ListItem",
        position: day.dayNumber,
        item: {
          "@type": "TouristDestination",
          name: day.title,
          description: day.description,
        },
      })),
    },
    offers: {
      "@type": "Offer",
      ...(tour.priceFromZar > 0 ? { price: tour.priceFromZar } : {}),
      priceCurrency: "ZAR",
      availability: "https://schema.org/InStock",
      url,
      priceValidUntil: `${new Date().getUTCFullYear() + 1}-12-31`,
    },
    ...(aggregate
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: aggregate.ratingValue,
            reviewCount: aggregate.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

/** FAQ blocks, on tour pages and the FAQ page. */
export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** Destination pages. */
export function destinationJsonLd(destination: Destination) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.intro,
    url: absoluteUrl(`/destinations/${destination.slug}`),
    geo: {
      "@type": "GeoCoordinates",
      latitude: destination.lat,
      longitude: destination.lng,
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: destination.province,
      addressCountry: destination.country === "South Africa" ? "ZA" : undefined,
    },
  };
}

/** Vehicle pages: Product + Offer at the per-day rate. */
export function vehicleJsonLd(vehicle: Vehicle) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: vehicle.name,
    description: `${vehicle.make} ${vehicle.model} — ${vehicle.seats} seats, ${vehicle.luggage} bags.`,
    brand: { "@type": "Brand", name: vehicle.make },
    url: absoluteUrl(`/car-hire/vehicle/${vehicle.slug}`),
    offers: {
      "@type": "Offer",
      price: vehicle.chauffeurRateZar,
      priceCurrency: "ZAR",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/car-hire/vehicle/${vehicle.slug}`),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: vehicle.chauffeurRateZar,
        priceCurrency: "ZAR",
        unitText: "per day",
      },
    },
  };
}

/** Transfer route pages: Service + Offer. */
export function transferJsonLd(route: TransferRoute) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Airport transfer",
    name: `${route.origin} to ${route.destination} transfer`,
    description: route.notes,
    provider: { "@id": absoluteUrl("/#organization") },
    areaServed: { "@type": "Place", name: route.destination },
    url: absoluteUrl(`/transfers/${route.slug}`),
    offers: {
      "@type": "Offer",
      price: route.basePriceZar,
      priceCurrency: "ZAR",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/transfers/${route.slug}`),
    },
  };
}

/** Blog posts. */
export function articleJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@id": absoluteUrl("/#organization") },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    url: absoluteUrl(`/blog/${post.slug}`),
    articleSection: post.category,
  };
}

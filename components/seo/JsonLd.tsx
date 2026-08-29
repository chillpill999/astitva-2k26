// ============================================================================
// ASTITVA 2K26 - Schema.org JSON-LD Structured Data Generators
// Path: components/seo/JsonLd.tsx
// ============================================================================

import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://astitva-2k26.vercel.app";

/**
 * Master Festival & Educational Organization Schema
 */
export function MasterFestivalJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollegeOrUniversity",
        "@id": "https://lnjpit.ac.in/#organization",
        name: "Lok Nayak Jai Prakash Institute of Technology",
        alternateName: "LNJPIT Chapra",
        url: "https://lnjpit.ac.in",
        logo: `${baseUrl}/images/astitva-logo-3d.png`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "NH-19, Chhapra",
          addressLocality: "Chapra",
          addressRegion: "Bihar",
          postalCode: "841302",
          addressCountry: "IN",
        },
        sameAs: [
          "https://en.wikipedia.org/wiki/Lok_Nayak_Jai_Prakash_Institute_of_Technology",
          "https://www.facebook.com/lnjpitchapra",
        ],
      },
      {
        "@type": "Festival",
        "@id": `${baseUrl}/#festival`,
        name: "ASTITVA 2K26",
        alternateName: "ASTITVA LNJPIT 2026",
        description:
          "The annual flagship Sports, Cultural, Gaming, and Literary Festival of LNJPIT Chapra scheduled from 4 September 2026 to 8 September 2026.",
        url: baseUrl,
        startDate: "2026-09-04T08:00:00+05:30",
        endDate: "2026-09-08T22:00:00+05:30",
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: "LNJPIT Campus Arena & Main Stage",
          address: {
            "@type": "PostalAddress",
            streetAddress: "NH-19, Chhapra",
            addressLocality: "Chapra",
            addressRegion: "Bihar",
            postalCode: "841302",
            addressCountry: "IN",
          },
        },
        organizer: {
          "@type": "CollegeOrUniversity",
          name: "Lok Nayak Jai Prakash Institute of Technology",
          url: "https://lnjpit.ac.in",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          validFrom: "2026-08-01T00:00:00+05:30",
          url: `${baseUrl}/events`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "ASTITVA 2K26 Portal",
        description: "Official portal for ASTITVA 2K26 LNJPIT Chapra",
        publisher: {
          "@id": "https://lnjpit.ac.in/#organization",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Tournament Specific Event Schema
 */
export function TournamentJsonLd({
  event,
}: {
  event: {
    title: string;
    description: string;
    slug: string;
    venue: string;
    dayNumber: number;
    scheduleStart?: Date | string;
    scheduleEnd?: Date | string;
    category?: { name: string } | null;
  };
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${event.title} - ASTITVA 2K26`,
    description: event.description,
    url: `${baseUrl}/events/${event.slug}`,
    startDate: event.scheduleStart || `2026-09-0${Math.min(8, Math.max(4, 3 + event.dayNumber))}T09:00:00+05:30`,
    endDate: event.scheduleEnd || `2026-09-0${Math.min(8, Math.max(4, 3 + event.dayNumber))}T18:00:00+05:30`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: `${event.venue}, LNJPIT Chapra`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chapra",
        addressRegion: "Bihar",
        addressCountry: "IN",
      },
    },
    superEvent: {
      "@type": "Festival",
      name: "ASTITVA 2K26",
      url: baseUrl,
    },
    organizer: {
      "@type": "Organization",
      name: "LNJPIT ASTITVA Committee",
      url: baseUrl,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/events/${event.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQ Schema for Google Rich Search Accordion Results
 */
export function FaqPageJsonLd({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Breadcrumb Schema for SERP hierarchy display
 */
export function BreadcrumbsJsonLd({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

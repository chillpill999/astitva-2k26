// ============================================================================
// ASTITVA 2K26 - Landing Page & Festival Identity (R1)
// Path: app/page.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import {
  getFestCategories,
  getFestEvents,
  getFestSponsors,
  getFestCommittee,
  getFestFaqs,
  getFestGallery,
  getFestStats,
} from "@/lib/data/fest-data";

import {
  EditorialHero,
  AboutFestSection,
  CategoryPreviewGrid,
  FeaturedTournaments,
  ScheduleTimelineMatrix,
  PrizePoolShowcase,
  SponsorWall,
  OrganizingCommittee,
  GalleryPreview,
  FaqSection,
  CallToActionBanner,
} from "@/components/landing";

export const metadata = {
  title: "ASTITVA 2K26 — Premier Festival Management Platform | LNJPIT Chapra",
  description:
    "Annual Sports, Cultural, Gaming & Literary Mega Fest at Lok Nayak Jai Prakash Institute of Technology (LNJPIT), Chapra (4–8 September 2026). ₹10L+ Prizes across 16 premier tournaments.",
};

export default async function HomePage() {
  // Parallel resilient data fetching with static fallbacks
  const [categories, events, sponsors, committee, faqs, gallery, stats] =
    await Promise.all([
      getFestCategories(),
      getFestEvents(),
      getFestSponsors(),
      getFestCommittee(),
      getFestFaqs(),
      getFestGallery(),
      getFestStats(),
    ]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] overflow-hidden">
      {/* ------------------------------------------------------------------- */}
      {/* 1. EXTETA LUXURY EDITORIAL HERO WITH 3D LOGO & RADIAL CHRONOGRAPH   */}
      {/* ------------------------------------------------------------------- */}
      <EditorialHero />

      {/* ------------------------------------------------------------------- */}
      {/* 2. ABOUT FESTIVAL & LNJPIT HERITAGE                                 */}
      {/* ------------------------------------------------------------------- */}
      <AboutFestSection />

      {/* ------------------------------------------------------------------- */}
      {/* 3. 4-PILLAR CATEGORY PREVIEW GRID                                   */}
      {/* ------------------------------------------------------------------- */}
      <CategoryPreviewGrid categories={categories} />

      {/* ------------------------------------------------------------------- */}
      {/* 4. FEATURED FLAGSHIP TOURNAMENTS                                    */}
      {/* ------------------------------------------------------------------- */}
      <FeaturedTournaments events={events} />

      {/* ------------------------------------------------------------------- */}
      {/* 5. 5-DAY INTERACTIVE SCHEDULE MATRIX                                */}
      {/* ------------------------------------------------------------------- */}
      <ScheduleTimelineMatrix events={events} />

      {/* ------------------------------------------------------------------- */}
      {/* 6. ₹10L+ PRIZE POOL SHOWCASE                                        */}
      {/* ------------------------------------------------------------------- */}
      <PrizePoolShowcase />

      {/* ------------------------------------------------------------------- */}
      {/* 7. TIERED SPONSOR WALL                                              */}
      {/* ------------------------------------------------------------------- */}
      <SponsorWall sponsors={sponsors} />

      {/* ------------------------------------------------------------------- */}
      {/* 8. ORGANIZING COMMITTEE & FACULTY PATRONS                           */}
      {/* ------------------------------------------------------------------- */}
      <OrganizingCommittee committee={committee} />

      {/* ------------------------------------------------------------------- */}
      {/* 9. MULTIMEDIA HIGHLIGHTS GALLERY                                    */}
      {/* ------------------------------------------------------------------- */}
      <GalleryPreview items={gallery} />

      {/* ------------------------------------------------------------------- */}
      {/* 10. FREQUENTLY ASKED QUESTIONS                                      */}
      {/* ------------------------------------------------------------------- */}
      <FaqSection faqs={faqs} />

      {/* ------------------------------------------------------------------- */}
      {/* 11. BOTTOM CALL TO ACTION BANNER                                    */}
      {/* ------------------------------------------------------------------- */}
      <CallToActionBanner />
    </div>
  );
}

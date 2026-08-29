// ============================================================================
// ASTITVA 2K26 - Landing Page (R1)
// Path: app/page.tsx
//
// All content is sourced from the live database. When the database has no
// rows for a section, the corresponding component renders an empty state
// instead of fabricated festival content.
// ============================================================================

import React from "react";
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

export const revalidate = 60;

export const metadata = {
  title: "ASTITVA 2K26 — Annual Fest | LNJPIT Chapra",
  description:
    "Official portal for ASTITVA 2K26, the annual fest of Lok Nayak Jai Prakash Institute of Technology (LNJPIT), Chapra, 4–8 September 2026.",
};

export default async function HomePage() {
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
      <EditorialHero />

      <AboutFestSection
        totalEvents={stats.totalEvents}
        totalCategories={stats.totalCategories}
        totalDays={stats.totalDays}
        totalParticipants={stats.totalParticipants}
        totalPrizePool={stats.totalPrizePool}
      />

      <CategoryPreviewGrid categories={categories} />

      <FeaturedTournaments events={events} />

      <ScheduleTimelineMatrix events={events} />

      <PrizePoolShowcase totalPrizePool={stats.totalPrizePool} />

      <SponsorWall sponsors={sponsors} />

      <OrganizingCommittee committee={committee} />

      <GalleryPreview items={gallery} />

      <FaqSection faqs={faqs} />

      <CallToActionBanner />
    </div>
  );
}

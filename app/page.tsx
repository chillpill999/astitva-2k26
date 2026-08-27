// ============================================================================
// ASTITVA 2K26 - Landing Page & Festival Identity (R1)
// Path: app/page.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Calendar, MapPin, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  HeroShaderCanvas,
  CountdownTimer,
  FestivalStatsStrip,
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
    "Annual Sports, Cultural, Gaming & Literary Mega Fest at Lok Nayak Jai Prakash Institute of Technology (LNJPIT), Chapra (4–8 September 2026). ₹1.5L+ Prizes across 16 premier tournaments.",
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
    <div className="flex flex-col items-center w-full min-h-screen bg-[#030712] text-slate-100 overflow-hidden">
      {/* ------------------------------------------------------------------- */}
      {/* 1. MASTER HERO CONTAINER WITH 3D SHADER CANVAS & COUNTDOWN          */}
      {/* ------------------------------------------------------------------- */}
      <section className="relative w-full min-h-[90vh] py-20 lg:py-28 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center border-b border-white/10 overflow-hidden">
        {/* Three.js / WebGL Dynamic Particle Vortex with 2D Fallback */}
        <HeroShaderCanvas />

        {/* Ambient Subtle Grid Texture */}
        <div className="absolute inset-0 bg-cyber-grid bg-[size:35px_35px] opacity-20 pointer-events-none" />

        <div className="container max-w-5xl mx-auto flex flex-col items-center text-center relative z-10 space-y-8">
          {/* Top Institutional Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 backdrop-blur-md shadow-lg shadow-cyan-500/10">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-semibold tracking-wide text-cyan-300">
              Lok Nayak Jai Prakash Institute of Technology (LNJPIT), Chapra
            </span>
          </div>

          {/* Main Title & Slogan */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase">
              ASTITVA <span className="cyber-gradient-text">2K26</span>
            </h1>
            <p className="text-lg sm:text-2xl font-medium text-slate-300 max-w-3xl mx-auto">
              Where Sports, Talent, Creativity &amp; Entertainment Come Together
            </p>
            <p className="text-sm sm:text-base text-slate-400 flex flex-wrap items-center justify-center gap-2">
              <span className="flex items-center text-cyan-300">
                <Calendar className="mr-1.5 h-4 w-4 text-cyan-400" />
                4 September 2026 – 8 September 2026 (5 Mega Days)
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="flex items-center text-purple-300">
                <MapPin className="mr-1.5 h-4 w-4 text-purple-400" />
                LNJPIT Campus, Chapra
              </span>
            </p>
          </div>

          {/* Live Real-Time Countdown Timer */}
          <CountdownTimer />

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link href="/events">
              <Button variant="neonCyan" size="lg" className="h-13 px-8 text-base font-bold shadow-xl">
                Explore 16 Tournaments <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" size="lg" className="h-13 px-8 text-base font-semibold border-white/20 hover:border-cyan-400">
                <QrCode className="mr-2 h-5 w-5 text-cyan-400" />
                Participant Portal &amp; QR Pass
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* 2. FESTIVAL STATS STRIP                                             */}
      {/* ------------------------------------------------------------------- */}
      <FestivalStatsStrip stats={stats} />

      {/* ------------------------------------------------------------------- */}
      {/* 3. ABOUT FESTIVAL & LNJPIT HERITAGE                                 */}
      {/* ------------------------------------------------------------------- */}
      <AboutFestSection />

      {/* ------------------------------------------------------------------- */}
      {/* 4. 4-PILLAR CATEGORY PREVIEW GRID                                   */}
      {/* ------------------------------------------------------------------- */}
      <CategoryPreviewGrid categories={categories} />

      {/* ------------------------------------------------------------------- */}
      {/* 5. FEATURED FLAGSHIP TOURNAMENTS                                    */}
      {/* ------------------------------------------------------------------- */}
      <FeaturedTournaments events={events} />

      {/* ------------------------------------------------------------------- */}
      {/* 6. 5-DAY INTERACTIVE SCHEDULE MATRIX                                */}
      {/* ------------------------------------------------------------------- */}
      <ScheduleTimelineMatrix events={events} />

      {/* ------------------------------------------------------------------- */}
      {/* 7. ₹1.5L+ PRIZE POOL SHOWCASE                                       */}
      {/* ------------------------------------------------------------------- */}
      <PrizePoolShowcase />

      {/* ------------------------------------------------------------------- */}
      {/* 8. TIERED SPONSOR WALL                                              */}
      {/* ------------------------------------------------------------------- */}
      <SponsorWall sponsors={sponsors} />

      {/* ------------------------------------------------------------------- */}
      {/* 9. ORGANIZING COMMITTEE & FACULTY PATRONS                           */}
      {/* ------------------------------------------------------------------- */}
      <OrganizingCommittee committee={committee} />

      {/* ------------------------------------------------------------------- */}
      {/* 10. MULTIMEDIA HIGHLIGHTS GALLERY                                   */}
      {/* ------------------------------------------------------------------- */}
      <GalleryPreview items={gallery} />

      {/* ------------------------------------------------------------------- */}
      {/* 11. FREQUENTLY ASKED QUESTIONS                                      */}
      {/* ------------------------------------------------------------------- */}
      <FaqSection faqs={faqs} />

      {/* ------------------------------------------------------------------- */}
      {/* 12. BOTTOM CALL TO ACTION BANNER                                    */}
      {/* ------------------------------------------------------------------- */}
      <CallToActionBanner />
    </div>
  );
}

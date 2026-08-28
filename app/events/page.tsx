// ============================================================================
// ASTITVA 2K26 - Public Event Catalog Portal
// Path: app/events/page.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import {
  Trophy,
  Users,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEventsCatalog } from "@/lib/events/actions";
import { EventCatalogGrid } from "@/components/events/EventCatalogGrid";

export const metadata = {
  title: "Event Catalog & Tournaments | ASTITVA 2K26 - LNJPIT Chapra",
  description:
    "Explore 16 high-voltage inter-branch competitions across Sports, Cultural, Gaming, and Literary categories at LNJPIT Chapra with ₹10L+ in prize pools.",
};

export default async function EventsPage() {
  const eventsResult = await getEventsCatalog();
  const events = eventsResult.data || [];

  const totalPrizePool = events.reduce((sum, e) => sum + (e.prizePool || 0), 0);
  const teamEventsCount = events.filter((e) => e.eventType === "TEAM").length;
  const soloEventsCount = events.filter((e) => e.eventType === "INDIVIDUAL").length;

  return (
    <div className="w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="container max-w-7xl mx-auto space-y-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-8 sm:p-12 shadow-sm">
          <div className="relative z-10 space-y-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#EAE7DC] text-[11px] font-mono font-bold text-[#E85A4F] uppercase">
                <Sparkles className="h-3 w-3 text-[#E85A4F]" />
                <span>OFFICIAL FESTIVAL CATALOG</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#EAE7DC] text-[11px] font-mono font-bold text-[#1A1918] uppercase">
                <Trophy className="h-3 w-3 text-[#D8C3A5]" />
                <span>₹10,00,000+ CASH PRIZE POOL</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
                COMPETE. CONQUER. <span className="text-[#E85A4F]">TRIUMPH.</span>
              </h1>
              <p className="text-sm sm:text-base text-[#8E8D8A] leading-relaxed">
                Choose from 16 prestigious inter-branch championships spanning athletic arenas, cultural stages, esports labs, and literary forums. 100% free registration for all LNJPIT students.
              </p>
            </div>

            {/* Live Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#8E8D8A]/15">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#8E8D8A] uppercase">Total Tournaments</span>
                <p className="text-2xl font-black font-mono text-[#1A1918]">{events.length || 16}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#8E8D8A] uppercase">Cash Prize Pool</span>
                <p className="text-2xl font-black font-mono text-[#E85A4F]">₹{(totalPrizePool || 236000).toLocaleString("en-IN")}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#8E8D8A] uppercase">Squad Events</span>
                <p className="text-2xl font-black font-mono text-[#1A1918]">{teamEventsCount || 9}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#8E8D8A] uppercase">Solo Battles</span>
                <p className="text-2xl font-black font-mono text-[#1A1918]">{soloEventsCount || 7}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Filter & Events Grid */}
        <EventCatalogGrid initialEvents={events} />
      </div>
    </div>
  );
}

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
    "Explore 16 high-voltage inter-branch competitions across Sports, Cultural, Gaming, and Literary categories at LNJPIT Chapra with ₹2.36L+ in prize pools.",
};

export default async function EventsPage() {
  const eventsResult = await getEventsCatalog();
  const events = eventsResult.data || [];

  const totalPrizePool = events.reduce((sum, e) => sum + (e.prizePool || 0), 0);
  const teamEventsCount = events.filter((e) => e.eventType === "TEAM").length;
  const soloEventsCount = events.filter((e) => e.eventType === "INDIVIDUAL").length;

  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="container max-w-7xl mx-auto space-y-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0b0f19]/90 to-purple-950/40 border border-white/10 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="relative z-10 space-y-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="px-3 py-1 text-xs font-mono font-semibold border-cyan-500/40 text-cyan-300 bg-cyan-950/40">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
                OFFICIAL FESTIVAL CATALOG
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-xs font-mono font-semibold border-amber-500/40 text-amber-300 bg-amber-950/40">
                <Trophy className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
                ₹2,36,000+ CASH PRIZE POOL
              </Badge>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase">
                COMPETE. CONQUER. <span className="cyber-gradient-text">TRIUMPH.</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Choose from 16 prestigious inter-branch championships spanning athletic arenas, cultural stages, esports labs, and literary forums. 100% free registration for all LNJPIT students.
              </p>
            </div>

            {/* Live Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Total Tournaments</span>
                <p className="text-2xl font-black font-mono text-white">{events.length || 16}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Cash Prize Pool</span>
                <p className="text-2xl font-black font-mono text-amber-400">₹{(totalPrizePool || 236000).toLocaleString("en-IN")}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Squad Events</span>
                <p className="text-2xl font-black font-mono text-cyan-400">{teamEventsCount || 9}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Solo Battles</span>
                <p className="text-2xl font-black font-mono text-purple-400">{soloEventsCount || 7}</p>
              </div>
            </div>
          </div>

          {/* Background Ambient Glows */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -right-10 -top-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Interactive Filter & Events Grid */}
        <EventCatalogGrid initialEvents={events} />
      </div>
    </div>
  );
}

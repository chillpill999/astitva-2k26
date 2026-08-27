"use client";

// ============================================================================
// ASTITVA 2K26 - Flagship Tournaments Showcase Grid
// Path: components/landing/FeaturedTournaments.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  Flame,
  Users,
  MapPin,
  Calendar,
  Coins,
  ArrowRight,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FestEvent } from "@/lib/data/fest-data";

interface FeaturedTournamentsProps {
  events: FestEvent[];
}

export function FeaturedTournaments({ events }: FeaturedTournamentsProps) {
  const featuredEvents = events.filter((e) => e.isFeatured).slice(0, 6);
  const displayEvents = featuredEvents.length > 0 ? featuredEvents : events.slice(0, 6);

  return (
    <section className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#05070f] border-b border-white/10">
      <div className="container max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="outline" className="px-3.5 py-1 text-xs font-mono font-semibold border-amber-500/30 text-amber-400 bg-amber-950/30">
              <Flame className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
              FLAGSHIP COMPETITIONS
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
              FEATURED <span className="cyber-gradient-text">TOURNAMENTS</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              The highest-stakes championships with maximum branch pride, rolling trophies, and verified certificates on the line.
            </p>
          </div>

          <Link href="/events">
            <Button variant="outline" className="border-white/20 hover:border-cyan-400 text-xs font-bold">
              View All 16 Events <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Tournament Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayEvents.map((evt) => {
            const formattedPrize = `₹${evt.prizePool.toLocaleString("en-IN")}`;
            const isTeam = evt.eventType === "TEAM";

            return (
              <div
                key={evt.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-[#0d1224]/90 border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-cyan-500/10 overflow-hidden"
              >
                {/* Banner Thumbnail */}
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  {evt.bannerImage ? (
                    <Image
                      src={evt.bannerImage}
                      alt={evt.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1224] via-transparent to-black/60" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <Badge variant="cyan" className="text-[10px] font-mono font-bold">
                      Day {evt.dayNumber} (Sept {evt.dayNumber + 3})
                    </Badge>
                    <Badge variant="amber" className="text-[10px] font-mono font-bold">
                      {formattedPrize} Pool
                    </Badge>
                  </div>

                  {/* Category Chip */}
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-block text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-semibold px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-white/15 backdrop-blur-md">
                      {evt.category?.name || "Tournament"}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {evt.subtitle || evt.description}
                    </p>
                  </div>

                  {/* Meta Specs Strip */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5 text-[11px] font-mono text-slate-300">
                    <div className="flex items-center space-x-1.5 truncate">
                      <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Users className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <span>{isTeam ? `${evt.minTeamSize}-${evt.maxTeamSize} Players` : "Individual Solo"}</span>
                    </div>
                  </div>

                  {/* Coordinator & Registration CTA */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                        Coordinator
                      </span>
                      <span className="text-xs font-semibold text-slate-300 truncate">
                        {evt.coordinatorName || "Fest Office"}
                      </span>
                    </div>

                    <Link href={`/events/${evt.slug}`}>
                      <Button variant="neonCyan" size="sm" className="text-xs font-bold shrink-0">
                        {isTeam ? "Register Squad" : "Register"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

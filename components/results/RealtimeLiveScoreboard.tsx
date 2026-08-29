"use client";

// ============================================================================
// ASTITVA 2K26 - Realtime Live Scoreboard & Match Ticker
// Path: components/results/RealtimeLiveScoreboard.tsx
// ============================================================================

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Radio,
  Clock,
  MapPin,
  Flame,
  ArrowRight,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useRealtimeLiveScoreboard } from "@/lib/supabase/hooks";

export interface LiveScoreboardItem {
  id: string;
  title: string;
  category: string;
  venue: string;
  dayNumber: number;
  eventType: string;
  status: string;
  subtitle: string | null;
  liveScore?: string | null;
  currentRound?: string | null;
  updatedAt?: string;
}

interface RealtimeLiveScoreboardProps {
  initialEvents: LiveScoreboardItem[];
}

export function RealtimeLiveScoreboard({ initialEvents }: RealtimeLiveScoreboardProps) {
  const events = useRealtimeLiveScoreboard<LiveScoreboardItem>(initialEvents);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const liveEvents = events.filter((e) => e.status === "IN_PROGRESS");
  const displayEvents = liveEvents.length > 0 ? liveEvents : events.slice(0, 6);

  const filtered =
    activeCategory === "ALL"
      ? displayEvents
      : displayEvents.filter((e) =>
          e.category.toLowerCase().includes(activeCategory.toLowerCase())
        );

  return (
    <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#8E8D8A]/20 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[10px] font-mono text-[#E85A4F] uppercase font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E85A4F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E85A4F]"></span>
            </span>
            <span>Realtime Live Match Broadcast</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1A1918] tracking-tight uppercase font-mono flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#E85A4F]" />
            Live Arena Scoreboard
          </h2>
        </div>

        {/* Live sync badge */}
        <div className="flex items-center space-x-2 text-xs font-mono text-[#8E8D8A] self-start sm:self-auto">
          <Radio className="h-3.5 w-3.5 text-[#E85A4F] animate-pulse" />
          <span>Realtime Feed Active</span>
        </div>
      </div>

      {/* Stream Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {["ALL", "SPORTS", "GAMING", "CULTURAL", "LITERARY"].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all uppercase cursor-pointer ${
              activeCategory === cat
                ? "bg-[#1A1918] text-[#EAE7DC]"
                : "bg-[#EAE7DC] text-[#8E8D8A] border border-[#8E8D8A]/25 hover:text-[#1A1918]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scorecards Grid */}
      {filtered.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 text-center font-mono space-y-2">
          <Sparkles className="h-5 w-5 text-[#E85A4F] mx-auto" />
          <p className="text-xs font-bold text-[#1A1918] uppercase">No active matches in this stream</p>
          <p className="text-[11px] text-[#8E8D8A]">
            Scores will update automatically as event coordinators broadcast live points.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const isLive = item.status === "IN_PROGRESS";
            return (
              <div
                key={item.id}
                className={`rounded-2xl p-5 border transition-all space-y-4 shadow-sm relative overflow-hidden ${
                  isLive
                    ? "bg-[#EAE7DC] border-[#E85A4F]/60 shadow-md ring-1 ring-[#E85A4F]/20"
                    : "bg-[#EAE7DC] border-[#8E8D8A]/25 hover:border-[#8E8D8A]/50"
                }`}
              >
                {/* Status Bar */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
                    {item.category}
                  </span>
                  {isLive ? (
                    <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#E85A4F]/10 border border-[#E85A4F]/30 text-[10px] font-mono font-bold text-[#E85A4F] uppercase">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E85A4F] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E85A4F]"></span>
                      </span>
                      <span>LIVE</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-mono text-[#8E8D8A] uppercase font-bold">
                      {item.status.replace(/_/g, " ")}
                    </span>
                  )}
                </div>

                {/* Event Title */}
                <div className="space-y-1">
                  <h3 className="text-sm font-bold font-mono text-[#1A1918] uppercase leading-tight line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#8E8D8A]">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#E85A4F]" /> {item.venue}
                    </span>
                    <span>•</span>
                    <span>Day 0{item.dayNumber}</span>
                  </div>
                </div>

                {/* Live Score Box */}
                <div className="p-3.5 rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/20 space-y-1">
                  <div className="text-[10px] font-mono text-[#8E8D8A] uppercase font-bold flex items-center justify-between">
                    <span>{isLive ? "Current Match Status" : "Summary"}</span>
                    {isLive && <Flame className="h-3 w-3 text-[#E85A4F]" />}
                  </div>
                  <p className="text-xs font-mono font-bold text-[#1A1918] leading-snug">
                    {item.subtitle || "Match scheduled. Awaiting first service/ball."}
                  </p>
                </div>

                {/* Action Link */}
                <div className="pt-1 flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] text-[#8E8D8A] uppercase font-bold">
                    {item.eventType}
                  </span>
                  <Link
                    href={`/events/${item.id}`}
                    className="font-bold text-[#E85A4F] hover:underline flex items-center gap-1"
                  >
                    Match Details <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

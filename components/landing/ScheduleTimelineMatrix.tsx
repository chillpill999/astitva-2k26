"use client";

// ============================================================================
// ASTITVA 2K26 - 5-Day Schedule Matrix & Interactive Timeline
// Path: components/landing/ScheduleTimelineMatrix.tsx
// ============================================================================

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Sparkles,
  ArrowRight,
  Filter,
  Flame,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FestEvent } from "@/lib/data/fest-data";

interface ScheduleMatrixProps {
  events: FestEvent[];
}

const FESTIVAL_DAYS = [
  { day: 1, date: "4 Sept 2026", title: "Inauguration & Kickoff", badge: "Day 1" },
  { day: 2, date: "5 Sept 2026", title: "Stage & Esports War", badge: "Day 2" },
  { day: 3, date: "6 Sept 2026", title: "Semis & Comedy Night", badge: "Day 3" },
  { day: 4, date: "7 Sept 2026", title: "Grand Finals & Ramp", badge: "Day 4" },
  { day: 5, date: "8 Sept 2026", title: "Valedictory & Star Night", badge: "Day 5" },
];

export function ScheduleTimelineMatrix({ events }: ScheduleMatrixProps) {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const dayEvents = events.filter((e) => {
    const matchesDay = e.dayNumber === selectedDay;
    const matchesCategory =
      selectedCategory === "all" || e.category?.slug.toLowerCase() === selectedCategory.toLowerCase();
    return matchesDay && matchesCategory;
  });

  const categories = [
    { label: "All Streams", value: "all" },
    { label: "Sports", value: "sports" },
    { label: "Cultural", value: "cultural" },
    { label: "Gaming", value: "gaming" },
    { label: "Literary", value: "literary" },
  ];

  return (
    <section className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#030712] border-b border-white/10">
      <div className="container max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="outline" className="px-3.5 py-1 text-xs font-mono font-semibold border-cyan-500/30 text-cyan-400 bg-cyan-950/30">
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
              5-DAY FESTIVAL SCHEDULE
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
              TIMELINE &amp; <span className="cyber-gradient-text">FIXTURES</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Explore match times, venue locations, and real-time fixtures across all 5 festival days (4–8 Sept 2026).
            </p>
          </div>

          <Link href="/schedule">
            <Button variant="outline" className="border-white/20 hover:border-cyan-400 text-xs font-bold">
              Full Schedule Matrix <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* 5-Day Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 p-1.5 rounded-2xl bg-[#0d1224]/80 border border-white/10 backdrop-blur-xl">
          {FESTIVAL_DAYS.map((d) => {
            const isSelected = selectedDay === d.day;
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => setSelectedDay(d.day)}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 border border-cyan-400/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-xs font-mono font-bold tracking-wider uppercase opacity-80">
                  {d.badge}
                </span>
                <span className="text-sm sm:text-base font-black tracking-tight mt-0.5">
                  {d.date}
                </span>
                <span className="text-[10px] truncate max-w-full font-medium opacity-75 hidden sm:block">
                  {d.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                selectedCategory === c.value
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Day 5 Special Valedictory Card if Day 5 is selected */}
        {selectedDay === 5 && (
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-950/40 via-blue-950/40 to-slate-900/60 border border-purple-500/30 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
              <Badge variant="amber" className="text-xs font-mono font-bold">
                GRAND VALEDICTORY &amp; STAR NIGHT
              </Badge>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Grand Valedictory, ₹1.5L Prize Distribution &amp; Celebrity DJ Night
            </h3>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Official closing ceremony presided by Principal Dr. Shailendra Kumar, awarding of the Inter-Branch General Championship Trophy, gold &amp; silver medals, HMAC verifiable certificates, followed by a massive open-air musical concert and DJ set.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-cyan-300 pt-2">
              <span className="flex items-center">
                <Clock className="mr-1.5 h-4 w-4" /> 05:00 PM – 10:30 PM IST
              </span>
              <span className="flex items-center">
                <MapPin className="mr-1.5 h-4 w-4" /> Open Air Theatre (OAT Main Stage)
              </span>
              <span className="flex items-center">
                <Trophy className="mr-1.5 h-4 w-4" /> ₹1,50,000+ Distributed
              </span>
            </div>
          </div>
        )}

        {/* Schedule Fixtures Cards */}
        {dayEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {dayEvents.map((evt) => {
              const startTimeStr = new Date(evt.scheduleStart).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });
              const endTimeStr = new Date(evt.scheduleEnd).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <div
                  key={evt.id}
                  className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-[#0d1224]/80 border border-white/10 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-[#141c38]/90"
                >
                  <div className="space-y-3">
                    {/* Header Strip */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-xs font-mono font-bold text-cyan-300">
                          {startTimeStr} – {endTimeStr}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono border-white/15 text-slate-300">
                        {evt.category?.name || "General"}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h4 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                      {evt.title}
                    </h4>

                    {/* Subtitle / Rules hint */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {evt.subtitle || evt.description}
                    </p>
                  </div>

                  {/* Footer Meta & Action */}
                  <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400 truncate">
                      <MapPin className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>

                    <Link href={`/events/${evt.slug}`}>
                      <Button variant="ghost" size="sm" className="text-xs font-bold text-cyan-400 hover:text-white hover:bg-cyan-500/20 px-3">
                        View Rulebook →
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          selectedDay !== 5 && (
            <div className="p-12 text-center rounded-2xl bg-[#0d1224]/50 border border-white/5">
              <p className="text-sm text-slate-400 font-mono">
                No scheduled tournaments match the selected stream filter for Day {selectedDay}.
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}

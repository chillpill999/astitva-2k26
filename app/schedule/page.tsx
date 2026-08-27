"use client";

// ============================================================================
// ASTITVA 2K26 - 5-Day Master Festival Schedule Matrix Portal
// Path: app/schedule/page.tsx
// ============================================================================

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Trophy,
  Sparkles,
  Users,
  Filter,
  ArrowRight,
  Download,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATIC_EVENTS, FestEvent } from "@/lib/data/fest-data";

const FESTIVAL_DAYS = [
  { day: 1, date: "4 Sept 2026", label: "Day 1", title: "Opening Ceremonies & Knockouts", focus: "Inauguration, Cricket, Debate, BGMI" },
  { day: 2, date: "5 Sept 2026", label: "Day 2", title: "Indoor Sports & Stage Battles", focus: "Volleyball, Badminton, Dance, Valorant" },
  { day: 3, date: "6 Sept 2026", label: "Day 3", title: "Quarterfinals & Comedy Gala", focus: "Singing, Comedy, Free Fire, Poetry" },
  { day: 4, date: "7 Sept 2026", label: "Day 4", title: "Grand Finals & Fashion Runway", focus: "Cricket Finals, Glamour & Grace Ramp, Creative Writing" },
  { day: 5, date: "8 Sept 2026", label: "Day 5", title: "Valedictory & Star Night", focus: "General Championship Trophy, Prize Distribution, DJ Concert" },
];

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const events: FestEvent[] = STATIC_EVENTS;

  const filteredEvents = events.filter((evt) => {
    const matchesDay = evt.dayNumber === selectedDay;
    const matchesCategory =
      selectedCategory === "all" ||
      evt.category?.slug.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      searchQuery.trim() === "" ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.coordinatorName && evt.coordinatorName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDay && matchesCategory && matchesSearch;
  });

  const categories = [
    { label: "All Streams", value: "all" },
    { label: "Sports", value: "sports" },
    { label: "Cultural", value: "cultural" },
    { label: "Gaming", value: "gaming" },
    { label: "Literary", value: "literary" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="container max-w-7xl mx-auto space-y-10">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-3xl">
            <Badge variant="outline" className="px-3.5 py-1 text-xs font-mono font-semibold border-cyan-500/30 text-cyan-400 bg-cyan-950/30">
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
              OFFICIAL FESTIVAL TIMETABLE
            </Badge>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase">
              5-DAY <span className="cyber-gradient-text">SCHEDULE MATRIX</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              All 16 canonical tournaments across LNJPIT Chapra campus venues (4–8 September 2026).
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/events">
              <Button variant="outline" className="border-white/20 hover:border-cyan-400 text-xs font-bold">
                View Event Rules
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="neonCyan" className="text-xs font-bold">
                Get QR Pass
              </Button>
            </Link>
          </div>
        </div>

        {/* 5-Day Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-2 rounded-2xl bg-[#0d1224]/90 border border-white/10 shadow-2xl backdrop-blur-xl">
          {FESTIVAL_DAYS.map((d) => {
            const isSelected = selectedDay === d.day;
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => setSelectedDay(d.day)}
                className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25 border border-cyan-400/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Badge variant="outline" className={`text-[10px] font-mono mb-1 ${isSelected ? "border-white/40 text-white" : "border-white/10 text-slate-400"}`}>
                  {d.label}
                </Badge>
                <span className="text-base sm:text-lg font-black tracking-tight">
                  {d.date}
                </span>
                <span className="text-[11px] truncate max-w-full font-medium opacity-80 mt-0.5">
                  {d.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0d1224]/60 border border-white/10">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.value
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tournament or venue..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        {/* Day 5 Special Valedictory Showcase */}
        {selectedDay === 5 && (
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-purple-950/50 via-blue-950/40 to-[#0d1224] border border-purple-500/30 shadow-2xl space-y-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
              <Badge variant="amber" className="text-xs font-mono font-bold">
                GRAND VALEDICTORY &amp; CLOSING CEREMONY
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Grand Valedictory, Championship Rolling Shield &amp; Star Cultural Concert
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-4xl leading-relaxed">
              The grand culmination of ASTITVA 2K26. Hon’ble Principal Dr. Shailendra Kumar awards the coveted Inter-Branch General Championship Shield to the highest-scoring engineering branch. Distribution of ₹1.5L+ cash prizes, medals, HMAC signed certificates, followed by a live star concert and EDM DJ night.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10">
                <span className="text-slate-400 block">Timings</span>
                <span className="text-cyan-300 font-bold text-sm">05:00 PM – 10:30 PM IST</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10">
                <span className="text-slate-400 block">Venue</span>
                <span className="text-purple-300 font-bold text-sm">Open Air Theatre (OAT Main Stage)</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10">
                <span className="text-slate-400 block">Entry Requirement</span>
                <span className="text-emerald-300 font-bold text-sm">Verified Participant Pass / ID</span>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Cards Matrix */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((evt) => {
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
                  className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#0d1224]/90 border border-white/10 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-[#141c38]/90"
                >
                  <div className="space-y-4">
                    {/* Top Time & Category Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-xs font-mono font-bold text-cyan-300">
                          {startTimeStr} – {endTimeStr}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-[10px] font-mono border-white/15 text-slate-300">
                          {evt.category?.name || "General"}
                        </Badge>
                        <Badge variant="amber" className="text-[10px] font-mono font-bold">
                          ₹{evt.prizePool.toLocaleString("en-IN")}
                        </Badge>
                      </div>
                    </div>

                    {/* Event Title */}
                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {evt.subtitle || evt.description}
                      </p>
                    </div>

                    {/* Venue & Capacity specs */}
                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono text-slate-300">
                      <div className="flex items-center space-x-1.5 truncate">
                        <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Users className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                        <span>{evt.eventType === "TEAM" ? `${evt.minTeamSize}-${evt.maxTeamSize} Members` : "Individual Solo"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                        Coordinator
                      </span>
                      <span className="text-xs font-semibold text-slate-300">
                        {evt.coordinatorName || "LNJPIT Desk"}
                      </span>
                    </div>

                    <Link href={`/events/${evt.slug}`}>
                      <Button variant="neonCyan" size="sm" className="text-xs font-bold">
                        {evt.eventType === "TEAM" ? "Register Squad" : "Register Solo"}
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          selectedDay !== 5 && (
            <div className="p-16 text-center rounded-2xl bg-[#0d1224]/50 border border-white/5 space-y-3">
              <p className="text-base text-slate-300 font-bold">
                No fixtures found for Day {selectedDay} matching your criteria.
              </p>
              <p className="text-xs text-slate-500 font-mono">
                Try switching streams or clearing the search query.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

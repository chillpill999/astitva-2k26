"use client";

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
} from "lucide-react";
import { STATIC_EVENTS, FestEvent } from "@/lib/data/fest-data";

const FESTIVAL_DAYS = [
  { day: 1, date: "4 Sept 2026", label: "Day 01", title: "Opening Ceremonies & Knockouts", focus: "Inauguration, Cricket, Debate, BGMI" },
  { day: 2, date: "5 Sept 2026", label: "Day 02", title: "Indoor Sports & Stage Battles", focus: "Volleyball, Badminton, Dance, Free Fire" },
  { day: 3, date: "6 Sept 2026", label: "Day 03", title: "Quarterfinals & Comedy Gala", focus: "Singing, Comedy, Chess, Poetry" },
  { day: 4, date: "7 Sept 2026", label: "Day 04", title: "Grand Finals & Fashion Runway", focus: "Cricket Finals, Glamour Ramp, Creative Writing" },
  { day: 5, date: "8 Sept 2026", label: "Day 05", title: "Valedictory & Star Night", focus: "General Championship Trophy, Prize Distribution, DJ Concert" },
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
    <div className="w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="container max-w-7xl mx-auto space-y-10">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#8E8D8A]/20 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>OFFICIAL FESTIVAL TIMETABLE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              5-DAY <span className="text-[#E85A4F]">SCHEDULE MATRIX</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              All 16 canonical tournaments across LNJPIT Chapra campus venues (4–8 September 2026).
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/events"
              className="px-4 py-2 rounded text-xs font-mono font-bold tracking-wider uppercase border border-[#8E8D8A]/35 text-[#1A1918] bg-[#F6F4EE] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all"
            >
              VIEW EVENT RULES
            </Link>
            <Link
              href="/sign-in"
              className="px-4 py-2 rounded text-xs font-mono font-bold tracking-wider uppercase bg-[#E85A4F] text-white hover:bg-[#C94A40] transition-colors shadow-sm"
            >
              GET QR PASS
            </Link>
          </div>
        </div>

        {/* 5-Day Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-2 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm">
          {FESTIVAL_DAYS.map((d) => {
            const isSelected = selectedDay === d.day;
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => setSelectedDay(d.day)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#E85A4F] text-white shadow-sm border border-[#E85A4F]"
                    : "text-[#8E8D8A] hover:text-[#1A1918] hover:bg-[#EAE7DC]"
                }`}
              >
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-85">
                  {d.label}
                </span>
                <span className="text-sm sm:text-base font-bold tracking-tight mt-0.5">
                  {d.date}
                </span>
                <span className="text-[11px] font-mono opacity-80 mt-1 line-clamp-1">
                  {d.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8D8A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schedule by event name, venue, or coordinator..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] placeholder:text-[#8E8D8A]/70 text-xs font-mono focus:outline-none focus:border-[#E85A4F]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setSelectedCategory(c.value)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                  selectedCategory === c.value
                    ? "bg-[#1A1918] text-[#EAE7DC] font-bold"
                    : "bg-[#EAE7DC] text-[#8E8D8A] border border-[#8E8D8A]/25 hover:text-[#1A1918]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Fixture Cards */}
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25">
              <Calendar className="h-10 w-10 text-[#8E8D8A] mx-auto mb-2" />
              <p className="text-sm font-mono text-[#8E8D8A]">No tournaments match this schedule query.</p>
            </div>
          ) : (
            filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 hover:border-[#E85A4F] transition-all gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] border border-[#8E8D8A]/20 text-[#E85A4F] uppercase">
                      {evt.category?.name}
                    </span>
                    <span className="text-xs font-mono text-[#8E8D8A] flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-[#E85A4F]" />
                      {new Date(evt.scheduleStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(evt.scheduleEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#1A1918]">
                    {evt.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#8E8D8A] font-mono">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-[#E85A4F]" />
                      {evt.venue}
                    </span>
                    {evt.coordinatorName && (
                      <span>Coord: {evt.coordinatorName}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <span className="text-xs font-mono font-bold text-[#E85A4F] uppercase">
                    {evt.eventType === "TEAM" ? "Squad" : "Solo"}
                  </span>
                  <Link
                    href={`/events/${evt.id}`}
                    className="px-4 py-2 rounded text-xs font-mono font-bold tracking-wider uppercase border border-[#8E8D8A]/35 text-[#1A1918] bg-[#EAE7DC] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-colors"
                  >
                    DETAILS →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

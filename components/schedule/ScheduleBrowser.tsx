"use client";

// ============================================================================
// ASTITVA 2K26 - Schedule Browser (day/category/search filters)
// Path: components/schedule/ScheduleBrowser.tsx
// ============================================================================

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, Search, Radio } from "lucide-react";
import { FestEvent } from "@/lib/data/fest-data";
import { useRealtimeSchedule } from "@/lib/supabase/hooks";

interface ScheduleBrowserProps {
  events: FestEvent[];
}

const FESTIVAL_DAYS = [1, 2, 3, 4, 5];

export function ScheduleBrowser({ events: initialEvents }: ScheduleBrowserProps) {
  const events = useRealtimeSchedule(initialEvents);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const availableDays = useMemo(() => {
    const days = new Set<number>();
    for (const e of events) days.add(e.dayNumber);
    return FESTIVAL_DAYS.filter((d) => days.has(d));
  }, [events]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return events.filter((evt) => {
      if (evt.dayNumber !== selectedDay) return false;
      if (
        selectedCategory !== "all" &&
        evt.category?.slug.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }
      if (q === "") return true;
      return (
        evt.title.toLowerCase().includes(q) ||
        evt.venue.toLowerCase().includes(q) ||
        (evt.coordinatorName?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [events, selectedDay, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-5 gap-1.5 sm:gap-3 p-1.5 sm:p-2 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm">
        {FESTIVAL_DAYS.map((d) => {
          const isAvailable = availableDays.includes(d);
          const isSelected = selectedDay === d;
          return (
            <button
              key={d}
              type="button"
              onClick={() => isAvailable && setSelectedDay(d)}
              disabled={!isAvailable}
              className={`flex flex-col items-center justify-center py-2 sm:py-4 px-1 sm:px-3 rounded-xl text-center transition-all ${
                !isAvailable
                  ? "text-[#8E8D8A]/40 cursor-not-allowed bg-transparent"
                  : isSelected
                  ? "bg-[#E85A4F] text-white shadow-sm border border-[#E85A4F] cursor-pointer"
                  : "text-[#8E8D8A] hover:text-[#1A1918] hover:bg-[#EAE7DC] cursor-pointer"
              }`}
            >
              <span className="text-[8px] sm:text-[10px] font-mono font-bold tracking-wider uppercase opacity-85">
                Day 0{d}
              </span>
              <span className="text-xs sm:text-base font-bold tracking-tight mt-0.5 whitespace-nowrap">
                {d + 3} <span className="hidden sm:inline">Sept</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 space-y-4">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8D8A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by event name or venue"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] placeholder:text-[#8E8D8A]/70 text-xs font-mono focus:outline-none focus:border-[#E85A4F]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "All Streams", value: "all" },
              { label: "Sports", value: "sports" },
              { label: "Cultural", value: "cultural" },
              { label: "Gaming", value: "gaming" },
              { label: "Literary", value: "literary" },
            ].map((c) => (
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

          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#EAE7DC] border border-[#8E8D8A]/20 text-[10px] font-mono text-[#8E8D8A]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Schedule Sync</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25">
            <Calendar className="h-10 w-10 text-[#8E8D8A] mx-auto mb-2" />
            <p className="text-sm font-mono text-[#8E8D8A]">
              No events scheduled for this day and filter.
            </p>
          </div>
        ) : (
          filtered.map((evt) => (
            <div
              key={evt.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 hover:border-[#E85A4F] transition-all gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] border border-[#8E8D8A]/20 text-[#E85A4F] uppercase">
                    {evt.category?.name ?? "Event"}
                  </span>
                  <span className="text-xs font-mono text-[#8E8D8A] flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-[#E85A4F]" />
                    {new Date(evt.scheduleStart).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    –{" "}
                    {new Date(evt.scheduleEnd).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1A1918]">{evt.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#8E8D8A] font-mono">
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-[#E85A4F]" />
                    {evt.venue}
                  </span>
                  {evt.coordinatorName && <span>Coord: {evt.coordinatorName}</span>}
                </div>
              </div>
              <div className="flex items-center space-x-3 self-end sm:self-center">
                <span className="text-xs font-mono font-bold text-[#E85A4F] uppercase">
                  {evt.eventType === "TEAM" ? "Team" : "Individual"}
                </span>
                <Link
                  href={`/events/${evt.id}`}
                  className="px-4 py-2 rounded text-xs font-mono font-bold tracking-wider uppercase border border-[#8E8D8A]/35 text-[#1A1918] bg-[#EAE7DC] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-colors"
                >
                  Details →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

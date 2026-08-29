"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight, Filter, CalendarOff } from "lucide-react";
import { FestEvent } from "@/lib/data/fest-data";

interface ScheduleMatrixProps {
  events: FestEvent[];
}

const FESTIVAL_DAYS = [
  { day: 1, date: "4 Sept 2026" },
  { day: 2, date: "5 Sept 2026" },
  { day: 3, date: "6 Sept 2026" },
  { day: 4, date: "7 Sept 2026" },
  { day: 5, date: "8 Sept 2026" },
];

export function ScheduleTimelineMatrix({ events }: ScheduleMatrixProps) {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const dayEvents = events.filter((e) => {
    const matchesDay = e.dayNumber === selectedDay;
    const matchesCategory =
      selectedCategory === "all" ||
      e.category?.slug.toLowerCase() === selectedCategory.toLowerCase();
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
    <section
      id="schedule"
      className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#EAE7DC] text-[#1A1918] border-b border-[#8E8D8A]/20"
    >
      <div className="container max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>Schedule</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              Festival <span className="text-[#E85A4F]">Timeline</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              Browse the 5-day programme (4–8 September 2026). The schedule below reflects events
              added by the organizing committee.
            </p>
          </div>

          <Link href="/schedule">
            <span className="inline-flex items-center text-xs font-mono font-semibold py-2 px-4 rounded border border-[#8E8D8A]/40 text-[#1A1918] bg-[#F6F4EE] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer">
              Full Schedule →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-5 gap-1 sm:gap-3 p-1.5 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 overflow-x-auto">
          {FESTIVAL_DAYS.map((d) => {
            const isSelected = selectedDay === d.day;
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => setSelectedDay(d.day)}
                className={`flex flex-col items-center justify-center py-2 sm:py-3 px-1 sm:px-2 rounded-xl text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#E85A4F] text-white shadow-sm border border-[#E85A4F]"
                    : "text-[#8E8D8A] hover:text-[#1A1918] hover:bg-[#EAE7DC]"
                }`}
              >
                <span className="text-[8px] sm:text-[10px] font-mono font-bold tracking-wider uppercase opacity-85">
                  Day 0{d.day}
                </span>
                <span className="text-xs sm:text-base font-bold tracking-tight mt-0.5 whitespace-nowrap">
                  {d.date.split(" ")[0]} <span className="hidden sm:inline">{d.date.split(" ")[1]}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                selectedCategory === c.value
                  ? "bg-[#1A1918] text-[#EAE7DC] font-semibold"
                  : "bg-[#F6F4EE] text-[#8E8D8A] border border-[#8E8D8A]/25 hover:text-[#1A1918]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {dayEvents.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25">
              <CalendarOff className="h-8 w-8 text-[#8E8D8A] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#1A1918]">No fixtures scheduled for this day</p>
              <p className="text-xs text-[#8E8D8A] mt-1">
                The organizing committee will publish the full programme before registrations open.
              </p>
            </div>
          ) : (
            dayEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 hover:border-[#E85A4F]/60 transition-all gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#EAE7DC] border border-[#8E8D8A]/20 text-[#E85A4F] font-bold uppercase">
                      {event.category?.name ?? "Event"}
                    </span>
                    <span className="text-xs font-mono text-[#8E8D8A] flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(event.scheduleStart).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-[#1A1918]">{event.title}</h4>
                  <p className="text-xs text-[#8E8D8A] flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-[#E85A4F]" />
                    {event.venue}
                  </p>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <Link
                    href={`/events/${event.id}`}
                    className="px-3.5 py-1.5 rounded text-xs font-mono font-medium border border-[#8E8D8A]/35 text-[#1A1918] bg-[#EAE7DC] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-colors"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

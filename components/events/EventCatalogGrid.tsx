"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Trophy,
  Music,
  Gamepad2,
  BookOpen,
  Filter,
  Users,
  User,
  Calendar,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "./EventCard";
import { RegisterSoloModal } from "./RegisterSoloModal";
import { FestEvent } from "@/lib/data/fest-data";

interface EventCatalogGridProps {
  initialEvents: FestEvent[];
}

export function EventCatalogGrid({ initialEvents }: EventCatalogGridProps) {
  const [events] = useState<FestEvent[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState<"ALL" | "INDIVIDUAL" | "TEAM">("ALL");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Modal State
  const [selectedSoloEvent, setSelectedSoloEvent] = useState<FestEvent | null>(null);
  const [isSoloModalOpen, setIsSoloModalOpen] = useState(false);

  const categories = [
    { label: "All Streams", value: "all", count: events.length },
    {
      label: "Sports",
      value: "sports",
      count: events.filter((e) => e.category?.slug === "sports" || e.categoryId === "cat_sports").length,
    },
    {
      label: "Cultural",
      value: "cultural",
      count: events.filter((e) => e.category?.slug === "cultural" || e.categoryId === "cat_cultural").length,
    },
    {
      label: "Gaming",
      value: "gaming",
      count: events.filter((e) => e.category?.slug === "gaming" || e.categoryId === "cat_gaming").length,
    },
    {
      label: "Literary",
      value: "literary",
      count: events.filter((e) => e.category?.slug === "literary" || e.categoryId === "cat_literary").length,
    },
  ];

  const days = [
    { label: "All Days", value: null },
    { label: "Day 1 (Sept 4)", value: 1 },
    { label: "Day 2 (Sept 5)", value: 2 },
    { label: "Day 3 (Sept 6)", value: 3 },
    { label: "Day 4 (Sept 7)", value: 4 },
    { label: "Day 5 (Sept 8)", value: 5 },
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // 1. Category Filter
      if (selectedCategory !== "all") {
        const catMatch =
          event.category?.slug === selectedCategory ||
          event.categoryId === `cat_${selectedCategory}`;
        if (!catMatch) return false;
      }

      // 2. Type Filter
      if (selectedType !== "ALL") {
        if (event.eventType !== selectedType) return false;
      }

      // 3. Day Filter
      if (selectedDay !== null) {
        if (event.dayNumber !== selectedDay) return false;
      }

      // 4. Search Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesVenue = event.venue.toLowerCase().includes(query);
        const matchesDesc = event.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesVenue && !matchesDesc) return false;
      }

      return true;
    });
  }, [events, selectedCategory, selectedType, selectedDay, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls */}
      <div className="p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8D8A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tournament name, rules, or venue (e.g. Cricket, BGMI, Main Stage)..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] placeholder:text-[#8E8D8A]/70 text-xs font-mono focus:outline-none focus:border-[#E85A4F]"
            />
          </div>

          <div className="grid grid-cols-3 gap-1.5 w-full md:w-auto">
            {(["ALL", "INDIVIDUAL", "TEAM"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`py-2.5 px-2 rounded-xl text-center text-xs font-mono font-medium transition-colors ${
                  selectedType === type
                    ? "bg-[#1A1918] text-[#EAE7DC] font-bold shadow-sm"
                    : "bg-[#EAE7DC] text-[#8E8D8A] border border-[#8E8D8A]/30 hover:text-[#1A1918]"
                }`}
              >
                {type === "ALL" ? "All Formats" : type === "INDIVIDUAL" ? "Solo" : "Squad"}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#8E8D8A]/15 overflow-x-auto no-scrollbar scroll-smooth flex-nowrap sm:flex-wrap pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors flex items-center space-x-1.5 shrink-0 ${
                selectedCategory === c.value
                  ? "bg-[#E85A4F] text-white font-bold shadow-sm"
                  : "bg-[#EAE7DC] text-[#8E8D8A] border border-[#8E8D8A]/25 hover:text-[#1A1918]"
              }`}
            >
              <span>{c.label}</span>
              <span className="opacity-75 text-[10px]">({c.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs font-mono text-[#8E8D8A] px-2">
        <span>Showing {filteredEvents.length} tournaments</span>
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedType("ALL");
              setSelectedDay(null);
            }}
            className="text-[#E85A4F] hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Event Cards Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 space-y-3">
          <Trophy className="h-10 w-10 text-[#8E8D8A] mx-auto" />
          <h3 className="text-base font-bold text-[#1A1918]">No tournaments found</h3>
          <p className="text-xs text-[#8E8D8A] max-w-sm mx-auto">
            Try adjusting your search query or filter selections.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onRegisterSolo={(id) => {
                setSelectedSoloEvent(evt);
                setIsSoloModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {selectedSoloEvent && (
        <RegisterSoloModal
          event={selectedSoloEvent}
          isOpen={isSoloModalOpen}
          onClose={() => setIsSoloModalOpen(false)}
        />
      )}
    </div>
  );
}

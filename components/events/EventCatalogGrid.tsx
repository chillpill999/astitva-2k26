"use client";

// ============================================================================
// ASTITVA 2K26 - Interactive Event Catalog Grid Component
// Path: components/events/EventCatalogGrid.tsx
// ============================================================================

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
    { label: "All Streams", value: "all", icon: Trophy, count: events.length },
    {
      label: "Sports",
      value: "sports",
      icon: Trophy,
      count: events.filter((e) => e.category?.slug === "sports" || e.categoryId === "cat_sports").length,
    },
    {
      label: "Cultural",
      value: "cultural",
      icon: Music,
      count: events.filter((e) => e.category?.slug === "cultural" || e.categoryId === "cat_cultural").length,
    },
    {
      label: "Gaming",
      value: "gaming",
      icon: Gamepad2,
      count: events.filter((e) => e.category?.slug === "gaming" || e.categoryId === "cat_gaming").length,
    },
    {
      label: "Literary",
      value: "literary",
      icon: BookOpen,
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

      // 4. Live Text Search (Title, Subtitle, Rules, Venue, Description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = event.title.toLowerCase().includes(query);
        const subMatch = event.subtitle ? event.subtitle.toLowerCase().includes(query) : false;
        const rulesMatch = event.rules ? event.rules.toLowerCase().includes(query) : false;
        const venueMatch = event.venue.toLowerCase().includes(query);
        const descMatch = event.description.toLowerCase().includes(query);

        if (!titleMatch && !subMatch && !rulesMatch && !venueMatch && !descMatch) {
          return false;
        }
      }

      return true;
    });
  }, [events, selectedCategory, selectedType, selectedDay, searchQuery]);

  const handleOpenSoloModal = (eventId: string) => {
    const target = events.find((e) => e.id === eventId);
    if (target) {
      setSelectedSoloEvent(target);
      setIsSoloModalOpen(true);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedType("ALL");
    setSelectedDay(null);
  };

  return (
    <div className="space-y-8">
      {/* Interactive Control Panel */}
      <div className="space-y-6 rounded-2xl bg-[#0b0f19]/90 border border-white/10 p-6 shadow-2xl backdrop-blur-xl">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                      : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-slate-300">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search tournaments, rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-xs bg-slate-900/90 border-white/15 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Secondary Filter Row (Solo/Team + Festival Days) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
          {/* Solo vs Squad Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3 text-cyan-400" /> Format:
            </span>
            <button
              type="button"
              onClick={() => setSelectedType("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedType === "ALL"
                  ? "bg-white/15 text-white border border-white/30"
                  : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              All Formats
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("INDIVIDUAL")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedType === "INDIVIDUAL"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              <User className="h-3 w-3 text-purple-400" />
              Solo Only
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("TEAM")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedType === "TEAM"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              <Users className="h-3 w-3 text-cyan-400" />
              Squads Only
            </button>
          </div>

          {/* Festival Days Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-purple-400" /> Schedule:
            </span>
            {days.map((d) => (
              <button
                key={d.label}
                type="button"
                onClick={() => setSelectedDay(d.value)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                  selectedDay === d.value
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                    : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Status Strip */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-2">
        <span>
          Showing <strong className="text-white">{filteredEvents.length}</strong> of{" "}
          <strong className="text-white">{events.length}</strong> festival events
        </span>
        {(searchQuery || selectedCategory !== "all" || selectedType !== "ALL" || selectedDay !== null) && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            Reset all filters
          </button>
        )}
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegisterSolo={handleOpenSoloModal}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center rounded-2xl bg-[#0b0f19]/50 border border-white/10 space-y-4">
          <div className="h-16 w-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500">
            <Search className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">No tournaments match your filters</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Try adjusting your search query, stream category, or day schedule filters.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="text-xs font-bold border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Solo Registration Modal */}
      <RegisterSoloModal
        event={selectedSoloEvent}
        isOpen={isSoloModalOpen}
        onClose={() => setIsSoloModalOpen(false)}
      />
    </div>
  );
}

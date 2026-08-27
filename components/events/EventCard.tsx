"use client";

// ============================================================================
// ASTITVA 2K26 - Event Glassmorphic Level 2 Card Component
// Path: components/events/EventCard.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  Users,
  User,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FestEvent } from "@/lib/data/fest-data";

interface EventCardProps {
  event: FestEvent;
  onRegisterSolo?: (eventId: string) => void;
  onCreateTeam?: (eventId: string) => void;
}

export function EventCard({ event, onRegisterSolo, onCreateTeam }: EventCardProps) {
  const isTeam = event.eventType === "TEAM";
  const capacityPct = Math.min(
    100,
    Math.round((event.currentRegistrations / (event.maxRegistrations || 1)) * 100)
  );

  const isFull = event.currentRegistrations >= event.maxRegistrations;
  const isFillingFast = capacityPct >= 75 && !isFull;

  // Dynamic category accent colors
  const getCategoryColor = (categorySlug?: string) => {
    switch (categorySlug) {
      case "sports":
        return {
          border: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
          badge: "bg-cyan-950/40 text-cyan-400 border-cyan-500/30",
          glow: "from-cyan-500/20",
        };
      case "cultural":
        return {
          border: "hover:border-purple-500/50 hover:shadow-purple-500/10",
          badge: "bg-purple-950/40 text-purple-400 border-purple-500/30",
          glow: "from-purple-500/20",
        };
      case "gaming":
        return {
          border: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
          badge: "bg-emerald-950/40 text-emerald-400 border-emerald-500/30",
          glow: "from-emerald-500/20",
        };
      case "literary":
        return {
          border: "hover:border-amber-500/50 hover:shadow-amber-500/10",
          badge: "bg-amber-950/40 text-amber-400 border-amber-500/30",
          glow: "from-amber-500/20",
        };
      default:
        return {
          border: "hover:border-blue-500/50 hover:shadow-blue-500/10",
          badge: "bg-blue-950/40 text-blue-400 border-blue-500/30",
          glow: "from-blue-500/20",
        };
    }
  };

  const colors = getCategoryColor(event.category?.slug);

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#0b0f19]/80 border border-white/10 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 ${colors.border}`}
    >
      {/* Top Banner Image with Gradient Overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        {event.bannerImage ? (
          <Image
            src={event.bannerImage}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center">
            <Trophy className="h-12 w-12 text-slate-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/60 to-transparent" />

        {/* Category & Format Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge variant="outline" className={`text-[10px] font-mono font-bold uppercase ${colors.badge}`}>
            {event.category?.name || "Competition"}
          </Badge>
          <Badge
            variant="outline"
            className="bg-black/50 text-slate-300 border-white/15 text-[10px] font-mono font-bold"
          >
            {isTeam ? (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3 text-cyan-400" />
                Squad ({event.minTeamSize === event.maxTeamSize ? event.minTeamSize : `${event.minTeamSize}-${event.maxTeamSize}`})
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3 text-purple-400" />
                Solo
              </span>
            )}
          </Badge>
        </div>

        {/* Prize Pool Tag */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-black shadow-lg">
            <Trophy className="mr-1 h-3 w-3 text-amber-400" />
            ₹{event.prizePool.toLocaleString("en-IN")} POOL
          </Badge>
        </div>

        {/* Day Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900/90 text-slate-300 border border-white/10">
            <Calendar className="mr-1 h-3 w-3 text-cyan-400" />
            Day {event.dayNumber} (Sept {3 + event.dayNumber})
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-white/5 text-xs text-slate-400 font-mono">
          {/* Venue & Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate max-w-[200px]">
              <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span className="truncate text-slate-300">{event.venue}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {new Date(event.scheduleStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          {/* Registration Capacity Gauge */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Capacity Slots</span>
              <span
                className={`font-bold ${
                  isFull
                    ? "text-red-400"
                    : isFillingFast
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                {event.currentRegistrations} / {event.maxRegistrations} {isTeam ? "Squads" : "Entries"}
                {isFull ? " (FULL)" : isFillingFast ? " (FILLING FAST)" : ""}
              </span>
            </div>
            <Progress
              value={capacityPct}
              className={`h-1.5 bg-white/5 ${
                isFull
                  ? "[&>div]:bg-red-500"
                  : isFillingFast
                  ? "[&>div]:bg-amber-500"
                  : "[&>div]:bg-emerald-400"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-white/[0.02] border-t border-white/10 flex items-center gap-2">
        <Link href={`/events/${event.slug || event.id}`} className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs font-bold border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white"
          >
            Explore Rules
          </Button>
        </Link>

        {isTeam ? (
          <Link href={`/teams/create?event=${event.id}`} className="flex-1">
            <Button
              size="sm"
              disabled={isFull}
              className="w-full text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20"
            >
              Create Squad
            </Button>
          </Link>
        ) : (
          <Button
            size="sm"
            disabled={isFull}
            onClick={() => onRegisterSolo && onRegisterSolo(event.id)}
            className="flex-1 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20"
          >
            Register Solo
          </Button>
        )}
      </div>
    </div>
  );
}

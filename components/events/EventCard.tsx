"use client";

import React from "react";
import Link from "next/link";
import {
  Trophy,
  Users,
  User,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
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

  // Status mapping
  const statusLabel = isFull
    ? "FULL"
    : event.status === "REGISTRATION_CLOSED"
    ? "CLOSED"
    : "OPEN";

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm hover:border-[#E85A4F] transition-all duration-300 hover:-translate-y-1.5">
      {/* Top Banner with Clean Geometric Header */}
      <div className="relative h-28 w-full bg-[#EAE7DC] border-b border-[#8E8D8A]/20 p-4 flex flex-col justify-between overflow-hidden">
        {/* Category & Status Badges */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
            {event.category?.name || "Event"}
          </span>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
              isFull
                ? "bg-stone-600 text-white"
                : "bg-[#E85A4F] text-white"
            }`}
          >
            {statusLabel === "OPEN" ? "REGISTRATION OPEN" : statusLabel}
          </span>
        </div>

        {/* Team Size / Format Indicators */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F6F4EE] border border-[#8E8D8A]/25 text-[#1A1918]">
            {isTeam ? (
              <>
                <Users className="w-3 h-3 mr-1 text-[#E85A4F]" />
                Squad ({event.minTeamSize}-{event.maxTeamSize} Players)
              </>
            ) : (
              <>
                <User className="w-3 h-3 mr-1 text-[#E85A4F]" />
                Solo Individual
              </>
            )}
          </span>
          {isFillingFast ? (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E85A4F] text-white animate-pulse">
              Filling Fast
            </span>
          ) : (
            <Trophy className="h-4 w-4 text-[#8E8D8A]/60" />
          )}
        </div>
      </div>

      {/* Main Details */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Date and Venue */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8E8D8A]">
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-[#E85A4F]" />
              Day 0{event.dayNumber} (Sept {event.dayNumber + 3})
            </span>
            <span className="flex items-center truncate max-w-[130px]" title={event.venue}>
              <MapPin className="w-3.5 h-3.5 mr-1 text-[#8E8D8A] shrink-0" />
              {event.venue}
            </span>
          </div>

          <h3 className="text-lg font-bold text-[#1A1918] group-hover:text-[#E85A4F] transition-colors leading-snug">
            {event.title}
          </h3>

          <p className="text-xs text-[#8E8D8A] line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Capacity Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8E8D8A]">
            <span>Registration Slots</span>
            <span className="font-bold text-[#1A1918]">
              {event.currentRegistrations}/{event.maxRegistrations} ({capacityPct}%)
            </span>
          </div>
          <div className="w-full bg-[#EAE7DC] h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E85A4F] transition-all"
              style={{ width: `${capacityPct}%` }}
            />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-[#8E8D8A]/15 flex items-center justify-between gap-3">
          <Link
            href={`/events/${event.id}`}
            className="flex-1 flex items-center justify-center py-2 rounded text-xs font-mono font-bold tracking-wider uppercase border border-[#8E8D8A]/35 text-[#1A1918] bg-[#EAE7DC] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-colors"
          >
            RULEBOOK →
          </Link>
          <Link
            href={`/events/${event.id}#register`}
            className="flex-1 flex items-center justify-center py-2 rounded text-xs font-mono font-bold tracking-wider uppercase bg-[#E85A4F] text-white hover:bg-[#C94A40] transition-colors shadow-sm"
          >
            REGISTER
          </Link>
        </div>
      </div>
    </div>
  );
}

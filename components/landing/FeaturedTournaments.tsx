"use client";

import React from "react";
import Link from "next/link";
import { Trophy, Flame, MapPin, Users, ArrowRight, Sparkles } from "lucide-react";
import { FestEvent } from "@/lib/data/fest-data";

interface FeaturedTournamentsProps {
  events: FestEvent[];
}

export function FeaturedTournaments({ events }: FeaturedTournamentsProps) {
  const featuredEvents = events.filter((e) => e.isFeatured).slice(0, 6);
  const displayEvents = featuredEvents.length > 0 ? featuredEvents : events.slice(0, 6);

  return (
    <section
      id="tournaments"
      className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#EAE7DC] text-[#1A1918] border-b border-[#8E8D8A]/20"
    >
      <div className="container max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <Flame className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>Featured Events</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              Featured <span className="text-[#E85A4F]">Tournaments</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              Headline events published by the organizing committee. Each event shows its venue,
              team limits, schedule, and registration status.
            </p>
          </div>

          <Link href="/events">
            <span className="inline-flex items-center text-xs font-mono font-semibold py-2 px-4 rounded border border-[#8E8D8A]/40 text-[#1A1918] bg-[#F6F4EE] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer">
              All Events →
            </span>
          </Link>
        </div>

        {displayEvents.length === 0 ? (
          <div className="rounded-2xl border border-[#8E8D8A]/25 bg-[#F6F4EE] p-10 text-center">
            <Trophy className="h-8 w-8 text-[#8E8D8A] mx-auto mb-2" />
            <p className="text-base font-bold text-[#1A1918]">Featured tournaments will be announced soon</p>
            <p className="text-xs text-[#8E8D8A] mt-1">
              The organizing committee will publish the headline events before registrations open.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {displayEvents.map((evt) => {
              const isTeam = evt.eventType === "TEAM";
              return (
                <div
                  key={evt.id}
                  className="group relative flex flex-col justify-between rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm hover:border-[#E85A4F] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="relative h-28 w-full bg-[#EAE7DC] border-b border-[#8E8D8A]/20 p-4 flex flex-col justify-between overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC]">
                        Day {evt.dayNumber}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E85A4F] text-white uppercase">
                        {evt.status === "REGISTRATION_CLOSED" ? "CLOSED" : "OPEN"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1918] font-bold px-2.5 py-0.5 rounded bg-[#F6F4EE] border border-[#8E8D8A]/30">
                        {evt.category?.name ?? "Event"}
                      </span>
                      <Trophy className="h-4 w-4 text-[#8E8D8A]/60" />
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-[#1A1918] group-hover:text-[#E85A4F] transition-colors">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-[#8E8D8A] line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#8E8D8A]/15 flex items-center justify-between text-xs font-mono text-[#8E8D8A]">
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-[#E85A4F]" />
                        {evt.venue}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1 text-[#D8C3A5]" />
                        {isTeam ? `Team (${evt.minTeamSize}–${evt.maxTeamSize})` : "Individual"}
                      </span>
                    </div>

                    <div className="pt-2">
                      <Link
                        href={`/events/${evt.id}`}
                        className="w-full flex items-center justify-center py-2.5 rounded text-xs font-mono font-bold tracking-wider uppercase bg-[#EAE7DC] border border-[#8E8D8A]/35 text-[#1A1918] group-hover:bg-[#E85A4F] group-hover:text-white group-hover:border-[#E85A4F] transition-all"
                      >
                        View Event →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

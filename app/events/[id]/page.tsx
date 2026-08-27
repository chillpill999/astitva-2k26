// ============================================================================
// ASTITVA 2K26 - Deep Event Detail Page
// Path: app/events/[id]/page.tsx
// ============================================================================

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Trophy,
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  User,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEventBySlugOrId } from "@/lib/events/actions";
import { EventDetailTabs } from "@/components/events/EventDetailTabs";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  const { id } = await params;
  const res = await getEventBySlugOrId(id);
  if (!res.success || !res.data) {
    return { title: "Tournament Not Found | ASTITVA 2K26" };
  }
  return {
    title: `${res.data.title} | ASTITVA 2K26 LNJPIT Chapra`,
    description: res.data.subtitle || res.data.description.slice(0, 160),
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const res = await getEventBySlugOrId(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const event = res.data;
  const isTeam = event.eventType === "TEAM";

  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="container max-w-7xl mx-auto space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Tournaments
          </Link>
        </div>

        {/* Hero Banner Header */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0b0f19] border border-white/15 shadow-2xl backdrop-blur-2xl">
          {/* Background Cover Image with Gradient */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            {event.bannerImage ? (
              <Image
                src={event.bannerImage}
                alt={event.title}
                fill
                priority
                className="object-cover opacity-40 blur-xs scale-105"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-cyan-950 via-slate-900 to-purple-950 opacity-60" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/80 to-transparent" />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative -mt-40 sm:-mt-48 p-6 sm:p-10 space-y-6 z-10">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs font-mono font-bold bg-cyan-950/60 text-cyan-300 border-cyan-500/40">
                {event.category?.name || "Competition"}
              </Badge>
              <Badge variant="outline" className="text-xs font-mono font-bold bg-purple-950/60 text-purple-300 border-purple-500/40">
                {isTeam ? (
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-cyan-400" />
                    Squad ({event.minTeamSize}-{event.maxTeamSize} Players)
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-purple-400" />
                    Solo Individual
                  </span>
                )}
              </Badge>
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/50 text-xs font-mono font-bold">
                <Trophy className="mr-1 h-3.5 w-3.5 text-amber-400" />
                ₹{event.prizePool.toLocaleString("en-IN")} CASH PRIZE
              </Badge>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2 max-w-4xl">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
                {event.title}
              </h1>
              {event.subtitle && (
                <p className="text-base sm:text-lg text-cyan-300 font-medium font-sans">
                  {event.subtitle}
                </p>
              )}
            </div>

            {/* Quick Logistics Chips */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 pt-2 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-purple-400" />
                <span>Day {event.dayNumber} (Sept {3 + event.dayNumber}, 2026)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Status: {event.status.replace("_", " ")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Tabbed Content & Registration Widget */}
        <EventDetailTabs event={event} />
      </div>
    </div>
  );
}

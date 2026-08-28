// ============================================================================
// ASTITVA 2K26 - Deep Event Detail Page (Exteta Luxury Aesthetic)
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
} from "lucide-react";
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
    <div className="w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="container max-w-7xl mx-auto space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#8E8D8A] hover:text-[#1A1918] transition-colors uppercase font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Tournaments
          </Link>
        </div>

        {/* Hero Banner Header */}
        <div className="relative overflow-hidden rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm">
          {/* Background Cover Image with Gradient */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            {event.bannerImage ? (
              <Image
                src={event.bannerImage}
                alt={event.title}
                fill
                priority
                className="object-cover opacity-60"
              />
            ) : (
              <div className="h-full w-full bg-[#D8C3A5]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#F6F4EE] via-[#F6F4EE]/70 to-transparent" />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative -mt-40 sm:-mt-48 p-6 sm:p-10 space-y-6 z-10">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
                {event.category?.name || "Competition"}
              </span>
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded bg-[#EAE7DC] border border-[#8E8D8A]/25 text-[#E85A4F] uppercase">
                {isTeam ? (
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Squad ({event.minTeamSize}-{event.maxTeamSize} Players)
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Solo Individual
                  </span>
                )}
              </span>
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded bg-[#EAE7DC] border border-[#8E8D8A]/25 text-[#1A1918] uppercase">
                Day 0{event.dayNumber} · 4–8 Sept
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2 max-w-4xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
                {event.title}
              </h1>
              <p className="text-sm sm:text-base text-[#8E8D8A] font-mono">
                {event.subtitle || event.description.slice(0, 160)}
              </p>
            </div>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8E8D8A] pt-2">
              <div className="flex items-center gap-1.5 bg-[#EAE7DC] px-3 py-1.5 rounded-xl border border-[#8E8D8A]/20">
                <MapPin className="h-3.5 w-3.5 text-[#E85A4F]" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#EAE7DC] px-3 py-1.5 rounded-xl border border-[#8E8D8A]/20">
                <Calendar className="h-3.5 w-3.5 text-[#E85A4F]" />
                <span>Day 0{event.dayNumber}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#EAE7DC] px-3 py-1.5 rounded-xl border border-[#8E8D8A]/20">
                <Trophy className="h-3.5 w-3.5 text-[#E85A4F]" />
                <span className="font-bold text-[#E85A4F]">₹{event.prizePool?.toLocaleString("en-IN") || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Tab Body and Interactive Registration Actions */}
        <EventDetailTabs event={event} />
      </div>
    </div>
  );
}

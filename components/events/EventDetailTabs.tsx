"use client";

// ============================================================================
// ASTITVA 2K26 - Event Detail 4-Tab View & Registration CTA Widget
// Path: components/events/EventDetailTabs.tsx
// ============================================================================

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  FileText,
  Award,
  Users,
  User,
  MapPin,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Share2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EventDetailData } from "@/lib/events/types";
import { RegisterSoloModal } from "./RegisterSoloModal";
import { FestEvent } from "@/lib/data/fest-data";

interface EventDetailTabsProps {
  event: EventDetailData;
}

export function EventDetailTabs({ event }: EventDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSoloModalOpen, setIsSoloModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isTeam = event.eventType === "TEAM";
  const capacityPct = Math.min(
    100,
    Math.round((event.currentRegistrations / (event.maxRegistrations || 1)) * 100)
  );
  const isFull = event.currentRegistrations >= event.maxRegistrations;
  const isRegistered = !!event.userRegistration;
  const hasTeam = !!event.userTeam;

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch {
        // clipboard unavailable
      }
    }
  };

  // Adapter to pass to modal
  const festEventAdapter: FestEvent = {
    id: event.id,
    slug: event.slug,
    title: event.title,
    subtitle: event.subtitle,
    description: event.description,
    rules: event.rules,
    categoryId: event.categoryId,
    venue: event.venue,
    eventType: event.eventType,
    minTeamSize: event.minTeamSize,
    maxTeamSize: event.maxTeamSize,
    registrationFee: event.registrationFee,
    maxRegistrations: event.maxRegistrations,
    currentRegistrations: event.currentRegistrations,
    prizePool: event.prizePool,
    firstPrize: event.firstPrize,
    secondPrize: event.secondPrize,
    thirdPrize: event.thirdPrize,
    scheduleStart: new Date(event.scheduleStart),
    scheduleEnd: new Date(event.scheduleEnd),
    dayNumber: event.dayNumber,
    status: event.status,
    isFeatured: event.isFeatured,
    bannerImage: event.bannerImage,
    coordinatorName: event.coordinatorName,
    coordinatorPhone: event.coordinatorPhone,
    coordinatorEmail: event.coordinatorEmail,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column (8 cols): 4 Tabbed Content Areas */}
      <div className="lg:col-span-8 space-y-6">
        <div className="rounded-2xl bg-[#0b0f19]/90 border border-white/10 p-6 shadow-2xl backdrop-blur-xl space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 bg-slate-900/90 border border-white/10 p-1 rounded-xl">
              <TabsTrigger
                value="overview"
                className="text-xs font-mono font-bold data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
              >
                <FileText className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="rules"
                className="text-xs font-mono font-bold data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
              >
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />
                Rules & Format
              </TabsTrigger>
              <TabsTrigger
                value="prizes"
                className="text-xs font-mono font-bold data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300"
              >
                <Trophy className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />
                Prize Pool
              </TabsTrigger>
              <TabsTrigger
                value="coordinator"
                className="text-xs font-mono font-bold data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300"
              >
                <Phone className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />
                Contact
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: OVERVIEW */}
            <TabsContent value="overview" className="space-y-6 pt-4">
              <div className="space-y-3">
                <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  About the Tournament
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Tournament Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Stream</span>
                  <p className="text-sm font-bold text-cyan-300">{event.category?.name || "General"}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Format</span>
                  <p className="text-sm font-bold text-purple-300">
                    {isTeam
                      ? `Squad (${event.minTeamSize}-${event.maxTeamSize} Players)`
                      : "Solo Individual"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Entry Fee</span>
                  <p className="text-sm font-bold text-emerald-300">100% Free (LNJPIT)</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Festival Day</span>
                  <p className="text-sm font-bold text-amber-300">
                    Day {event.dayNumber} (Sept {3 + event.dayNumber}, 2026)
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1 sm:col-span-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Venue Location</span>
                  <p className="text-sm font-bold text-slate-200">{event.venue}</p>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: RULES & REGULATIONS */}
            <TabsContent value="rules" className="space-y-6 pt-4">
              <div className="space-y-3">
                <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-purple-400" />
                  Official Rules & Competition Guidelines
                </h3>
                <div className="p-5 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
                  <div className="prose prose-invert text-xs sm:text-sm text-slate-300 max-w-none whitespace-pre-line leading-relaxed font-sans">
                    {event.rules}
                  </div>
                </div>
              </div>

              {/* General Festival Code of Conduct */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2 text-xs text-purple-200">
                <h4 className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-purple-400" />
                  General Participation Clauses
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Valid LNJPIT College ID Card & QR Entry Pass are mandatory for venue access.</li>
                  <li>Participants must report 30 minutes prior to scheduled start time.</li>
                  <li>Any indiscipline or unsporting conduct will result in immediate disqualification.</li>
                  <li>The Organizing Committee and Official Umpires/Judges decisions are final.</li>
                </ul>
              </div>
            </TabsContent>

            {/* TAB 3: PRIZE POOL */}
            <TabsContent value="prizes" className="space-y-6 pt-4">
              <div className="space-y-3">
                <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  Prize Pool & Podium Rewards
                </h3>
                <p className="text-xs text-slate-400">
                  Total Tournament Cash Pool: <strong className="text-amber-300 font-mono text-sm">₹{event.prizePool.toLocaleString("en-IN")}</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1st Prize */}
                <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 space-y-3 shadow-lg shadow-amber-500/5">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-amber-500 text-black font-black text-[10px]">1ST PLACE</Badge>
                    <Trophy className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-amber-400 font-bold">Champion</p>
                    <p className="text-sm font-bold text-white leading-snug">
                      {event.firstPrize || "Gold Trophy + Cash Reward + Merit Certificate"}
                    </p>
                  </div>
                </div>

                {/* 2nd Prize */}
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-400/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-slate-400 text-slate-300 font-black text-[10px]">
                      2ND PLACE
                    </Badge>
                    <Award className="h-5 w-5 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-slate-300 font-bold">Runner Up</p>
                    <p className="text-sm font-bold text-white leading-snug">
                      {event.secondPrize || "Silver Trophy / Medal + Cash Reward"}
                    </p>
                  </div>
                </div>

                {/* 3rd Prize */}
                <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-700/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-amber-700 text-amber-500 font-black text-[10px]">
                      3RD PLACE
                    </Badge>
                    <Award className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-amber-500 font-bold">2nd Runner Up</p>
                    <p className="text-sm font-bold text-white leading-snug">
                      {event.thirdPrize || "Bronze Memento + Merit Certificate"}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: COORDINATORS */}
            <TabsContent value="coordinator" className="space-y-6 pt-4">
              <div className="space-y-3">
                <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-400" />
                  Event Coordinators & Student Leads
                </h3>
                <p className="text-xs text-slate-400">
                  Have questions about tournament brackets, rules, or schedule changes? Reach out to the event desk.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">
                      {event.coordinator?.name || event.coordinatorName || "Official Event Desk"}
                    </h4>
                    <p className="text-xs font-mono text-cyan-400">
                      {event.coordinator?.department || "LNJPIT Chapra Faculty/Student Coordinator"}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono text-emerald-400 border-emerald-500/30 bg-emerald-950/30">
                    VERIFIED DESK
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {(event.coordinator?.phone || event.coordinatorPhone) && (
                    <a
                      href={`tel:${event.coordinator?.phone || event.coordinatorPhone}`}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 transition-colors"
                    >
                      <Phone className="h-4 w-4 text-emerald-400" />
                      <span>{event.coordinator?.phone || event.coordinatorPhone}</span>
                    </a>
                  )}

                  {(event.coordinator?.email || event.coordinatorEmail) && (
                    <a
                      href={`mailto:${event.coordinator?.email || event.coordinatorEmail}`}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 transition-colors"
                    >
                      <Mail className="h-4 w-4 text-cyan-400" />
                      <span>{event.coordinator?.email || event.coordinatorEmail}</span>
                    </a>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Column (4 cols): Sticky Registration Card Widget */}
      <div className="lg:col-span-4 space-y-6">
        <div className="sticky top-24 rounded-2xl bg-[#0b0f19]/95 border border-white/15 p-6 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Header */}
          <div className="space-y-1 border-b border-white/10 pb-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Registration Desk</span>
            <h3 className="text-xl font-black text-white">Participation Status</h3>
          </div>

          {/* User Registration Status Indicator */}
          {isRegistered ? (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>You are registered for this event!</span>
              </div>
              <div className="text-[11px] font-mono text-slate-300 space-y-1">
                <div>Ticket: <strong className="text-cyan-300">{event.userRegistration?.registrationNumber}</strong></div>
                {event.userRegistration?.teamName && (
                  <div>Squad: <strong className="text-purple-300">{event.userRegistration.teamName}</strong></div>
                )}
              </div>
              <Link href="/dashboard/participant">
                <Button size="sm" className="w-full text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white mt-1">
                  <QrCode className="mr-1.5 h-3.5 w-3.5" />
                  View Digital Pass
                </Button>
              </Link>
            </div>
          ) : hasTeam ? (
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Users className="h-4 w-4 shrink-0" />
                <span>Squad Enrolled: {event.userTeam?.name}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-300 space-y-1">
                <div>Invite Code: <strong className="text-white">{event.userTeam?.code}</strong></div>
                <div>Role: <strong className="text-amber-400">{event.userTeam?.role}</strong></div>
                <div>Roster: <strong>{event.userTeam?.memberCount}/{event.userTeam?.maxMembers}</strong></div>
              </div>
              <Link href={`/teams/${event.userTeam?.id}`}>
                <Button size="sm" className="w-full text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white">
                  Manage Squad Roster
                </Button>
              </Link>
            </div>
          ) : null}

          {/* Capacity Progress Meter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Slots Filled:</span>
              <span className={`font-bold ${isFull ? "text-red-400" : "text-emerald-400"}`}>
                {event.currentRegistrations} / {event.maxRegistrations} {isTeam ? "Squads" : "Slots"}
              </span>
            </div>
            <Progress
              value={capacityPct}
              className={`h-2 bg-white/10 ${isFull ? "[&>div]:bg-red-500" : "[&>div]:bg-emerald-400"}`}
            />
          </div>

          {/* CTAs based on Event Type */}
          {!isRegistered && !hasTeam && (
            <div className="space-y-3 pt-2">
              {isTeam ? (
                <>
                  <Link href={`/teams/create?event=${event.id}`} className="block">
                    <Button
                      disabled={isFull}
                      className="w-full text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/25 py-5"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Create New Squad
                    </Button>
                  </Link>

                  <Link href={`/teams/join?event=${event.id}`} className="block">
                    <Button
                      variant="outline"
                      disabled={isFull}
                      className="w-full text-xs font-bold border-white/15 bg-white/5 hover:bg-white/10 text-white py-5"
                    >
                      Join Squad with Code
                    </Button>
                  </Link>
                </>
              ) : (
                <Button
                  disabled={isFull}
                  onClick={() => setIsSoloModalOpen(true)}
                  className="w-full text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25 py-5"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Instant Solo Registration
                </Button>
              )}
            </div>
          )}

          {/* Quick Share Link */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="w-full text-xs font-mono text-slate-400 hover:text-white"
          >
            <Share2 className="mr-1.5 h-3.5 w-3.5" />
            {copiedLink ? "Link Copied to Clipboard!" : "Share Tournament Link"}
          </Button>
        </div>
      </div>

      {/* Solo Modal */}
      <RegisterSoloModal
        event={festEventAdapter}
        isOpen={isSoloModalOpen}
        onClose={() => setIsSoloModalOpen(false)}
      />
    </div>
  );
}

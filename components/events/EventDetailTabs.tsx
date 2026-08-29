"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  FileText,
  Award,
  Medal,
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
  Share2,
  FileCheck2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventDetailData } from "@/lib/events/types";
import { RegisterSoloModal } from "./RegisterSoloModal";
import { FestEvent } from "@/lib/data/fest-data";

import { supabase } from "@/lib/supabase/client";

interface EventDetailTabsProps {
  event: EventDetailData;
}

export function EventDetailTabs({ event: initialEvent }: EventDetailTabsProps) {
  const [event, setEvent] = useState<EventDetailData>(initialEvent);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSoloModalOpen, setIsSoloModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setEvent(initialEvent);
  }, [initialEvent]);

  useEffect(() => {
    const channel = supabase
      .channel(`event-realtime-${initialEvent.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Event",
          filter: `id=eq.${initialEvent.id}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const updated = payload.new as any;
            setEvent((prev) => ({
              ...prev,
              title: updated.title ?? prev.title,
              subtitle: updated.subtitle ?? prev.subtitle,
              status: updated.status ?? prev.status,
              currentRegistrations: updated.currentRegistrations ?? prev.currentRegistrations,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialEvent.id]);

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
        // ignore
      }
    }
  };

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
    prizePool: 0,
    firstPrize: event.firstPrize || "Winner Trophy + Gold Medal + Certificate of Excellence",
    secondPrize: event.secondPrize || "Runner-Up Trophy + Silver Medal + Certificate of Merit",
    thirdPrize: event.thirdPrize || "Bronze Medal + Certificate of Commendation",
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-[#1A1918]">
      {/* Left Column (8 cols): 4 Tabbed Content Areas */}
      <div className="lg:col-span-8 space-y-6">
        <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-8 shadow-sm space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 bg-[#EAE7DC] border border-[#8E8D8A]/25 p-1 rounded-2xl">
              <TabsTrigger
                value="overview"
                className="text-xs font-mono font-bold data-[state=active]:bg-[#1A1918] data-[state=active]:text-[#EAE7DC] rounded-xl py-2"
              >
                <FileText className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />
                OVERVIEW
              </TabsTrigger>
              <TabsTrigger
                value="rules"
                className="text-xs font-mono font-bold data-[state=active]:bg-[#1A1918] data-[state=active]:text-[#EAE7DC] rounded-xl py-2"
              >
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />
                RULES
              </TabsTrigger>
              <TabsTrigger
                value="awards"
                className="text-xs font-mono font-bold data-[state=active]:bg-[#1A1918] data-[state=active]:text-[#EAE7DC] rounded-xl py-2"
              >
                <Trophy className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />
                AWARDS
              </TabsTrigger>
              <TabsTrigger
                value="coordinator"
                className="text-xs font-mono font-bold data-[state=active]:bg-[#1A1918] data-[state=active]:text-[#EAE7DC] rounded-xl py-2"
              >
                <Phone className="mr-1.5 h-3.5 w-3.5 hidden sm:inline" />
                CONTACT
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: OVERVIEW */}
            <TabsContent value="overview" className="space-y-6 pt-6">
              {/* Live Match Score Indicator if active */}
              {event.status === "ONGOING" && (
                <div className="p-5 rounded-2xl bg-[#E85A4F]/10 border border-[#E85A4F]/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#E85A4F] uppercase">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E85A4F] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E85A4F]"></span>
                      </span>
                      MATCH CURRENTLY IN PROGRESS
                    </span>
                    <span className="text-[10px] font-mono text-[#8E8D8A] uppercase">Realtime Live Score</span>
                  </div>
                  <p className="text-base font-mono font-black text-[#1A1918]">
                    {event.subtitle || "Match underway. Awaiting live point update from coordinator."}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#1A1918] uppercase tracking-wider font-mono flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#E85A4F]" />
                  Tournament Brief
                </h3>
                <p className="text-sm text-[#8E8D8A] leading-relaxed whitespace-pre-line font-mono">
                  {event.description}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#8E8D8A]/20">
                <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-1">
                  <span className="text-[10px] font-mono text-[#8E8D8A] uppercase">Category</span>
                  <p className="text-sm font-bold text-[#1A1918]">{event.category?.name || "General"}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-1">
                  <span className="text-[10px] font-mono text-[#8E8D8A] uppercase">Format</span>
                  <p className="text-sm font-bold text-[#E85A4F]">
                    {isTeam
                      ? `Squad (${event.minTeamSize}-${event.maxTeamSize})`
                      : "Solo Individual"}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-1">
                  <span className="text-[10px] font-mono text-[#8E8D8A] uppercase">Entry Fee</span>
                  <p className="text-sm font-bold text-[#1A1918]">100% Free</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-1">
                  <span className="text-[10px] font-mono text-[#8E8D8A] uppercase">Festival Day</span>
                  <p className="text-sm font-bold text-[#1A1918]">
                    Day 0{event.dayNumber}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-1 sm:col-span-2">
                  <span className="text-[10px] font-mono text-[#8E8D8A] uppercase">Venue</span>
                  <p className="text-sm font-bold text-[#1A1918]">{event.venue}</p>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: RULES */}
            <TabsContent value="rules" className="space-y-6 pt-6">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#1A1918] uppercase tracking-wider font-mono flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#E85A4F]" />
                  Competition Rules &amp; Regulations
                </h3>
                <div className="p-6 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-3">
                  <div className="text-xs sm:text-sm text-[#1A1918] max-w-none whitespace-pre-line leading-relaxed font-mono">
                    {event.rules}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 space-y-2 text-xs text-[#8E8D8A] font-mono">
                <h4 className="font-bold text-[#1A1918] flex items-center gap-1.5 uppercase">
                  <AlertTriangle className="h-3.5 w-3.5 text-[#E85A4F]" />
                  General Protocol
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Valid LNJPIT Student ID Card and QR Entry Pass are mandatory.</li>
                  <li>Participants must report 30 minutes prior to scheduled start time.</li>
                  <li>The Organizing Committee and Official Referees decisions are final.</li>
                </ul>
              </div>
            </TabsContent>

            {/* TAB 3: AWARDS & HONORS */}
            <TabsContent value="awards" className="space-y-6 pt-6">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#1A1918] uppercase tracking-wider font-mono flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-[#E85A4F]" />
                  Podium Honors &amp; Accolades
                </h3>
                <p className="text-xs text-[#8E8D8A] font-mono">
                  Official trophies, cast medals, and verifiable excellence certificates awarded to top finishers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 space-y-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E85A4F] text-white uppercase">
                    1ST PLACE
                  </span>
                  <p className="text-xs font-mono text-[#8E8D8A] font-bold mt-1">Champion</p>
                  <p className="text-sm font-bold text-[#1A1918]">
                    {event.firstPrize || "Winner Trophy + Gold Medals + Certificate of Excellence"}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 space-y-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
                    2ND PLACE
                  </span>
                  <p className="text-xs font-mono text-[#8E8D8A] font-bold mt-1">Runner Up</p>
                  <p className="text-sm font-bold text-[#1A1918]">
                    {event.secondPrize || "Runner-Up Trophy + Silver Medals + Certificate of Merit"}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 space-y-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#8E8D8A] text-white uppercase">
                    3RD PLACE
                  </span>
                  <p className="text-xs font-mono text-[#8E8D8A] font-bold mt-1">2nd Runner Up</p>
                  <p className="text-sm font-bold text-[#1A1918]">
                    {event.thirdPrize || "Bronze Medals + Certificate of Commendation"}
                  </p>
                </div>
              </div>

              {/* Participation Certificate Banner */}
              <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 flex items-center space-x-3 text-xs font-mono text-[#1A1918]">
                <FileCheck2 className="h-5 w-5 text-[#E85A4F] shrink-0" />
                <div>
                  <strong className="block font-bold uppercase">Participation Certificate for All Attendees</strong>
                  <span className="text-[#8E8D8A]">
                    Every registered participant who checks in via the QR scanner receives an official digitally verifiable Participation Certificate.
                  </span>
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: COORDINATORS */}
            <TabsContent value="coordinator" className="space-y-6 pt-6">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#1A1918] uppercase tracking-wider font-mono flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#E85A4F]" />
                  Event Coordinators
                </h3>
                <p className="text-xs text-[#8E8D8A] font-mono">
                  Have questions about brackets, rules, or schedule changes? Reach out directly.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-[#1A1918]">
                      {event.coordinator?.name || event.coordinatorName || "Official Event Desk"}
                    </h4>
                    <p className="text-xs font-mono text-[#8E8D8A]">
                      {event.coordinator?.department || "LNJPIT Chapra Faculty/Student Coordinator"}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#F6F4EE] text-[#E85A4F] uppercase border border-[#8E8D8A]/20">
                    VERIFIED DESK
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {(event.coordinator?.phone || event.coordinatorPhone) && (
                    <a
                      href={`tel:${event.coordinator?.phone || event.coordinatorPhone}`}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/20 text-xs font-mono text-[#1A1918] hover:border-[#E85A4F] transition-colors"
                    >
                      <Phone className="h-4 w-4 text-[#E85A4F]" />
                      <span>{event.coordinator?.phone || event.coordinatorPhone}</span>
                    </a>
                  )}

                  {(event.coordinator?.email || event.coordinatorEmail) && (
                    <a
                      href={`mailto:${event.coordinator?.email || event.coordinatorEmail}`}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/20 text-xs font-mono text-[#1A1918] hover:border-[#E85A4F] transition-colors"
                    >
                      <Mail className="h-4 w-4 text-[#E85A4F]" />
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
        <div className="sticky top-24 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-7 shadow-sm space-y-6">
          {/* Header */}
          <div className="space-y-1 border-b border-[#8E8D8A]/20 pb-4">
            <span className="text-[10px] font-mono text-[#8E8D8A] uppercase">REGISTRATION DESK</span>
            <h3 className="text-xl font-bold font-mono text-[#1A1918] uppercase">Participation</h3>
          </div>

          {/* User Registration Status Indicator */}
          {isRegistered ? (
            <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 space-y-3">
              <div className="flex items-center gap-2 text-[#E85A4F] font-bold text-xs font-mono uppercase">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>You are registered!</span>
              </div>
              <div className="text-[11px] font-mono text-[#8E8D8A] space-y-1">
                <div>Ticket: <strong className="text-[#1A1918]">{event.userRegistration?.registrationNumber}</strong></div>
                {event.userRegistration?.teamName && (
                  <div>Squad: <strong className="text-[#1A1918]">{event.userRegistration.teamName}</strong></div>
                )}
              </div>
              <Link href="/dashboard/participant">
                <button className="w-full py-2.5 text-xs font-mono font-bold uppercase bg-[#E85A4F] hover:bg-[#C94A40] text-white rounded-xl transition-colors flex items-center justify-center gap-2">
                  <QrCode className="h-3.5 w-3.5" />
                  View Digital Pass
                </button>
              </Link>
            </div>
          ) : hasTeam ? (
            <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 space-y-3">
              <div className="flex items-center gap-2 text-[#1A1918] font-bold text-xs font-mono uppercase">
                <Users className="h-4 w-4 shrink-0 text-[#E85A4F]" />
                <span>Squad: {event.userTeam?.name}</span>
              </div>
              <div className="text-[11px] font-mono text-[#8E8D8A] space-y-1">
                <div>Invite Code: <strong className="text-[#1A1918]">{event.userTeam?.code}</strong></div>
                <div>Role: <strong className="text-[#E85A4F]">{event.userTeam?.role}</strong></div>
                <div>Roster: <strong className="text-[#1A1918]">{event.userTeam?.memberCount}/{event.userTeam?.maxMembers}</strong></div>
              </div>
              <Link href={`/teams/${event.userTeam?.id}`}>
                <button className="w-full py-2.5 text-xs font-mono font-bold uppercase bg-[#1A1918] hover:bg-[#E85A4F] text-[#EAE7DC] rounded-xl transition-colors">
                  Manage Squad Roster
                </button>
              </Link>
            </div>
          ) : null}

          {/* Capacity Progress Meter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#8E8D8A]">Slots Filled:</span>
              <span className="font-bold text-[#1A1918]">
                {event.currentRegistrations} / {event.maxRegistrations} {isTeam ? "Squads" : "Slots"}
              </span>
            </div>
            <div className="w-full bg-[#EAE7DC] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#E85A4F] h-full rounded-full transition-all duration-500"
                style={{ width: `${capacityPct}%` }}
              />
            </div>
          </div>

          {/* CTAs */}
          {!isRegistered && !hasTeam && (
            <div className="space-y-3 pt-2">
              {isTeam ? (
                <>
                  <Link href={`/teams/create?event=${event.id}`} className="block">
                    <button
                      disabled={isFull}
                      className="w-full py-3 text-xs font-mono font-bold uppercase tracking-wider bg-[#E85A4F] hover:bg-[#C94A40] text-white rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      Create New Squad
                    </button>
                  </Link>

                  <Link href={`/teams/join?event=${event.id}`} className="block">
                    <button
                      disabled={isFull}
                      className="w-full py-3 text-xs font-mono font-bold uppercase tracking-wider border border-[#8E8D8A]/35 bg-[#EAE7DC] hover:bg-[#1A1918] hover:text-[#EAE7DC] text-[#1A1918] rounded-xl transition-all cursor-pointer"
                    >
                      Join Squad with Code
                    </button>
                  </Link>
                </>
              ) : (
                <button
                  disabled={isFull}
                  onClick={() => setIsSoloModalOpen(true)}
                  className="w-full py-3 text-xs font-mono font-bold uppercase tracking-wider bg-[#E85A4F] hover:bg-[#C94A40] text-white rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Instant Solo Registration
                </button>
              )}
            </div>
          )}

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="w-full py-2 text-xs font-mono text-[#8E8D8A] hover:text-[#1A1918] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{copiedLink ? "Link Copied to Clipboard!" : "Share Tournament Link"}</span>
          </button>
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

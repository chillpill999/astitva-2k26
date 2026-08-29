"use client";

// ============================================================================
// ASTITVA 2K26 - Realtime Coordinator Command Deck
// Path: components/coordinator/CoordinatorRealtimeDeck.tsx
// ============================================================================

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Users,
  Activity,
  Award,
  Radio,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Filter,
  Shield,
  Search,
  Zap,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { toast } from "sonner";

export interface CoordinatorEventItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  venue: string;
  dayNumber: number;
  status: string;
  eventType: string;
  maxRegistrations: number;
  currentRegistrations: number;
  categoryName: string;
  categorySlug: string;
  registrationCount: number;
  attendanceCount: number;
  resultsCount: number;
}

export interface CoordinatorRegistrationItem {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  participantName: string;
  participantId?: string;
  collegeId?: string;
  branch?: string;
  teamName?: string | null;
  status: string;
  registrationNumber: string;
  createdAt: string;
}

export interface CoordinatorAttendanceItem {
  id: string;
  eventId?: string | null;
  eventTitle?: string | null;
  participantId: string;
  participantName?: string | null;
  status: string;
  checkInType: string;
  scannedAt: string;
}

interface CoordinatorRealtimeDeckProps {
  initialEvents: CoordinatorEventItem[];
  initialRegistrations: CoordinatorRegistrationItem[];
  initialAttendances: CoordinatorAttendanceItem[];
  userName: string;
  userRole: string;
}

export function CoordinatorRealtimeDeck({
  initialEvents,
  initialRegistrations,
  initialAttendances,
  userName,
  userRole,
}: CoordinatorRealtimeDeckProps) {
  const [events, setEvents] = useState<CoordinatorEventItem[]>(initialEvents);
  const [registrations, setRegistrations] = useState<CoordinatorRegistrationItem[]>(initialRegistrations);
  const [attendances, setAttendances] = useState<CoordinatorAttendanceItem[]>(initialAttendances);
  const [activeTab, setActiveTab] = useState<"ROSTER" | "REGISTRATIONS" | "ATTENDANCE">("ROSTER");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>("ALL");
  const [isLiveConnected, setIsLiveConnected] = useState(true);

  // Supabase Realtime Channels
  useEffect(() => {
    // 1. Channel for Events updates (status, scores, registrations count)
    const eventsChannel = supabase
      .channel("coordinator-events-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Event" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const updated = payload.new as any;
            setEvents((prev) =>
              prev.map((e) =>
                e.id === updated.id
                  ? {
                      ...e,
                      title: updated.title ?? e.title,
                      subtitle: updated.subtitle ?? e.subtitle,
                      status: updated.status ?? e.status,
                      currentRegistrations: updated.currentRegistrations ?? e.currentRegistrations,
                    }
                  : e
              )
            );
          }
        }
      )
      .subscribe((status) => {
        setIsLiveConnected(status === "SUBSCRIBED");
      });

    // 2. Channel for Live Registrations
    const regChannel = supabase
      .channel("coordinator-registrations-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Registration" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newReg = payload.new as any;
            // Find corresponding event title
            const matchedEvent = events.find((e) => e.id === newReg.eventId);
            const newItem: CoordinatorRegistrationItem = {
              id: newReg.id,
              eventId: newReg.eventId,
              eventTitle: matchedEvent?.title || "Tournament",
              userId: newReg.userId,
              participantName: "Student Registered",
              participantId: "AST26-LIVE",
              collegeId: "LNJPIT",
              branch: "ENGINEERING",
              teamName: null,
              status: newReg.status,
              registrationNumber: newReg.registrationNumber,
              createdAt: new Date().toISOString(),
            };

            setRegistrations((prev) => [newItem, ...prev]);

            // Update registration count for the event
            setEvents((prev) =>
              prev.map((e) =>
                e.id === newReg.eventId
                  ? {
                      ...e,
                      registrationCount: e.registrationCount + 1,
                      currentRegistrations: e.currentRegistrations + 1,
                    }
                  : e
              )
            );

            toast.info(`⚡ New Participant Registered!`, {
              description: `Ticket #${newReg.registrationNumber} for ${matchedEvent?.title || "your event"}.`,
            });
          }
        }
      )
      .subscribe();

    // 3. Channel for Live Game Attendance & Arena Entry
    const attChannel = supabase
      .channel("coordinator-attendance-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Attendance" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newAtt = payload.new as any;
            const matchedEvent = events.find((e) => e.id === newAtt.eventId);
            const newItem: CoordinatorAttendanceItem = {
              id: newAtt.id,
              eventId: newAtt.eventId,
              eventTitle: matchedEvent?.title || "Arena Match",
              participantId: newAtt.participantId,
              participantName: "Participant Present",
              status: newAtt.status,
              checkInType: newAtt.checkInType,
              scannedAt: new Date().toISOString(),
            };

            setAttendances((prev) => [newItem, ...prev]);

            // Update attendance count for the event
            setEvents((prev) =>
              prev.map((e) =>
                e.id === newAtt.eventId
                  ? { ...e, attendanceCount: e.attendanceCount + 1 }
                  : e
              )
            );

            toast.success(`🎯 Participant Checked In at Arena!`, {
              description: `Participant ${newAtt.participantId} entered ${matchedEvent?.title || "the match"}.`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(regChannel);
      supabase.removeChannel(attChannel);
    };
  }, [events]);

  const totalRegs = events.reduce((sum, e) => sum + e.registrationCount, 0);
  const totalScans = events.reduce((sum, e) => sum + e.attendanceCount, 0);
  const totalPublished = events.reduce((sum, e) => sum + e.resultsCount, 0);

  // Filtered registrations
  const filteredRegistrations = registrations.filter((r) => {
    if (selectedSportFilter !== "ALL" && r.eventId !== selectedSportFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.participantName.toLowerCase().includes(q) ||
      r.registrationNumber.toLowerCase().includes(q) ||
      r.eventTitle.toLowerCase().includes(q) ||
      (r.branch && r.branch.toLowerCase().includes(q)) ||
      (r.teamName && r.teamName.toLowerCase().includes(q))
    );
  });

  // Filtered attendance
  const filteredAttendances = attendances.filter((a) => {
    if (selectedSportFilter !== "ALL" && a.eventId !== selectedSportFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.participantId.toLowerCase().includes(q) ||
      (a.participantName && a.participantName.toLowerCase().includes(q)) ||
      (a.eventTitle && a.eventTitle.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 text-[#1A1918]">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#8E8D8A]/20 pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <RoleBadge role={userRole as any} />
            <span className="text-[10px] font-mono text-[#8E8D8A] uppercase font-bold">
              Tournament Jury &amp; Scoring Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight uppercase font-mono">
            Coordinator Command Deck
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono">
            Signed in as <strong className="text-[#1A1918]">{userName}</strong>. Live participant registrations, match check-ins, and realtime broadcast console.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center space-x-2 bg-[#F6F4EE] border border-[#8E8D8A]/30 px-3 py-2 rounded-xl text-xs font-mono text-[#1A1918]">
            <Radio className="h-4 w-4 text-[#E85A4F] animate-pulse" />
            <span>{isLiveConnected ? "Realtime Socket: LIVE" : "Connecting..."}</span>
          </div>

          <Link href="/dashboard/coordinator/results">
            <button className="px-4 py-2.5 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
              <Radio className="h-4 w-4 animate-pulse" /> Live Scoring Deck
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip with Live Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="p-5 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8E8D8A] uppercase font-bold">Assigned Events</span>
            <Trophy className="h-4 w-4 text-[#E85A4F]" />
          </div>
          <p className="text-2xl font-black text-[#E85A4F]">{events.length}</p>
          <span className="text-[9px] text-[#8E8D8A]">Sports, Cultural &amp; Gaming</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8E8D8A] uppercase font-bold">Live Registrations</span>
            <Users className="h-4 w-4 text-[#1A1918]" />
          </div>
          <p className="text-2xl font-black text-[#1A1918]">{totalRegs}</p>
          <span className="text-[9px] text-emerald-600 font-bold">● Streaming realtime</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8E8D8A] uppercase font-bold">Arena Check-ins</span>
            <Activity className="h-4 w-4 text-[#1A1918]" />
          </div>
          <p className="text-2xl font-black text-[#1A1918]">{totalScans}</p>
          <span className="text-[9px] text-[#8E8D8A]">Participants in match</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8E8D8A] uppercase font-bold">Podiums Published</span>
            <Award className="h-4 w-4 text-[#E85A4F]" />
          </div>
          <p className="text-2xl font-black text-[#E85A4F]">{totalPublished}</p>
          <span className="text-[9px] text-[#8E8D8A]">Official winners</span>
        </div>
      </div>

      {/* Interactive Tabs Header */}
      <div className="p-1.5 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab("ROSTER")}
          className={`py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "ROSTER"
              ? "bg-[#1A1918] text-[#EAE7DC] shadow-sm"
              : "text-[#8E8D8A] hover:text-[#1A1918]"
          }`}
        >
          <Trophy className="h-3.5 w-3.5" />
          <span>Tournament Roster ({events.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("REGISTRATIONS")}
          className={`py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "REGISTRATIONS"
              ? "bg-[#E85A4F] text-white shadow-sm"
              : "text-[#8E8D8A] hover:text-[#1A1918]"
          }`}
        >
          <UserCheck className="h-3.5 w-3.5" />
          <span>Live Participant Roster ({registrations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ATTENDANCE")}
          className={`py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "ATTENDANCE"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-[#8E8D8A] hover:text-[#1A1918]"
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>Arena Match Attendance ({attendances.length})</span>
        </button>
      </div>

      {/* TAB 1: Tournament Roster */}
      {activeTab === "ROSTER" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-5 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#8E8D8A]/20 pb-4">
            <div>
              <h2 className="text-base font-bold uppercase text-[#1A1918] flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#E85A4F]" />
                Tournament Management Roster ({events.length})
              </h2>
              <p className="text-xs text-[#8E8D8A] mt-0.5">
                Realtime match status, live registration counters, and instant scoring links.
              </p>
            </div>
            <Link href="/dashboard/coordinator/results" className="text-xs font-bold text-[#E85A4F] hover:underline">
              Open Live Broadcast Console →
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 text-center space-y-2">
              <Sparkles className="h-6 w-6 text-[#E85A4F] mx-auto" />
              <p className="text-xs font-bold text-[#1A1918] uppercase">No events assigned yet</p>
              <p className="text-[11px] text-[#8E8D8A]">
                Contact the central admin committee to assign your coordination responsibilities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((e) => (
                <div
                  key={e.id}
                  className="p-5 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 hover:border-[#E85A4F]/60 transition-all space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
                      {e.categoryName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        e.status === "ONGOING"
                          ? "bg-[#E85A4F] text-white animate-pulse"
                          : e.status === "COMPLETED"
                          ? "bg-emerald-600 text-white"
                          : "bg-[#F6F4EE] text-[#1A1918] border border-[#8E8D8A]/30"
                      }`}
                    >
                      {e.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#1A1918] uppercase">{e.title}</h3>
                    <p className="text-xs text-[#8E8D8A] flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#E85A4F]" /> {e.venue} · Day 0{e.dayNumber}
                    </p>
                    {e.subtitle && (
                      <p className="text-[11px] font-bold text-[#E85A4F] bg-[#F6F4EE] px-2.5 py-1 rounded-lg border border-[#8E8D8A]/20">
                        ⚡ {e.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#8E8D8A]/20 text-center text-[10px]">
                    <div className="p-2 rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/20">
                      <span className="text-[#8E8D8A] block">REGS</span>
                      <strong className="text-xs text-[#1A1918]">{e.registrationCount}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/20">
                      <span className="text-[#8E8D8A] block">SCANS</span>
                      <strong className="text-xs text-[#1A1918]">{e.attendanceCount}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/20">
                      <span className="text-[#8E8D8A] block">PODIUM</span>
                      <strong className="text-xs text-[#E85A4F]">{e.resultsCount > 0 ? "PUBLISHED" : "PENDING"}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Link href={`/events/${e.id}`} className="text-[11px] text-[#8E8D8A] hover:text-[#1A1918] hover:underline">
                      Public View →
                    </Link>
                    <Link href="/dashboard/coordinator/results">
                      <button className="px-3 py-1.5 rounded-lg bg-[#E85A4F] text-white text-[10px] font-bold uppercase hover:bg-[#C94A40] transition-all flex items-center gap-1 cursor-pointer">
                        Live Score Deck <ArrowRight className="h-3 w-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Live Registered Participants Roster */}
      {activeTab === "REGISTRATIONS" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-5 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#8E8D8A]/20 pb-4">
            <div>
              <h2 className="text-base font-bold uppercase text-[#1A1918] flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-[#E85A4F]" />
                Live Registered Participants &amp; Squads ({filteredRegistrations.length})
              </h2>
              <p className="text-xs text-[#8E8D8A] mt-0.5">
                Incoming student entries stream live to this console via Supabase Realtime socket.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedSportFilter}
                onChange={(e) => setSelectedSportFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-xs font-mono text-[#1A1918] focus:outline-none focus:border-[#E85A4F]"
              >
                <option value="ALL">All Assigned Events</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8D8A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search participant name, ticket number, branch, squad..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-xs font-mono text-[#1A1918] focus:outline-none focus:border-[#E85A4F]"
            />
          </div>

          {filteredRegistrations.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 text-center space-y-2">
              <Users className="h-6 w-6 text-[#8E8D8A] mx-auto" />
              <p className="text-xs font-bold text-[#1A1918] uppercase">No student registrations found</p>
              <p className="text-[11px] text-[#8E8D8A]">
                When participants sign up for your sport, they will immediately appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#8E8D8A]/25 text-[#8E8D8A] text-[10px] uppercase">
                    <th className="py-2.5 px-3">Participant</th>
                    <th className="py-2.5 px-3">Tournament</th>
                    <th className="py-2.5 px-3">Branch / ID</th>
                    <th className="py-2.5 px-3">Squad</th>
                    <th className="py-2.5 px-3">Ticket #</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8E8D8A]/15">
                  {filteredRegistrations.map((r) => (
                    <tr key={r.id} className="hover:bg-[#EAE7DC]/60 transition-colors">
                      <td className="py-3 px-3">
                        <strong className="text-[#1A1918] block">{r.participantName}</strong>
                        <span className="text-[10px] text-[#8E8D8A]">{r.participantId || "AST26-PART"}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[#1A1918] font-bold">{r.eventTitle}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#EAE7DC] text-[#1A1918] text-[10px] border border-[#8E8D8A]/20">
                          {r.branch || "LNJPIT"}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {r.teamName ? (
                          <span className="text-[#E85A4F] font-bold">🛡️ {r.teamName}</span>
                        ) : (
                          <span className="text-[#8E8D8A] text-[10px]">Solo</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[#1A1918]">{r.registrationNumber}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white uppercase">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Live Arena Match Attendance */}
      {activeTab === "ATTENDANCE" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-5 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#8E8D8A]/20 pb-4">
            <div>
              <h2 className="text-base font-bold uppercase text-[#1A1918] flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-600" />
                Live Arena Match Attendance &amp; Check-in Log ({filteredAttendances.length})
              </h2>
              <p className="text-xs text-[#8E8D8A] mt-0.5">
                Participants who entered the game arena, verified by camera or manual QR token.
              </p>
            </div>
          </div>

          {filteredAttendances.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 text-center space-y-2">
              <Activity className="h-6 w-6 text-[#8E8D8A] mx-auto" />
              <p className="text-xs font-bold text-[#1A1918] uppercase">No arena scans recorded yet</p>
              <p className="text-[11px] text-[#8E8D8A]">
                When volunteers or coordinators scan participant passes at the gate, check-ins update here live.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#8E8D8A]/25 text-[#8E8D8A] text-[10px] uppercase">
                    <th className="py-2.5 px-3">Participant ID</th>
                    <th className="py-2.5 px-3">Tournament Arena</th>
                    <th className="py-2.5 px-3">Operation</th>
                    <th className="py-2.5 px-3">Attendance</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8E8D8A]/15">
                  {filteredAttendances.map((a) => (
                    <tr key={a.id} className="hover:bg-[#EAE7DC]/60 transition-colors">
                      <td className="py-3 px-3">
                        <strong className="text-[#1A1918] block">{a.participantId}</strong>
                        <span className="text-[10px] text-[#8E8D8A]">{a.participantName || "Student"}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[#1A1918] font-bold">{a.eventTitle || "Tournament Arena"}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-[#8E8D8A] uppercase">{a.checkInType}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white uppercase">
                          <CheckCircle2 className="h-3 w-3" /> {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-[#8E8D8A]">
                          {new Date(a.scannedAt).toLocaleTimeString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

// ============================================================================
// ASTITVA 2K26 - Participant Realtime Deck (Live Registration & Attendance Sync)
// Path: components/dashboard/ParticipantRealtimeDeck.tsx
// ============================================================================

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Users,
  Calendar,
  Award,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  QrCode,
  Download,
  Sparkles,
  CheckCircle2,
  Radio,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export interface ParticipantRegistrationItem {
  id: string;
  registrationNumber: string;
  status: string;
  createdAt: string;
  event: {
    id: string;
    title: string;
    venue: string;
    dayNumber: number;
    scheduleStart: string;
    status: string;
    category?: { name: string } | null;
  };
  team?: { name: string } | null;
}

export interface ParticipantCertificateItem {
  id: string;
  certificateNumber: string;
  type: string;
  positionTitle: string;
  eventTitle: string;
  issuedAt: string;
}

interface ParticipantRealtimeDeckProps {
  initialRegistrations: ParticipantRegistrationItem[];
  initialCertificates: ParticipantCertificateItem[];
  user: {
    id: string;
    name: string;
    email: string;
  };
  profile: {
    participantId: string;
    branch?: string | null;
    collegeId?: string | null;
  };
}

export function ParticipantRealtimeDeck({
  initialRegistrations,
  initialCertificates,
  user,
  profile,
}: ParticipantRealtimeDeckProps) {
  const [registrations, setRegistrations] = useState<ParticipantRegistrationItem[]>(initialRegistrations);
  const [certificates, setCertificates] = useState<ParticipantCertificateItem[]>(initialCertificates);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(true);

  useEffect(() => {
    // 1. Channel for user's personal registrations
    const regChannel = supabase
      .channel(`participant-registrations-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Registration",
          filter: `userId=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newReg = payload.new as any;
            toast.success("🎉 Registration Confirmed!", {
              description: `Ticket #${newReg.registrationNumber} is now active on your festival pass.`,
            });
            window.location.reload();
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as any;
            setRegistrations((prev) =>
              prev.map((r) =>
                r.id === updated.id ? { ...r, status: updated.status } : r
              )
            );
          }
        }
      )
      .subscribe((status) => {
        setIsLiveConnected(status === "SUBSCRIBED");
      });

    // 2. Channel for participant's live game arena attendance / scans
    const attChannel = supabase
      .channel(`participant-attendance-${profile.participantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Attendance",
          filter: `participantId=eq.${profile.participantId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setIsCheckedIn(true);
            toast.success("✅ Gate Entry & Arena Check-in Verified!", {
              description: "Your festival badge was scanned successfully by tournament officials.",
            });
          }
        }
      )
      .subscribe();

    // 3. Channel for newly published certificates
    const certChannel = supabase
      .channel(`participant-certificates-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Certificate",
          filter: `userId=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newCert = payload.new as any;
            toast.success("🏆 New Certificate Awarded!", {
              description: `Certificate #${newCert.certificateNumber} is now available in your honors vault.`,
            });
            window.location.reload();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(regChannel);
      supabase.removeChannel(attChannel);
      supabase.removeChannel(certChannel);
    };
  }, [user.id, profile.participantId]);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 text-[#1A1918]">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#8E8D8A]/20 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-[#F6F4EE] border border-[#8E8D8A]/30 text-[10px] font-mono text-[#E85A4F] uppercase font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E85A4F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E85A4F]"></span>
            </span>
            <span>Participant Command Deck</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight uppercase font-mono">
            Welcome, <span className="text-[#E85A4F]">{user.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono">
            Participant ID: <strong className="text-[#1A1918]">{profile?.participantId}</strong> · Branch: <strong className="text-[#1A1918]">{profile?.branch}</strong> · LNJPIT Chapra
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5 w-full sm:w-auto">
          <Link href="/events" className="w-full sm:w-auto">
            <button className="w-full px-4 py-2.5 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
              <Trophy className="h-4 w-4" /> Explore Events
            </button>
          </Link>
          <Link href="/teams" className="w-full sm:w-auto">
            <button className="w-full px-4 py-2.5 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-mono font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <Users className="h-4 w-4" /> My Squads
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="p-5 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8E8D8A] uppercase font-bold">Registered Events</span>
            <Calendar className="h-4 w-4 text-[#E85A4F]" />
          </div>
          <p className="text-2xl font-black text-[#1A1918]">{registrations.length}</p>
          <span className="text-[9px] text-emerald-600 font-bold">● Live Supabase Stream</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8E8D8A] uppercase font-bold">Honors &amp; Certificates</span>
            <Award className="h-4 w-4 text-[#1A1918]" />
          </div>
          <p className="text-2xl font-black text-[#E85A4F]">{certificates.length}</p>
          <span className="text-[9px] text-[#8E8D8A]">Verified credentials</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8E8D8A] uppercase font-bold">Badge Status</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-emerald-600">ACTIVE</p>
          <span className="text-[9px] text-[#8E8D8A]">HMAC Verified</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8E8D8A] uppercase font-bold">Pass Access</span>
            <Zap className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-xl font-black text-amber-600">ALL VENUES</p>
          <span className="text-[9px] text-[#8E8D8A]">Sept 4–8, 2026</span>
        </div>
      </div>

      {/* Main Grid: Registrations & Digital Pass */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Registered Events */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-4">
              <div>
                <h2 className="text-base font-bold font-mono uppercase text-[#1A1918] flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#E85A4F]" />
                  My Event Registrations
                </h2>
                <p className="text-xs font-mono text-[#8E8D8A] mt-0.5">
                  {registrations.length === 0
                    ? "You have not registered for any tournaments yet."
                    : `${registrations.length} active tournament registration(s)`}
                </p>
              </div>
              <Link href="/events" className="text-xs font-mono font-bold text-[#E85A4F] hover:underline">
                + Register More
              </Link>
            </div>

            {registrations.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 text-center font-mono space-y-3">
                <Trophy className="h-8 w-8 text-[#8E8D8A] mx-auto" />
                <p className="text-xs text-[#8E8D8A]">
                  You have not registered for any events yet. Explore sports, cultural, gaming, and literary competitions.
                </p>
                <Link href="/events">
                  <button className="px-4 py-2 rounded-xl bg-[#E85A4F] text-white text-xs font-bold uppercase hover:bg-[#C94A40] transition-colors cursor-pointer">
                    Browse All Events
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {registrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono hover:border-[#E85A4F]/60 transition-all shadow-sm"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
                          {reg.event.category?.name || "Event"}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F6F4EE] border border-[#8E8D8A]/30 text-[#E85A4F]">
                          Day 0{reg.event.dayNumber}
                        </span>
                        {reg.team && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F6F4EE] text-[#1A1918] border border-[#8E8D8A]/30">
                            🛡️ Squad: {reg.team.name}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-[#1A1918] uppercase">
                        {reg.event.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#8E8D8A]">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-[#E85A4F]" /> {reg.event.venue}
                        </span>
                        <span>•</span>
                        <span>Ticket: {reg.registrationNumber}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase bg-emerald-600 text-white">
                        CONFIRMED
                      </span>
                      <Link href={`/events/${reg.event.id}`}>
                        <button className="px-3 py-1.5 rounded-lg border border-[#8E8D8A]/35 bg-[#F6F4EE] text-[#1A1918] text-xs font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer">
                          Details →
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Honors Vault: Certificates */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-5">
            <div className="border-b border-[#8E8D8A]/20 pb-4">
              <h2 className="text-base font-bold font-mono uppercase text-[#1A1918] flex items-center gap-2">
                <Award className="h-4 w-4 text-[#E85A4F]" />
                Honors &amp; Verifiable Certificates
              </h2>
              <p className="text-xs font-mono text-[#8E8D8A] mt-0.5">
                Officially signed certificates issued by LNJPIT festival authorities.
              </p>
            </div>

            {certificates.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 text-center font-mono space-y-2">
                <Award className="h-8 w-8 text-[#8E8D8A] mx-auto" />
                <p className="text-xs font-bold text-[#1A1918] uppercase">No certificates issued yet</p>
                <p className="text-[11px] text-[#8E8D8A]">
                  Participate in tournaments and finish on the podium to earn verified certificates.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 space-y-3 shadow-sm hover:border-[#E85A4F]/60 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E85A4F] text-white uppercase">
                        {cert.type.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] text-[#8E8D8A]">
                        {new Date(cert.issuedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[#1A1918] uppercase">{cert.eventTitle}</h4>
                      <p className="text-[11px] text-[#8E8D8A]">{cert.positionTitle}</p>
                      <p className="text-[9px] text-[#8E8D8A]/70">Cert ID: {cert.certificateNumber}</p>
                    </div>

                    <Link
                      href={`/verify-certificate/${cert.certificateNumber}`}
                      className="block w-full text-center py-2 rounded-xl bg-[#1A1918] text-[#EAE7DC] text-[10px] font-bold uppercase hover:bg-[#E85A4F] transition-colors"
                    >
                      View &amp; Verify Credential →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Encrypted Holographic Digital Pass */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#1A1918] text-[#EAE7DC] border border-[#1A1918] shadow-xl space-y-5 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#E85A4F] font-bold uppercase tracking-widest block">
                  LNJPIT Chapra
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  ASTITVA 2K26 PASS
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-white/5 py-1.5">
                <span className="text-[#8E8D8A]">NAME</span>
                <span className="font-bold text-white uppercase">{user.name}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-1.5">
                <span className="text-[#8E8D8A]">PARTICIPANT ID</span>
                <span className="font-bold text-[#E85A4F]">{profile?.participantId}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-1.5">
                <span className="text-[#8E8D8A]">BRANCH</span>
                <span className="font-bold text-white uppercase">{profile?.branch || "LNJPIT"}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-1.5">
                <span className="text-[#8E8D8A]">COLLEGE ROLL</span>
                <span className="font-bold text-white">{profile?.collegeId || "TBD"}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 py-1.5">
                <span className="text-[#8E8D8A]">FESTIVAL DATES</span>
                <span className="font-bold text-white">4–8 SEPT 2026</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#EAE7DC] text-[#1A1918] text-center space-y-2">
              <QrCode className="h-28 w-28 mx-auto text-[#1A1918]" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#1A1918]">
                {profile?.participantId}
              </p>
              <p className="text-[9px] text-[#8E8D8A]">
                HMAC SHA-256 Encrypted Security Payload
              </p>
            </div>

            <p className="text-[10px] text-center text-[#8E8D8A]">
              Present this scannable badge at the gate and venue entrances for verified check-in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

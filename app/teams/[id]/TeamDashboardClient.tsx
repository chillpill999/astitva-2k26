"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Crown,
  Trophy,
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Trash2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { InviteCodeCard } from "@/components/teams/InviteCodeCard";
import { TeamRosterTable } from "@/components/teams/TeamRosterTable";
import { TeamData } from "@/lib/teams/types";
import { finalizeTeamRegistration, disbandTeam } from "@/lib/teams/actions";

interface TeamDashboardClientProps {
  initialTeam: TeamData;
}

export function TeamDashboardClient({ initialTeam }: TeamDashboardClientProps) {
  const router = useRouter();
  const [team, setTeam] = useState<TeamData>(initialTeam);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isCaptain = team.isCaptain ?? false;
  const isRegistered = team.status === "REGISTERED";
  const isReady = team.status === "READY";
  const isForming = team.status === "FORMING";

  const neededMembers = Math.max(0, team.minMembers - team.approvedMemberCount);
  const capacityPct = Math.min(
    100,
    Math.round((team.approvedMemberCount / (team.maxMembers || 1)) * 100)
  );

  const handleFinalizeRegistration = async () => {
    setLoadingAction("FINALIZE");
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await finalizeTeamRegistration(team.id);
      if (res.success && res.data) {
        setSuccessMessage(
          `Squad officially registered! Official Ticket: ${res.data.registrationNumber}`
        );
        setTeam((prev) => ({
          ...prev,
          status: "REGISTERED",
          registrationNumber: res.data?.registrationNumber,
        }));
      } else {
        setErrorMessage(res.error || "Failed to finalize squad registration.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDisbandTeam = async () => {
    if (!window.confirm(`Are you sure you want to disband squad "${team.name}"? This action cannot be undone.`)) {
      return;
    }

    setLoadingAction("DISBAND");
    setErrorMessage(null);

    try {
      const res = await disbandTeam(team.id);
      if (res.success) {
        router.push("/teams");
      } else {
        setErrorMessage(res.error || "Failed to disband squad.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-8 text-[#1A1918]">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
                {team.event?.category?.name || "Tournament"}
              </span>

              {isCaptain && (
                <span className="bg-[#EAE7DC] text-[#E85A4F] border border-[#8E8D8A]/25 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  YOU ARE CAPTAIN
                </span>
              )}

              {isRegistered ? (
                <span className="bg-[#EAE7DC] text-[#E85A4F] border border-[#8E8D8A]/25 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  REGISTERED &amp; VERIFIED
                </span>
              ) : isReady ? (
                <span className="bg-[#EAE7DC] text-[#1A1918] border border-[#8E8D8A]/25 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                  READY TO REGISTER
                </span>
              ) : (
                <span className="bg-[#EAE7DC] text-[#8E8D8A] border border-[#8E8D8A]/25 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                  ROSTER FORMING (NEED {neededMembers} MORE)
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              {team.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8E8D8A]">
              <Link
                href={`/events/${team.event?.id}`}
                className="hover:text-[#1A1918] flex items-center gap-1"
              >
                <Trophy className="h-3.5 w-3.5 text-[#E85A4F]" />
                <span>{team.event?.title || "Tournament"}</span>
                <ExternalLink className="h-3 w-3 ml-0.5" />
              </Link>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#E85A4F]" />
                {team.event?.venue}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#E85A4F]" />
                Day 0{team.event?.dayNumber}
              </span>
            </div>
          </div>

          {/* Captain Actions Panel */}
          {isCaptain && !isRegistered && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                disabled={!isReady || !!loadingAction}
                onClick={handleFinalizeRegistration}
                className="py-3 px-6 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#E85A4F] hover:bg-[#C94A40] text-white disabled:opacity-50 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                {loadingAction === "FINALIZE" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    SUBMITTING...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    CONFIRM SQUAD REGISTRATION
                  </>
                )}
              </button>

              <button
                disabled={!!loadingAction}
                onClick={handleDisbandTeam}
                className="py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#E85A4F] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                DISBAND
              </button>
            </div>
          )}
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-100 border border-red-300 text-xs font-mono text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-xs font-mono text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Roster Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-[#8E8D8A]/20">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#8E8D8A]">Roster Formation:</span>
            <span className="font-bold text-[#1A1918]">
              {team.approvedMemberCount} / {team.maxMembers} Players
              <span className="text-[10px] text-[#8E8D8A] ml-1">
                (Min required: {team.minMembers})
              </span>
            </span>
          </div>
          <div className="w-full bg-[#EAE7DC] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#E85A4F] h-full rounded-full transition-all duration-500"
              style={{ width: `${capacityPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Roster Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-mono text-[#1A1918] uppercase">Active Squad Roster</h2>
              <p className="text-xs text-[#8E8D8A] font-mono">
                {isCaptain
                  ? "Manage squad approvals and player positions."
                  : "View enrolled squad teammates."}
              </p>
            </div>
          </div>

          <TeamRosterTable
            teamId={team.id}
            members={team.members || []}
            isCaptain={isCaptain}
          />
        </div>

        {/* Right Column (4 cols): Invite Code & Share Card */}
        <div className="lg:col-span-4 space-y-6">
          <InviteCodeCard
            code={team.code}
            teamName={team.name}
            eventTitle={team.event?.title}
            maxMembers={team.maxMembers}
          />
        </div>
      </div>
    </div>
  );
}

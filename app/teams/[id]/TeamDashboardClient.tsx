"use client";

// ============================================================================
// ASTITVA 2K26 - Squad Dashboard Client Component
// Path: app/teams/[id]/TeamDashboardClient.tsx
// ============================================================================

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
    <div className="space-y-8">
      {/* Success / Error Alerts */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3 text-xs text-emerald-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-sm text-white">Squad Registration Confirmed</p>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-xs text-red-300">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hero Card */}
      <div className="rounded-3xl bg-[#0b0f19]/90 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs font-mono font-bold bg-cyan-950/40 text-cyan-300 border-cyan-500/30">
                {team.event?.category?.name || "Tournament"}
              </Badge>

              {isRegistered ? (
                <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5 text-cyan-400" />
                  OFFICIALLY REGISTERED
                </Badge>
              ) : isReady ? (
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-emerald-400" />
                  READY FOR REGISTRATION
                </Badge>
              ) : (
                <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                  <Users className="mr-1 h-3.5 w-3.5 text-amber-400" />
                  FORMING (NEED {neededMembers} MORE)
                </Badge>
              )}

              {isCaptain && (
                <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                  <Crown className="mr-1 h-3.5 w-3.5 text-amber-400" />
                  YOU ARE CAPTAIN
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {team.name}
            </h1>

            {team.event && (
              <Link
                href={`/events/${team.event.slug || team.event.id}`}
                className="inline-flex items-center gap-1.5 text-sm text-cyan-300 hover:text-cyan-200 transition-colors font-medium"
              >
                <span>Tournament: {team.event.title}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          {/* Captain Main Action / Disband */}
          {isCaptain && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {!isRegistered && (
                <Button
                  disabled={!isReady || loadingAction === "FINALIZE"}
                  onClick={handleFinalizeRegistration}
                  className={`text-xs font-bold py-5 px-6 rounded-xl shadow-lg transition-all ${
                    isReady
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 animate-pulse"
                      : "bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed"
                  }`}
                >
                  {loadingAction === "FINALIZE" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Registration...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Finalize Squad Registration
                    </>
                  )}
                </Button>
              )}

              <Button
                variant="outline"
                disabled={loadingAction === "DISBAND"}
                onClick={handleDisbandTeam}
                className="text-xs font-bold border-red-500/30 text-red-400 hover:bg-red-950/30 py-5"
              >
                {loadingAction === "DISBAND" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Disband Squad
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Capacity Progress Bar */}
        <div className="space-y-2 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Roster Capacity Gauge:</span>
            <span className="text-white font-bold">
              {team.approvedMemberCount} / {team.maxMembers} Players
              <span className="text-slate-400 ml-1.5 font-normal">
                (Min: {team.minMembers}, Max: {team.maxMembers})
              </span>
            </span>
          </div>
          <Progress
            value={capacityPct}
            className={`h-2.5 bg-white/10 ${
              isReady || isRegistered ? "[&>div]:bg-emerald-400" : "[&>div]:bg-amber-400"
            }`}
          />
        </div>
      </div>

      {/* 2-Column Grid: Left Roster Table (8 cols), Right Invite Code & Rules (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Roster Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-400" />
                <h2 className="text-xl font-black text-white">Squad Roster</h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {team.approvedMemberCount} Active Members
              </span>
            </div>

            <TeamRosterTable
              teamId={team.id}
              members={team.members}
              isCaptain={isCaptain}
              onRosterUpdated={() => {
                window.location.reload();
              }}
            />
          </div>
        </div>

        {/* Right Column: Invite Code Card & Venue Specs */}
        <div className="lg:col-span-4 space-y-6">
          {/* Invite Code Card */}
          <InviteCodeCard
            code={team.code}
            teamName={team.name}
            eventTitle={team.event?.title}
            maxMembers={team.maxMembers}
          />

          {/* Tournament Logistics Summary */}
          {team.event && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3 text-xs font-mono">
              <h4 className="text-sm font-bold font-sans text-white">Match Logistics</h4>
              <div className="space-y-2 text-slate-300 pt-1 border-t border-white/10">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{team.event.venue}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{new Date(team.event.scheduleStart).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

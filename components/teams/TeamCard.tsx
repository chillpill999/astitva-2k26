"use client";

// ============================================================================
// ASTITVA 2K26 - Squad Overview Card Component
// Path: components/teams/TeamCard.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import { Users, Crown, ChevronRight, Trophy, ShieldCheck, QrCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TeamData } from "@/lib/teams/types";

interface TeamCardProps {
  team: TeamData;
}

export function TeamCard({ team }: TeamCardProps) {
  const isCaptain = team.isCaptain;
  const isRegistered = team.status === "REGISTERED";
  const isReady = team.status === "READY";
  const isForming = team.status === "FORMING";

  const neededMembers = Math.max(0, team.minMembers - team.approvedMemberCount);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-[#0b0f19]/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40">
      <div className="space-y-4">
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-2">
          <Badge
            variant="outline"
            className="text-[10px] font-mono font-bold bg-cyan-950/40 text-cyan-300 border-cyan-500/30"
          >
            {team.event?.category?.name || "Tournament"}
          </Badge>

          {isRegistered ? (
            <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
              <ShieldCheck className="mr-1 h-3 w-3 text-cyan-400" />
              REGISTERED
            </Badge>
          ) : isReady ? (
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
              READY FOR KICKOFF
            </Badge>
          ) : (
            <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
              NEED {neededMembers} MORE
            </Badge>
          )}
        </div>

        {/* Squad Title & Tournament */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
              {team.name}
            </h3>
            {isCaptain && (
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold">
                <Crown className="mr-1 h-3 w-3 text-amber-400" />
                CAPTAIN
              </Badge>
            )}
          </div>
          <p className="text-xs font-medium text-slate-300 line-clamp-1">
            {team.event?.title || "Tournament"}
          </p>
        </div>

        {/* Invite Code & Roster Meter */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/5 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Invite Code:</span>
            <span className="font-bold text-cyan-300 tracking-wider">{team.code}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Roster Capacity:</span>
            <span className="text-slate-200">
              <strong className="text-white">{team.approvedMemberCount}</strong> / {team.maxMembers} Players
              <span className="text-[10px] text-slate-400 ml-1">(Min: {team.minMembers})</span>
            </span>
          </div>
          {team.registrationNumber && (
            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
              <span className="text-slate-400">Reg Ticket:</span>
              <span className="font-bold text-emerald-400">{team.registrationNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-400">
          Captain: <strong className="text-slate-200">{team.captain?.name || "Captain"}</strong>
        </span>

        <Link href={`/teams/${team.id}`}>
          <Button
            size="sm"
            className="text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20"
          >
            {isCaptain ? "Manage Squad" : "View Squad"}
            <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

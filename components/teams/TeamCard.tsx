"use client";

import React from "react";
import Link from "next/link";
import { Users, Crown, ChevronRight, Trophy, ShieldCheck } from "lucide-react";
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
    <div className="group relative flex flex-col justify-between rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-7 shadow-sm transition-all duration-300 hover:border-[#E85A4F] text-[#1A1918]">
      <div className="space-y-4">
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#1A1918] uppercase">
            {team.event?.category?.name || "Tournament"}
          </span>

          {isRegistered ? (
            <span className="bg-[#EAE7DC] text-[#E85A4F] border border-[#8E8D8A]/20 text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              REGISTERED
            </span>
          ) : isReady ? (
            <span className="bg-[#EAE7DC] text-[#1A1918] border border-[#8E8D8A]/20 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
              READY FOR KICKOFF
            </span>
          ) : (
            <span className="bg-[#EAE7DC] text-[#8E8D8A] border border-[#8E8D8A]/20 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
              NEED {neededMembers} MORE
            </span>
          )}
        </div>

        {/* Squad Title & Tournament */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold font-mono text-[#1A1918] group-hover:text-[#E85A4F] transition-colors uppercase">
              {team.name}
            </h3>
            {isCaptain && (
              <span className="bg-[#1A1918] text-[#EAE7DC] text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <Crown className="h-2.5 w-2.5 text-[#E85A4F]" />
                CAPTAIN
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-[#8E8D8A] line-clamp-1">
            {team.event?.title || "Tournament"}
          </p>
        </div>

        {/* Invite Code & Roster Meter */}
        <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[#8E8D8A]">Invite Code:</span>
            <span className="font-bold text-[#E85A4F] tracking-wider">{team.code}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#8E8D8A]">Roster:</span>
            <span className="text-[#1A1918]">
              <strong>{team.approvedMemberCount}</strong> / {team.maxMembers} Players
              <span className="text-[10px] text-[#8E8D8A] ml-1">(Min: {team.minMembers})</span>
            </span>
          </div>
          {team.registrationNumber && (
            <div className="flex items-center justify-between pt-1 border-t border-[#8E8D8A]/15 text-[11px]">
              <span className="text-[#8E8D8A]">Ticket:</span>
              <span className="font-bold text-[#E85A4F]">{team.registrationNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-[#8E8D8A]/20 flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#8E8D8A]">
          Captain: <strong className="text-[#1A1918]">{team.captain?.name || "Captain"}</strong>
        </span>

        <Link href={`/teams/${team.id}`}>
          <span className="text-xs font-mono font-bold text-[#E85A4F] hover:underline flex items-center gap-1 cursor-pointer">
            MANAGE ROSTER <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}

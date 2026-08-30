// ============================================================================
// ASTITVA 2K26 - Squad Management Hub Portal (Exteta Luxury Aesthetic)
// Path: app/teams/page.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import {
  Users,
  PlusCircle,
  KeyRound,
  Crown,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { getUserTeams } from "@/lib/teams/actions";
import { TeamCard } from "@/components/teams/TeamCard";

export const metadata = {
  title: "Squad Management Hub | ASTITVA 2K26 LNJPIT Chapra",
  description: "View, manage, or join tournament squads for ASTITVA 2K26 festival competitions.",
};

export default async function TeamsHubPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in?callbackUrl=/teams");
  }

  const res = await getUserTeams();
  const teams = res.data || [];

  const captainTeams = teams.filter((t) => t.isCaptain);
  const memberTeams = teams.filter((t) => !t.isCaptain);

  return (
    <div className="w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="container max-w-7xl mx-auto space-y-10">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-8 sm:p-12 shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
                  SQUAD MANAGEMENT HUB
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#EAE7DC] border border-[#8E8D8A]/25 text-[#E85A4F] uppercase">
                  DYNAMIC ROSTER ENGINE
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
                YOUR TOURNAMENT <span className="text-[#E85A4F]">SQUADS</span>
              </h1>
              <p className="text-sm sm:text-base text-[#8E8D8A] font-mono">
                Form squads with classmates, manage your team roster with 6-character invite codes, and compete for inter-branch glory at ASTITVA 2K26.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link href="/teams/create">
                <button className="w-full py-3 px-5 text-xs font-mono font-bold uppercase tracking-wider bg-[#E85A4F] hover:bg-[#C94A40] text-white rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create New Squad
                </button>
              </Link>

              <Link href="/teams/join">
                <button className="w-full py-3 px-5 text-xs font-mono font-bold uppercase tracking-wider border border-[#8E8D8A]/35 bg-[#EAE7DC] hover:bg-[#1A1918] hover:text-[#EAE7DC] text-[#1A1918] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
                  <KeyRound className="h-4 w-4 text-[#E85A4F]" />
                  Join with Code
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Squads You Captain */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-4">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-[#E85A4F]" />
              <h2 className="text-xl font-bold font-mono text-[#1A1918] uppercase">Squads You Captain</h2>
              <span className="bg-[#EAE7DC] text-[#E85A4F] border border-[#8E8D8A]/25 text-xs font-mono font-bold px-2 py-0.5 rounded">
                {captainTeams.length}
              </span>
            </div>

            <Link href="/teams/create">
              <span className="text-xs font-mono text-[#E85A4F] hover:underline cursor-pointer">
                + CREATE SQUAD
              </span>
            </Link>
          </div>

          {captainTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {captainTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl p-8 text-center bg-[#F6F4EE] border border-[#8E8D8A]/25 space-y-3">
              <Users className="h-8 w-8 text-[#8E8D8A] mx-auto" />
              <h3 className="text-sm font-bold text-[#1A1918] font-mono uppercase">You Haven&apos;t Created Any Squads</h3>
              <p className="text-xs text-[#8E8D8A] font-mono max-w-sm mx-auto">
                Take the lead! Create a squad for Cricket, Football, BGMI, Volleyball or Free Fire and recruit your players.
              </p>
              <Link href="/teams/create">
                <button className="px-4 py-2 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-colors mt-2">
                  Create Squad →
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Squads You Joined as a Member */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#1A1918]" />
              <h2 className="text-xl font-bold font-mono text-[#1A1918] uppercase">Squads You Joined</h2>
              <span className="bg-[#EAE7DC] text-[#1A1918] border border-[#8E8D8A]/25 text-xs font-mono font-bold px-2 py-0.5 rounded">
                {memberTeams.length}
              </span>
            </div>

            <Link href="/teams/join">
              <span className="text-xs font-mono text-[#E85A4F] hover:underline cursor-pointer">
                + JOIN SQUAD
              </span>
            </Link>
          </div>

          {memberTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memberTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl p-8 text-center bg-[#F6F4EE] border border-[#8E8D8A]/25 space-y-3">
              <KeyRound className="h-8 w-8 text-[#8E8D8A] mx-auto" />
              <h3 className="text-sm font-bold text-[#1A1918] font-mono uppercase">Not Enrolled in Any Member Squads</h3>
              <p className="text-xs text-[#8E8D8A] font-mono max-w-sm mx-auto">
                Got a 6-character team invite code from a squad captain? Enter it to join their tournament lineup.
              </p>
              <Link href="/teams/join">
                <button className="px-4 py-2 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-mono font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all mt-2">
                  Enter Invite Code →
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

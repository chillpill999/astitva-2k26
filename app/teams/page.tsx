// ============================================================================
// ASTITVA 2K26 - Squad Management Hub Portal
// Path: app/teams/page.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import {
  Users,
  PlusCircle,
  KeyRound,
  ShieldCheck,
  Crown,
  Sparkles,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUserTeams } from "@/lib/teams/actions";
import { TeamCard } from "@/components/teams/TeamCard";

export const metadata = {
  title: "Squad Management Hub | ASTITVA 2K26 LNJPIT Chapra",
  description: "View, manage, or join tournament squads for ASTITVA 2K26 festival competitions.",
};

export default async function TeamsHubPage() {
  const res = await getUserTeams();
  const teams = res.data || [];

  const captainTeams = teams.filter((t) => t.isCaptain);
  const memberTeams = teams.filter((t) => !t.isCaptain);

  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="container max-w-7xl mx-auto space-y-10">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0b0f19] to-cyan-950/40 border border-white/10 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 text-xs font-mono font-semibold border-cyan-500/40 text-cyan-300 bg-cyan-950/40">
                  <Users className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
                  SQUAD MANAGEMENT HUB
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-xs font-mono font-semibold border-purple-500/40 text-purple-300 bg-purple-950/40">
                  DYNAMIC ROSTER ENGINE
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
                YOUR TOURNAMENT <span className="cyber-gradient-text">SQUADS</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300">
                Form squads with classmates, manage your team roster with 6-character invite codes, and compete for inter-branch glory at ASTITVA 2K26.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link href="/teams/create">
                <Button className="w-full text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/25 py-5 px-5">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Squad
                </Button>
              </Link>

              <Link href="/teams/join">
                <Button
                  variant="outline"
                  className="w-full text-xs font-bold border-white/15 bg-white/5 hover:bg-white/10 text-white py-5 px-5"
                >
                  <KeyRound className="mr-2 h-4 w-4 text-cyan-400" />
                  Join with Code
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Squads You Captain */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-black text-white">Squads You Captain</h2>
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                {captainTeams.length}
              </Badge>
            </div>

            <Link href="/teams/create">
              <Button size="sm" variant="ghost" className="text-xs font-mono text-cyan-400 hover:text-cyan-300">
                + Create Another Squad
              </Button>
            </Link>
          </div>

          {captainTeams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {captainTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0b0f19]/60 border border-white/10 text-center space-y-3">
              <Crown className="h-10 w-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">You are not captaining any squads yet.</p>
              <Link href="/teams/create">
                <Button size="sm" className="text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white">
                  Form Your First Squad
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Squads You Have Joined */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              <h2 className="text-xl font-black text-white">Squads You Joined</h2>
              <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
                {memberTeams.length}
              </Badge>
            </div>

            <Link href="/teams/join">
              <Button size="sm" variant="ghost" className="text-xs font-mono text-purple-400 hover:text-purple-300">
                Enter Invite Code
              </Button>
            </Link>
          </div>

          {memberTeams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {memberTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0b0f19]/60 border border-white/10 text-center space-y-3">
              <Users className="h-10 w-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">You have not joined any teammate squads yet.</p>
              <Link href="/teams/join">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-bold border-white/15 bg-white/5 text-slate-200"
                >
                  Join a Squad with Code
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

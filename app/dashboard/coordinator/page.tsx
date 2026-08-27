// ============================================================================
// ASTITVA 2K26 - Event Coordinator Scoring & Ops Console
// Path: app/dashboard/coordinator/page.tsx
// ============================================================================

"use client";

import React, { useState } from "react";
import {
  Trophy,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Play,
  Save,
  Radio,
  FileCheck,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { toast } from "sonner";

const COORDINATED_EVENTS = [
  {
    id: "cricket",
    title: "Cricket Tournament (11v11)",
    category: "Sports",
    venue: "Main Ground",
    status: "ONGOING",
    teamsRegistered: 16,
    activeMatch: "LNJPIT Titans vs CE Mavericks (Quarter Final 2)",
  },
  {
    id: "bgmi",
    title: "BGMI LAN Invitational Battle (4v4)",
    category: "Gaming",
    venue: "Central Seminar Hall",
    status: "REGISTRATION_CLOSED",
    teamsRegistered: 32,
    activeMatch: "Lobby 1 - Erangel Round 1 (14:00 hrs)",
  },
  {
    id: "chess",
    title: "Grandmaster Chess Blitz (1v1)",
    category: "Sports",
    venue: "Gymnasium Hall",
    status: "ONGOING",
    teamsRegistered: 64,
    activeMatch: "Board 1: Aman Verma (ME) vs Sneha Kumari (CE)",
  },
];

export default function CoordinatorDashboardPage() {
  const [selectedEvent, setSelectedEvent] = useState("cricket");
  const [scoreForm, setScoreForm] = useState({
    teamA: "LNJPIT Titans",
    teamB: "CE Mavericks",
    scoreA: "142/4 (12.0 ov)",
    scoreB: "98/7 (10.2 ov)",
    round: "Quarter-Final",
    winner: "LNJPIT Titans",
  });

  const [podiumForm, setPodiumForm] = useState({
    winner: "LNJPIT Titans (ME/CSE)",
    firstRunner: "CE Mavericks (CE)",
    secondRunner: "EE Thunderbolts (EE)",
  });

  const handleScoreUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Match Score Updated & Broadcasted!", {
      description: `${scoreForm.teamA}: ${scoreForm.scoreA} vs ${scoreForm.teamB}: ${scoreForm.scoreB}`,
    });
  };

  const handlePublishPodium = () => {
    toast.success("Official Podium Results Published!", {
      description: `Winner: ${podiumForm.winner} • Certificates queued for generation`,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <RoleBadge role="EVENT_COORDINATOR" />
            <span className="text-xs font-mono text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
              Prof. Rajesh Ranjan
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Event Coordinator Scoring & Management Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time match scoring, live result entry, podium publication, and tournament roster oversight.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple" className="text-xs font-mono py-1 px-3">
            <Radio className="w-3 h-3 mr-1.5 animate-pulse" />
            Scoring Terminal Active
          </Badge>
        </div>
      </div>

      {/* 2. Coordinated Tournaments Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COORDINATED_EVENTS.map((evt) => (
          <Card
            key={evt.id}
            onClick={() => setSelectedEvent(evt.id)}
            className={`glass-panel border p-5 space-y-3 cursor-pointer transition-all ${
              selectedEvent === evt.id
                ? "border-purple-500/60 bg-purple-500/10 shadow-lg shadow-purple-500/15"
                : "border-white/10 bg-slate-900/70 hover:border-purple-500/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px] font-mono border-purple-500/40 text-purple-300">
                {evt.category}
              </Badge>
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                {evt.status}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">{evt.title}</h3>
            <div className="text-xs text-slate-400 space-y-1">
              <p>📍 {evt.venue}</p>
              <p>👥 {evt.teamsRegistered} Teams Confirmed</p>
              <p className="text-purple-300 font-mono text-[11px] pt-1 truncate">
                ⚡ {evt.activeMatch}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* 3. Live Match Score Entry Terminal & Podium Publisher Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Live Match Score Entry Terminal (7 cols) */}
        <Card className="lg:col-span-7 glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
          <CardHeader className="pb-3 border-b border-white/10">
            <CardTitle className="text-base font-bold text-white flex items-center">
              <Play className="w-4 h-4 text-cyan-400 mr-2" />
              Live Match Score Entry Terminal
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Update scores in real-time. Changes instantly sync with public leaderboards.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <form onSubmit={handleScoreUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Team / Player A</label>
                  <Input
                    value={scoreForm.teamA}
                    onChange={(e) => setScoreForm({ ...scoreForm, teamA: e.target.value })}
                    className="bg-slate-950/80 border-white/10 text-white text-xs font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Score / Tally A</label>
                  <Input
                    value={scoreForm.scoreA}
                    onChange={(e) => setScoreForm({ ...scoreForm, scoreA: e.target.value })}
                    className="bg-slate-950/80 border-white/10 text-cyan-300 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Team / Player B</label>
                  <Input
                    value={scoreForm.teamB}
                    onChange={(e) => setScoreForm({ ...scoreForm, teamB: e.target.value })}
                    className="bg-slate-950/80 border-white/10 text-white text-xs font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Score / Tally B</label>
                  <Input
                    value={scoreForm.scoreB}
                    onChange={(e) => setScoreForm({ ...scoreForm, scoreB: e.target.value })}
                    className="bg-slate-950/80 border-white/10 text-purple-300 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Tournament Stage</label>
                  <Input
                    value={scoreForm.round}
                    onChange={(e) => setScoreForm({ ...scoreForm, round: e.target.value })}
                    className="bg-slate-950/80 border-white/10 text-white text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Current Leader / Winner</label>
                  <Input
                    value={scoreForm.winner}
                    onChange={(e) => setScoreForm({ ...scoreForm, winner: e.target.value })}
                    className="bg-slate-950/80 border-white/10 text-emerald-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <Button type="submit" variant="neonCyan" className="w-full text-xs font-bold py-2.5">
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Publish Live Score Update
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right: Podium Winner Finalizer (5 cols) */}
        <Card className="lg:col-span-5 glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
          <CardHeader className="pb-3 border-b border-white/10">
            <CardTitle className="text-base font-bold text-white flex items-center">
              <Trophy className="w-4 h-4 text-amber-400 mr-2" />
              Podium Winner Publisher
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Finalize tournament standings and trigger verifiable certificate generation.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-400 flex items-center">
                🥇 1st Place (Winner)
              </label>
              <Input
                value={podiumForm.winner}
                onChange={(e) => setPodiumForm({ ...podiumForm, winner: e.target.value })}
                className="bg-slate-950/80 border-amber-500/30 text-white font-semibold text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center">
                🥈 2nd Place (1st Runner Up)
              </label>
              <Input
                value={podiumForm.firstRunner}
                onChange={(e) => setPodiumForm({ ...podiumForm, firstRunner: e.target.value })}
                className="bg-slate-950/80 border-white/10 text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-600 flex items-center">
                🥉 3rd Place (2nd Runner Up)
              </label>
              <Input
                value={podiumForm.secondRunner}
                onChange={(e) => setPodiumForm({ ...podiumForm, secondRunner: e.target.value })}
                className="bg-slate-950/80 border-white/10 text-white text-xs"
              />
            </div>

            <Button
              type="button"
              onClick={handlePublishPodium}
              variant="neonPurple"
              className="w-full text-xs font-bold py-2.5 mt-2"
            >
              <FileCheck className="w-3.5 h-3.5 mr-1.5" />
              Confirm & Issue Certificates
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

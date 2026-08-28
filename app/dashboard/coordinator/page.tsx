// ============================================================================
// ASTITVA 2K26 - Event Coordinator Scoring & Ops Console (Exteta Luxury Aesthetic)
// Path: app/dashboard/coordinator/page.tsx
// ============================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Users,
  Award,
  Play,
  Save,
  Radio,
  FileCheck,
} from "lucide-react";
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
    <div className="space-y-8 animate-in fade-in-50 duration-300 text-[#1A1918]">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#8E8D8A]/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <RoleBadge role="EVENT_COORDINATOR" />
            <span className="text-xs font-mono text-[#E85A4F] font-bold bg-[#EAE7DC] px-2 py-0.5 rounded border border-[#8E8D8A]/20">
              Prof. Rajesh Ranjan
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1918] tracking-tight uppercase font-mono">
            Coordinator Scoring &amp; Operations
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono">
            Manage live match fixtures, push real-time score updates, and finalize official podium results.
          </p>
        </div>

        <Link href="/dashboard/coordinator/results">
          <button className="px-4 py-2 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-colors flex items-center gap-1.5 shadow-sm">
            <Trophy className="w-3.5 h-3.5" />
            Official Results Entry
          </button>
        </Link>
      </div>

      {/* 2. Coordinated Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COORDINATED_EVENTS.map((evt) => (
          <div
            key={evt.id}
            onClick={() => setSelectedEvent(evt.id)}
            className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-sm space-y-3 font-mono ${
              selectedEvent === evt.id
                ? "bg-[#F6F4EE] border-[#E85A4F] ring-1 ring-[#E85A4F]"
                : "bg-[#F6F4EE] border-[#8E8D8A]/25 hover:border-[#E85A4F]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#1A1918] uppercase">
                {evt.category}
              </span>
              <span className="text-[9px] font-bold text-[#E85A4F]">
                {evt.status}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#1A1918] uppercase">{evt.title}</h3>
            <p className="text-[11px] text-[#8E8D8A]">{evt.venue}</p>
            <div className="pt-2 border-t border-[#8E8D8A]/15 text-[10px] text-[#8E8D8A] flex justify-between">
              <span>{evt.teamsRegistered} Teams / Enrolled</span>
              <span className="text-[#E85A4F] font-bold">Select →</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Real-Time Score Updater Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-4">
            <div>
              <h2 className="text-base font-bold font-mono text-[#1A1918] uppercase flex items-center">
                <Radio className="w-4 h-4 text-[#E85A4F] mr-2" /> Live Match Telemetry
              </h2>
              <p className="text-xs text-[#8E8D8A] font-mono mt-1">
                Push live scores to attendee dashboards and public tickers.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#E85A4F] uppercase border border-[#8E8D8A]/20">
              LIVE BROADCAST
            </span>
          </div>

          <form onSubmit={handleScoreUpdate} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-[#8E8D8A] uppercase">Team / Participant A</label>
                <input
                  type="text"
                  value={scoreForm.teamA}
                  onChange={(e) => setScoreForm({ ...scoreForm, teamA: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] focus:outline-none focus:border-[#E85A4F]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[#8E8D8A] uppercase">Team / Participant B</label>
                <input
                  type="text"
                  value={scoreForm.teamB}
                  onChange={(e) => setScoreForm({ ...scoreForm, teamB: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] focus:outline-none focus:border-[#E85A4F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-[#8E8D8A] uppercase">Score A</label>
                <input
                  type="text"
                  value={scoreForm.scoreA}
                  onChange={(e) => setScoreForm({ ...scoreForm, scoreA: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] focus:outline-none focus:border-[#E85A4F]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[#8E8D8A] uppercase">Score B</label>
                <input
                  type="text"
                  value={scoreForm.scoreB}
                  onChange={(e) => setScoreForm({ ...scoreForm, scoreB: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] focus:outline-none focus:border-[#E85A4F]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" /> Broadcast Live Score
              </button>
            </div>
          </form>
        </div>

        {/* Right: Quick Podium Finalization */}
        <div className="lg:col-span-5 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 shadow-sm space-y-4">
          <div className="border-b border-[#8E8D8A]/20 pb-4">
            <h2 className="text-base font-bold font-mono text-[#1A1918] uppercase flex items-center">
              <Award className="w-4 h-4 text-[#E85A4F] mr-2" /> Podium Finalization
            </h2>
            <p className="text-xs text-[#8E8D8A] font-mono mt-1">
              Trigger automated merit certificate generation and leaderboard points.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-[#8E8D8A] uppercase">🥇 1st Place (Champion)</label>
              <input
                type="text"
                value={podiumForm.winner}
                onChange={(e) => setPodiumForm({ ...podiumForm, winner: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] focus:outline-none focus:border-[#E85A4F]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#8E8D8A] uppercase">🥈 2nd Place (Runner-Up)</label>
              <input
                type="text"
                value={podiumForm.firstRunner}
                onChange={(e) => setPodiumForm({ ...podiumForm, firstRunner: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] focus:outline-none focus:border-[#E85A4F]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#8E8D8A] uppercase">🥉 3rd Place (2nd Runner-Up)</label>
              <input
                type="text"
                value={podiumForm.secondRunner}
                onChange={(e) => setPodiumForm({ ...podiumForm, secondRunner: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] focus:outline-none focus:border-[#E85A4F]"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handlePublishPodium}
                className="w-full py-2.5 rounded-xl bg-[#1A1918] text-[#EAE7DC] text-xs font-mono font-bold uppercase hover:bg-[#E85A4F] transition-colors flex items-center justify-center gap-2"
              >
                <FileCheck className="w-4 h-4" /> Publish Podium &amp; Issue Certs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

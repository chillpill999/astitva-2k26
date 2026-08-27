// ============================================================================
// ASTITVA 2K26 - Participant Command Center
// Path: app/dashboard/participant/page.tsx
// Stitch Screen: 81fb3a22dc1c4e9bbc5286e0614b65df
// ============================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  QrCode,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Trophy,
  Flame,
  Download,
  Share2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import Image from "next/image";

const REGISTERED_EVENTS = [
  {
    id: "cricket-tournament",
    title: "LNJPIT Premier Cricket League",
    category: "Sports",
    venue: "Main Sports Arena (Ground A)",
    date: "4 Sept 2026, 09:00 AM",
    day: "Day 1",
    status: "Confirmed",
    teamName: "LNJPIT Titans",
    badgeColor: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
  },
  {
    id: "bgmi-championship",
    title: "BGMI LAN Invitational Battle",
    category: "Gaming",
    venue: "Central Seminar Hall (LAN Deck)",
    date: "6 Sept 2026, 02:00 PM",
    day: "Day 3",
    status: "Squad Ready",
    teamName: "Alpha Squad Chapra",
    badgeColor: "border-purple-500/30 text-purple-400 bg-purple-500/10",
  },
  {
    id: "tark-vitark",
    title: "Tark-Vitark Hindi Parliamentary Debate",
    category: "Literary",
    venue: "Auditorium Room 102",
    date: "5 Sept 2026, 11:30 AM",
    day: "Day 2",
    status: "Confirmed",
    teamName: null,
    badgeColor: "border-amber-500/30 text-amber-400 bg-amber-500/10",
  },
];

const CERTIFICATES_DATA = [
  {
    title: "Certificate of Participation",
    event: "ASTITVA 2025 - Annual Fest",
    id: "AST25-CERT-8842",
    status: "Verified & Downloadable",
    date: "Issued Sept 2025",
  },
  {
    title: "Certificate of Excellence (Runner-Up)",
    event: "Inter-Branch Coding Hackathon",
    id: "AST26-CERT-PENDING",
    status: "In Progress (Sept 2026)",
    date: "Awaiting Finals",
  },
];

export default function ParticipantDashboardPage() {
  const [activeTab, setActiveTab] = useState<"my-events" | "today">("my-events");

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Header Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <RoleBadge role="PARTICIPANT" />
            <span className="font-mono text-xs text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
              AST26-0005
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Participant Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Welcome back, <span className="text-white font-bold">Sneha Kumari</span> (CE • Sem 2). Track your passes, brackets, and check-in status.
          </p>
        </div>

        <Link href="/events">
          <Button variant="neonCyan" size="sm" className="text-xs font-bold shadow-lg">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Explore 16 Events
          </Button>
        </Link>
      </div>

      {/* 2. Top Bento Grid: 4-Step Registration Tracker (8 cols) + Digital QR Pass Widget (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: 75% Complete Progress Tracker (8 cols) */}
        <Card className="lg:col-span-8 glass-panel border-white/10 bg-slate-900/70 shadow-2xl flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mr-2" />
                  Festival Readiness & Registration Lifecycle
                </CardTitle>
                <CardDescription className="text-xs text-slate-400 mt-1">
                  Your credentials are verified. Complete remaining steps before Day 1 gate entry.
                </CardDescription>
              </div>
              <span className="font-mono text-lg font-black text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/30">
                75%
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-1.5">
              <Progress value={75} className="h-2 bg-slate-800" />
            </div>

            {/* 4-Step Progress Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-1">
                <span className="text-[10px] text-cyan-400 uppercase font-bold flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-cyan-400" /> Step 1
                </span>
                <p className="text-xs font-bold text-white">Profile Setup</p>
                <span className="text-[10px] text-emerald-400 block">Completed</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-1">
                <span className="text-[10px] text-cyan-400 uppercase font-bold flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-cyan-400" /> Step 2
                </span>
                <p className="text-xs font-bold text-white">Pass Selection</p>
                <span className="text-[10px] text-emerald-400 block">All-Access Pass</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-1">
                <span className="text-[10px] text-cyan-400 uppercase font-bold flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-cyan-400" /> Step 3
                </span>
                <p className="text-xs font-bold text-white">Team Alignment</p>
                <span className="text-[10px] text-emerald-400 block">3 Events Confirmed</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-1">
                <span className="text-[10px] text-amber-400 uppercase font-bold flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-amber-400" /> Step 4
                </span>
                <p className="text-xs font-bold text-white">Gate Check-In</p>
                <span className="text-[10px] text-amber-300 block">Sept 4 Kickoff</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Digital QR Access Badge Card (4 cols) */}
        <Card className="lg:col-span-4 glass-panel border-cyan-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white tracking-wider">
                ASTITVA <span className="text-cyan-400">2K26</span>
              </span>
              <Badge variant="cyan" className="text-[10px] font-mono">
                PRO PASS
              </Badge>
            </div>

            <div className="rounded-xl bg-slate-950/90 border border-cyan-500/40 p-4 text-center space-y-2">
              <QrCode className="w-24 h-24 text-cyan-400 mx-auto" />
              <p className="font-mono text-sm font-black text-white tracking-widest">
                AST26-0005
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                HMAC-SHA256 DIGITAL GATE PASS
              </p>
            </div>
          </div>

          <Link href="/profile" className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold border-white/10 hover:border-cyan-500/40 text-slate-200 hover:text-white"
            >
              View Full Holographic Badge
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </Card>
      </div>

      {/* 3. Horizontal Registered Tournaments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              My Registered Tournaments ({REGISTERED_EVENTS.length})
            </h2>
          </div>

          <div className="flex gap-1.5 p-1 bg-slate-900 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab("my-events")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeTab === "my-events" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setActiveTab("today")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeTab === "today" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400"
              }`}
            >
              Schedule
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REGISTERED_EVENTS.map((evt) => (
            <Card
              key={evt.id}
              className="glass-panel border-white/10 bg-slate-900/70 hover:border-cyan-500/40 transition-all p-5 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={`text-[10px] font-mono ${evt.badgeColor}`}>
                    {evt.category}
                  </Badge>
                  <span className="text-[10px] font-mono text-slate-400">{evt.day}</span>
                </div>
                <h3 className="text-sm font-extrabold text-white leading-snug">
                  {evt.title}
                </h3>
                <div className="space-y-1 text-xs text-slate-400">
                  <p className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 mr-1.5 flex-shrink-0" />
                    {evt.venue}
                  </p>
                  <p className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 mr-1.5 flex-shrink-0" />
                    {evt.date}
                  </p>
                  {evt.teamName && (
                    <p className="text-purple-300 font-semibold text-[11px] pt-1">
                      Squad: {evt.teamName}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {evt.status}
                </span>
                <Link href={`/events/${evt.id}`}>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-cyan-400 hover:text-cyan-300 p-0">
                    Details <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. Verifiable Credentials & Certificates Showcase */}
      <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
        <CardHeader className="pb-3 border-b border-white/10">
          <CardTitle className="text-base font-bold text-white flex items-center">
            <Award className="w-4 h-4 text-amber-400 mr-2" />
            Verifiable Festival Credentials & PDF Certificates
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            HMAC-SHA256 cryptographically signed certificates issued by LNJPIT Organizing Committee.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 divide-y divide-white/5">
          {CERTIFICATES_DATA.map((cert) => (
            <div
              key={cert.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">{cert.title}</h4>
                <p className="text-[11px] text-slate-400">
                  {cert.event} • <span className="font-mono text-cyan-400">{cert.id}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-400">{cert.date}</span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={cert.id.includes("PENDING")}
                  className="text-xs border-white/10 text-slate-200 hover:text-white h-7"
                >
                  <Download className="w-3 h-3 mr-1.5 text-cyan-400" />
                  Download PDF
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

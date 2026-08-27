// ============================================================================
// ASTITVA 2K26 - Team Captain Squad Headquarters
// Path: app/dashboard/captain/page.tsx
// ============================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Copy,
  Check,
  Share2,
  Trophy,
  Calendar,
  UserPlus,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface SquadMember {
  id: string;
  name: string;
  roll: string;
  branch: string;
  semester: number;
  role: "CAPTAIN" | "MEMBER";
  status: "CONFIRMED" | "PENDING";
}

const INITIAL_ROSTER: SquadMember[] = [
  {
    id: "usr_capt_004",
    name: "Aman Verma (You)",
    roll: "22105128005",
    branch: "ME",
    semester: 6,
    role: "CAPTAIN",
    status: "CONFIRMED",
  },
  {
    id: "usr_part_005",
    name: "Sneha Kumari",
    roll: "24105128032",
    branch: "CE",
    semester: 2,
    role: "MEMBER",
    status: "CONFIRMED",
  },
  {
    id: "usr_mem_007",
    name: "Rahul Kumar",
    roll: "23105128019",
    branch: "CSE",
    semester: 4,
    role: "MEMBER",
    status: "CONFIRMED",
  },
];

const INITIAL_PENDING: SquadMember[] = [
  {
    id: "usr_req_008",
    name: "Rishi Raj",
    roll: "23105128077",
    branch: "EE",
    semester: 4,
    role: "MEMBER",
    status: "PENDING",
  },
];

export default function CaptainDashboardPage() {
  const [inviteCode] = useState("BG26X1");
  const [copied, setCopied] = useState(false);
  const [roster, setRoster] = useState<SquadMember[]>(INITIAL_ROSTER);
  const [pending, setPending] = useState<SquadMember[]>(INITIAL_PENDING);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success(`Invite Code ${inviteCode} copied!`, {
      description: "Share with LNJPIT classmates to join your squad.",
    });
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#06b6d4", "#f59e0b"],
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `Join my ASTITVA 2K26 squad "LNJPIT Titans" for the BGMI Championship! Use squad invite code: ${inviteCode} at https://astitva2k26.lnjpit.ac.in/teams/join/${inviteCode}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleApprove = (member: SquadMember) => {
    setPending((prev) => prev.filter((m) => m.id !== member.id));
    setRoster((prev) => [...prev, { ...member, status: "CONFIRMED" }]);
    toast.success(`Approved ${member.name} into squad!`);
  };

  const handleReject = (member: SquadMember) => {
    setPending((prev) => prev.filter((m) => m.id !== member.id));
    toast.error(`Declined application for ${member.name}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <RoleBadge role="TEAM_CAPTAIN" />
            <span className="text-xs font-mono text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              Aman Verma (ME • Sem 6)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Squad Headquarters & Roster Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Lead your LNJPIT team to championship victory across Cricket, BGMI, and Cultural group competitions.
          </p>
        </div>

        <Link href="/events">
          <Button variant="neonAmber" size="sm" className="text-xs font-bold shadow-lg">
            <Trophy className="w-3.5 h-3.5 mr-1.5" />
            Register Squad for Event
          </Button>
        </Link>
      </div>

      {/* 2. Squad Overview Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Active Squad Summary Card (7 cols) */}
        <Card className="lg:col-span-7 glass-panel border-amber-500/30 bg-slate-900/70 shadow-2xl p-6 space-y-5">
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div>
              <Badge variant="outline" className="text-[10px] font-mono border-amber-500/40 text-amber-300 mb-1">
                SQUAD #1 • GAMING
              </Badge>
              <h2 className="text-xl font-extrabold text-white">LNJPIT Titans</h2>
              <p className="text-xs text-slate-400">BGMI LAN Invitational Championship (4v4)</p>
            </div>

            <div className="text-right font-mono">
              <span className="text-sm font-bold text-amber-400">
                {roster.length} / 4 Slots Filled
              </span>
              <Progress value={(roster.length / 4) * 100} className="h-1.5 w-28 bg-slate-800 mt-1" />
            </div>
          </div>

          {/* 6-Char Invite Code Highlight Box */}
          <div className="rounded-2xl bg-slate-950/90 border border-cyan-500/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                6-Character Squad Invite Code
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-2xl font-black text-white tracking-widest bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/30">
                  {inviteCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Copy Invite Code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleShareWhatsApp}
              variant="outline"
              size="sm"
              className="text-xs font-semibold border-white/10 hover:border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Invite via WhatsApp
            </Button>
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span className="flex items-center text-emerald-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Minimum squad threshold (3) met
            </span>
            <span className="text-slate-500">1 slot remaining</span>
          </div>
        </Card>

        {/* Right: Pending Join Approvals (5 cols) */}
        <Card className="lg:col-span-5 glass-panel border-white/10 bg-slate-900/70 shadow-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center">
              <UserPlus className="w-4 h-4 text-cyan-400 mr-2" />
              Pending Join Requests ({pending.length})
            </h3>
            <Badge variant="cyan" className="text-[10px] font-mono">
              Awaiting Captain
            </Badge>
          </div>

          {pending.length > 0 ? (
            <div className="space-y-3">
              {pending.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{req.name}</p>
                    <p className="text-[10px] font-mono text-slate-400 truncate">
                      {req.roll} • {req.branch} (Sem {req.semester})
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      onClick={() => handleApprove(req)}
                      size="sm"
                      className="h-7 text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 px-2"
                    >
                      <Check className="w-3 h-3 mr-1" /> Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(req)}
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-slate-400 hover:text-red-400 px-2"
                    >
                      <XCircle className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500 space-y-1">
              <Sparkles className="w-6 h-6 text-slate-600 mx-auto mb-2" />
              <p>No pending join requests.</p>
              <p className="text-[11px]">Share your squad code with classmates to invite members.</p>
            </div>
          )}
        </Card>
      </div>

      {/* 3. Confirmed Squad Roster Table */}
      <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
        <CardHeader className="pb-3 border-b border-white/10">
          <CardTitle className="text-base font-bold text-white flex items-center">
            <Users className="w-4 h-4 text-amber-400 mr-2" />
            Confirmed Squad Lineup ({roster.length} Players)
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Official team members registered under LNJPIT Titans squad registry.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-white/10 font-mono uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">College Roll</th>
                <th className="py-3 px-4">Branch & Sem</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Pass Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {roster.map((m) => (
                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center space-x-2">
                    <span>{m.name}</span>
                    {m.role === "CAPTAIN" && (
                      <span className="text-[9px] font-mono font-black text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                        C
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{m.roll}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {m.branch} (Sem {m.semester})
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-[10px] font-mono border-white/15">
                      {m.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center text-[10px] font-mono text-emerald-400">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

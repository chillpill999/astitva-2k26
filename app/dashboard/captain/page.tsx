// ============================================================================
// ASTITVA 2K26 - Team Captain Squad Headquarters (Exteta Luxury Aesthetic)
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
  UserPlus,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";
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
      colors: ["#E85A4F", "#D8C3A5"],
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
    <div className="space-y-8 animate-in fade-in-50 duration-300 text-[#1A1918]">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#8E8D8A]/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <RoleBadge role="TEAM_CAPTAIN" />
            <span className="text-xs font-mono text-[#E85A4F] font-bold bg-[#EAE7DC] px-2 py-0.5 rounded border border-[#8E8D8A]/20">
              Aman Verma (ME • Sem 6)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1918] tracking-tight uppercase font-mono">
            Squad Headquarters &amp; Roster Control
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono">
            Lead your LNJPIT team to championship victory across Cricket, BGMI, and Cultural group competitions.
          </p>
        </div>

        <Link href="/events">
          <button className="px-4 py-2 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-colors flex items-center gap-1.5 shadow-sm">
            <Trophy className="w-3.5 h-3.5" />
            Register Squad for Event
          </button>
        </Link>
      </div>

      {/* 2. Squad Overview Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Active Squad Summary Card (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-start justify-between border-b border-[#8E8D8A]/20 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#E85A4F] uppercase border border-[#8E8D8A]/20 mb-1 inline-block">
                SQUAD #1 • GAMING
              </span>
              <h2 className="text-xl font-bold font-mono text-[#1A1918] uppercase">LNJPIT Titans</h2>
              <p className="text-xs text-[#8E8D8A] font-mono">BGMI LAN Invitational Championship (4v4)</p>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs font-bold text-[#E85A4F]">
                {roster.length} / 4 Slots Filled
              </span>
              <div className="w-24 bg-[#EAE7DC] h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-[#E85A4F] h-full rounded-full"
                  style={{ width: `${(roster.length / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 6-Char Invite Code Highlight Box */}
          <div className="rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-[10px] font-mono text-[#8E8D8A] uppercase font-bold tracking-wider">
                6-Character Squad Invite Code
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-2xl font-black text-[#E85A4F] tracking-widest bg-[#F6F4EE] px-3 py-1 rounded-xl border border-[#8E8D8A]/20">
                  {inviteCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-2 rounded-xl bg-[#F6F4EE] hover:bg-[#1A1918] hover:text-[#EAE7DC] text-[#1A1918] transition-colors cursor-pointer border border-[#8E8D8A]/20"
                  title="Copy Invite Code"
                >
                  {copied ? <Check className="w-4 h-4 text-[#E85A4F]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleShareWhatsApp}
              className="py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#E85A4F] hover:bg-[#C94A40] text-white transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              WhatsApp Invite
            </button>
          </div>

          <div className="text-xs font-mono text-[#8E8D8A] flex items-center justify-between pt-1">
            <span className="flex items-center text-[#E85A4F]">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Minimum squad threshold (3) met
            </span>
            <span>1 slot remaining</span>
          </div>
        </div>

        {/* Right: Pending Join Approvals (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-3">
            <h3 className="text-sm font-bold font-mono text-[#1A1918] uppercase flex items-center">
              <UserPlus className="w-4 h-4 text-[#E85A4F] mr-2" />
              Pending Requests ({pending.length})
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#1A1918] uppercase">
              Awaiting Approval
            </span>
          </div>

          {pending.length > 0 ? (
            <div className="space-y-3 font-mono">
              {pending.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1A1918] truncate">{req.name}</p>
                    <p className="text-[10px] text-[#8E8D8A] truncate">
                      {req.roll} • {req.branch} (Sem {req.semester})
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleApprove(req)}
                      className="h-7 text-[10px] font-bold uppercase bg-[#E85A4F] text-white hover:bg-[#C94A40] rounded-lg px-2 flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3 h-3" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(req)}
                      className="h-7 text-[10px] font-bold uppercase border border-[#8E8D8A]/30 text-[#8E8D8A] hover:text-[#1A1918] rounded-lg px-2 transition-colors"
                    >
                      <XCircle className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs font-mono text-[#8E8D8A] space-y-1">
              <Sparkles className="w-6 h-6 text-[#8E8D8A] mx-auto mb-2" />
              <p>No pending join requests.</p>
              <p className="text-[10px]">Share your squad code with classmates to invite members.</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Confirmed Squad Roster Table */}
      <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="border-b border-[#8E8D8A]/20 pb-4">
          <h3 className="text-base font-bold font-mono text-[#1A1918] uppercase flex items-center">
            <Users className="w-4 h-4 text-[#E85A4F] mr-2" />
            Confirmed Squad Lineup ({roster.length} Players)
          </h3>
          <p className="text-xs text-[#8E8D8A] font-mono mt-1">
            Official team members registered under LNJPIT Titans squad registry.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#EAE7DC] border-b border-[#8E8D8A]/20 uppercase text-[#1A1918]">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">College Roll</th>
                <th className="py-3 px-4">Branch &amp; Sem</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Pass Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8E8D8A]/15">
              {roster.map((m) => (
                <tr key={m.id} className="hover:bg-[#EAE7DC]/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#1A1918] flex items-center space-x-2">
                    <span>{m.name}</span>
                    {m.role === "CAPTAIN" && (
                      <span className="text-[9px] font-black text-[#EAE7DC] bg-[#1A1918] px-1.5 py-0.5 rounded">
                        C
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#8E8D8A]">{m.roll}</td>
                  <td className="py-3 px-4 text-[#8E8D8A]">
                    {m.branch} (Sem {m.semester})
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#1A1918] uppercase">
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center text-[10px] font-bold text-[#E85A4F]">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

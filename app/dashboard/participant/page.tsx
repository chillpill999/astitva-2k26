// ============================================================================
// ASTITVA 2K26 - Participant Command Center (Exteta Luxury Aesthetic)
// Path: app/dashboard/participant/page.tsx
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
  Trophy,
  Download,
  ChevronRight,
} from "lucide-react";
import { RoleBadge } from "@/components/dashboard/RoleBadge";

const REGISTERED_EVENTS = [
  {
    id: "cricket-tournament",
    title: "LNJPIT Premier Cricket League",
    category: "Sports",
    venue: "Main Sports Arena (Ground A)",
    date: "4 Sept 2026, 09:00 AM",
    day: "Day 01",
    status: "Confirmed",
    teamName: "LNJPIT Titans",
  },
  {
    id: "bgmi-championship",
    title: "BGMI LAN Invitational Battle",
    category: "Gaming",
    venue: "Central Seminar Hall (LAN Deck)",
    date: "6 Sept 2026, 02:00 PM",
    day: "Day 03",
    status: "Squad Ready",
    teamName: "Alpha Squad Chapra",
  },
  {
    id: "tark-vitark",
    title: "Tark-Vitark Hindi Parliamentary Debate",
    category: "Literary",
    venue: "Auditorium Room 102",
    date: "5 Sept 2026, 11:30 AM",
    day: "Day 02",
    status: "Confirmed",
    teamName: null,
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
    <div className="space-y-8 animate-in fade-in-50 duration-300 text-[#1A1918]">
      {/* 1. Header Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#8E8D8A]/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <RoleBadge role="PARTICIPANT" />
            <span className="font-mono text-xs text-[#E85A4F] font-bold bg-[#EAE7DC] px-2 py-0.5 rounded border border-[#8E8D8A]/20">
              AST26-0005
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1918] tracking-tight uppercase font-mono">
            Participant Command Center
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono">
            Welcome back, <span className="text-[#1A1918] font-bold">Sneha Kumari</span> (CE • Sem 2). Track your passes, brackets, and check-in status.
          </p>
        </div>

        <Link href="/events">
          <button className="px-4 py-2 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-colors flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Explore 16 Events
          </button>
        </Link>
      </div>

      {/* 2. Top Bento Grid: 4-Step Registration Tracker (8 cols) + Digital QR Pass Widget (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: 75% Complete Progress Tracker (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-4">
            <div>
              <h2 className="text-base font-bold font-mono text-[#1A1918] uppercase flex items-center">
                <CheckCircle2 className="w-4 h-4 text-[#E85A4F] mr-2" />
                Festival Readiness &amp; Registration Lifecycle
              </h2>
              <p className="text-xs text-[#8E8D8A] font-mono mt-1">
                Your credentials are verified. Complete remaining steps before Day 1 gate entry.
              </p>
            </div>
            <span className="font-mono text-lg font-black text-[#E85A4F] bg-[#EAE7DC] px-3 py-1 rounded-xl border border-[#8E8D8A]/25">
              75%
            </span>
          </div>

          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="w-full bg-[#EAE7DC] h-2 rounded-full overflow-hidden">
              <div className="bg-[#E85A4F] h-full rounded-full w-3/4" />
            </div>

            {/* 4-Step Progress Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-1">
                <span className="text-[10px] text-[#E85A4F] uppercase font-bold flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Step 1
                </span>
                <p className="text-xs font-bold text-[#1A1918]">Profile Setup</p>
                <span className="text-[10px] text-[#E85A4F] block">Completed</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-1">
                <span className="text-[10px] text-[#E85A4F] uppercase font-bold flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Step 2
                </span>
                <p className="text-xs font-bold text-[#1A1918]">Pass Selection</p>
                <span className="text-[10px] text-[#E85A4F] block">All-Access Pass</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-1">
                <span className="text-[10px] text-[#E85A4F] uppercase font-bold flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Step 3
                </span>
                <p className="text-xs font-bold text-[#1A1918]">Team Alignment</p>
                <span className="text-[10px] text-[#E85A4F] block">3 Events Confirmed</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-1">
                <span className="text-[10px] text-[#8E8D8A] uppercase font-bold flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> Step 4
                </span>
                <p className="text-xs font-bold text-[#1A1918]">Gate Check-In</p>
                <span className="text-[10px] text-[#8E8D8A] block">Sept 4 Kickoff</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Digital QR Access Badge Card (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-3">
              <span className="text-xs font-bold font-mono text-[#1A1918] tracking-wider uppercase">
                ASTITVA <span className="text-[#E85A4F]">2K26</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
                PRO PASS
              </span>
            </div>

            <div className="rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 p-5 text-center space-y-2">
              <QrCode className="w-20 h-20 text-[#1A1918] mx-auto" />
              <p className="font-mono text-sm font-black text-[#E85A4F] tracking-widest">
                AST26-0005
              </p>
              <p className="text-[10px] text-[#8E8D8A] font-mono">
                HMAC-SHA256 DIGITAL GATE PASS
              </p>
            </div>
          </div>

          <Link href="/profile">
            <button className="w-full py-2.5 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-mono font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all flex items-center justify-center gap-1 cursor-pointer">
              View Holographic ID Card
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </Link>
        </div>
      </div>

      {/* 3. Horizontal Registered Tournaments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-[#E85A4F]" />
            <h2 className="text-lg font-bold font-mono text-[#1A1918] uppercase">
              My Registered Tournaments ({REGISTERED_EVENTS.length})
            </h2>
          </div>

          <div className="flex gap-1 p-1 bg-[#F6F4EE] rounded-2xl border border-[#8E8D8A]/25 text-xs font-mono">
            <button
              onClick={() => setActiveTab("my-events")}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                activeTab === "my-events" ? "bg-[#1A1918] text-[#EAE7DC]" : "text-[#8E8D8A]"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setActiveTab("today")}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                activeTab === "today" ? "bg-[#1A1918] text-[#EAE7DC]" : "text-[#8E8D8A]"
              }`}
            >
              Schedule
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REGISTERED_EVENTS.map((evt) => (
            <div
              key={evt.id}
              className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 hover:border-[#E85A4F] transition-all p-5 space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#1A1918] uppercase">
                    {evt.category}
                  </span>
                  <span className="text-[10px] font-mono text-[#8E8D8A]">{evt.day}</span>
                </div>
                <h3 className="text-sm font-bold font-mono text-[#1A1918] uppercase">
                  {evt.title}
                </h3>
                <div className="space-y-1 text-xs font-mono text-[#8E8D8A]">
                  <p className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-[#E85A4F] mr-1.5 flex-shrink-0" />
                    {evt.venue}
                  </p>
                  <p className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 text-[#E85A4F] mr-1.5 flex-shrink-0" />
                    {evt.date}
                  </p>
                  {evt.teamName && (
                    <p className="text-[#E85A4F] font-bold text-[11px] pt-1">
                      Squad: {evt.teamName}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-[#8E8D8A]/15 flex items-center justify-between font-mono">
                <span className="text-[10px] font-bold text-[#E85A4F] flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {evt.status}
                </span>
                <Link href={`/events/${evt.id}`}>
                  <span className="text-xs font-bold text-[#1A1918] hover:text-[#E85A4F] flex items-center">
                    Details <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Verifiable Credentials & Certificates Showcase */}
      <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="border-b border-[#8E8D8A]/20 pb-4">
          <h3 className="text-base font-bold font-mono text-[#1A1918] uppercase flex items-center">
            <Award className="w-4 h-4 text-[#E85A4F] mr-2" />
            Verifiable Festival Credentials &amp; PDF Certificates
          </h3>
          <p className="text-xs text-[#8E8D8A] font-mono mt-1">
            HMAC-SHA256 cryptographically signed certificates issued by LNJPIT Organizing Committee.
          </p>
        </div>
        <div className="pt-2 divide-y divide-[#8E8D8A]/15 font-mono">
          {CERTIFICATES_DATA.map((cert) => (
            <div
              key={cert.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#1A1918] uppercase">{cert.title}</h4>
                <p className="text-[11px] text-[#8E8D8A]">
                  {cert.event} • <span className="text-[#E85A4F] font-bold">{cert.id}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#8E8D8A]">{cert.date}</span>
                <button
                  disabled={cert.id.includes("PENDING")}
                  className="px-3 py-1.5 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3 text-[#E85A4F]" />
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

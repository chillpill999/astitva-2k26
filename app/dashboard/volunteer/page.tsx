// ============================================================================
// ASTITVA 2K26 - Volunteer Scanner & Terminal
// Path: app/dashboard/volunteer/page.tsx
// ============================================================================

"use client";

import React, { useState } from "react";
import {
  QrCode,
  ShieldCheck,
  UserCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  Camera,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { QuickScannerModal } from "@/components/dashboard/QuickScannerModal";
import { toast } from "sonner";

const RECENT_CHECKINS = [
  {
    id: "AST26-0004",
    name: "Aman Verma",
    branch: "ME (Sem 6)",
    venue: "Main Sports Arena",
    time: "10:42 AM",
    status: "Verified",
    type: "Gate Entry",
  },
  {
    id: "AST26-1008",
    name: "Rohan Gupta",
    branch: "CSE (Sem 4)",
    venue: "Seminar Hall (BGMI)",
    time: "10:39 AM",
    status: "Verified",
    type: "Tournament Entry",
  },
  {
    id: "AST26-0005",
    name: "Sneha Kumari",
    branch: "CE (Sem 2)",
    venue: "Auditorium Room 102",
    time: "10:35 AM",
    status: "Verified",
    type: "Gate Entry",
  },
  {
    id: "AST26-1049",
    name: "Priyanka Patel",
    branch: "ECE (Sem 6)",
    venue: "Main Sports Arena",
    time: "10:28 AM",
    status: "Flagged",
    type: "Duplicate Scan Attempt",
  },
];

export default function VolunteerDashboardPage() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [manualQuery, setManualQuery] = useState("");

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuery.trim()) {
      toast.error("Please enter a participant ID or roll number.");
      return;
    }

    toast.success(`Verified Student: ${manualQuery.toUpperCase()}`, {
      description: "Eligible for LNJPIT Festival entry.",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <RoleBadge role="VOLUNTEER" />
            <span className="text-xs font-mono text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Ananya Sharma (Gate 1 Duty)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Scanner & Gate Check-in Terminal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            High-speed optical QR pass verification, manual roll lookup, and attendee ingress logging.
          </p>
        </div>

        <Button
          onClick={() => setIsScannerOpen(true)}
          variant="neonCyan"
          size="sm"
          className="text-xs font-bold shadow-lg"
        >
          <QrCode className="w-4 h-4 mr-1.5" />
          Launch Optical Scanner
        </Button>
      </div>

      {/* 2. Telemetry KPI Grid (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-xl">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase">
              Total Scans Today
            </span>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono">148</p>
            <p className="text-[11px] text-slate-400">Gate 1 & Arena Turnstiles</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-xl">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase">
              Valid Verified Passes
            </span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">145</p>
            <p className="text-[11px] text-emerald-400/80">98.0% Pass Authenticity</p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-xl">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase">
              Flagged / Invalids
            </span>
            <p className="text-2xl sm:text-3xl font-black text-red-400 font-mono">3</p>
            <p className="text-[11px] text-red-400/80">Duplicate or tampered hashes</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Scanner Launcher & Manual Lookup Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Big Optical Scanner Card (6 cols) */}
        <Card className="lg:col-span-6 glass-panel border-cyan-500/30 bg-slate-900/70 shadow-2xl p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
            <Camera className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Live Camera Optical Scanner</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Scans 128-bit HMAC-SHA256 encrypted digital festival passes with instant fraud detection.
            </p>
          </div>
          <Button
            onClick={() => setIsScannerOpen(true)}
            variant="neonCyan"
            className="w-full text-xs font-bold py-3"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Open Fullscreen Scanner Viewfinder
          </Button>
        </Card>

        {/* Right: Manual Student Search (6 cols) */}
        <Card className="lg:col-span-6 glass-panel border-white/10 bg-slate-900/70 shadow-2xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center">
              <Search className="w-4 h-4 text-amber-400 mr-2" />
              Manual Roll / AST26 Lookup
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Use in case of low phone battery or damaged physical pass cards.
            </p>
          </div>

          <form onSubmit={handleManualSearch} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Participant ID or LNJPIT Roll Number
              </label>
              <Input
                placeholder="e.g. AST26-0005 or 24105128032"
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                className="bg-slate-950/80 border-white/10 text-white font-mono text-xs"
              />
            </div>
            <Button type="submit" variant="neonPurple" className="w-full text-xs font-bold py-2.5">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Verify Credentials
            </Button>
          </form>
        </Card>
      </div>

      {/* 4. Live Check-in Audit Feed */}
      <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
        <CardHeader className="pb-3 border-b border-white/10">
          <CardTitle className="text-base font-bold text-white flex items-center">
            <Radio className="w-4 h-4 text-emerald-400 mr-2" />
            Real-Time Check-In Audit Stream
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Live telemetry stream from volunteer checkpoints across campus.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 divide-y divide-white/5">
          {RECENT_CHECKINS.map((log) => (
            <div
              key={log.id + log.time}
              className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-cyan-400">{log.id}</span>
                  <span className="text-xs font-bold text-white">{log.name}</span>
                  <Badge variant="outline" className="text-[10px] border-white/10 font-mono">
                    {log.branch}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-400">
                  {log.venue} • <span className="text-slate-500 font-mono">{log.type}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-400">{log.time}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    log.status === "Verified"
                      ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                      : "border-red-500/30 text-red-400 bg-red-500/10"
                  }`}
                >
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <QuickScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
}

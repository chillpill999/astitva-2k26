// ============================================================================
// ASTITVA 2K26 - Admin Control Center
// Path: app/dashboard/admin/page.tsx
// Stitch Screen: bcf81365838f4c8bab210179a7c506df
// ============================================================================

"use client";

import React, { useState } from "react";
import {
  Users,
  Trophy,
  UserCheck,
  Shield,
  Search,
  Download,
  TrendingUp,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  MoreVertical,
  Calendar,
  Radio,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { ExportDataModal } from "@/components/dashboard/ExportDataModal";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const REGISTRATION_VELOCITY_DATA = [
  { day: "Aug 20", registrations: 120, checkins: 0 },
  { day: "Aug 22", registrations: 280, checkins: 0 },
  { day: "Aug 24", registrations: 540, checkins: 0 },
  { day: "Aug 26", registrations: 890, checkins: 0 },
  { day: "Sept 1", registrations: 1120, checkins: 150 },
  { day: "Sept 4 (D1)", registrations: 1248, checkins: 1080 },
];

const TOURNAMENT_CAPACITIES = [
  { name: "Cricket Tournament (11v11)", registered: 16, capacity: 16, percentage: 100, color: "text-cyan-400" },
  { name: "BGMI LAN Championship (4v4)", registered: 32, capacity: 32, percentage: 100, color: "text-purple-400" },
  { name: "Tark-Vitark Hindi Debate", registered: 42, capacity: 50, percentage: 84, color: "text-amber-400" },
  { name: "Nrityangana Classical Dance", registered: 28, capacity: 30, percentage: 93, color: "text-emerald-400" },
  { name: "Grandmaster Chess Blitz", registered: 64, capacity: 64, percentage: 100, color: "text-rose-400" },
];

const PARTICIPANTS_DATA = [
  {
    id: "AST26-0001",
    name: "Dr. Shailendra Kumar",
    roll: "LNJPIT-ADMIN-01",
    branch: "CSE",
    role: "ADMIN" as const,
    events: 3,
    status: "Checked In",
    statusColor: "emerald",
  },
  {
    id: "AST26-0002",
    name: "Prof. Rajesh Ranjan",
    roll: "LNJPIT-FAC-042",
    branch: "ECE",
    role: "EVENT_COORDINATOR" as const,
    events: 5,
    status: "Checked In",
    statusColor: "emerald",
  },
  {
    id: "AST26-0003",
    name: "Ananya Sharma",
    roll: "23105128014",
    branch: "EE",
    role: "VOLUNTEER" as const,
    events: 2,
    status: "Checked In",
    statusColor: "emerald",
  },
  {
    id: "AST26-0004",
    name: "Aman Verma",
    roll: "22105128005",
    branch: "ME",
    role: "TEAM_CAPTAIN" as const,
    events: 4,
    status: "Checked In",
    statusColor: "emerald",
  },
  {
    id: "AST26-0005",
    name: "Sneha Kumari",
    roll: "24105128032",
    branch: "CE",
    role: "PARTICIPANT" as const,
    events: 3,
    status: "Pending",
    statusColor: "amber",
  },
  {
    id: "AST26-1006",
    name: "Vikram Malhotra",
    roll: "23105128099",
    branch: "CSE",
    role: "PARTICIPANT" as const,
    events: 2,
    status: "Checked In",
    statusColor: "emerald",
  },
  {
    id: "AST26-1007",
    name: "Pooja Singh",
    roll: "22105128045",
    branch: "ECE",
    role: "PARTICIPANT" as const,
    events: 1,
    status: "Pending",
    statusColor: "amber",
  },
];

export default function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [isExportOpen, setIsExportOpen] = useState(false);

  const filteredParticipants = PARTICIPANTS_DATA.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.roll.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = branchFilter === "ALL" || p.branch === branchFilter;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Header Banner & Action Deck */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <RoleBadge role="ADMIN" />
            <Badge variant="outline" className="text-[10px] font-mono border-red-500/30 text-red-400">
              HIGH PRIVILEGE CLEARANCE
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Festival Operations & Analytics Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time telemetry, tournament registration streams, volunteer rosters, and emergency broadcast dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsExportOpen(true)}
            variant="outline"
            size="sm"
            className="text-xs font-semibold border-white/15 bg-slate-900/80 hover:bg-slate-800 text-white cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            Export Reports
          </Button>
          <Button
            variant="neonCyan"
            size="sm"
            className="text-xs font-bold shadow-lg cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 mr-1.5" />
            Live Broadcast
          </Button>
        </div>
      </div>

      {/* 2. Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-xl">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Registrations
              </span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">1,248</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Across 16 Sports & Cultural competitions</p>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-xl">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Prize Pool
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">₹1,50,000</span>
            </div>
            <p className="text-[11px] text-slate-400">100% Sponsor & Institutional Backed</p>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-xl">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Attendance Rate
              </span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">86.5%</span>
              <span className="text-xs font-mono text-cyan-300">1,080 / 1,248</span>
            </div>
            <Progress value={86.5} className="h-1.5 bg-slate-800" />
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-xl">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Volunteers On-Duty
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Shield className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">34</span>
              <span className="inline-flex items-center text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping" />
                14 ZONES ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">QR Gate scanning & venue logistics</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Charts & Tournament Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Registration Velocity Recharts Area Chart (7 cols) */}
        <Card className="lg:col-span-7 glass-panel border-white/10 bg-slate-900/70 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-white flex items-center">
              <TrendingUp className="w-4 h-4 text-cyan-400 mr-2" />
              Registration Velocity & Check-in Surge
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Cumulative student registrations leading up to Day 1 kickoff.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REGISTRATION_VELOCITY_DATA}>
                  <defs>
                    <linearGradient id="regGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="checkGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#030712",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="registrations"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#regGradient)"
                    name="Registrations"
                  />
                  <Area
                    type="monotone"
                    dataKey="checkins"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#checkGradient)"
                    name="Gate Check-ins"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right: Tournament Capacity Gauges (5 cols) */}
        <Card className="lg:col-span-5 glass-panel border-white/10 bg-slate-900/70 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white flex items-center">
              <Trophy className="w-4 h-4 text-amber-400 mr-2" />
              Tournament Slot Capacities
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Live capacity monitoring across premier competitive brackets.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {TOURNAMENT_CAPACITIES.map((t) => (
              <div key={t.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200 truncate">{t.name}</span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {t.registered}/{t.capacity} ({t.percentage}%)
                  </span>
                </div>
                <Progress value={t.percentage} className="h-1.5 bg-slate-800" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 4. High-Density Participant Directory Table */}
      <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
        <CardHeader className="pb-4 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center">
                <Users className="w-4 h-4 text-cyan-400 mr-2" />
                Live Festival Participant Directory
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Search, filter, and inspect registered LNJPIT students and committee personnel.
              </CardDescription>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search name, ID, roll..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 bg-slate-950/80 border-white/10 text-white text-xs h-8"
                />
              </div>

              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="bg-slate-950/80 border border-white/10 text-xs text-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Branches</option>
                <option value="CSE">CSE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="EE">EE</option>
                <option value="ECE">ECE</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-white/10 font-mono uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Participant ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Gate Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredParticipants.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                    {p.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">
                    {p.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {p.roll}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-[10px] font-mono border-white/15">
                      {p.branch}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <RoleBadge role={p.role} className="text-[9px] py-0 px-1.5" />
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono ${
                        p.status === "Checked In"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          p.status === "Checked In" ? "bg-emerald-400" : "bg-amber-400"
                        }`}
                      />
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-400 hover:text-white">
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <ExportDataModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}

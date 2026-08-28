// ============================================================================
// ASTITVA 2K26 - Admin Control Center (Exteta Luxury Aesthetic)
// Path: app/dashboard/admin/page.tsx
// ============================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Trophy,
  UserCheck,
  Search,
  Download,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
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
  { name: "Cricket Tournament (11v11)", registered: 16, capacity: 16, percentage: 100 },
  { name: "BGMI LAN Championship (4v4)", registered: 32, capacity: 32, percentage: 100 },
  { name: "Tark-Vitark Hindi Debate", registered: 42, capacity: 50, percentage: 84 },
  { name: "Nrityangana Classical Dance", registered: 28, capacity: 30, percentage: 93 },
  { name: "Grandmaster Chess Blitz", registered: 64, capacity: 64, percentage: 100 },
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
  },
  {
    id: "AST26-0002",
    name: "Prof. Rajesh Ranjan",
    roll: "LNJPIT-FAC-042",
    branch: "ECE",
    role: "EVENT_COORDINATOR" as const,
    events: 5,
    status: "Checked In",
  },
  {
    id: "AST26-0003",
    name: "Ananya Sharma",
    roll: "23105128014",
    branch: "EE",
    role: "VOLUNTEER" as const,
    events: 2,
    status: "Checked In",
  },
  {
    id: "AST26-0004",
    name: "Aman Verma",
    roll: "22105128005",
    branch: "ME",
    role: "TEAM_CAPTAIN" as const,
    events: 4,
    status: "Checked In",
  },
  {
    id: "AST26-0005",
    name: "Sneha Kumari",
    roll: "24105128032",
    branch: "CE",
    role: "PARTICIPANT" as const,
    events: 3,
    status: "Registered",
  },
];

export default function AdminDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const filteredParticipants = PARTICIPANTS_DATA.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 text-[#1A1918]">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#8E8D8A]/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <RoleBadge role="ADMIN" />
            <span className="text-xs font-mono text-[#E85A4F] font-bold bg-[#EAE7DC] px-2 py-0.5 rounded border border-[#8E8D8A]/20">
              Dr. Shailendra Kumar · Principal Admin
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1918] tracking-tight uppercase font-mono">
            Executive Festival Control Center
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono">
            Platform governance, cross-branch telemetry, gate controls, and real-time database audits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-mono font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#E85A4F]" />
            Export Reports
          </button>
          <Link href="/dashboard/admin/analytics">
            <button className="px-4 py-2 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-colors flex items-center gap-1.5 shadow-sm">
              <TrendingUp className="w-3.5 h-3.5" />
              Deep Analytics →
            </button>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8E8D8A]">
            <span>Total Enrolled</span>
            <Users className="w-4 h-4 text-[#1A1918]" />
          </div>
          <p className="text-3xl font-bold text-[#1A1918]">1,248</p>
          <p className="text-[10px] text-[#E85A4F]">+18% vs last year</p>
        </div>

        <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8E8D8A]">
            <span>Total Checked In</span>
            <UserCheck className="w-4 h-4 text-[#E85A4F]" />
          </div>
          <p className="text-3xl font-bold text-[#E85A4F]">1,080</p>
          <p className="text-[10px] text-[#8E8D8A]">86.5% gate turnover</p>
        </div>

        <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8E8D8A]">
            <span>Tournaments Live</span>
            <Trophy className="w-4 h-4 text-[#1A1918]" />
          </div>
          <p className="text-3xl font-bold text-[#1A1918]">16 / 16</p>
          <p className="text-[10px] text-[#E85A4F]">100% capacity filled</p>
        </div>

        <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8E8D8A]">
            <span>Certificates Issued</span>
            <CheckCircle2 className="w-4 h-4 text-[#E85A4F]" />
          </div>
          <p className="text-3xl font-bold text-[#1A1918]">412</p>
          <p className="text-[10px] text-[#8E8D8A]">HMAC-SHA256 verified</p>
        </div>
      </div>

      {/* 3. Analytics Chart & Event Capacity Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Registration Velocity Chart (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-4">
            <div>
              <h2 className="text-base font-bold font-mono text-[#1A1918] uppercase flex items-center">
                <TrendingUp className="w-4 h-4 text-[#E85A4F] mr-2" /> Registration &amp; Check-In Velocity
              </h2>
              <p className="text-xs text-[#8E8D8A] font-mono mt-1">
                Daily cumulative student enrollment vs gate scans.
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REGISTRATION_VELOCITY_DATA}>
                <defs>
                  <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E85A4F" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E85A4F" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCheck" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A1918" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1A1918" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#8E8D8A" opacity={0.2} />
                <XAxis dataKey="day" stroke="#8E8D8A" fontSize={10} />
                <YAxis stroke="#8E8D8A" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F6F4EE",
                    borderColor: "#8E8D8A",
                    borderRadius: "16px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    color: "#1A1918",
                  }}
                />
                <Area type="monotone" dataKey="registrations" stroke="#E85A4F" fill="url(#colorReg)" />
                <Area type="monotone" dataKey="checkins" stroke="#1A1918" fill="url(#colorCheck)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Tournament Capacity Tracker (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 shadow-sm space-y-4">
          <div className="border-b border-[#8E8D8A]/20 pb-4">
            <h2 className="text-base font-bold font-mono text-[#1A1918] uppercase">
              Tournament Slot Utilization
            </h2>
            <p className="text-xs text-[#8E8D8A] font-mono mt-1">Live squad &amp; slot saturation rates.</p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {TOURNAMENT_CAPACITIES.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-[#1A1918] truncate pr-2">{item.name}</span>
                  <span className="text-[#E85A4F] font-bold shrink-0">{item.percentage}%</span>
                </div>
                <div className="w-full bg-[#EAE7DC] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#E85A4F] h-full rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-[#8E8D8A]">
                  <span>{item.registered} Registered</span>
                  <span>Cap: {item.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Filterable User Registry Table */}
      <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#8E8D8A]/20 pb-4">
          <div>
            <h2 className="text-base font-bold font-mono text-[#1A1918] uppercase">
              Master Participant &amp; Role Registry
            </h2>
            <p className="text-xs text-[#8E8D8A] font-mono mt-1">
              Search and filter across all authenticated college stakeholders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8D8A]" />
              <input
                type="text"
                placeholder="Search name, roll, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-xs font-mono text-[#1A1918] placeholder:text-[#8E8D8A]/60 focus:outline-none focus:border-[#E85A4F]"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="p-1.5 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-xs font-mono text-[#1A1918] focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="EVENT_COORDINATOR">Coordinator</option>
              <option value="VOLUNTEER">Volunteer</option>
              <option value="TEAM_CAPTAIN">Captain</option>
              <option value="PARTICIPANT">Participant</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#EAE7DC] border-b border-[#8E8D8A]/20 uppercase text-[#1A1918]">
              <tr>
                <th className="py-3 px-4">Participant ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Roll / Dept</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Tournaments</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8E8D8A]/15">
              {filteredParticipants.map((user) => (
                <tr key={user.id} className="hover:bg-[#EAE7DC]/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#E85A4F]">{user.id}</td>
                  <td className="py-3 px-4 font-bold text-[#1A1918]">{user.name}</td>
                  <td className="py-3 px-4 text-[#8E8D8A]">{user.roll}</td>
                  <td className="py-3 px-4 text-[#8E8D8A]">{user.branch}</td>
                  <td className="py-3 px-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="py-3 px-4 text-[#1A1918] font-bold">{user.events} Events</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[10px] font-bold text-[#E85A4F] uppercase">
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ExportDataModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}

"use client";

// ============================================================================
// ASTITVA 2K26 - Admin Global Analytics Realtime Deck
// Path: components/admin/AdminAnalyticsRealtimeDeck.tsx
// ============================================================================

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Users,
  Trophy,
  UserCheck,
  Download,
  ArrowLeft,
  PieChart,
  Shield,
  Layers,
  Radio,
} from "lucide-react";
import { AnalyticsOverview } from "@/lib/analytics/actions";
import { getSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface AdminAnalyticsRealtimeDeckProps {
  initialData: AnalyticsOverview;
}

const EXPORT_KINDS = [
  { key: "registrations", label: "Registrations" },
  { key: "attendance", label: "Attendance" },
  { key: "results", label: "Results" },
  { key: "certificates", label: "Certificates" },
  { key: "participants", label: "Participants" },
  { key: "teams", label: "Teams" },
] as const;

export function AdminAnalyticsRealtimeDeck({ initialData }: AdminAnalyticsRealtimeDeckProps) {
  const [data, setData] = useState<AnalyticsOverview>(initialData);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const channel = supabase
      .channel("admin-analytics-live-stream")
      .on(
        "postgres_changes" as any,
        { event: "*", schema: "public", table: "Registration" },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            const todayKey = new Date().toISOString().slice(5, 10);
            setData((prev) => {
              const newTotals = { ...prev.totals, registrations: prev.totals.registrations + 1 };
              const newVelocity = prev.registrationVelocity.map((v) =>
                v.day === todayKey ? { ...v, count: v.count + 1 } : v
              );
              const newRate =
                newTotals.registrations > 0
                  ? Math.round((newTotals.attendance / newTotals.registrations) * 1000) / 10
                  : 0;
              return {
                ...prev,
                totals: newTotals,
                registrationVelocity: newVelocity,
                attendanceRate: newRate,
              };
            });
            toast.success("🚨 Analytics Live: Registration count updated in real-time");
          }
        }
      )
      .on(
        "postgres_changes" as any,
        { event: "INSERT", schema: "public", table: "Attendance" },
        () => {
          setData((prev) => {
            const newTotals = { ...prev.totals, attendance: prev.totals.attendance + 1 };
            const newRate =
              newTotals.registrations > 0
                ? Math.round((newTotals.attendance / newTotals.registrations) * 1000) / 10
                : 0;
            return {
              ...prev,
              totals: newTotals,
              attendanceRate: newRate,
            };
          });
          toast.info("⚡ Analytics Live: Gate check-in count updated");
        }
      )
      .on(
        "postgres_changes" as any,
        { event: "INSERT", schema: "public", table: "User" },
        () => {
          setData((prev) => ({
            ...prev,
            totals: { ...prev.totals, users: prev.totals.users + 1 },
          }));
        }
      )
      .subscribe((status: any) => {
        if (status === "SUBSCRIBED") setIsConnected(true);
        else if (status === "CLOSED" || status === "CHANNEL_ERROR") setIsConnected(false);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const maxVelocity = Math.max(1, ...data.registrationVelocity.map((v) => v.count));
  const maxBranch = Math.max(1, ...data.branchDistribution.map((b) => b.count));
  const maxCat = Math.max(1, ...data.categoryPopularity.map((c) => c.count));
  const maxGender = Math.max(1, ...data.genderDistribution.map((g) => g.count));

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 text-[#1A1918]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#8E8D8A]/20 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1A1918] tracking-tight uppercase font-mono flex items-center">
              <BarChart3 className="h-6 w-6 text-[#E85A4F] mr-2" /> Global Analytics
            </h1>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-[9px] font-mono font-bold tracking-wider uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {isConnected ? "Realtime Live" : "Connecting..."}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono mt-1">
            Real-time festival metrics from the live production database. Every audit action is
            recorded in the security log.
          </p>
        </div>
        <Link href="/dashboard/admin">
          <button className="px-4 py-2 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-mono font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all flex items-center gap-1.5 cursor-pointer">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Control Center
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 font-mono">
        <Kpi
          icon={<Users className="h-4 w-4 text-[#1A1918]" />}
          label="Users"
          value={data.totals.users}
          isLive={isConnected}
        />
        <Kpi
          icon={<UserCheck className="h-4 w-4 text-[#E85A4F]" />}
          label="Registrations"
          value={data.totals.registrations}
          accent="text-[#E85A4F]"
          isLive={isConnected}
        />
        <Kpi
          icon={<Trophy className="h-4 w-4 text-[#1A1918]" />}
          label="Events"
          value={data.totals.events}
          isLive={isConnected}
        />
        <Kpi
          icon={<Shield className="h-4 w-4 text-[#1A1918]" />}
          label="Attendance"
          value={data.totals.attendance}
          isLive={isConnected}
        />
        <Kpi
          icon={<Layers className="h-4 w-4 text-[#E85A4F]" />}
          label="Check-In Rate"
          value={`${data.attendanceRate.toFixed(1)}%`}
          accent="text-[#E85A4F]"
          isLive={isConnected}
        />
      </div>

      {/* 14-Day Velocity */}
      <div className="p-6 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-3">
          <h2 className="text-sm font-bold uppercase text-[#1A1918] flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#E85A4F]" />
            14-Day Registration Velocity
          </h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#E85A4F] uppercase flex items-center gap-1">
            <Radio className="h-3 w-3 animate-pulse" /> Live Stream
          </span>
        </div>
        {data.registrationVelocity.length === 0 ? (
          <p className="text-xs text-[#8E8D8A] py-6 text-center">No registration velocity recorded yet.</p>
        ) : (
          <div className="pt-2 overflow-x-auto no-scrollbar">
            <div
              className="grid gap-1.5 h-36 items-end min-w-[280px]"
              style={{
                gridTemplateColumns: `repeat(${Math.max(1, data.registrationVelocity.length)}, minmax(0, 1fr))`,
              }}
            >
              {data.registrationVelocity.map((v) => (
                <div key={v.day} className="flex flex-col items-center gap-1 group">
                  <div
                    className="w-full rounded-md bg-[#E85A4F]/25 group-hover:bg-[#E85A4F] border border-[#E85A4F]/40 transition-all cursor-pointer relative"
                    style={{ height: `${Math.max(8, (v.count / maxVelocity) * 110)}px` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1A1918] text-[#EAE7DC] text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none transition-opacity">
                      {v.count}
                    </div>
                  </div>
                  <span className="text-[8px] text-[#8E8D8A] truncate w-full text-center">
                    {v.day.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
        <div className="p-6 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase text-[#1A1918]">Branch Distribution</h2>
          <div className="space-y-2.5">
            {data.branchDistribution.map((b) => (
              <div key={b.branch} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#1A1918] font-bold">{b.branch}</span>
                  <span className="text-[#8E8D8A]">{b.count}</span>
                </div>
                <div className="h-2 rounded-full bg-[#EAE7DC] overflow-hidden">
                  <div
                    className="h-full bg-[#E85A4F] transition-all duration-500"
                    style={{ width: `${(b.count / maxBranch) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase text-[#1A1918]">Category Popularity</h2>
          <div className="space-y-2.5">
            {data.categoryPopularity.map((c) => (
              <div key={c.category} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#1A1918] font-bold">{c.category}</span>
                  <span className="text-[#8E8D8A]">{c.count} regs</span>
                </div>
                <div className="h-2 rounded-full bg-[#EAE7DC] overflow-hidden">
                  <div
                    className="h-full bg-[#1A1918] transition-all duration-500"
                    style={{ width: `${(c.count / maxCat) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase text-[#1A1918]">Gender Diversity</h2>
          <div className="space-y-2.5">
            {data.genderDistribution.map((g) => (
              <div key={g.gender} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#1A1918] font-bold">{g.gender}</span>
                  <span className="text-[#8E8D8A]">{g.count}</span>
                </div>
                <div className="h-2 rounded-full bg-[#EAE7DC] overflow-hidden">
                  <div
                    className="h-full bg-[#E85A4F] transition-all duration-500"
                    style={{ width: `${(g.count / maxGender) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="p-6 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-4 font-mono">
        <h2 className="text-sm font-bold uppercase text-[#1A1918] flex items-center gap-2">
          <Download className="h-4 w-4 text-[#E85A4F]" /> Export Data Sets
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {EXPORT_KINDS.map((k) => (
            <a
              key={k.key}
              href={`/api/export/${k.key}?format=csv`}
              className="p-3 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/25 text-center hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all block group cursor-pointer"
            >
              <span className="text-[11px] font-bold uppercase block">{k.label}</span>
              <span className="text-[9px] text-[#8E8D8A] group-hover:text-[#EAE7DC]/80 block">
                CSV Export
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  accent,
  isLive,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent?: string;
  isLive?: boolean;
}) {
  return (
    <div className="p-5 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-2 relative overflow-hidden">
      <div className="flex items-center justify-between text-[10px] text-[#8E8D8A] uppercase font-bold">
        <span>{label}</span>
        {icon}
      </div>
      <p className={`text-2xl sm:text-3xl font-black transition-all duration-300 ${accent ?? "text-[#1A1918]"}`}>
        {value}
      </p>
      {isLive && (
        <span className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
      )}
    </div>
  );
}

// ============================================================================
// ASTITVA 2K26 - Attendance Analytics Widgets (real DB)
// Path: components/attendance/AttendanceWidgets.tsx
// ============================================================================

"use client";

import { useMemo } from "react";
import {
  Users,
  UserCheck,
  TrendingUp,
  Armchair,
  ShieldAlert,
  Repeat2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export interface AttendanceWidgetsProps {
  metrics: {
    totalRegistered: number;
    totalCheckedIn: number;
    attendancePercent: number;
    remainingSeats: number;
    capacity: number | null;
    duplicateAttempts: number;
    invalidAttempts: number;
    recentVelocity: Array<{ hour: string; count: number }>;
  };
  scope: "festival" | "event";
}

export function AttendanceWidgets({ metrics, scope }: AttendanceWidgetsProps) {
  const maxVelocity = useMemo(
    () => Math.max(1, ...metrics.recentVelocity.map((v) => v.count)),
    [metrics.recentVelocity]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          icon={<Users className="h-4 w-4 text-cyan-300" />}
          label="Total Registered"
          value={metrics.totalRegistered.toLocaleString("en-IN")}
          accent="text-white"
        />
        <StatCard
          icon={<UserCheck className="h-4 w-4 text-emerald-300" />}
          label="Checked In"
          value={metrics.totalCheckedIn.toLocaleString("en-IN")}
          accent="text-emerald-300"
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4 text-amber-300" />}
          label="Attendance"
          value={`${metrics.attendancePercent.toFixed(1)}%`}
          accent="text-amber-300"
        />
        <StatCard
          icon={<Armchair className="h-4 w-4 text-purple-300" />}
          label="Remaining Seats"
          value={metrics.remainingSeats.toLocaleString("en-IN")}
          accent="text-purple-300"
          footer={
            metrics.capacity ? `Capacity: ${metrics.capacity.toLocaleString("en-IN")}` : "—"
          }
        />
        <StatCard
          icon={<ShieldAlert className="h-4 w-4 text-red-300" />}
          label="Flagged Scans"
          value={(metrics.duplicateAttempts + metrics.invalidAttempts).toLocaleString("en-IN")}
          accent="text-red-300"
          footer={
            <span className="flex gap-1.5 flex-wrap">
              <Badge variant="outline" className="text-[9px] border-amber-500/40 text-amber-300">
                <Repeat2 className="h-2.5 w-2.5 mr-0.5" /> {metrics.duplicateAttempts} dup
              </Badge>
              <Badge variant="outline" className="text-[9px] border-red-500/40 text-red-300">
                {metrics.invalidAttempts} bad
              </Badge>
            </span>
          }
        />
      </div>

      <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
        <CardHeader className="pb-3 border-b border-white/5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center">
                <TrendingUp className="h-4 w-4 text-cyan-300 mr-2" /> Live Check-in Velocity
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1">
                Rolling 12-hour window — {scope === "festival" ? "Festival-wide" : "Event-specific"}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono border-cyan-500/30 text-cyan-300">
              {metrics.totalCheckedIn} / {metrics.totalRegistered} seats filled
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <Progress value={Math.min(100, metrics.attendancePercent)} className="h-2 bg-slate-800" />
          <div className="grid grid-cols-12 gap-1.5 h-24 items-end">
            {metrics.recentVelocity.map((v) => (
              <div key={v.hour} className="flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-md bg-gradient-to-t from-cyan-500/30 to-cyan-300/90 border border-cyan-400/40 transition-all"
                  style={{ height: `${Math.max(6, (v.count / maxVelocity) * 88)}px` }}
                  title={`${v.count} check-ins at ${v.hour}`}
                />
                <span className="text-[9px] font-mono text-slate-400">{v.hour}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
  footer,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
  footer?: React.ReactNode;
}) {
  return (
    <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-xl">
      <CardContent className="p-4 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          <span>{label}</span>
          {icon}
        </div>
        <p className={`text-2xl font-black font-mono ${accent ?? "text-white"}`}>{value}</p>
        {footer && <div className="text-[10px] text-slate-500">{footer}</div>}
      </CardContent>
    </Card>
  );
}

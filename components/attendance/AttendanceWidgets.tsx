// ============================================================================
// ASTITVA 2K26 - Attendance Analytics Widgets (Exteta Luxury Aesthetic)
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
    <div className="space-y-6 text-[#1A1918]">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          icon={<Users className="h-4 w-4 text-[#1A1918]" />}
          label="Total Registered"
          value={metrics.totalRegistered.toLocaleString("en-IN")}
          accent="text-[#1A1918]"
        />
        <StatCard
          icon={<UserCheck className="h-4 w-4 text-[#E85A4F]" />}
          label="Checked In"
          value={metrics.totalCheckedIn.toLocaleString("en-IN")}
          accent="text-[#E85A4F]"
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4 text-[#1A1918]" />}
          label="Attendance"
          value={`${metrics.attendancePercent.toFixed(1)}%`}
          accent="text-[#1A1918]"
        />
        <StatCard
          icon={<Armchair className="h-4 w-4 text-[#8E8D8A]" />}
          label="Remaining Seats"
          value={metrics.remainingSeats.toLocaleString("en-IN")}
          accent="text-[#8E8D8A]"
          footer={
            metrics.capacity ? `Capacity: ${metrics.capacity.toLocaleString("en-IN")}` : "—"
          }
        />
        <StatCard
          icon={<ShieldAlert className="h-4 w-4 text-[#E85A4F]" />}
          label="Flagged Scans"
          value={(metrics.duplicateAttempts + metrics.invalidAttempts).toLocaleString("en-IN")}
          accent="text-[#E85A4F]"
          footer={
            <span className="flex gap-1.5 flex-wrap">
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#EAE7DC] text-[#8E8D8A]">
                {metrics.duplicateAttempts} dup
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                {metrics.invalidAttempts} bad
              </span>
            </span>
          }
        />
      </div>

      <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#8E8D8A]/20 pb-4">
          <div>
            <h3 className="text-base font-bold font-mono text-[#1A1918] uppercase flex items-center">
              <TrendingUp className="h-4 w-4 text-[#E85A4F] mr-2" /> Live Check-in Velocity
            </h3>
            <p className="text-xs text-[#8E8D8A] font-mono mt-1">
              Rolling 12-hour window — {scope === "festival" ? "Festival-wide" : "Event-specific"}
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#E85A4F] uppercase border border-[#8E8D8A]/20">
            TELEMETRY ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 pt-2 items-end h-32">
          {metrics.recentVelocity.map((v) => {
            const hPct = Math.max(8, Math.round((v.count / maxVelocity) * 100));
            return (
              <div key={v.hour} className="flex flex-col items-center gap-1.5 h-full justify-end font-mono">
                <span className="text-[9px] text-[#8E8D8A]">{v.count}</span>
                <div className="w-full bg-[#EAE7DC] rounded-t-lg overflow-hidden flex-1 flex items-end">
                  <div
                    className="w-full bg-[#E85A4F] rounded-t-lg transition-all"
                    style={{ height: `${hPct}%` }}
                  />
                </div>
                <span className="text-[8px] text-[#8E8D8A] truncate max-w-full">{v.hour}</span>
              </div>
            );
          })}
        </div>
      </div>
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
    <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-5 shadow-sm space-y-2 font-mono">
      <div className="flex items-center justify-between text-xs text-[#8E8D8A]">
        <span>{label}</span>
        {icon}
      </div>
      <p className={`text-2xl font-bold ${accent || "text-[#1A1918]"}`}>{value}</p>
      {footer && <div className="text-[10px] text-[#8E8D8A] pt-1">{footer}</div>}
    </div>
  );
}

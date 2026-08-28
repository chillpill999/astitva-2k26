// ============================================================================
// ASTITVA 2K26 - Volunteer Scanner & Terminal (Server Component)
// Path: app/dashboard/volunteer/page.tsx
// ============================================================================

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  QrCode,
  Camera,
  Radio,
  Users,
  UserCheck,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  getRecentCheckInLogs,
  getAttendanceMetrics,
  getVolunteerEventSummaries,
} from "@/lib/attendance/actions";
import { formatTime, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Volunteer Terminal | ASTITVA 2K26",
  description: "Encrypted QR check-in, manual lookup, and live attendance analytics.",
};

export default async function VolunteerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/dashboard/volunteer");
  if (!["VOLUNTEER", "EVENT_COORDINATOR", "ADMIN"].includes(user.role)) {
    redirect("/unauthorized?attempted=/dashboard/volunteer");
  }

  const [metrics, logs, events] = await Promise.all([
    getAttendanceMetrics(null),
    getRecentCheckInLogs({ take: 30 }),
    getVolunteerEventSummaries(6),
  ]);

  const todayLabel = formatDate(new Date());

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <RoleBadge role="VOLUNTEER" />
            <span className="text-xs font-mono text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              {user.name} · Gate Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Scanner & Gate Check-in Terminal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time QR verification, manual roll lookup, and immutable check-in audit · {todayLabel}
          </p>
        </div>
        <Link href="/dashboard/volunteer/scanner">
          <Button variant="neonCyan" size="sm" className="text-xs font-bold shadow-lg">
            <QrCode className="w-4 h-4 mr-1.5" />
            Launch Optical Scanner
          </Button>
        </Link>
      </div>

      {/* 2. KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KpiCard
          icon={<Users className="h-4 w-4 text-cyan-300" />}
          label="Total Registered"
          value={metrics.totalRegistered}
        />
        <KpiCard
          icon={<UserCheck className="h-4 w-4 text-emerald-300" />}
          label="Checked In"
          value={metrics.totalCheckedIn}
          accent="text-emerald-300"
        />
        <KpiCard
          icon={<Activity className="h-4 w-4 text-amber-300" />}
          label="Attendance"
          value={`${metrics.attendancePercent.toFixed(1)}%`}
          accent="text-amber-300"
        />
        <KpiCard
          icon={<ShieldAlert className="h-4 w-4 text-red-300" />}
          label="Flagged Scans"
          value={metrics.duplicateAttempts + metrics.invalidAttempts}
          accent="text-red-300"
        />
      </div>

      <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
        <CardHeader className="pb-3 border-b border-white/10">
          <CardTitle className="text-base font-bold text-white flex items-center">
            <Activity className="h-4 w-4 text-cyan-300 mr-2" /> Festival-wide Attendance
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            {metrics.totalCheckedIn} of {metrics.totalRegistered} registered attendees
            ({metrics.attendancePercent.toFixed(1)}%)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <Progress
            value={Math.min(100, metrics.attendancePercent)}
            className="h-2 bg-slate-800"
          />
          <div className="grid grid-cols-12 gap-1.5 h-20 items-end">
            {(() => {
              const max = Math.max(1, ...metrics.recentVelocity.map((v) => v.count));
              return metrics.recentVelocity.map((v) => (
                <div key={v.hour} className="flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-md bg-gradient-to-t from-cyan-500/30 to-cyan-300/90 border border-cyan-400/40"
                    style={{ height: `${Math.max(4, (v.count / max) * 76)}px` }}
                    title={`${v.count} check-ins at ${v.hour}`}
                  />
                  <span className="text-[9px] font-mono text-slate-400">{v.hour}</span>
                </div>
              ));
            })()}
          </div>
        </CardContent>
      </Card>

      {/* 3. Audit Stream */}
      <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
        <CardHeader className="pb-3 border-b border-white/10">
          <CardTitle className="text-base font-bold text-white flex items-center">
            <Radio className="h-4 w-4 text-emerald-400 mr-2" /> Real-Time Check-In Audit Stream
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Last 30 scans, descending by timestamp. Each row is signed to the audit log.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 divide-y divide-white/5">
          {logs.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-6 text-center">
              No scans recorded yet — launch the optical scanner to start the stream.
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 truncate">
                      {log.participantId}
                    </span>
                    <span className="text-xs font-bold text-white truncate">
                      {log.participantName ?? "—"}
                    </span>
                    {log.eventTitle && (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-white/10 font-mono truncate"
                      >
                        {log.eventTitle}
                      </Badge>
                    )}
                  </div>
                  {log.reason && (
                    <p className="text-[11px] text-slate-400 truncate">{log.reason}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[10px] font-mono text-slate-400">
                    {formatTime(log.timestamp)}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${resultClass(
                      log.result
                    )}`}
                  >
                    {log.action.replace("QR_SCAN_", "")}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* 4. Per-Event Snapshot */}
      <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
        <CardHeader className="pb-3 border-b border-white/10">
          <CardTitle className="text-base font-bold text-white flex items-center">
            <Camera className="h-4 w-4 text-amber-300 mr-2" /> Upcoming & In-Progress Events
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {events.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No events scheduled.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {events.map((e) => {
                const pct = e.registered
                  ? Math.min(100, Math.round((e.checkedIn / e.registered) * 100))
                  : 0;
                return (
                  <div
                    key={e.id}
                    className="rounded-xl border border-white/10 bg-slate-950/70 p-3 space-y-2"
                  >
                    <p className="text-xs font-bold text-white truncate">{e.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{e.venue}</p>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">
                        {e.checkedIn}/{e.registered}
                      </span>
                      <span className="text-emerald-300">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center pt-4">
        <Link href="/dashboard/volunteer/scanner">
          <Button variant="neonCyan" size="lg" className="text-xs font-bold px-6">
            <Camera className="w-4 h-4 mr-2" /> Open Fullscreen Scanner Console
          </Button>
        </Link>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent?: string;
}) {
  return (
    <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-xl">
      <CardContent className="p-5 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          <span>{label}</span>
          {icon}
        </div>
        <p className={`text-2xl sm:text-3xl font-black font-mono ${accent ?? "text-white"}`}>
          {typeof value === "number" ? value.toLocaleString("en-IN") : value}
        </p>
      </CardContent>
    </Card>
  );
}

function resultClass(result: string) {
  switch (result) {
    case "SUCCESS":
      return "border-emerald-500/30 text-emerald-400 bg-emerald-500/10";
    case "WARNING":
      return "border-amber-500/30 text-amber-400 bg-amber-500/10";
    default:
      return "border-red-500/30 text-red-400 bg-red-500/10";
  }
}

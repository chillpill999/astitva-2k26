// ============================================================================
// ASTITVA 2K26 - Volunteer Scanner & Terminal (Exteta Luxury Aesthetic)
// Path: app/dashboard/volunteer/page.tsx
// ============================================================================

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  QrCode,
  Users,
  UserCheck,
  ShieldAlert,
  Activity,
} from "lucide-react";
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
    <div className="space-y-8 animate-in fade-in-50 duration-300 text-[#1A1918]">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#8E8D8A]/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <RoleBadge role="VOLUNTEER" />
            <span className="text-xs font-mono text-[#E85A4F] font-bold bg-[#EAE7DC] px-2 py-0.5 rounded border border-[#8E8D8A]/20">
              {user.name} · Gate Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1918] tracking-tight uppercase font-mono">
            Scanner &amp; Gate Check-in Terminal
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono">
            Real-time QR verification, manual roll lookup, and check-in audit · {todayLabel}
          </p>
        </div>
        <Link href="/dashboard/volunteer/scanner">
          <button className="px-4 py-2 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-colors flex items-center gap-1.5 shadow-sm">
            <QrCode className="w-4 h-4" />
            Launch Optical Scanner
          </button>
        </Link>
      </div>

      {/* 2. KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KpiCard
          icon={<Users className="h-4 w-4 text-[#1A1918]" />}
          label="Total Registered"
          value={metrics.totalRegistered}
        />
        <KpiCard
          icon={<UserCheck className="h-4 w-4 text-[#E85A4F]" />}
          label="Checked In"
          value={metrics.totalCheckedIn}
          accent="text-[#E85A4F]"
        />
        <KpiCard
          icon={<Activity className="h-4 w-4 text-[#1A1918]" />}
          label="Attendance"
          value={`${metrics.attendancePercent.toFixed(1)}%`}
          accent="text-[#1A1918]"
        />
        <KpiCard
          icon={<ShieldAlert className="h-4 w-4 text-[#E85A4F]" />}
          label="Flagged Scans"
          value={metrics.duplicateAttempts + metrics.invalidAttempts}
          accent="text-[#E85A4F]"
        />
      </div>

      {/* 3. Events Check-in Status */}
      <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="border-b border-[#8E8D8A]/20 pb-4">
          <h2 className="text-base font-bold font-mono text-[#1A1918] uppercase">
            Active Tournaments Gate Status
          </h2>
          <p className="text-xs text-[#8E8D8A] font-mono mt-1">
            Real-time participant check-in percentage across event gates.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((evt) => {
            const pct = evt.registered > 0 ? Math.round((evt.checkedIn / evt.registered) * 100) : 0;
            return (
              <div key={evt.id} className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-3 font-mono">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1918] uppercase truncate">{evt.title}</h3>
                    <p className="text-[10px] text-[#8E8D8A]">{evt.venue} · Day 0{evt.dayNumber}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#E85A4F]">{pct}%</span>
                </div>
                <div className="w-full bg-[#F6F4EE] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#E85A4F] h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#8E8D8A]">
                  <span>{evt.checkedIn} / {evt.registered} Present</span>
                  <Link href={`/dashboard/volunteer/scanner?event=${evt.id}`}>
                    <span className="font-bold text-[#E85A4F] hover:underline">Open Gate →</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Recent Check-in Logs */}
      <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="border-b border-[#8E8D8A]/20 pb-4">
          <h2 className="text-base font-bold font-mono text-[#1A1918] uppercase">
            Live Check-In Logs (Last 30 Scans)
          </h2>
          <p className="text-xs text-[#8E8D8A] font-mono mt-1">
            Real-time audit log of QR scanner and manual roll check-ins.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#EAE7DC] border-b border-[#8E8D8A]/20 uppercase text-[#1A1918]">
              <tr>
                <th className="py-3 px-4">Participant</th>
                <th className="py-3 px-4">Participant ID</th>
                <th className="py-3 px-4">Tournament</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-right">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8E8D8A]/15">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#EAE7DC]/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#1A1918]">{log.participantName || log.participantId}</td>
                  <td className="py-3 px-4 text-[#8E8D8A]">{log.participantId || "—"}</td>
                  <td className="py-3 px-4 text-[#1A1918]">{log.eventTitle || "Campus Gate"}</td>
                  <td className="py-3 px-4 text-[#8E8D8A]">{formatTime(log.timestamp)}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      log.result === "SUCCESS"
                        ? "bg-[#EAE7DC] text-[#E85A4F]"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {log.result}
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

function KpiCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-5 shadow-sm space-y-2">
      <div className="flex items-center justify-between text-xs font-mono text-[#8E8D8A]">
        <span>{label}</span>
        {icon}
      </div>
      <p className={`text-2xl sm:text-3xl font-mono font-bold ${accent || "text-[#1A1918]"}`}>
        {value}
      </p>
    </div>
  );
}

// ============================================================================
// ASTITVA 2K26 - Volunteer Scanner Dashboard (Server Component)
// Path: app/dashboard/volunteer/scanner/page.tsx
// ============================================================================

import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Radio, Activity, QrCode } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  getVolunteerEventSummaries,
  getAttendanceMetrics,
  getRecentCheckInLogs,
} from "@/lib/attendance/actions";
import { VolunteerScannerClient } from "@/components/scanner/VolunteerScannerClient";
import { AttendanceWidgets } from "@/components/attendance/AttendanceWidgets";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Scanner Terminal | ASTITVA 2K26",
  description: "Encrypted QR check-in, attendance telemetry, and duplicate prevention.",
};

export default async function VolunteerScannerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/dashboard/volunteer/scanner");
  if (!["VOLUNTEER", "EVENT_COORDINATOR", "ADMIN"].includes(user.role)) {
    redirect("/unauthorized?attempted=/dashboard/volunteer/scanner");
  }

  const [eventSummaries, metrics, logs] = await Promise.all([
    getVolunteerEventSummaries(20),
    getAttendanceMetrics(null),
    getRecentCheckInLogs({ take: 25 }),
  ]);

  const scannerName = user.name || "Volunteer Operator";
  const eventOptions = eventSummaries.map((e) => ({
    id: e.id,
    title: e.title,
    venue: e.venue,
  }));

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center">
            <Radio className="h-6 w-6 text-cyan-400 mr-2 animate-pulse" />
            Scanner Terminal · {scannerName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            HMAC-SHA256 signed badges, anti-tamper checks, rate-limited at 30 scans/min, duplicate
            blocked at the database level.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/volunteer">
            <Button variant="outline" size="sm" className="text-xs">
              Back to Overview
            </Button>
          </Link>
        </div>
      </div>

      <section aria-label="Attendance metrics">
        <AttendanceWidgets metrics={metrics} scope="festival" />
      </section>

      <section aria-label="Live scanner console">
        <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white flex items-center">
              <QrCode className="h-4 w-4 text-cyan-300 mr-2" /> Webcam & Manual Console
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-1">
              Pick a tournament, aim the camera, or use manual lookup. Each scan writes an
              immutable CheckInLog + AuditLog entry.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VolunteerScannerClient
              events={eventOptions}
              initialLogs={logs}
              scannerName={scannerName}
            />
          </CardContent>
        </Card>
      </section>

      <section aria-label="Per-event summary">
        <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white flex items-center">
              <Activity className="h-4 w-4 text-emerald-300 mr-2" /> Per-Event Live Summary
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-1">
              Snapshot of upcoming and in-progress tournaments.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {eventSummaries.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">
                No active events to display.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {eventSummaries.map((e) => {
                  const pct = e.registered
                    ? Math.min(100, Math.round((e.checkedIn / e.registered) * 100))
                    : 0;
                  return (
                    <div
                      key={e.id}
                      className="rounded-xl border border-white/10 bg-slate-950/70 p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-white truncate pr-2">
                          {e.title}
                        </p>
                        <span className="text-[10px] font-mono text-cyan-300">
                          Day {e.dayNumber}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{e.venue}</p>
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">
                          {e.checkedIn}/{e.registered} checked-in
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
      </section>
    </div>
  );
}

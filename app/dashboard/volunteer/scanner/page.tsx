// ============================================================================
// ASTITVA 2K26 - Volunteer Scanner Dashboard (Exteta Luxury Aesthetic)
// Path: app/dashboard/volunteer/scanner/page.tsx
// ============================================================================

import { redirect } from "next/navigation";
import { Radio, Activity, QrCode } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  getVolunteerEventSummaries,
  getAttendanceMetrics,
  getRecentCheckInLogs,
} from "@/lib/attendance/actions";
import { VolunteerScannerClient } from "@/components/scanner/VolunteerScannerClient";
import { AttendanceWidgets } from "@/components/attendance/AttendanceWidgets";
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
    <div className="space-y-8 animate-in fade-in-50 duration-300 text-[#1A1918]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#8E8D8A]/20 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1918] tracking-tight uppercase font-mono flex items-center">
            <Radio className="h-6 w-6 text-[#E85A4F] mr-2" />
            Scanner Terminal · {scannerName}
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono mt-1">
            Digitally signed badges, anti-tamper verification, and duplicate check-in prevention.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/volunteer">
            <button className="px-4 py-2 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-mono font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all">
              Back to Overview
            </button>
          </Link>
        </div>
      </div>

      <section aria-label="Attendance metrics">
        <AttendanceWidgets metrics={metrics} scope="festival" />
      </section>

      <section aria-label="Live scanner console">
        <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="border-b border-[#8E8D8A]/20 pb-4">
            <h2 className="text-base font-bold font-mono text-[#1A1918] uppercase flex items-center">
              <QrCode className="h-4 w-4 text-[#E85A4F] mr-2" /> Optical &amp; Manual Console
            </h2>
            <p className="text-xs text-[#8E8D8A] font-mono mt-1">
              Pick a tournament, aim the camera, or use manual lookup. Each scan writes an
              immutable CheckInLog entry.
            </p>
          </div>
          <div>
            <VolunteerScannerClient
              events={eventOptions}
              initialLogs={logs}
              scannerName={scannerName}
            />
          </div>
        </div>
      </section>

      <section aria-label="Per-event summary">
        <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="border-b border-[#8E8D8A]/20 pb-4">
            <h2 className="text-base font-bold font-mono text-[#1A1918] uppercase flex items-center">
              <Activity className="h-4 w-4 text-[#E85A4F] mr-2" /> Per-Event Live Summary
            </h2>
            <p className="text-xs text-[#8E8D8A] font-mono mt-1">
              Snapshot of upcoming and in-progress tournaments.
            </p>
          </div>
          <div>
            {eventSummaries.length === 0 ? (
              <p className="text-xs font-mono text-[#8E8D8A] italic py-4">
                No active events to display.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono">
                {eventSummaries.map((e) => {
                  const pct = e.registered
                    ? Math.min(100, Math.round((e.checkedIn / e.registered) * 100))
                    : 0;
                  return (
                    <div
                      key={e.id}
                      className="rounded-2xl border border-[#8E8D8A]/20 bg-[#EAE7DC] p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#1A1918] uppercase truncate pr-2">
                          {e.title}
                        </p>
                        <span className="text-[10px] text-[#E85A4F] font-bold">
                          Day 0{e.dayNumber}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#8E8D8A] truncate">{e.venue}</p>
                      <div className="flex items-center justify-between text-[10px] text-[#8E8D8A]">
                        <span>
                          {e.checkedIn}/{e.registered} checked-in
                        </span>
                        <span className="font-bold text-[#1A1918]">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-[#F6F4EE] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#E85A4F] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

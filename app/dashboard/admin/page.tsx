// ============================================================================
// ASTITVA 2K26 - Admin Control Center
// Path: app/dashboard/admin/page.tsx
// ============================================================================

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Users,
  Trophy,
  UserCheck,
  Search,
  Download,
  TrendingUp,
  Shield,
  FileSpreadsheet,
  Megaphone,
  Calendar,
  Award,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth/auth";
import { getAdminAnalytics } from "@/lib/analytics/actions";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Control Center | ASTITVA 2K26",
  description: "Festival-wide operations, analytics, and exports.",
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  EVENT_COORDINATOR: "Coordinator",
  VOLUNTEER: "Volunteer",
  TEAM_CAPTAIN: "Captain",
  PARTICIPANT: "Participant",
};

const EXPORT_KINDS = ["registrations", "attendance", "results", "certificates", "participants", "teams"] as const;

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/dashboard/admin");
  if (user.role !== "ADMIN") redirect("/unauthorized?attempted=/dashboard/admin");

  const data = await getAdminAnalytics();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 text-[#1A1918] dark:text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Admin Control Center</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Signed in as {user.name}. Real-time festival metrics from the production database.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/admin/analytics">
            <Button variant="neonCyan" size="sm" className="text-xs font-bold">
              <Activity className="h-4 w-4 mr-1.5" /> Analytics
            </Button>
          </Link>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/api/export/registrations?format=csv">
            <Button variant="outline" size="sm" className="text-xs font-bold">
              <Download className="h-4 w-4 mr-1.5" /> Export
            </Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Kpi icon={<Users className="h-4 w-4 text-cyan-300" />} label="Users" value={data.totals.users} />
        <Kpi icon={<UserCheck className="h-4 w-4 text-emerald-300" />} label="Registrations" value={data.totals.registrations} accent="text-emerald-300" />
        <Kpi icon={<Trophy className="h-4 w-4 text-amber-300" />} label="Events" value={data.totals.events} accent="text-amber-300" />
        <Kpi icon={<Award className="h-4 w-4 text-purple-300" />} label="Certificates" value={data.totals.certificates} accent="text-purple-300" />
        <Kpi icon={<Megaphone className="h-4 w-4 text-rose-300" />} label="Active Announcements" value={data.totals.announcements} accent="text-rose-300" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass-panel border-white/10 bg-slate-900/70 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white flex items-center">
              <TrendingUp className="h-4 w-4 text-cyan-300 mr-2" /> 14-Day Registration Velocity
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              New registrations per day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.registrationVelocity.length === 0 ? (
              <EmptyHint label="No registrations yet" />
            ) : (
              <div className="grid grid-cols-14 gap-1.5 h-32 items-end" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
                {(() => {
                  const max = Math.max(1, ...data.registrationVelocity.map((v) => v.count));
                  return data.registrationVelocity.map((v) => (
                    <div key={v.day} className="flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-md bg-gradient-to-t from-cyan-500/30 to-cyan-300/90 border border-cyan-400/40"
                        style={{ height: `${Math.max(4, (v.count / max) * 110)}px` }}
                        title={`${v.count} registrations on ${v.day}`}
                      />
                      <span className="text-[8px] font-mono text-slate-500">{v.day}</span>
                    </div>
                  ));
                })()}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10 bg-slate-900/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white">Attendance Rate</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              {data.totals.attendance} scans / {data.totals.registrations} registrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-4xl font-black font-mono text-emerald-300">
              {data.attendanceRate.toFixed(1)}%
            </p>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                style={{ width: `${Math.min(100, data.attendanceRate)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              {data.totals.teams} teams · {data.totals.announcements} active announcements
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel border-white/10 bg-slate-900/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-white flex items-center">
            <FileSpreadsheet className="h-4 w-4 text-amber-300 mr-2" /> Data Export Center
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Download CSV or Excel of operational datasets. All downloads are audit-logged.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EXPORT_KINDS.map((e) => (
              <div key={e} className="rounded-xl border border-white/10 bg-slate-950/70 p-3 space-y-2">
                <p className="text-sm font-bold text-white capitalize">{e}</p>
                <p className="text-[10px] text-slate-400 font-mono">/api/export/{e}</p>
                <div className="flex gap-2">
                  <a href={`/api/export/${e}?format=csv`}>
                    <Button size="sm" variant="outline" className="text-[10px] font-bold">
                      <Download className="h-3 w-3 mr-1" /> CSV
                    </Button>
                  </a>
                  <a href={`/api/export/${e}?format=xlsx`}>
                    <Button size="sm" variant="neonCyan" className="text-[10px] font-bold">
                      <Download className="h-3 w-3 mr-1" /> XLSX
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel border-white/10 bg-slate-900/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-white flex items-center">
            <Shield className="h-4 w-4 text-rose-300 mr-2" /> Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <Link href="/dashboard/admin/analytics" className="rounded-lg border border-white/10 bg-slate-950/70 p-3 hover:border-cyan-500/40">
            <Activity className="h-4 w-4 text-cyan-300 mb-1" /> Detailed Analytics
          </Link>
          <Link href="/announcements" className="rounded-lg border border-white/10 bg-slate-950/70 p-3 hover:border-cyan-500/40">
            <Megaphone className="h-4 w-4 text-rose-300 mb-1" /> Announcements
          </Link>
          <Link href="/results" className="rounded-lg border border-white/10 bg-slate-950/70 p-3 hover:border-cyan-500/40">
            <Trophy className="h-4 w-4 text-amber-300 mb-1" /> Results
          </Link>
          <Link href="/schedule" className="rounded-lg border border-white/10 bg-slate-950/70 p-3 hover:border-cyan-500/40">
            <Calendar className="h-4 w-4 text-emerald-300 mb-1" /> Schedule
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <Card className="glass-panel border-white/10 bg-slate-900/70">
      <CardContent className="p-4 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          <span>{label}</span>
          {icon}
        </div>
        <p className={`text-2xl font-black font-mono ${accent ?? "text-white"}`}>
          {value.toLocaleString("en-IN")}
        </p>
      </CardContent>
    </Card>
  );
}

function EmptyHint({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/60 p-6 text-center">
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}

// ============================================================================
// ASTITVA 2K26 - Admin Analytics (Real DB)
// Path: app/dashboard/admin/analytics/page.tsx
// ============================================================================

import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Users,
  Trophy,
  UserCheck,
  Download,
  FileSpreadsheet,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getCurrentUser } from "@/lib/auth/auth";
import { getAdminAnalytics } from "@/lib/analytics/actions";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Analytics | ASTITVA 2K26",
  description: "Festival-wide operational analytics and export center.",
};

const EXPORT_KINDS = [
  { key: "registrations", label: "Registrations" },
  { key: "attendance", label: "Attendance" },
  { key: "results", label: "Results" },
  { key: "certificates", label: "Certificates" },
  { key: "participants", label: "Participants" },
  { key: "teams", label: "Teams" },
] as const;

export default async function AdminAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/dashboard/admin/analytics");
  if (user.role !== "ADMIN") redirect("/unauthorized?attempted=/dashboard/admin/analytics");

  const data = await getAdminAnalytics();
  const maxVelocity = Math.max(1, ...data.registrationVelocity.map((v) => v.count));
  const maxBranch = Math.max(1, ...data.branchDistribution.map((b) => b.count));
  const maxCat = Math.max(1, ...data.categoryPopularity.map((c) => c.count));
  const maxGender = Math.max(1, ...data.genderDistribution.map((g) => g.count));

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center">
            <BarChart3 className="h-6 w-6 text-cyan-300 mr-2" /> Global Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time festival metrics from the live production database. Every audit action is
            recorded in the security log.
          </p>
        </div>
        <Link href="/dashboard/admin">
          <Button variant="outline" size="sm" className="text-xs">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Control Center
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Kpi
          icon={<Users className="h-4 w-4 text-cyan-300" />}
          label="Users"
          value={data.totals.users}
        />
        <Kpi
          icon={<UserCheck className="h-4 w-4 text-emerald-300" />}
          label="Registrations"
          value={data.totals.registrations}
          accent="text-emerald-300"
        />
        <Kpi
          icon={<Trophy className="h-4 w-4 text-amber-300" />}
          label="Events"
          value={data.totals.events}
          accent="text-amber-300"
        />
        <Kpi
          icon={<Trophy className="h-4 w-4 text-amber-300" />}
          label="Results"
          value={data.totals.results}
        />
        <Kpi
          icon={<TrendingUp className="h-4 w-4 text-purple-300" />}
          label="Certificates"
          value={data.totals.certificates}
          accent="text-purple-300"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass-panel border-white/10 bg-slate-900/70 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white flex items-center">
              <TrendingUp className="h-4 w-4 text-cyan-300 mr-2" /> 14-Day Registration Velocity
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              New registrations per day, live from the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-14 gap-1.5 h-32 items-end" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
              {data.registrationVelocity.map((v) => (
                <div key={v.day} className="flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-md bg-gradient-to-t from-cyan-500/30 to-cyan-300/90 border border-cyan-400/40"
                    style={{ height: `${Math.max(6, (v.count / maxVelocity) * 110)}px` }}
                    title={`${v.count} registrations on ${v.day}`}
                  />
                  <span className="text-[8px] font-mono text-slate-500">{v.day}</span>
                </div>
              ))}
            </div>
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
            <Progress value={Math.min(100, data.attendanceRate)} className="h-2 bg-slate-800" />
            <p className="text-[11px] text-slate-400 pt-1">
              {data.totals.teams} teams · {data.totals.announcements} active announcements
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass-panel border-white/10 bg-slate-900/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white">Branch Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.branchDistribution.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No data yet.</p>
            ) : (
              data.branchDistribution.map((b) => (
                <div key={b.branch} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-cyan-300">{b.branch}</span>
                    <span className="text-slate-400">{b.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
                      style={{ width: `${(b.count / maxBranch) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10 bg-slate-900/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white">Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.genderDistribution.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No data yet.</p>
            ) : (
              data.genderDistribution.map((g) => (
                <div key={g.gender} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-amber-300">{g.gender}</span>
                    <span className="text-slate-400">{g.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-pink-400"
                      style={{ width: `${(g.count / maxGender) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel border-white/10 bg-slate-900/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-white">Category Popularity</CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Total registrations per category.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.categoryPopularity.map((c) => (
            <div key={c.category} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{c.category}</span>
                <span className="text-slate-400 font-mono">{c.count}</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                  style={{ width: `${(c.count / maxCat) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-panel border-white/10 bg-slate-900/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-white flex items-center">
            <FileSpreadsheet className="h-4 w-4 text-amber-300 mr-2" /> Data Export Center
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Download CSV or Excel (.xlsx) of any operational dataset. All downloads are audit-logged.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EXPORT_KINDS.map((e) => (
              <div
                key={e.key}
                className="rounded-xl border border-white/10 bg-slate-950/70 p-3 space-y-2"
              >
                <p className="text-sm font-bold text-white">{e.label}</p>
                <p className="text-[10px] text-slate-400 font-mono">/api/export/{e.key}</p>
                <div className="flex gap-2">
                  <a
                    href={`/api/export/${e.key}?format=csv`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline" className="text-[10px] font-bold">
                      <Download className="h-3 w-3 mr-1" /> CSV
                    </Button>
                  </a>
                  <a
                    href={`/api/export/${e.key}?format=xlsx`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
          <CardTitle className="text-base font-bold text-white">Top Events by Check-ins</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {data.topScoringEvents.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No check-ins recorded yet.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {data.topScoringEvents.map((e) => (
                <li
                  key={e.id}
                  className="py-2 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{e.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{e.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-mono text-emerald-300 font-bold">
                      {e.checkIns} / {e.registered}
                    </p>
                    <Badge variant="outline" className="text-[9px] border-cyan-500/30 text-cyan-300 font-mono">
                      {e.registered
                        ? `${Math.min(100, Math.round((e.checkIns / e.registered) * 100))}%`
                        : "0%"}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
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

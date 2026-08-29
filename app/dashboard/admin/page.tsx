// ============================================================================
// ASTITVA 2K26 - Admin Executive Control Center (Exteta Luxury Aesthetic)
// Path: app/dashboard/admin/page.tsx
// ============================================================================

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Users,
  Trophy,
  UserCheck,
  Download,
  TrendingUp,
  Shield,
  FileSpreadsheet,
  Megaphone,
  Calendar,
  Award,
  Activity,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/auth";
import { getAdminAnalytics } from "@/lib/analytics/actions";
import { RoleBadge } from "@/components/dashboard/RoleBadge";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Executive Control Center | ASTITVA 2K26",
  description: "Festival-wide operations, real-time metrics, live scoring supervision, and data exports.",
};

const EXPORT_KINDS = [
  { key: "registrations", label: "Registrations", desc: "Full student registration roster" },
  { key: "attendance", label: "Attendance", desc: "Gate & event check-in logs" },
  { key: "results", label: "Results", desc: "Podium winners and scores" },
  { key: "certificates", label: "Certificates", desc: "Issued certificate hashes" },
  { key: "participants", label: "Participants", desc: "Verified student profiles" },
  { key: "teams", label: "Teams", desc: "Squad rosters and invite codes" },
] as const;

const ADMIN_EMAILS = [
  "aryanrockstar2007@gmail.com",
  "technogamerzthenextlevel@gmail.com",
  ...(process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
];

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/dashboard/admin");

  const isAuthorized =
    user.role === "ADMIN" &&
    ADMIN_EMAILS.includes(user.email.toLowerCase().trim());

  if (!isAuthorized) {
    redirect("/unauthorized?attempted=/dashboard/admin");
  }

  const data = await getAdminAnalytics();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 text-[#1A1918]">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#8E8D8A]/20 pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <RoleBadge role="ADMIN" />
            <span className="text-[10px] font-mono text-[#8E8D8A] uppercase font-bold">
              Root Authority · LNJPIT Festival Security
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight uppercase font-mono">
            Executive Control Center
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono">
            Signed in as <strong className="text-[#1A1918]">{user.name}</strong> ({user.email}). Live database telemetry &amp; operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/dashboard/admin/analytics">
            <button className="px-4 py-2.5 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
              <Activity className="h-4 w-4" /> Global Analytics
            </button>
          </Link>
          <Link href="/dashboard/coordinator/results">
            <button className="px-4 py-2.5 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-mono font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all flex items-center gap-1.5 cursor-pointer">
              <Trophy className="h-4 w-4" /> Live Scoring Deck
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 font-mono">
        <KpiCard icon={<Users className="h-4 w-4 text-[#1A1918]" />} label="Total Users" value={data.totals.users} />
        <KpiCard icon={<UserCheck className="h-4 w-4 text-[#E85A4F]" />} label="Registrations" value={data.totals.registrations} accent="text-[#E85A4F]" />
        <KpiCard icon={<Trophy className="h-4 w-4 text-[#1A1918]" />} label="Tournaments" value={data.totals.events} />
        <KpiCard icon={<Award className="h-4 w-4 text-[#E85A4F]" />} label="Certificates" value={data.totals.certificates} accent="text-[#E85A4F]" />
        <KpiCard icon={<Megaphone className="h-4 w-4 text-[#1A1918]" />} label="Announcements" value={data.totals.announcements} />
      </div>

      {/* Main Grid: Velocity & Attendance Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): 14-Day Registration Velocity */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-5 font-mono">
            <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-4">
              <div>
                <h2 className="text-base font-bold uppercase text-[#1A1918] flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#E85A4F]" />
                  14-Day Registration Velocity
                </h2>
                <p className="text-xs text-[#8E8D8A] mt-0.5">
                  Daily incoming student registrations across all departments.
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#E85A4F] uppercase">
                Live Postgres Stream
              </span>
            </div>

            {data.registrationVelocity.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 text-center text-xs text-[#8E8D8A]">
                No registration velocity data recorded yet.
              </div>
            ) : (
              <div className="pt-4">
                <div
                  className="grid gap-2 h-36 items-end"
                  style={{ gridTemplateColumns: `repeat(${Math.max(1, data.registrationVelocity.length)}, minmax(0, 1fr))` }}
                >
                  {(() => {
                    const max = Math.max(1, ...data.registrationVelocity.map((v) => v.count));
                    return data.registrationVelocity.map((v) => (
                      <div key={v.day} className="flex flex-col items-center gap-1.5 group">
                        <div
                          className="w-full rounded-lg bg-[#E85A4F]/20 group-hover:bg-[#E85A4F] border border-[#E85A4F]/40 transition-all cursor-pointer relative"
                          style={{ height: `${Math.max(8, (v.count / max) * 120)}px` }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1A1918] text-[#EAE7DC] text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none transition-opacity">
                            {v.count} regs
                          </div>
                        </div>
                        <span className="text-[8px] text-[#8E8D8A] truncate w-full text-center">
                          {v.day.slice(5)}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Attendance & Gate Telemetry */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-5 font-mono">
            <div className="border-b border-[#8E8D8A]/20 pb-3">
              <h2 className="text-xs font-bold uppercase text-[#1A1918] flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-[#E85A4F]" /> Gate &amp; Check-in Rate
              </h2>
              <p className="text-[11px] text-[#8E8D8A] mt-0.5">
                {data.totals.attendance} scans / {data.totals.registrations} registrations
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl sm:text-4xl font-black text-[#1A1918]">
                  {data.attendanceRate.toFixed(1)}%
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white uppercase">
                  ACTIVE
                </span>
              </div>
              <div className="h-2.5 bg-[#F6F4EE] rounded-full overflow-hidden border border-[#8E8D8A]/20">
                <div
                  className="h-full bg-[#E85A4F] transition-all"
                  style={{ width: `${Math.min(100, data.attendanceRate)}%` }}
                />
              </div>
              <p className="text-[10px] text-[#8E8D8A]">
                {data.totals.teams} registered squads · {data.totals.announcements} active broadcasts
              </p>
            </div>

            <div className="space-y-2">
              <Link href="/dashboard/volunteer/scanner" className="block">
                <button className="w-full py-2.5 px-4 rounded-xl bg-[#1A1918] text-[#EAE7DC] text-xs font-bold uppercase hover:bg-[#E85A4F] transition-all cursor-pointer">
                  Launch QR Gate Terminal
                </button>
              </Link>
              <Link href="/announcements" className="block">
                <button className="w-full py-2.5 px-4 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer">
                  Broadcast Notice
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Data Export Center */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-5 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#8E8D8A]/20 pb-4">
          <div>
            <h2 className="text-base font-bold uppercase text-[#1A1918] flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-[#E85A4F]" />
              Data Export Center
            </h2>
            <p className="text-xs text-[#8E8D8A] mt-0.5">
              Instant CSV &amp; Excel dumps of operational tables. All downloads are audit-logged.
            </p>
          </div>
          <span className="text-[10px] text-[#8E8D8A] uppercase font-bold">
            Audit Tracked · SHA-256
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPORT_KINDS.map((item) => (
            <div
              key={item.key}
              className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 space-y-3 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#1A1918] uppercase">{item.label}</p>
                <p className="text-[11px] text-[#8E8D8A]">{item.desc}</p>
                <code className="text-[10px] text-[#E85A4F] block">/api/export/{item.key}</code>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#8E8D8A]/20">
                <a href={`/api/export/${item.key}?format=csv`} className="flex-1">
                  <button className="w-full py-1.5 px-3 rounded-lg border border-[#8E8D8A]/35 bg-[#F6F4EE] text-[#1A1918] text-[10px] font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all flex items-center justify-center gap-1 cursor-pointer">
                    <Download className="h-3 w-3" /> CSV
                  </button>
                </a>
                <a href={`/api/export/${item.key}?format=xlsx`} className="flex-1">
                  <button className="w-full py-1.5 px-3 rounded-lg bg-[#E85A4F] text-white text-[10px] font-bold uppercase hover:bg-[#C94A40] transition-all flex items-center justify-center gap-1 cursor-pointer">
                    <Download className="h-3 w-3" /> XLSX
                  </button>
                </a>
              </div>
            </div>
          ))}
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
  value: number;
  accent?: string;
}) {
  return (
    <div className="p-5 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-2">
      <div className="flex items-center justify-between text-[10px] text-[#8E8D8A] uppercase font-bold">
        <span>{label}</span>
        {icon}
      </div>
      <p className={`text-2xl sm:text-3xl font-black ${accent ?? "text-[#1A1918]"}`}>
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

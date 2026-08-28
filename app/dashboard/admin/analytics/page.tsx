// ============================================================================
// ASTITVA 2K26 - Admin Analytics (Exteta Luxury Aesthetic)
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
  ArrowLeft,
} from "lucide-react";
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
    <div className="space-y-8 animate-in fade-in-50 duration-300 text-[#1A1918]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#8E8D8A]/20 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1918] tracking-tight uppercase font-mono flex items-center">
            <BarChart3 className="h-6 w-6 text-[#E85A4F] mr-2" /> Global Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono mt-1">
            Real-time festival metrics from the live production database. Every audit action is
            recorded in the security log.
          </p>
        </div>
        <Link href="/dashboard/admin">
          <button className="px-4 py-2 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-mono font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Control Center
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 font-mono">
        <Kpi
          icon={<Users className="h-4 w-4 text-[#1A1918]" />}
          label="Users"
          value={data.totals.users}
        />
        <Kpi
          icon={<UserCheck className="h-4 w-4 text-[#E85A4F]" />}
          label="Registrations"
          value={data.totals.registrations}
          accent="text-[#E85A4F]"
        />
        <Kpi
          icon={<Trophy className="h-4 w-4 text-[#1A1918]" />}
          label="Events"
          value={data.totals.events}
        />
        <Kpi
          icon={<Trophy className="h-4 w-4 text-[#1A1918]" />}
          label="Results"
          value={data.totals.results}
        />
        <Kpi
          icon={<TrendingUp className="h-4 w-4 text-[#E85A4F]" />}
          label="Certificates"
          value={data.totals.certificates}
          accent="text-[#E85A4F]"
        />
      </div>

      {/* CSV Export Bar */}
      <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 shadow-sm space-y-3 font-mono">
        <h2 className="text-xs font-bold uppercase text-[#1A1918] flex items-center">
          <Download className="h-4 w-4 text-[#E85A4F] mr-2" /> Direct CSV Data Exports
        </h2>
        <div className="flex flex-wrap gap-2">
          {EXPORT_KINDS.map((k) => (
            <a
              key={k.key}
              href={`/api/admin/export?kind=${k.key}`}
              download
              className="px-3 py-1.5 rounded-xl border border-[#8E8D8A]/30 bg-[#EAE7DC] text-[#1A1918] text-xs font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all"
            >
              {k.label} CSV ↓
            </a>
          ))}
        </div>
      </div>

      {/* Two Column Visual Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* Branch distribution */}
        <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase text-[#1A1918]">Branch Enrollment</h2>
          <div className="space-y-3">
            {data.branchDistribution.map((b) => (
              <div key={b.branch} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-[#1A1918]">{b.branch}</span>
                  <span className="text-[#8E8D8A]">{b.count}</span>
                </div>
                <div className="w-full bg-[#EAE7DC] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#E85A4F] h-full rounded-full"
                    style={{ width: `${(b.count / maxBranch) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category popularity */}
        <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase text-[#1A1918]">Category Distribution</h2>
          <div className="space-y-3">
            {data.categoryPopularity.map((c) => (
              <div key={c.category} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-[#1A1918]">{c.category}</span>
                  <span className="text-[#8E8D8A]">{c.count}</span>
                </div>
                <div className="w-full bg-[#EAE7DC] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1A1918] h-full rounded-full"
                    style={{ width: `${(c.count / maxCat) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
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
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-5 shadow-sm space-y-2">
      <div className="flex items-center justify-between text-xs text-[#8E8D8A]">
        <span>{label}</span>
        {icon}
      </div>
      <p className={`text-2xl font-bold ${accent || "text-[#1A1918]"}`}>
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

// ============================================================================
// ASTITVA 2K26 - Event Coordinator Command Deck (Exteta Luxury Aesthetic)
// Path: app/dashboard/coordinator/page.tsx
// ============================================================================

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Trophy,
  Users,
  Award,
  Activity,
  ArrowRight,
  Radio,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { RoleBadge } from "@/components/dashboard/RoleBadge";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Coordinator Command Deck | ASTITVA 2K26",
  description: "Manage assigned events, broadcast live match scores, and publish official podium results.",
};

export default async function CoordinatorDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/dashboard/coordinator");
  if (!["EVENT_COORDINATOR", "ADMIN"].includes(user.role)) {
    redirect("/unauthorized?attempted=/dashboard/coordinator");
  }

  // Admin sees all events; coordinators only their own (or unassigned)
  const where =
    user.role === "ADMIN"
      ? undefined
      : { OR: [{ coordinatorId: user.id }, { coordinatorId: null }] };

  let events: any[] = [];
  try {
    events = await prisma.event.findMany({
      where,
      include: {
        category: true,
        _count: { select: { registrations: true, results: true, attendances: true } },
      },
      orderBy: [{ dayNumber: "asc" }, { scheduleStart: "asc" }],
      take: 20,
    });
  } catch {
    events = [];
  }

  const totalRegs = events.reduce((sum, e) => sum + (e._count?.registrations ?? 0), 0);
  const totalScans = events.reduce((sum, e) => sum + (e._count?.attendances ?? 0), 0);
  const totalPublished = events.reduce((sum, e) => sum + (e._count?.results ?? 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 text-[#1A1918]">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#8E8D8A]/20 pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <RoleBadge role="EVENT_COORDINATOR" />
            <span className="text-[10px] font-mono text-[#8E8D8A] uppercase font-bold">
              Tournament Jury &amp; Scoring Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight uppercase font-mono">
            Coordinator Command Deck
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono">
            Signed in as <strong className="text-[#1A1918]">{user.name}</strong>. Broadcast live match points and publish official podium winners.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/dashboard/coordinator/results">
            <button className="px-4 py-2.5 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
              <Radio className="h-4 w-4 animate-pulse" /> Live Scoring &amp; Results Hub
            </button>
          </Link>
          <Link href="/schedule">
            <button className="px-4 py-2.5 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-mono font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all flex items-center gap-1.5 cursor-pointer">
              <Calendar className="h-4 w-4" /> Festival Timeline
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <KpiCard icon={<Trophy className="h-4 w-4 text-[#E85A4F]" />} label="Assigned Events" value={events.length} accent="text-[#E85A4F]" />
        <KpiCard icon={<Users className="h-4 w-4 text-[#1A1918]" />} label="Total Registrations" value={totalRegs} />
        <KpiCard icon={<Activity className="h-4 w-4 text-[#1A1918]" />} label="Gate Check-ins" value={totalScans} />
        <KpiCard icon={<Award className="h-4 w-4 text-[#E85A4F]" />} label="Podiums Published" value={totalPublished} accent="text-[#E85A4F]" />
      </div>

      {/* Events Roster */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-5 font-mono">
        <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-4">
          <div>
            <h2 className="text-base font-bold uppercase text-[#1A1918] flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#E85A4F]" />
              Tournament Management Roster ({events.length})
            </h2>
            <p className="text-xs text-[#8E8D8A] mt-0.5">
              Live status, registered participant counts, and 1-click live score access.
            </p>
          </div>
          <Link href="/dashboard/coordinator/results" className="text-xs font-bold text-[#E85A4F] hover:underline">
            Open Live Broadcast Console →
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 text-center space-y-2">
            <Sparkles className="h-6 w-6 text-[#E85A4F] mx-auto" />
            <p className="text-xs font-bold text-[#1A1918] uppercase">No events assigned yet</p>
            <p className="text-[11px] text-[#8E8D8A]">
              Contact the central admin committee to assign your coordination responsibilities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((e) => (
              <div
                key={e.id}
                className="p-5 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 hover:border-[#E85A4F]/60 transition-all space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
                    {e.category.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      e.status === "ONGOING"
                        ? "bg-[#E85A4F] text-white"
                        : e.status === "COMPLETED"
                        ? "bg-emerald-600 text-white"
                        : "bg-[#F6F4EE] text-[#1A1918] border border-[#8E8D8A]/30"
                    }`}
                  >
                    {e.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#1A1918] uppercase">{e.title}</h3>
                  <p className="text-xs text-[#8E8D8A] flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#E85A4F]" /> {e.venue} · Day 0{e.dayNumber}
                  </p>
                  {e.subtitle && (
                    <p className="text-[11px] font-bold text-[#E85A4F] bg-[#F6F4EE] px-2.5 py-1 rounded-lg border border-[#8E8D8A]/20">
                      ⚡ {e.subtitle}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#8E8D8A]/20 text-center text-[10px]">
                  <div className="p-2 rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/20">
                    <span className="text-[#8E8D8A] block">REGS</span>
                    <strong className="text-xs text-[#1A1918]">{e._count.registrations}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/20">
                    <span className="text-[#8E8D8A] block">SCANS</span>
                    <strong className="text-xs text-[#1A1918]">{e._count.attendances}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/20">
                    <span className="text-[#8E8D8A] block">PODIUM</span>
                    <strong className="text-xs text-[#E85A4F]">{e._count.results > 0 ? "PUBLISHED" : "PENDING"}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Link href={`/events/${e.id}`} className="text-[11px] text-[#8E8D8A] hover:text-[#1A1918] hover:underline">
                    Public View →
                  </Link>
                  <Link href="/dashboard/coordinator/results">
                    <button className="px-3 py-1.5 rounded-lg bg-[#E85A4F] text-white text-[10px] font-bold uppercase hover:bg-[#C94A40] transition-all flex items-center gap-1 cursor-pointer">
                      Score / Podium <ArrowRight className="h-3 w-3" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
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

// ============================================================================
// ASTITVA 2K26 - Event Coordinator Dashboard (real DB)
// Path: app/dashboard/coordinator/page.tsx
// ============================================================================

import Link from "next/link";
import { redirect } from "next/navigation";
import { Trophy, Users, FileCheck, Award, Activity, ArrowRight, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Coordinator Dashboard | ASTITVA 2K26",
  description: "Manage your assigned events, score entry, and results.",
};

function statusLabel(s: string) {
  return s.replace(/_/g, " ");
}

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

  const events = await prisma.event.findMany({
    where,
    include: {
      category: true,
      _count: { select: { registrations: true, results: true, attendances: true } },
    },
    orderBy: [{ dayNumber: "asc" }, { scheduleStart: "asc" }],
    take: 20,
  });

  const totalRegs = events.reduce((sum, e) => sum + e._count.registrations, 0);
  const totalScans = events.reduce((sum, e) => sum + e._count.attendances, 0);
  const totalPublished = events.reduce((sum, e) => sum + e._count.results, 0);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Coordinator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage assigned events, record scores, and publish results.
          </p>
        </div>
        <Link href="/dashboard/coordinator/results">
          <Button variant="neonAmber" size="sm" className="text-xs font-bold">
            <Trophy className="h-4 w-4 mr-1.5" /> Open Results Publisher
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Kpi icon={<Trophy className="h-4 w-4 text-amber-300" />} label="Events" value={events.length} accent="text-amber-300" />
        <Kpi icon={<Users className="h-4 w-4 text-cyan-300" />} label="Registrations" value={totalRegs} accent="text-cyan-300" />
        <Kpi icon={<Activity className="h-4 w-4 text-emerald-300" />} label="Check-ins" value={totalScans} accent="text-emerald-300" />
        <Kpi icon={<Award className="h-4 w-4 text-purple-300" />} label="Podiums" value={totalPublished} accent="text-purple-300" />
      </div>

      <Card className="glass-panel border-white/10 bg-slate-900/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-white">My Events</CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Events assigned to you, or unassigned.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {events.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-6 text-center">
              <Info className="h-6 w-6 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-300">No events assigned</p>
              <p className="text-xs text-slate-500 mt-1">
                Contact the admin to be assigned as the coordinator of an event.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {events.map((e) => (
                <li
                  key={e.id}
                  className="py-3 flex items-center justify-between gap-3 flex-wrap"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono border-white/10 text-slate-300"
                      >
                        {e.category.name}
                      </Badge>
                      <span className="font-mono text-[10px] text-slate-400">Day {e.dayNumber}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-mono ${
                          e.status === "COMPLETED"
                            ? "border-emerald-500/30 text-emerald-300"
                            : e.status === "ONGOING"
                            ? "border-cyan-500/30 text-cyan-300"
                            : e.status === "CANCELLED"
                            ? "border-red-500/30 text-red-300"
                            : "border-white/10 text-slate-300"
                        }`}
                      >
                        {statusLabel(e.status)}
                      </Badge>
                    </div>
                    <Link
                      href={`/events/${e.id}`}
                      className="block text-sm font-bold text-white hover:text-cyan-300"
                    >
                      {e.title}
                    </Link>
                    <p className="text-[11px] text-slate-400">{e.venue}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span>{e._count.registrations} reg</span>
                    <span>·</span>
                    <span>{e._count.attendances} check-in</span>
                    <Link
                      href={`/events/${e.id}`}
                      className="text-cyan-300 hover:text-cyan-200"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
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

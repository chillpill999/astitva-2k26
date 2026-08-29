// ============================================================================
// ASTITVA 2K26 - Coordinator Live Scoring & Results Entry Page
// Path: app/dashboard/coordinator/results/page.tsx
// ============================================================================

import { redirect } from "next/navigation";
import Link from "next/link";
import { Trophy, ArrowLeft, AlertTriangle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import {
  CoordinatorConsoleTabs,
} from "@/components/coordinator/CoordinatorConsoleTabs";
import type {
  CoordinatorEvent,
  ExistingResult,
} from "@/components/coordinator/ResultsEntryClient";
import type {
  CoordinatorScoringEvent,
} from "@/components/coordinator/LiveScoreConsole";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Live Scoring & Results | ASTITVA 2K26",
  description: "Coordinator console for broadcasting live match scores and recording podium results.",
};

export default async function CoordinatorResultsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/dashboard/coordinator/results");
  if (!["EVENT_COORDINATOR", "ADMIN"].includes(user.role)) {
    redirect("/unauthorized?attempted=/dashboard/coordinator/results");
  }

  // Admins see all events; coordinators see all or assigned
  const where =
    user.role === "ADMIN"
      ? undefined
      : { OR: [{ coordinatorId: user.id }, { coordinatorId: null }] };
  let eventsRaw: any[] = [];
  try {
    eventsRaw = await prisma.event.findMany({
      where,
      orderBy: [{ dayNumber: "asc" }, { scheduleStart: "asc" }],
      include: { category: true, results: { include: { user: true, team: true } } },
      take: 50,
    });
  } catch {
    eventsRaw = [];
  }

  const events: CoordinatorEvent[] = eventsRaw.map((e: any) => ({
    id: e.id,
    title: e.title,
    category: e.category.name,
    venue: e.venue,
    dayNumber: e.dayNumber,
    eventType: e.eventType as "INDIVIDUAL" | "TEAM",
  }));

  const scoringEvents: CoordinatorScoringEvent[] = eventsRaw.map((e: any) => ({
    id: e.id,
    title: e.title,
    category: e.category.name,
    venue: e.venue,
    dayNumber: e.dayNumber,
    eventType: e.eventType as "INDIVIDUAL" | "TEAM",
    status: e.status,
    subtitle: e.subtitle,
  }));

  const initialResultsByEvent: Record<string, ExistingResult[]> = {};
  for (const e of eventsRaw) {
    initialResultsByEvent[e.id] = (e.results || []).map((r: any) => ({
      id: r.id,
      rank: r.rank,
      positionTitle: r.positionTitle,
      score: r.score,
      prizeAwarded: r.prizeAwarded,
      winnerName: r.user?.name ?? r.team?.name ?? null,
    }));
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 text-[#1A1918]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#8E8D8A]/20 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1918] tracking-tight uppercase font-mono flex items-center">
            <Trophy className="h-6 w-6 text-[#E85A4F] mr-2" />
            Live Scoring &amp; Results
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono mt-1">
            Broadcast live match points in real-time, record podium winners, and auto-issue certificates.
          </p>
        </div>
        <Link href="/dashboard/coordinator">
          <button className="px-4 py-2 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-mono font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all flex items-center gap-1.5 cursor-pointer">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Console
          </button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-3xl border border-[#8E8D8A]/25 bg-[#F6F4EE] p-8 text-center space-y-2 font-mono">
          <AlertTriangle className="h-6 w-6 text-[#E85A4F] mx-auto" />
          <h2 className="text-base font-bold text-[#1A1918] uppercase">No events assigned</h2>
          <p className="text-xs text-[#8E8D8A]">
            You have not been assigned as the coordinator of any event. Contact the admin.
          </p>
        </div>
      ) : (
        <CoordinatorConsoleTabs
          events={events}
          scoringEvents={scoringEvents}
          initialResultsByEvent={initialResultsByEvent}
        />
      )}
    </div>
  );
}

// ============================================================================
// ASTITVA 2K26 - Coordinator Results Entry Page
// Path: app/dashboard/coordinator/results/page.tsx
// ============================================================================

import { redirect } from "next/navigation";
import Link from "next/link";
import { Trophy, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import {
  ResultsEntryClient,
  type CoordinatorEvent,
  type ExistingResult,
} from "@/components/coordinator/ResultsEntryClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Results Entry | ASTITVA 2K26",
  description: "Coordinator console for recording podium results.",
};

export default async function CoordinatorResultsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/dashboard/coordinator/results");
  if (!["EVENT_COORDINATOR", "ADMIN"].includes(user.role)) {
    redirect("/unauthorized?attempted=/dashboard/coordinator/results");
  }

  // Admins see all events; coordinators only their own
  const where =
    user.role === "ADMIN"
      ? undefined
      : { OR: [{ coordinatorId: user.id }, { coordinatorId: null }] };
  const eventsRaw = await prisma.event.findMany({
    where,
    orderBy: [{ dayNumber: "asc" }, { scheduleStart: "asc" }],
    include: { category: true, results: { include: { user: true, team: true } } },
    take: 50,
  });

  const events: CoordinatorEvent[] = eventsRaw.map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category.name,
    venue: e.venue,
    dayNumber: e.dayNumber,
    eventType: e.eventType as "INDIVIDUAL" | "TEAM",
  }));

  const initialResultsByEvent: Record<string, ExistingResult[]> = {};
  for (const e of eventsRaw) {
    initialResultsByEvent[e.id] = e.results.map((r) => ({
      id: r.id,
      rank: r.rank,
      positionTitle: r.positionTitle,
      score: r.score,
      prizeAwarded: r.prizeAwarded,
      winnerName: r.user?.name ?? r.team?.name ?? null,
    }));
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center">
            <Trophy className="h-6 w-6 text-amber-300 mr-2" />
            Score Entry & Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Publish podiums, auto-issue certificates, and lock events as COMPLETED.
          </p>
        </div>
        <Link href="/dashboard/coordinator">
          <Button variant="outline" size="sm" className="text-xs">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <Card className="glass-panel border-white/10 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center">
              <AlertTriangle className="h-4 w-4 text-amber-300 mr-2" /> No events assigned
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              You have not been assigned as the coordinator of any event. Contact the admin.
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      ) : (
        <ResultsEntryClient events={events} initialResultsByEvent={initialResultsByEvent} />
      )}
    </div>
  );
}

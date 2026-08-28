// ============================================================================
// ASTITVA 2K26 - Results & Podium Page
// Path: app/results/page.tsx
// ============================================================================

import Link from "next/link";
import { Trophy, Medal, Award, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllEventsWithResults, getEventResults } from "@/lib/results/actions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Results & Podium Winners | ASTITVA 2K26",
  description: "Live results and podium winners across all 16 LNJPIT tournaments.",
};

export default async function ResultsPage() {
  const events = await getAllEventsWithResults();
  const published = events.filter((e) => e.hasResults);
  const pending = events.filter((e) => !e.hasResults);

  // Fetch detailed results for each event with results
  const detailed = (
    await Promise.all(
      published.map(async (e) => ({ meta: e, details: await getEventResults(e.id) }))
    )
  ).filter((d): d is { meta: typeof published[number]; details: NonNullable<Awaited<ReturnType<typeof getEventResults>>> } => d.details !== null);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="container max-w-7xl mx-auto space-y-10">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-slate-900/90 border border-amber-500/20 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="relative z-10 space-y-5 max-w-3xl">
            <Badge variant="outline" className="px-3 py-1 text-xs font-mono border-amber-500/40 text-amber-300 bg-amber-950/40">
              <Trophy className="mr-1.5 h-3.5 w-3.5 text-amber-400" /> LIVE PODIUM PUBLICATION
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase">
              Results. Glory. <span className="text-amber-400">Champions.</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {published.length} of {events.length} events have published podium results. Each
              winning participant receives a cryptographic AST26-CERT-XXXXX certificate auto-issued
              to their account.
            </p>
            <div className="flex flex-wrap gap-3 pt-3">
              <Link href="/leaderboard">
                <Button variant="neonCyan" size="sm" className="text-xs font-bold">
                  View Live Leaderboard
                </Button>
              </Link>
              <Link href="/verify-certificate">
                <Button variant="outline" size="sm" className="text-xs font-bold border-amber-500/30 text-amber-300">
                  <Award className="h-4 w-4 mr-1.5" /> Verify a Certificate
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Published */}
        <section>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center mb-4">
            <Medal className="h-5 w-5 text-amber-400 mr-2" /> Published Podiums
          </h2>
          {detailed.length === 0 ? (
            <p className="text-sm text-slate-500 italic">
              No results published yet. Check back as events conclude.
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {detailed.map(({ meta, details }) => (
                <Card key={meta.id} className="glass-panel border-amber-500/20 bg-slate-900/70">
                  <CardHeader className="pb-3 border-b border-white/10">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base font-bold text-white">
                          {details.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-400 mt-1">
                          {details.category} · Day {details.dayNumber} ·{" "}
                          {formatDate(details.scheduleStart)}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="border-amber-500/30 text-amber-300 font-mono text-[10px]">
                        {details.eventType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    {details.results.map((r) => (
                      <PodiumRow key={r.id} rank={r.rank} positionTitle={r.positionTitle} winnerName={r.winner?.name ?? "TBD"} score={r.score} prize={r.prizeAwarded} />
                    ))}
                    <div className="pt-2 border-t border-white/5 flex justify-end">
                      <Link href={`/events/${meta.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs text-amber-300 hover:text-amber-200">
                          Event details <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Pending */}
        <section>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center mb-4">
            <Award className="h-5 w-5 text-cyan-300 mr-2" /> Awaiting Publication
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pending.map((e) => (
              <div
                key={e.id}
                className="rounded-xl border border-white/10 bg-slate-900/70 p-3 space-y-1"
              >
                <p className="text-xs font-bold text-white truncate">{e.title}</p>
                <p className="text-[10px] text-slate-400 font-mono">{e.category}</p>
                <Badge variant="outline" className="text-[9px] border-cyan-500/30 text-cyan-300 font-mono">
                  UPCOMING
                </Badge>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function PodiumRow({
  rank,
  positionTitle,
  winnerName,
  score,
  prize,
}: {
  rank: number;
  positionTitle: string;
  winnerName: string;
  score?: string | null;
  prize?: string | null;
}) {
  const medal =
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
  const color =
    rank === 1
      ? "border-amber-500/40 text-amber-200 bg-amber-500/5"
      : rank === 2
      ? "border-slate-300/30 text-slate-100 bg-slate-300/5"
      : "border-orange-700/30 text-orange-200 bg-orange-700/5";
  return (
    <div className={`rounded-lg border ${color} px-3 py-2 flex items-center justify-between gap-2`}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-base">{medal}</span>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white truncate">{winnerName}</p>
          <p className="text-[10px] font-mono text-slate-400">
            {positionTitle.replace("_", " ")}
            {score ? ` · ${score}` : ""}
          </p>
        </div>
      </div>
      {prize && (
        <Badge variant="outline" className="border-amber-500/30 text-amber-300 font-mono text-[10px]">
          {prize}
        </Badge>
      )}
    </div>
  );
}

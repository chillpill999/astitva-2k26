// ============================================================================
// ASTITVA 2K26 - Results & Live Scoreboard Page (Exteta Luxury Aesthetic)
// Path: app/results/page.tsx
// ============================================================================

import Link from "next/link";
import { Trophy, Medal, Award, ArrowRight } from "lucide-react";
import {
  getAllEventsWithResults,
  getEventResults,
  getLiveAndRecentEvents,
} from "@/lib/results/actions";
import { formatDate } from "@/lib/utils";
import { RealtimeLiveScoreboard } from "@/components/results/RealtimeLiveScoreboard";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Results & Live Match Scoreboard | ASTITVA 2K26",
  description: "Realtime live match scores and published podium results across LNJPIT fest tournaments.",
};

export default async function ResultsPage() {
  const [events, liveEvents] = await Promise.all([
    getAllEventsWithResults(),
    getLiveAndRecentEvents(),
  ]);

  const published = events.filter((e) => e.hasResults);
  const pending = events.filter((e) => !e.hasResults);

  const detailed = (
    await Promise.all(
      published.map(async (e) => ({ meta: e, details: await getEventResults(e.id) }))
    )
  ).filter(
    (d): d is {
      meta: (typeof published)[number];
      details: NonNullable<Awaited<ReturnType<typeof getEventResults>>>;
    } => d.details !== null
  );

  return (
    <div className="min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="container max-w-7xl mx-auto space-y-10">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-8 sm:p-12 shadow-sm">
          <div className="relative z-10 space-y-5 max-w-3xl">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
              <Trophy className="mr-1.5 h-3 w-3 inline text-[#E85A4F]" /> LIVE ARENA SCORING &amp; RESULTS
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              Live Scores &amp; <span className="text-[#E85A4F]">Results</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8E8D8A] font-mono leading-relaxed">
              Track active tournament matches with realtime score broadcasting from event coordinators.
              Official podium winners and verifiable certificates are auto-updated here.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/leaderboard">
                <button className="px-5 py-2.5 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-colors shadow-sm cursor-pointer">
                  View Live Leaderboard
                </button>
              </Link>
              <Link href="/verify-certificate">
                <button className="px-5 py-2.5 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-mono font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer flex items-center gap-1.5">
                  <Award className="h-4 w-4" /> Verify a Certificate
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Realtime Live Arena Scoreboard */}
        <section>
          <RealtimeLiveScoreboard initialEvents={liveEvents} />
        </section>

        {/* Published Podiums */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-mono text-[#1A1918] uppercase tracking-wider flex items-center">
            <Medal className="h-5 w-5 text-[#E85A4F] mr-2" /> Published Podiums &amp; Champions
          </h2>
          {detailed.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 text-center text-xs font-mono text-[#8E8D8A]">
              No final podiums published yet. Match in progress scores are displayed above.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {detailed.map(({ meta, details }) => (
                <div
                  key={meta.id}
                  className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-7 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-[#8E8D8A]/20 pb-4">
                    <div>
                      <h3 className="text-base font-bold font-mono uppercase text-[#1A1918]">
                        {details.title}
                      </h3>
                      <p className="text-xs font-mono text-[#8E8D8A] mt-1">
                        {details.category} · Day 0{details.dayNumber} ·{" "}
                        {formatDate(details.scheduleStart)}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#1A1918] uppercase">
                      {details.eventType}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {details.results.map((r) => (
                      <PodiumRow
                        key={r.id}
                        rank={r.rank}
                        positionTitle={r.positionTitle}
                        winnerName={r.winner?.name ?? "TBD"}
                        score={r.score}
                        prize={r.prizeAwarded}
                      />
                    ))}
                    <div className="pt-2 border-t border-[#8E8D8A]/15 flex justify-end">
                      <Link href={`/events/${meta.id}`}>
                        <span className="text-xs font-mono font-bold text-[#E85A4F] hover:underline flex items-center">
                          Event details <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pending Events */}
        {pending.length > 0 && (
          <section className="space-y-4 pt-4">
            <h2 className="text-sm font-bold font-mono text-[#8E8D8A] uppercase tracking-wider">
              Upcoming Competitions ({pending.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pending.map((e) => (
                <div
                  key={e.id}
                  className="rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/20 p-5 flex items-center justify-between shadow-sm"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-mono font-bold text-[#1A1918] uppercase">{e.title}</p>
                    <p className="text-[10px] font-mono text-[#8E8D8A]">
                      {e.category} · Day 0{e.dayNumber}
                    </p>
                  </div>
                  <Link href={`/events/${e.id}`}>
                    <span className="text-[10px] font-mono font-bold text-[#E85A4F] uppercase hover:underline">
                      View →
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
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
  score: string | null;
  prize: string | null;
}) {
  const badgeColors: Record<number, string> = {
    1: "bg-[#E85A4F] text-white",
    2: "bg-[#1A1918] text-[#EAE7DC]",
    3: "bg-[#EAE7DC] text-[#1A1918] border border-[#8E8D8A]/35",
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 text-xs font-mono">
      <div className="flex items-center space-x-3">
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
            badgeColors[rank] ?? "bg-[#8E8D8A] text-white"
          }`}
        >
          {rank}
        </span>
        <div>
          <p className="font-bold text-[#1A1918] uppercase">{winnerName}</p>
          <p className="text-[10px] text-[#8E8D8A] uppercase">{positionTitle.replace(/_/g, " ")}</p>
        </div>
      </div>
      <div className="text-right">
        {score && <p className="font-bold text-[#1A1918]">{score}</p>}
        {prize && <p className="text-[10px] text-[#8E8D8A] truncate max-w-[150px]">{prize}</p>}
      </div>
    </div>
  );
}

// ============================================================================
// ASTITVA 2K26 - Results & Podium Page (Exteta Luxury Aesthetic)
// Path: app/results/page.tsx
// ============================================================================

import Link from "next/link";
import { Trophy, Medal, Award, ArrowRight } from "lucide-react";
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

  const detailed = (
    await Promise.all(
      published.map(async (e) => ({ meta: e, details: await getEventResults(e.id) }))
    )
  ).filter((d): d is { meta: typeof published[number]; details: NonNullable<Awaited<ReturnType<typeof getEventResults>>> } => d.details !== null);

  return (
    <div className="min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="container max-w-7xl mx-auto space-y-10">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-8 sm:p-12 shadow-sm">
          <div className="relative z-10 space-y-5 max-w-3xl">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
              <Trophy className="mr-1.5 h-3 w-3 inline text-[#E85A4F]" /> LIVE PODIUM PUBLICATION
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              RESULTS. GLORY. <span className="text-[#E85A4F]">CHAMPIONS.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8E8D8A] font-mono leading-relaxed">
              {published.length} of {events.length} events have published podium results. Each
              winning participant receives a cryptographic AST26-CERT-XXXXX certificate auto-issued
              to their account.
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

        {/* Published */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-mono text-[#1A1918] uppercase tracking-wider flex items-center">
            <Medal className="h-5 w-5 text-[#E85A4F] mr-2" /> Published Podiums
          </h2>
          {detailed.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 text-center text-xs font-mono text-[#8E8D8A]">
              No results published yet. Check back as events conclude.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {detailed.map(({ meta, details }) => (
                <div key={meta.id} className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-7 shadow-sm space-y-4">
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
                      <PodiumRow key={r.id} rank={r.rank} positionTitle={r.positionTitle} winnerName={r.winner?.name ?? "TBD"} score={r.score} prize={r.prizeAwarded} />
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

        {/* Pending */}
        {pending.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-mono font-bold text-[#8E8D8A] uppercase tracking-wider">
              Upcoming Results Awaited ({pending.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pending.map((e) => (
                <div key={e.id} className="p-4 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/20 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold font-mono text-[#1A1918]">{e.title}</p>
                    <p className="text-[11px] font-mono text-[#8E8D8A]">{e.category} · Day 0{e.dayNumber}</p>
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#8E8D8A] uppercase">
                    IN PROGRESS
                  </span>
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
  const badgeColors =
    rank === 1
      ? "bg-[#E85A4F] text-white"
      : rank === 2
      ? "bg-[#1A1918] text-[#EAE7DC]"
      : "bg-[#8E8D8A] text-white";

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 font-mono text-xs">
      <div className="flex items-center gap-3 min-w-0">
        <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${badgeColors}`}>
          {rank}
        </span>
        <div className="min-w-0">
          <p className="font-bold text-[#1A1918] truncate">{winnerName}</p>
          <p className="text-[10px] text-[#8E8D8A]">{positionTitle}</p>
        </div>
      </div>
      <div className="text-right shrink-0">
        {score && <span className="font-bold text-[#1A1918]">{score}</span>}
        {prize && <span className="text-[10px] text-[#E85A4F] block">{prize}</span>}
      </div>
    </div>
  );
}

// ============================================================================
// ASTITVA 2K26 - Live Multi-Stream Leaderboard (Exteta Luxury Aesthetic)
// Path: app/leaderboard/page.tsx
// ============================================================================

import Link from "next/link";
import { Crown, Trophy, Users, Zap, Flame } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getLeaderboard, getBranchStandings } from "@/lib/results/actions";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Live Leaderboards | ASTITVA 2K26",
  description:
    "Live multi-stream leaderboards: Sports, Cultural, Gaming, Literary, and Branch Championship.",
};

export default async function LeaderboardPage() {
  const [boards, branches] = await Promise.all([getLeaderboard(), getBranchStandings()]);

  return (
    <div className="min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="container max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-8 sm:p-12 shadow-sm">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
              <Flame className="mr-1.5 h-3 w-3 inline text-[#E85A4F]" /> LIVE MULTI-STREAM STANDINGS
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              BRANCH &amp; CATEGORY <span className="text-[#E85A4F]">CHAMPIONSHIP</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8E8D8A] font-mono leading-relaxed">
              Points: 10 for Winner · 6 for First Runner-Up · 3 for Second Runner-Up.
              Leaderboards refresh automatically as coordinators publish results.
            </p>
          </div>
        </div>

        {/* Branch championship */}
        <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="border-b border-[#8E8D8A]/20 pb-4">
            <h2 className="text-base font-bold font-mono text-[#1A1918] uppercase flex items-center">
              <Crown className="h-4 w-4 text-[#E85A4F] mr-2" /> Branch Championship (LNJPIT Chapra)
            </h2>
            <p className="text-xs text-[#8E8D8A] font-mono mt-1">
              Aggregated podium points by engineering branch.
            </p>
          </div>
          <div>
            {branches.length === 0 ? (
              <p className="text-xs font-mono text-[#8E8D8A] italic">No results published yet.</p>
            ) : (
              <ul className="space-y-2">
                {branches.map((b, i) => (
                  <li
                    key={b.branch}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[#8E8D8A]/20 bg-[#EAE7DC] px-4 py-3 font-mono text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-black text-sm ${i === 0 ? "text-[#E85A4F]" : "text-[#1A1918]"}`}
                      >
                        0{i + 1}
                      </span>
                      <span className="font-bold text-[#1A1918]">{b.branch}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#F6F4EE] text-[#E85A4F] uppercase border border-[#8E8D8A]/15">
                        {b.wins} wins
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-[#E85A4F]">{b.points} pts</p>
                      <p className="text-[9px] text-[#8E8D8A]">{b.totalPodiums} podiums</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Category leaderboards */}
        <Tabs defaultValue={boards[0]?.slug ?? "sports"} className="w-full">
          <TabsList className="bg-[#F6F4EE] border border-[#8E8D8A]/25 p-1 w-full justify-start flex-wrap rounded-2xl">
            {boards.map((b) => (
              <TabsTrigger
                key={b.slug}
                value={b.slug}
                className="text-xs font-mono font-bold data-[state=active]:bg-[#1A1918] data-[state=active]:text-[#EAE7DC] rounded-xl py-2 uppercase"
              >
                {b.category}
              </TabsTrigger>
            ))}
          </TabsList>

          {boards.map((b) => (
            <TabsContent key={b.slug} value={b.slug} className="pt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold font-mono text-[#1A1918] uppercase flex items-center border-b border-[#8E8D8A]/20 pb-3">
                    <Trophy className="h-4 w-4 text-[#E85A4F] mr-2" /> Top Individual Performers
                  </h3>
                  <div>
                    {b.topParticipants.length === 0 ? (
                      <p className="text-xs font-mono text-[#8E8D8A] italic">No podiums yet.</p>
                    ) : (
                      <ul className="space-y-2 font-mono text-xs">
                        {b.topParticipants.map((p, i) => (
                          <li
                            key={p.userId}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-[#EAE7DC]"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`font-bold ${i === 0 ? "text-[#E85A4F]" : "text-[#8E8D8A]"}`}>
                                #{i + 1}
                              </span>
                              <span className="font-bold text-[#1A1918] truncate">{p.name}</span>
                              {p.branch && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F6F4EE] text-[#8E8D8A]">
                                  {p.branch}
                                </span>
                              )}
                            </div>
                            <span className="text-[#E85A4F] font-bold">{p.points} pts</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold font-mono text-[#1A1918] uppercase flex items-center border-b border-[#8E8D8A]/20 pb-3">
                    <Users className="h-4 w-4 text-[#1A1918] mr-2" /> Top Squads
                  </h3>
                  <div>
                    {b.topTeams.length === 0 ? (
                      <p className="text-xs font-mono text-[#8E8D8A] italic">No team podiums yet.</p>
                    ) : (
                      <ul className="space-y-2 font-mono text-xs">
                        {b.topTeams.map((t, i) => (
                          <li
                            key={t.teamId}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-[#EAE7DC]"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`font-bold ${i === 0 ? "text-[#E85A4F]" : "text-[#8E8D8A]"}`}>
                                #{i + 1}
                              </span>
                              <span className="font-bold text-[#1A1918] truncate">{t.name}</span>
                            </div>
                            <span className="text-[#E85A4F] font-bold">{t.points} pts</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Per-event winners */}
              <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="text-sm font-bold font-mono text-[#1A1918] uppercase flex items-center border-b border-[#8E8D8A]/20 pb-3">
                  <Zap className="h-4 w-4 text-[#E85A4F] mr-2" /> Per-Event Winners ({b.category})
                </h3>
                <div>
                  {b.events.filter((e) => e.winners.length > 0).length === 0 ? (
                    <p className="text-xs font-mono text-[#8E8D8A] italic">No published results for this stream yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {b.events
                        .filter((e) => e.winners.length > 0)
                        .map((e) => (
                          <div
                            key={e.id}
                            className="rounded-2xl border border-[#8E8D8A]/20 bg-[#EAE7DC] p-3.5 space-y-1.5 font-mono"
                          >
                            <Link
                              href={`/events/${e.id}`}
                              className="text-xs font-bold text-[#1A1918] hover:text-[#E85A4F] truncate block uppercase"
                            >
                              {e.title}
                            </Link>
                            {e.winners.map((w) => (
                              <p key={`${e.id}-${w.rank}`} className="text-[11px] text-[#8E8D8A]">
                                <span className="text-[#E85A4F] font-bold">#{w.rank}</span> · {w.name}
                                <span className="text-[#8E8D8A]/70"> ({w.kind})</span>
                              </p>
                            ))}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

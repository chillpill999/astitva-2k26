// ============================================================================
// ASTITVA 2K26 - Live Multi-Stream Leaderboard
// Path: app/leaderboard/page.tsx
// ============================================================================

import Link from "next/link";
import { Crown, Trophy, Users, Zap, Flame } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <div className="min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="container max-w-7xl mx-auto space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-slate-900/90 border border-cyan-500/20 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="relative z-10 space-y-5 max-w-3xl">
            <Badge variant="outline" className="px-3 py-1 text-xs font-mono border-cyan-500/40 text-cyan-300 bg-cyan-950/40">
              <Flame className="mr-1.5 h-3.5 w-3.5 text-cyan-300" /> LIVE MULTI-STREAM STANDINGS
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase">
              Branch & Category <span className="text-cyan-300">Championship</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Points: 10 for Winner · 6 for First Runner-Up · 3 for Second Runner-Up.
              Leaderboards refresh as coordinators publish results.
            </p>
          </div>
        </div>

        {/* Branch championship */}
        <Card className="glass-panel border-amber-500/20 bg-slate-900/70">
          <CardHeader className="pb-3 border-b border-white/10">
            <CardTitle className="text-base font-bold text-white flex items-center">
              <Crown className="h-4 w-4 text-amber-300 mr-2" /> Branch Championship (LNJPIT)
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-1">
              Aggregated podium points by student branch.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {branches.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No results published yet.</p>
            ) : (
              <ul className="space-y-2">
                {branches.map((b, i) => (
                  <li
                    key={b.branch}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-slate-950/60 px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-base ${i === 0 ? "text-amber-300" : i === 1 ? "text-slate-200" : "text-orange-300"}`}
                      >
                        {i + 1}
                      </span>
                      <span className="text-xs font-bold text-white">{b.branch}</span>
                      <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-300 font-mono">
                        {b.wins} wins
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black font-mono text-amber-300">{b.points}</p>
                      <p className="text-[9px] text-slate-500 font-mono">{b.totalPodiums} podiums</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Category leaderboards */}
        <Tabs defaultValue={boards[0]?.slug ?? "sports"} className="w-full">
          <TabsList className="bg-slate-900/80 border border-white/10 w-full justify-start flex-wrap">
            {boards.map((b) => (
              <TabsTrigger key={b.slug} value={b.slug} className="text-xs">
                {b.category}
              </TabsTrigger>
            ))}
          </TabsList>
          {boards.map((b) => (
            <TabsContent key={b.slug} value={b.slug} className="pt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-panel border-white/10 bg-slate-900/70">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-white flex items-center">
                      <Trophy className="h-4 w-4 text-amber-300 mr-2" /> Top Individual Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {b.topParticipants.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No podiums yet.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {b.topParticipants.map((p, i) => (
                          <li
                            key={p.userId}
                            className="flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`font-mono ${i === 0 ? "text-amber-300" : "text-slate-500"}`}>
                                {i + 1}
                              </span>
                              <span className="font-bold text-white truncate">{p.name}</span>
                              {p.branch && (
                                <Badge variant="outline" className="text-[9px] border-white/10 text-slate-300 font-mono">
                                  {p.branch}
                                </Badge>
                              )}
                            </div>
                            <span className="text-amber-300 font-black font-mono">{p.points} pts</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass-panel border-white/10 bg-slate-900/70">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-white flex items-center">
                      <Users className="h-4 w-4 text-cyan-300 mr-2" /> Top Squads
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {b.topTeams.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No team podiums yet.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {b.topTeams.map((t, i) => (
                          <li
                            key={t.teamId}
                            className="flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`font-mono ${i === 0 ? "text-cyan-300" : "text-slate-500"}`}>
                                {i + 1}
                              </span>
                              <span className="font-bold text-white truncate">{t.name}</span>
                            </div>
                            <span className="text-cyan-300 font-black font-mono">{t.points} pts</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Per-event winners */}
              <Card className="glass-panel border-white/10 bg-slate-900/70">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-white flex items-center">
                    <Zap className="h-4 w-4 text-purple-300 mr-2" /> Per-Event Winners ({b.category})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {b.events.filter((e) => e.winners.length > 0).length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No published results for this stream yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {b.events
                        .filter((e) => e.winners.length > 0)
                        .map((e) => (
                          <div
                            key={e.id}
                            className="rounded-xl border border-white/10 bg-slate-950/60 p-3 space-y-1"
                          >
                            <Link
                              href={`/events/${e.id}`}
                              className="text-xs font-bold text-white hover:text-cyan-300 truncate block"
                            >
                              {e.title}
                            </Link>
                            {e.winners.map((w) => (
                              <p key={`${e.id}-${w.rank}`} className="text-[10px] font-mono text-slate-300">
                                <span className="text-amber-300">#{w.rank}</span> · {w.name}
                                <span className="text-slate-500"> ({w.kind})</span>
                              </p>
                            ))}
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

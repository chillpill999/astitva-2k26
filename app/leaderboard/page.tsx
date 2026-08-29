// ============================================================================
// ASTITVA 2K26 - Live Multi-Stream Leaderboard (Exteta Luxury Aesthetic)
// Path: app/leaderboard/page.tsx
// ============================================================================

import { Flame } from "lucide-react";
import { getLeaderboard, getBranchStandings } from "@/lib/results/actions";
import { RealtimeLeaderboardView } from "@/components/leaderboard/RealtimeLeaderboardView";

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
              Leaderboards refresh automatically as coordinators publish results in real time.
            </p>
          </div>
        </div>

        {/* Realtime Live Leaderboard View */}
        <RealtimeLeaderboardView initialBoards={boards} initialBranches={branches} />
      </div>
    </div>
  );
}

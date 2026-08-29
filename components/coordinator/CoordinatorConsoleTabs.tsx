"use client";

// ============================================================================
// ASTITVA 2K26 - Unified Coordinator Live Scoring & Results Console
// Path: components/coordinator/CoordinatorConsoleTabs.tsx
// ============================================================================

import { useState } from "react";
import { Radio, Trophy, Activity, Award } from "lucide-react";
import { LiveScoreConsole, type CoordinatorScoringEvent } from "./LiveScoreConsole";
import { ResultsEntryClient, type CoordinatorEvent, type ExistingResult } from "./ResultsEntryClient";

interface CoordinatorConsoleTabsProps {
  events: CoordinatorEvent[];
  scoringEvents: CoordinatorScoringEvent[];
  initialResultsByEvent: Record<string, ExistingResult[]>;
}

export function CoordinatorConsoleTabs({
  events,
  scoringEvents,
  initialResultsByEvent,
}: CoordinatorConsoleTabsProps) {
  const [activeTab, setActiveTab] = useState<"LIVE_SCORE" | "PODIUM_RESULTS">("LIVE_SCORE");

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center p-1.5 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab("LIVE_SCORE")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "LIVE_SCORE"
              ? "bg-[#E85A4F] text-white shadow-sm"
              : "text-[#8E8D8A] hover:text-[#1A1918]"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          Live Match Scoring
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("PODIUM_RESULTS")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "PODIUM_RESULTS"
              ? "bg-[#1A1918] text-[#EAE7DC] shadow-sm"
              : "text-[#8E8D8A] hover:text-[#1A1918]"
          }`}
        >
          <Trophy className="h-3.5 w-3.5" />
          Podium &amp; Winners
        </button>
      </div>

      {/* Active Tab Panel */}
      {activeTab === "LIVE_SCORE" ? (
        <div className="animate-in fade-in-50 duration-200">
          <LiveScoreConsole events={scoringEvents} />
        </div>
      ) : (
        <div className="animate-in fade-in-50 duration-200">
          <ResultsEntryClient events={events} initialResultsByEvent={initialResultsByEvent} />
        </div>
      )}
    </div>
  );
}

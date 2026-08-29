"use client";

// ============================================================================
// ASTITVA 2K26 - Realtime Live Match Scoring Console for Coordinators
// Path: components/coordinator/LiveScoreConsole.tsx
// ============================================================================

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Activity,
  Radio,
  Clock,
  MapPin,
  CheckCircle2,
  Zap,
  Flame,
  Sparkles,
} from "lucide-react";
import { updateEventLiveScore, type LiveScorePayload } from "@/lib/results/actions";

export interface CoordinatorScoringEvent {
  id: string;
  title: string;
  category: string;
  venue: string;
  dayNumber: number;
  eventType: "INDIVIDUAL" | "TEAM";
  status: string;
  subtitle: string | null;
}

interface LiveScoreConsoleProps {
  events: CoordinatorScoringEvent[];
}

export function LiveScoreConsole({ events }: LiveScoreConsoleProps) {
  const router = useRouter();
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id ?? "");
  const [status, setStatus] = useState<LiveScorePayload["status"]>("ONGOING");
  const [currentRound, setCurrentRound] = useState<string>("Quarter Finals");
  const [liveScoreText, setLiveScoreText] = useState<string>("");
  const [commentary, setCommentary] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  function applyPreset(presetScore: string, roundText?: string) {
    setLiveScoreText(presetScore);
    if (roundText) setCurrentRound(roundText);
  }

  function handleBroadcast() {
    if (!selectedEventId) {
      toast.error("Please select an event.");
      return;
    }
    if (!liveScoreText.trim()) {
      toast.error("Please enter a live score or match status.");
      return;
    }

    startTransition(async () => {
      const res = await updateEventLiveScore({
        eventId: selectedEventId,
        status,
        liveScoreText: liveScoreText.trim(),
        currentRound: currentRound.trim() || undefined,
        commentary: commentary.trim() || undefined,
      });

      if (res.success) {
        toast.success(`⚡ Live score broadcasted for ${selectedEvent?.title}!`, {
          description: "Updated in realtime on all student dashboards.",
        });
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update score.");
      }
    });
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[11px] font-mono text-[#E85A4F] uppercase font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E85A4F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E85A4F]"></span>
            </span>
            <span>Realtime Match Scoring Broadcast Console</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1A1918] tracking-tight uppercase font-mono">
            Coordinator Live Score Deck
          </h2>
          <p className="text-xs text-[#8E8D8A] font-mono max-w-2xl">
            Input match points, sets, overs, or performance rankings as your event takes place.
            Updates stream instantaneously to the Schedule, Results, and Event screens via Supabase Realtime.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#EAE7DC] px-4 py-2.5 rounded-2xl border border-[#8E8D8A]/25">
          <Radio className="h-4 w-4 text-[#E85A4F] animate-pulse" />
          <span className="text-xs font-mono font-bold text-[#1A1918]">Realtime Socket: ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form & Presets */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-5">
            {/* Event Selection */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-[#1A1918] flex items-center justify-between">
                <span>1. Select Assigned Event</span>
                <span className="text-[10px] text-[#8E8D8A]">{events.length} event(s) available</span>
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/35 text-[#1A1918] text-xs font-mono font-bold focus:outline-none focus:border-[#E85A4F]"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    [{ev.category}] {ev.title} (Day {ev.dayNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Match Status Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-[#1A1918]">
                2. Match / Competition Status
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setStatus("ONGOING")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold uppercase border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    status === "ONGOING"
                      ? "bg-[#E85A4F] text-white border-[#E85A4F] shadow-sm"
                      : "bg-[#EAE7DC] text-[#8E8D8A] border-[#8E8D8A]/30 hover:text-[#1A1918]"
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  🔴 Live Now
                </button>

                <button
                  type="button"
                  onClick={() => setStatus("REGISTRATION_OPEN")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold uppercase border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    status === "REGISTRATION_OPEN"
                      ? "bg-[#1A1918] text-[#EAE7DC] border-[#1A1918]"
                      : "bg-[#EAE7DC] text-[#8E8D8A] border-[#8E8D8A]/30 hover:text-[#1A1918]"
                  }`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  Upcoming
                </button>

                <button
                  type="button"
                  onClick={() => setStatus("COMPLETED")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold uppercase border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    status === "COMPLETED"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-[#EAE7DC] text-[#8E8D8A] border-[#8E8D8A]/30 hover:text-[#1A1918]"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Concluded
                </button>
              </div>
            </div>

            {/* Current Round / Stage */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-[#1A1918]">
                3. Current Round / Stage
              </label>
              <input
                type="text"
                placeholder="e.g. Semi-Final Match 1 / Pool A / Innings 2 / Set 3"
                value={currentRound}
                onChange={(e) => setCurrentRound(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/35 text-[#1A1918] text-xs font-mono placeholder:text-[#8E8D8A]/60 focus:outline-none focus:border-[#E85A4F]"
              />
            </div>

            {/* Live Score Input */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-[#1A1918] flex items-center justify-between">
                <span>4. Live Scoreline / Scorecard Text</span>
                <span className="text-[10px] text-[#E85A4F] font-semibold">Broadcasting Live</span>
              </label>
              <input
                type="text"
                placeholder="e.g. CSE 148/5 (18.4 ov) vs ME 142/9 • CSE needs 4 runs from 8 balls"
                value={liveScoreText}
                onChange={(e) => setLiveScoreText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/35 text-[#1A1918] text-xs font-mono font-bold placeholder:text-[#8E8D8A]/60 focus:outline-none focus:border-[#E85A4F]"
              />
            </div>

            {/* Quick Sport Presets */}
            <div className="space-y-2 pt-1 border-t border-[#8E8D8A]/20">
              <label className="text-[11px] font-mono font-bold uppercase text-[#8E8D8A] flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#E85A4F]" /> Quick Sport Presets
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset("CSE 156/6 (20 ov) vs ME 148/8 (20 ov) — CSE won by 8 runs", "Finals Match")}
                  className="px-2.5 py-1.5 rounded-lg bg-[#EAE7DC] border border-[#8E8D8A]/25 text-[10px] font-mono text-[#1A1918] hover:border-[#E85A4F] transition-all cursor-pointer"
                >
                  🏏 Cricket Summary
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("Set 2: 21-18, 19-21, 15-12 (Match Point)", "Semi-Final 2")}
                  className="px-2.5 py-1.5 rounded-lg bg-[#EAE7DC] border border-[#8E8D8A]/25 text-[10px] font-mono text-[#1A1918] hover:border-[#E85A4F] transition-all cursor-pointer"
                >
                  🏸 Badminton Score
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("Game 4: 11-9, 7-11, 11-8, 10-10 Deuce", "Quarter Finals")}
                  className="px-2.5 py-1.5 rounded-lg bg-[#EAE7DC] border border-[#8E8D8A]/25 text-[10px] font-mono text-[#1A1918] hover:border-[#E85A4F] transition-all cursor-pointer"
                >
                  🏓 Table Tennis
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("Civil 2 - 1 Mech (68th Min)", "Round 2 Match")}
                  className="px-2.5 py-1.5 rounded-lg bg-[#EAE7DC] border border-[#8E8D8A]/25 text-[10px] font-mono text-[#1A1918] hover:border-[#E85A4F] transition-all cursor-pointer"
                >
                  ⚽ Football Score
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("Match 3: 4 Squads Alive • 12 Kills Tally", "Erangel Finals")}
                  className="px-2.5 py-1.5 rounded-lg bg-[#EAE7DC] border border-[#8E8D8A]/25 text-[10px] font-mono text-[#1A1918] hover:border-[#E85A4F] transition-all cursor-pointer"
                >
                  🎮 BGMI Esports
                </button>
              </div>
            </div>

            {/* Live Match Commentary */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-[#1A1918]">
                5. Live Match Key Highlight / Commentary (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Incredible smash by Rahul down the baseline! Electric atmosphere on court."
                value={commentary}
                onChange={(e) => setCommentary(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/35 text-[#1A1918] text-xs font-mono placeholder:text-[#8E8D8A]/60 focus:outline-none focus:border-[#E85A4F]"
              />
            </div>

            {/* Broadcast Action Button */}
            <button
              type="button"
              disabled={isPending}
              onClick={handleBroadcast}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#C94A40] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="h-4 w-4" />
              {isPending ? "Broadcasting to Supabase..." : "⚡ Broadcast Live Score Now"}
            </button>
          </div>
        </div>

        {/* Right Column: Live Match Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-3">
              <span className="text-xs font-mono font-bold uppercase text-[#1A1918] flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-[#E85A4F]" /> Live Broadcast Preview
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EAE7DC] text-[#8E8D8A] uppercase">
                Student View
              </span>
            </div>

            {selectedEvent ? (
              <div className="rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/30 p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
                    {selectedEvent.category}
                  </span>
                  <div className="flex items-center space-x-1.5 text-[11px] font-mono font-bold text-[#E85A4F]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E85A4F] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E85A4F]"></span>
                    </span>
                    <span className="uppercase">{status.replace(/_/g, " ")}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold font-mono text-[#1A1918] uppercase">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-xs font-mono text-[#8E8D8A] flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-[#E85A4F]" /> {selectedEvent.venue}
                  </p>
                </div>

                {/* Simulated Realtime Score Display */}
                <div className="p-4 rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/20 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#8E8D8A]">
                    <span className="font-bold text-[#E85A4F] uppercase">{currentRound || "Active Round"}</span>
                    <span>Just Now</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-[#1A1918] leading-tight">
                    {liveScoreText || selectedEvent.subtitle || "Waiting for live score update..."}
                  </div>
                  {commentary && (
                    <p className="text-[11px] font-mono text-[#8E8D8A] italic pt-1 border-t border-[#8E8D8A]/15">
                      💬 &quot;{commentary}&quot;
                    </p>
                  )}
                </div>

                <div className="text-[10px] font-mono text-[#8E8D8A] flex items-center justify-between pt-1">
                  <span>Day 0{selectedEvent.dayNumber} · LNJPIT Festival</span>
                  <span className="text-[#E85A4F] font-bold">Supabase Realtime Sync</span>
                </div>
              </div>
            ) : (
              <p className="text-xs font-mono text-[#8E8D8A] text-center py-6">
                Select an event to preview live scoreboard.
              </p>
            )}

            <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 space-y-2 text-xs font-mono text-[#8E8D8A]">
              <div className="flex items-center gap-1.5 font-bold text-[#1A1918]">
                <Activity className="h-3.5 w-3.5 text-[#E85A4F]" /> Coordinator Guidelines
              </div>
              <ul className="space-y-1 text-[11px] list-disc list-inside">
                <li>Update scores at breaks, overs, sets, or key match moments.</li>
                <li>When the match finishes, mark status as <strong>Concluded</strong>.</li>
                <li>Go to <strong>Podium &amp; Results</strong> tab to record official winners and issue certificates.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

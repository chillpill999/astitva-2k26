// ============================================================================
// ASTITVA 2K26 - Coordinator Results Entry Client (Exteta Luxury Aesthetic)
// Path: components/coordinator/ResultsEntryClient.tsx
// ============================================================================

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Trash2, Trophy, Medal, Award } from "lucide-react";
import { recordEventResults, deleteResult } from "@/lib/results/actions";

export interface CoordinatorEvent {
  id: string;
  title: string;
  category: string;
  venue: string;
  dayNumber: number;
  eventType: "INDIVIDUAL" | "TEAM";
}

export interface ExistingResult {
  id: string;
  rank: number;
  positionTitle: string;
  score: string | null;
  prizeAwarded: string | null;
  winnerName: string | null;
}

export interface ResultsEntryClientProps {
  events: CoordinatorEvent[];
  initialResultsByEvent: Record<string, ExistingResult[]>;
}

type RowState = {
  rank: 1 | 2 | 3;
  userId: string;
  teamId: string;
  score: string;
  prizeAwarded: string;
};

const emptyRow = (rank: 1 | 2 | 3): RowState => ({
  rank,
  userId: "",
  teamId: "",
  score: "",
  prizeAwarded: "",
});

export function ResultsEntryClient({ events, initialResultsByEvent }: ResultsEntryClientProps) {
  const router = useRouter();
  const [eventId, setEventId] = useState<string>(events[0]?.id ?? "");
  const [pending, startTransition] = useTransition();
  const [rows, setRows] = useState<RowState[]>([emptyRow(1), emptyRow(2), emptyRow(3)]);

  const event = events.find((e) => e.id === eventId);
  const existing = eventId ? initialResultsByEvent[eventId] ?? [] : [];

  function setRow(idx: number, patch: Partial<RowState>) {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }

  function handleSave() {
    if (!eventId) return;
    const payload = {
      eventId,
      results: rows
        .filter((r) => (event?.eventType === "TEAM" ? r.teamId : r.userId))
        .map((r) => ({
          rank: r.rank,
          positionTitle:
            r.rank === 1 ? "WINNER" : r.rank === 2 ? "FIRST_RUNNER_UP" : "SECOND_RUNNER_UP",
          userId: r.userId || undefined,
          teamId: r.teamId || undefined,
          score: r.score || undefined,
          prizeAwarded: r.prizeAwarded || undefined,
        })),
    };
    if (payload.results.length === 0) {
      toast.error("Enter at least one winner (userId or teamId).");
      return;
    }
    startTransition(async () => {
      const res = await recordEventResults(payload);
      if (res.success) {
        toast.success(`Published ${res.data?.results.length} result(s).`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to save results.");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteResult(id);
      if (res.success) {
        toast.success("Result removed.");
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to remove result.");
      }
    });
  }

  return (
    <div className="space-y-6 text-[#1A1918]">
      {/* Event selection */}
      <div className="p-4 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 space-y-2">
        <label className="text-xs font-mono font-bold uppercase text-[#1A1918]">
          Select Tournament to Score
        </label>
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="w-full p-3 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-xs font-mono text-[#1A1918] focus:outline-none focus:border-[#E85A4F]"
        >
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title} ({e.category} · Day 0{e.dayNumber} · {e.eventType})
            </option>
          ))}
        </select>
      </div>

      {/* Existing results */}
      {existing.length > 0 && (
        <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 shadow-sm space-y-4 font-mono text-xs">
          <h3 className="font-bold text-[#1A1918] uppercase flex items-center">
            <Trophy className="h-4 w-4 text-[#E85A4F] mr-2" /> Currently Published Podiums ({existing.length})
          </h3>
          <div className="space-y-2">
            {existing.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20"
              >
                <div>
                  <p className="font-bold text-[#1A1918]">
                    #{r.rank} · {r.winnerName ?? "Unknown"} ({r.positionTitle})
                  </p>
                  <p className="text-[10px] text-[#8E8D8A]">
                    Score: {r.score ?? "—"} · Prize: {r.prizeAwarded ?? "—"}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => handleDelete(r.id)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New score entry */}
      <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-[#8E8D8A]/20 pb-4">
          <h2 className="text-base font-bold font-mono text-[#1A1918] uppercase flex items-center">
            <Award className="h-4 w-4 text-[#E85A4F] mr-2" /> Record Podium Winners
          </h2>
          <p className="text-xs text-[#8E8D8A] font-mono mt-1">
            Format: {event?.eventType === "TEAM" ? "Team ID" : "User ID / Roll No"}.
          </p>
        </div>

        <div className="space-y-4 font-mono text-xs">
          {rows.map((row, idx) => (
            <div
              key={row.rank}
              className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#E85A4F] uppercase">
                  {row.rank === 1 ? "🥇 Winner (1st)" : row.rank === 2 ? "🥈 1st Runner-Up (2nd)" : "🥉 2nd Runner-Up (3rd)"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[9px] uppercase text-[#8E8D8A] block mb-1">
                    {event?.eventType === "TEAM" ? "Team ID / Name" : "Participant User ID / Roll"}
                  </label>
                  <input
                    type="text"
                    placeholder={event?.eventType === "TEAM" ? "team_..." : "usr_... or Roll No"}
                    value={event?.eventType === "TEAM" ? row.teamId : row.userId}
                    onChange={(e) =>
                      event?.eventType === "TEAM"
                        ? setRow(idx, { teamId: e.target.value })
                        : setRow(idx, { userId: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/30 text-[#1A1918] focus:outline-none focus:border-[#E85A4F]"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase text-[#8E8D8A] block mb-1">Final Score / Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 142/4 or 12.4s"
                    value={row.score}
                    onChange={(e) => setRow(idx, { score: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/30 text-[#1A1918] focus:outline-none focus:border-[#E85A4F]"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase text-[#8E8D8A] block mb-1">Prize Awarded</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹15,000 + Trophy"
                    value={row.prizeAwarded}
                    onChange={(e) => setRow(idx, { prizeAwarded: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/30 text-[#1A1918] focus:outline-none focus:border-[#E85A4F]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={pending}
          onClick={handleSave}
          className="w-full py-3.5 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-4 w-4" /> Save &amp; Publish Official Podium
        </button>
      </div>
    </div>
  );
}

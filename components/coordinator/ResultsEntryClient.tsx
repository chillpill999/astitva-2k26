// ============================================================================
// ASTITVA 2K26 - Coordinator Results Entry Client
// Path: components/coordinator/ResultsEntryClient.tsx
// ============================================================================

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Trash2, Trophy, Medal, Award, Hash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        toast.error(res.error ?? "Failed to publish.");
      }
    });
  }

  function handleDelete(resultId: string) {
    startTransition(async () => {
      const res = await deleteResult({ resultId });
      if (res.success) {
        toast.success("Result removed.");
        router.refresh();
      } else {
        toast.error(res.error ?? "Delete failed.");
      }
    });
  }

  return (
    <Card className="glass-panel border-white/10 bg-slate-900/70">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-white flex items-center">
          <Trophy className="h-4 w-4 text-amber-300 mr-2" /> Live Score Entry & Podium Publisher
        </CardTitle>
        <CardDescription className="text-xs text-slate-400 mt-1">
          Enter rank 1, 2, 3 results. Saving will mark the event COMPLETED and trigger certificate
          auto-issuance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Select value={eventId} onValueChange={setEventId}>
            <SelectTrigger className="bg-slate-950/80 border-white/10 text-white text-xs h-9 min-w-[280px]">
              <SelectValue placeholder="Select event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.title} · {e.eventType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {event && (
            <Badge variant="outline" className="border-amber-500/30 text-amber-300 font-mono text-[10px]">
              {event.eventType} · Day {event.dayNumber}
            </Badge>
          )}
        </div>

        {existing.length > 0 && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-2">
            <p className="text-xs font-mono text-amber-300 uppercase tracking-wider">
              Existing Podium
            </p>
            {existing.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="font-bold text-white truncate">
                    #{r.rank} · {r.winnerName ?? "TBD"} ·{" "}
                    <span className="text-amber-300 font-mono">
                      {r.positionTitle.replace("_", " ")}
                    </span>
                  </p>
                  {r.score && <p className="text-[10px] text-slate-400 font-mono">{r.score}</p>}
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-red-400 hover:bg-red-500/10"
                  onClick={() => handleDelete(r.id)}
                  disabled={pending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          {rows.map((row, idx) => (
            <div
              key={row.rank}
              className="grid grid-cols-12 gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-3"
            >
              <div className="col-span-1 flex items-center justify-center">
                {row.rank === 1 ? (
                  <Trophy className="h-5 w-5 text-amber-300" />
                ) : row.rank === 2 ? (
                  <Medal className="h-5 w-5 text-slate-200" />
                ) : (
                  <Award className="h-5 w-5 text-orange-300" />
                )}
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-mono text-slate-400">Rank</label>
                <Input
                  value={row.rank}
                  readOnly
                  className="bg-slate-900/60 border-white/10 text-white text-xs h-8"
                />
              </div>
              <div className="col-span-3 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 flex items-center">
                  <Hash className="h-3 w-3 mr-1" />
                  {event?.eventType === "TEAM" ? "Team ID" : "User ID"}
                </label>
                <Input
                  placeholder={event?.eventType === "TEAM" ? "team_xxx" : "usr_xxx"}
                  value={event?.eventType === "TEAM" ? row.teamId : row.userId}
                  onChange={(e) =>
                    setRow(idx, event?.eventType === "TEAM" ? { teamId: e.target.value } : { userId: e.target.value })
                  }
                  className="bg-slate-900/60 border-white/10 text-white text-xs h-8 font-mono"
                />
              </div>
              <div className="col-span-3 space-y-1">
                <label className="text-[10px] font-mono text-slate-400">Score</label>
                <Input
                  placeholder="e.g. 21-18, 21-19"
                  value={row.score}
                  onChange={(e) => setRow(idx, { score: e.target.value })}
                  className="bg-slate-900/60 border-white/10 text-white text-xs h-8"
                />
              </div>
              <div className="col-span-3 space-y-1">
                <label className="text-[10px] font-mono text-slate-400">Prize</label>
                <Input
                  placeholder="₹10,000 + Trophy"
                  value={row.prizeAwarded}
                  onChange={(e) => setRow(idx, { prizeAwarded: e.target.value })}
                  className="bg-slate-900/60 border-white/10 text-white text-xs h-8"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            variant="neonAmber"
            onClick={handleSave}
            disabled={pending || !eventId}
            className="text-xs font-bold"
          >
            <Save className="h-4 w-4 mr-1.5" /> Publish Podium
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

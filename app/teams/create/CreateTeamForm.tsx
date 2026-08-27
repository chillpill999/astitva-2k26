"use client";

// ============================================================================
// ASTITVA 2K26 - Create Squad Client Form Component
// Path: app/teams/create/CreateTeamForm.tsx
// ============================================================================

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Trophy,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Copy,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createTeam } from "@/lib/teams/actions";
import { FestEvent } from "@/lib/data/fest-data";

interface CreateTeamFormProps {
  teamEvents: FestEvent[];
  defaultEventId?: string;
}

export function CreateTeamForm({ teamEvents, defaultEventId }: CreateTeamFormProps) {
  const router = useRouter();

  const [selectedEventId, setSelectedEventId] = useState<string>(
    defaultEventId || (teamEvents[0]?.id ?? "")
  );
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdTeam, setCreatedTeam] = useState<{
    id: string;
    name: string;
    code: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedEvent = teamEvents.find((e) => e.id === selectedEventId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) {
      setError("Please select a competition.");
      return;
    }
    if (teamName.trim().length < 3) {
      setError("Squad name must be at least 3 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await createTeam({
        eventId: selectedEventId,
        name: teamName.trim(),
      });

      if (res.success && res.data) {
        setCreatedTeam({
          id: res.data.id,
          name: res.data.name,
          code: res.data.code,
        });
      } else {
        setError(res.error || "Failed to form squad.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (createdTeam) {
    const shareText = encodeURIComponent(
      `🔥 Join my squad *${createdTeam.name}* for ${selectedEvent?.title || "ASTITVA 2K26"}!\n` +
      `⚡ Invite Code: *${createdTeam.code}*\n` +
      `👉 Direct Join Link: https://astitva2k26.lnjpit.ac.in/teams/join/${createdTeam.code}`
    );

    return (
      <div className="rounded-3xl bg-[#0b0f19]/90 border border-white/10 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <Badge variant="outline" className="text-xs font-mono bg-emerald-950/40 text-emerald-300 border-emerald-500/30">
            SQUAD REGISTERED &amp; LIVE
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Squad <span className="text-cyan-300">{createdTeam.name}</span> Created!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            You are enrolled as Squad Captain. Share the 6-character access token with your teammates to fill the roster.
          </p>
        </div>

        {/* 6-Char Code Box */}
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-3 shadow-inner">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            Squad Invite Code
          </span>
          <div className="text-4xl font-mono font-black tracking-widest text-cyan-300">
            {createdTeam.code}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              size="sm"
              onClick={async () => {
                if (typeof window !== "undefined") {
                  try {
                    await navigator.clipboard.writeText(createdTeam.code);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch {}
                }
              }}
              className="text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20"
            >
              <Copy className="mr-1.5 h-3.5 w-3.5" />
              {copied ? "Code Copied!" : "Copy Code"}
            </Button>

            <a
              href={`https://api.whatsapp.com/send?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="button"
                size="sm"
                className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
              >
                <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                WhatsApp Share
              </Button>
            </a>
          </div>
        </div>

        <div className="max-w-md mx-auto pt-4 flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            onClick={() => router.push(`/teams/${createdTeam.id}`)}
            className="flex-1 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 py-5"
          >
            Go to Squad Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Link href="/teams" className="flex-1">
            <Button
              type="button"
              variant="outline"
              className="w-full text-xs font-bold border-white/15 bg-white/5 text-slate-200 py-5"
            >
              All Squads Hub
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-[#0b0f19]/90 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tournament Selector */}
        <div className="space-y-2">
          <Label className="text-xs font-mono text-slate-300">Select Tournament / Event</Label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-900 border border-white/15 text-sm text-white focus:border-cyan-400 focus:outline-none"
          >
            {teamEvents.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title} ({evt.minTeamSize}-{evt.maxTeamSize} Players) • ₹{evt.prizePool.toLocaleString("en-IN")} Pool
              </option>
            ))}
          </select>
        </div>

        {/* Squad Name */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-mono text-slate-300">Squad Name</Label>
            <span className="text-[10px] font-mono text-slate-400">
              {teamName.length}/50 characters
            </span>
          </div>
          <Input
            type="text"
            placeholder="e.g. LNJPIT Titans ME, Cyber Ninjas"
            value={teamName}
            maxLength={50}
            onChange={(e) => setTeamName(e.target.value)}
            className="text-sm bg-slate-900 border-white/15 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-400 py-5"
          />
        </div>

        {/* Selected Event Details Card */}
        {selectedEvent && (
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Roster Constraints:</span>
              <span className="text-cyan-300 font-bold">
                {selectedEvent.minTeamSize} minimum to {selectedEvent.maxTeamSize} maximum players
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Venue &amp; Day:</span>
              <span className="text-slate-200">
                {selectedEvent.venue} (Day {selectedEvent.dayNumber})
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Prize Pool:</span>
              <span className="text-amber-400 font-bold">
                ₹{selectedEvent.prizePool.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}

        {/* Error Feedback */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading || teamName.trim().length < 3}
            className="w-full text-xs sm:text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 py-6 rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Squad &amp; Invite Code...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Create Squad &amp; Generate Invite Code
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

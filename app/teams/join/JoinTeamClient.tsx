"use client";

// ============================================================================
// ASTITVA 2K26 - Join Squad Client Component
// Path: app/teams/join/JoinTeamClient.tsx
// ============================================================================

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  KeyRound,
  Users,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { joinTeamByCode, getTeamByCode } from "@/lib/teams/actions";
import { TeamData } from "@/lib/teams/types";

interface JoinTeamClientProps {
  initialCode?: string;
}

export function JoinTeamClient({ initialCode = "" }: JoinTeamClientProps) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode.toUpperCase());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewTeam, setPreviewTeam] = useState<TeamData | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [joinedTeam, setJoinedTeam] = useState<{
    id: string;
    name: string;
    eventTitle?: string;
  } | null>(null);

  // Live lookup when code reaches 6 characters
  useEffect(() => {
    const clean = code.trim().toUpperCase();
    if (clean.length === 6) {
      setPreviewLoading(true);
      getTeamByCode(clean)
        .then((res) => {
          if (res.success && res.data) {
            setPreviewTeam(res.data);
            setError(null);
          } else {
            setPreviewTeam(null);
          }
        })
        .catch(() => setPreviewTeam(null))
        .finally(() => setPreviewLoading(false));
    } else {
      setPreviewTeam(null);
    }
  }, [code]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode.length !== 6) {
      setError("Invite code must be exactly 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await joinTeamByCode(cleanCode);
      if (res.success && res.data) {
        setJoinedTeam({
          id: res.data.id,
          name: res.data.name,
          eventTitle: res.data.event?.title,
        });
      } else {
        setError(res.error || "Failed to join squad.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (joinedTeam) {
    return (
      <div className="rounded-3xl bg-[#0b0f19]/90 border border-white/10 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <Badge variant="outline" className="text-xs font-mono bg-emerald-950/40 text-emerald-300 border-emerald-500/30">
            SQUAD MEMBERSHIP APPROVED
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Welcome to <span className="text-cyan-300">{joinedTeam.name}</span>!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            You are officially enrolled in squad {joinedTeam.name} for {joinedTeam.eventTitle || "the tournament"}.
          </p>
        </div>

        <div className="max-w-md mx-auto pt-4 flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            onClick={() => router.push(`/teams/${joinedTeam.id}`)}
            className="flex-1 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 py-5"
          >
            View Squad Roster &amp; Status
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
    <div className="rounded-3xl bg-[#0b0f19]/90 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6">
      <form onSubmit={handleJoin} className="space-y-6">
        <div className="space-y-2 text-center">
          <Label className="text-xs font-mono text-slate-300">
            ENTER 6-CHARACTER SQUAD ACCESS TOKEN
          </Label>
          <div className="max-w-xs mx-auto">
            <Input
              type="text"
              placeholder="BG26X1"
              value={code}
              maxLength={6}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
              className="text-center font-mono text-3xl font-black tracking-widest bg-slate-950 border-cyan-500/40 text-cyan-300 placeholder:text-slate-700 rounded-2xl focus:border-cyan-400 py-6 uppercase"
            />
          </div>
        </div>

        {/* Live Squad Preview Box if Found */}
        {previewLoading && (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-center gap-2 text-xs font-mono text-cyan-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Looking up squad details...
          </div>
        )}

        {previewTeam && !previewLoading && (
          <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                SQUAD FOUND
              </Badge>
              <span className="text-[11px] font-mono text-slate-400">
                Captain: <strong className="text-white">{previewTeam.captain?.name}</strong>
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-white">{previewTeam.name}</h4>
              <p className="text-xs text-slate-300">{previewTeam.event?.title}</p>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/10 text-slate-300">
              <span>Roster: <strong>{previewTeam.approvedMemberCount} / {previewTeam.maxMembers}</strong></span>
              <span className="text-cyan-400 font-bold">{previewTeam.event?.venue}</span>
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

        {/* Action Button */}
        <div>
          <Button
            type="submit"
            disabled={loading || code.trim().length !== 6}
            className="w-full text-xs sm:text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 py-6 rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying Roster &amp; Enrolling...
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                Confirm &amp; Join Squad
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

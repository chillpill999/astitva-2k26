"use client";

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
      <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-8 sm:p-12 shadow-sm text-center space-y-6 text-[#1A1918]">
        <div className="h-16 w-16 rounded-full bg-[#E85A4F]/10 border border-[#E85A4F]/30 flex items-center justify-center text-[#E85A4F] mx-auto">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-2 font-mono">
          <span className="text-[10px] text-[#8E8D8A] uppercase tracking-wider">SUCCESSFULLY ENROLLED</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#1A1918]">{joinedTeam.name}</h2>
          <p className="text-xs text-[#8E8D8A]">
            You are now part of the lineup for <strong>{joinedTeam.eventTitle || "Tournament"}</strong>.
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <Link href={`/teams/${joinedTeam.id}`}>
            <button className="py-3 px-8 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#E85A4F] hover:bg-[#C94A40] text-white transition-colors flex items-center gap-2 shadow-sm cursor-pointer">
              Go to Squad Dashboard →
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleJoin} className="space-y-6 text-[#1A1918]">
      <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Code Input */}
        <div className="space-y-2 text-center">
          <label htmlFor="teamCode" className="text-xs font-mono font-bold text-[#1A1918] uppercase block">
            Enter 6-Digit Team Invite Code <span className="text-[#E85A4F]">*</span>
          </label>
          <input
            id="teamCode"
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. CRK824"
            className="w-full max-w-xs mx-auto p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-2xl sm:text-3xl font-mono font-black text-center tracking-[0.3em] text-[#E85A4F] uppercase focus:outline-none focus:border-[#E85A4F]"
          />
        </div>

        {/* Live Preview Box */}
        {previewLoading && (
          <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 flex items-center justify-center gap-2 text-xs font-mono text-[#8E8D8A]">
            <Loader2 className="h-4 w-4 animate-spin text-[#E85A4F]" />
            <span>Finding squad in LNJPIT registry...</span>
          </div>
        )}

        {previewTeam && !previewLoading && (
          <div className="p-5 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 space-y-3 font-mono text-xs animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#8E8D8A] uppercase">SQUAD FOUND</span>
              <span className="text-[10px] font-bold text-[#E85A4F] uppercase">
                {previewTeam.event?.category?.name}
              </span>
            </div>
            <div>
              <h4 className="text-base font-bold text-[#1A1918] uppercase">{previewTeam.name}</h4>
              <p className="text-xs text-[#8E8D8A]">{previewTeam.event?.title}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#8E8D8A]/20 text-[#8E8D8A]">
              <span>Captain: <strong className="text-[#1A1918]">{previewTeam.captain?.name}</strong></span>
              <span>Roster: <strong className="text-[#1A1918]">{previewTeam.approvedMemberCount}/{previewTeam.maxMembers}</strong></span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-xs font-mono text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || code.trim().length !== 6}
          className="w-full py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#E85A4F] hover:bg-[#C94A40] text-white disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              JOINING SQUAD...
            </>
          ) : (
            <>
              <Users className="h-4 w-4" />
              CONFIRM &amp; JOIN SQUAD
            </>
          )}
        </button>
      </div>
    </form>
  );
}

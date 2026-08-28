"use client";

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
      <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-8 sm:p-12 shadow-sm text-center space-y-6 text-[#1A1918]">
        <div className="h-16 w-16 rounded-full bg-[#E85A4F]/10 border border-[#E85A4F]/30 flex items-center justify-center text-[#E85A4F] mx-auto">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-2 font-mono">
          <span className="text-[10px] text-[#8E8D8A] uppercase tracking-wider">SQUAD CREATED SUCCESSFULLY</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#1A1918]">{createdTeam.name}</h2>
          <p className="text-xs text-[#8E8D8A]">
            Registered for <strong>{selectedEvent?.title || "Tournament"}</strong>
          </p>
        </div>

        {/* Invite Code Box */}
        <div className="p-6 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 space-y-3 max-w-md mx-auto">
          <span className="text-[10px] font-mono text-[#8E8D8A] uppercase tracking-wider">
            6-Digit Team Invite Code
          </span>
          <div className="text-4xl sm:text-5xl font-mono font-black tracking-widest text-[#E85A4F]">
            {createdTeam.code}
          </div>
          <p className="text-[11px] font-mono text-[#8E8D8A]">
            Share this code with your classmates to join your lineup.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
          <a
            href={`https://api.whatsapp.com/send?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <button className="w-full py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#E85A4F] hover:bg-[#C94A40] text-white transition-colors flex items-center justify-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Share on WhatsApp
            </button>
          </a>

          <Link href={`/teams/${createdTeam.id}`} className="flex-1">
            <button className="w-full py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#1A1918] hover:bg-[#E85A4F] text-[#EAE7DC] transition-colors flex items-center justify-center gap-2">
              Manage Roster →
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-[#1A1918]">
      <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Tournament Selector */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-[#1A1918] uppercase">
            Select Tournament Competition <span className="text-[#E85A4F]">*</span>
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-xs font-mono text-[#1A1918] focus:outline-none focus:border-[#E85A4F]"
          >
            {teamEvents.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title} ({evt.category?.name}) — {evt.minTeamSize}-{evt.maxTeamSize} Players
              </option>
            ))}
          </select>
        </div>

        {/* Selected Event Specs */}
        {selectedEvent && (
          <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-[9px] text-[#8E8D8A] uppercase block">Min Players</span>
              <span className="font-bold text-[#1A1918]">{selectedEvent.minTeamSize}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#8E8D8A] uppercase block">Max Players</span>
              <span className="font-bold text-[#1A1918]">{selectedEvent.maxTeamSize}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#8E8D8A] uppercase block">Venue</span>
              <span className="font-bold text-[#1A1918] truncate block">{selectedEvent.venue}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#8E8D8A] uppercase block">Schedule</span>
              <span className="font-bold text-[#E85A4F]">Day 0{selectedEvent.dayNumber}</span>
            </div>
          </div>
        )}

        {/* Squad Name Input */}
        <div className="space-y-2">
          <label htmlFor="teamName" className="text-xs font-mono font-bold text-[#1A1918] uppercase">
            Squad Name <span className="text-[#E85A4F]">*</span>
          </label>
          <input
            id="teamName"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="e.g. LNJPIT Warriors, Binary Strikers..."
            className="w-full p-3.5 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-xs font-mono text-[#1A1918] placeholder:text-[#8E8D8A]/60 focus:outline-none focus:border-[#E85A4F]"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-xs font-mono text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#E85A4F] hover:bg-[#C94A40] text-white transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              FORMING SQUAD...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              CREATE SQUAD &amp; GET CODE →
            </>
          )}
        </button>
      </div>
    </form>
  );
}

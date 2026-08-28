"use client";

// ============================================================================
// ASTITVA 2K26 - Create Squad Modal (Exteta Luxury Aesthetic)
// Path: components/teams/CreateTeamModal.tsx
// ============================================================================

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Copy,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { createTeam } from "@/lib/teams/actions";
import { FestEvent } from "@/lib/data/fest-data";

interface CreateTeamModalProps {
  events: FestEvent[];
  defaultEventId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (teamId: string, code: string) => void;
}

export function CreateTeamModal({
  events,
  defaultEventId,
  isOpen,
  onClose,
  onSuccess,
}: CreateTeamModalProps) {
  const router = useRouter();
  const teamEvents = events.filter((e) => e.eventType === "TEAM" || e.maxTeamSize > 1);

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

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) {
      setError("Please select a tournament.");
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
        if (onSuccess) {
          onSuccess(res.data.id, res.data.code);
        }
      } else {
        setError(res.error || "Failed to create squad.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setCreatedTeam(null);
    setTeamName("");
    setError(null);
    onClose();
  };

  const handleCopyCode = async (code: string) => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[#1A1918] max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl font-mono">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
              CAPTAIN PORTAL
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#E85A4F] uppercase border border-[#8E8D8A]/20">
              SQUAD REGISTRATION
            </span>
          </div>
          <DialogTitle className="text-xl font-bold uppercase text-[#1A1918]">
            Form Tournament Squad
          </DialogTitle>
          <DialogDescription className="text-xs text-[#8E8D8A]">
            Create a squad and generate a unique 6-character team invite code.
          </DialogDescription>
        </DialogHeader>

        {createdTeam ? (
          <div className="space-y-6 py-3 text-center">
            <div className="h-16 w-16 rounded-full bg-[#E85A4F]/10 border border-[#E85A4F]/30 flex items-center justify-center text-[#E85A4F] mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#1A1918] uppercase">{createdTeam.name}</h3>
              <p className="text-xs text-[#8E8D8A]">
                Squad created for <strong className="text-[#1A1918]">{selectedEvent?.title}</strong>
              </p>
            </div>

            <div className="w-full p-5 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 space-y-3">
              <span className="text-[10px] uppercase text-[#8E8D8A]">Squad Invite Code</span>
              <div className="text-4xl font-black tracking-widest text-[#E85A4F]">
                {createdTeam.code}
              </div>
              <button
                type="button"
                onClick={() => handleCopyCode(createdTeam.code)}
                className="px-4 py-1.5 rounded-xl border border-[#8E8D8A]/35 bg-[#F6F4EE] text-xs font-bold text-[#1A1918] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all flex items-center gap-1.5 mx-auto"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? "Copied to Clipboard!" : "Copy Code"}
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleModalClose();
                  router.push(`/teams/${createdTeam.id}`);
                }}
                className="w-full py-3 rounded-xl bg-[#E85A4F] text-white text-xs font-bold uppercase hover:bg-[#C94A40] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Go to Squad Roster <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 py-2 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-[#1A1918]">Select Tournament</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] focus:outline-none focus:border-[#E85A4F]"
              >
                {teamEvents.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.category?.name}) · {evt.minTeamSize}-{evt.maxTeamSize} Players
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-[#1A1918]">Squad Name</label>
              <input
                type="text"
                placeholder="e.g. LNJPIT Warriors"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] placeholder:text-[#8E8D8A]/60 focus:outline-none focus:border-[#E85A4F]"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleModalClose}
                className="flex-1 py-2.5 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-[#E85A4F] text-white font-bold uppercase hover:bg-[#C94A40] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Squad"}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

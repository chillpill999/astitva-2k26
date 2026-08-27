"use client";

// ============================================================================
// ASTITVA 2K26 - Create Squad Modal Component
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const handleClose = () => {
    setCreatedTeam(null);
    setTeamName("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-[#0b0f19]/95 border-white/15 text-white backdrop-blur-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono bg-cyan-950/40 text-cyan-300 border-cyan-500/30">
              SQUAD CREATION
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono bg-purple-950/40 text-purple-300 border-purple-500/30">
              CAPTAIN ENROLLMENT
            </Badge>
          </div>
          <DialogTitle className="text-xl font-black tracking-tight text-white">
            Form Your Tournament Squad
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-300">
            Create a squad, become the Captain, and generate an instant 6-character invite code for your teammates.
          </DialogDescription>
        </DialogHeader>

        {createdTeam ? (
          <div className="py-6 flex flex-col items-center text-center space-y-5">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-white">Squad Successfully Formed!</h4>
              <p className="text-xs text-slate-300">
                Squad <strong className="text-cyan-300">{createdTeam.name}</strong> is now live. Share the invite code with teammates.
              </p>
            </div>

            {/* Invite Code Box */}
            <div className="w-full p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                6-Character Invite Code
              </span>
              <div className="text-3xl font-mono font-black tracking-widest text-cyan-300">
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
                  className="text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  {copied ? "Code Copied!" : "Copy Code"}
                </Button>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `🔥 Join my squad *${createdTeam.name}* for ASTITVA 2K26!\n⚡ Invite Code: *${createdTeam.code}*\n👉 Direct Join: https://astitva2k26.lnjpit.ac.in/teams/join/${createdTeam.code}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    type="button"
                    size="sm"
                    className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            <div className="w-full flex gap-3 pt-2">
              <Button
                type="button"
                onClick={() => {
                  handleClose();
                  router.push(`/teams/${createdTeam.id}`);
                }}
                className="w-full text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/25 py-5"
              >
                Go to Squad Roster Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {/* Event Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-slate-300">Target Tournament</Label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:border-cyan-400 focus:outline-none"
              >
                {teamEvents.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.minTeamSize}-{evt.maxTeamSize} Players)
                  </option>
                ))}
              </select>
            </div>

            {/* Squad Name Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-mono text-slate-300">Squad Name</Label>
                <span className="text-[10px] font-mono text-slate-400">
                  {teamName.length}/50 chars
                </span>
              </div>
              <Input
                type="text"
                placeholder="e.g. LNJPIT Titans ME, Cyber Ninjas"
                value={teamName}
                maxLength={50}
                onChange={(e) => setTeamName(e.target.value)}
                className="text-xs bg-slate-900 border-white/15 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-400"
              />
            </div>

            {/* Event Info Card */}
            {selectedEvent && (
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-1 text-xs font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Required Squad Size:</span>
                  <span className="text-cyan-300 font-bold">
                    {selectedEvent.minTeamSize} to {selectedEvent.maxTeamSize} Players
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Venue:</span>
                  <span className="text-slate-200">{selectedEvent.venue}</span>
                </div>
              </div>
            )}

            {/* Error Feedback */}
            {error && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 flex items-start gap-2 text-xs text-red-300">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={handleClose}
                className="text-xs font-bold border-white/15 bg-white/5 text-slate-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Squad...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    Create Squad &amp; Get Code
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

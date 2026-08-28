"use client";

// ============================================================================
// ASTITVA 2K26 - Join Squad Modal (Exteta Luxury Aesthetic)
// Path: components/teams/JoinTeamModal.tsx
// ============================================================================

import React, { useState, useEffect } from "react";
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
  KeyRound,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { joinTeamByCode } from "@/lib/teams/actions";

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCode?: string;
  onSuccess?: (teamId: string) => void;
}

export function JoinTeamModal({
  isOpen,
  onClose,
  defaultCode = "",
  onSuccess,
}: JoinTeamModalProps) {
  const router = useRouter();
  const [code, setCode] = useState(defaultCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joinedTeam, setJoinedTeam] = useState<{
    id: string;
    name: string;
    eventTitle?: string;
  } | null>(null);

  useEffect(() => {
    if (defaultCode) {
      setCode(defaultCode.toUpperCase());
    }
  }, [defaultCode]);

  const handleSubmit = async (e: React.FormEvent) => {
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
        if (onSuccess) {
          onSuccess(res.data.id);
        }
      } else {
        setError(res.error || "Failed to join squad.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setJoinedTeam(null);
    setCode("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[#1A1918] max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl font-mono">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
              SQUAD ENROLLMENT
            </span>
          </div>
          <DialogTitle className="text-xl font-bold uppercase text-[#1A1918]">
            Join with Invite Code
          </DialogTitle>
          <DialogDescription className="text-xs text-[#8E8D8A]">
            Enter the 6-character code provided by your Squad Captain.
          </DialogDescription>
        </DialogHeader>

        {joinedTeam ? (
          <div className="space-y-6 py-3 text-center">
            <div className="h-16 w-16 rounded-full bg-[#E85A4F]/10 border border-[#E85A4F]/30 flex items-center justify-center text-[#E85A4F] mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#1A1918] uppercase">{joinedTeam.name}</h3>
              <p className="text-xs text-[#8E8D8A]">
                Successfully enrolled in <strong className="text-[#1A1918]">{joinedTeam.eventTitle}</strong>
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  router.push(`/teams/${joinedTeam.id}`);
                }}
                className="w-full py-3 rounded-xl bg-[#E85A4F] text-white text-xs font-bold uppercase hover:bg-[#C94A40] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                Go to Squad Roster <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 py-2 text-xs">
            <div className="space-y-2 text-center">
              <label className="text-[10px] font-bold uppercase text-[#1A1918] block">
                6-Digit Squad Invite Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="e.g. CRK824"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full p-4 text-center font-black text-2xl tracking-[0.3em] bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#E85A4F] uppercase rounded-2xl focus:outline-none focus:border-[#E85A4F]"
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
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || code.trim().length !== 6}
                className="flex-1 py-2.5 rounded-xl bg-[#E85A4F] text-white font-bold uppercase hover:bg-[#C94A40] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join Squad"}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

"use client";

// ============================================================================
// ASTITVA 2K26 - Join Squad with Invite Code Modal Component
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
      <DialogContent className="sm:max-w-md bg-[#0b0f19]/95 border-white/15 text-white backdrop-blur-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono bg-cyan-950/40 text-cyan-300 border-cyan-500/30">
              SQUAD JOIN PORTAL
            </Badge>
          </div>
          <DialogTitle className="text-xl font-black tracking-tight text-white">
            Join Tournament Squad
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-300">
            Enter the 6-character alphanumeric code provided by your Squad Captain.
          </DialogDescription>
        </DialogHeader>

        {joinedTeam ? (
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-white">Joined Squad Successfully!</h4>
              <p className="text-xs text-slate-300">
                You are now an approved member of squad <strong className="text-cyan-300">{joinedTeam.name}</strong>
                {joinedTeam.eventTitle ? ` for ${joinedTeam.eventTitle}` : ""}.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => {
                handleClose();
                router.push(`/teams/${joinedTeam.id}`);
              }}
              className="w-full text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/25 py-5 mt-2"
            >
              View Squad Roster
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-slate-300">6-Character Invite Code</Label>
              <Input
                type="text"
                placeholder="e.g. BG26X1, TITN26"
                value={code}
                maxLength={6}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                className="text-center font-mono text-lg font-bold tracking-widest bg-slate-900 border-white/15 text-cyan-300 placeholder:text-slate-600 rounded-xl focus:border-cyan-400 uppercase"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 flex items-start gap-2 text-xs text-red-300">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

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
                disabled={loading || code.trim().length !== 6}
                className="text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Code...
                  </>
                ) : (
                  <>
                    <Users className="mr-1.5 h-3.5 w-3.5" />
                    Confirm &amp; Join Squad
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

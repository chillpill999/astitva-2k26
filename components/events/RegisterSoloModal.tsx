"use client";

// ============================================================================
// ASTITVA 2K26 - Register Solo Modal Component
// Path: components/events/RegisterSoloModal.tsx
// ============================================================================

import React, { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Trophy,
  Calendar,
  MapPin,
  QrCode,
  AlertTriangle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { registerSoloEvent } from "@/lib/events/actions";
import { FestEvent } from "@/lib/data/fest-data";

interface RegisterSoloModalProps {
  event: FestEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (registrationNumber: string) => void;
}

export function RegisterSoloModal({
  event,
  isOpen,
  onClose,
  onSuccess,
}: RegisterSoloModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    registrationNumber: string;
    ticketCode?: string | null;
  } | null>(null);

  if (!event) return null;

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerSoloEvent(event.id);
      if (res.success && res.data) {
        setSuccessData({
          registrationNumber: res.data.registrationNumber,
          ticketCode: res.data.qrTicketCode,
        });
        if (onSuccess) {
          onSuccess(res.data.registrationNumber);
        }
      } else {
        setError(res.error || "Failed to complete registration.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setSuccessData(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-md bg-[#0b0f19]/95 border-white/15 text-white backdrop-blur-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono bg-purple-950/40 text-purple-400 border-purple-500/30">
              SOLO REGISTRATION
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono bg-amber-950/40 text-amber-300 border-amber-500/30">
              FREE FOR LNJPIT STUDENTS
            </Badge>
          </div>
          <DialogTitle className="text-xl font-black tracking-tight text-white">
            {event.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-300">
            Confirm your participation slot for this individual competition.
          </DialogDescription>
        </DialogHeader>

        {successData ? (
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-white">Registration Confirmed!</h4>
              <p className="text-xs text-slate-300">
                You are officially enrolled in <span className="text-cyan-300 font-bold">{event.title}</span>.
              </p>
            </div>

            <div className="w-full p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Official Ticket No:</span>
                <span className="font-mono font-bold text-cyan-400">{successData.registrationNumber}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Venue:</span>
                <span className="font-medium text-slate-200">{event.venue}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Schedule:</span>
                <span className="font-mono text-slate-200">
                  Day {event.dayNumber} (Sept {3 + event.dayNumber}) • {new Date(event.scheduleStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>

            <div className="w-full flex gap-2 pt-2">
              <Link href="/dashboard/participant" className="flex-1">
                <Button className="w-full text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white">
                  <QrCode className="mr-1.5 h-3.5 w-3.5" />
                  View Digital Pass
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleModalClose}
                className="text-xs font-bold border-white/15 bg-white/5 text-slate-300 hover:text-white"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-2">
            {/* Event Summary Box */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="h-4 w-4 text-purple-400 shrink-0" />
                <span>
                  Day {event.dayNumber} (Sept {3 + event.dayNumber}, 2026) • {new Date(event.scheduleStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Prize Pool: ₹{event.prizePool.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 flex items-start gap-2 text-xs text-red-300">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={handleModalClose}
                className="text-xs font-bold border-white/15 bg-white/5 text-slate-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={loading}
                onClick={handleRegister}
                className="text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    Confirm Solo Registration
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

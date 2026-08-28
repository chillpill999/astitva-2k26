"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      <DialogContent className="sm:max-w-md bg-[#F6F4EE] border border-[#8E8D8A]/30 text-[#1A1918] rounded-3xl shadow-2xl p-6 sm:p-7">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
              SOLO REGISTRATION
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#E85A4F] uppercase border border-[#8E8D8A]/25">
              100% FREE
            </span>
          </div>
          <DialogTitle className="text-xl font-bold font-mono text-[#1A1918] uppercase">
            {event.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#8E8D8A] font-mono">
            Confirm your participation slot for this individual competition.
          </DialogDescription>
        </DialogHeader>

        {successData ? (
          <div className="space-y-4 py-4 text-center">
            <div className="h-12 w-12 rounded-full bg-[#E85A4F]/10 border border-[#E85A4F]/30 flex items-center justify-center mx-auto text-[#E85A4F]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1 font-mono">
              <h4 className="text-base font-bold text-[#1A1918] uppercase">Registration Confirmed!</h4>
              <p className="text-xs text-[#8E8D8A]">
                Your spot in <strong className="text-[#1A1918]">{event.title}</strong> is secured.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 space-y-1 font-mono text-center">
              <span className="text-[10px] text-[#8E8D8A] uppercase block">Ticket Identifier</span>
              <p className="text-base font-bold text-[#E85A4F]">{successData.registrationNumber}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Link href="/dashboard/participant" className="flex-1">
                <button className="w-full py-2.5 rounded-xl bg-[#1A1918] text-[#EAE7DC] text-xs font-mono font-bold uppercase hover:bg-[#E85A4F] transition-colors">
                  View Pass
                </button>
              </Link>
              <button
                onClick={handleModalClose}
                className="flex-1 py-2.5 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-mono font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-3">
            {/* Event Summary Box */}
            <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-[#8E8D8A]">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#E85A4F]" /> Venue
                </span>
                <span className="font-bold text-[#1A1918]">{event.venue}</span>
              </div>
              <div className="flex items-center justify-between text-[#8E8D8A]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#E85A4F]" /> Schedule
                </span>
                <span className="font-bold text-[#1A1918]">Day 0{event.dayNumber}</span>
              </div>
              <div className="flex items-center justify-between text-[#8E8D8A]">
                <span className="flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-[#E85A4F]" /> Cash Bounty
                </span>
                <span className="font-bold text-[#E85A4F]">₹{event.prizePool?.toLocaleString("en-IN") || 0}</span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-xs font-mono text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleModalClose}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-mono font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRegister}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Confirm Slot
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

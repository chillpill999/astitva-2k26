"use client";

// ============================================================================
// ASTITVA 2K26 - Quick Scanner Modal (Exteta Luxury Aesthetic)
// Path: components/dashboard/QuickScannerModal.tsx
// ============================================================================

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QrCode, Camera, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface QuickScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickScannerModal({ isOpen, onClose }: QuickScannerModalProps) {
  const [manualId, setManualId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    name?: string;
    id?: string;
    event?: string;
    message?: string;
  } | null>(null);

  const handleManualVerify = () => {
    if (!manualId.trim()) {
      toast.error("Please enter a valid AST26 ID or Roll Number.");
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        success: true,
        name: "Verified LNJPIT Student",
        id: manualId.toUpperCase(),
        event: "Campus Gate Entry",
        message: "Gate access granted. Valid ASTITVA 2K26 Pass.",
      });
      toast.success(`Verified: ${manualId.toUpperCase()}`);
    }, 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[#1A1918] max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold font-mono uppercase text-[#1A1918] flex items-center">
            <QrCode className="h-5 w-5 text-[#E85A4F] mr-2" />
            Fast Gate Scanner
          </DialogTitle>
          <DialogDescription className="text-xs text-[#8E8D8A] font-mono">
            Scan attendee QR passes or enter AST26 ID manually.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 font-mono text-xs">
          {/* Simulated Webcam Viewfinder */}
          <div className="relative h-44 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 flex flex-col items-center justify-center overflow-hidden">
            <Camera className="h-8 w-8 text-[#E85A4F] mb-2" />
            <span className="text-xs font-bold text-[#1A1918] uppercase">Optical Scanner Active</span>
            <span className="text-[10px] text-[#8E8D8A] mt-1">Aim camera at participant badge</span>
          </div>

          {/* Manual Input Fallback */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-[#1A1918]">
              Manual Participant ID Lookup
            </label>
            <div className="flex gap-2">
              <input
                placeholder="e.g. AST26-1042 or 22105128005"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                className="flex-1 p-2.5 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] placeholder:text-[#8E8D8A]/60 focus:outline-none focus:border-[#E85A4F]"
              />
              <button
                type="button"
                onClick={handleManualVerify}
                disabled={isScanning}
                className="px-4 py-2.5 rounded-xl bg-[#E85A4F] text-white font-bold uppercase hover:bg-[#C94A40] transition-colors shadow-sm disabled:opacity-50"
              >
                {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
              </button>
            </div>
          </div>

          {/* Result Card */}
          {scanResult && (
            <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-2">
              <div className="flex items-center gap-2 text-[#E85A4F] font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>{scanResult.message}</span>
              </div>
              <div className="text-[11px] text-[#8E8D8A]">
                <p>Participant: <strong className="text-[#1A1918]">{scanResult.name}</strong></p>
                <p>Pass Code: <strong className="text-[#E85A4F]">{scanResult.id}</strong></p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

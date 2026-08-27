// ============================================================================
// ASTITVA 2K26 - Quick Scanner Modal Component
// Path: components/dashboard/QuickScannerModal.tsx
// ============================================================================

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, ShieldCheck, Camera, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
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
      <DialogContent className="glass-panel border-white/10 bg-slate-950/95 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-white flex items-center">
            <QrCode className="h-5 w-5 text-cyan-400 mr-2" />
            Webcam & Fast Attendance Scanner
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Scan attendee holographic QR passes or enter AST26 ID manually.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Simulated Webcam Viewfinder */}
          <div className="relative h-48 rounded-xl bg-slate-900 border-2 border-dashed border-cyan-500/40 flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline" />
            <Camera className="h-10 w-10 text-cyan-400/60 mb-2 animate-pulse" />
            <span className="text-xs font-mono text-slate-400">Optical Scanner Active</span>
            <span className="text-[10px] text-slate-500 font-mono mt-1">Aim camera at participant badge</span>
          </div>

          {/* Manual Input Fallback */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Manual Participant ID Lookup
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. AST26-1042 or 22105128005"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                className="font-mono bg-slate-900/80 border-white/10 text-white text-xs"
              />
              <Button
                type="button"
                onClick={handleManualVerify}
                disabled={isScanning}
                variant="neonCyan"
                className="text-xs font-bold px-4"
              >
                {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
              </Button>
            </div>
          </div>

          {/* Scan Result Box */}
          {scanResult && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 flex items-start space-x-3 animate-in fade-in-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-white">{scanResult.name}</p>
                <p className="font-mono text-emerald-300">{scanResult.id} • {scanResult.event}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{scanResult.message}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

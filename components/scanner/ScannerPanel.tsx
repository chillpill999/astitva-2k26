// ============================================================================
// ASTITVA 2K26 - Live Camera Scanner (html5-qrcode)
// Path: components/scanner/ScannerPanel.tsx
// ============================================================================

"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Camera, CameraOff, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type ScannerPanelProps = {
  onScan: (decodedText: string) => void | Promise<void>;
  paused?: boolean;
  className?: string;
};

const REGION_ID = "astitva-scanner-region";

export function ScannerPanel({ onScan, paused, className }: ScannerPanelProps) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastDecodedRef = useRef<{ text: string; at: number } | null>(null);
  const pausedRef = useRef<boolean>(false);

  useEffect(() => {
    pausedRef.current = !!paused;
  }, [paused]);

  useEffect(() => {
    return () => {
      stop().catch(() => undefined);
    };
  }, []);

  async function start() {
    if (typeof window === "undefined") return;
    if (active) return;
    setError(null);
    try {
      const instance = new Html5Qrcode(REGION_ID, {
        verbose: false,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.AZTEC,
        ],
      });
      scannerRef.current = instance;
      await instance.start(
        { facingMode: "environment" },
        {
          fps: 12,
          qrbox: (vw, vh) => {
            const minEdge = Math.min(vw, vh);
            return { width: Math.floor(minEdge * 0.7), height: Math.floor(minEdge * 0.7) };
          },
          aspectRatio: 1.4,
        },
        (decodedText) => {
          if (pausedRef.current) return;
          // Debounce identical scans within 1.2s
          const now = Date.now();
          if (
            lastDecodedRef.current &&
            lastDecodedRef.current.text === decodedText &&
            now - lastDecodedRef.current.at < 1200
          ) {
            return;
          }
          lastDecodedRef.current = { text: decodedText, at: now };
          void onScan(decodedText);
        },
        () => undefined
      );
      setActive(true);
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to access camera. Please grant permission or use manual entry."
      );
      setActive(false);
    }
  }

  async function stop() {
    if (!scannerRef.current) return;
    try {
      const state = scannerRef.current.getState();
      if (state === 2 /* RUNNING */) {
        await scannerRef.current.stop();
      }
      scannerRef.current.clear();
    } catch {
      // ignore stop errors
    }
    scannerRef.current = null;
    setActive(false);
  }

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-black shadow-[0_0_30px_rgba(6,182,212,0.25)]">
        <div id={REGION_ID} className="w-full h-72" />
        {!active && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-center px-6">
            <Camera className="h-10 w-10 text-cyan-400/80 mb-2" />
            <p className="text-sm font-semibold text-white">Optical Scanner Standby</p>
            <p className="text-xs text-slate-400 mt-1">
              Click <span className="text-cyan-300 font-bold">Start Camera</span> to begin live
              scanning.
            </p>
            {error && (
              <p className="mt-2 text-xs text-red-300 max-w-xs">{error}</p>
            )}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 border border-white/5 rounded-2xl" />
        <div className="pointer-events-none absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70 animate-scanline" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {active ? (
          <Button
            type="button"
            variant="outline"
            className="text-xs font-bold border-red-500/40 text-red-300 hover:bg-red-500/10"
            onClick={async () => {
              await stop();
              toast.message("Scanner paused");
            }}
          >
            <CameraOff className="h-4 w-4 mr-1.5" /> Stop Camera
          </Button>
        ) : (
          <Button
            type="button"
            variant="neonCyan"
            className="text-xs font-bold"
            onClick={start}
          >
            <Camera className="h-4 w-4 mr-1.5" /> Start Camera
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          className="text-xs text-slate-400"
          onClick={async () => {
            await stop();
            await start();
          }}
        >
          <RotateCw className="h-4 w-4 mr-1.5" /> Restart
        </Button>
        <p className="text-[10px] text-slate-500 font-mono ml-auto">
          {active ? "LIVE • 12 FPS" : "IDLE"}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// ASTITVA 2K26 - Live Camera Scanner (Exteta Luxury Aesthetic)
// Path: components/scanner/ScannerPanel.tsx
// ============================================================================

"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Camera, CameraOff, RotateCw } from "lucide-react";

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
      // ignore
    }
    scannerRef.current = null;
    setActive(false);
  }

  return (
    <div className={`space-y-4 ${className ?? ""}`}>
      <div className="relative overflow-hidden rounded-3xl border border-[#8E8D8A]/25 bg-[#EAE7DC] p-3 shadow-inner">
        <div
          id={REGION_ID}
          className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#1A1918]/90 flex items-center justify-center text-xs font-mono text-[#EAE7DC]"
        />

        {paused && active && (
          <div className="absolute inset-0 bg-[#EAE7DC]/80 backdrop-blur-sm flex items-center justify-center font-mono text-xs font-bold text-[#E85A4F]">
            <RotateCw className="h-5 w-5 animate-spin mr-2" />
            PROCESSING SCAN...
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs font-mono text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        {!active ? (
          <button
            type="button"
            onClick={start}
            className="w-full py-2.5 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Camera className="h-4 w-4" /> Start Camera
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            className="w-full py-2.5 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-mono font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all flex items-center justify-center gap-2"
          >
            <CameraOff className="h-4 w-4" /> Stop Camera
          </button>
        )}
      </div>
    </div>
  );
}

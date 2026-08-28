// ============================================================================
// ASTITVA 2K26 - Scan Outcome Badge (Exteta Luxury Aesthetic)
// Path: components/scanner/ScanOutcomeBadge.tsx
// ============================================================================

"use client";

import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldAlert, Hash } from "lucide-react";

type OutcomeCode =
  | "SUCCESS"
  | "ALREADY_CHECKED_IN"
  | "INVALID_TOKEN"
  | "NOT_REGISTERED"
  | "QR_EXPIRED"
  | "REVOKED"
  | "RATE_LIMITED"
  | "IDLE";

const META: Record<OutcomeCode, { label: string; color: string; icon: any; description: string }> = {
  IDLE: {
    label: "Ready",
    color: "border-[#8E8D8A]/25 bg-[#EAE7DC] text-[#1A1918]",
    icon: Hash,
    description: "Aim the camera or enter a participant ID to begin.",
  },
  SUCCESS: {
    label: "Check-in Recorded",
    color: "border-[#8E8D8A]/25 bg-[#EAE7DC] text-[#E85A4F]",
    icon: CheckCircle2,
    description: "Attendance has been logged successfully.",
  },
  ALREADY_CHECKED_IN: {
    label: "Already Checked In",
    color: "border-amber-300 bg-amber-50 text-amber-800",
    icon: AlertTriangle,
    description: "This participant has already been verified for this event.",
  },
  INVALID_TOKEN: {
    label: "Invalid Token",
    color: "border-red-300 bg-red-50 text-red-700",
    icon: XCircle,
    description: "QR code failed signature verification.",
  },
  NOT_REGISTERED: {
    label: "Not Registered",
    color: "border-red-300 bg-red-50 text-red-700",
    icon: ShieldAlert,
    description: "This participant is not registered for the selected event.",
  },
  QR_EXPIRED: {
    label: "QR Expired",
    color: "border-orange-300 bg-orange-50 text-orange-800",
    icon: Clock,
    description: "The pass is past its validity window.",
  },
  REVOKED: {
    label: "Pass Revoked",
    color: "border-red-300 bg-red-50 text-red-700",
    icon: ShieldAlert,
    description: "This pass has been revoked by an administrator.",
  },
  RATE_LIMITED: {
    label: "Slow Down",
    color: "border-yellow-300 bg-yellow-50 text-yellow-800",
    icon: Clock,
    description: "Too many scans in a short window. Please wait.",
  },
};

export function ScanOutcomeBadge({
  code,
  message,
}: {
  code: OutcomeCode;
  message?: string;
}) {
  const meta = META[code] ?? META.IDLE;
  const Icon = meta.icon;
  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 font-mono ${meta.color}`}>
      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div className="flex flex-col">
        <span className="text-xs font-bold uppercase tracking-wider">{meta.label}</span>
        <span className="text-[11px] opacity-80">{message ?? meta.description}</span>
      </div>
    </div>
  );
}

// ============================================================================
// ASTITVA 2K26 - Scan Outcome Badge
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
    color: "border-slate-500/30 bg-slate-900/60 text-slate-200",
    icon: Hash,
    description: "Aim the camera or enter a participant ID to begin.",
  },
  SUCCESS: {
    label: "Check-in Recorded",
    color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    icon: CheckCircle2,
    description: "Attendance has been logged successfully.",
  },
  ALREADY_CHECKED_IN: {
    label: "Already Checked In",
    color: "border-amber-500/40 bg-amber-500/10 text-amber-200",
    icon: AlertTriangle,
    description: "This participant has already been verified for this event.",
  },
  INVALID_TOKEN: {
    label: "Invalid Token",
    color: "border-red-500/40 bg-red-500/10 text-red-200",
    icon: XCircle,
    description: "QR code failed signature verification.",
  },
  NOT_REGISTERED: {
    label: "Not Registered",
    color: "border-red-500/40 bg-red-500/10 text-red-200",
    icon: ShieldAlert,
    description: "This participant is not registered for the selected event.",
  },
  QR_EXPIRED: {
    label: "QR Expired",
    color: "border-orange-500/40 bg-orange-500/10 text-orange-200",
    icon: Clock,
    description: "The pass is past its validity window.",
  },
  REVOKED: {
    label: "Pass Revoked",
    color: "border-rose-500/40 bg-rose-500/10 text-rose-200",
    icon: ShieldAlert,
    description: "This pass has been revoked by an administrator.",
  },
  RATE_LIMITED: {
    label: "Slow Down",
    color: "border-yellow-500/40 bg-yellow-500/10 text-yellow-200",
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
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${meta.color}`}>
      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div className="flex flex-col">
        <span className="text-sm font-bold uppercase tracking-wider">{meta.label}</span>
        <span className="text-xs text-slate-300/80">{message ?? meta.description}</span>
      </div>
    </div>
  );
}

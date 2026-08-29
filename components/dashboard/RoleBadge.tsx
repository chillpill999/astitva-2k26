// ============================================================================
// ASTITVA 2K26 - Role Badge Component (Exteta Warm Sand Palette)
// Path: components/dashboard/RoleBadge.tsx
// ============================================================================

import React from "react";
import { cn } from "@/lib/utils";
import { Role } from "@/lib/auth/types";

export type FestRole = Role;

interface RoleBadgeProps {
  role: FestRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const configs: Record<
    FestRole,
    { label: string; color: string; border: string; bg: string; dot: string }
  > = {
    ADMIN: {
      label: "ADMIN",
      color: "text-[#E85A4F]",
      border: "border-[#E85A4F]/40",
      bg: "bg-[#E85A4F]/10",
      dot: "bg-[#E85A4F]",
    },
    EVENT_COORDINATOR: {
      label: "COORDINATOR",
      color: "text-[#EAE7DC]",
      border: "border-[#1A1918]",
      bg: "bg-[#1A1918]",
      dot: "bg-[#E85A4F]",
    },
    VOLUNTEER: {
      label: "VOLUNTEER",
      color: "text-emerald-700",
      border: "border-emerald-600/30",
      bg: "bg-emerald-600/10",
      dot: "bg-emerald-600",
    },
    TEAM_CAPTAIN: {
      label: "CAPTAIN",
      color: "text-amber-800",
      border: "border-amber-600/30",
      bg: "bg-amber-600/10",
      dot: "bg-amber-600",
    },
    PARTICIPANT: {
      label: "PARTICIPANT",
      color: "text-[#1A1918]",
      border: "border-[#8E8D8A]/35",
      bg: "bg-[#EAE7DC]",
      dot: "bg-[#8E8D8A]",
    },
  };

  const c = configs[role] || configs.PARTICIPANT;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border shadow-sm",
        c.bg,
        c.color,
        c.border,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full status-dot", c.dot)} />
      {c.label}
    </span>
  );
}

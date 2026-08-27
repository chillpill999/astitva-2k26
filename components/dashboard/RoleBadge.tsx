// ============================================================================
// ASTITVA 2K26 - Role Badge Component
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
      color: "text-red-400",
      border: "border-red-500/30",
      bg: "bg-red-500/10",
      dot: "bg-red-500",
    },
    EVENT_COORDINATOR: {
      label: "COORDINATOR",
      color: "text-purple-400",
      border: "border-purple-500/30",
      bg: "bg-purple-500/10",
      dot: "bg-purple-500",
    },
    VOLUNTEER: {
      label: "VOLUNTEER",
      color: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      dot: "bg-emerald-500",
    },
    TEAM_CAPTAIN: {
      label: "CAPTAIN",
      color: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      dot: "bg-amber-500",
    },
    PARTICIPANT: {
      label: "PARTICIPANT",
      color: "text-cyan-400",
      border: "border-cyan-500/30",
      bg: "bg-cyan-500/10",
      dot: "bg-cyan-500",
    },
  };

  const c = configs[role] || configs.PARTICIPANT;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border shadow-sm",
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

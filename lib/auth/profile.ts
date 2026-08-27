// ============================================================================
// ASTITVA 2K26 - Authentication & Role Route Helpers
// Path: lib/auth/profile.ts
// ============================================================================

import { Role } from "./types";

export function formatParticipantId(num: number): string {
  return `AST26-${String(num).padStart(4, "0")}`;
}

export function getRoleDashboardUrl(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "EVENT_COORDINATOR":
      return "/dashboard/coordinator";
    case "VOLUNTEER":
      return "/dashboard/volunteer";
    case "TEAM_CAPTAIN":
      return "/dashboard/captain";
    case "PARTICIPANT":
    default:
      return "/dashboard/participant";
  }
}

export function canAccessRoute(role: Role, pathname: string): boolean {
  if (role === "ADMIN") return true;
  if (pathname.startsWith("/dashboard/admin")) return false;
  if (pathname.startsWith("/dashboard/coordinator")) {
    return role === "EVENT_COORDINATOR";
  }
  if (pathname.startsWith("/dashboard/volunteer")) {
    return role === "EVENT_COORDINATOR" || role === "VOLUNTEER";
  }
  if (pathname.startsWith("/dashboard/captain")) {
    return role === "TEAM_CAPTAIN";
  }
  if (pathname.startsWith("/dashboard/participant") || pathname.startsWith("/profile")) {
    return true;
  }
  return true;
}

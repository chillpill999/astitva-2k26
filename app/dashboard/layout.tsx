// ============================================================================
// ASTITVA 2K26 - Dashboard Unified Layout Shell
// Path: app/dashboard/layout.tsx
// ============================================================================

import React from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getCurrentUser } from "@/lib/auth/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <DashboardShell
      userRole={user?.role}
      userName={user?.name}
      userAvatar={user?.avatarUrl || undefined}
      participantId={user?.participantId || "AST26-0005"}
    >
      {children}
    </DashboardShell>
  );
}

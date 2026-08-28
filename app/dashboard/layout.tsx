// ============================================================================
// ASTITVA 2K26 - Dashboard Unified Layout Shell
// Path: app/dashboard/layout.tsx
// ============================================================================

import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { DevRoleSwitcher } from "@/components/dashboard/DevRoleSwitcher";
import { getCurrentUser } from "@/lib/auth/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[#EAE7DC] text-[#1A1918] flex overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar
        userRole={user?.role}
        userName={user?.name}
        userAvatar={user?.avatarUrl || undefined}
        participantId={user?.participantId || "AST26-0005"}
      />

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header
          role={user?.role}
          userName={user?.name}
        />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 pb-24">
          {children}
        </main>
      </div>

      {/* Floating 1-Click Dev Role Switcher */}
      <DevRoleSwitcher currentRole={user?.role} />
    </div>
  );
}

"use client";

// ============================================================================
// ASTITVA 2K26 - Dashboard Client Shell (Mobile Drawer State Manager)
// Path: components/dashboard/DashboardShell.tsx
// ============================================================================

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { DevRoleSwitcher } from "./DevRoleSwitcher";
import { FestRole } from "./RoleBadge";

interface DashboardShellProps {
  userRole?: FestRole;
  userName?: string;
  userAvatar?: string;
  participantId?: string;
  children: React.ReactNode;
}

export function DashboardShell({
  userRole,
  userName,
  userAvatar,
  participantId = "AST26-0005",
  children,
}: DashboardShellProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#EAE7DC] text-[#1A1918] flex overflow-x-hidden">
      {/* Sidebar with Mobile Drawer */}
      <Sidebar
        userRole={userRole}
        userName={userName}
        userAvatar={userAvatar}
        participantId={participantId}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto w-full min-w-0">
        <Header
          role={userRole}
          userName={userName}
          onMobileMenuToggle={() => setIsMobileOpen((prev) => !prev)}
        />
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8 pb-28">
          {children}
        </main>
      </div>

      {/* Floating 1-Click Dev Role Switcher */}
      <DevRoleSwitcher currentRole={userRole} />
    </div>
  );
}

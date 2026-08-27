// ============================================================================
// ASTITVA 2K26 - Dashboard Top App Bar & Header
// Path: components/dashboard/Header.tsx
// ============================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Menu, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoleBadge, FestRole } from "./RoleBadge";

interface HeaderProps {
  title?: string;
  role?: FestRole;
  userName?: string;
  onMobileMenuToggle?: () => void;
}

export function Header({
  title,
  role,
  userName = "Sneha Kumari",
  onMobileMenuToggle,
}: HeaderProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  // Derive role and title if not passed
  const activeRole: FestRole =
    role ||
    (pathname.includes("/admin")
      ? "ADMIN"
      : pathname.includes("/coordinator")
      ? "EVENT_COORDINATOR"
      : pathname.includes("/volunteer")
      ? "VOLUNTEER"
      : pathname.includes("/captain")
      ? "TEAM_CAPTAIN"
      : "PARTICIPANT");

  const getPageTitle = () => {
    if (title) return title;
    if (pathname.includes("/admin")) return "Executive Control Center";
    if (pathname.includes("/coordinator")) return "Coordinator Scoring Console";
    if (pathname.includes("/volunteer")) return "Scanner & Check-in Terminal";
    if (pathname.includes("/captain")) return "Squad Roster Headquarters";
    return "Participant Command Center";
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="md:hidden text-slate-300 hover:text-white cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-extrabold text-white tracking-tight">
              {getPageTitle()}
            </h1>
            <RoleBadge role={activeRole} />
          </div>
          <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
            LNJPIT Chapra • 4–8 September 2026
          </p>
        </div>
      </div>

      {/* Center: Quick Search Bar */}
      <div className="hidden md:flex items-center relative w-72 max-w-xs">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Quick search events, rules, IDs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#030712] border-white/10 pl-9 pr-10 py-1 text-xs text-slate-200 placeholder:text-slate-500 rounded-xl focus-visible:ring-cyan-500"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
          ⌘K
        </kbd>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <Link
          href="/announcements"
          className="relative p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer"
          title="Announcements & Notifications"
        >
          <Bell className="w-4 h-4" />
          {hasUnreadNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06B6D4]" />
          )}
        </Link>

        {/* User Quick Link */}
        <Link href="/profile">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/60 border border-white/5 hover:border-white/20 rounded-xl cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{userName}</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}

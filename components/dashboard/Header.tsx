"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, User, Sparkles } from "lucide-react";
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
    <header className="sticky top-0 z-30 w-full bg-[#EAE7DC]/90 backdrop-blur-xl border-b border-[#8E8D8A]/25 px-4 md:px-8 py-3.5 flex items-center justify-between text-[#1A1918]">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="lg:hidden w-8 h-8 rounded border border-[#8E8D8A]/35 flex items-center justify-center text-[#1A1918]"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-extrabold text-[#1A1918] tracking-tight">
              {getPageTitle()}
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F6F4EE] border border-[#8E8D8A]/25 text-[#E85A4F] uppercase">
              {activeRole}
            </span>
          </div>
          <p className="text-[10px] text-[#8E8D8A] font-mono hidden sm:block">
            LNJPIT Chapra • 4–8 September 2026
          </p>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center relative w-72 max-w-xs">
        <Search className="w-3.5 h-3.5 text-[#8E8D8A] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Quick search events, rules, IDs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#F6F4EE] border border-[#8E8D8A]/30 pl-9 pr-4 py-1.5 text-xs text-[#1A1918] placeholder:text-[#8E8D8A]/70 rounded-xl focus:outline-none focus:border-[#E85A4F] font-mono"
        />
      </div>

      {/* Right User Link */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 text-xs font-mono font-semibold text-[#1A1918] hover:text-[#E85A4F] transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-[#F6F4EE] border border-[#8E8D8A]/30 flex items-center justify-center text-[#E85A4F]">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline">{userName}</span>
        </Link>
      </div>
    </header>
  );
}

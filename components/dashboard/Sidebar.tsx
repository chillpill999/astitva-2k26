// ============================================================================
// ASTITVA 2K26 - Level 0 Responsive Dashboard Sidebar
// Path: components/dashboard/Sidebar.tsx
// ============================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Trophy,
  Users,
  QrCode,
  Award,
  Bell,
  Radio,
  Sparkles,
  Zap,
  BarChart3,
  LogOut,
  X,
  Flame,
} from "lucide-react";
import { RoleBadge, FestRole } from "./RoleBadge";
import { Button } from "@/components/ui/button";
import { QuickScannerModal } from "./QuickScannerModal";
import { toast } from "sonner";
import Image from "next/image";

interface SidebarProps {
  userRole?: FestRole;
  userName?: string;
  userAvatar?: string;
  participantId?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({
  userRole,
  userName = "Sneha Kumari",
  userAvatar,
  participantId = "AST26-0005",
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Derive role if not passed
  const activeRole: FestRole =
    userRole ||
    (pathname.includes("/admin")
      ? "ADMIN"
      : pathname.includes("/coordinator")
      ? "EVENT_COORDINATOR"
      : pathname.includes("/volunteer")
      ? "VOLUNTEER"
      : pathname.includes("/captain")
      ? "TEAM_CAPTAIN"
      : "PARTICIPANT");

  // Role-specific navigation items
  const getNavItems = () => {
    switch (activeRole) {
      case "ADMIN":
        return [
          { href: "/dashboard/admin", label: "Control Center", icon: LayoutDashboard },
          { href: "/events", label: "Event Management", icon: Calendar },
          { href: "/dashboard/admin#analytics", label: "Global Analytics", icon: BarChart3 },
          { href: "/announcements", label: "Broadcasts", icon: Bell },
          { href: "/sponsors", label: "Sponsors & Partners", icon: Zap },
          { href: "/team", label: "Committee Directory", icon: Users },
        ];
      case "EVENT_COORDINATOR":
        return [
          { href: "/dashboard/coordinator", label: "Coordinator Deck", icon: LayoutDashboard },
          { href: "/dashboard/coordinator#scoring", label: "Live Score Entry", icon: Trophy },
          { href: "/dashboard/coordinator#attendance", label: "Event Attendance", icon: Users },
          { href: "/results", label: "Published Results", icon: Award },
          { href: "/schedule", label: "Festival Timeline", icon: Calendar },
        ];
      case "VOLUNTEER":
        return [
          { href: "/dashboard/volunteer", label: "Scanner Terminal", icon: LayoutDashboard },
          { href: "/dashboard/volunteer#scanner", label: "Webcam Scanner", icon: QrCode },
          { href: "/dashboard/volunteer#logs", label: "Check-in Log Feed", icon: Radio },
          { href: "/schedule", label: "Venues & Shifts", icon: Calendar },
        ];
      case "TEAM_CAPTAIN":
        return [
          { href: "/dashboard/captain", label: "Squad Headquarters", icon: LayoutDashboard },
          { href: "/dashboard/captain#teams", label: "My Squads & Codes", icon: Users },
          { href: "/events", label: "Register Tournament", icon: Calendar },
          { href: "/leaderboard", label: "Live Standings", icon: Trophy },
        ];
      case "PARTICIPANT":
      default:
        return [
          { href: "/dashboard/participant", label: "Command Center", icon: LayoutDashboard },
          { href: "/events", label: "Browse 16 Events", icon: Calendar },
          { href: "/profile", label: "Digital Pass & ID", icon: QrCode },
          { href: "/leaderboard", label: "Branch Standings", icon: Trophy },
          { href: "/announcements", label: "Notice Board", icon: Bell },
        ];
    }
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/mock/logout", { method: "POST" });
      toast.success("Signed out successfully.");
      router.push("/sign-in");
      router.refresh();
    } catch {
      router.push("/sign-in");
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Brand Header */}
      <div className="px-2 mb-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-black text-sm tracking-wider text-white">
              ASTITVA <span className="text-cyan-400">2K26</span>
            </h1>
            <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block">
              Festival Ops Deck
            </span>
          </div>
        </Link>

        {isMobileOpen && (
          <button
            onClick={onMobileClose}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href.startsWith("/dashboard") && pathname === item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => onMobileClose?.()}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all group cursor-pointer ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold shadow-sm shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-400"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile & Footer Action */}
      <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-3">
        {/* User Card */}
        <Link
          href="/profile"
          onClick={() => onMobileClose?.()}
          className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/80 border border-white/5 hover:border-cyan-500/30 transition-all group cursor-pointer"
        >
          <div className="relative w-9 h-9 rounded-full bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center text-xs font-bold text-cyan-400 flex-shrink-0">
            {userAvatar ? (
              <Image src={userAvatar} alt={userName} fill className="object-cover" />
            ) : (
              userName.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-bold text-slate-200 truncate group-hover:text-cyan-300">
              {userName}
            </span>
            <span className="text-[10px] font-mono text-slate-400">{participantId}</span>
          </div>
          <RoleBadge role={activeRole} className="text-[9px] px-1 py-0" />
        </Link>

        {/* Action Button */}
        {activeRole === "VOLUNTEER" || activeRole === "ADMIN" || activeRole === "EVENT_COORDINATOR" ? (
          <Button
            onClick={() => setIsScannerOpen(true)}
            variant="outline"
            className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs font-mono uppercase tracking-wider py-2 flex items-center justify-center gap-2 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            Open Scanner
          </Button>
        ) : (
          <Link href="/profile" className="w-full">
            <Button
              variant="outline"
              className="w-full border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider py-2 flex items-center justify-center gap-2 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              My Digital Pass
            </Button>
          </Link>
        )}

        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="w-full text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </Button>
      </div>

      <QuickScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="w-64 h-screen fixed left-0 top-0 bg-[#030712] border-r border-white/10 hidden md:flex flex-col z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="relative w-64 max-w-[80vw] h-full bg-[#030712] border-r border-white/10 shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

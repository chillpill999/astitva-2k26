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
} from "lucide-react";
import { RoleBadge, FestRole } from "./RoleBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
          { href: "/dashboard/volunteer", label: "Live Check-in Console", icon: QrCode },
          { href: "/dashboard/volunteer#logs", label: "Check-in Log Feed", icon: Radio },
          { href: "/schedule", label: "Venues & Shifts", icon: Calendar },
        ];
      case "TEAM_CAPTAIN":
        return [
          { href: "/dashboard/captain", label: "Squad Headquarters", icon: LayoutDashboard },
          { href: "/dashboard/captain#teams", label: "My Squads & Codes", icon: Users },
          { href: "/events", label: "Register Tournament", icon: Calendar },
          { href: "/schedule", label: "Live Schedule", icon: Trophy },
        ];
      case "PARTICIPANT":
      default:
        return [
          { href: "/dashboard/participant", label: "Participant Hub", icon: LayoutDashboard },
          { href: "/events", label: "Browse Tournaments", icon: Calendar },
          { href: "/teams", label: "My Squads", icon: Users },
          { href: "/schedule", label: "Schedule Matrix", icon: Trophy },
          { href: "/gallery", label: "Gallery", icon: Award },
        ];
    }
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/mock/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-[#8E8D8A]/25 bg-[#F6F4EE] text-[#1A1918] p-5 h-screen sticky top-0 overflow-y-auto">
        <div className="space-y-6">
          {/* Brand Mark */}
          <Link href="/" className="flex flex-col group">
            <span className="font-mono text-base tracking-[0.35em] font-bold text-[#1A1918] group-hover:text-[#E85A4F] transition-colors uppercase">
              A S T I T V A
            </span>
            <span className="text-[8px] font-mono tracking-[0.2em] text-[#8E8D8A] uppercase mt-0.5">
              LNJPIT CHAPRA · 2026
            </span>
          </Link>

          {/* User Profile Snippet */}
          <div className="p-3.5 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#E85A4F] uppercase">
                {activeRole}
              </span>
              <span className="text-[9px] font-mono text-[#8E8D8A]">{participantId}</span>
            </div>
            <p className="text-xs font-bold text-[#1A1918] truncate">{userName}</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-mono transition-colors ${
                    isActive
                      ? "bg-[#E85A4F] text-white font-bold shadow-sm"
                      : "text-[#8E8D8A] hover:text-[#1A1918] hover:bg-[#EAE7DC]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-[#8E8D8A]/20 space-y-2">
          <Link
            href="/"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-mono text-[#8E8D8A] hover:text-[#1A1918] hover:bg-[#EAE7DC] transition-colors"
          >
            <span>← Back to Public Site</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-mono text-[#E85A4F] hover:bg-[#EAE7DC] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="relative w-64 max-w-[80vw] bg-[#F6F4EE] text-[#1A1918] p-5 flex flex-col justify-between h-full z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Link href="/" className="font-mono text-sm tracking-[0.3em] font-bold text-[#1A1918] uppercase">
                  ASTITVA 2K26
                </Link>
                <button
                  type="button"
                  onClick={onMobileClose}
                  className="text-[#8E8D8A] hover:text-[#1A1918]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onMobileClose}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-mono ${
                        isActive
                          ? "bg-[#E85A4F] text-white font-bold"
                          : "text-[#8E8D8A] hover:text-[#1A1918] hover:bg-[#EAE7DC]"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#8E8D8A]/20">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-mono text-[#E85A4F]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

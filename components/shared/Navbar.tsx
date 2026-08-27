"use client";

// ============================================================================
// ASTITVA 2K26 - Main Glassmorphic Navigation Header & Role Switcher Shortcut
// Path: components/shared/Navbar.tsx
// ============================================================================

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  Menu,
  X,
  Trophy,
  Calendar,
  Layers,
  Bell,
  Award,
  Users,
  ShieldCheck,
  Zap,
  Camera,
  HelpCircle,
  KeyRound,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV_LINKS = [
  { href: "/events", label: "Events", icon: Trophy },
  { href: "/teams", label: "Squads", icon: Users },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/leaderboard", label: "Leaderboard", icon: Layers },
  { href: "/results", label: "Results", icon: Award },
  { href: "/gallery", label: "Gallery", icon: Camera },
  { href: "/sponsors", label: "Sponsors", icon: Zap },
  { href: "/team", label: "Committee", icon: Users },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
];

const DEMO_ROLES = [
  { role: "ADMIN", name: "Dr. Shailendra Kumar (Admin)", route: "/dashboard/admin", badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40" },
  { role: "EVENT_COORDINATOR", name: "Prof. Rajesh Ranjan (Coord)", route: "/dashboard/coordinator", badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
  { role: "VOLUNTEER", name: "Ananya Sharma (Volunteer)", route: "/dashboard/volunteer", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  { role: "TEAM_CAPTAIN", name: "Aman Verma (Captain)", route: "/dashboard/captain", badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
  { role: "PARTICIPANT", name: "Sneha Kumari (Participant)", route: "/dashboard/participant", badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);

  const handleRoleSwitch = async (roleObj: typeof DEMO_ROLES[0]) => {
    setSwitchingRole(true);
    try {
      const res = await fetch("/api/auth/mock/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: roleObj.role }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Switched role to ${roleObj.role}`, {
          description: `Logged in as ${roleObj.name}`,
        });
        setRoleModalOpen(false);
        router.push(roleObj.route);
        router.refresh();
      }
    } catch {
      toast.error("Role switch failed");
    } finally {
      setSwitchingRole(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#030712]/85 backdrop-blur-xl transition-all">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-purple-600 to-amber-500 p-0.5 shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-wider text-white">
                  ASTITVA <span className="text-cyan-400">2K26</span>
                </span>
                <Badge variant="cyan" className="text-[10px] py-0 px-1.5 font-bold">
                  LNJPIT
                </Badge>
              </div>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase font-medium">
                4–8 Sept 2026
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all",
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/20"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right CTA Actions & 1-Click Role Switcher */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Quick 1-Click Role Switcher Modal Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRoleModalOpen(true)}
              className="text-xs font-mono font-bold border-amber-500/30 text-amber-300 bg-amber-950/20 hover:bg-amber-950/40 hover:border-amber-400"
            >
              <KeyRound className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
              Demo Roles
            </Button>

            <Link href="/verify-certificate/AST26-CERT-10492">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold border-white/10 hover:border-purple-500/50 hover:text-purple-400"
              >
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-purple-400" />
                Verify Cert
              </Button>
            </Link>

            <Link href="/sign-in">
              <Button
                variant="neonCyan"
                size="sm"
                className="text-xs font-bold px-3.5"
              >
                Sign In / Pass
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex xl:hidden items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRoleModalOpen(true)}
              className="sm:hidden text-[11px] font-mono border-amber-500/30 text-amber-300 py-1 px-2"
            >
              Roles
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-b border-white/10 bg-slate-950/95 px-4 pt-2 pb-6 backdrop-blur-2xl animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all",
                      isActive
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                        : "text-slate-300 hover:text-white hover:bg-slate-900"
                    )}
                  >
                    <Icon className="h-4.5 w-4.5 text-cyan-400" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <div className="pt-4 flex flex-col space-y-2 border-t border-white/10">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setRoleModalOpen(true);
                  }}
                  className="w-full justify-center text-xs font-mono font-bold border-amber-500/40 text-amber-300"
                >
                  <KeyRound className="mr-2 h-4 w-4 text-amber-400" />
                  1-Click Role Switcher (5 Roles)
                </Button>
                <Link
                  href="/verify-certificate/AST26-CERT-10492"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-center text-xs font-semibold border-white/15"
                  >
                    <ShieldCheck className="mr-2 h-4 w-4 text-purple-400" />
                    Verify Certificate
                  </Button>
                </Link>
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="neonCyan" className="w-full justify-center text-xs font-bold">
                    Sign In / Participant Pass
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 1-Click Role Switcher Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#0d1224] border border-amber-500/30 p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <KeyRound className="h-5 w-5 text-amber-400" />
                <h3 className="text-lg font-black text-white">1-Click RBAC Role Switcher</h3>
              </div>
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select any canonical demo profile to instantly log in and access its dedicated dashboard console:
            </p>

            <div className="space-y-2">
              {DEMO_ROLES.map((r) => (
                <button
                  key={r.role}
                  type="button"
                  disabled={switchingRole}
                  onClick={() => handleRoleSwitch(r)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 hover:bg-cyan-950/30 transition-all text-left cursor-pointer group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                      {r.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Route: {r.route}
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${r.badgeColor}`}>
                    {r.role}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRoleModalOpen(false)}
                className="text-xs border-white/20"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

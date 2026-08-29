"use client";

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
  Award,
  Users,
  Grid,
  Zap,
  Camera,
  HelpCircle,
  FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth, UserButton } from "@clerk/nextjs";

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

const DEV_ROLES = [
  { role: "ADMIN", label: "Development Account · Admin", route: "/dashboard/admin" },
  { role: "EVENT_COORDINATOR", label: "Development Account · Coordinator", route: "/dashboard/coordinator" },
  { role: "VOLUNTEER", label: "Development Account · Volunteer", route: "/dashboard/volunteer" },
  { role: "TEAM_CAPTAIN", label: "Development Account · Captain", route: "/dashboard/captain" },
  { role: "PARTICIPANT", label: "Development Account · Participant", route: "/dashboard/participant" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);

  let isSignedIn = false;
  try {
    const authState = useAuth();
    isSignedIn = Boolean(authState?.isSignedIn);
  } catch {
    isSignedIn = false;
  }

  const isDev = process.env.NODE_ENV !== "production";

  const handleRoleSwitch = async (roleObj: typeof DEV_ROLES[number]) => {
    setSwitchingRole(true);
    try {
      const res = await fetch("/api/auth/mock/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: roleObj.role }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Switched role to ${roleObj.role}`);
        setRoleModalOpen(false);
        router.push(roleObj.route);
        router.refresh();
      } else {
        toast.error(data.error ?? "Role switch failed");
      }
    } catch {
      toast.error("Role switch failed");
    } finally {
      setSwitchingRole(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#8E8D8A]/25 bg-[#EAE7DC]/90 backdrop-blur-xl transition-all text-[#1A1918]">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center space-x-2">
            <Link
              href="/events"
              className={`px-3 py-1 rounded text-xs font-mono font-medium tracking-wider uppercase border transition-colors ${
                pathname.startsWith("/events")
                  ? "bg-[#1A1918] text-[#EAE7DC] border-[#1A1918]"
                  : "border-[#8E8D8A]/35 text-[#1A1918] hover:bg-[#F6F4EE]"
              }`}
            >
              EVENTS
            </Link>
            <Link
              href="/schedule"
              className={`px-3 py-1 rounded text-xs font-mono font-medium tracking-wider uppercase border transition-colors ${
                pathname.startsWith("/schedule")
                  ? "bg-[#1A1918] text-[#EAE7DC] border-[#1A1918]"
                  : "border-[#8E8D8A]/35 text-[#1A1918] hover:bg-[#F6F4EE]"
              }`}
            >
              SCHEDULE
            </Link>
            <Link
              href="/teams"
              className={`px-3 py-1 rounded text-xs font-mono font-medium tracking-wider uppercase border transition-colors ${
                pathname.startsWith("/teams")
                  ? "bg-[#1A1918] text-[#EAE7DC] border-[#1A1918]"
                  : "border-[#8E8D8A]/35 text-[#1A1918] hover:bg-[#F6F4EE]"
              }`}
            >
              SQUADS
            </Link>
            <Link
              href="/results"
              className={`px-3 py-1 rounded text-xs font-mono font-medium tracking-wider uppercase border transition-colors ${
                pathname.startsWith("/results")
                  ? "bg-[#1A1918] text-[#EAE7DC] border-[#1A1918]"
                  : "border-[#8E8D8A]/35 text-[#1A1918] hover:bg-[#F6F4EE]"
              }`}
            >
              RESULTS
            </Link>
            <Link
              href="/leaderboard"
              className={`px-3 py-1 rounded text-xs font-mono font-medium tracking-wider uppercase border transition-colors ${
                pathname.startsWith("/leaderboard")
                  ? "bg-[#1A1918] text-[#EAE7DC] border-[#1A1918]"
                  : "border-[#8E8D8A]/35 text-[#1A1918] hover:bg-[#F6F4EE]"
              }`}
            >
              LEADERBOARD
            </Link>
            <Link
              href="/verify-certificate"
              className={`px-3 py-1 rounded text-xs font-mono font-medium tracking-wider uppercase border transition-colors ${
                pathname.startsWith("/verify-certificate")
                  ? "bg-[#1A1918] text-[#EAE7DC] border-[#1A1918]"
                  : "border-[#8E8D8A]/35 text-[#1A1918] hover:bg-[#F6F4EE]"
              }`}
            >
              CERTIFICATES
            </Link>
          </div>

          <div className="flex flex-col items-center text-center">
            <Link href="/" className="group">
              <span className="font-mono text-sm sm:text-base tracking-[0.35em] sm:tracking-[0.45em] font-bold text-[#1A1918] group-hover:text-[#E85A4F] transition-colors uppercase">
                A S T I T V A
              </span>
              <span className="block text-[8px] sm:text-[9px] font-mono tracking-[0.25em] text-[#8E8D8A] uppercase mt-0.5">
                LNJPIT CHAPRA · SEPT 4–8, 2026
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {isDev && (
              <button
                type="button"
                onClick={() => setRoleModalOpen(true)}
                className="px-2.5 py-1 rounded text-xs font-mono font-semibold border border-amber-500/40 text-amber-700 bg-amber-50 hover:bg-amber-500 hover:text-white transition-colors"
                title="Dev role switcher (development only)"
              >
                <FlaskConical className="inline h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">DEV</span>
              </button>
            )}

            <Link
              href="/dashboard"
              className="w-8 h-8 rounded border border-[#8E8D8A]/35 flex items-center justify-center text-[#8E8D8A] hover:text-[#1A1918] hover:border-[#1A1918] transition-colors"
              title="Dashboard"
            >
              <Grid className="w-4 h-4" />
            </Link>

            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 rounded-full border border-[#8E8D8A]/35",
                  },
                }}
              />
            ) : (
              <Link
                href="/sign-in"
                className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded text-xs font-mono font-bold tracking-wider uppercase bg-[#E85A4F] text-white hover:bg-[#C94A40] transition-colors shadow-sm"
              >
                SIGN IN
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded border border-[#8E8D8A]/35 flex items-center justify-center text-[#1A1918]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#8E8D8A]/20 bg-[#F6F4EE] px-4 py-6 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded text-xs font-mono uppercase border border-[#8E8D8A]/25 text-[#1A1918] bg-[#EAE7DC]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-3 border-t border-[#8E8D8A]/20">
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 rounded text-xs font-mono font-bold uppercase bg-[#E85A4F] text-white"
              >
                SIGN IN
              </Link>
            </div>
          </div>
        )}
      </header>

      {roleModalOpen && isDev && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-[#F6F4EE] border border-amber-500/30 p-6 shadow-2xl space-y-5 text-[#1A1918]">
            <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-3">
              <div>
                <h3 className="text-base font-bold font-mono uppercase tracking-wider text-[#1A1918] flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-amber-600" /> Development Role Switcher
                </h3>
                <p className="text-xs text-[#8E8D8A]">
                  Switch between development fixtures. These are not real users.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="text-[#8E8D8A] hover:text-[#1A1918]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {DEV_ROLES.map((r) => (
                <button
                  key={r.role}
                  disabled={switchingRole}
                  type="button"
                  onClick={() => handleRoleSwitch(r)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-[#8E8D8A]/25 bg-[#EAE7DC] hover:border-[#E85A4F] hover:bg-[#F6F4EE] transition-all text-left cursor-pointer group"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
                      {r.role}
                    </span>
                    <p className="text-xs font-semibold text-[#1A1918] mt-1 group-hover:text-[#E85A4F]">
                      {r.label}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#E85A4F] group-hover:translate-x-1 transition-transform">
                    ENTER →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

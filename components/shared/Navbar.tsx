"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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
} from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";
import { Shield } from "lucide-react";

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

const ADMIN_EMAILS = [
  "aryanrockstar2007@gmail.com",
  "technogamerzthenextlevel@gmail.com",
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();

  let isAdmin = false;
  if (isSignedIn && user) {
    const emails = [
      user.primaryEmailAddress?.emailAddress,
      ...(user.emailAddresses?.map((e) => e.emailAddress) || []),
    ]
      .filter(Boolean)
      .map((e) => e!.toLowerCase().trim());

    isAdmin = emails.some((e) => ADMIN_EMAILS.includes(e));
  }

  return (
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
          {isAdmin && (
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-[#1A1918] text-[#EAE7DC] border border-[#1A1918] hover:bg-[#E85A4F] hover:border-[#E85A4F] hover:text-white transition-all shadow-sm"
              title="Admin Control Center"
            >
              <Shield className="w-3.5 h-3.5 text-[#E85A4F]" />
              <span className="hidden sm:inline">ADMIN PANEL</span>
              <span className="sm:hidden">ADMIN</span>
            </Link>
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
              href="/sign-up"
              className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded text-xs font-mono font-bold tracking-wider uppercase bg-[#E85A4F] text-white hover:bg-[#C94A40] transition-colors shadow-sm"
            >
              SIGN UP
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
          {isAdmin && (
            <div className="pb-2">
              <Link
                href="/dashboard/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full text-center py-2.5 rounded-xl text-xs font-mono font-bold uppercase bg-[#1A1918] text-[#EAE7DC] border border-[#1A1918]"
              >
                <Shield className="w-4 h-4 text-[#E85A4F]" />
                <span>ADMIN CONTROL CENTER</span>
              </Link>
            </div>
          )}

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
              href="/sign-up"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 rounded text-xs font-mono font-bold uppercase bg-[#E85A4F] text-white"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

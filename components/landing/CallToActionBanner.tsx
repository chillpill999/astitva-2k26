"use client";

// ============================================================================
// ASTITVA 2K26 - Registration Call to Action Banner
// Path: components/landing/CallToActionBanner.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Trophy, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CallToActionBanner() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 relative bg-[#030712] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-gradient-to-r from-blue-600/15 via-purple-600/15 to-cyan-500/15 blur-3xl pointer-events-none" />

      <div className="container max-w-5xl mx-auto relative z-10">
        <div className="relative p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-[#0d1224]/95 via-[#10172e]/95 to-[#080d1a]/95 border border-white/15 shadow-2xl backdrop-blur-2xl text-center space-y-8">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/40 bg-cyan-950/50 px-4 py-1.5 backdrop-blur-md shadow-lg shadow-cyan-500/10">
            <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-cyan-300">
              REGISTRATIONS OPEN FOR ALL 5 BRANCHES
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase">
              CLAIM YOUR GLORY AT <span className="cyber-gradient-text">ASTITVA 2K26</span>
            </h2>
            <p className="text-sm sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Join over 2,500+ participants across 16 championships. Form your branch squad, obtain your digital QR attendee pass, and compete for ₹1.5L+ in cash prizes and trophies.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/sign-in">
              <Button variant="neonCyan" size="lg" className="h-13 px-8 text-base font-bold shadow-xl">
                <QrCode className="mr-2 h-5 w-5" />
                Get Participant QR Pass
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" size="lg" className="h-13 px-8 text-base font-semibold border-white/20 hover:border-cyan-400">
                Explore 16 Tournaments <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Guarantee Badges */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
            <span className="flex items-center">
              <ShieldCheck className="mr-1.5 h-4 w-4 text-emerald-400" />
              100% Free Entry for LNJPIT
            </span>
            <span className="flex items-center">
              <Trophy className="mr-1.5 h-4 w-4 text-amber-400" />
              ₹1,50,000+ Verified Pool
            </span>
            <span className="flex items-center">
              <Sparkles className="mr-1.5 h-4 w-4 text-purple-400" />
              HMAC Signed Certificates
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

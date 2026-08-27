"use client";

// ============================================================================
// ASTITVA 2K26 - LNJPIT Heritage & Festival Vision Section
// Path: components/landing/AboutFestSection.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Award,
  ShieldCheck,
  Zap,
  MapPin,
  Calendar,
  Building2,
  Users2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AboutFestSection() {
  const pillars = [
    {
      title: "Premier Technical Institute",
      description: "Established under the Department of Science, Technology & Technical Education (Govt. of Bihar), LNJPIT Chapra fosters engineering rigor and leadership.",
      icon: Building2,
      badge: "Govt. of Bihar",
      color: "text-cyan-400",
    },
    {
      title: "5-Day Inter-Branch Clash",
      description: "Students from CSE, Mechanical, Civil, Electrical, and Electronics branches compete across 16 championships for the prestigious General Championship Trophy.",
      icon: Users2,
      badge: "5 Branches",
      color: "text-purple-400",
    },
    {
      title: "Digital-First Smart Festival",
      description: "Features encrypted QR entry passes, contactless camera scanners, live streaming scoreboards, and HMAC-SHA256 cryptographically verifiable certificates.",
      icon: ShieldCheck,
      badge: "NextGen Tech",
      color: "text-emerald-400",
    },
  ];

  return (
    <section className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#05070f]">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container max-w-7xl mx-auto space-y-16">
        {/* Header Title */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="px-3.5 py-1 text-xs font-mono font-semibold border-cyan-500/30 text-cyan-400 bg-cyan-950/30">
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
            THE LNJPIT LEGACY
          </Badge>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
            ABOUT <span className="cyber-gradient-text">ASTITVA 2K26</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            ASTITVA is the flagship annual celebration of Lok Nayak Jai Prakash Institute of Technology (LNJPIT), Chapra. Over 5 electrifying days from 4 to 8 September 2026, the campus transforms into a battlefield of sporting stamina, cultural brilliance, esports firepower, and literary intellect.
          </p>
        </div>

        {/* 3-Column Pillar Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#0d1224]/80 border border-white/10 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                      <Icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <Badge variant="outline" className="text-[11px] font-mono border-white/15 text-slate-300">
                      {item.badge}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-wide">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 mt-6 flex items-center text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <span>Learn more in fest guide</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Heritage Quote Banner */}
        <div className="relative p-6 sm:p-10 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-slate-900/50 border border-white/15 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-white">
              &quot;Where Passion Meets Engineering Discipline&quot;
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Organized under the patronage of Principal Dr. Shailendra Kumar and Faculty Convener Prof. Rajesh Ranjan, ASTITVA unites 2,500+ future engineers in the spirit of fair play, innovation, and unity.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link href="/team">
              <Button variant="outline" className="text-xs font-semibold border-white/20 hover:border-cyan-400">
                View Committee
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="neonCyan" className="text-xs font-bold">
                Join Tournaments
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

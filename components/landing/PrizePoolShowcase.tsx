"use client";

// ============================================================================
// ASTITVA 2K26 - ₹1.5L+ Prize Pool Showcase & Trophy Matrix
// Path: components/landing/PrizePoolShowcase.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import {
  Trophy,
  Coins,
  Medal,
  Award,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PrizePoolShowcase() {
  const streamPools = [
    {
      category: "Sports Championship",
      amount: "₹75,000+",
      tournaments: "Cricket, Football, Volleyball, Badminton, Chess",
      color: "text-amber-400",
      border: "hover:border-amber-500/40",
      accentBg: "bg-amber-500/10",
      icon: Trophy,
    },
    {
      category: "Cultural & Arts",
      amount: "₹72,000+",
      tournaments: "Nrityangana Dance, Ramp Walk, Voice, Stand-up",
      color: "text-purple-400",
      border: "hover:border-purple-500/40",
      accentBg: "bg-purple-500/10",
      icon: Medal,
    },
    {
      category: "Esports & LAN Warfare",
      amount: "₹53,000+",
      tournaments: "BGMI Mobile, Valorant LAN, Free Fire Clash",
      color: "text-cyan-400",
      border: "hover:border-cyan-500/40",
      accentBg: "bg-cyan-500/10",
      icon: Zap,
    },
    {
      category: "Literary & Brainiacs",
      amount: "₹36,000+",
      tournaments: "Parliamentary Debate, Tech Quiz, Poetry, Writing",
      color: "text-emerald-400",
      border: "hover:border-emerald-500/40",
      accentBg: "bg-emerald-500/10",
      icon: Award,
    },
  ];

  const rewardPerks = [
    { title: "Direct Cash Purses", detail: "Bank direct transfer & instant mementos", icon: Coins },
    { title: "Rolling Champions Trophies", detail: "Inter-Branch General Championship Shield", icon: Trophy },
    { title: "Gold, Silver & Bronze Medals", detail: "Cast metallic podium medals for all 16 tournaments", icon: Medal },
    { title: "HMAC Signed Certificates", detail: "Tamper-proof verifiable digital credentials", icon: ShieldCheck },
  ];

  return (
    <section className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#05070f] border-b border-white/10 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="container max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Main Banner Hero */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          <Badge variant="outline" className="px-3.5 py-1 text-xs font-mono font-semibold border-amber-500/30 text-amber-400 bg-amber-950/30">
            <Coins className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
            GRAND FESTIVAL REWARDS
          </Badge>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase">
            ₹1,50,000+ <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent">PRIZE POOL</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            LNJPIT Chapra and Title Sponsor BELTRON bring the largest prize bounty in Saran district collegiate history. Compete for cash awards, coveted rolling trophies, and verified excellence certificates.
          </p>
        </div>

        {/* 4 Category Stream Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {streamPools.map((stream, idx) => {
            const Icon = stream.icon;
            return (
              <div
                key={idx}
                className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#0d1224]/90 border border-white/10 shadow-xl backdrop-blur-xl transition-all duration-300 ${stream.border} hover:-translate-y-1`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stream.accentBg} border border-white/10 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-5 w-5 ${stream.color}`} />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                      Stream {idx + 1}
                    </span>
                  </div>

                  <div>
                    <span className={`font-mono text-2xl sm:text-3xl font-black tracking-tight ${stream.color}`}>
                      {stream.amount}
                    </span>
                    <h3 className="text-base font-bold text-white tracking-wide mt-1">
                      {stream.category}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {stream.tournaments}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Guaranteed Purse</span>
                  <span className={stream.color}>Verified</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reward Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-2xl bg-[#0d1224]/60 border border-white/10 backdrop-blur-xl">
          {rewardPerks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div key={idx} className="flex items-start space-x-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-cyan-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {perk.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

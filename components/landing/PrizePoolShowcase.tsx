"use client";

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
      icon: Trophy,
      number: "01",
    },
    {
      category: "Cultural & Arts",
      amount: "₹72,000+",
      tournaments: "Nrityangana Dance, Ramp Walk, Voice, Stand-up",
      icon: Medal,
      number: "02",
    },
    {
      category: "Esports & Gaming",
      amount: "₹53,000+",
      tournaments: "BGMI Mobile, Free Fire Clash",
      icon: Zap,
      number: "03",
    },
    {
      category: "Literary Arena",
      amount: "₹36,000+",
      tournaments: "Parliamentary Debate, Tech Quiz, Poetry, Writing",
      icon: Award,
      number: "04",
    },
  ];

  const rewardPerks = [
    { title: "Direct Cash Purses", detail: "Direct bank transfer & podium trophies", icon: Coins },
    { title: "Champions Shield", detail: "Inter-Branch General Championship Trophy", icon: Trophy },
    { title: "Cast Metallic Medals", detail: "Podium medals for all 16 tournaments", icon: Medal },
    { title: "Signed Credentials", detail: "Tamper-proof HMAC verifiable certificates", icon: ShieldCheck },
  ];

  return (
    <section id="prizes" className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#EAE7DC] text-[#1A1918] border-b border-[#8E8D8A]/20">
      <div className="container max-w-7xl mx-auto space-y-16">
        {/* Main Banner Hero */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
            <Coins className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
            <span>FESTIVAL BOUNTY &amp; REWARDS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
            ₹10,00,000+ <span className="text-[#E85A4F]">PRIZE POOL</span>
          </h2>

          <p className="text-base sm:text-lg text-[#8E8D8A] max-w-2xl leading-relaxed">
            LNJPIT Chapra and state partners bring the grandest prize pool in university history. Compete for cash awards, coveted rolling trophies, and verified excellence credentials.
          </p>
        </div>

        {/* 4 Category Stream Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {streamPools.map((stream, idx) => {
            const Icon = stream.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm hover:border-[#E85A4F] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-bold text-[#D8C3A5] group-hover:text-[#E85A4F] transition-colors">
                      {stream.number}
                    </span>
                    <div className="w-9 h-9 rounded border border-[#8E8D8A]/20 bg-[#EAE7DC] flex items-center justify-center text-[#E85A4F]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#1A1918] tracking-tight uppercase">
                      {stream.category}
                    </h3>
                    <div className="text-2xl font-black text-[#E85A4F] font-mono mt-1">
                      {stream.amount}
                    </div>
                  </div>

                  <p className="text-xs text-[#8E8D8A] leading-relaxed">
                    {stream.tournaments}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#8E8D8A]/15 mt-4 flex items-center justify-between text-xs font-mono font-medium text-[#8E8D8A] group-hover:text-[#1A1918]">
                  <span>REWARDS DETAILS</span>
                  <ArrowRight className="w-3 h-3 text-[#E85A4F]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Perks Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25">
          {rewardPerks.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded border border-[#8E8D8A]/30 bg-[#EAE7DC] flex items-center justify-center text-[#E85A4F] shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1A1918] uppercase tracking-wide">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-[#8E8D8A] mt-0.5 leading-snug">
                    {p.detail}
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

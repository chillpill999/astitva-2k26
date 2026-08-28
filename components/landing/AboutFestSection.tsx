"use client";

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
      number: "01",
    },
    {
      title: "5-Day Inter-Branch Clash",
      description: "Students from CSE, Mechanical, Civil, Electrical, and Electronics branches compete across 16 championships for the prestigious General Championship Trophy.",
      icon: Users2,
      badge: "5 Branches",
      number: "02",
    },
    {
      title: "Digital-First Smart Festival",
      description: "Features encrypted QR entry passes, contactless camera scanners, live streaming scoreboards, and HMAC-SHA256 cryptographically verifiable certificates.",
      icon: ShieldCheck,
      badge: "NextGen Tech",
      number: "03",
    },
  ];

  return (
    <section id="about" className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#EAE7DC] text-[#1A1918]">
      <div className="container max-w-7xl mx-auto space-y-16">
        {/* Header Title with Editorial Styling */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
            <Sparkles className="h-3 w-3 text-[#E85A4F]" />
            <span>THE LNJPIT HERITAGE · 2026</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
            ABOUT <span className="text-[#E85A4F]">ASTITVA 2K26</span>
          </h2>

          <p className="text-base sm:text-lg text-[#8E8D8A] leading-relaxed max-w-2xl">
            ASTITVA is the flagship annual festival of Lok Nayak Jai Prakash Institute of Technology (LNJPIT), Chapra. Over 5 electrifying days from 4 to 8 September 2026, the campus transforms into a grand arena of sporting stamina, cultural brilliance, esports firepower, and literary intellect.
          </p>
        </div>

        {/* 3-Column Pillar Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between p-8 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm hover:border-[#E85A4F]/60 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-[#D8C3A5] group-hover:text-[#E85A4F] transition-colors">
                      {item.number}
                    </span>
                    <span className="text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded border border-[#8E8D8A]/30 text-[#8E8D8A] uppercase">
                      {item.badge}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded border border-[#8E8D8A]/20 flex items-center justify-center text-[#E85A4F] bg-[#EAE7DC]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-bold text-[#1A1918] tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#8E8D8A] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#8E8D8A]/15 mt-6 flex items-center text-xs font-mono font-semibold text-[#E85A4F] group-hover:text-[#C94A40]">
                  <span>DISCOVER INITIATIVE</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bento Stats Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#E85A4F] font-mono">1000+</div>
            <div className="text-xs font-mono tracking-wider text-[#8E8D8A] uppercase">STUDENT PARTICIPANTS</div>
          </div>
          <div className="p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#1A1918] font-mono">16+</div>
            <div className="text-xs font-mono tracking-wider text-[#8E8D8A] uppercase">CHAMPIONSHIPS</div>
          </div>
          <div className="p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#1A1918] font-mono">5</div>
            <div className="text-xs font-mono tracking-wider text-[#8E8D8A] uppercase">DAYS OF GLORY</div>
          </div>
          <div className="p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#E85A4F] font-mono">₹10L+</div>
            <div className="text-xs font-mono tracking-wider text-[#8E8D8A] uppercase">PRIZE POOL &amp; MEDALS</div>
          </div>
        </div>
      </div>
    </section>
  );
}

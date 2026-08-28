"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  MapPin,
  Calendar,
  Building2,
  Users2,
  ArrowRight,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AboutFestProps {
  totalEvents: number;
  totalCategories: number;
  totalDays: number;
  totalParticipants: number;
  totalPrizePool?: number;
}

export function AboutFestSection({
  totalEvents,
  totalCategories,
  totalDays,
  totalParticipants,
}: AboutFestProps) {
  return (
    <section id="about" className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#EAE7DC] text-[#1A1918]">
      <div className="container max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
            <Sparkles className="h-3 w-3 text-[#E85A4F]" />
            <span>About the Fest</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
            About <span className="text-[#E85A4F]">ASTITVA 2K26</span>
          </h2>

          <p className="text-base sm:text-lg text-[#8E8D8A] leading-relaxed max-w-2xl">
            ASTITVA is the annual fest of Lok Nayak Jai Prakash Institute of Technology, Chapra. From
            4 to 8 September 2026, students from the five engineering branches meet for five days of
            sport, culture, gaming, and literature.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="group relative flex flex-col justify-between p-8 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-[#D8C3A5]">01</span>
                <span className="text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded border border-[#8E8D8A]/30 text-[#8E8D8A] uppercase">
                  About the Institute
                </span>
              </div>
              <div className="w-10 h-10 rounded border border-[#8E8D8A]/20 flex items-center justify-center text-[#E85A4F] bg-[#EAE7DC]">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1918] tracking-tight">Lok Nayak Jai Prakash Institute of Technology</h3>
              <p className="text-sm text-[#8E8D8A] leading-relaxed">
                A government engineering college in Chapra, Bihar, offering undergraduate programmes
                in Computer Science, Mechanical, Civil, Electrical, and Electronics Engineering.
              </p>
            </div>
          </div>

          <div className="group relative flex flex-col justify-between p-8 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-[#D8C3A5]">02</span>
                <span className="text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded border border-[#8E8D8A]/30 text-[#8E8D8A] uppercase">
                  5-Day Programme
                </span>
              </div>
              <div className="w-10 h-10 rounded border border-[#8E8D8A]/20 flex items-center justify-center text-[#E85A4F] bg-[#EAE7DC]">
                <Users2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1918] tracking-tight">Five days, four streams</h3>
              <p className="text-sm text-[#8E8D8A] leading-relaxed">
                Competitions in Sports, Cultural, Gaming, and Literary categories. The full schedule
                and event catalog will be published by the organizing committee.
              </p>
            </div>
          </div>

          <div className="group relative flex flex-col justify-between p-8 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-[#D8C3A5]">03</span>
                <span className="text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded border border-[#8E8D8A]/30 text-[#8E8D8A] uppercase">
                  Online Operations
                </span>
              </div>
              <div className="w-10 h-10 rounded border border-[#8E8D8A]/20 flex items-center justify-center text-[#E85A4F] bg-[#EAE7DC]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1918] tracking-tight">Online registration &amp; attendance</h3>
              <p className="text-sm text-[#8E8D8A] leading-relaxed">
                Sign in to register for events, form teams, generate your QR attendance pass, and
                download verifiable certificates after the fest.
              </p>
            </div>
          </div>
        </div>

        {/* Real-data bento stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
          <Stat
            value={totalEvents > 0 ? totalEvents.toString() : "16+"}
            label="EVENTS & TOURNAMENTS"
          />
          <Stat
            value={totalCategories > 0 ? totalCategories.toString() : "4"}
            label="CATEGORIES"
          />
          <Stat
            value={totalDays > 0 ? `${totalDays}` : "5"}
            label="FESTIVAL DAYS"
          />
          <Stat
            value="100%"
            label="VERIFIED CERTIFICATES"
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 text-center space-y-1">
      <div className="text-3xl sm:text-4xl font-extrabold text-[#1A1918] font-mono">{value}</div>
      <div className="text-xs font-mono tracking-wider text-[#8E8D8A] uppercase">{label}</div>
    </div>
  );
}

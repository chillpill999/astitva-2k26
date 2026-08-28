"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Trophy, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CallToActionBanner() {
  return (
    <section id="register" className="w-full py-20 px-4 sm:px-6 lg:px-8 relative bg-[#EAE7DC]">
      <div className="container max-w-5xl mx-auto relative z-10">
        <div className="relative p-8 sm:p-12 lg:p-16 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-md text-center space-y-8">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#EAE7DC] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
            <Sparkles className="h-3 w-3 text-[#E85A4F]" />
            <span className="font-bold text-[#E85A4F]">
              REGISTRATIONS OPEN FOR ALL 5 BRANCHES
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              CLAIM YOUR GLORY AT <span className="text-[#E85A4F]">ASTITVA 2K26</span>
            </h2>
            <p className="text-sm sm:text-lg text-[#8E8D8A] leading-relaxed max-w-2xl mx-auto">
              Join over 1,000+ participants across 16 championships. Form your branch squad, obtain your digital QR attendee pass, and compete for ₹10L+ in cash prizes and trophies.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/sign-in"
              className="flex items-center justify-center h-12 px-8 rounded text-sm font-mono font-bold tracking-wider uppercase bg-[#E85A4F] text-white hover:bg-[#C94A40] transition-colors shadow-sm"
            >
              <QrCode className="mr-2 h-4 w-4" />
              GET PARTICIPANT QR PASS
            </Link>
            <Link
              href="/events"
              className="flex items-center justify-center h-12 px-8 rounded text-sm font-mono font-semibold tracking-wider uppercase border border-[#8E8D8A]/40 text-[#1A1918] bg-[#EAE7DC] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all"
            >
              EXPLORE 16 TOURNAMENTS <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Guarantee Badges */}
          <div className="pt-6 border-t border-[#8E8D8A]/20 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#8E8D8A]">
            <span className="flex items-center">
              <ShieldCheck className="mr-1.5 h-4 w-4 text-[#2D6A4F]" />
              100% Verified Entry
            </span>
            <span className="flex items-center">
              <Trophy className="mr-1.5 h-4 w-4 text-[#E85A4F]" />
              ₹10,00,000+ Verified Pool
            </span>
            <span className="flex items-center">
              <Sparkles className="mr-1.5 h-4 w-4 text-[#D8C3A5]" />
              Signed PDF Certificates
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

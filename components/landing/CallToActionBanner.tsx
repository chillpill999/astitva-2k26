import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, QrCode, UserPlus } from "lucide-react";

export function CallToActionBanner() {
  return (
    <section id="register" className="w-full py-20 px-4 sm:px-6 lg:px-8 relative bg-[#EAE7DC]">
      <div className="container max-w-5xl mx-auto relative z-10">
        <div className="relative p-8 sm:p-12 lg:p-16 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-md text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#EAE7DC] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
            <Sparkles className="h-3 w-3 text-[#E85A4F]" />
            <span className="font-bold text-[#E85A4F]">4–8 September 2026</span>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              Register for <span className="text-[#E85A4F]">ASTITVA 2K26</span>
            </h2>
            <p className="text-sm sm:text-lg text-[#8E8D8A] leading-relaxed max-w-2xl mx-auto">
              Sign in, complete your profile, and register for official festival events.
              Form a team if you need one — captains can share a 6-character invite code.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/sign-in"
              className="flex items-center justify-center h-12 px-8 rounded text-sm font-mono font-bold tracking-wider uppercase bg-[#E85A4F] text-white hover:bg-[#C94A40] transition-colors shadow-sm"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Sign in &amp; register
            </Link>
            <Link
              href="/events"
              className="flex items-center justify-center h-12 px-8 rounded text-sm font-mono font-semibold tracking-wider uppercase border border-[#8E8D8A]/40 text-[#1A1918] bg-[#EAE7DC] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all"
            >
              Browse Events <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="pt-6 border-t border-[#8E8D8A]/20 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#8E8D8A]">
            <span className="flex items-center">
              <ShieldCheck className="mr-1.5 h-4 w-4 text-[#E85A4F]" />
              Verifiable certificates
            </span>
            <span className="flex items-center">
              <QrCode className="mr-1.5 h-4 w-4 text-[#E85A4F]" />
              QR attendance passes
            </span>
            <span className="flex items-center">
              <Sparkles className="mr-1.5 h-4 w-4 text-[#E85A4F]" />
              Live leaderboards
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

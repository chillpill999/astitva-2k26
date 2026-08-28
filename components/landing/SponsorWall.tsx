"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, ExternalLink, Sparkles, Building, Handshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FestSponsor } from "@/lib/data/fest-data";

interface SponsorWallProps {
  sponsors: FestSponsor[];
}

const TIER_LABELS: Record<string, string> = {
  TITLE: "TITLE SPONSOR",
  POWERED_BY: "POWERED BY",
  GOLD: "GOLD SPONSOR",
  SILVER: "SILVER PARTNER",
  COMMUNITY_PARTNER: "COMMUNITY PARTNER",
};

export function SponsorWall({ sponsors }: SponsorWallProps) {
  return (
    <section id="sponsors" className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#EAE7DC] text-[#1A1918] border-b border-[#8E8D8A]/20">
      <div className="container max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <Handshake className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>OFFICIAL PARTNERS &amp; SPONSORS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              POWERED BY <span className="text-[#E85A4F]">INDUSTRY LEADERS</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              Supported by premier government bodies, banking leaders, and global energy brands empowering student innovation.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/sponsors">
              <span className="inline-flex items-center text-xs font-mono font-semibold py-2 px-4 rounded border border-[#8E8D8A]/40 text-[#1A1918] bg-[#F6F4EE] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer">
                SPONSORSHIP TIERS →
              </span>
            </Link>
          </div>
        </div>

        {/* Sponsor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sponsors.map((sp) => {
            const tierLabel = TIER_LABELS[sp.tier] || sp.tier;

            return (
              <div
                key={sp.id}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm hover:border-[#E85A4F] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Top Tier Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#EAE7DC] border border-[#8E8D8A]/20 text-[#E85A4F] uppercase">
                      {tierLabel}
                    </span>
                    {sp.websiteUrl && (
                      <a
                        href={sp.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8E8D8A] hover:text-[#E85A4F] transition-colors"
                        aria-label={`Visit ${sp.name}`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Logo Thumbnail Container */}
                  <div className="relative h-28 w-full rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/20 flex items-center justify-center p-4 overflow-hidden">
                    {sp.logoUrl ? (
                      <Image
                        src={sp.logoUrl}
                        alt={sp.name}
                        fill
                        className="object-contain p-3 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="font-mono text-sm font-bold text-[#1A1918]">{sp.name}</span>
                    )}
                  </div>

                  {/* Sponsor Name & Description */}
                  <div>
                    <h3 className="text-base font-bold text-[#1A1918]">
                      {sp.name}
                    </h3>
                    <p className="text-xs text-[#8E8D8A] mt-1 line-clamp-2 leading-relaxed">
                      {sp.description || "Official Festival Partner"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#8E8D8A]/15 mt-4 text-[11px] font-mono text-[#8E8D8A] flex items-center justify-between">
                  <span>PARTNERSHIP</span>
                  <span className="text-[#E85A4F]">VERIFIED ✓</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

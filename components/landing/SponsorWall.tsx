"use client";

// ============================================================================
// ASTITVA 2K26 - Tiered Sponsor Showcase Wall
// Path: components/landing/SponsorWall.tsx
// ============================================================================

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, ExternalLink, Sparkles, Building, Handshake, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FestSponsor } from "@/lib/data/fest-data";

interface SponsorWallProps {
  sponsors: FestSponsor[];
}

const TIER_BADGES: Record<string, { label: string; variant: "amber" | "purple" | "cyan" | "emerald" | "outline" }> = {
  TITLE: { label: "TITLE SPONSOR", variant: "amber" },
  POWERED_BY: { label: "POWERED BY", variant: "purple" },
  GOLD: { label: "GOLD SPONSOR", variant: "amber" },
  SILVER: { label: "SILVER PARTNER", variant: "cyan" },
  COMMUNITY_PARTNER: { label: "COMMUNITY PARTNER", variant: "emerald" },
};

export function SponsorWall({ sponsors }: SponsorWallProps) {
  const [proposalModalOpen, setProposalModalOpen] = useState(false);

  return (
    <section className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#030712] border-b border-white/10">
      <div className="container max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="outline" className="px-3.5 py-1 text-xs font-mono font-semibold border-cyan-500/30 text-cyan-400 bg-cyan-950/30">
              <Handshake className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
              OFFICIAL PARTNERS &amp; SPONSORS
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
              POWERED BY <span className="cyber-gradient-text">INDUSTRY LEADERS</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Supported by premier government bodies, banking leaders, and global energy brands empowering student innovation.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/sponsors">
              <Button variant="outline" className="border-white/20 hover:border-cyan-400 text-xs font-bold">
                Sponsorship Tiers
              </Button>
            </Link>
            <Button
              variant="neonCyan"
              onClick={() => setProposalModalOpen(true)}
              className="text-xs font-bold"
            >
              Partner With Us
            </Button>
          </div>
        </div>

        {/* Sponsor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sponsors.map((sp) => {
            const tierMeta = TIER_BADGES[sp.tier] || { label: sp.tier, variant: "outline" };

            return (
              <div
                key={sp.id}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#0d1224]/80 border border-white/10 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1 hover:bg-[#141c38]/90"
              >
                <div className="space-y-4">
                  {/* Top Tier Badge */}
                  <div className="flex items-center justify-between">
                    <Badge variant={tierMeta.variant} className="text-[10px] font-mono font-bold tracking-wider">
                      {tierMeta.label}
                    </Badge>
                    {sp.websiteUrl && (
                      <a
                        href={sp.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-cyan-400 transition-colors"
                        aria-label={`Visit ${sp.name}`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Logo Thumbnail Container */}
                  <div className="relative h-28 w-full rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-center p-4 overflow-hidden group-hover:border-white/15 transition-all">
                    {sp.logoUrl ? (
                      <Image
                        src={sp.logoUrl}
                        alt={sp.name}
                        fill
                        className="object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-300"
                      />
                    ) : (
                      <Building className="h-10 w-10 text-slate-500" />
                    )}
                    <div className="absolute inset-0 bg-slate-950/40" />
                  </div>

                  {/* Sponsor Name & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {sp.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {sp.description || "Official ASTITVA 2K26 partner."}
                    </p>
                  </div>
                </div>

                {/* Footer Link */}
                {sp.websiteUrl && (
                  <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-xs text-cyan-400 font-mono">
                    <a
                      href={sp.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center"
                    >
                      <span>Official Website</span>
                      <ExternalLink className="ml-1.5 h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Partner with Us Proposal Modal */}
      {proposalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#0d1224] border border-cyan-500/40 p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <div className="space-y-2">
              <Badge variant="cyan" className="text-xs font-mono font-bold">
                PARTNERSHIP PROSPECTUS
              </Badge>
              <h3 className="text-2xl font-black text-white">
                Partner with ASTITVA 2K26
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect with 2,500+ top engineering minds, technical leaders, and athletes across Bihar. Custom Title, Gold, Event, and Energy partnerships available.
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-300 font-mono bg-slate-950/60 p-4 rounded-xl border border-white/10">
              <p>📧 Email: <span className="text-cyan-400">sponsorship@lnjpit.ac.in</span></p>
              <p>📞 Phone: <span className="text-cyan-400">+91 98765 43210</span></p>
              <p>📍 Desk: Office of Principal, LNJPIT Chapra, Bihar</p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProposalModalOpen(false)}
                className="text-xs border-white/20"
              >
                Close
              </Button>
              <a href="mailto:sponsorship@lnjpit.ac.in?subject=ASTITVA%202K26%20Sponsorship%20Inquiry">
                <Button variant="neonCyan" size="sm" className="text-xs font-bold">
                  Send Partnership Email
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

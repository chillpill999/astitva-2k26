"use client";

// ============================================================================
// ASTITVA 2K26 - Dedicated Tiered Sponsors & Partners Showcase Portal
// Path: app/sponsors/page.tsx
// ============================================================================

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Zap,
  ExternalLink,
  Sparkles,
  Building,
  Handshake,
  CheckCircle2,
  Download,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATIC_SPONSORS, FestSponsor } from "@/lib/data/fest-data";

const SPONSORSHIP_TIERS = [
  {
    tier: "TITLE SPONSOR",
    investment: "₹3,00,000+",
    perks: [
      "Naming rights: 'ASTITVA 2K26 Powered by [Brand]'",
      "Prominent logo on main stage, all posters & banners",
      "Keynote speech during Grand Valedictory ceremony",
      "Exclusive prime stall space on campus central lawn",
      "Logo on all 2,500+ participant certificates & ID passes",
    ],
    color: "text-amber-400",
    border: "border-amber-500/40",
    bgGradient: "from-amber-950/20 to-transparent",
  },
  {
    tier: "POWERED BY / GOVT PATRON",
    investment: "Institutional Patronage",
    perks: [
      "Official government accreditation & technical endorsement",
      "Co-branding across all digital broadcasts & media releases",
      "VIP dais seating for all inaugural & valedictory sessions",
      "Special technical showcase booth in CSE computing center",
    ],
    color: "text-purple-400",
    border: "border-purple-500/40",
    bgGradient: "from-purple-950/20 to-transparent",
  },
  {
    tier: "GOLD SPONSOR",
    investment: "₹1,00,000",
    perks: [
      "Exclusive naming of Cricket or Football Championship",
      "Logo placement on festival website header & stage LED walls",
      "Branded booth setup near Open Air Theatre",
      "10 VIP All-Access passes for 5 festival days",
    ],
    color: "text-amber-300",
    border: "border-amber-500/30",
    bgGradient: "from-amber-950/10 to-transparent",
  },
  {
    tier: "SILVER / ENERGY PARTNER",
    investment: "₹50,000",
    perks: [
      "Official Esports & LAN Arena energy sponsor",
      "Product distribution lounge in indoor sports complex",
      "Logo in official fest guide & digital announcements",
      "5 VIP passes for festival night concerts",
    ],
    color: "text-cyan-400",
    border: "border-cyan-500/30",
    bgGradient: "from-cyan-950/10 to-transparent",
  },
];

export default function SponsorsPage() {
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const sponsors: FestSponsor[] = STATIC_SPONSORS;

  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="container max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-3xl">
            <Badge variant="outline" className="px-3.5 py-1 text-xs font-mono font-semibold border-cyan-500/30 text-cyan-400 bg-cyan-950/30">
              <Handshake className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
              INDUSTRY &amp; GOVERNMENT PARTNERS
            </Badge>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase">
              FESTIVAL <span className="cyber-gradient-text">SPONSORS</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Empowering Bihar&apos;s brightest engineering minds across 16 championships at LNJPIT Chapra.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="neonCyan"
              onClick={() => setProposalModalOpen(true)}
              className="text-xs font-bold"
            >
              Partner with ASTITVA 2K26
            </Button>
          </div>
        </div>

        {/* Current Sponsors Wall */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-300">
              Confirmed 2026 Sponsors &amp; Strategic Partners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsors.map((sp) => (
              <div
                key={sp.id}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#0d1224]/90 border border-white/10 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="cyan" className="text-[9px] font-mono font-bold">
                      {sp.tier}
                    </Badge>
                    {sp.websiteUrl && (
                      <a
                        href={sp.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="relative h-28 w-full rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-center p-4 overflow-hidden">
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
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {sp.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {sp.description}
                    </p>
                  </div>
                </div>

                {sp.websiteUrl && (
                  <div className="pt-4 border-t border-white/5 mt-4">
                    <a
                      href={sp.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-cyan-400 hover:underline flex items-center"
                    >
                      <span>Visit Sponsor Portal</span>
                      <ExternalLink className="ml-1.5 h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sponsorship Tiers & Benefits Matrix */}
        <div className="space-y-8 pt-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase">
              SPONSORSHIP <span className="cyber-gradient-text">TIERS &amp; PACKAGES</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Deliver your brand message directly to over 2,500+ future engineers, tech innovators, and athletes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPONSORSHIP_TIERS.map((tier, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#0d1224]/80 border ${tier.border} shadow-2xl backdrop-blur-xl bg-gradient-to-b ${tier.bgGradient} space-y-6`}
              >
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                      Tier {idx + 1}
                    </span>
                    <h3 className={`text-lg font-black tracking-tight ${tier.color} mt-0.5`}>
                      {tier.tier}
                    </h3>
                    <span className="text-xl font-bold font-mono text-white block mt-1">
                      {tier.investment}
                    </span>
                  </div>

                  <ul className="space-y-2.5 pt-2 border-t border-white/10 text-xs text-slate-300">
                    {tier.perks.map((perk, pIdx) => (
                      <li key={pIdx} className="flex items-start space-x-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setProposalModalOpen(true)}
                  className="w-full text-xs font-bold border-white/20 hover:border-cyan-400"
                >
                  Inquire for Tier
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
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
              <p>📞 Phone: <span className="text-cyan-400">+91 98765 43210 / +91 98765 43211</span></p>
              <p>📍 Desk: Office of Principal, LNJPIT Chapra, Bihar – 841302</p>
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
              <a href="mailto:sponsorship@lnjpit.ac.in?subject=ASTITVA%202K26%20Sponsorship%20Proposal">
                <Button variant="neonCyan" size="sm" className="text-xs font-bold">
                  Send Partnership Email
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

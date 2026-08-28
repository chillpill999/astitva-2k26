"use client";

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
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { STATIC_SPONSORS, FestSponsor } from "@/lib/data/fest-data";

const SPONSORSHIP_TIERS = [
  {
    tier: "TITLE SPONSOR",
    investment: "Principal Festival Partner",
    perks: [
      "Naming rights: 'ASTITVA 2K26 Powered by [Brand]'",
      "Prominent logo on main stage, all posters & banners",
      "Keynote speech during Grand Valedictory ceremony",
      "Exclusive prime stall space on campus central lawn",
      "Logo on all 1,000+ participant certificates & ID passes",
    ],
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
  },
  {
    tier: "GOLD SPONSOR",
    investment: "Tournament Title Partner",
    perks: [
      "Exclusive naming of Cricket or Football Championship",
      "Logo placement on festival website header & stage LED walls",
      "Branded booth setup near Open Air Theatre",
      "10 VIP All-Access passes for 5 festival days",
    ],
  },
  {
    tier: "SILVER / ENERGY PARTNER",
    investment: "Arena & Energy Partner",
    perks: [
      "Official Esports & LAN Arena energy sponsor",
      "Product distribution lounge in indoor sports complex",
      "Logo in official fest guide & digital announcements",
      "5 VIP passes for festival night concerts",
    ],
  },
];

export default function SponsorsPage() {
  const sponsors: FestSponsor[] = STATIC_SPONSORS;

  return (
    <div className="w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="container max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#8E8D8A]/20 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <Handshake className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>INDUSTRY &amp; GOVERNMENT PARTNERS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              FESTIVAL <span className="text-[#E85A4F]">SPONSORS</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              We are proud to collaborate with esteemed public and corporate partners empowering ASTITVA 2K26.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="mailto:astitva2026@lnjpit.ac.in"
              className="px-4 py-2 rounded text-xs font-mono font-bold tracking-wider uppercase bg-[#E85A4F] text-white hover:bg-[#C94A40] transition-colors shadow-sm"
            >
              PARTNER WITH US
            </a>
          </div>
        </div>

        {/* Current Sponsors Grid */}
        <div className="space-y-6">
          <h2 className="text-xs font-mono font-bold text-[#1A1918] uppercase tracking-wider">
            Official 2026 Partners
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsors.map((sp) => (
              <div
                key={sp.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm hover:border-[#E85A4F] transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#E85A4F] uppercase">
                      {sp.tier}
                    </span>
                    {sp.websiteUrl && (
                      <a
                        href={sp.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8E8D8A] hover:text-[#E85A4F]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="relative h-24 w-full rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/20 flex items-center justify-center p-3">
                    {sp.logoUrl ? (
                      <Image
                        src={sp.logoUrl}
                        alt={sp.name}
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <span className="font-mono text-sm font-bold text-[#1A1918]">{sp.name}</span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#1A1918]">{sp.name}</h3>
                    <p className="text-xs text-[#8E8D8A] mt-1 line-clamp-2">{sp.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sponsorship Tiers Matrix */}
        <div className="space-y-6 pt-6">
          <h2 className="text-xs font-mono font-bold text-[#1A1918] uppercase tracking-wider">
            Sponsorship Tiers &amp; Entitlements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPONSORSHIP_TIERS.map((tier, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-6"
              >
                <div className="space-y-4">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#E85A4F] uppercase">
                    Tier 0{idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-[#1A1918] uppercase">{tier.tier}</h3>
                  <div className="text-xl font-mono font-black text-[#E85A4F]">{tier.investment}</div>

                  <ul className="space-y-2 text-xs text-[#8E8D8A] pt-2">
                    {tier.perks.map((p, pIdx) => (
                      <li key={pIdx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E85A4F] shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

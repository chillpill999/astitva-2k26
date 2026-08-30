import React from "react";
import Link from "next/link";
import { Handshake, ExternalLink, Info } from "lucide-react";
import { FestSponsor } from "@/lib/data/fest-data";

interface SponsorWallProps {
  sponsors: FestSponsor[];
}

const TIER_LABELS: Record<string, string> = {
  TITLE: "TITLE SPONSOR",
  POWERED_BY: "POWERED BY",
  GOLD: "GOLD",
  SILVER: "SILVER",
  BRONZE: "BRONZE",
  MEDIA_PARTNER: "MEDIA PARTNER",
  COMMUNITY_PARTNER: "COMMUNITY PARTNER",
};

export function SponsorWall({ sponsors }: SponsorWallProps) {
  return (
    <section
      id="sponsors"
      className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#EAE7DC] text-[#1A1918] border-b border-[#8E8D8A]/20"
    >
      <div className="container max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <Handshake className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>Official Partners &amp; Sponsors</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              Partners &amp; <span className="text-[#E85A4F]">Sponsors</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              Organisations supporting ASTITVA 2K26 will be listed here as their partnerships
              are confirmed.
            </p>
          </div>

          <Link href="/sponsors">
            <span className="inline-flex items-center text-xs font-mono font-semibold py-2 px-4 rounded border border-[#8E8D8A]/40 text-[#1A1918] bg-[#F6F4EE] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer">
              All Sponsors →
            </span>
          </Link>
        </div>

        {sponsors.length === 0 ? (
          <div className="rounded-2xl border border-[#8E8D8A]/25 bg-[#F6F4EE] p-10 text-center">
            <Info className="h-8 w-8 text-[#8E8D8A] mx-auto mb-2" />
            <p className="text-base font-bold text-[#1A1918]">Sponsors will be updated soon</p>
            <p className="text-xs text-[#8E8D8A] mt-1">
              The organizing committee will publish partner and sponsor details as agreements are
              confirmed.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsors.map((sp) => {
              const tierLabel = TIER_LABELS[sp.tier] || sp.tier;
              return (
                <div
                  key={sp.id}
                  className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm hover:border-[#E85A4F] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="space-y-4">
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

                    <div className="h-20 w-full rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/20 flex items-center justify-center p-3">
                      <span className="font-mono text-sm font-black text-[#1A1918] text-center tracking-wider uppercase">
                        {sp.name}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#1A1918]">{sp.name}</h3>
                      {sp.description && (
                        <p className="text-xs text-[#8E8D8A] mt-1 line-clamp-2 leading-relaxed">
                          {sp.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// ASTITVA 2K26 - Public Sponsors Page
// Path: app/sponsors/page.tsx
// ============================================================================

import Image from "next/image";
import { Handshake, ExternalLink, Info } from "lucide-react";
import { getFestSponsors } from "@/lib/data/fest-data";
import { FestSponsor } from "@/lib/data/fest-data";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Sponsors & Partners | ASTITVA 2K26",
  description: "Sponsors and partners supporting ASTITVA 2K26.",
};

const TIER_LABELS: Record<string, string> = {
  TITLE: "TITLE",
  POWERED_BY: "POWERED BY",
  GOLD: "GOLD",
  SILVER: "SILVER",
  BRONZE: "BRONZE",
  MEDIA_PARTNER: "MEDIA PARTNER",
  COMMUNITY_PARTNER: "COMMUNITY PARTNER",
};

const SPONSORSHIP_TIERS = [
  {
    tier: "TITLE",
    description: "Principal festival partner. The highest-visibility partnership tier.",
  },
  {
    tier: "POWERED_BY",
    description: "Institutional or government patron. Co-branding across all channels.",
  },
  {
    tier: "GOLD",
    description: "Tournament title partner. Logo on stage LED walls and printed materials.",
  },
  {
    tier: "SILVER",
    description: "Arena or event partner. On-site product placement and digital branding.",
  },
];

export default async function SponsorsPage() {
  const sponsors = await getFestSponsors();

  return (
    <div className="w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="container max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#8E8D8A]/20 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <Handshake className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>Festival Partners</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              Festival <span className="text-[#E85A4F]">Sponsors</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              Organisations and government bodies supporting ASTITVA 2K26.
            </p>
          </div>
        </div>

        {sponsors.length === 0 ? (
          <div className="rounded-2xl border border-[#8E8D8A]/25 bg-[#F6F4EE] p-10 text-center">
            <Info className="h-8 w-8 text-[#8E8D8A] mx-auto mb-2" />
            <p className="text-base font-bold text-[#1A1918]">Sponsors will be updated soon</p>
            <p className="text-xs text-[#8E8D8A] mt-1">
              Sponsor and partner details are added by the organizing committee as agreements are
              confirmed.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsors.map((sp) => (
              <SponsorCard key={sp.id} sponsor={sp} />
            ))}
          </div>
        )}

        <div className="space-y-6 pt-6">
          <h2 className="text-xs font-mono font-bold text-[#1A1918] uppercase tracking-wider">
            Sponsorship Tiers
          </h2>
          <p className="text-sm text-[#8E8D8A] max-w-2xl">
            ASTITVA 2K26 offers four principal sponsorship tiers. For partnership enquiries, please
            contact the organizing committee through your institutional channels.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPONSORSHIP_TIERS.map((tier, idx) => (
              <div
                key={tier.tier}
                className="flex flex-col justify-between p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-4"
              >
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#E85A4F] uppercase">
                  Tier 0{idx + 1}
                </span>
                <h3 className="text-base font-bold text-[#1A1918] uppercase">
                  {TIER_LABELS[tier.tier] ?? tier.tier}
                </h3>
                <p className="text-xs text-[#8E8D8A] leading-relaxed">{tier.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SponsorCard({ sponsor }: { sponsor: FestSponsor }) {
  return (
    <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#E85A4F] uppercase">
            {TIER_LABELS[sponsor.tier] ?? sponsor.tier}
          </span>
          {sponsor.websiteUrl && (
            <a
              href={sponsor.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8E8D8A] hover:text-[#E85A4F]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        <div className="relative h-24 w-full rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/20 flex items-center justify-center p-3">
          {sponsor.logoUrl ? (
            <Image
              src={sponsor.logoUrl}
              alt={sponsor.name}
              fill
              className="object-contain p-2"
            />
          ) : (
            <span className="font-mono text-sm font-bold text-[#1A1918] text-center">
              {sponsor.name}
            </span>
          )}
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#1A1918]">{sponsor.name}</h3>
          {sponsor.description && (
            <p className="text-xs text-[#8E8D8A] mt-1 line-clamp-2">{sponsor.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ASTITVA 2K26 - Dedicated Squad Join Portal (Exteta Luxury Aesthetic)
// Path: app/teams/join/page.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { JoinTeamClient } from "./JoinTeamClient";

export const metadata = {
  title: "Join Tournament Squad | ASTITVA 2K26 LNJPIT Chapra",
  description: "Join an existing competition squad using a 6-character invite code.",
};

interface JoinTeamPageProps {
  searchParams: Promise<{ code?: string; event?: string }>;
}

export default async function JoinTeamPage({ searchParams }: JoinTeamPageProps) {
  const { code } = await searchParams;

  return (
    <div className="w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="container max-w-2xl mx-auto space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/teams"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#8E8D8A] hover:text-[#1A1918] transition-colors uppercase font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Squads Hub
          </Link>
        </div>

        {/* Page Header */}
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
              <KeyRound className="mr-1.5 h-3 w-3 inline text-[#E85A4F]" />
              SQUAD ROSTER PORTAL
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
            JOIN WITH <span className="text-[#E85A4F]">INVITE CODE</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono max-w-md mx-auto">
            Got an invite code from your Captain? Enter the 6-character token below to join the squad roster.
          </p>
        </div>

        {/* Client Join Form */}
        <JoinTeamClient initialCode={code || ""} />
      </div>
    </div>
  );
}

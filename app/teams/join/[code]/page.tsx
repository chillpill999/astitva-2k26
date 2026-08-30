// ============================================================================
// ASTITVA 2K26 - Path-Parameter Squad Join Portal (Exteta Luxury Aesthetic)
// Path: app/teams/join/[code]/page.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { JoinTeamClient } from "../JoinTeamClient";

interface JoinTeamByCodePageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: JoinTeamByCodePageProps) {
  const { code } = await params;
  return {
    title: `Join Squad (${code.toUpperCase()}) | ASTITVA 2K26 LNJPIT`,
    description: `Join competition squad with invite code ${code.toUpperCase()} for ASTITVA 2K26.`,
  };
}

export default async function JoinTeamByCodePage({ params }: JoinTeamByCodePageProps) {
  const { code } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/teams/join/${code}`)}`);
  }

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
              DIRECT SQUAD INVITATION
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
            JOIN WITH <span className="text-[#E85A4F]">INVITE CODE</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono max-w-md mx-auto">
            You were invited to join a squad for ASTITVA 2K26. Confirm below to register your spot.
          </p>
        </div>

        {/* Client Join Form with Prefilled Code */}
        <JoinTeamClient initialCode={code || ""} />
      </div>
    </div>
  );
}

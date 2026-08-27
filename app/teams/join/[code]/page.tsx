// ============================================================================
// ASTITVA 2K26 - Path-Parameter Squad Join Portal
// Path: app/teams/join/[code]/page.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, Users, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="container max-w-2xl mx-auto space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/teams"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Squads Hub
          </Link>
        </div>

        {/* Page Header */}
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-xs font-mono bg-cyan-950/40 text-cyan-300 border-cyan-500/30">
              <KeyRound className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
              DIRECT SQUAD INVITATION
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
            JOIN WITH <span className="cyber-gradient-text">INVITE CODE</span>
          </h1>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            You were invited to join a squad for ASTITVA 2K26. Confirm below to register your spot.
          </p>
        </div>

        {/* Client Join Form with Prefilled Code */}
        <JoinTeamClient initialCode={code || ""} />
      </div>
    </div>
  );
}

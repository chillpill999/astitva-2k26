// ============================================================================
// ASTITVA 2K26 - Dedicated Squad Dashboard Page (Exteta Luxury Aesthetic)
// Path: app/teams/[id]/page.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTeamDetails } from "@/lib/teams/actions";
import { TeamDashboardClient } from "./TeamDashboardClient";

interface TeamPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TeamPageProps) {
  const { id } = await params;
  const res = await getTeamDetails(id);
  if (!res.success || !res.data) {
    return { title: "Squad Not Found | ASTITVA 2K26" };
  }
  return {
    title: `${res.data.name} (Squad Dashboard) | ASTITVA 2K26`,
    description: `Squad roster and match details for ${res.data.name} in ${res.data.event?.title || "ASTITVA 2K26"}.`,
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { id } = await params;
  const res = await getTeamDetails(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="container max-w-7xl mx-auto space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/teams"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#8E8D8A] hover:text-[#1A1918] transition-colors uppercase font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Squads Hub
          </Link>
        </div>

        {/* Client Squad Dashboard */}
        <TeamDashboardClient initialTeam={res.data} />
      </div>
    </div>
  );
}

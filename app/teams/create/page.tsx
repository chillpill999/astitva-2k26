// ============================================================================
// ASTITVA 2K26 - Dedicated Squad Creation Page (Exteta Luxury Aesthetic)
// Path: app/teams/create/page.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { getEventsCatalog } from "@/lib/events/actions";
import { CreateTeamForm } from "./CreateTeamForm";

export const metadata = {
  title: "Create Tournament Squad | ASTITVA 2K26 LNJPIT Chapra",
  description: "Form a new competition squad, become captain, and generate a 6-character team invite code.",
};

interface CreateTeamPageProps {
  searchParams: Promise<{ event?: string }>;
}

export default async function CreateTeamPage({ searchParams }: CreateTeamPageProps) {
  const { event: defaultEventId } = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    const callback = defaultEventId ? `/teams/create?event=${defaultEventId}` : "/teams/create";
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(callback)}`);
  }

  const eventsRes = await getEventsCatalog();
  const allEvents = eventsRes.data || [];
  const teamEvents = allEvents.filter((e) => e.eventType === "TEAM" || e.maxTeamSize > 1);

  return (
    <div className="w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="container max-w-3xl mx-auto space-y-8">
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
        <div className="space-y-3 border-b border-[#8E8D8A]/20 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
              SQUAD CREATION
            </span>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#EAE7DC] border border-[#8E8D8A]/25 text-[#E85A4F] uppercase">
              CAPTAIN REGISTRATION
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
            Form Your <span className="text-[#E85A4F]">Tournament Squad</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono">
            Create an official team squad for ASTITVA 2K26. As Captain, you will receive a unique 6-character invite code to assemble your roster.
          </p>
        </div>

        {/* Client Form Component */}
        <CreateTeamForm teamEvents={teamEvents} defaultEventId={defaultEventId} />
      </div>
    </div>
  );
}

// ============================================================================
// ASTITVA 2K26 - Dedicated Squad Creation Page
// Path: app/teams/create/page.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import { ArrowLeft, Users, Sparkles, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  const eventsRes = await getEventsCatalog();
  const allEvents = eventsRes.data || [];
  const teamEvents = allEvents.filter((e) => e.eventType === "TEAM" || e.maxTeamSize > 1);

  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="container max-w-3xl mx-auto space-y-8">
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
        <div className="space-y-3 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono bg-cyan-950/40 text-cyan-300 border-cyan-500/30">
              <Users className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
              SQUAD CREATION
            </Badge>
            <Badge variant="outline" className="text-xs font-mono bg-purple-950/40 text-purple-300 border-purple-500/30">
              CAPTAIN REGISTRATION
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
            Form Your <span className="cyber-gradient-text">Tournament Squad</span>
          </h1>
          <p className="text-sm text-slate-300">
            Create an official team squad for ASTITVA 2K26. As Captain, you will receive a unique 6-character invite code to assemble your roster.
          </p>
        </div>

        {/* Client Form Component */}
        <CreateTeamForm teamEvents={teamEvents} defaultEventId={defaultEventId} />
      </div>
    </div>
  );
}

// ============================================================================
// ASTITVA 2K26 - Team Captain Squad Headquarters (Exteta Luxury Aesthetic)
// Path: app/dashboard/captain/page.tsx
// ============================================================================

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Users,
  Trophy,
  UserPlus,
  Copy,
  CheckCircle2,
  Calendar,
  Sparkles,
  Shield,
  ArrowRight,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { RoleBadge } from "@/components/dashboard/RoleBadge";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Squad Headquarters | ASTITVA 2K26",
  description: "Manage your squads, invite teammates, and register for team tournaments.",
};

export default async function CaptainDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/dashboard/captain");
  if (user.role !== "TEAM_CAPTAIN" && user.role !== "ADMIN") {
    redirect("/unauthorized?attempted=/dashboard/captain");
  }

  let teams: any[] = [];
  try {
    teams = await prisma.team.findMany({
      where: { captainId: user.id },
      include: {
        event: { include: { category: true } },
        members: {
          include: {
            user: { include: { profile: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    teams = [];
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 text-[#1A1918]">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#8E8D8A]/20 pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <RoleBadge role="TEAM_CAPTAIN" />
            <span className="text-[10px] font-mono text-[#8E8D8A] uppercase font-bold">
              Squad Leader Command
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight uppercase font-mono">
            Squad Headquarters
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono">
            Signed in as <strong className="text-[#1A1918]">{user.name}</strong>. Manage your team rosters and distribute join invite codes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/teams/create">
            <button className="px-4 py-2.5 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
              <UserPlus className="h-4 w-4" /> Form New Squad
            </button>
          </Link>
          <Link href="/teams">
            <button className="px-4 py-2.5 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-mono font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all flex items-center gap-1.5 cursor-pointer">
              <Users className="h-4 w-4" /> Public Squad Hub
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      {teams.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 text-center space-y-4 font-mono shadow-sm">
          <Sparkles className="h-10 w-10 text-[#E85A4F] mx-auto" />
          <h3 className="text-lg font-bold text-[#1A1918] uppercase">No squads formed yet</h3>
          <p className="text-xs text-[#8E8D8A] max-w-md mx-auto">
            Create a squad for Cricket, Football, Volleyball, BGMI, Free Fire, or Quiz to receive a unique 6-character invite code for your teammates.
          </p>
          <Link href="/teams/create" className="inline-block pt-2">
            <button className="px-5 py-3 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-all cursor-pointer">
              Create Your First Squad →
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6 font-mono">
          {teams.map((team) => (
            <div
              key={team.id}
              className="p-6 sm:p-7 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#8E8D8A]/20 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
                      {team.event?.category.name || "Tournament"}
                    </span>
                    <span className="text-[10px] text-[#8E8D8A] font-bold uppercase">
                      Day 0{team.event?.dayNumber} · LNJPIT
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-[#1A1918] uppercase">
                    {team.name}
                  </h2>
                  <p className="text-xs text-[#8E8D8A]">
                    Tournament: <strong className="text-[#1A1918]">{team.event?.title}</strong>
                  </p>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-1">
                  <span className="text-[10px] text-[#8E8D8A] uppercase font-bold">Invite Code</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xl font-black text-[#E85A4F] tracking-widest bg-[#EAE7DC] px-3 py-1 rounded-xl border border-[#8E8D8A]/30">
                      {team.code}
                    </code>
                  </div>
                  <span className="text-[9px] text-[#8E8D8A]">Share with teammates to join</span>
                </div>
              </div>

              {/* Roster Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#1A1918] uppercase flex items-center justify-between">
                  <span>Squad Roster ({team.members.length} member{team.members.length === 1 ? "" : "s"})</span>
                  <span className="text-[10px] text-[#8E8D8A]">
                    Limit: {team.event?.minTeamSize ?? 1}–{team.event?.maxTeamSize ?? "—"} players
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                  {team.members.map((m: any) => (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/25 flex items-center justify-between gap-2 shadow-sm"
                    >
                      <div className="space-y-0.5 truncate">
                        <p className="text-xs font-bold text-[#1A1918] truncate">
                          {m.user.name} {m.userId === user.id ? "(Captain)" : ""}
                        </p>
                        <p className="text-[10px] text-[#8E8D8A]">
                          {m.user.profile?.branch || "LNJPIT"} · {m.user.participantId}
                        </p>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F6F4EE] border border-[#8E8D8A]/30 text-emerald-700 uppercase">
                        {m.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#8E8D8A]/20 text-xs">
                <Link href={`/teams/${team.id}`} className="font-bold text-[#E85A4F] hover:underline flex items-center gap-1">
                  Manage Squad Details <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href={`/events/${team.eventId}`} className="text-[#8E8D8A] hover:text-[#1A1918] hover:underline">
                  Event Rules &amp; Timings →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ASTITVA 2K26 - Team Captain Dashboard (real DB)
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
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Captain Dashboard | ASTITVA 2K26",
  description: "Manage your squad, share invite codes, and register for events.",
};

export default async function CaptainDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/dashboard/captain");
  if (user.role !== "TEAM_CAPTAIN" && user.role !== "ADMIN") {
    redirect("/unauthorized?attempted=/dashboard/captain");
  }

  const teams = await prisma.team.findMany({
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

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Team Captain
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your squads and share invite codes.
          </p>
        </div>
        <Link href="/teams/create">
          <Button variant="neonCyan" size="sm" className="text-xs font-bold">
            <UserPlus className="h-4 w-4 mr-1.5" /> Create Team
          </Button>
        </Link>
      </div>

      {teams.length === 0 ? (
        <Card className="glass-panel border-white/10 bg-slate-900/70">
          <CardContent className="p-8 text-center space-y-3">
            <Info className="h-8 w-8 text-slate-500 mx-auto" />
            <p className="text-base font-bold text-white">You have not created any teams yet</p>
            <p className="text-xs text-slate-400">
              Create a team to register team-based events.
            </p>
            <Link href="/teams/create" className="inline-block">
              <Button variant="neonCyan" size="sm" className="text-xs font-bold mt-2">
                Create Your First Team
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {teams.map((team) => (
            <Card key={team.id} className="glass-panel border-white/10 bg-slate-900/70">
              <CardHeader className="pb-3 border-b border-white/10">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <CardTitle className="text-base font-bold text-white">{team.name}</CardTitle>
                    <CardDescription className="text-xs text-slate-400 mt-1">
                      {team.event?.title} · {team.event?.category.name} · Code {team.code}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-2xl font-black text-cyan-300 tracking-widest bg-slate-950/60 px-3 py-1 rounded-lg border border-white/10">
                      {team.code}
                    </code>
                    <CopyInviteButton code={team.code} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-xs text-slate-400 mb-2">
                  {team.members.length} {team.members.length === 1 ? "member" : "members"}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-white/10 text-slate-400 uppercase">
                      <tr>
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">Branch</th>
                        <th className="py-2 pr-4">Participant ID</th>
                        <th className="py-2 pr-4">Role</th>
                        <th className="py-2 pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {team.members.map((m) => (
                        <tr key={m.id}>
                          <td className="py-2 pr-4 text-white font-bold">
                            {m.user.name}
                            {m.role === "CAPTAIN" && (
                              <span className="ml-2 text-[9px] font-black text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">
                                C
                              </span>
                            )}
                          </td>
                          <td className="py-2 pr-4 text-slate-300">
                            {m.user.profile?.branch ?? "—"}
                          </td>
                          <td className="py-2 pr-4 font-mono text-slate-300">
                            {m.user.profile?.participantId ?? "—"}
                          </td>
                          <td className="py-2 pr-4 text-slate-300">{m.role}</td>
                          <td className="py-2 pr-4 text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> {m.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CopyInviteButton({ code }: { code: string }) {
  return (
    <form
      action={async () => {
        "use server";
        // No-op: server action is declared but uses client copy below
      }}
    >
      <CopyButtonClient code={code} />
    </form>
  );
}

function CopyButtonClient({ code }: { code: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="text-[10px] font-bold"
      onClick={() => {
        if (typeof navigator !== "undefined") {
          navigator.clipboard?.writeText(code);
        }
      }}
    >
      <Copy className="h-3 w-3 mr-1" /> Copy
    </Button>
  );
}

// ============================================================================
// ASTITVA 2K26 - Participant Dashboard (real DB)
// Path: app/dashboard/participant/page.tsx
// ============================================================================

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  QrCode,
  Trophy,
  Award,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { getUserCertificates } from "@/lib/certificates/actions";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Participant Dashboard | ASTITVA 2K26",
  description: "Your registrations, QR pass, and certificates.",
};

function formatDateTime(iso: string | Date) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ParticipantDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/dashboard/participant");
  if (user.role !== "PARTICIPANT" && user.role !== "TEAM_CAPTAIN" && user.role !== "ADMIN") {
    redirect("/unauthorized?attempted=/dashboard/participant");
  }

  let profile: any = null;
  let registrations: any[] = [];
  let certificates: any[] = [];

  try {
    const results = await Promise.all([
      prisma.profile.findUnique({ where: { userId: user.id } }).catch(() => null),
      prisma.registration.findMany({
        where: { userId: user.id },
        include: {
          event: { include: { category: true } },
          team: true,
        },
        orderBy: { createdAt: "desc" },
      }).catch(() => []),
      getUserCertificates(user.id).catch(() => []),
    ]);
    profile = results[0];
    registrations = results[1] || [];
    certificates = results[2] || [];
  } catch {
    profile = null;
    registrations = [];
    certificates = [];
  }

  // If profile is incomplete (no branch, roll number, etc.), redirect to /profile to complete it
  if (!profile || !profile.branch || !profile.collegeId) {
    redirect("/profile");
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Participant Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Signed in as {user.name}. View your registrations, QR pass, and certificates.
          </p>
        </div>
        <Link href="/events">
          <Button variant="neonCyan" size="sm" className="text-xs font-bold">
            <Trophy className="h-4 w-4 mr-1.5" /> Browse Events
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass-panel border-white/10 bg-slate-900/70 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white flex items-center">
              <Calendar className="h-4 w-4 text-cyan-300 mr-2" /> My Registrations
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              {registrations.length === 0
                ? "You have not registered for any events yet."
                : `${registrations.length} event${registrations.length === 1 ? "" : "s"} registered`}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {registrations.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-slate-950/60 p-6 text-center">
                <Info className="h-6 w-6 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-300">No registrations yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Visit the event catalog to register for individual or team events.
                </p>
                <Link href="/events" className="inline-block mt-3">
                  <Button size="sm" variant="neonCyan" className="text-xs font-bold">
                    Browse Event Catalog
                  </Button>
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-white/5">
                {registrations.map((r) => (
                  <li key={r.id} className="py-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono border-white/10 text-slate-300"
                        >
                          {r.event.category.name}
                        </Badge>
                        <span className="font-mono text-[10px] text-slate-400">
                          Day {r.event.dayNumber}
                        </span>
                      </div>
                      <Link
                        href={`/events/${r.event.id}`}
                        className="block text-sm font-bold text-white hover:text-cyan-300 truncate"
                      >
                        {r.event.title}
                      </Link>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {r.event.venue}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formatDateTime(r.event.scheduleStart)}
                      </p>
                      {r.team && (
                        <p className="text-[11px] text-cyan-300 font-mono mt-1">
                          Squad: {r.team.name} ({r.team.code})
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-mono ${
                          r.status === "ATTENDED"
                            ? "border-emerald-500/30 text-emerald-300"
                            : r.status === "CONFIRMED"
                            ? "border-cyan-500/30 text-cyan-300"
                            : r.status === "PENDING"
                            ? "border-amber-500/30 text-amber-300"
                            : "border-white/10 text-slate-300"
                        }`}
                      >
                        {r.status}
                      </Badge>
                      <span className="text-[10px] font-mono text-slate-400">
                        {r.registrationNumber}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10 bg-slate-900/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white flex items-center">
              <QrCode className="h-4 w-4 text-cyan-300 mr-2" /> Digital Pass
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-center">
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-6">
              <QrCode className="w-20 h-20 text-cyan-300 mx-auto" />
              <p className="font-mono text-sm font-black text-cyan-300 mt-2">
                {profile?.participantId ?? user.participantId ?? "—"}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Encrypted digital pass
              </p>
            </div>
            <Link href="/profile">
              <Button variant="outline" size="sm" className="text-xs w-full">
                Manage Profile
              </Button>
            </Link>
            <Link href="/api/qr/issue" target="_blank">
              <Button variant="neonCyan" size="sm" className="text-xs w-full">
                Issue / Refresh Pass
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel border-white/10 bg-slate-900/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-white flex items-center">
            <Award className="h-4 w-4 text-amber-300 mr-2" /> Certificates
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Verifiable digital certificates with authenticity signatures.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {certificates.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-6 text-center">
              <Info className="h-6 w-6 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-300">No certificates yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Certificates are issued automatically when an event coordinator records
                results.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {certificates.map((c) => (
                <li
                  key={c.id}
                  className="py-3 flex items-center justify-between gap-3 flex-wrap"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white">{c.title}</p>
                    <p className="text-[11px] text-slate-400">
                      {c.eventName} · {c.category}
                    </p>
                    <p className="text-[10px] font-mono text-cyan-300">{c.certificateNumber}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">
                      {new Date(c.issueDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <Link
                      href={`/verify-certificate/${c.certificateNumber}`}
                      target="_blank"
                      className="text-cyan-300 hover:text-cyan-200"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

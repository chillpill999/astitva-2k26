// ============================================================================
// ASTITVA 2K26 - Participant Dashboard (Exteta Warm Sand Aesthetic)
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
  Sparkles,
  Users,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { getUserCertificates } from "@/lib/certificates/actions";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Participant Command Center | ASTITVA 2K26",
  description: "View your active festival registrations, encrypted digital pass, and verified certificates.",
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

  // If profile is incomplete, redirect to /profile
  if (!profile || !profile.branch || !profile.collegeId) {
    redirect("/profile");
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 text-[#1A1918]">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#8E8D8A]/20 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-[#F6F4EE] border border-[#8E8D8A]/30 text-[10px] font-mono text-[#E85A4F] uppercase font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E85A4F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E85A4F]"></span>
            </span>
            <span>Participant Command Deck</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight uppercase font-mono">
            Welcome, <span className="text-[#E85A4F]">{user.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono">
            Participant ID: <strong className="text-[#1A1918]">{profile?.participantId}</strong> · Branch: <strong className="text-[#1A1918]">{profile?.branch}</strong> · LNJPIT Chapra
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/events">
            <button className="px-4 py-2.5 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
              <Trophy className="h-4 w-4" /> Explore Events
            </button>
          </Link>
          <Link href="/teams">
            <button className="px-4 py-2.5 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-mono font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all flex items-center gap-1.5 cursor-pointer">
              <Users className="h-4 w-4" /> My Squads
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard icon={<Calendar className="h-4 w-4 text-[#E85A4F]" />} label="Registered Events" value={registrations.length} />
        <KpiCard icon={<Award className="h-4 w-4 text-[#1A1918]" />} label="Certificates Earned" value={certificates.length} />
        <KpiCard icon={<ShieldCheck className="h-4 w-4 text-emerald-600" />} label="Badge Status" value="ACTIVE" isBadge />
        <KpiCard icon={<Zap className="h-4 w-4 text-amber-600" />} label="Pass Access" value="ALL VENUES" isBadge />
      </div>

      {/* Main Grid: Registrations & Digital Pass */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Registered Events */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-4">
              <div>
                <h2 className="text-base font-bold font-mono uppercase text-[#1A1918] flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#E85A4F]" />
                  My Event Registrations
                </h2>
                <p className="text-xs font-mono text-[#8E8D8A] mt-0.5">
                  {registrations.length === 0
                    ? "You have not registered for any tournaments yet."
                    : `${registrations.length} active tournament registration(s)`}
                </p>
              </div>
              <Link href="/events" className="text-xs font-mono font-bold text-[#E85A4F] hover:underline">
                + Register More
              </Link>
            </div>

            {registrations.length === 0 ? (
              <div className="rounded-2xl border border-[#8E8D8A]/20 bg-[#EAE7DC] p-8 text-center space-y-3 font-mono">
                <Sparkles className="h-8 w-8 text-[#E85A4F] mx-auto" />
                <h3 className="text-sm font-bold text-[#1A1918] uppercase">No active registrations</h3>
                <p className="text-xs text-[#8E8D8A] max-w-sm mx-auto">
                  Browse through 20 official Sports, Cultural, Gaming, and Literary tournaments and register solo or with your team squad.
                </p>
                <Link href="/events" className="inline-block pt-2">
                  <button className="px-5 py-2.5 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-all">
                    Browse All 20 Events →
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {registrations.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 hover:border-[#E85A4F]/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
                          {r.event.category.name}
                        </span>
                        <span className="text-[10px] text-[#8E8D8A] font-bold uppercase">
                          Day 0{r.event.dayNumber} · Sept 2026
                        </span>
                      </div>
                      <Link
                        href={`/events/${r.event.id}`}
                        className="text-sm font-bold text-[#1A1918] hover:text-[#E85A4F] transition-colors block"
                      >
                        {r.event.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#8E8D8A]">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#E85A4F]" /> {r.event.venue}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-[#E85A4F]" /> {formatDateTime(r.event.scheduleStart)}
                        </span>
                      </div>
                      {r.team && (
                        <p className="text-[11px] font-bold text-[#E85A4F]">
                          Squad: {r.team.name} ({r.team.code})
                        </p>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#8E8D8A]/15">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase ${
                          r.status === "ATTENDED"
                            ? "bg-emerald-600 text-white"
                            : r.status === "CONFIRMED"
                            ? "bg-[#1A1918] text-[#EAE7DC]"
                            : "bg-amber-600 text-white"
                        }`}
                      >
                        {r.status}
                      </span>
                      <span className="text-[10px] text-[#8E8D8A] font-bold">
                        {r.registrationNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Digital QR Pass */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-5 text-center font-mono">
            <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-3 text-left">
              <span className="text-xs font-bold uppercase text-[#1A1918] flex items-center gap-1.5">
                <QrCode className="h-4 w-4 text-[#E85A4F]" /> Official QR Badge
              </span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase">VERIFIED</span>
            </div>

            <div className="rounded-2xl border border-[#8E8D8A]/30 bg-[#EAE7DC] p-6 space-y-3 shadow-inner">
              <div className="w-24 h-24 mx-auto rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/30 flex items-center justify-center p-2 shadow-sm">
                <QrCode className="w-full h-full text-[#1A1918]" />
              </div>
              <div>
                <p className="text-base font-black text-[#1A1918] tracking-wider">
                  {profile?.participantId ?? user.participantId ?? "AST26-0005"}
                </p>
                <p className="text-[11px] text-[#8E8D8A] uppercase font-bold">
                  {profile?.branch} · Sem {profile?.semester}
                </p>
              </div>
              <p className="text-[10px] text-[#8E8D8A] pt-1 border-t border-[#8E8D8A]/20">
                Encrypted with HMAC SHA-256 for instant gate &amp; event check-in scanning.
              </p>
            </div>

            <div className="space-y-2">
              <Link href="/profile" className="block">
                <button className="w-full py-2.5 px-4 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer">
                  Edit Profile &amp; Avatar
                </button>
              </Link>
              <Link href="/api/qr/issue" target="_blank" className="block">
                <button className="w-full py-2.5 px-4 rounded-xl bg-[#E85A4F] text-white text-xs font-bold uppercase hover:bg-[#C94A40] transition-all cursor-pointer">
                  Open Encrypted Ticket Pass
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-5 font-mono">
        <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-4">
          <div>
            <h2 className="text-base font-bold uppercase text-[#1A1918] flex items-center gap-2">
              <Award className="h-5 w-5 text-[#E85A4F]" />
              Earned Certificates &amp; Honors
            </h2>
            <p className="text-xs text-[#8E8D8A] mt-0.5">
              Verifiable PDF certificates with cryptographic digital verification signatures.
            </p>
          </div>
          <Link href="/verify-certificate" className="text-xs font-bold text-[#E85A4F] hover:underline">
            Public Verification Portal →
          </Link>
        </div>

        {certificates.length === 0 ? (
          <div className="rounded-2xl border border-[#8E8D8A]/20 bg-[#EAE7DC] p-8 text-center space-y-2">
            <Award className="h-7 w-7 text-[#8E8D8A] mx-auto" />
            <p className="text-xs font-bold text-[#1A1918] uppercase">No certificates issued yet</p>
            <p className="text-[11px] text-[#8E8D8A]">
              Certificates of Excellence, Participation, and Merit are auto-generated as coordinators publish event results.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#1A1918] uppercase">{c.title}</p>
                  <p className="text-xs text-[#8E8D8A]">
                    {c.eventName} · {c.category}
                  </p>
                  <p className="text-[10px] font-bold text-[#E85A4F]">{c.certificateNumber}</p>
                </div>
                <Link
                  href={`/verify-certificate/${c.certificateNumber}`}
                  target="_blank"
                  className="p-2.5 rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/30 text-[#1A1918] hover:bg-[#E85A4F] hover:text-white transition-all shrink-0"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  isBadge,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  isBadge?: boolean;
}) {
  return (
    <div className="p-5 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-2 font-mono">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-[#8E8D8A] uppercase font-bold">{label}</span>
        {icon}
      </div>
      <p className={`text-xl sm:text-2xl font-black text-[#1A1918] ${isBadge ? "text-sm sm:text-base font-bold text-[#E85A4F]" : ""}`}>
        {value}
      </p>
    </div>
  );
}

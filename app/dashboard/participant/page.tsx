// ============================================================================
// ASTITVA 2K26 - Participant Dashboard (Live Supabase Realtime Sync)
// Path: app/dashboard/participant/page.tsx
// ============================================================================

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { getUserCertificates } from "@/lib/certificates/actions";
import {
  ParticipantRealtimeDeck,
  type ParticipantRegistrationItem,
  type ParticipantCertificateItem,
} from "@/components/dashboard/ParticipantRealtimeDeck";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Participant Command Center | ASTITVA 2K26",
  description: "View your active festival registrations, encrypted digital pass, and verified certificates in realtime.",
};

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

  const initialRegistrations: ParticipantRegistrationItem[] = registrations.map((r) => ({
    id: r.id,
    registrationNumber: r.registrationNumber,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    event: {
      id: r.event.id,
      title: r.event.title,
      venue: r.event.venue,
      dayNumber: r.event.dayNumber,
      scheduleStart: r.event.scheduleStart.toISOString(),
      status: r.event.status,
      category: r.event.category ? { name: r.event.category.name } : null,
    },
    team: r.team ? { name: r.team.name } : null,
  }));

  const initialCertificates: ParticipantCertificateItem[] = certificates.map((c) => ({
    id: c.id,
    certificateNumber: c.certificateNumber,
    type: c.type,
    positionTitle: c.positionTitle,
    eventTitle: c.eventTitle,
    issuedAt: c.issuedAt.toISOString(),
  }));

  return (
    <ParticipantRealtimeDeck
      initialRegistrations={initialRegistrations}
      initialCertificates={initialCertificates}
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
      }}
      profile={{
        participantId: profile.participantId,
        branch: profile.branch,
        collegeId: profile.collegeId,
      }}
    />
  );
}

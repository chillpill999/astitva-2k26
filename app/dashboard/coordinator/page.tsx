import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import {
  CoordinatorRealtimeDeck,
  type CoordinatorEventItem,
  type CoordinatorRegistrationItem,
  type CoordinatorAttendanceItem,
} from "@/components/coordinator/CoordinatorRealtimeDeck";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Coordinator Command Deck | ASTITVA 2K26",
  description: "Manage assigned events, view live student registrations, monitor game arena attendance, and broadcast live scores in realtime.",
};

export default async function CoordinatorDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/dashboard/coordinator");
  if (!["EVENT_COORDINATOR", "ADMIN"].includes(user.role)) {
    redirect("/unauthorized?attempted=/dashboard/coordinator");
  }

  // Admin sees all events; coordinators only their own (or unassigned)
  const eventWhere =
    user.role === "ADMIN"
      ? undefined
      : { OR: [{ coordinatorId: user.id }, { coordinatorId: null }] };

  let eventsRaw: any[] = [];
  let registrationsRaw: any[] = [];
  let attendancesRaw: any[] = [];

  try {
    eventsRaw = await prisma.event.findMany({
      where: eventWhere,
      include: {
        category: true,
        _count: { select: { registrations: true, results: true, attendances: true } },
      },
      orderBy: [{ dayNumber: "asc" }, { scheduleStart: "asc" }],
      take: 50,
    });

    const eventIds = eventsRaw.map((e) => e.id);

    // Fetch live registrations for assigned sports
    registrationsRaw = await prisma.registration.findMany({
      where: user.role === "ADMIN" ? undefined : { eventId: { in: eventIds } },
      include: {
        event: { select: { title: true } },
        user: { include: { profile: true } },
        team: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 60,
    });

    // Fetch live game arena attendances / scans
    attendancesRaw = await prisma.attendance.findMany({
      where: user.role === "ADMIN" ? undefined : { eventId: { in: eventIds } },
      include: {
        event: { select: { title: true } },
        user: { select: { name: true } },
      },
      orderBy: { scannedAt: "desc" },
      take: 60,
    });
  } catch {
    eventsRaw = [];
    registrationsRaw = [];
    attendancesRaw = [];
  }

  const initialEvents: CoordinatorEventItem[] = eventsRaw.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    subtitle: e.subtitle,
    venue: e.venue,
    dayNumber: e.dayNumber,
    status: e.status,
    eventType: e.eventType,
    maxRegistrations: e.maxRegistrations,
    currentRegistrations: e.currentRegistrations,
    categoryName: e.category?.name || "Event",
    categorySlug: e.category?.slug || "sports",
    registrationCount: e._count?.registrations ?? e.currentRegistrations ?? 0,
    attendanceCount: e._count?.attendances ?? 0,
    resultsCount: e._count?.results ?? 0,
  }));

  const initialRegistrations: CoordinatorRegistrationItem[] = registrationsRaw.map((r) => ({
    id: r.id,
    eventId: r.eventId,
    eventTitle: r.event?.title || "Tournament",
    userId: r.userId,
    participantName: r.user?.name || "Student",
    participantId: r.user?.profile?.participantId || "AST26-0000",
    collegeId: r.user?.profile?.collegeId || undefined,
    branch: r.user?.profile?.branch || undefined,
    teamName: r.team?.name || null,
    status: r.status,
    registrationNumber: r.registrationNumber,
    createdAt: r.createdAt.toISOString(),
  }));

  const initialAttendances: CoordinatorAttendanceItem[] = attendancesRaw.map((a) => ({
    id: a.id,
    eventId: a.eventId,
    eventTitle: a.event?.title || "Arena Match",
    participantId: a.participantId,
    participantName: a.user?.name || null,
    status: a.status,
    checkInType: a.checkInType,
    scannedAt: a.scannedAt.toISOString(),
  }));

  return (
    <CoordinatorRealtimeDeck
      initialEvents={initialEvents}
      initialRegistrations={initialRegistrations}
      initialAttendances={initialAttendances}
      userName={user.name}
      userRole={user.role}
    />
  );
}

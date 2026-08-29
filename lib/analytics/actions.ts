// ============================================================================
// ASTITVA 2K26 - Admin Analytics Server Actions
// Path: lib/analytics/actions.ts
// ============================================================================

"use server";

import { prisma } from "@/lib/db/prisma";
import { recordAudit } from "@/lib/security/audit";
import { getRequestContext } from "@/lib/security/context";

export interface AnalyticsOverview {
  totals: {
    users: number;
    participants: number;
    events: number;
    registrations: number;
    teams: number;
    attendance: number;
    certificates: number;
    announcements: number;
    results: number;
  };
  registrationVelocity: Array<{ day: string; count: number }>;
  branchDistribution: Array<{ branch: string; count: number }>;
  genderDistribution: Array<{ gender: string; count: number }>;
  categoryPopularity: Array<{ category: string; count: number }>;
  attendanceRate: number;
  topScoringEvents: Array<{ id: string; title: string; category: string; checkIns: number; registered: number }>;
}

export async function getAdminAnalytics(): Promise<AnalyticsOverview> {
  try {
    const ctx = await getRequestContext();

    const [
      users,
      participants,
      events,
      registrations,
      teams,
      attendance,
      certificates,
      announcements,
      results,
      velocity,
      branchDist,
      genderDist,
      catPop,
      topEvents,
    ] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }).catch(() => 0),
      prisma.profile.count().catch(() => 0),
      prisma.event.count().catch(() => 0),
      prisma.registration.count().catch(() => 0),
      prisma.team.count().catch(() => 0),
      prisma.attendance.count().catch(() => 0),
      prisma.certificate.count().catch(() => 0),
      prisma.announcement.count({ where: { isActive: true } }).catch(() => 0),
      prisma.result.count().catch(() => 0),
      registrationVelocity().catch(() => []),
      branchDistribution().catch(() => []),
      genderDistribution().catch(() => []),
      categoryPopularity().catch(() => []),
      topScoringEvents().catch(() => []),
    ]);

    if (ctx.user) {
      await recordAudit({
        action: "ADMIN_ANALYTICS_VIEW",
        userId: ctx.user.id,
        userEmail: ctx.user.email,
        resource: "analytics:overview",
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
      }).catch(() => null);
    }

    const attendanceRate = registrations > 0 ? Math.round((attendance / registrations) * 1000) / 10 : 0;

    return {
      totals: {
        users,
        participants,
        events,
        registrations,
        teams,
        attendance,
        certificates,
        announcements,
        results,
      },
      registrationVelocity: velocity,
      branchDistribution: branchDist,
      genderDistribution: genderDist,
      categoryPopularity: catPop,
      attendanceRate,
      topScoringEvents: topEvents,
    };
  } catch (err) {
    console.error("getAdminAnalytics execution error:", err);
    return emptyOverview();
  }
}

function emptyOverview(): AnalyticsOverview {
  return {
    totals: {
      users: 0,
      participants: 0,
      events: 0,
      registrations: 0,
      teams: 0,
      attendance: 0,
      certificates: 0,
      announcements: 0,
      results: 0,
    },
    registrationVelocity: [],
    branchDistribution: [],
    genderDistribution: [],
    categoryPopularity: [],
    attendanceRate: 0,
    topScoringEvents: [],
  };
}

async function registrationVelocity() {
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const rows = await prisma.registration.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  });
  const buckets = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(5, 10); // MM-DD
    buckets.set(key, 0);
  }
  for (const r of rows) {
    const key = r.createdAt.toISOString().slice(5, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return Array.from(buckets.entries()).map(([day, count]) => ({ day, count }));
}

async function branchDistribution() {
  const rows = await prisma.profile.groupBy({
    by: ["branch"],
    _count: { branch: true },
  });
  return rows.map((r) => ({ branch: String(r.branch), count: r._count.branch }));
}

async function genderDistribution() {
  const rows = await prisma.profile.groupBy({
    by: ["gender"],
    _count: { gender: true },
  });
  return rows.map((r) => ({ gender: String(r.gender), count: r._count.gender }));
}

async function categoryPopularity() {
  const events = await prisma.event.findMany({
    include: { category: true, _count: { select: { registrations: true } } },
  });
  const map = new Map<string, number>();
  for (const e of events) {
    map.set(e.category.name, (map.get(e.category.name) ?? 0) + e._count.registrations);
  }
  return Array.from(map.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

async function topScoringEvents() {
  const events = await prisma.event.findMany({
    include: {
      category: { select: { name: true } },
      _count: { select: { registrations: true, attendances: true } },
    },
  });
  return events
    .map((e) => ({
      id: e.id,
      title: e.title,
      category: e.category.name,
      checkIns: e._count.attendances,
      registered: e._count.registrations,
    }))
    .sort((a, b) => b.checkIns - a.checkIns)
    .slice(0, 8);
}

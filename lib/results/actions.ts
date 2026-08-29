// ============================================================================
// ASTITVA 2K26 - Results & Leaderboard Server Actions
// Path: lib/results/actions.ts
// ============================================================================

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { Prisma, ResultPosition } from "@prisma/client";
import { RecordResultSchema, DeleteResultSchema } from "./schema";
import { recordAudit } from "@/lib/security/audit";
import { getRequestContext } from "@/lib/security/context";
import { issueCertificate } from "@/lib/certificates/actions";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: Record<string, string[]>;
}

const POINTS_BY_POSITION: Record<ResultPosition, number> = {
  WINNER: 10,
  FIRST_RUNNER_UP: 6,
  SECOND_RUNNER_UP: 3,
  FINALIST: 1,
  PARTICIPANT: 0,
};

const POINTS_BY_RANK: Record<number, ResultPosition> = {
  1: "WINNER",
  2: "FIRST_RUNNER_UP",
  3: "SECOND_RUNNER_UP",
};

async function requireCoordinator() {
  const ctx = await getRequestContext();
  if (!ctx.user) {
    throw new Error("Authentication required");
  }
  if (!["EVENT_COORDINATOR", "ADMIN"].includes(ctx.user.role)) {
    throw new Error("Insufficient permissions");
  }
  return ctx;
}

export async function recordEventResults(
  rawInput: unknown
): Promise<ActionResult<{ eventId: string; results: Array<{ id: string; rank: number; positionTitle: string }> }>> {
  const ctx = await getRequestContext();
  if (!ctx.user) return { success: false, error: "Authentication required" };
  if (!["EVENT_COORDINATOR", "ADMIN"].includes(ctx.user.role)) {
    return { success: false, error: "Insufficient permissions" };
  }

  const parsed = RecordResultSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid results payload",
      validationErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const { eventId, results } = parsed.data;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, title: true, eventType: true, categoryId: true, coordinatorId: true },
  });
  if (!event) return { success: false, error: "Event not found" };

  // RBAC: coordinator can only record results for their own events
  if (
    ctx.user.role === "EVENT_COORDINATOR" &&
    event.coordinatorId &&
    event.coordinatorId !== ctx.user.id
  ) {
    return { success: false, error: "You are not the coordinator of this event." };
  }

  // Validate result shape per event type
  for (const r of results) {
    if (event.eventType === "TEAM" && !r.teamId) {
      return { success: false, error: `Rank ${r.rank} requires teamId for a team event.` };
    }
    if (event.eventType === "INDIVIDUAL" && !r.userId) {
      return { success: false, error: `Rank ${r.rank} requires userId for an individual event.` };
    }
  }

  // Upsert each result
  const created: Array<{ id: string; rank: number; positionTitle: string }> = [];
  await prisma.$transaction(async (tx) => {
    for (const r of results) {
      const position = POINTS_BY_RANK[r.rank] ?? r.positionTitle;
      const row = await tx.result.upsert({
        where: {
          eventId_rank: { eventId: event.id, rank: r.rank },
        },
        create: {
          eventId: event.id,
          rank: r.rank,
          positionTitle: position,
          userId: r.userId ?? null,
          teamId: r.teamId ?? null,
          score: r.score ?? null,
          prizeAwarded: r.prizeAwarded ?? null,
          notes: r.notes ?? null,
          certificateIssued: false,
        },
        update: {
          positionTitle: position,
          userId: r.userId ?? null,
          teamId: r.teamId ?? null,
          score: r.score ?? null,
          prizeAwarded: r.prizeAwarded ?? null,
          notes: r.notes ?? null,
          publishedAt: new Date(),
        },
      });
      created.push({ id: row.id, rank: row.rank, positionTitle: row.positionTitle });

      // For individual events, also confirm attendance-style flag
      if (event.eventType === "INDIVIDUAL" && r.userId) {
        await tx.registration.updateMany({
          where: { eventId: event.id, userId: r.userId, status: { in: ["CONFIRMED", "ATTENDED"] } },
          data: { status: "ATTENDED" },
        });
      }
    }
    // Mark event as completed
    await tx.event.update({
      where: { id: event.id },
      data: { status: "COMPLETED" },
    });
  });

  await recordAudit({
    action: "RESULT_PUBLISHED",
    userId: ctx.user.id,
    userEmail: ctx.user.email,
    resource: `event:${event.id}`,
    details: { resultsCount: created.length },
    ipAddress: ctx.ipAddress,
    userAgent: ctx.userAgent,
  });

  revalidatePath("/results");
  revalidatePath(`/results/${event.id}`);
  revalidatePath("/leaderboard");
  revalidatePath(`/events/${event.id}`);
  revalidatePath(`/events/${event.id}/results`);

  // Auto-issue certificates for individual winners (best-effort, non-blocking)
  if (event.eventType === "INDIVIDUAL") {
    for (const r of results) {
      if (r.userId) {
        try {
          await issueCertificate({
            userId: r.userId,
            eventId: event.id,
            type: POINTS_BY_RANK[r.rank],
          });
        } catch {
          // ignore — issuance failures must not block the result publish
        }
      }
    }
  }

  return { success: true, data: { eventId, results: created } };
}

export async function deleteResult(rawInput: unknown): Promise<ActionResult<{ id: string }>> {
  const ctx = await getRequestContext();
  if (!ctx.user) return { success: false, error: "Authentication required" };
  if (!["EVENT_COORDINATOR", "ADMIN"].includes(ctx.user.role)) {
    return { success: false, error: "Insufficient permissions" };
  }
  const parsed = DeleteResultSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid delete payload",
      validationErrors: parsed.error.flatten().fieldErrors,
    };
  }
  await prisma.result.delete({ where: { id: parsed.data.resultId } });
  revalidatePath("/results");
  revalidatePath("/leaderboard");
  return { success: true, data: { id: parsed.data.resultId } };
}

// ----------------------------------------------------------------------------
// Public read APIs
// ----------------------------------------------------------------------------

export interface EventResultEntry {
  id: string;
  rank: number;
  positionTitle: ResultPosition;
  score: string | null;
  prizeAwarded: string | null;
  notes: string | null;
  publishedAt: string;
  winner: {
    kind: "user" | "team";
    id: string;
    name: string;
    branch?: string;
    collegeId?: string;
    participantId?: string;
    members?: Array<{ participantId: string; name: string; branch: string }>;
  } | null;
}

export interface EventResultSummary {
  id: string;
  title: string;
  eventType: "INDIVIDUAL" | "TEAM";
  category: string;
  categorySlug: string;
  venue: string;
  dayNumber: number;
  scheduleStart: string;
  results: EventResultEntry[];
}

export async function getEventResults(eventId: string): Promise<EventResultSummary | null> {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        category: true,
        results: {
          orderBy: { rank: "asc" },
          include: {
            user: { include: { profile: true } },
            team: {
              include: {
                members: {
                  include: { user: { include: { profile: true } } },
                },
              },
            },
          },
        },
      },
    });
    if (!event) return null;
    return {
      id: event.id,
      title: event.title,
      eventType: event.eventType as "INDIVIDUAL" | "TEAM",
      category: event.category.name,
      categorySlug: event.category.slug,
      venue: event.venue,
      dayNumber: event.dayNumber,
      scheduleStart: event.scheduleStart.toISOString(),
      results: event.results.map((r) => ({
        id: r.id,
        rank: r.rank,
        positionTitle: r.positionTitle,
        score: r.score,
        prizeAwarded: r.prizeAwarded,
        notes: r.notes,
        publishedAt: r.publishedAt.toISOString(),
        winner: r.user
          ? {
              kind: "user" as const,
              id: r.user.id,
              name: r.user.name,
              branch: r.user.profile?.branch,
              collegeId: r.user.profile?.collegeId,
              participantId: r.user.profile?.participantId,
            }
          : r.team
          ? {
              kind: "team" as const,
              id: r.team.id,
              name: r.team.name,
              members: r.team.members.map((m) => ({
                participantId: m.user.profile?.participantId ?? "",
                name: m.user.name,
                branch: String(m.user.profile?.branch ?? ""),
              })),
            }
          : null,
      })),
    };
  } catch {
    return null;
  }
}

export interface CategoryLeaderboard {
  category: string;
  slug: string;
  events: Array<{
    id: string;
    title: string;
    winners: Array<{ rank: number; name: string; kind: "user" | "team" }>;
  }>;
  topParticipants: Array<{ userId: string; name: string; points: number; branch?: string }>;
  topTeams: Array<{ teamId: string; name: string; points: number }>;
}

const DEFAULT_CATEGORY_BOARDS: CategoryLeaderboard[] = [
  {
    category: "Sports Championship",
    slug: "sports",
    events: [
      { id: "evt-cricket", title: "Cricket Championship (T20)", winners: [] },
      { id: "evt-football", title: "Football Tournament", winners: [] },
      { id: "evt-volleyball", title: "Volleyball Spikers Cup", winners: [] },
      { id: "evt-badminton", title: "Badminton Open (Singles & Doubles)", winners: [] },
      { id: "evt-chess", title: "Grandmaster Chess Blitz", winners: [] },
    ],
    topParticipants: [],
    topTeams: [],
  },
  {
    category: "Cultural & Arts",
    slug: "cultural",
    events: [
      { id: "evt-dance", title: "Solo & Group Dance Battle", winners: [] },
      { id: "evt-singing", title: "Voice of Astitva (Singing)", winners: [] },
      { id: "evt-comedy", title: "Stand-Up Comedy Spotlight", winners: [] },
      { id: "evt-rampwalk", title: "Fashion Odyssey (Ramp Walk)", winners: [] },
    ],
    topParticipants: [],
    topTeams: [],
  },
  {
    category: "Esports & Gaming",
    slug: "gaming",
    events: [
      { id: "evt-bgmi", title: "BGMI Mobile Championship", winners: [] },
      { id: "evt-freefire", title: "Free Fire Battle Arena", winners: [] },
    ],
    topParticipants: [],
    topTeams: [],
  },
  {
    category: "Literary Arena",
    slug: "literary",
    events: [
      { id: "evt-debate", title: "National Parliamentary Debate", winners: [] },
      { id: "evt-quiz", title: "Mega Tech & General Quiz", winners: [] },
      { id: "evt-poetry", title: "Kavyanjali (Poetry Slam)", winners: [] },
      { id: "evt-writing", title: "Creative Writing Challenge", winners: [] },
    ],
    topParticipants: [],
    topTeams: [],
  },
];

export async function getLeaderboard(): Promise<CategoryLeaderboard[]> {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        events: {
          include: {
            results: {
              orderBy: { rank: "asc" },
              include: {
                user: { include: { profile: true } },
                team: true,
              },
            },
          },
          orderBy: [{ dayNumber: "asc" }, { scheduleStart: "asc" }],
        },
      },
    });

    if (!categories || categories.length === 0) {
      return DEFAULT_CATEGORY_BOARDS;
    }

    return categories.map((cat) => {
      const userPoints = new Map<string, { name: string; points: number; branch?: string }>();
      const teamPoints = new Map<string, { name: string; points: number }>();
      const events = cat.events.map((e) => {
        const winners = e.results.map((r) => {
          if (r.user) {
            const cur = userPoints.get(r.user.id) ?? {
              name: r.user.name,
              points: 0,
              branch: r.user.profile?.branch,
            };
            cur.points += POINTS_BY_POSITION[r.positionTitle];
            userPoints.set(r.user.id, cur);
            return {
              rank: r.rank,
              name: r.user.name,
              kind: "user" as const,
            };
          }
          if (r.team) {
            const cur = teamPoints.get(r.team.id) ?? { name: r.team.name, points: 0 };
            cur.points += POINTS_BY_POSITION[r.positionTitle];
            teamPoints.set(r.team.id, cur);
            return {
              rank: r.rank,
              name: r.team.name,
              kind: "team" as const,
            };
          }
          return null;
        }).filter(Boolean) as Array<{ rank: number; name: string; kind: "user" | "team" }>;
        return { id: e.id, title: e.title, winners };
      });

      return {
        category: cat.name,
        slug: cat.slug,
        events,
        topParticipants: Array.from(userPoints.entries())
          .map(([userId, v]) => ({ userId, ...v }))
          .sort((a, b) => b.points - a.points)
          .slice(0, 10),
        topTeams: Array.from(teamPoints.entries())
          .map(([teamId, v]) => ({ teamId, ...v }))
          .sort((a, b) => b.points - a.points)
          .slice(0, 10),
      };
    });
  } catch {
    return DEFAULT_CATEGORY_BOARDS;
  }
}

export interface BranchStanding {
  branch: string;
  points: number;
  wins: number;
  totalPodiums: number;
}

const BRANCH_FULL_NAMES: Record<string, string> = {
  CSE: "Computer Science & Engineering (CSE)",
  ME: "Mechanical Engineering (ME)",
  CE: "Civil Engineering (CE)",
  EE: "Electrical Engineering (EE)",
  FPP: "Food Processing & Preservation (FPP)",
  MC: "Mathematics and Computing (MC)",
  OTHER: "Applied Science & Humanities (OTHER)",
};

const DEFAULT_BRANCH_STANDINGS: BranchStanding[] = [
  { branch: "Computer Science & Engineering (CSE)", points: 0, wins: 0, totalPodiums: 0 },
  { branch: "Mechanical Engineering (ME)", points: 0, wins: 0, totalPodiums: 0 },
  { branch: "Civil Engineering (CE)", points: 0, wins: 0, totalPodiums: 0 },
  { branch: "Electrical Engineering (EE)", points: 0, wins: 0, totalPodiums: 0 },
  { branch: "Food Processing & Preservation (FPP)", points: 0, wins: 0, totalPodiums: 0 },
  { branch: "Mathematics and Computing (MC)", points: 0, wins: 0, totalPodiums: 0 },
];

export async function getBranchStandings(): Promise<BranchStanding[]> {
  try {
    const results = await prisma.result.findMany({
      where: { userId: { not: null } },
      include: { user: { include: { profile: true } } },
    });
    if (!results || results.length === 0) {
      return DEFAULT_BRANCH_STANDINGS;
    }
    const agg = new Map<string, { points: number; wins: number; totalPodiums: number }>();
    for (const r of results) {
      const rawBranch = r.user?.profile?.branch;
      if (!rawBranch) continue;
      const branch = BRANCH_FULL_NAMES[rawBranch] || rawBranch;
      const cur = agg.get(branch) ?? { points: 0, wins: 0, totalPodiums: 0 };
      cur.points += POINTS_BY_POSITION[r.positionTitle] || 0;
      cur.totalPodiums += 1;
      if (r.rank === 1) cur.wins += 1;
      agg.set(branch, cur);
    }
    const list = Array.from(agg.entries())
      .map(([branch, v]) => ({ branch, ...v }))
      .sort((a, b) => b.points - a.points);
    return list.length > 0 ? list : DEFAULT_BRANCH_STANDINGS;
  } catch {
    return DEFAULT_BRANCH_STANDINGS;
  }
}

export async function getAllEventsWithResults(): Promise<
  Array<{ id: string; title: string; category: string; slug: string; dayNumber: number; hasResults: boolean }>
> {
  try {
    const events = await prisma.event.findMany({
      orderBy: [{ dayNumber: "asc" }, { scheduleStart: "asc" }],
      include: { category: true, results: { select: { id: true } } },
    });
    return events.map((e) => ({
      id: e.id,
      title: e.title,
      category: e.category.name,
      slug: e.slug,
      dayNumber: e.dayNumber,
      hasResults: e.results.length > 0,
    }));
  } catch {
    return [
      { id: "evt-cricket", title: "Cricket Championship", category: "Sports Championship", slug: "cricket-championship", dayNumber: 1, hasResults: false },
      { id: "evt-football", title: "Football Tournament", category: "Sports Championship", slug: "football-tournament", dayNumber: 2, hasResults: false },
      { id: "evt-bgmi", title: "BGMI Mobile Championship", category: "Esports & Gaming", slug: "bgmi-esports-championship", dayNumber: 3, hasResults: false },
      { id: "evt-dance", title: "Solo & Group Dance Battle", category: "Cultural & Arts", slug: "dance-competition", dayNumber: 4, hasResults: false },
    ];
  }
}

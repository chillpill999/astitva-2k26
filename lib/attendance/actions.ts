// ============================================================================
// ASTITVA 2K26 - Attendance / Volunteer Scanner Server Actions
// Path: lib/attendance/actions.ts
// ============================================================================

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import {
  ScanRequestSchema,
  ManualLookupSchema,
  RevokePassSchema,
  PassQuerySchema,
  type ScanRequest,
  type ManualLookupRequest,
} from "@/lib/qr/schema";
import { verifyQrToken, hashTokenDigest } from "@/lib/qr/crypto";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { recordAudit } from "@/lib/security/audit";
import { getRequestContext } from "@/lib/security/context";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: Record<string, string[]>;
}

export type ScanOutcomeCode =
  | "SUCCESS"
  | "ALREADY_CHECKED_IN"
  | "INVALID_TOKEN"
  | "NOT_REGISTERED"
  | "QR_EXPIRED"
  | "REVOKED"
  | "RATE_LIMITED";

export interface ScanOutcome {
  code: ScanOutcomeCode;
  message: string;
  participant?: {
    participantId: string;
    name: string;
    branch: string;
    semester: number;
    collegeId: string;
  };
  event?: {
    id: string;
    title: string;
    venue: string;
  };
  attendanceId?: string;
  checkedInAt?: string;
}

const SCAN_RATE_BUCKET = (userId: string, eventId?: string) =>
  `scan:${userId}:${eventId ?? "global"}`;

async function writeCheckInLog(args: {
  scannerId: string;
  scannerName?: string | null;
  participantId: string;
  eventId?: string | null;
  action: string;
  result: "SUCCESS" | "WARNING" | "REJECTED";
  reason?: string;
  qrPassId?: string | null;
  attendanceId?: string | null;
  qrTokenDigest?: string;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  await prisma.checkInLog.create({
    data: {
      scannerId: args.scannerId,
      scannerName: args.scannerName ?? undefined,
      participantId: args.participantId,
      eventId: args.eventId ?? null,
      action: args.action,
      result: args.result,
      reason: args.reason,
      qrPassId: args.qrPassId ?? null,
      attendanceId: args.attendanceId ?? null,
      qrTokenDigest: args.qrTokenDigest,
      deviceInfo: args.deviceInfo,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
    },
  });
}

async function resolveEventForScan(
  eventId: string | undefined,
  payloadEventId: string | null,
  participantId: string
): Promise<
  | { ok: true; event: { id: string; title: string; venue: string } }
  | { ok: false; code: "NOT_FOUND" | "NOT_REGISTERED" }
> {
  let resolvedEventId = eventId ?? payloadEventId ?? undefined;

  // Resolve participant → userId for registration lookup
  const profile = await prisma.profile.findUnique({
    where: { participantId },
    select: { userId: true },
  });
  if (!profile) return { ok: false, code: "NOT_REGISTERED" };
  const userId = profile.userId;

  if (!resolvedEventId) {
    // Fall back to the user's most recent confirmed registration
    const recent = await prisma.registration.findFirst({
      where: { userId, status: { in: ["CONFIRMED", "ATTENDED"] } },
      orderBy: { createdAt: "desc" },
      select: { eventId: true },
    });
    if (!recent) return { ok: false, code: "NOT_REGISTERED" };
    resolvedEventId = recent.eventId;
  }
  const event = await prisma.event.findUnique({
    where: { id: resolvedEventId },
    select: { id: true, title: true, venue: true },
  });
  if (!event) return { ok: false, code: "NOT_FOUND" };

  // Verify registration
  const reg = await prisma.registration.findFirst({
    where: {
      eventId: event.id,
      userId,
      status: { in: ["CONFIRMED", "ATTENDED"] },
    },
  });
  if (!reg) return { ok: false, code: "NOT_REGISTERED" };

  return { ok: true, event };
}

export async function scanQrToken(
  rawInput: unknown
): Promise<ActionResult<ScanOutcome>> {
  const ctx = await getRequestContext();
  if (!ctx.user) {
    return { success: false, error: "Authentication required to scan." };
  }
  if (!["VOLUNTEER", "EVENT_COORDINATOR", "ADMIN"].includes(ctx.user.role)) {
    return { success: false, error: "Insufficient permissions to scan badges." };
  }

  const parsed = ScanRequestSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid scan payload",
      validationErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const input: ScanRequest = parsed.data;

  const rate = await checkRateLimit({
    bucket: SCAN_RATE_BUCKET(ctx.user.id, input.eventId),
    max: 30,
    windowSeconds: 60,
  });
  if (!rate.allowed) {
    await writeCheckInLog({
      scannerId: ctx.user.id,
      scannerName: ctx.user.name,
      participantId: "unknown",
      eventId: input.eventId,
      action: "RATE_LIMITED",
      result: "REJECTED",
      reason: "Rate limit exceeded",
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
    });
    await recordAudit({
      action: "QR_SCAN_RATE_LIMITED",
      userId: ctx.user.id,
      userEmail: ctx.user.email,
      resource: input.eventId ?? "global",
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
    });
    return {
      success: false,
      error: "Too many scans. Please slow down.",
    };
  }

  // 1) Verify cryptographic signature
  const verification = verifyQrToken(input.token);
  if (!verification.valid || !verification.payload) {
    const code: ScanOutcomeCode =
      verification.reason === "EXPIRED" ? "QR_EXPIRED" : "INVALID_TOKEN";
    const action =
      verification.reason === "EXPIRED" ? "QR_SCAN_EXPIRED" : "QR_SCAN_INVALID";
    await writeCheckInLog({
      scannerId: ctx.user.id,
      scannerName: ctx.user.name,
      participantId: verification.payload?.participantId ?? "unknown",
      eventId: input.eventId,
      action,
      result: "REJECTED",
      reason: verification.reason,
      qrTokenDigest: hashTokenDigest(input.token),
      deviceInfo: input.deviceInfo,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
    });
    await recordAudit({
      action,
      userId: ctx.user.id,
      userEmail: ctx.user.email,
      resource: `token:${hashTokenDigest(input.token)}`,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
    });
    return {
      success: false,
      data: {
        code,
        message:
          code === "QR_EXPIRED"
            ? "This QR pass has expired. Ask the participant to refresh their badge."
            : "Invalid token. The QR code is forged or has been tampered with.",
      },
    };
  }

  // 2) Verify the pass exists and is not revoked
  const pass = await prisma.qrPass.findUnique({
    where: { token: input.token },
    select: {
      id: true,
      participantId: true,
      eventId: true,
      isRevoked: true,
      expiresAt: true,
      scanCount: true,
    },
  });
  if (!pass || pass.isRevoked) {
    await writeCheckInLog({
      scannerId: ctx.user.id,
      scannerName: ctx.user.name,
      participantId: verification.payload.participantId,
      eventId: input.eventId,
      action: "QR_SCAN_REVOKED",
      result: "REJECTED",
      reason: pass?.isRevoked ? "Pass revoked" : "Pass not found",
      qrPassId: pass?.id,
      qrTokenDigest: hashTokenDigest(input.token),
      deviceInfo: input.deviceInfo,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
    });
    await recordAudit({
      action: "QR_SCAN_REVOKED",
      userId: ctx.user.id,
      userEmail: ctx.user.email,
      resource: `pass:${pass?.id ?? "missing"}`,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
    });
    return {
      success: false,
      data: { code: "REVOKED", message: "This QR pass has been revoked." },
    };
  }

  // 3) Resolve event and verify registration
  const eventResolution = await resolveEventForScan(
    input.eventId,
    verification.payload.eventId,
    verification.payload.participantId
  );
  if (!eventResolution.ok) {
    await writeCheckInLog({
      scannerId: ctx.user.id,
      scannerName: ctx.user.name,
      participantId: verification.payload.participantId,
      eventId: input.eventId,
      action: "QR_SCAN_NOT_REGISTERED",
      result: "REJECTED",
      reason: eventResolution.code,
      qrPassId: pass.id,
      qrTokenDigest: hashTokenDigest(input.token),
      deviceInfo: input.deviceInfo,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
    });
    await recordAudit({
      action: "QR_SCAN_NOT_REGISTERED",
      userId: ctx.user.id,
      userEmail: ctx.user.email,
      resource: `participant:${verification.payload.participantId}`,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
    });
    return {
      success: false,
      data: {
        code: "NOT_REGISTERED",
        message:
          eventResolution.code === "NOT_FOUND"
            ? "Event not found."
            : "This participant is not registered for this event.",
      },
    };
  }

  const event = eventResolution.event;

  // 4) Look up profile
  const profile = await prisma.profile.findUnique({
    where: { participantId: verification.payload.participantId },
    select: {
      participantId: true,
      collegeId: true,
      branch: true,
      semester: true,
      user: { select: { name: true } },
    },
  });
  if (!profile) {
    return {
      success: false,
      data: { code: "NOT_REGISTERED", message: "Profile not found." },
    };
  }

  // 5) Duplicate prevention
  const existingAttendance = await prisma.attendance.findUnique({
    where: {
      participantId_eventId_checkInType: {
        participantId: profile.participantId,
        eventId: event.id,
        checkInType: input.checkInType,
      },
    },
  });
  if (existingAttendance) {
    await writeCheckInLog({
      scannerId: ctx.user.id,
      scannerName: ctx.user.name,
      participantId: profile.participantId,
      eventId: event.id,
      action: "QR_SCAN_DUPLICATE",
      result: "WARNING",
      reason: "Already checked in",
      qrPassId: pass.id,
      attendanceId: existingAttendance.id,
      qrTokenDigest: hashTokenDigest(input.token),
      deviceInfo: input.deviceInfo,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
    });
    await recordAudit({
      action: "QR_SCAN_DUPLICATE",
      userId: ctx.user.id,
      userEmail: ctx.user.email,
      resource: `event:${event.id}:${profile.participantId}`,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
    });
    return {
      success: true,
      data: {
        code: "ALREADY_CHECKED_IN",
        message: "Already checked in for this event.",
        participant: {
          participantId: profile.participantId,
          name: profile.user.name,
          branch: String(profile.branch),
          semester: profile.semester,
          collegeId: profile.collegeId,
        },
        event,
        attendanceId: existingAttendance.id,
        checkedInAt: existingAttendance.scannedAt.toISOString(),
      },
    };
  }

  // 6) Persist attendance + update pass usage
  const attendance = await prisma.$transaction(async (tx) => {
    const created = await tx.attendance.create({
      data: {
        userId: verification.payload!.userId,
        participantId: profile.participantId,
        eventId: event.id,
        scannedById: ctx.user!.id,
        checkInType: input.checkInType,
        status: "PRESENT",
        deviceInfo: input.deviceInfo ?? null,
        qrPassId: pass.id,
      },
    });
    await tx.qrPass.update({
      where: { id: pass.id },
      data: {
        lastScannedAt: new Date(),
        scanCount: { increment: 1 },
      },
    });
    // Update registration status to ATTENDED
    await tx.registration.updateMany({
      where: {
        eventId: event.id,
        userId: verification.payload!.userId,
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      data: { status: "ATTENDED" },
    });
    return created;
  });

  await writeCheckInLog({
    scannerId: ctx.user.id,
    scannerName: ctx.user.name,
    participantId: profile.participantId,
    eventId: event.id,
    action: "QR_SCAN_SUCCESS",
    result: "SUCCESS",
    qrPassId: pass.id,
    attendanceId: attendance.id,
    qrTokenDigest: hashTokenDigest(input.token),
    deviceInfo: input.deviceInfo,
    ipAddress: ctx.ipAddress,
    userAgent: ctx.userAgent,
  });

  await recordAudit({
    action: "QR_SCAN_SUCCESS",
    userId: ctx.user.id,
    userEmail: ctx.user.email,
    resource: `event:${event.id}:${profile.participantId}`,
    details: { attendanceId: attendance.id },
    ipAddress: ctx.ipAddress,
    userAgent: ctx.userAgent,
  });

  revalidatePath("/dashboard/volunteer");
  revalidatePath("/dashboard/coordinator");
  revalidatePath("/dashboard/admin");

  return {
    success: true,
    data: {
      code: "SUCCESS",
      message: "Check-in recorded.",
      participant: {
        participantId: profile.participantId,
        name: profile.user.name,
        branch: String(profile.branch),
        semester: profile.semester,
        collegeId: profile.collegeId,
      },
      event,
      attendanceId: attendance.id,
      checkedInAt: attendance.scannedAt.toISOString(),
    },
  };
}

export async function manualLookupCheckIn(
  rawInput: unknown
): Promise<ActionResult<ScanOutcome>> {
  const ctx = await getRequestContext();
  if (!ctx.user) {
    return { success: false, error: "Authentication required to scan." };
  }
  if (!["VOLUNTEER", "EVENT_COORDINATOR", "ADMIN"].includes(ctx.user.role)) {
    return { success: false, error: "Insufficient permissions to scan badges." };
  }

  const parsed = ManualLookupSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid manual lookup",
      validationErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const input: ManualLookupRequest = parsed.data;

  const rate = await checkRateLimit({
    bucket: `manual:${ctx.user.id}`,
    max: 20,
    windowSeconds: 60,
  });
  if (!rate.allowed) {
    return { success: false, error: "Too many requests, slow down." };
  }

  // 1) Resolve participant
  const profile = await prisma.profile.findFirst({
    where: {
      OR: [
        { participantId: input.participantId.toUpperCase() },
        { collegeId: input.participantId },
      ],
    },
    select: {
      userId: true,
      participantId: true,
      collegeId: true,
      branch: true,
      semester: true,
      user: { select: { name: true } },
    },
  });
  if (!profile) {
    await writeCheckInLog({
      scannerId: ctx.user.id,
      scannerName: ctx.user.name,
      participantId: input.participantId.toUpperCase(),
      eventId: input.eventId,
      action: "QR_SCAN_NOT_REGISTERED",
      result: "REJECTED",
      reason: "Participant not found",
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
    });
    return {
      success: false,
      data: {
        code: "NOT_REGISTERED",
        message: "No participant matches that ID or roll number.",
      },
    };
  }

  // 2) Verify event and registration
  const eventResolution = await resolveEventForScan(
    input.eventId,
    null,
    profile.participantId
  );
  if (!eventResolution.ok) {
    return {
      success: false,
      data: {
        code: "NOT_REGISTERED",
        message:
          eventResolution.code === "NOT_FOUND"
            ? "Event not found."
            : "This participant is not registered for this event.",
      },
    };
  }
  const event = eventResolution.event;

  // 3) Duplicate prevention
  const existing = await prisma.attendance.findUnique({
    where: {
      participantId_eventId_checkInType: {
        participantId: profile.participantId,
        eventId: event.id,
        checkInType: input.checkInType,
      },
    },
  });
  if (existing) {
    await writeCheckInLog({
      scannerId: ctx.user.id,
      scannerName: ctx.user.name,
      participantId: profile.participantId,
      eventId: event.id,
      action: "QR_SCAN_DUPLICATE",
      result: "WARNING",
      reason: "Already checked in",
      attendanceId: existing.id,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
    });
    return {
      success: true,
      data: {
        code: "ALREADY_CHECKED_IN",
        message: "Already checked in for this event.",
        participant: {
          participantId: profile.participantId,
          name: profile.user.name,
          branch: String(profile.branch),
          semester: profile.semester,
          collegeId: profile.collegeId,
        },
        event,
        attendanceId: existing.id,
        checkedInAt: existing.scannedAt.toISOString(),
      },
    };
  }

  // 4) Create attendance
  const attendance = await prisma.attendance.create({
    data: {
      userId: profile.userId,
      participantId: profile.participantId,
      eventId: event.id,
      scannedById: ctx.user.id,
      checkInType: input.checkInType,
      status: "PRESENT",
      remarks: "manual_lookup",
    },
  });

  await prisma.registration.updateMany({
    where: {
      eventId: event.id,
      userId: profile.userId,
      status: { in: ["CONFIRMED", "PENDING"] },
    },
    data: { status: "ATTENDED" },
  });

  await writeCheckInLog({
    scannerId: ctx.user.id,
    scannerName: ctx.user.name,
    participantId: profile.participantId,
    eventId: event.id,
    action: "QR_SCAN_SUCCESS",
    result: "SUCCESS",
    attendanceId: attendance.id,
    ipAddress: ctx.ipAddress,
    userAgent: ctx.userAgent,
  });
  await recordAudit({
    action: "QR_SCAN_SUCCESS",
    userId: ctx.user.id,
    userEmail: ctx.user.email,
    resource: `manual:${profile.participantId}:${event.id}`,
    ipAddress: ctx.ipAddress,
    userAgent: ctx.userAgent,
  });

  revalidatePath("/dashboard/volunteer");
  revalidatePath("/dashboard/coordinator");
  revalidatePath("/dashboard/admin");

  return {
    success: true,
    data: {
      code: "SUCCESS",
      message: "Manual check-in recorded.",
      participant: {
        participantId: profile.participantId,
        name: profile.user.name,
        branch: String(profile.branch),
        semester: profile.semester,
        collegeId: profile.collegeId,
      },
      event,
      attendanceId: attendance.id,
      checkedInAt: attendance.scannedAt.toISOString(),
    },
  };
}

export async function revokeQrPass(
  rawInput: unknown
): Promise<ActionResult<{ passId: string }>> {
  const ctx = await getRequestContext();
  if (!ctx.user) return { success: false, error: "Authentication required." };
  if (!["ADMIN", "EVENT_COORDINATOR"].includes(ctx.user.role)) {
    return { success: false, error: "Insufficient permissions to revoke passes." };
  }
  const parsed = RevokePassSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid revocation payload",
      validationErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const { passId, reason } = parsed.data;

  await prisma.qrPass.update({
    where: { id: passId },
    data: {
      isRevoked: true,
      revokedReason: reason,
      revokedAt: new Date(),
      revokedById: ctx.user.id,
    },
  });
  await recordAudit({
    action: "QR_PASS_REVOKED",
    userId: ctx.user.id,
    userEmail: ctx.user.email,
    resource: `pass:${passId}`,
    details: { reason },
    ipAddress: ctx.ipAddress,
    userAgent: ctx.userAgent,
  });
  revalidatePath("/dashboard/admin");
  return { success: true, data: { passId } };
}

// ----------------------------------------------------------------------------
// Read-side helpers for the volunteer dashboard
// ----------------------------------------------------------------------------

export interface CheckInLogEntry {
  id: string;
  participantId: string;
  participantName: string | null;
  eventTitle: string | null;
  action: string;
  result: string;
  reason: string | null;
  timestamp: string;
}

export async function getRecentCheckInLogs(
  options: { take?: number; eventId?: string } = {}
): Promise<CheckInLogEntry[]> {
  const ctx = await getRequestContext();
  if (!ctx.user) return [];
  const take = Math.min(Math.max(options.take ?? 25, 1), 100);

  const logs = await prisma.checkInLog.findMany({
    where: options.eventId ? { eventId: options.eventId } : undefined,
    orderBy: { timestamp: "desc" },
    take,
    include: {
      event: { select: { title: true } },
    },
  });

  // Hydrate names by participantId
  const pids = Array.from(new Set(logs.map((l) => l.participantId).filter((p) => p !== "unknown")));
  const profiles = pids.length
    ? await prisma.profile.findMany({
        where: { participantId: { in: pids } },
        select: { participantId: true, user: { select: { name: true } } },
      })
    : [];
  const nameMap = new Map(profiles.map((p) => [p.participantId, p.user.name]));

  return logs.map((l) => ({
    id: l.id,
    participantId: l.participantId,
    participantName: nameMap.get(l.participantId) ?? null,
    eventTitle: l.event?.title ?? null,
    action: l.action,
    result: l.result,
    reason: l.reason,
    timestamp: l.timestamp.toISOString(),
  }));
}

export interface AttendanceMetrics {
  eventId: string | null;
  totalRegistered: number;
  totalCheckedIn: number;
  attendancePercent: number;
  remainingSeats: number;
  capacity: number | null;
  duplicateAttempts: number;
  invalidAttempts: number;
  recentVelocity: Array<{ hour: string; count: number }>;
}

export async function getAttendanceMetrics(
  eventId?: string | null
): Promise<AttendanceMetrics> {
  const ctx = await getRequestContext();
  if (!ctx.user) {
    return emptyMetrics(eventId ?? null);
  }

  if (eventId) {
    return metricsForEvent(eventId);
  }
  return metricsForFestival();
}

async function metricsForEvent(eventId: string): Promise<AttendanceMetrics> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, maxRegistrations: true, currentRegistrations: true },
  });
  const totalRegistered = event?.currentRegistrations ?? 0;
  const totalCheckedIn = await prisma.attendance.count({
    where: { eventId, checkInType: "EVENT_ENTRY", status: "PRESENT" },
  });
  const attendancePercent = totalRegistered
    ? Math.round((totalCheckedIn / totalRegistered) * 1000) / 10
    : 0;
  const duplicateAttempts = await prisma.checkInLog.count({
    where: { eventId, action: "QR_SCAN_DUPLICATE" },
  });
  const invalidAttempts = await prisma.checkInLog.count({
    where: {
      eventId,
      action: { in: ["QR_SCAN_INVALID", "QR_SCAN_REVOKED", "QR_SCAN_EXPIRED"] },
    },
  });

  return {
    eventId,
    totalRegistered,
    totalCheckedIn,
    attendancePercent,
    remainingSeats: event
      ? Math.max(0, event.maxRegistrations - totalRegistered)
      : 0,
    capacity: event?.maxRegistrations ?? null,
    duplicateAttempts,
    invalidAttempts,
    recentVelocity: await velocityBuckets({ eventId }),
  };
}

async function metricsForFestival(): Promise<AttendanceMetrics> {
  const totalRegistered = await prisma.registration.count({
    where: { status: { in: ["CONFIRMED", "ATTENDED", "PENDING"] } },
  });
  const totalCheckedIn = await prisma.attendance.count({
    where: { status: "PRESENT" },
  });
  const attendancePercent = totalRegistered
    ? Math.round((totalCheckedIn / totalRegistered) * 1000) / 10
    : 0;
  const capacity = await prisma.event.aggregate({
    _sum: { maxRegistrations: true },
  });
  const used = await prisma.event.aggregate({
    _sum: { currentRegistrations: true },
  });
  const duplicateAttempts = await prisma.checkInLog.count({
    where: { action: "QR_SCAN_DUPLICATE" },
  });
  const invalidAttempts = await prisma.checkInLog.count({
    where: {
      action: { in: ["QR_SCAN_INVALID", "QR_SCAN_REVOKED", "QR_SCAN_EXPIRED"] },
    },
  });
  return {
    eventId: null,
    totalRegistered,
    totalCheckedIn,
    attendancePercent,
    remainingSeats: Math.max(0, (capacity._sum.maxRegistrations ?? 0) - (used._sum.currentRegistrations ?? 0)),
    capacity: capacity._sum.maxRegistrations ?? null,
    duplicateAttempts,
    invalidAttempts,
    recentVelocity: await velocityBuckets({}),
  };
}

async function velocityBuckets(opts: { eventId?: string }) {
  // Last 12 hours, hourly buckets
  const now = new Date();
  const start = new Date(now.getTime() - 12 * 60 * 60 * 1000);
  const rows = await prisma.checkInLog.findMany({
    where: {
      action: "QR_SCAN_SUCCESS",
      timestamp: { gte: start },
      ...(opts.eventId ? { eventId: opts.eventId } : {}),
    },
    select: { timestamp: true },
  });
  const buckets = new Map<string, number>();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    const key = `${d.getHours().toString().padStart(2, "0")}:00`;
    buckets.set(key, 0);
  }
  for (const r of rows) {
    const d = r.timestamp;
    const key = `${d.getHours().toString().padStart(2, "0")}:00`;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return Array.from(buckets.entries()).map(([hour, count]) => ({ hour, count }));
}

function emptyMetrics(eventId: string | null): AttendanceMetrics {
  return {
    eventId,
    totalRegistered: 0,
    totalCheckedIn: 0,
    attendancePercent: 0,
    remainingSeats: 0,
    capacity: null,
    duplicateAttempts: 0,
    invalidAttempts: 0,
    recentVelocity: [],
  };
}

export interface VolunteerEventSummary {
  id: string;
  title: string;
  venue: string;
  startTime: string;
  dayNumber: number;
  registered: number;
  checkedIn: number;
}

export async function getVolunteerEventSummaries(
  take = 12
): Promise<VolunteerEventSummary[]> {
  const events = await prisma.event.findMany({
    where: { status: { in: ["REGISTRATION_OPEN", "UPCOMING", "ONGOING"] } },
    orderBy: [{ dayNumber: "asc" }, { scheduleStart: "asc" }],
    take,
    include: {
      _count: { select: { registrations: true, attendances: true } },
    },
  });
  return events.map((e) => ({
    id: e.id,
    title: e.title,
    venue: e.venue,
    startTime: e.scheduleStart.toISOString(),
    dayNumber: e.dayNumber,
    registered: e._count.registrations,
    checkedIn: e._count.attendances,
  }));
}

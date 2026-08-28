// ============================================================================
// ASTITVA 2K26 - Token Issuance Service (DB-backed, idempotent)
// Path: lib/qr/issuance.ts
// ============================================================================

import { prisma } from "@/lib/db/prisma";
import { issueQrToken, signPayload, hashTokenDigest, QrPayload } from "./crypto";

export type QrPassTtl = "EVENT" | "DAY" | "FESTIVAL";

const TTL_BY_TYPE: Record<QrPassTtl, number> = {
  EVENT: 60 * 60 * 12, // 12 hours around the event
  DAY: 60 * 60 * 24, // 24 hours
  FESTIVAL: 60 * 60 * 24 * 6, // 6 days (full fest)
};

export interface IssuedPass {
  passId: string;
  token: string;
  expiresAt: Date;
  signatureDigest: string;
  participantId: string;
  eventId: string | null;
}

export interface IssueParams {
  userId: string;
  eventId?: string | null;
  ttl?: QrPassTtl;
}

export async function issueOrFetchPass(params: IssueParams): Promise<IssuedPass> {
  const profile = await prisma.profile.findUnique({
    where: { userId: params.userId },
    select: {
      participantId: true,
      collegeId: true,
      user: { select: { id: true, name: true } },
    },
  });
  if (!profile) {
    throw new Error("User profile not found — cannot issue QR pass");
  }

  const eventId = params.eventId ?? null;
  const ttl = params.ttl ?? (eventId ? "EVENT" : "FESTIVAL");
  const ttlSeconds = TTL_BY_TYPE[ttl];

  // Reuse unexpired, unrevoked pass if present
  const existing = await prisma.qrPass.findFirst({
    where: {
      userId: params.userId,
      eventId,
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { issuedAt: "desc" },
  });
  if (existing) {
    return {
      passId: existing.id,
      token: existing.token,
      expiresAt: existing.expiresAt,
      signatureDigest: hashTokenDigest(existing.token),
      participantId: existing.participantId,
      eventId: existing.eventId,
    };
  }

  const branch = await prisma.profile
    .findUnique({ where: { userId: params.userId }, select: { branch: true } })
    .then((p) => p?.branch ?? "OTHER");

  const signed = issueQrToken({
    participantId: profile.participantId,
    userId: profile.user.id,
    collegeId: profile.collegeId,
    name: profile.user.name,
    branch,
    eventId,
    ttlSeconds,
  });

  const expiresAt = new Date(signed.payload.exp * 1000);
  const created = await prisma.qrPass.create({
    data: {
      participantId: profile.participantId,
      userId: profile.user.id,
      eventId,
      token: signed.token,
      signatureHash: signed.signatureHex,
      payload: JSON.stringify(signed.payload),
      expiresAt,
    },
  });

  return {
    passId: created.id,
    token: signed.token,
    expiresAt,
    signatureDigest: hashTokenDigest(signed.token),
    participantId: created.participantId,
    eventId: created.eventId,
  };
}

export async function issuePassForRegistration(
  registrationId: string
): Promise<IssuedPass> {
  const reg = await prisma.registration.findUnique({
    where: { id: registrationId },
    select: { userId: true, eventId: true, status: true },
  });
  if (!reg) throw new Error("Registration not found");
  if (!["CONFIRMED", "ATTENDED"].includes(reg.status)) {
    throw new Error(`Cannot issue pass for status ${reg.status}`);
  }
  return issueOrFetchPass({ userId: reg.userId, eventId: reg.eventId, ttl: "EVENT" });
}

export async function revokePass(
  passId: string,
  reason: string,
  revokedById: string
): Promise<{ ok: boolean }> {
  await prisma.qrPass.update({
    where: { id: passId },
    data: {
      isRevoked: true,
      revokedReason: reason,
      revokedAt: new Date(),
      revokedById,
    },
  });
  return { ok: true };
}

export type { QrPayload };
export { signPayload };

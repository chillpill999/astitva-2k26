// ============================================================================
// ASTITVA 2K26 - Certificates Server Actions
// Path: lib/certificates/actions.ts
// ============================================================================

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { CertificateType } from "@prisma/client";
import { z } from "zod";
import {
  signCertificate,
  verifyCertificateSignature,
  generateCertificateNumber,
  certificateTitleFor,
  type CertificateInput,
} from "./crypto";
import { recordAudit } from "@/lib/security/audit";
import { getRequestContext } from "@/lib/security/context";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: Record<string, string[]>;
}

const IssueInputSchema = z.object({
  userId: z.string().min(1),
  eventId: z.string().min(1).optional(),
  type: z.enum([
    "WINNER",
    "FIRST_RUNNER_UP",
    "SECOND_RUNNER_UP",
    "PARTICIPATION",
    "VOLUNTEER",
    "COORDINATOR",
    "MERIT",
  ]),
  resultId: z.string().min(1).optional(),
});

export type IssueInput = z.infer<typeof IssueInputSchema>;

async function getNextCertSeq(): Promise<number> {
  const last = await prisma.certificate.findFirst({
    orderBy: { certificateNumber: "desc" },
    select: { certificateNumber: true },
  });
  if (!last) return 10001;
  const m = last.certificateNumber.match(/(\d+)$/);
  const n = m ? parseInt(m[1], 10) : 10000;
  return n + 1;
}

export async function issueCertificate(
  rawInput: unknown
): Promise<ActionResult<{ certificateId: string; certificateNumber: string; signatureHash: string; verificationUrl: string }>> {
  const ctx = await getRequestContext();
  if (!ctx.user) return { success: false, error: "Authentication required" };
  if (!["EVENT_COORDINATOR", "ADMIN"].includes(ctx.user.role)) {
    return { success: false, error: "Insufficient permissions" };
  }
  const parsed = IssueInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid issuance payload",
      validationErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const { userId, eventId, type, resultId } = parsed.data;

  // Avoid double-issuing for the same result/event pair
  const existing = await prisma.certificate.findFirst({
    where: { userId, eventId: eventId ?? null, type: type as CertificateType },
  });
  if (existing) {
    return {
      success: true,
      data: {
        certificateId: existing.id,
        certificateNumber: existing.certificateNumber,
        signatureHash: existing.signatureHash,
        verificationUrl: existing.verificationUrl,
      },
    };
  }

  const [user, event] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    }),
    eventId
      ? prisma.event.findUnique({ where: { id: eventId } })
      : Promise.resolve(null),
  ]);
  if (!user) return { success: false, error: "User not found" };

  const seq = await getNextCertSeq();
  const certificateNumber = generateCertificateNumber(seq);
  const issueDate = new Date().toISOString();
  const category = event ? "Event" : "Festival";
  const eventName = event?.title ?? "ASTITVA 2K26 Festival";

  const input: CertificateInput = {
    certificateNumber,
    recipientName: user.name,
    participantId: user.profile?.participantId ?? "",
    eventName,
    category,
    position: type,
    issueDate,
  };
  const { signatureHash, verificationUrl } = signCertificate(input);

  const cert = await prisma.certificate.create({
    data: {
      certificateNumber,
      userId: user.id,
      eventId: eventId ?? null,
      recipientName: user.name,
      participantId: user.profile?.participantId ?? "",
      type: type as CertificateType,
      title: certificateTitleFor(type),
      eventName,
      category,
      issueDate: new Date(issueDate),
      signatureHash,
      verificationUrl,
    },
  });

  if (resultId) {
    await prisma.result.updateMany({
      where: { id: resultId },
      data: { certificateIssued: true },
    });
  }

  await recordAudit({
    action: "CERTIFICATE_ISSUED",
    userId: ctx.user.id,
    userEmail: ctx.user.email,
    resource: `cert:${cert.certificateNumber}`,
    details: { userId, eventId, type },
    ipAddress: ctx.ipAddress,
    userAgent: ctx.userAgent,
  });
  revalidatePath(`/verify-certificate/${cert.certificateNumber}`);
  revalidatePath(`/dashboard/captain`);
  revalidatePath(`/dashboard/participant`);
  revalidatePath("/results");

  return {
    success: true,
    data: {
      certificateId: cert.id,
      certificateNumber: cert.certificateNumber,
      signatureHash: cert.signatureHash,
      verificationUrl: cert.verificationUrl,
    },
  };
}

export async function autoIssueForResult(resultId: string): Promise<ActionResult<{ certificateNumber: string }>> {
  const ctx = await getRequestContext();
  if (!ctx.user) return { success: false, error: "Authentication required" };
  if (!["EVENT_COORDINATOR", "ADMIN"].includes(ctx.user.role)) {
    return { success: false, error: "Insufficient permissions" };
  }
  const result = await prisma.result.findUnique({
    where: { id: resultId },
    include: { event: true },
  });
  if (!result) return { success: false, error: "Result not found" };
  if (!result.userId) {
    return { success: false, error: "Result has no associated user (team-only result)." };
  }
  const issued = await issueCertificate({
    userId: result.userId,
    eventId: result.eventId,
    type: result.positionTitle,
    resultId,
  });
  if (!issued.success) return { success: false, error: issued.error };
  return { success: true, data: { certificateNumber: issued.data!.certificateNumber } };
}

export interface PublicCertificate {
  certificateNumber: string;
  recipientName: string;
  participantId: string;
  eventName: string;
  category: string;
  type: string;
  title: string;
  issueDate: string;
  isRevoked: boolean;
  revokedReason: string | null;
  signatureHash: string;
  verificationUrl: string;
  valid: boolean;
}

export async function getPublicCertificate(
  certificateNumber: string
): Promise<PublicCertificate | null> {
  try {
    const cert = await prisma.certificate.findUnique({
      where: { certificateNumber },
    });
    if (!cert) return null;

    const valid = verifyCertificateSignature(
      {
        certificateNumber: cert.certificateNumber,
        recipientName: cert.recipientName,
        participantId: cert.participantId,
        eventName: cert.eventName,
        category: cert.category,
        position: cert.type,
        issueDate: cert.issueDate.toISOString(),
      },
      cert.signatureHash
    );

    return {
      certificateNumber: cert.certificateNumber,
      recipientName: cert.recipientName,
      participantId: cert.participantId,
      eventName: cert.eventName,
      category: cert.category,
      type: cert.type,
      title: cert.title,
      issueDate: cert.issueDate.toISOString(),
      isRevoked: cert.isRevoked,
      revokedReason: cert.revokedReason,
      signatureHash: cert.signatureHash,
      verificationUrl: cert.verificationUrl,
      valid: !cert.isRevoked && valid,
    };
  } catch {
    return null;
  }
}

export interface UserCertificateSummary {
  id: string;
  certificateNumber: string;
  title: string;
  type: string;
  eventName: string;
  category: string;
  issueDate: string;
  isRevoked: boolean;
}

export async function getUserCertificates(
  userId: string
): Promise<UserCertificateSummary[]> {
  try {
    const certs = await prisma.certificate.findMany({
      where: { userId },
      orderBy: { issueDate: "desc" },
    });
    return certs.map((c) => ({
      id: c.id,
      certificateNumber: c.certificateNumber,
      title: c.title,
      type: c.type,
      eventName: c.eventName,
      category: c.category,
      issueDate: c.issueDate.toISOString(),
      isRevoked: c.isRevoked,
    }));
  } catch {
    return [];
  }
}

// ============================================================================
// ASTITVA 2K26 - Security Audit Log
// Path: lib/security/audit.ts
// ============================================================================

import { prisma } from "@/lib/db/prisma";

export type AuditAction =
  | "QR_SCAN_SUCCESS"
  | "QR_SCAN_DUPLICATE"
  | "QR_SCAN_INVALID"
  | "QR_SCAN_EXPIRED"
  | "QR_SCAN_REVOKED"
  | "QR_SCAN_NOT_REGISTERED"
  | "QR_SCAN_RATE_LIMITED"
  | "QR_PASS_ISSUED"
  | "QR_PASS_REVOKED"
  | "RESULT_PUBLISHED"
  | "CERTIFICATE_ISSUED"
  | "ANNOUNCEMENT_BROADCAST"
  | "LIVE_SCORE_UPDATED"
  | "ROLE_SWITCH"
  | "EXPORT_DOWNLOAD"
  | "ADMIN_ANALYTICS_VIEW"
  | "AI_CHAT";

export interface AuditEntry {
  action: AuditAction;
  userId?: string | null;
  userEmail?: string | null;
  resource?: string;
  details?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function recordAudit(entry: AuditEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: entry.action,
        userId: entry.userId ?? null,
        userEmail: entry.userEmail ?? null,
        resource: entry.resource ?? "",
        details: entry.details ? JSON.stringify(entry.details) : null,
        ipAddress: entry.ipAddress ?? null,
        userAgent: entry.userAgent ?? null,
      },
    });
  } catch (err) {
    // Audit log writes must never crash the request path.
    // Surface only in server logs.
    if (process.env.NODE_ENV === "development") {
      console.error("[audit] failed to record", entry.action, err);
    }
  }
}

export async function getRecentAudit(limit = 50) {
  return prisma.auditLog.findMany({
    orderBy: { timestamp: "desc" },
    take: limit,
  });
}

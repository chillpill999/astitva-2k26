// ============================================================================
// ASTITVA 2K26 - QR Pass Zod Validation Schemas
// Path: lib/qr/schema.ts
// ============================================================================

import { z } from "zod";

export const QrTokenSchema = z
  .string()
  .min(40, "Invalid QR token length")
  .max(512, "Token too long")
  .regex(/^AST26\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, "Malformed QR token format");

export const ScanRequestSchema = z.object({
  token: QrTokenSchema,
  eventId: z.string().min(1).max(64).optional(),
  checkInType: z
    .enum(["EVENT_ENTRY", "GATE_ENTRY", "MEAL", "BADGE_VERIFY"])
    .default("EVENT_ENTRY"),
  deviceInfo: z.string().max(500).optional(),
});

export const ManualLookupSchema = z.object({
  participantId: z
    .string()
    .min(6)
    .max(32)
    .regex(/^(AST26-\d{4,6}|[0-9]{10,14})$/i, "Invalid participant ID or roll number"),
  eventId: z.string().min(1).max(64),
  checkInType: z
    .enum(["EVENT_ENTRY", "GATE_ENTRY", "MEAL", "BADGE_VERIFY"])
    .default("EVENT_ENTRY"),
});

export const RevokePassSchema = z.object({
  passId: z.string().min(1),
  reason: z.string().min(3).max(280),
});

export const PassQuerySchema = z.object({
  eventId: z.string().min(1).max(64).optional(),
  participantId: z.string().min(6).max(32).optional(),
  includeRevoked: z.coerce.boolean().default(false),
  take: z.coerce.number().int().min(1).max(200).default(50),
});

export type ScanRequest = z.infer<typeof ScanRequestSchema>;
export type ManualLookupRequest = z.infer<typeof ManualLookupSchema>;
export type RevokePassRequest = z.infer<typeof RevokePassSchema>;
export type PassQueryRequest = z.infer<typeof PassQuerySchema>;

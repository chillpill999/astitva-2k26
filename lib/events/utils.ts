// ============================================================================
// ASTITVA 2K26 - Event Registration Utilities & Helpers
// Path: lib/events/utils.ts
// ============================================================================

import * as crypto from "crypto";

/**
 * Helper to generate unique registration ticket number AST26-REG-XXXXX
 */
export function formatRegistrationNumber(seq?: number): string {
  const num = seq || Math.floor(10000 + Math.random() * 90000);
  return `AST26-REG-${num}`;
}

/**
 * Helper to generate encrypted QR ticket code for an event registration
 */
export function createRegistrationQRToken(payload: {
  registrationNumber: string;
  eventId: string;
  userId: string;
}): string {
  const secret =
    process.env.QR_SECRET_KEY ||
    process.env.NEXTAUTH_SECRET ||
    "ASTITVA_2K26_HMAC_SECRET_LNJPIT";
  const raw = `${payload.registrationNumber}:${payload.eventId}:${payload.userId}:${Date.now()}`;
  const sig = crypto
    .createHmac("sha256", secret)
    .update(raw)
    .digest("hex")
    .slice(0, 16);
  return `AST26.REG.${payload.registrationNumber}.${sig}`;
}

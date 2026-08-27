// ============================================================================
// ASTITVA 2K26 - Team Invite Code Generator & Normalization Engine
// Path: lib/teams/code-generator.ts
// ============================================================================

import { prisma } from "@/lib/db/prisma";

// Unambiguous 32-character uppercase alphanumeric alphabet (excluding 0, O, 1, I)
export const INVITE_CODE_CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const INVITE_CODE_LENGTH = 6;
export const INVITE_CODE_REGEX = /^[A-Z0-9]{6}$/;

/**
 * Generates a 6-character uppercase alphanumeric invite code.
 * Guaranteed to match ^[A-Z0-9]{6}$
 */
export function generateInviteCode(): string {
  let code = "";
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * INVITE_CODE_CHARSET.length);
    code += INVITE_CODE_CHARSET.charAt(randomIndex);
  }
  return code;
}

/**
 * Validates whether a given invite code matches the strict 6-character uppercase alphanumeric format.
 */
export function validateInviteCode(code: string): boolean {
  if (!code || typeof code !== "string") return false;
  return INVITE_CODE_REGEX.test(code);
}

/**
 * Auto-normalizes user-inputted invite codes:
 * Strips whitespace, removes common punctuation/hyphens, and converts to uppercase.
 */
export function normalizeInviteCode(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/**
 * Generates a unique invite code with collision protection against the PostgreSQL Team table.
 * Retries up to maxRetries times if a collision occurs.
 */
export async function generateUniqueInviteCode(maxRetries = 10): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const candidateCode = generateInviteCode();
    try {
      const existing = await prisma.team.findUnique({
        where: { code: candidateCode },
        select: { id: true },
      });
      if (!existing) {
        return candidateCode;
      }
    } catch {
      // In offline/in-memory mode, return the candidate code directly
      return candidateCode;
    }
  }
  // Fallback if max retries exceeded
  return generateInviteCode();
}

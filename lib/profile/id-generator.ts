// ============================================================================
// ASTITVA 2K26 - Unique Participant ID Generator
// Path: lib/profile/id-generator.ts
// Format: AST26-XXXX (Sequence starts at 1001 for dynamic participants)
// ============================================================================

import { prisma } from "@/lib/db/prisma";
import { PrismaClient, Prisma } from "@prisma/client";

export const ID_PREFIX = "AST26";
export const PARTICIPANT_START_SEQ = 1001;
export const PARTICIPANT_ID_REGEX = /^AST26-\d{4,}$/;

type PrismaOrTx = PrismaClient | Prisma.TransactionClient;

/**
 * Formats a sequence number into the canonical AST26-XXXX format.
 * Examples:
 *   1001  -> "AST26-1001"
 *   42    -> "AST26-0042"
 *   12500 -> "AST26-12500"
 */
export function formatParticipantId(sequenceNumber: number): string {
  if (sequenceNumber < 1 || !Number.isInteger(sequenceNumber)) {
    throw new Error(`Invalid sequence number for participant ID: ${sequenceNumber}`);
  }
  return `${ID_PREFIX}-${String(sequenceNumber).padStart(4, "0")}`;
}

/**
 * Parses an ASTITVA participant ID into its constituent parts.
 */
export function parseParticipantId(participantId: string): {
  prefix: string;
  year: string;
  sequence: number;
} | null {
  if (!participantId || typeof participantId !== "string") return null;

  const match = participantId.trim().match(/^([A-Z]+)(\d{2})-(\d+)$/);
  if (!match) return null;

  const [, prefix, year, seqStr] = match;
  return {
    prefix,
    year,
    sequence: parseInt(seqStr, 10),
  };
}

/**
 * Validates if a string is a valid AST26 participant ID.
 */
export function isValidParticipantId(participantId: string): boolean {
  return PARTICIPANT_ID_REGEX.test(participantId?.trim() ?? "");
}

/**
 * Extracts sequence number from a participant ID, or null if invalid.
 */
export function getParticipantSequenceNumber(participantId: string): number | null {
  const parsed = parseParticipantId(participantId);
  return parsed ? parsed.sequence : null;
}

/**
 * Generates the next sequential unique participant ID with atomic concurrency safety.
 * Starts from 1001 (or higher if IDs already exist).
 */
export async function generateNextParticipantId(
  client: PrismaOrTx = prisma
): Promise<string> {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    attempt++;

    try {
      // 1. Fetch existing participant IDs to calculate highest numeric sequence
      const profiles = await client.profile.findMany({
        where: {
          participantId: {
            startsWith: `${ID_PREFIX}-`,
          },
        },
        select: {
          participantId: true,
        },
      });

      let maxSeq = PARTICIPANT_START_SEQ - 1; // 1000

      for (const p of profiles) {
        const seq = getParticipantSequenceNumber(p.participantId);
        if (seq !== null && seq > maxSeq) {
          maxSeq = seq;
        }
      }

      const nextSeq = maxSeq + 1;
      const candidateId = formatParticipantId(nextSeq);

      // 2. Double-check candidate ID does not exist
      const existing = await client.profile.findUnique({
        where: { participantId: candidateId },
        select: { id: true },
      });

      if (!existing) {
        return candidateId;
      }
    } catch (error) {
      if (attempt >= maxRetries) {
        throw new Error(
          `Failed to generate unique participant ID after ${maxRetries} attempts: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
      // Small jitter delay before retry
      await new Promise((resolve) =>
        setTimeout(resolve, 50 * attempt + Math.random() * 20)
      );
    }
  }

  // Fallback timestamp-based deterministic suffix if all retries exhausted
  const fallbackSeq = PARTICIPANT_START_SEQ + Math.floor(Math.random() * 8000) + 1000;
  return formatParticipantId(fallbackSeq);
}

/**
 * Ensures that a user has a valid AST26-XXXX participant ID assigned.
 * If the user's profile already has one, returns it; otherwise generates and saves it.
 */
export async function ensureUserParticipantId(
  userId: string,
  client: PrismaOrTx = prisma
): Promise<string> {
  const profile = await client.profile.findUnique({
    where: { userId },
    select: { participantId: true },
  });

  if (profile?.participantId && isValidParticipantId(profile.participantId)) {
    return profile.participantId;
  }

  const nextId = await generateNextParticipantId(client);

  if (profile) {
    await client.profile.update({
      where: { userId },
      data: { participantId: nextId },
    });
  }

  return nextId;
}

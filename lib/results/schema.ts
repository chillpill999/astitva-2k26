// ============================================================================
// ASTITVA 2K26 - Results & Leaderboard Zod Schemas
// Path: lib/results/schema.ts
// ============================================================================

import { z } from "zod";

export const RecordResultSchema = z.object({
  eventId: z.string().min(1).max(64),
  results: z
    .array(
      z.object({
        rank: z.number().int().min(1).max(3),
        positionTitle: z.enum([
          "WINNER",
          "FIRST_RUNNER_UP",
          "SECOND_RUNNER_UP",
        ]),
        userId: z.string().optional(),
        teamId: z.string().optional(),
        score: z.string().max(120).optional(),
        prizeAwarded: z.string().max(200).optional(),
        notes: z.string().max(500).optional(),
      })
    )
    .min(1)
    .max(3),
});

export const DeleteResultSchema = z.object({
  resultId: z.string().min(1),
});

export type RecordResultInput = z.infer<typeof RecordResultSchema>;
export type DeleteResultInput = z.infer<typeof DeleteResultSchema>;

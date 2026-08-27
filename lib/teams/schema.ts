// ============================================================================
// ASTITVA 2K26 - Team Schemas & Zod Validators
// Path: lib/teams/schema.ts
// ============================================================================

import { z } from "zod";
import { INVITE_CODE_REGEX } from "./code-generator";

/**
 * Team Creation Validation Schema
 * Enforces 3-50 character team name, valid eventId, and min/max team size constraints.
 */
export const TeamCreateSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Team name must be at least 3 characters")
      .max(50, "Team name cannot exceed 50 characters"),
    eventId: z.string().min(1, "Event ID is required"),
    minMembers: z
      .number({ invalid_type_error: "Minimum team size must be a number" })
      .int("Minimum team size must be an integer")
      .min(1, "Minimum team size must be at least 1"),
    maxMembers: z
      .number({ invalid_type_error: "Maximum team size must be a number" })
      .int("Maximum team size must be an integer")
      .min(1, "Maximum team size must be at least 1"),
  })
  .refine((data) => data.maxMembers >= data.minMembers, {
    message: "Maximum team size cannot be less than minimum team size",
    path: ["maxMembers"],
  });

export type TeamCreateInput = z.infer<typeof TeamCreateSchema>;

/**
 * Team Join Validation Schema
 * Enforces 6-character uppercase alphanumeric invite code.
 */
export const JoinTeamSchema = z.object({
  code: z
    .string()
    .trim()
    .transform((val) => val.toUpperCase())
    .refine((val) => val.length === 6, {
      message: "Invite code must be exactly 6 characters",
    })
    .refine((val) => INVITE_CODE_REGEX.test(val), {
      message: "Invite code must contain only uppercase letters and numbers",
    }),
});

export type JoinTeamInput = z.infer<typeof JoinTeamSchema>;

/**
 * Team Member Management Schema (Remove / Promote)
 */
export const ManageTeamMemberSchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
  memberUserId: z.string().min(1, "Member User ID is required"),
  action: z.enum(["REMOVE", "PROMOTE"]),
});

export type ManageTeamMemberInput = z.infer<typeof ManageTeamMemberSchema>;

/**
 * Disband Team Schema
 */
export const DisbandTeamSchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
});

export type DisbandTeamInput = z.infer<typeof DisbandTeamSchema>;

/**
 * Finalize Team Registration Schema
 */
export const FinalizeTeamRegistrationSchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
});

export type FinalizeTeamRegistrationInput = z.infer<typeof FinalizeTeamRegistrationSchema>;

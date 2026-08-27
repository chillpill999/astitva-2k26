// ============================================================================
// ASTITVA 2K26 - Event Schemas & Zod Validators
// Path: lib/events/schema.ts
// ============================================================================

import { z } from "zod";

/**
 * Event Catalog Filter Validation Schema
 */
export const EventFilterSchema = z.object({
  categoryId: z.string().optional(),
  categorySlug: z.string().optional(),
  search: z.string().optional(),
  eventType: z.enum(["ALL", "INDIVIDUAL", "TEAM"]).optional(),
  dayNumber: z.coerce.number().int().min(1).max(5).optional(),
  isFeatured: z.boolean().optional(),
  status: z.string().optional(),
});

export type EventFilterInput = z.infer<typeof EventFilterSchema>;

/**
 * Solo Event Registration Validation Schema
 */
export const SoloRegistrationSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
});

export type SoloRegistrationInput = z.infer<typeof SoloRegistrationSchema>;

/**
 * Cancel Registration Validation Schema
 */
export const CancelRegistrationSchema = z.object({
  registrationId: z.string().min(1, "Registration ID is required"),
});

export type CancelRegistrationInput = z.infer<typeof CancelRegistrationSchema>;

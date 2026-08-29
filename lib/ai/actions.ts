// ============================================================================
// ASTITVA 2K26 - AI Fest Assistant & Notifications Server Actions
// Path: lib/ai/actions.ts
// ============================================================================

"use server";

import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { askAssistant, invalidateKnowledgeSnapshot } from "./matcher";
import { recordAudit } from "@/lib/security/audit";
import { getRequestContext } from "@/lib/security/context";

const AskSchema = z.object({
  message: z.string().min(1).max(2000),
  sessionId: z.string().min(1).max(128),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      })
    )
    .max(20)
    .optional(),
});

export type AskInput = z.infer<typeof AskSchema>;

export interface AskResult {
  answer: string;
  intent: string;
  relatedEvents: Array<{ id: string; title: string; venue: string; scheduleStart: string }>;
  suggestedActions: Array<{ label: string; url: string }>;
}

export async function askFestAssistant(rawInput: unknown): Promise<AskResult> {
  const ctx = await getRequestContext();
  const parsed = AskSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      answer: "I couldn't understand that request. Try asking about an event by name.",
      intent: "GENERAL",
      relatedEvents: [],
      suggestedActions: [
        { label: "Browse Events", url: "/events" },
      ],
    };
  }
  const { message, sessionId } = parsed.data;
  const result = await askAssistant(message);

  // Persist chat
  try {
    await prisma.aiChatMessage.createMany({
      data: [
        {
          sessionId,
          userId: ctx.user?.id ?? null,
          role: "USER",
          content: message.slice(0, 2000),
          queryIntent: result.intent,
        },
        {
          sessionId,
          userId: ctx.user?.id ?? null,
          role: "ASSISTANT",
          content: result.answer.slice(0, 2000),
          queryIntent: result.intent,
          metadata: JSON.stringify({
            relatedEvents: result.relatedEvents,
            suggestedActions: result.suggestedActions,
          }),
        },
      ],
    });
  } catch {
    // Chat persistence is best-effort.
  }

  await recordAudit({
    action: "AI_CHAT",
    userId: ctx.user?.id ?? undefined,
    userEmail: ctx.user?.email,
    resource: `session:${sessionId}`,
    details: { intent: result.intent, messageLength: message.length },
    ipAddress: ctx.ipAddress,
    userAgent: ctx.userAgent,
  });

  return result;
}

export async function getRecentChats(sessionId: string, take = 30) {
  return prisma.aiChatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
    take,
  });
}

// ----------------------------------------------------------------------------
// Notifications
// ----------------------------------------------------------------------------

const CreateNotificationSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1).max(120),
  message: z.string().min(1).max(500),
  type: z
    .enum([
      "INFO",
      "SUCCESS",
      "WARNING",
      "ALERT",
      "REGISTRATION",
      "RESULT",
      "TEAM_INVITE",
    ])
    .default("INFO"),
  link: z.string().max(280).optional(),
});

export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;

export async function createNotification(
  rawInput: unknown
): Promise<{ success: boolean; id?: string; error?: string }> {
  const ctx = await getRequestContext();
  if (!ctx.user) return { success: false, error: "Authentication required" };
  if (!["ADMIN", "EVENT_COORDINATOR"].includes(ctx.user.role)) {
    return { success: false, error: "Insufficient permissions" };
  }
  const parsed = CreateNotificationSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: "Invalid payload" };
  }
  const n = await prisma.notification.create({ data: parsed.data });
  return { success: true, id: n.id };
}

export async function getMyNotifications(take = 25) {
  const ctx = await getRequestContext();
  if (!ctx.user) return [];
  return prisma.notification.findMany({
    where: { userId: ctx.user.id },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function markNotificationRead(id: string) {
  const ctx = await getRequestContext();
  if (!ctx.user) return { success: false };
  await prisma.notification.updateMany({
    where: { id, userId: ctx.user.id },
    data: { isRead: true, readAt: new Date() },
  });
  return { success: true };
}

export async function markAllNotificationsRead() {
  const ctx = await getRequestContext();
  if (!ctx.user) return { success: false };
  await prisma.notification.updateMany({
    where: { userId: ctx.user.id, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
  return { success: true };
}

// ----------------------------------------------------------------------------
// Announcements (admin/coordinator publish + public read)
// ----------------------------------------------------------------------------

const CreateAnnouncementSchema = z.object({
  title: z.string().min(3).max(160),
  content: z.string().min(3).max(2000),
  category: z
    .enum([
      "GENERAL",
      "EVENT_UPDATE",
      "EMERGENCY",
      "SCHEDULE_CHANGE",
      "RESULTS",
    ])
    .default("GENERAL"),
  priority: z.enum(["URGENT", "HIGH", "NORMAL", "LOW"]).default("NORMAL"),
  isPinned: z.boolean().default(false),
  expiresAt: z.string().datetime().optional(),
  targetRole: z
    .enum(["ADMIN", "EVENT_COORDINATOR", "VOLUNTEER", "TEAM_CAPTAIN", "PARTICIPANT"])
    .optional(),
});

export type CreateAnnouncementInput = z.infer<typeof CreateAnnouncementSchema>;

export async function createAnnouncement(
  rawInput: unknown
): Promise<{ success: boolean; id?: string; error?: string }> {
  const ctx = await getRequestContext();
  if (!ctx.user) return { success: false, error: "Authentication required" };
  if (!["ADMIN", "EVENT_COORDINATOR"].includes(ctx.user.role)) {
    return { success: false, error: "Insufficient permissions" };
  }
  const parsed = CreateAnnouncementSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid announcement payload",
    };
  }
  const data = parsed.data;
  const ann = await prisma.announcement.create({
    data: {
      title: data.title,
      content: data.content,
      category: data.category,
      priority: data.priority,
      isPinned: data.isPinned,
      targetRole: data.targetRole ?? null,
      authorId: ctx.user.id,
      authorName: ctx.user.name,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  });
  invalidateKnowledgeSnapshot(); // AI bot should pick this up

  // Targeted notification fan-out
  const recipients = await prisma.user.findMany({
    where: data.targetRole ? { role: data.targetRole } : { isActive: true },
    select: { id: true },
  });
  if (recipients.length) {
    await prisma.notification.createMany({
      data: recipients.map((r) => ({
        userId: r.id,
        title: data.priority === "URGENT" ? `🚨 ${data.title}` : data.title,
        message: data.content.slice(0, 400),
        type: data.priority === "URGENT" ? "ALERT" : "INFO",
        link: "/announcements",
      })),
    });
  }

  await recordAudit({
    action: "ANNOUNCEMENT_BROADCAST",
    userId: ctx.user.id,
    userEmail: ctx.user.email,
    resource: `ann:${ann.id}`,
    details: { category: data.category, priority: data.priority, recipients: recipients.length },
    ipAddress: ctx.ipAddress,
    userAgent: ctx.userAgent,
  });

  return { success: true, id: ann.id };
}

const STATIC_ANNOUNCEMENTS = [
  {
    id: "ann-welcome",
    title: "Welcome to ASTITVA 2K26 - LNJPIT Chapra Annual Festival",
    content: "Registrations are officially OPEN across all 16 Flagship Competitions in Sports, Cultural, Esports, and Literary streams. Register your teams and individual entries to claim your official digital QR pass.",
    category: "GENERAL" as const,
    priority: "HIGH" as const,
    isPinned: true,
    publishedAt: new Date("2026-08-25T10:00:00Z"),
    authorName: "ASTITVA Core Committee",
    isActive: true,
    expiresAt: null,
    targetRole: null,
    authorId: "admin",
    createdAt: new Date("2026-08-25T10:00:00Z"),
    updatedAt: new Date("2026-08-25T10:00:00Z"),
  },
  {
    id: "ann-passes",
    title: "Digital Pass & QR Scanner Protocol",
    content: "All participants are requested to save their encrypted digital badge from the Participant Dashboard. Entry to tournament arenas will be verified via real-time volunteer camera scanning.",
    category: "EVENT_UPDATE" as const,
    priority: "NORMAL" as const,
    isPinned: false,
    publishedAt: new Date("2026-08-26T14:30:00Z"),
    authorName: "Technical Operations",
    isActive: true,
    expiresAt: null,
    targetRole: null,
    authorId: "admin",
    createdAt: new Date("2026-08-26T14:30:00Z"),
    updatedAt: new Date("2026-08-26T14:30:00Z"),
  },
];

export async function getPublicAnnouncements(options: { take?: number; category?: string } = {}) {
  try {
    const items = await prisma.announcement.findMany({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        ...(options.category ? { category: options.category as any } : {}),
      },
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
      take: options.take ?? 30,
    });
    if (!items || items.length === 0) {
      return STATIC_ANNOUNCEMENTS.filter((a) => !options.category || a.category === options.category);
    }
    return items;
  } catch {
    return STATIC_ANNOUNCEMENTS.filter((a) => !options.category || a.category === options.category);
  }
}

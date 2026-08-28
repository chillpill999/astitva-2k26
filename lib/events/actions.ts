// ============================================================================
// ASTITVA 2K26 - Event Catalog & Registration Server Actions
// Path: lib/events/actions.ts
// ============================================================================

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  EventFilterSchema,
  EventFilterInput,
  SoloRegistrationSchema,
  CancelRegistrationSchema,
} from "./schema";
import {
  EventDetailData,
  RegistrationData,
  EventActionResult,
  EventType,
  EventStatus,
} from "./types";
import { FestEvent, STATIC_EVENTS, STATIC_CATEGORIES } from "@/lib/data/fest-data";
import { formatRegistrationNumber, createRegistrationQRToken } from "./utils";

/**
 * Queries events catalog with multi-facet filters, search, and resilient static fallback.
 */
export async function getEventsCatalog(
  filters?: EventFilterInput
): Promise<EventActionResult<FestEvent[]>> {
  try {
    const validated = EventFilterSchema.safeParse(filters || {});
    const filterData = validated.success ? validated.data : {};

    const where: any = {};

    if (filterData.categoryId) {
      where.categoryId = filterData.categoryId;
    }

    if (filterData.categorySlug && filterData.categorySlug !== "all") {
      try {
        const cat = await prisma.category.findUnique({
          where: { slug: filterData.categorySlug },
          select: { id: true },
        });
        if (cat) {
          where.categoryId = cat.id;
        } else {
          // If slug matches static categories
          const staticCat = STATIC_CATEGORIES.find((c) => c.slug === filterData.categorySlug);
          if (staticCat) where.categoryId = staticCat.id;
        }
      } catch {
        const staticCat = STATIC_CATEGORIES.find((c) => c.slug === filterData.categorySlug);
        if (staticCat) where.categoryId = staticCat.id;
      }
    }

    if (filterData.eventType && filterData.eventType !== "ALL") {
      where.eventType = filterData.eventType;
    }

    if (filterData.dayNumber) {
      where.dayNumber = Number(filterData.dayNumber);
    }

    if (filterData.isFeatured !== undefined) {
      where.isFeatured = filterData.isFeatured;
    }

    if (filterData.status) {
      where.status = filterData.status as any;
    }

    // Text search query across both title and rules
    if (filterData.search && filterData.search.trim().length > 0) {
      const query = filterData.search.trim();
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { subtitle: { contains: query, mode: "insensitive" } },
        { rules: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { venue: { contains: query, mode: "insensitive" } },
      ];
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        category: {
          select: { id: true, slug: true, name: true, icon: true },
        },
      },
      orderBy: [{ dayNumber: "asc" }, { scheduleStart: "asc" }],
    });

    if (events && events.length > 0) {
      const formatted: FestEvent[] = events.map((e: any) => ({
        id: e.id,
        slug: e.slug,
        title: e.title,
        subtitle: e.subtitle,
        description: e.description,
        rules: e.rules,
        categoryId: e.categoryId,
        category: e.category ? { ...e.category, icon: e.category.icon ?? undefined } : null,
        venue: e.venue,
        eventType: e.eventType as EventType,
        minTeamSize: e.minTeamSize,
        maxTeamSize: e.maxTeamSize,
        registrationFee: Number(e.registrationFee || 0),
        maxRegistrations: e.maxRegistrations,
        currentRegistrations: e.currentRegistrations,
        prizePool: Number(e.prizePool || 0),
        firstPrize: e.firstPrize,
        secondPrize: e.secondPrize,
        thirdPrize: e.thirdPrize,
        scheduleStart: new Date(e.scheduleStart),
        scheduleEnd: new Date(e.scheduleEnd),
        dayNumber: e.dayNumber,
        status: e.status as EventStatus,
        isFeatured: e.isFeatured,
        bannerImage: e.bannerImage,
        coordinatorId: e.coordinatorId,
        coordinatorName: e.coordinatorName,
        coordinatorPhone: e.coordinatorPhone,
        coordinatorEmail: e.coordinatorEmail,
      }));

      return { success: true, data: formatted };
    }
  } catch {
    // Fallback to static data on database disconnect
  }

  // Resilient in-memory filtering fallback
  let items = [...STATIC_EVENTS];
  const query = filters?.search?.toLowerCase().trim();

  if (filters?.categorySlug && filters.categorySlug !== "all") {
    items = items.filter((e) => e.category?.slug === filters.categorySlug);
  }
  if (filters?.categoryId) {
    items = items.filter((e) => e.categoryId === filters.categoryId);
  }
  if (filters?.eventType && filters.eventType !== "ALL") {
    items = items.filter((e) => e.eventType === filters.eventType);
  }
  if (filters?.dayNumber) {
    items = items.filter((e) => e.dayNumber === Number(filters.dayNumber));
  }
  if (filters?.isFeatured !== undefined) {
    items = items.filter((e) => e.isFeatured === filters.isFeatured);
  }
  if (query) {
    items = items.filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        (e.subtitle && e.subtitle.toLowerCase().includes(query)) ||
        e.rules.toLowerCase().includes(query) ||
        e.venue.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
    );
  }

  return { success: true, data: items };
}

/**
 * Alias for getEventsCatalog
 */
export async function getEventsList(filters?: EventFilterInput) {
  return getEventsCatalog(filters);
}

/**
 * Resolves full event details by slug or ID with relations and session registration context.
 */
export async function getEventBySlugOrId(
  idOrSlug: string
): Promise<EventActionResult<EventDetailData>> {
  try {
    if (!idOrSlug) {
      return { success: false, error: "Event identifier is required." };
    }

    const currentUser = await getCurrentUser();

    const dbEvent: any = await prisma.event.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        category: true,
        coordinator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profile: {
              select: {
                phone: true,
              },
            },
          },
        },
      },
    });

    if (dbEvent) {
      let userRegistration: EventDetailData["userRegistration"] = null;
      let userTeam: EventDetailData["userTeam"] = null;

      if (currentUser?.id) {
        // Query user's registration
        const reg = await prisma.registration.findUnique({
          where: {
            eventId_userId: {
              eventId: dbEvent.id,
              userId: currentUser.id,
            },
          },
          include: { team: true },
        });

        if (reg) {
          userRegistration = {
            id: reg.id,
            registrationNumber: reg.registrationNumber,
            status: reg.status as any,
            qrTicketCode: reg.qrTicketCode,
            createdAt: reg.createdAt.toISOString(),
            teamId: reg.teamId,
            teamName: reg.team?.name || null,
          };
        }

        // Query user's team membership for this event
        const teamMember = await prisma.teamMember.findFirst({
          where: {
            userId: currentUser.id,
            team: {
              eventId: dbEvent.id,
            },
          },
          include: {
            team: {
              include: {
                members: true,
              },
            },
          },
        });

        if (teamMember) {
          userTeam = {
            id: teamMember.team.id,
            name: teamMember.team.name,
            code: teamMember.team.code,
            role: teamMember.role as any,
            status: teamMember.team.status,
            memberCount: teamMember.team.members.length,
            maxMembers: teamMember.team.maxMembers,
            minMembers: teamMember.team.minMembers,
          };
        }
      }

      const coordinator = dbEvent.coordinator
        ? {
            id: dbEvent.coordinator.id,
            name: dbEvent.coordinator.name,
            email: dbEvent.coordinator.email,
            phone: dbEvent.coordinator.profile?.phone || dbEvent.coordinatorPhone,
            role: dbEvent.coordinator.role,
          }
        : dbEvent.coordinatorName
        ? {
            name: dbEvent.coordinatorName,
            phone: dbEvent.coordinatorPhone,
            email: dbEvent.coordinatorEmail,
          }
        : null;

      const data: EventDetailData = {
        id: dbEvent.id,
        slug: dbEvent.slug,
        title: dbEvent.title,
        subtitle: dbEvent.subtitle,
        description: dbEvent.description,
        rules: dbEvent.rules,
        categoryId: dbEvent.categoryId,
        category: dbEvent.category
          ? {
              ...dbEvent.category,
              icon: dbEvent.category.icon ?? undefined,
            }
          : null,
        venue: dbEvent.venue,
        eventType: dbEvent.eventType as EventType,
        minTeamSize: dbEvent.minTeamSize,
        maxTeamSize: dbEvent.maxTeamSize,
        registrationFee: Number(dbEvent.registrationFee || 0),
        maxRegistrations: dbEvent.maxRegistrations,
        currentRegistrations: dbEvent.currentRegistrations,
        prizePool: Number(dbEvent.prizePool || 0),
        firstPrize: dbEvent.firstPrize,
        secondPrize: dbEvent.secondPrize,
        thirdPrize: dbEvent.thirdPrize,
        scheduleStart: dbEvent.scheduleStart.toISOString(),
        scheduleEnd: dbEvent.scheduleEnd.toISOString(),
        dayNumber: dbEvent.dayNumber,
        status: dbEvent.status as EventStatus,
        isFeatured: dbEvent.isFeatured,
        bannerImage: dbEvent.bannerImage,
        coordinatorId: dbEvent.coordinatorId,
        coordinator,
        coordinatorName: dbEvent.coordinatorName,
        coordinatorPhone: dbEvent.coordinatorPhone,
        coordinatorEmail: dbEvent.coordinatorEmail,
        userRegistration,
        userTeam,
      };

      return { success: true, data };
    }
  } catch {
    // Database offline fallback
  }

  // Fallback to STATIC_EVENTS
  const fallback = STATIC_EVENTS.find((e) => e.id === idOrSlug || e.slug === idOrSlug);
  if (!fallback) {
    return { success: false, error: `Event not found: ${idOrSlug}` };
  }

  const category = STATIC_CATEGORIES.find((c) => c.id === fallback.categoryId) || null;

  const data: EventDetailData = {
    id: fallback.id,
    slug: fallback.slug,
    title: fallback.title,
    subtitle: fallback.subtitle,
    description: fallback.description,
    rules: fallback.rules,
    categoryId: fallback.categoryId,
    category: category ? { ...category, icon: category.icon } : null,
    venue: fallback.venue,
    eventType: fallback.eventType,
    minTeamSize: fallback.minTeamSize,
    maxTeamSize: fallback.maxTeamSize,
    registrationFee: fallback.registrationFee,
    maxRegistrations: fallback.maxRegistrations,
    currentRegistrations: fallback.currentRegistrations,
    prizePool: fallback.prizePool || 0,
    firstPrize: fallback.firstPrize,
    secondPrize: fallback.secondPrize,
    thirdPrize: fallback.thirdPrize,
    scheduleStart: fallback.scheduleStart.toISOString(),
    scheduleEnd: fallback.scheduleEnd.toISOString(),
    dayNumber: fallback.dayNumber,
    status: fallback.status,
    isFeatured: fallback.isFeatured,
    bannerImage: fallback.bannerImage,
    coordinatorId: fallback.coordinatorId,
    coordinator: {
      name: fallback.coordinatorName || "Fest Coordinator",
      phone: fallback.coordinatorPhone || "+91 98765 43210",
      email: fallback.coordinatorEmail || "astitva@lnjpit.ac.in",
    },
    coordinatorName: fallback.coordinatorName,
    coordinatorPhone: fallback.coordinatorPhone,
    coordinatorEmail: fallback.coordinatorEmail,
    userRegistration: null,
    userTeam: null,
  };

  return { success: true, data };
}

/**
 * Registers an authenticated user for a solo / individual event.
 * Enforces authentication, duplicate prevention, capacity check, and generates official AST26-REG-XXXXX ticket.
 */
export async function registerSoloEvent(
  eventId: string
): Promise<EventActionResult<RegistrationData>> {
  try {
    const validated = SoloRegistrationSchema.safeParse({ eventId });
    if (!validated.success) {
      return {
        success: false,
        error: "Invalid event ID provided.",
        validationErrors: validated.error.flatten().fieldErrors,
      };
    }

    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "You must be signed in to register for events. Please sign in or create an account.",
      };
    }

    // 1. Fetch Event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { category: true },
    });

    if (!event) {
      return { success: false, error: "Event not found." };
    }

    // 2. Validate Event Registration Status
    const isOpen = event.status === "REGISTRATION_OPEN" || event.status === ("PUBLISHED" as any) || event.status === "UPCOMING";
    if (!isOpen) {
      return {
        success: false,
        error: `Registration is currently closed for ${event.title}. Current status: ${event.status}.`,
      };
    }

    // 3. Validate Event Capacity
    if (event.currentRegistrations >= event.maxRegistrations) {
      return {
        success: false,
        error: `Registration limit reached for ${event.title} (${event.maxRegistrations} max slots).`,
      };
    }

    // 4. Duplicate Check: User already registered for this event
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId: event.id,
          userId: user.id,
        },
      },
    });

    if (existingRegistration) {
      if (existingRegistration.status === "CANCELLED") {
        // Re-activate cancelled registration
        const updated = await prisma.registration.update({
          where: { id: existingRegistration.id },
          data: { status: "CONFIRMED", updatedAt: new Date() },
        });
        revalidatePath("/events");
        revalidatePath(`/events/${event.slug}`);
        revalidatePath(`/events/${event.id}`);
        revalidatePath("/dashboard/participant");
        return {
          success: true,
          data: {
            id: updated.id,
            eventId: updated.eventId,
            userId: updated.userId,
            teamId: updated.teamId,
            status: updated.status as any,
            registrationNumber: updated.registrationNumber,
            qrTicketCode: updated.qrTicketCode,
            createdAt: updated.createdAt.toISOString(),
            eventTitle: event.title,
            venue: event.venue,
          },
        };
      }
      return {
        success: false,
        error: `You are already registered for ${event.title} (Ticket #${existingRegistration.registrationNumber}).`,
      };
    }

    // 5. Cross-check: User already in a team for this event
    const existingTeamMembership = await prisma.teamMember.findFirst({
      where: {
        userId: user.id,
        team: { eventId: event.id },
      },
      include: { team: true },
    });

    if (existingTeamMembership) {
      return {
        success: false,
        error: `You are already enrolled in team "${existingTeamMembership.team.name}" for this event.`,
      };
    }

    // 6. Generate Registration ID & QR Ticket Code
    const regSeq = Math.floor(1000 + Math.random() * 9000);
    const registrationNumber = formatRegistrationNumber(regSeq);
    const qrTicketCode = createRegistrationQRToken({
      registrationNumber,
      eventId: event.id,
      userId: user.id,
    });

    // 7. Atomic Transaction
    const registration = await prisma.$transaction(async (tx) => {
      const reg = await tx.registration.create({
        data: {
          eventId: event.id,
          userId: user.id,
          registrationNumber,
          status: "CONFIRMED",
          qrTicketCode,
        },
      });

      await tx.event.update({
        where: { id: event.id },
        data: {
          currentRegistrations: { increment: 1 },
        },
      });

      // Create confirmation notification
      try {
        await tx.notification.create({
          data: {
            userId: user.id,
            title: `Registration Confirmed: ${event.title}`,
            message: `Your solo registration for ${event.title} is confirmed. Ticket: ${registrationNumber}`,
            type: "REGISTRATION",
            link: `/events/${event.slug}`,
          },
        });
      } catch {
        // Notification table optional
      }

      // Record Audit Log
      try {
        await tx.auditLog.create({
          data: {
            userId: user.id,
            action: "REGISTER_SOLO",
            resource: `Registration:${reg.id}`,
            details: JSON.stringify({
              eventId: event.id,
              eventTitle: event.title,
              registrationNumber,
            }),
          },
        });
      } catch {
        // Audit log optional
      }

      return reg;
    });

    // 8. Revalidate caches
    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);
    revalidatePath(`/events/${event.id}`);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/participant");
    revalidatePath("/profile");

    return {
      success: true,
      data: {
        id: registration.id,
        eventId: registration.eventId,
        userId: registration.userId,
        teamId: registration.teamId,
        status: registration.status as any,
        registrationNumber: registration.registrationNumber,
        qrTicketCode: registration.qrTicketCode,
        createdAt: registration.createdAt.toISOString(),
        eventTitle: event.title,
        venue: event.venue,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to register for solo event.",
    };
  }
}

/**
 * Alias for registerSoloEvent
 */
export async function registerSolo(eventId: string) {
  return registerSoloEvent(eventId);
}

/**
 * Cancels a user's event registration and decrements event capacity count.
 */
export async function cancelSoloRegistration(
  registrationId: string
): Promise<EventActionResult<{ cancelled: boolean }>> {
  try {
    const validated = CancelRegistrationSchema.safeParse({ registrationId });
    if (!validated.success) {
      return { success: false, error: "Invalid registration ID." };
    }

    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    const reg = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { event: true },
    });

    if (!reg) {
      return { success: false, error: "Registration record not found." };
    }

    if (reg.userId !== user.id && user.role !== "ADMIN") {
      return { success: false, error: "You are not authorized to cancel this registration." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.registration.update({
        where: { id: registrationId },
        data: { status: "CANCELLED" },
      });

      if (reg.event.currentRegistrations > 0) {
        await tx.event.update({
          where: { id: reg.eventId },
          data: { currentRegistrations: { decrement: 1 } },
        });
      }
    });

    revalidatePath("/events");
    revalidatePath(`/events/${reg.event.slug}`);
    revalidatePath(`/events/${reg.event.id}`);
    revalidatePath("/dashboard/participant");
    revalidatePath("/profile");

    return { success: true, data: { cancelled: true } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to cancel registration.",
    };
  }
}

/**
 * Alias for cancelSoloRegistration
 */
export async function cancelRegistration(registrationId: string) {
  return cancelSoloRegistration(registrationId);
}

/**
 * Retrieves all registrations for a specific user (or the current session user).
 */
export async function getUserRegistrations(
  userId?: string
): Promise<EventActionResult<RegistrationData[]>> {
  try {
    const targetUserId = userId || (await getCurrentUser())?.id;
    if (!targetUserId) {
      return { success: false, error: "Unauthorized" };
    }

    const registrations = await prisma.registration.findMany({
      where: { userId: targetUserId },
      include: {
        event: {
          select: { title: true, venue: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const data: RegistrationData[] = registrations.map((r: any) => ({
      id: r.id,
      eventId: r.eventId,
      userId: r.userId,
      teamId: r.teamId,
      status: r.status,
      registrationNumber: r.registrationNumber,
      qrTicketCode: r.qrTicketCode,
      createdAt: r.createdAt.toISOString(),
      eventTitle: r.event?.title,
      venue: r.event?.venue,
    }));

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load user registrations.",
    };
  }
}

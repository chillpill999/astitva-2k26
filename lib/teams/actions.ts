// ============================================================================
// ASTITVA 2K26 - Team CRUD & Roster Management Server Actions
// Path: lib/teams/actions.ts
// ============================================================================

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  generateUniqueInviteCode,
  normalizeInviteCode,
  validateInviteCode,
} from "./code-generator";
import {
  TeamCreateSchema,
  TeamCreateInput,
  JoinTeamSchema,
  ManageTeamMemberSchema,
  ManageTeamMemberInput,
  DisbandTeamSchema,
  FinalizeTeamRegistrationSchema,
} from "./schema";
import {
  TeamData,
  TeamMemberData,
  TeamActionResult,
  TeamStatus,
} from "./types";
import { formatRegistrationNumber } from "@/lib/events/utils";

/**
 * Creates a new squad/team for a team event.
 * Automatically generates a 6-character unique uppercase invite code (e.g. BG26X1)
 * and sets the creator as CAPTAIN with APPROVED status.
 */
export async function createTeam(
  input: { name: string; eventId: string; minMembers?: number; maxMembers?: number }
): Promise<TeamActionResult<TeamData>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "You must be signed in to create a squad.",
      };
    }

    // 1. Fetch Event metadata to verify team requirements
    const event = await prisma.event.findUnique({
      where: { id: input.eventId },
      include: { category: true },
    });

    if (!event) {
      return { success: false, error: "Event not found." };
    }

    if (event.eventType !== "TEAM" && event.maxTeamSize <= 1) {
      return {
        success: false,
        error: `${event.title} is an individual event and does not accept squads.`,
      };
    }

    const minMembers = input.minMembers || event.minTeamSize || 2;
    const maxMembers = input.maxMembers || event.maxTeamSize || 4;

    // 2. Validate input schema
    const validation = TeamCreateSchema.safeParse({
      name: input.name,
      eventId: input.eventId,
      minMembers,
      maxMembers,
    });

    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed.",
        validationErrors: validation.error.flatten().fieldErrors,
      };
    }

    // 3. Check if user is already in a team for this event
    const existingMembership = await prisma.teamMember.findFirst({
      where: {
        userId: user.id,
        team: { eventId: event.id },
      },
      include: { team: true },
    });

    if (existingMembership) {
      return {
        success: false,
        error: `You are already a member of squad "${existingMembership.team.name}" for this tournament.`,
      };
    }

    // 4. Check if user already registered solo for this event
    const existingSolo = await prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId: event.id,
          userId: user.id,
        },
      },
    });

    if (existingSolo && existingSolo.status !== "CANCELLED") {
      return {
        success: false,
        error: `You already have an active solo registration for ${event.title}.`,
      };
    }

    // 5. Generate unique 6-character uppercase code
    const code = await generateUniqueInviteCode();

    // 6. Execute atomic transaction: create Team and insert Captain
    const team = await prisma.$transaction(async (tx) => {
      const newTeam = await tx.team.create({
        data: {
          name: validation.data.name.trim(),
          code,
          eventId: event.id,
          captainId: user.id,
          minMembers,
          maxMembers,
          status: "FORMING",
        },
      });

      await tx.teamMember.create({
        data: {
          teamId: newTeam.id,
          userId: user.id,
          role: "CAPTAIN",
          status: "APPROVED",
        },
      });

      // Audit Log
      try {
        await tx.auditLog.create({
          data: {
            userId: user.id,
            action: "CREATE_TEAM",
            resource: `Team:${newTeam.id}`,
            details: JSON.stringify({
              teamName: newTeam.name,
              code: newTeam.code,
              eventId: event.id,
            }),
          },
        });
      } catch {
        // optional
      }

      return newTeam;
    });

    revalidatePath("/teams");
    revalidatePath(`/teams/${team.id}`);
    revalidatePath(`/events/${event.slug}`);
    revalidatePath(`/events/${event.id}`);
    revalidatePath("/dashboard/captain");

    const fullDetails = await getTeamDetails(team.id);
    return {
      success: true,
      data: fullDetails.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create squad.",
    };
  }
}

/**
 * Resolves full team details by team ID or 6-character invite code.
 */
export async function getTeamDetails(
  idOrCode: string
): Promise<TeamActionResult<TeamData>> {
  try {
    if (!idOrCode) {
      return { success: false, error: "Team ID or invite code is required." };
    }

    const normalized = normalizeInviteCode(idOrCode);
    const isCode = validateInviteCode(normalized);

    const currentUser = await getCurrentUser();

    const team: any = await prisma.team.findFirst({
      where: isCode
        ? { OR: [{ code: normalized }, { id: idOrCode }] }
        : { id: idOrCode },
      include: {
        event: {
          include: {
            category: true,
          },
        },
        captain: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                profile: true,
              },
            },
          },
          orderBy: { joinedAt: "asc" },
        },
        registrations: {
          select: { registrationNumber: true },
        },
      },
    });

    if (!team) {
      return { success: false, error: "Squad not found with the provided code/ID." };
    }

    const formattedMembers: TeamMemberData[] = team.members.map((m: any) => ({
      id: m.id,
      teamId: m.teamId,
      userId: m.userId,
      role: m.role,
      status: m.status,
      joinedAt: m.joinedAt.toISOString(),
      user: {
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        avatarUrl: m.user.avatarUrl,
        profile: m.user.profile
          ? {
              participantId: m.user.profile.participantId,
              collegeId: m.user.profile.collegeId,
              collegeName: m.user.profile.collegeName,
              branch: m.user.profile.branch,
              semester: m.user.profile.semester,
              phone: m.user.profile.phone,
              isHosteler: m.user.profile.isHosteler,
            }
          : null,
      },
    }));

    const approvedMembers = formattedMembers.filter((m) => m.status === "APPROVED");
    const isCaptain = currentUser ? team.captainId === currentUser.id : false;
    const isMember = currentUser
      ? approvedMembers.some((m) => m.userId === currentUser.id)
      : false;

    const data: TeamData = {
      id: team.id,
      name: team.name,
      code: team.code,
      eventId: team.eventId,
      captainId: team.captainId,
      minMembers: team.minMembers,
      maxMembers: team.maxMembers,
      status: team.status as TeamStatus,
      createdAt: team.createdAt.toISOString(),
      updatedAt: team.updatedAt.toISOString(),
      event: team.event
        ? {
            id: team.event.id,
            slug: team.event.slug,
            title: team.event.title,
            venue: team.event.venue,
            scheduleStart: team.event.scheduleStart.toISOString(),
            category: team.event.category
              ? {
                  ...team.event.category,
                  icon: team.event.category.icon ?? undefined,
                }
              : null,
          }
        : null,
      captain: team.captain,
      members: formattedMembers,
      approvedMemberCount: approvedMembers.length,
      isCaptain,
      isMember,
      registrationNumber: team.registrations[0]?.registrationNumber || null,
    };

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load team details.",
    };
  }
}

/**
 * Preview team info by 6-character code (safe for public pre-join views).
 */
export async function getTeamByCode(
  inviteCode: string
): Promise<TeamActionResult<TeamData>> {
  return getTeamDetails(inviteCode);
}

/**
 * Joins a team using a 6-character alphanumeric invite code.
 * Handles code normalization, duplicate guards, capacity checks, and status upgrades to READY.
 */
export async function joinTeamByCode(
  input: { code?: string; inviteCode?: string } | string
): Promise<TeamActionResult<TeamData>> {
  try {
    const rawCode = typeof input === "string" ? input : input.code || input.inviteCode || "";
    const normalizedCode = normalizeInviteCode(rawCode);

    if (!validateInviteCode(normalizedCode)) {
      return {
        success: false,
        error: "Invalid invite code format. Must be a 6-character alphanumeric code.",
      };
    }

    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: "You must be signed in to join a squad.",
      };
    }

    // 1. Fetch team with event & existing members
    const team = await prisma.team.findUnique({
      where: { code: normalizedCode },
      include: {
        event: true,
        members: true,
      },
    });

    if (!team) {
      return {
        success: false,
        error: `No squad found with invite code "${normalizedCode}". Please check and try again.`,
      };
    }

    // 2. Status verification
    if (team.status === "DISQUALIFIED") {
      return { success: false, error: "This squad has been disqualified." };
    }

    // 3. Duplicate check in this team
    const alreadyMember = team.members.find((m) => m.userId === user.id);
    if (alreadyMember) {
      return {
        success: false,
        error: "You are already a member of this squad.",
      };
    }

    // 4. Capacity check
    const approvedMembers = team.members.filter((m) => m.status === "APPROVED");
    if (approvedMembers.length >= team.maxMembers) {
      return {
        success: false,
        error: `Squad "${team.name}" has reached maximum roster capacity (${team.maxMembers} members).`,
      };
    }

    // 5. Cross-check: User already in another team for this event
    const otherTeamMembership = await prisma.teamMember.findFirst({
      where: {
        userId: user.id,
        team: {
          eventId: team.eventId,
          id: { not: team.id },
        },
      },
      include: { team: true },
    });

    if (otherTeamMembership) {
      return {
        success: false,
        error: `You are already enrolled in squad "${otherTeamMembership.team.name}" for this event.`,
      };
    }

    // 6. Cross-check: User registered solo
    const soloReg = await prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId: team.eventId,
          userId: user.id,
        },
      },
    });

    if (soloReg && soloReg.status !== "CANCELLED") {
      return {
        success: false,
        error: `You are already registered individually for this event.`,
      };
    }

    // 7. Atomic Join Transaction
    await prisma.$transaction(async (tx) => {
      await tx.teamMember.create({
        data: {
          teamId: team.id,
          userId: user.id,
          role: "MEMBER",
          status: "APPROVED",
        },
      });

      const newCount = approvedMembers.length + 1;

      // If squad now has enough members, update status to READY
      if (newCount >= team.minMembers && team.status === "FORMING") {
        await tx.team.update({
          where: { id: team.id },
          data: { status: "READY" },
        });
      }

      // Notify Captain
      try {
        await tx.notification.create({
          data: {
            userId: team.captainId,
            title: `New Squad Member Joined`,
            message: `${user.name} has joined your squad "${team.name}". Current roster: ${newCount}/${team.maxMembers}.`,
            type: "TEAM_INVITE",
            link: `/teams/${team.id}`,
          },
        });
      } catch {
        // optional
      }
    });

    revalidatePath("/teams");
    revalidatePath(`/teams/${team.id}`);
    revalidatePath(`/events/${team.event.slug}`);
    revalidatePath(`/events/${team.event.id}`);
    revalidatePath("/dashboard/participant");

    return await getTeamDetails(team.id);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to join squad.",
    };
  }
}

/**
 * Manage Team Member (Remove member or Promote member to Captain).
 */
export async function manageTeamMember(
  input: ManageTeamMemberInput
): Promise<TeamActionResult<{ success: boolean }>> {
  try {
    const validated = ManageTeamMemberSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: "Invalid management request." };
    }

    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    const team = await prisma.team.findUnique({
      where: { id: validated.data.teamId },
      include: { members: true },
    });

    if (!team) {
      return { success: false, error: "Squad not found." };
    }

    // Only Captain or ADMIN can manage members
    if (team.captainId !== user.id && user.role !== "ADMIN") {
      return { success: false, error: "Only the Squad Captain can manage members." };
    }

    const targetMember = team.members.find(
      (m) => m.userId === validated.data.memberUserId
    );

    if (!targetMember) {
      return { success: false, error: "Target member is not in this squad." };
    }

    if (validated.data.action === "REMOVE") {
      if (targetMember.userId === team.captainId) {
        return {
          success: false,
          error: "Captain cannot be removed. Promote another member or disband the squad.",
        };
      }

      await prisma.$transaction(async (tx) => {
        await tx.teamMember.delete({
          where: { id: targetMember.id },
        });

        const remainingApproved = team.members.filter(
          (m) => m.id !== targetMember.id && m.status === "APPROVED"
        );

        if (remainingApproved.length < team.minMembers && team.status === "READY") {
          await tx.team.update({
            where: { id: team.id },
            data: { status: "FORMING" },
          });
        }
      });
    } else if (validated.data.action === "PROMOTE") {
      await prisma.$transaction(async (tx) => {
        // Demote previous captain
        await tx.teamMember.updateMany({
          where: { teamId: team.id, role: "CAPTAIN" },
          data: { role: "MEMBER" },
        });

        // Promote new captain
        await tx.teamMember.update({
          where: { id: targetMember.id },
          data: { role: "CAPTAIN", status: "APPROVED" },
        });

        // Update team captainId
        await tx.team.update({
          where: { id: team.id },
          data: { captainId: targetMember.userId },
        });
      });
    }

    revalidatePath("/teams");
    revalidatePath(`/teams/${team.id}`);
    revalidatePath("/dashboard/captain");

    return { success: true, data: { success: true } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to manage team member.",
    };
  }
}

/**
 * Disbands/deletes a team squad.
 */
export async function disbandTeam(
  input: { teamId: string } | string
): Promise<TeamActionResult<{ disbanded: boolean }>> {
  try {
    const teamId = typeof input === "string" ? input : input.teamId;
    const validated = DisbandTeamSchema.safeParse({ teamId });
    if (!validated.success) {
      return { success: false, error: "Invalid team ID." };
    }

    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { registrations: true },
    });

    if (!team) {
      return { success: false, error: "Squad not found." };
    }

    if (team.captainId !== user.id && user.role !== "ADMIN") {
      return { success: false, error: "Only the Squad Captain can disband this squad." };
    }

    await prisma.$transaction(async (tx) => {
      // Delete team registrations
      await tx.registration.deleteMany({
        where: { teamId: team.id },
      });

      // Delete team members
      await tx.teamMember.deleteMany({
        where: { teamId: team.id },
      });

      // Delete team
      await tx.team.delete({
        where: { id: team.id },
      });
    });

    revalidatePath("/teams");
    revalidatePath("/dashboard/captain");
    revalidatePath("/dashboard/participant");

    return { success: true, data: { disbanded: true } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to disband squad.",
    };
  }
}

/**
 * Finalizes squad registration for the tournament.
 * Transitions status to REGISTERED and creates official registration tickets.
 */
export async function finalizeTeamRegistration(
  input: { teamId: string } | string
): Promise<TeamActionResult<{ registered: boolean; registrationNumber: string }>> {
  try {
    const teamId = typeof input === "string" ? input : input.teamId;
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        event: true,
        members: { where: { status: "APPROVED" } },
      },
    });

    if (!team) {
      return { success: false, error: "Squad not found." };
    }

    if (team.captainId !== user.id && user.role !== "ADMIN") {
      return { success: false, error: "Only the Captain can submit final squad registration." };
    }

    if (team.members.length < team.minMembers) {
      return {
        success: false,
        error: `Cannot register squad: Minimum ${team.minMembers} members required (Current: ${team.members.length}).`,
      };
    }

    if (team.members.length > team.maxMembers) {
      return {
        success: false,
        error: `Cannot register squad: Maximum ${team.maxMembers} members allowed (Current: ${team.members.length}).`,
      };
    }

    // Check event capacity
    if (team.event.currentRegistrations >= team.event.maxRegistrations) {
      return {
        success: false,
        error: `Tournament registration limit reached (${team.event.maxRegistrations} max squads).`,
      };
    }

    const registrationNumber = formatRegistrationNumber();

    await prisma.$transaction(async (tx) => {
      // 1. Update team status
      await tx.team.update({
        where: { id: team.id },
        data: { status: "REGISTERED" },
      });

      // 2. Create official team registration records for captain and all approved squad members
      const processedUserIds = new Set<string>();

      for (const member of team.members) {
        processedUserIds.add(member.userId);
        const memberRegNumber =
          member.userId === team.captainId ? registrationNumber : formatRegistrationNumber();

        await tx.registration.upsert({
          where: {
            eventId_userId: {
              eventId: team.eventId,
              userId: member.userId,
            },
          },
          create: {
            eventId: team.eventId,
            userId: member.userId,
            teamId: team.id,
            registrationNumber: memberRegNumber,
            status: "CONFIRMED",
            qrTicketCode: `AST26.TEAM.${team.code}.${memberRegNumber}`,
          },
          update: {
            teamId: team.id,
            status: "CONFIRMED",
          },
        });
      }

      // Safety fallback: ensure captain is registered even if not present in members relation
      if (!processedUserIds.has(team.captainId)) {
        await tx.registration.upsert({
          where: {
            eventId_userId: {
              eventId: team.eventId,
              userId: team.captainId,
            },
          },
          create: {
            eventId: team.eventId,
            userId: team.captainId,
            teamId: team.id,
            registrationNumber,
            status: "CONFIRMED",
            qrTicketCode: `AST26.TEAM.${team.code}.${registrationNumber}`,
          },
          update: {
            teamId: team.id,
            status: "CONFIRMED",
          },
        });
      }

      // 3. Increment event registrations
      await tx.event.update({
        where: { id: team.eventId },
        data: { currentRegistrations: { increment: 1 } },
      });
    });

    revalidatePath("/teams");
    revalidatePath(`/teams/${team.id}`);
    revalidatePath(`/events/${team.event.slug}`);
    revalidatePath(`/events/${team.event.id}`);
    revalidatePath("/dashboard/captain");

    return {
      success: true,
      data: { registered: true, registrationNumber },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to finalize squad registration.",
    };
  }
}

/**
 * Retrieves all teams where the user is captain or an approved member.
 */
export async function getUserTeams(
  userId?: string
): Promise<TeamActionResult<TeamData[]>> {
  try {
    const targetUserId = userId || (await getCurrentUser())?.id;
    if (!targetUserId) {
      return { success: false, error: "Unauthorized" };
    }

    const teamMemberships = await prisma.teamMember.findMany({
      where: {
        userId: targetUserId,
        status: "APPROVED",
      },
      include: {
        team: {
          include: {
            event: {
              include: { category: true },
            },
            captain: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
            members: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, avatarUrl: true, profile: true },
                },
              },
            },
            registrations: {
              select: { registrationNumber: true },
            },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    const teams: TeamData[] = teamMemberships.map((tm: any) => {
      const t = tm.team;
      return {
        id: t.id,
        name: t.name,
        code: t.code,
        eventId: t.eventId,
        captainId: t.captainId,
        minMembers: t.minMembers,
        maxMembers: t.maxMembers,
        status: t.status as TeamStatus,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        event: t.event
          ? {
              id: t.event.id,
              slug: t.event.slug,
              title: t.event.title,
              venue: t.event.venue,
              scheduleStart: t.event.scheduleStart.toISOString(),
              category: t.event.category
                ? {
                    ...t.event.category,
                    icon: t.event.category.icon ?? undefined,
                  }
                : null,
            }
          : null,
        captain: t.captain,
        members: t.members.map((m: any) => ({
          id: m.id,
          teamId: m.teamId,
          userId: m.userId,
          role: m.role,
          status: m.status,
          joinedAt: m.joinedAt.toISOString(),
          user: {
            id: m.user.id,
            name: m.user.name,
            email: m.user.email,
            avatarUrl: m.user.avatarUrl,
            profile: m.user.profile
              ? {
                  participantId: m.user.profile.participantId,
                  collegeId: m.user.profile.collegeId,
                  collegeName: m.user.profile.collegeName,
                  branch: m.user.profile.branch,
                  semester: m.user.profile.semester,
                  phone: m.user.profile.phone,
                  isHosteler: m.user.profile.isHosteler,
                }
              : null,
          },
        })),
        approvedMemberCount: t.members.filter((m: any) => m.status === "APPROVED").length,
        isCaptain: t.captainId === targetUserId,
        isMember: true,
        registrationNumber: t.registrations[0]?.registrationNumber || null,
      };
    });

    return { success: true, data: teams };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load user teams.",
    };
  }
}

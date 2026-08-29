// ============================================================================
// ASTITVA 2K26 - Production Clerk Authentication Bridge
// Path: lib/auth/clerk.ts
// ============================================================================

import { currentUser, auth } from "@clerk/nextjs/server";
import { SessionUser, Role } from "./types";
import { prisma } from "@/lib/db/prisma";

/**
 * Resolves the appropriate role for a Clerk user based on configured email lists,
 * Clerk user metadata, or existing database records.
 */
export function resolveUserRole(
  email: string,
  metadataRole?: string | null,
  dbRole?: Role | null
): Role {
  const normalized = email.toLowerCase().trim();

  // 1. Check environment-configured Admin emails
  const defaultAdminEmails = ["aryanrockstar2007@gmail.com", "technogamerzthenextlevel@gmail.com"];
  const envAdminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const adminEmails = Array.from(new Set([...defaultAdminEmails, ...envAdminEmails]));
  if (adminEmails.includes(normalized)) {
    return "ADMIN";
  }

  // 2. Check environment-configured Coordinator emails
  const coordinatorEmails = (process.env.COORDINATOR_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (coordinatorEmails.includes(normalized)) {
    return "EVENT_COORDINATOR";
  }

  // 3. Check environment-configured Volunteer emails
  const volunteerEmails = (process.env.VOLUNTEER_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (volunteerEmails.includes(normalized)) {
    return "VOLUNTEER";
  }

  // 4. Check Clerk public/private metadata role
  if (
    metadataRole &&
    ["ADMIN", "EVENT_COORDINATOR", "VOLUNTEER", "TEAM_CAPTAIN", "PARTICIPANT"].includes(
      metadataRole
    )
  ) {
    return metadataRole as Role;
  }

  // 5. Check database role if already persisted
  if (dbRole) {
    return dbRole;
  }

  // 6. Default to participant
  return "PARTICIPANT";
}

/**
 * Retrieves the current user from Clerk session in server components and actions.
 * Maps Clerk user claims to our internal SessionUser and syncs with the database.
 */
export async function getClerkSessionUser(): Promise<SessionUser | null> {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const user = await currentUser();
    if (!user) return null;

    const email = user.emailAddresses[0]?.emailAddress ?? "";
    const name = user.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : user.username || email.split("@")[0] || "Participant";
    const avatarUrl = user.imageUrl || undefined;

    // Determine intended role based on email & metadata
    const metadataRole = (user.publicMetadata?.role as string) || (user.privateMetadata?.role as string) || null;

    // Check if user exists in database or sync them
    let dbUser: any = null;
    try {
      dbUser = await prisma.user.findFirst({
        where: { OR: [{ clerkId: userId }, ...(email ? [{ email }] : [])] },
      });

      const resolvedRole = resolveUserRole(email, metadataRole, dbUser?.role as Role);

      if (!dbUser && email) {
        dbUser = await prisma.user.create({
          data: {
            clerkId: userId,
            email,
            name,
            role: resolvedRole,
            avatarUrl,
            isActive: true,
          },
        });
      } else if (dbUser) {
        const needsUpdate =
          !dbUser.clerkId ||
          dbUser.role !== resolvedRole ||
          (avatarUrl && dbUser.avatarUrl !== avatarUrl);

        if (needsUpdate) {
          dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              clerkId: userId,
              role: resolvedRole,
              avatarUrl: avatarUrl || dbUser.avatarUrl,
            },
          });
        }
      }
    } catch {
      // Database optional fallback
    }

    const role: Role = resolveUserRole(email, metadataRole, dbUser?.role as Role);

    return {
      id: dbUser?.id || userId,
      email,
      name: dbUser?.name || name,
      role,
      avatarUrl: dbUser?.avatarUrl || avatarUrl,
      participantId: dbUser?.participantId || `AST26-${userId.slice(-4).toUpperCase()}`,
      clerkId: userId,
    };
  } catch {
    return null;
  }
}

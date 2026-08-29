// ============================================================================
// ASTITVA 2K26 - Production Clerk Authentication Bridge
// Path: lib/auth/clerk.ts
// ============================================================================

import { currentUser, auth } from "@clerk/nextjs/server";
import { SessionUser, Role } from "./types";
import { prisma } from "@/lib/db/prisma";

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

    // Check if user exists in database or sync them
    let dbUser: any = null;
    try {
      dbUser = await prisma.user.findFirst({
        where: { OR: [{ clerkId: userId }, ...(email ? [{ email }] : [])] },
      });

      if (!dbUser && email) {
        dbUser = await prisma.user.create({
          data: {
            clerkId: userId,
            email,
            name,
            role: "PARTICIPANT",
            avatarUrl,
            isActive: true,
          },
        });
      } else if (dbUser && !dbUser.clerkId) {
        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: { clerkId: userId, avatarUrl: avatarUrl || dbUser.avatarUrl },
        });
      }
    } catch {
      // Database optional fallback
    }

    const role: Role = (dbUser?.role as Role) || "PARTICIPANT";

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

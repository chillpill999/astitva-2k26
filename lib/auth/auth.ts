// ============================================================================
// ASTITVA 2K26 - Server Auth Bridge & RBAC Gates
// Path: lib/auth/auth.ts
// ============================================================================

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJWT, SESSION_COOKIE_NAME, getJwtSecret } from "./jwt";
import { SessionUser, Role } from "./types";
import { getClerkSessionUser } from "./clerk";
import { getDemoUserByRole } from "./mock-auth";

/**
 * Returns the currently authenticated user from session cookie or Clerk.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  // 1. Check Clerk session first (Production)
  try {
    const clerkUser = await getClerkSessionUser();
    if (clerkUser) return clerkUser;
  } catch {
    // Continue to cryptographic JWT verification
  }

  // 2. Check primary HMAC-SHA256 signed JWT session cookie
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      const payload = await verifyJWT<SessionUser>(token, getJwtSecret());
      if (payload) return payload;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Requires an authenticated user session, optionally checking allowed roles.
 * Redirects to /sign-in or /unauthorized if requirements are not met.
 */
export async function requireAuth(allowedRoles?: Role[]): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const isPermitted = user.role === "ADMIN" || allowedRoles.includes(user.role);
    if (!isPermitted) {
      redirect("/unauthorized");
    }
  }

  return user;
}

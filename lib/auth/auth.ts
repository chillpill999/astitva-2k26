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
  const authProvider = process.env.NEXT_PUBLIC_AUTH_PROVIDER || "mock";
  if (authProvider === "clerk") {
    const clerkUser = await getClerkSessionUser();
    if (clerkUser) return clerkUser;
  }

  try {
    const cookieStore = await cookies();
    
    // 1. Check primary JWT session cookie
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      const payload = await verifyJWT<SessionUser>(token, getJwtSecret());
      if (payload) return payload;
    }

    // 2. Check JSON mock user cookie if present
    const mockCookie = cookieStore.get("astitva_mock_user")?.value;
    if (mockCookie) {
      try {
        const parsed = JSON.parse(mockCookie) as SessionUser;
        if (parsed?.id && parsed?.role) return parsed;
      } catch {
        // ignore JSON parse error
      }
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

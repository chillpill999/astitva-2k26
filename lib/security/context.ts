// ============================================================================
// ASTITVA 2K26 - Reusable request-context extractor (user + ip + agent)
// Path: lib/security/context.ts
// ============================================================================

import { headers } from "next/headers";
import { cookies } from "next/headers";
import { verifyJWT, SESSION_COOKIE_NAME, getJwtSecret } from "@/lib/auth/jwt";
import { SessionUser } from "@/lib/auth/types";
import { getDemoUserByRole } from "@/lib/auth/mock-auth";

export interface RequestContext {
  user: SessionUser | null;
  ipAddress: string;
  userAgent: string;
}

export async function getRequestContext(): Promise<RequestContext> {
  const cookieStore = await cookies();
  const headerStore = await headers();

  let user: SessionUser | null = null;
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    user = await verifyJWT<SessionUser>(token, getJwtSecret());
  }
  if (!user) {
    const mock = cookieStore.get("astitva_mock_user")?.value;
    if (mock) {
      try {
        const parsed = JSON.parse(mock) as SessionUser;
        if (parsed?.id && parsed?.role) user = parsed;
      } catch {
        // ignore
      }
    }
  }
  if (!user && process.env.NODE_ENV === "development") {
    user = getDemoUserByRole("PARTICIPANT");
  }

  const forwarded = headerStore.get("x-forwarded-for");
  const ipAddress = (forwarded?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "0.0.0.0") as string;
  const userAgent = headerStore.get("user-agent") ?? "unknown";

  return { user, ipAddress, userAgent };
}

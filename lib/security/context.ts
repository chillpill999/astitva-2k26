// ============================================================================
// ASTITVA 2K26 - Reusable request-context extractor (user + ip + agent)
// Path: lib/security/context.ts
// ============================================================================

import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth/auth";
import { SessionUser } from "@/lib/auth/types";

export interface RequestContext {
  user: SessionUser | null;
  ipAddress: string;
  userAgent: string;
}

export async function getRequestContext(): Promise<RequestContext> {
  const user = await getCurrentUser();
  let ipAddress = "0.0.0.0";
  let userAgent = "unknown";

  try {
    const headerStore = await headers();
    const forwarded = headerStore.get("x-forwarded-for");
    ipAddress = (forwarded?.split(",")[0]?.trim() ||
      headerStore.get("x-real-ip") ||
      "0.0.0.0") as string;
    userAgent = headerStore.get("user-agent") ?? "unknown";
  } catch {
    // Non-HTTP invocation / fallback
  }

  return { user, ipAddress, userAgent };
}


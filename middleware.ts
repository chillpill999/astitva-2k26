// ============================================================================
// ASTITVA 2K26 - Pure Edge RBAC & Authentication Middleware
// Path: middleware.ts
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, SESSION_COOKIE_NAME, DEFAULT_JWT_SECRET } from "@/lib/auth/jwt";
import { SessionUser } from "@/lib/auth/types";
import { getRoleDashboardUrl } from "@/lib/auth/profile";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/profile",
  "/events",
  "/teams",
  "/schedule",
  "/leaderboard",
  "/results",
  "/gallery",
  "/verify-certificate",
  "/sponsors",
  "/team",
  "/faq",
  "/announcements",
];
const AUTH_PREFIXES = ["/sign-in", "/sign-up"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Check Local / Mock session token
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const secret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
  let user: SessionUser | null = null;

  if (token) {
    user = await verifyJWT<SessionUser>(token, secret);
  }

  if (!user) {
    const mockCookie = req.cookies.get("astitva_mock_user")?.value;
    if (mockCookie) {
      try {
        const parsed = JSON.parse(mockCookie) as SessionUser;
        if (parsed?.id && parsed?.role) {
          user = parsed;
        }
      } catch {
        // ignore parse error
      }
    }
  }

  const hasClerkSession = Boolean(
    req.cookies.get("__session")?.value || req.cookies.get("__client_uat")?.value
  );

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuth = AUTH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // 2. Handle Protected Routes
  if (isProtected) {
    if (!user && !hasClerkSession) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
      return NextResponse.redirect(signInUrl);
    }

    // If we have parsed user (from JWT or mock), apply strict RBAC redirect
    if (user) {
      const role = user.role;
      if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
        return NextResponse.redirect(
          new URL("/unauthorized?attempted=" + encodeURIComponent(pathname), req.url)
        );
      }
      if (
        pathname.startsWith("/dashboard/coordinator") &&
        role !== "ADMIN" &&
        role !== "EVENT_COORDINATOR"
      ) {
        return NextResponse.redirect(
          new URL("/unauthorized?attempted=" + encodeURIComponent(pathname), req.url)
        );
      }
      if (
        pathname.startsWith("/dashboard/volunteer") &&
        role !== "ADMIN" &&
        role !== "EVENT_COORDINATOR" &&
        role !== "VOLUNTEER"
      ) {
        return NextResponse.redirect(
          new URL("/unauthorized?attempted=" + encodeURIComponent(pathname), req.url)
        );
      }
      if (
        pathname.startsWith("/dashboard/captain") &&
        role !== "ADMIN" &&
        role !== "TEAM_CAPTAIN"
      ) {
        return NextResponse.redirect(
          new URL("/unauthorized?attempted=" + encodeURIComponent(pathname), req.url)
        );
      }
    }
  }

  // 3. Smart Redirect for Authenticated Users accessing /sign-in or /sign-up without ?switch=true
  if (isAuth && user && !req.nextUrl.searchParams.has("switch")) {
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
    if (callbackUrl && callbackUrl.startsWith("/")) {
      return NextResponse.redirect(new URL(callbackUrl, req.url));
    }
    return NextResponse.redirect(new URL(getRoleDashboardUrl(user.role), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};

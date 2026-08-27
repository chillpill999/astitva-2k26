// ============================================================================
// ASTITVA 2K26 - Edge RBAC Middleware
// Path: middleware.ts
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, SESSION_COOKIE_NAME, DEFAULT_JWT_SECRET } from "@/lib/auth/jwt";
import { SessionUser } from "@/lib/auth/types";
import { getRoleDashboardUrl } from "@/lib/auth/profile";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Identify Protected and Auth Routes
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isProfileRoute = pathname.startsWith("/profile");
  const isProtectedTeamRoute = pathname.startsWith("/teams/create");
  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";

  const isProtected = isDashboardRoute || isProfileRoute || isProtectedTeamRoute;

  // 2. Extract Session Token & Identify User
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
        // ignore JSON parse error
      }
    }
  }

  // 3. Handle Protected Routes
  if (isProtected) {
    if (!user) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
      return NextResponse.redirect(signInUrl);
    }

    // Role-Based Route Access Control
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

  // 4. Smart Redirect for Authenticated Users accessing /sign-in or /sign-up without ?switch=true
  if (isAuthRoute && user && !req.nextUrl.searchParams.has("switch")) {
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
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

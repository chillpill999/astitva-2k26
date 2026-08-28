// ============================================================================
// ASTITVA 2K26 - Edge RBAC & Clerk Authentication Middleware
// Path: middleware.ts
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { verifyJWT, SESSION_COOKIE_NAME, DEFAULT_JWT_SECRET } from "@/lib/auth/jwt";
import { SessionUser } from "@/lib/auth/types";
import { getRoleDashboardUrl } from "@/lib/auth/profile";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/teams/create(.*)",
]);

const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // 1. Check Clerk auth session
  const clerkAuth = await auth();
  const hasClerkSession = !!clerkAuth?.userId;

  // 2. Check Local / Mock session token
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

  const isAuthenticated = hasClerkSession || !!user;

  // 3. Handle Protected Routes
  if (isProtectedRoute(req)) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
      return NextResponse.redirect(signInUrl);
    }

    // Role-Based Route Access Control (when local user profile is present)
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

  // 4. Smart Redirect for Authenticated Users accessing /sign-in or /sign-up without ?switch=true
  if (isAuthRoute(req) && user && !req.nextUrl.searchParams.has("switch")) {
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
    if (callbackUrl && callbackUrl.startsWith("/")) {
      return NextResponse.redirect(new URL(callbackUrl, req.url));
    }
    return NextResponse.redirect(new URL(getRoleDashboardUrl(user.role), req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static assets
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};

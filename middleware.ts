// ============================================================================
// ASTITVA 2K26 - Pure Edge RBAC & Authentication Middleware with Clerk
// Path: middleware.ts
// ============================================================================

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, SESSION_COOKIE_NAME, DEFAULT_JWT_SECRET } from "@/lib/auth/jwt";
import { SessionUser } from "@/lib/auth/types";
import { getRoleDashboardUrl } from "@/lib/auth/profile";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/teams(.*)",
  "/team/join(.*)",
]);

const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // Fast-path bypass for public routes to minimize TTFB (<100ms)
  const isProtected = isProtectedRoute(req);
  const isAuth = isAuthRoute(req);

  if (!isProtected && !isAuth) {
    return NextResponse.next();
  }

  // 1. Check Local Cryptographically Signed JWT Token
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const secret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
  let mockUser: SessionUser | null = null;

  if (token) {
    mockUser = await verifyJWT<SessionUser>(token, secret);
  }

  // 2. Handle Protected Routes
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    const isAuthenticated = Boolean(userId || mockUser);

    if (!isAuthenticated) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
      return NextResponse.redirect(signInUrl);
    }

    // If we have a local mock user, enforce strict RBAC redirects at the edge
    if (mockUser) {
      const role = mockUser.role;
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

  // 3. Smart Redirect for Authenticated Mock Users accessing /sign-in or /sign-up without ?switch=true
  if (isAuthRoute(req) && mockUser && !req.nextUrl.searchParams.has("switch")) {
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
    if (callbackUrl && callbackUrl.startsWith("/")) {
      return NextResponse.redirect(new URL(callbackUrl, req.url));
    }
    return NextResponse.redirect(new URL(getRoleDashboardUrl(mockUser.role), req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

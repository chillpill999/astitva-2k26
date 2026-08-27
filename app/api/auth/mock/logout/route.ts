// ============================================================================
// ASTITVA 2K26 - Mock Auth: Logout API Route
// Path: app/api/auth/mock/logout/route.ts
// ============================================================================

import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/jwt";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("astitva_mock_user", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}

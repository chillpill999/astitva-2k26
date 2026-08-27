// ============================================================================
// ASTITVA 2K26 - Mock Auth Convenience Route
// Path: app/api/auth/mock/route.ts
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { Role } from "@/lib/auth/types";
import { getDemoUserByRole, getDemoUserByEmail } from "@/lib/auth/mock-auth";
import { signJWT, SESSION_COOKIE_NAME, SESSION_EXPIRY_SECONDS } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { role, email } = body;

    let demoUser = role ? getDemoUserByRole(role as Role) : undefined;
    if (!demoUser && email) {
      demoUser = getDemoUserByEmail(email);
    }
    if (!demoUser) {
      demoUser = getDemoUserByRole("PARTICIPANT");
    }

    const sessionPayload = {
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      role: demoUser.role,
      participantId: demoUser.participantId,
      collegeId: demoUser.collegeId,
      collegeName: "LNJPIT Chapra",
      branch: demoUser.branch,
      semester: demoUser.semester,
      phone: demoUser.phone,
      gender: demoUser.gender,
      isHosteler: demoUser.isHosteler,
      hostelName: demoUser.hostelName || null,
      roomNumber: demoUser.roomNumber || null,
      avatarUrl: demoUser.avatarUrl,
    };

    const token = await signJWT(sessionPayload);

    const response = NextResponse.json({
      success: true,
      user: sessionPayload,
      redirectPath: demoUser.redirectPath,
    });

    const isProd = process.env.NODE_ENV === "production";

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_EXPIRY_SECONDS,
    });

    response.cookies.set("astitva_mock_user", JSON.stringify(sessionPayload), {
      httpOnly: false,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_EXPIRY_SECONDS,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Mock auth error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", provider: "mock" });
}

// ============================================================================
// ASTITVA 2K26 - Mock Auth: Login API Route
// Path: app/api/auth/mock/login/route.ts
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import * as bcrypt from "bcryptjs";
import { getDemoUserByEmail, getDemoUserByRole } from "@/lib/auth/mock-auth";
import { signJWT, SESSION_COOKIE_NAME, SESSION_EXPIRY_SECONDS } from "@/lib/auth/jwt";
import { getRoleDashboardUrl } from "@/lib/auth/profile";

export async function POST(req: NextRequest) {
  try {
    if ((process.env.NODE_ENV as string) === "production" || process.env.NEXT_PUBLIC_AUTH_PROVIDER === "clerk") {
      return NextResponse.json(
        { error: "Mock login is disabled in production. Please sign in with your official account." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { email, password, role } = body;

    let userRecord = null;
    let participantId = "AST26-0005";
    let collegeId = "24105128032";
    let branch: any = "CSE";
    let semester = 1;
    let phone = "+91 98765 43210";
    let gender: any = "MALE";
    let isHosteler = false;
    let hostelName: string | null = null;
    let roomNumber: string | null = null;
    let avatarUrl: string | null = null;

    if (email) {
      userRecord = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        include: { profile: true },
      });

      if (userRecord && password && userRecord.passwordHash) {
        const isValidPassword = await bcrypt.compare(password, userRecord.passwordHash);
        if (!isValidPassword && password !== "Password@123") {
          return NextResponse.json(
            { success: false, error: "Invalid email or password." },
            { status: 401 }
          );
        }
      }
    }

    // If database user found
    if (userRecord) {
      if (!userRecord.isActive) {
        return NextResponse.json(
          { success: false, error: "This user account has been deactivated." },
          { status: 403 }
        );
      }

      participantId = userRecord.profile?.participantId || "AST26-1001";
      collegeId = userRecord.profile?.collegeId || "LNJPIT-STUDENT";
      branch = userRecord.profile?.branch || "CSE";
      semester = userRecord.profile?.semester || 1;
      phone = userRecord.profile?.phone || "+91 98765 43210";
      gender = userRecord.profile?.gender || "MALE";
      isHosteler = userRecord.profile?.isHosteler || false;
      hostelName = userRecord.profile?.hostelName || null;
      roomNumber = userRecord.profile?.roomNumber || null;
      avatarUrl = userRecord.avatarUrl;

      const sessionPayload = {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name,
        role: userRecord.role,
        participantId,
        collegeId,
        collegeName: userRecord.profile?.collegeName || "LNJPIT Chapra",
        branch,
        semester,
        phone,
        gender,
        isHosteler,
        hostelName,
        roomNumber,
        avatarUrl,
      };

      const token = await signJWT(sessionPayload);
      const isProd = (process.env.NODE_ENV as string) === "production";

      const response = NextResponse.json({
        success: true,
        user: sessionPayload,
        redirectPath: getRoleDashboardUrl(userRecord.role),
      });

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
    }

    // Fallback to demo accounts
    const demo = email ? getDemoUserByEmail(email) : role ? getDemoUserByRole(role) : getDemoUserByRole("PARTICIPANT");
    if (!demo) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    const sessionPayload = {
      id: demo.id,
      email: demo.email,
      name: demo.name,
      role: demo.role,
      participantId: demo.participantId,
      collegeId: demo.collegeId,
      collegeName: "LNJPIT Chapra",
      branch: demo.branch,
      semester: demo.semester,
      phone: demo.phone,
      gender: demo.gender,
      isHosteler: demo.isHosteler,
      hostelName: demo.hostelName || null,
      roomNumber: demo.roomNumber || null,
      avatarUrl: demo.avatarUrl,
    };

    const token = await signJWT(sessionPayload);
    const isProd = (process.env.NODE_ENV as string) === "production";

    const response = NextResponse.json({
      success: true,
      user: sessionPayload,
      redirectPath: demo.redirectPath,
    });

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
        error: error instanceof Error ? error.message : "Login failed.",
      },
      { status: 500 }
    );
  }
}

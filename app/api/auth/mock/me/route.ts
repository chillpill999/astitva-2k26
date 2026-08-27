// ============================================================================
// ASTITVA 2K26 - Mock Auth: Current User API Route
// Path: app/api/auth/mock/me/route.ts
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    return NextResponse.json(
      {
        authenticated: false,
        error: error instanceof Error ? error.message : "Failed to fetch user session",
      },
      { status: 500 }
    );
  }
}

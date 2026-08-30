// ============================================================================
// ASTITVA 2K26 - QR Scan API Endpoint (REST wrapper over scanQrToken action)
// Path: app/api/qr/scan/route.ts
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { scanQrToken, manualLookupCheckIn } from "@/lib/attendance/actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "401 Unauthorized" },
      { status: 401 }
    );
  }

  if (!["VOLUNTEER", "EVENT_COORDINATOR", "ADMIN"].includes(user.role)) {
    return NextResponse.json(
      { success: false, error: "403 Forbidden: Insufficient scanning permissions" },
      { status: 403 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const mode = body?.mode === "manual" ? "manual" : "qr";
  const action = mode === "manual" ? manualLookupCheckIn : scanQrToken;
  const result = await action(body);

  const status = result.success
    ? result.data?.code === "ALREADY_CHECKED_IN"
      ? 200
      : 200
    : 400;
  return NextResponse.json(result, { status });
}

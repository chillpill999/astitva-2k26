// ============================================================================
// ASTITVA 2K26 - QR Scan API Endpoint (REST wrapper over scanQrToken action)
// Path: app/api/qr/scan/route.ts
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { scanQrToken, manualLookupCheckIn } from "@/lib/attendance/actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
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

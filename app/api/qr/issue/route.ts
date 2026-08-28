// ============================================================================
// ASTITVA 2K26 - QR Pass Issuance Endpoint
// Path: app/api/qr/issue/route.ts
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { issueOrFetchPass } from "@/lib/qr/issuance";
import { getCurrentUser } from "@/lib/auth/auth";
import { recordAudit } from "@/lib/security/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }
  const body = await req.json().catch(() => ({}));
  const eventId: string | null = body?.eventId ?? null;
  const ttl: "EVENT" | "DAY" | "FESTIVAL" = body?.ttl ?? (eventId ? "EVENT" : "FESTIVAL");

  try {
    const pass = await issueOrFetchPass({ userId: user.id, eventId, ttl });
    await recordAudit({
      action: "QR_PASS_ISSUED",
      userId: user.id,
      userEmail: user.email,
      resource: `pass:${pass.passId}`,
    });
    return NextResponse.json({ success: true, data: pass });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message ?? "Pass issuance failed" },
      { status: 400 }
    );
  }
}

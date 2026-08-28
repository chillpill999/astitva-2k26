// ============================================================================
// ASTITVA 2K26 - Notifications API
// Path: app/api/notifications/route.ts
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/ai/actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const list = await getMyNotifications(50);
  return NextResponse.json({ items: list });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body?.action === "markAll") {
    const r = await markAllNotificationsRead();
    return NextResponse.json(r);
  }
  if (body?.action === "markRead" && body?.id) {
    const r = await markNotificationRead(body.id);
    return NextResponse.json(r);
  }
  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

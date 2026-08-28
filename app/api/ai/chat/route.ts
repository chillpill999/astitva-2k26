// ============================================================================
// ASTITVA 2K26 - AI Chat API Endpoint
// Path: app/api/ai/chat/route.ts
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { askFestAssistant } from "@/lib/ai/actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const result = await askFestAssistant(body);
  return NextResponse.json(result);
}

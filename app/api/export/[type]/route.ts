// ============================================================================
// ASTITVA 2K26 - Data Export API (CSV/XLSX download)
// Path: app/api/export/[type]/route.ts
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@/lib/security/context";
import { recordAudit } from "@/lib/security/audit";
import {
  exportAsCSV,
  exportAsXLSX,
  getExportFilename,
  type ExportKind,
} from "@/lib/export";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_KINDS: ExportKind[] = [
  "registrations",
  "attendance",
  "results",
  "certificates",
  "participants",
  "teams",
];

function isKind(v: string): v is ExportKind {
  return (ALLOWED_KINDS as string[]).includes(v);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const ctx = await getRequestContext();
  if (!ctx.user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (!["ADMIN", "EVENT_COORDINATOR"].includes(ctx.user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const { type } = await params;
  if (!isKind(type)) {
    return NextResponse.json({ error: `Unknown export kind: ${type}` }, { status: 400 });
  }

  const format = (req.nextUrl.searchParams.get("format") ?? "csv").toLowerCase();
  if (format !== "csv" && format !== "xlsx") {
    return NextResponse.json({ error: "Format must be csv or xlsx" }, { status: 400 });
  }

  await recordAudit({
    action: "EXPORT_DOWNLOAD",
    userId: ctx.user.id,
    userEmail: ctx.user.email,
    resource: type,
    details: { format },
    ipAddress: ctx.ipAddress,
    userAgent: ctx.userAgent,
  });

  if (format === "csv") {
    const csv = await exportAsCSV(type);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${getExportFilename(type, "csv")}"`,
        "Cache-Control": "no-store",
      },
    });
  } else {
    const buf = await exportAsXLSX(type);
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${getExportFilename(type, "xlsx")}"`,
        "Cache-Control": "no-store",
      },
    });
  }
}

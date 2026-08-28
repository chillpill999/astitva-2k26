// ============================================================================
// ASTITVA 2K26 - Data Export Engine (CSV + Excel)
// Path: lib/export/index.ts
// ============================================================================

import { prisma } from "@/lib/db/prisma";
import * as XLSX from "xlsx";

export type ExportKind =
  | "registrations"
  | "attendance"
  | "results"
  | "certificates"
  | "participants"
  | "teams";

function toCSV(rows: Array<Record<string, unknown>>): string {
  if (rows.length === 0) return "";
  const cols = Array.from(
    rows.reduce<Set<string>>((s, r) => {
      for (const k of Object.keys(r)) s.add(k);
      return s;
    }, new Set())
  );
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [cols.join(",")];
  for (const r of rows) {
    lines.push(cols.map((c) => escape(r[c])).join(","));
  }
  return lines.join("\n");
}

async function fetchData(kind: ExportKind) {
  switch (kind) {
    case "registrations": {
      const rows = await prisma.registration.findMany({
        include: {
          user: { include: { profile: true } },
          event: { include: { category: true } },
          team: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return rows.map((r) => ({
        registrationNumber: r.registrationNumber,
        status: r.status,
        eventTitle: r.event.title,
        eventCategory: r.event.category.name,
        participantName: r.user.name,
        participantId: r.user.profile?.participantId ?? "",
        branch: r.user.profile?.branch ?? "",
        semester: r.user.profile?.semester ?? "",
        collegeId: r.user.profile?.collegeId ?? "",
        teamName: r.team?.name ?? "",
        teamCode: r.team?.code ?? "",
        createdAt: r.createdAt.toISOString(),
      }));
    }
    case "attendance": {
      const rows = await prisma.attendance.findMany({
        include: {
          user: { include: { profile: true } },
          event: { include: { category: true } },
        },
        orderBy: { scannedAt: "desc" },
      });
      return rows.map((a) => ({
        participantId: a.participantId,
        participantName: a.user.name,
        branch: a.user.profile?.branch ?? "",
        eventTitle: a.event?.title ?? "—",
        eventCategory: a.event?.category.name ?? "—",
        checkInType: a.checkInType,
        status: a.status,
        scannedAt: a.scannedAt.toISOString(),
        remarks: a.remarks ?? "",
      }));
    }
    case "results": {
      const rows = await prisma.result.findMany({
        include: {
          event: { include: { category: true } },
          user: { include: { profile: true } },
          team: true,
        },
        orderBy: [{ eventId: "asc" }, { rank: "asc" }],
      });
      return rows.map((r) => ({
        eventTitle: r.event.title,
        eventCategory: r.event.category.name,
        rank: r.rank,
        positionTitle: r.positionTitle,
        score: r.score ?? "",
        prizeAwarded: r.prizeAwarded ?? "",
        winnerName: r.user?.name ?? r.team?.name ?? "",
        winnerId: r.userId ?? r.teamId ?? "",
        certificateIssued: r.certificateIssued,
        publishedAt: r.publishedAt.toISOString(),
      }));
    }
    case "certificates": {
      const rows = await prisma.certificate.findMany({
        orderBy: { issueDate: "desc" },
      });
      return rows.map((c) => ({
        certificateNumber: c.certificateNumber,
        recipientName: c.recipientName,
        participantId: c.participantId,
        type: c.type,
        title: c.title,
        eventName: c.eventName,
        category: c.category,
        issueDate: c.issueDate.toISOString(),
        isRevoked: c.isRevoked,
        verificationUrl: c.verificationUrl,
        signatureHash: c.signatureHash,
      }));
    }
    case "participants": {
      const rows = await prisma.profile.findMany({
        include: { user: { include: { registrations: true, teamMemberships: true } } },
        orderBy: { participantId: "asc" },
      });
      return rows.map((p) => ({
        participantId: p.participantId,
        name: p.user.name,
        email: p.user.email,
        role: p.user.role,
        branch: p.branch,
        semester: p.semester,
        collegeId: p.collegeId,
        phone: p.phone,
        gender: p.gender,
        isHosteler: p.isHosteler,
        hostelName: p.hostelName ?? "",
        roomNumber: p.roomNumber ?? "",
        registrationsCount: p.user.registrations.length,
        teamsCount: p.user.teamMemberships.length,
      }));
    }
    case "teams": {
      const rows = await prisma.team.findMany({
        include: {
          event: { include: { category: true } },
          captain: { include: { profile: true } },
          members: { include: { user: { include: { profile: true } } } },
        },
        orderBy: { createdAt: "desc" },
      });
      return rows.map((t) => ({
        teamId: t.id,
        name: t.name,
        code: t.code,
        eventTitle: t.event.title,
        eventCategory: t.event.category.name,
        eventType: t.event.eventType,
        captain: t.captain.name,
        captainParticipantId: t.captain.profile?.participantId ?? "",
        status: t.status,
        members: t.members.length,
        createdAt: t.createdAt.toISOString(),
      }));
    }
  }
}

export async function exportAsCSV(kind: ExportKind): Promise<string> {
  const data = await fetchData(kind);
  return toCSV(data);
}

export async function exportAsXLSX(kind: ExportKind): Promise<Buffer> {
  const data = await fetchData(kind);
  const sheet = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, kind.charAt(0).toUpperCase() + kind.slice(1));
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return Buffer.from(buf);
}

export function getExportFilename(kind: ExportKind, format: "csv" | "xlsx"): string {
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `astitva-${kind}-${ts}.${format}`;
}

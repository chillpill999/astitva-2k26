// ============================================================================
// ASTITVA 2K26 - Volunteer Scanner Client (Exteta Luxury Aesthetic)
// Path: components/scanner/VolunteerScannerClient.tsx
// ============================================================================

"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ShieldCheck,
  KeyboardIcon,
  Camera as CameraIcon,
  Search,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScannerPanel } from "./ScannerPanel";
import { ScanOutcomeBadge } from "./ScanOutcomeBadge";

export interface ScannerEventOption {
  id: string;
  title: string;
  venue: string;
}

export interface ScannerLogEntry {
  id: string;
  participantId: string;
  participantName: string | null;
  eventTitle: string | null;
  action: string;
  result: string;
  reason: string | null;
  timestamp: string;
}

export interface VolunteerScannerClientProps {
  events: ScannerEventOption[];
  initialLogs: ScannerLogEntry[];
  scannerName: string;
}

type OutcomeCode =
  | "IDLE"
  | "SUCCESS"
  | "ALREADY_CHECKED_IN"
  | "INVALID_TOKEN"
  | "NOT_REGISTERED"
  | "QR_EXPIRED"
  | "REVOKED"
  | "RATE_LIMITED";

export function VolunteerScannerClient({
  events,
  initialLogs,
  scannerName,
}: VolunteerScannerClientProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [eventId, setEventId] = useState<string>(events[0]?.id ?? "");
  const [checkInType, setCheckInType] = useState<"EVENT_ENTRY" | "GATE_ENTRY" | "MEAL" | "BADGE_VERIFY">(
    "EVENT_ENTRY"
  );
  const [manualId, setManualId] = useState("");
  const [logs, setLogs] = useState<ScannerLogEntry[]>(initialLogs);
  const [lastOutcome, setLastOutcome] = useState<{ code: OutcomeCode; message?: string }>({
    code: "IDLE",
  });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!eventId && events[0]) setEventId(events[0].id);
  }, [events, eventId]);

  const eventMeta = useMemo(
    () => events.find((e) => e.id === eventId) ?? null,
    [events, eventId]
  );

  function pushLog(entry: ScannerLogEntry) {
    setLogs((prev) => [entry, ...prev].slice(0, 60));
  }

  async function handleScan(token: string) {
    setPaused(true);
    try {
      const res = await fetch("/api/qr/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          eventId: eventId || undefined,
          checkInType,
        }),
      });
      const data = await res.json();

      if (data.valid && data.checkIn?.status === "SUCCESS") {
        setLastOutcome({
          code: "SUCCESS",
          message: `${data.participant?.name ?? "Participant"} verified for ${eventMeta?.title ?? "Festival"}.`,
        });
        toast.success(`Check-in: ${data.participant?.name ?? "Participant"}`);
      } else if (data.status === "ALREADY_CHECKED_IN") {
        setLastOutcome({
          code: "ALREADY_CHECKED_IN",
          message: data.message ?? "Already checked in.",
        });
        toast.warning(data.message ?? "Already checked in");
      } else {
        const codeMap: Record<string, OutcomeCode> = {
          INVALID_SIGNATURE: "INVALID_TOKEN",
          EXPIRED: "QR_EXPIRED",
          REVOKED: "REVOKED",
          NOT_REGISTERED: "NOT_REGISTERED",
          RATE_LIMITED: "RATE_LIMITED",
        };
        const mapped = codeMap[data.status] ?? "INVALID_TOKEN";
        setLastOutcome({ code: mapped, message: data.message ?? "Scan rejected." });
        toast.error(data.message ?? "Scan failed");
      }

      pushLog({
        id: `scan-${Date.now()}`,
        participantId: data.participant?.collegeId ?? "N/A",
        participantName: data.participant?.name ?? "Unknown",
        eventTitle: eventMeta?.title ?? "General Gate",
        action: checkInType,
        result: data.status ?? (data.valid ? "SUCCESS" : "REJECTED"),
        reason: data.message ?? null,
        timestamp: new Date().toISOString(),
      });
    } catch {
      setLastOutcome({
        code: "INVALID_TOKEN",
        message: "Network error during scan verification.",
      });
      toast.error("Network error");
    } finally {
      setTimeout(() => setPaused(false), 900);
      startTransition(() => {
        router.refresh();
      });
    }
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualId.trim()) return;
    await handleScan(manualId.trim());
    setManualId("");
  }

  return (
    <div className="space-y-6 text-[#1A1918]">
      {/* Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-3xl bg-[#EAE7DC] border border-[#8E8D8A]/25">
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase text-[#8E8D8A]">
            Selected Tournament Gate
          </label>
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/30 text-xs font-mono text-[#1A1918] focus:outline-none focus:border-[#E85A4F]"
          >
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title} ({e.venue})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold uppercase text-[#8E8D8A]">
            Scan Operation Type
          </label>
          <select
            value={checkInType}
            onChange={(e) => setCheckInType(e.target.value as any)}
            className="w-full p-2.5 rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/30 text-xs font-mono text-[#1A1918] focus:outline-none focus:border-[#E85A4F]"
          >
            <option value="EVENT_ENTRY">Tournament Arena Entry</option>
            <option value="GATE_ENTRY">Main College Gate Entry</option>
            <option value="MEAL">Catering &amp; Refreshment Coupon</option>
            <option value="BADGE_VERIFY">Spot ID Badge Inspection</option>
          </select>
        </div>
      </div>

      {/* Outcome Status Banner */}
      <ScanOutcomeBadge code={lastOutcome.code} message={lastOutcome.message} />

      {/* Camera vs Manual Tabs */}
      <Tabs defaultValue="camera" className="w-full">
        <TabsList className="bg-[#EAE7DC] border border-[#8E8D8A]/25 p-1 rounded-2xl w-full grid grid-cols-2">
          <TabsTrigger
            value="camera"
            className="text-xs font-mono font-bold data-[state=active]:bg-[#1A1918] data-[state=active]:text-[#EAE7DC] rounded-xl py-2 uppercase"
          >
            <CameraIcon className="h-3.5 w-3.5 mr-1.5 inline" /> Optical Scanner
          </TabsTrigger>
          <TabsTrigger
            value="manual"
            className="text-xs font-mono font-bold data-[state=active]:bg-[#1A1918] data-[state=active]:text-[#EAE7DC] rounded-xl py-2 uppercase"
          >
            <KeyboardIcon className="h-3.5 w-3.5 mr-1.5 inline" /> Manual Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camera" className="pt-4">
          <ScannerPanel onScan={handleScan} paused={paused} />
        </TabsContent>

        <TabsContent value="manual" className="pt-4">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase text-[#8E8D8A]">
                Participant ID or Roll No
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  placeholder="AST26-0005 or 24105128032"
                  className="flex-1 p-3 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-xs font-mono text-[#1A1918] placeholder:text-[#8E8D8A]/60 focus:outline-none focus:border-[#E85A4F]"
                />
                <button
                  type="submit"
                  disabled={!manualId.trim()}
                  className="px-5 py-3 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  <Search className="h-4 w-4" /> Verify
                </button>
              </div>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

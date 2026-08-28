// ============================================================================
// ASTITVA 2K26 - Volunteer Scanner Client (camera, manual, history, outcomes)
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
  ListChecks,
  History,
  Search,
  UserCheck,
  XCircle,
  Hash,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
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
        body: JSON.stringify({ token, eventId, checkInType }),
      });
      const data = await res.json();
      const code: OutcomeCode = (data?.data?.code as OutcomeCode) ?? "INVALID_TOKEN";
      setLastOutcome({ code, message: data?.data?.message });
      pushLog({
        id: `${Date.now()}-scan`,
        participantId: data?.data?.participant?.participantId ?? "unknown",
        participantName: data?.data?.participant?.name ?? null,
        eventTitle: data?.data?.event?.title ?? eventMeta?.title ?? null,
        action: data?.success ? "QR_SCAN_SUCCESS" : code,
        result: data?.success ? "SUCCESS" : code === "ALREADY_CHECKED_IN" ? "WARNING" : "REJECTED",
        reason: data?.data?.message ?? null,
        timestamp: new Date().toISOString(),
      });
      announceOutcome(code, data?.data?.participant?.name);
    } catch (err) {
      toast.error("Scanner network error. Please try again.");
    } finally {
      setTimeout(() => setPaused(false), 1500);
    }
  }

  function handleManualLookup() {
    const id = manualId.trim();
    if (!id) {
      toast.error("Enter a participant ID (AST26-XXXX) or college roll number.");
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/qr/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "manual", participantId: id, eventId, checkInType }),
        });
        const data = await res.json();
        const code: OutcomeCode = (data?.data?.code as OutcomeCode) ?? "INVALID_TOKEN";
        setLastOutcome({ code, message: data?.data?.message });
        pushLog({
          id: `${Date.now()}-manual`,
          participantId: data?.data?.participant?.participantId ?? id.toUpperCase(),
          participantName: data?.data?.participant?.name ?? null,
          eventTitle: data?.data?.event?.title ?? eventMeta?.title ?? null,
          action: data?.success ? "QR_SCAN_SUCCESS" : code,
          result: data?.success ? "SUCCESS" : code === "ALREADY_CHECKED_IN" ? "WARNING" : "REJECTED",
          reason: data?.data?.message ?? null,
          timestamp: new Date().toISOString(),
        });
        announceOutcome(code, data?.data?.participant?.name);
        if (data?.success) setManualId("");
      } catch {
        toast.error("Manual lookup failed.");
      }
    });
  }

  function announceOutcome(code: OutcomeCode, name?: string) {
    const suffix = name ? `: ${name}` : "";
    switch (code) {
      case "SUCCESS":
        toast.success(`Check-in OK${suffix}`);
        break;
      case "ALREADY_CHECKED_IN":
        toast.warning(`Already checked in${suffix}`);
        break;
      case "NOT_REGISTERED":
        toast.error("Not registered for this event.");
        break;
      case "INVALID_TOKEN":
        toast.error("Invalid QR — possible tampering.");
        break;
      case "QR_EXPIRED":
        toast.error("QR pass has expired.");
        break;
      case "REVOKED":
        toast.error("This pass has been revoked.");
        break;
      case "RATE_LIMITED":
        toast.warning("Slow down — too many scans.");
        break;
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-4">
        <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center">
                  <CameraIcon className="h-4 w-4 text-cyan-400 mr-2" /> Live Check-in Console
                </CardTitle>
                <CardDescription className="text-xs text-slate-400 mt-1">
                  Operator: <span className="text-cyan-300 font-mono">{scannerName}</span>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={eventId} onValueChange={setEventId}>
                  <SelectTrigger className="bg-slate-950/80 border-white/10 text-white text-xs h-8 min-w-[200px]">
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={checkInType} onValueChange={(v) => setCheckInType(v as any)}>
                  <SelectTrigger className="bg-slate-950/80 border-white/10 text-white text-xs h-8 min-w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EVENT_ENTRY">Tournament Entry</SelectItem>
                    <SelectItem value="GATE_ENTRY">Gate Entry</SelectItem>
                    <SelectItem value="MEAL">Meal Coupon</SelectItem>
                    <SelectItem value="BADGE_VERIFY">Badge Verify</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="camera" className="w-full">
              <TabsList className="bg-slate-950/80 border border-white/10">
                <TabsTrigger value="camera" className="text-xs">
                  <CameraIcon className="h-3.5 w-3.5 mr-1" /> Webcam
                </TabsTrigger>
                <TabsTrigger value="manual" className="text-xs">
                  <KeyboardIcon className="h-3.5 w-3.5 mr-1" /> Manual
                </TabsTrigger>
              </TabsList>
              <TabsContent value="camera" className="pt-4">
                <ScannerPanel onScan={handleScan} paused={paused} />
              </TabsContent>
              <TabsContent value="manual" className="pt-4 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center">
                    <Hash className="h-3.5 w-3.5 mr-1 text-amber-300" />
                    Participant ID or College Roll Number
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="AST26-1042 or 22105128032"
                      value={manualId}
                      onChange={(e) => setManualId(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleManualLookup();
                      }}
                      className="font-mono text-xs bg-slate-950/80 border-white/10 text-white"
                    />
                    <Button
                      type="button"
                      variant="neonCyan"
                      onClick={handleManualLookup}
                      disabled={pending}
                      className="text-xs font-bold"
                    >
                      <Search className="h-4 w-4 mr-1.5" /> Verify
                    </Button>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Use as fallback for damaged badges or low-battery devices.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <ScanOutcomeBadge code={lastOutcome.code} message={lastOutcome.message} />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-5 space-y-4">
        <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white flex items-center">
              <ShieldCheck className="h-4 w-4 text-emerald-400 mr-2" /> Active Event
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs">
            <p className="text-white font-bold">{eventMeta?.title ?? "—"}</p>
            <p className="text-slate-400 font-mono">{eventMeta?.venue ?? ""}</p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 font-mono">
                {checkInType.replace("_", " ")}
              </Badge>
              <Badge variant="outline" className="border-white/10 text-slate-300 font-mono">
                OPERATOR: {scannerName}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-white flex items-center">
              <History className="h-4 w-4 text-cyan-400 mr-2" /> Recent Activity
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-[10px] text-slate-400 hover:text-white"
              onClick={() => router.refresh()}
            >
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-72 pr-2">
              {logs.length === 0 ? (
                <p className="text-xs text-slate-500 italic">
                  No scans yet. Try scanning a participant pass.
                </p>
              ) : (
                <ul className="divide-y divide-white/5">
                  {logs.map((log) => (
                    <li
                      key={log.id}
                      className="py-2 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono text-cyan-300 truncate">
                            {log.participantId}
                          </span>
                          {log.participantName && (
                            <span className="font-bold text-white truncate">
                              {log.participantName}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono truncate">
                          {log.eventTitle ?? "—"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border ${resultClass(
                            log.result
                          )}`}
                        >
                          {log.action.replace("QR_SCAN_", "")}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-white flex items-center">
              <ListChecks className="h-4 w-4 text-amber-300 mr-2" /> Quick Reference
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-slate-400 space-y-1">
            <p className="flex items-center">
              <UserCheck className="h-3 w-3 text-emerald-400 mr-1" /> SUCCESS — pass valid, registration confirmed.
            </p>
            <p className="flex items-center">
              <UserCheck className="h-3 w-3 text-amber-300 mr-1" /> ALREADY CHECKED IN — duplicate scan, ignore.
            </p>
            <p className="flex items-center">
              <XCircle className="h-3 w-3 text-red-400 mr-1" /> INVALID / EXPIRED / REVOKED — escalate to coordinator.
            </p>
            <p className="flex items-center">
              <XCircle className="h-3 w-3 text-rose-300 mr-1" /> NOT REGISTERED — direct participant to registration desk.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function resultClass(result: string) {
  switch (result) {
    case "SUCCESS":
      return "border-emerald-500/40 text-emerald-300 bg-emerald-500/10";
    case "WARNING":
      return "border-amber-500/40 text-amber-300 bg-amber-500/10";
    default:
      return "border-red-500/40 text-red-300 bg-red-500/10";
  }
}

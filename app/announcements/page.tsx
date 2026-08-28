// ============================================================================
// ASTITVA 2K26 - Announcements & Notice Board
// Path: app/announcements/page.tsx
// ============================================================================

import Link from "next/link";
import { Megaphone, Pin, AlertTriangle, Calendar, Filter, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublicAnnouncements } from "@/lib/ai/actions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Announcements & Notice Board | ASTITVA 2K26",
  description: "Live announcements from the ASTITVA 2K26 organizing committee.",
};

const CATEGORIES = [
  { value: "ALL", label: "All" },
  { value: "GENERAL", label: "General" },
  { value: "EVENT_UPDATE", label: "Event Updates" },
  { value: "SCHEDULE_CHANGE", label: "Schedule Changes" },
  { value: "RESULTS", label: "Results" },
  { value: "EMERGENCY", label: "Emergency" },
];

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const category = sp.category && sp.category !== "ALL" ? sp.category : undefined;
  const items = await getPublicAnnouncements({ category, take: 50 });
  const urgent = items.find((i) => i.priority === "URGENT");

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="container max-w-5xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900/90 to-slate-900/90 border border-purple-500/20 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <Badge variant="outline" className="px-3 py-1 text-xs font-mono border-purple-500/40 text-purple-300 bg-purple-950/40">
              <Megaphone className="mr-1.5 h-3.5 w-3.5" /> LIVE NOTICE BOARD
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              Announcements & <span className="text-purple-300">Broadcasts</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Real-time notices from the Organizing Committee. Urgent items are pushed to every
              participant's notification center automatically.
            </p>
          </div>
        </div>

        {urgent && (
          <Card className="border-2 border-red-500/50 bg-red-950/30 shadow-2xl">
            <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
              <CardTitle className="text-base font-bold text-white flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-300 mr-2 animate-pulse" />
                URGENT: {urgent.title}
              </CardTitle>
              <Badge variant="outline" className="border-red-500/40 text-red-300 font-mono text-[10px]">
                <Pin className="h-3 w-3 mr-1" /> PINNED
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-100 whitespace-pre-wrap">{urgent.content}</p>
              <p className="text-[10px] font-mono text-slate-400 mt-2">
                — {urgent.authorName} · {formatDate(urgent.publishedAt)}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center mr-2">
            <Filter className="h-3 w-3 mr-1" /> Filter
          </span>
          {CATEGORIES.map((c) => {
            const active = (sp.category ?? "ALL") === c.value;
            const href = c.value === "ALL" ? "/announcements" : `/announcements?category=${c.value}`;
            return (
              <Link
                key={c.value}
                href={href}
                className={`rounded-full border px-3 py-1 text-[11px] transition ${
                  active
                    ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-200"
                    : "border-white/10 text-slate-300 hover:border-cyan-500/30"
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>

        {items.length === 0 ? (
          <Card className="glass-panel border-white/10 bg-slate-900/70">
            <CardContent className="p-6 text-center">
              <Info className="h-8 w-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No announcements in this category yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {items
              .filter((i) => i.priority !== "URGENT" || i.id !== urgent?.id)
              .map((a) => (
                <Card
                  key={a.id}
                  className={`glass-panel ${
                    a.priority === "URGENT"
                      ? "border-red-500/30 bg-red-950/10"
                      : a.priority === "HIGH"
                      ? "border-amber-500/30 bg-amber-950/10"
                      : "border-white/10 bg-slate-900/70"
                  }`}
                >
                  <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <CardTitle className="text-base font-bold text-white">
                        {a.title}
                      </CardTitle>
                      <CardDescription className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                        <Calendar className="h-3 w-3" /> {formatDate(a.publishedAt)} ·{" "}
                        {a.authorName}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      {a.isPinned && (
                        <Badge variant="outline" className="text-[9px] border-purple-500/30 text-purple-300 font-mono">
                          <Pin className="h-3 w-3 mr-1" /> PINNED
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-mono ${
                          a.priority === "URGENT"
                            ? "border-red-500/40 text-red-300"
                            : a.priority === "HIGH"
                            ? "border-amber-500/40 text-amber-300"
                            : "border-white/10 text-slate-300"
                        }`}
                      >
                        {a.priority}
                      </Badge>
                      <Badge variant="outline" className="text-[9px] border-cyan-500/30 text-cyan-300 font-mono">
                        {a.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-200 whitespace-pre-wrap">{a.content}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

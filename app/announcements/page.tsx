// ============================================================================
// ASTITVA 2K26 - Announcements & Notice Board (Exteta Luxury Aesthetic)
// Path: app/announcements/page.tsx
// ============================================================================

import Link from "next/link";
import { Megaphone, Pin, AlertTriangle, Calendar, Filter } from "lucide-react";
import { getPublicAnnouncements } from "@/lib/ai/actions";
import { formatDate } from "@/lib/utils";
import { RealtimeAnnouncementsStream } from "@/components/announcements/RealtimeAnnouncementsStream";

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
    <div className="min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="container max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-8 sm:p-12 shadow-sm">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
              <Megaphone className="mr-1.5 h-3 w-3 inline text-[#E85A4F]" /> LIVE NOTICE BOARD
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              ANNOUNCEMENTS &amp; <span className="text-[#E85A4F]">BROADCASTS</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8E8D8A] font-mono leading-relaxed">
              Real-time official bulletins from the LNJPIT Organizing Committee. Urgent items are pushed to every participant&apos;s notification feed.
            </p>
          </div>
        </div>

        {/* Urgent Pinned Notice */}
        {urgent && (
          <div className="rounded-3xl border border-[#E85A4F]/40 bg-[#F6F4EE] p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-3">
              <h3 className="text-base font-bold font-mono text-[#E85A4F] uppercase flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                URGENT: {urgent.title}
              </h3>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#E85A4F] text-white uppercase">
                <Pin className="h-3 w-3 inline mr-1" /> PINNED
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#1A1918] font-mono leading-relaxed whitespace-pre-wrap">
              {urgent.content}
            </p>
            <p className="text-[10px] font-mono text-[#8E8D8A] pt-2 border-t border-[#8E8D8A]/15">
              — {urgent.authorName} · {formatDate(urgent.publishedAt)}
            </p>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-[#8E8D8A] flex items-center mr-2">
            <Filter className="h-3 w-3 mr-1" /> Filter
          </span>
          {CATEGORIES.map((c) => {
            const active = (sp.category ?? "ALL") === c.value;
            const href = c.value === "ALL" ? "/announcements" : `/announcements?category=${c.value}`;
            return (
              <Link
                key={c.value}
                href={href}
                className={`rounded-xl border px-3 py-1 text-xs font-mono transition ${
                  active
                    ? "border-[#1A1918] bg-[#1A1918] text-[#EAE7DC] font-bold"
                    : "border-[#8E8D8A]/25 bg-[#F6F4EE] text-[#8E8D8A] hover:text-[#1A1918]"
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>

        {/* Notices Stream with Realtime Sync */}
        <RealtimeAnnouncementsStream initialItems={items} />
      </div>
    </div>
  );
}

"use client";

// ============================================================================
// ASTITVA 2K26 - Realtime Announcements Stream
// Path: components/announcements/RealtimeAnnouncementsStream.tsx
// ============================================================================

import { useRealtimeAnnouncements } from "@/lib/supabase/hooks";
import { formatDate } from "@/lib/utils";

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  isPinned: boolean;
  publishedAt: Date | string;
  authorName: string;
}

interface RealtimeAnnouncementsStreamProps {
  initialItems: AnnouncementItem[];
}

export function RealtimeAnnouncementsStream({
  initialItems,
}: RealtimeAnnouncementsStreamProps) {
  const items = useRealtimeAnnouncements(initialItems);

  if (items.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 text-center text-xs font-mono text-[#8E8D8A]">
        No announcements match the selected filter.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <span className="text-[11px] font-mono text-[#8E8D8A] uppercase">
          {items.length} {items.length === 1 ? "Broadcast" : "Broadcasts"} Available
        </span>
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#F6F4EE] border border-[#8E8D8A]/20 text-[10px] font-mono text-[#8E8D8A]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Realtime Feed Active</span>
        </div>
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          className="p-6 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-3 hover:border-[#E85A4F] transition-all"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#E85A4F] uppercase">
                {item.category}
              </span>
              <h3 className="text-base font-bold font-mono text-[#1A1918] uppercase">
                {item.title}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#8E8D8A]">
              {formatDate(item.publishedAt)}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono leading-relaxed whitespace-pre-wrap">
            {item.content}
          </p>

          <div className="pt-2 border-t border-[#8E8D8A]/15 flex items-center justify-between text-[10px] font-mono text-[#8E8D8A]">
            <span>
              Issued by: <strong className="text-[#1A1918]">{item.authorName}</strong>
            </span>
            {item.isPinned && (
              <span className="text-[#E85A4F] font-bold">★ PINNED TO BOARD</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

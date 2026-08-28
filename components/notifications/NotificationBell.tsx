// ============================================================================
// ASTITVA 2K26 - Notification Center Dropdown (Exteta Luxury Aesthetic)
// Path: components/notifications/NotificationBell.tsx
// ============================================================================

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Check, AlertTriangle, Info, Trophy, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ALERT" | "REGISTRATION" | "RESULT" | "TEAM_INVITE";
  link: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

const ICONS = {
  INFO: Info,
  SUCCESS: Check,
  WARNING: AlertTriangle,
  ALERT: AlertTriangle,
  REGISTRATION: Trophy,
  RESULT: Trophy,
  TEAM_INVITE: UserPlus,
} as const;

export function NotificationBell() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function load() {
    try {
      const r = await fetch("/api/notifications", { cache: "no-store" });
      const data = await r.json();
      setItems(data.items ?? []);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 30_000);
    return () => clearInterval(t);
  }, []);

  const unread = items.filter((i) => !i.isRead).length;

  async function markAll() {
    setPending(true);
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAll" }),
      });
      await load();
    } finally {
      setPending(false);
    }
  }

  async function markOne(id: string) {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "markRead", id }),
    });
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isRead: true, readAt: new Date().toISOString() } : i))
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative h-9 w-9 rounded-xl border border-[#8E8D8A]/25 bg-[#EAE7DC] hover:bg-[#1A1918] hover:text-[#EAE7DC] flex items-center justify-center text-[#1A1918] transition-colors cursor-pointer"
        aria-label="Open notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E85A4F] text-white text-[9px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] z-50 rounded-3xl border border-[#8E8D8A]/25 bg-[#F6F4EE] shadow-2xl overflow-hidden font-mono text-[#1A1918]"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#8E8D8A]/20 bg-[#EAE7DC]">
            <p className="text-xs font-bold uppercase text-[#1A1918]">Notifications</p>
            <button
              onClick={markAll}
              disabled={pending || unread === 0}
              className="text-[10px] uppercase font-bold text-[#E85A4F] hover:underline disabled:opacity-50"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-[#8E8D8A]/15">
            {items.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="h-6 w-6 text-[#8E8D8A] mx-auto mb-1" />
                <p className="text-xs text-[#8E8D8A]">No notifications yet.</p>
              </div>
            ) : (
              items.map((n) => {
                const Icon = ICONS[n.type] ?? Info;
                const content = (
                  <div
                    className={cn(
                      "px-4 py-3 flex items-start gap-3 hover:bg-[#EAE7DC]/60 transition",
                      !n.isRead && "bg-[#EAE7DC]/40"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-[#8E8D8A]/20",
                        n.type === "ALERT"
                          ? "bg-red-100 text-red-700"
                          : n.type === "WARNING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-[#EAE7DC] text-[#E85A4F]"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1A1918] truncate">{n.title}</p>
                      <p className="text-[11px] text-[#8E8D8A] line-clamp-2">{n.message}</p>
                      <p className="text-[9px] text-[#8E8D8A] mt-1">
                        {new Date(n.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {!n.isRead && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          markOne(n.id);
                        }}
                        className="text-[#E85A4F] hover:text-[#C94A40] shrink-0"
                        aria-label="Mark as read"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
                return n.link ? (
                  <Link key={n.id} href={n.link} onClick={() => setOpen(false)}>
                    {content}
                  </Link>
                ) : (
                  <div key={n.id}>{content}</div>
                );
              })
            )}
          </div>
          <Link
            href="/announcements"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-center text-[11px] font-bold text-[#E85A4F] hover:bg-[#EAE7DC] border-t border-[#8E8D8A]/20 uppercase"
          >
            View all announcements →
          </Link>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ASTITVA 2K26 - Notification Center Dropdown
// Path: components/notifications/NotificationBell.tsx
// ============================================================================

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Check, AlertTriangle, Info, Trophy, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        className="relative h-9 w-9 rounded-lg border border-white/10 bg-slate-900/70 hover:bg-slate-800/70 flex items-center justify-center text-slate-300 hover:text-cyan-300"
        aria-label="Open notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] z-50 rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
            <p className="text-xs font-bold text-white">Notifications</p>
            <Button
              size="sm"
              variant="ghost"
              onClick={markAll}
              disabled={pending || unread === 0}
              className="text-[10px] text-cyan-300 hover:text-cyan-200"
            >
              Mark all read
            </Button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="h-6 w-6 text-slate-500 mx-auto mb-1" />
                <p className="text-xs text-slate-500">No notifications yet.</p>
              </div>
            ) : (
              items.map((n) => {
                const Icon = ICONS[n.type] ?? Info;
                const content = (
                  <div
                    className={cn(
                      "px-4 py-3 border-b border-white/5 flex items-start gap-3 hover:bg-slate-900/60 transition",
                      !n.isRead && "bg-cyan-500/5"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        n.type === "ALERT"
                          ? "bg-red-500/10 text-red-300"
                          : n.type === "WARNING"
                          ? "bg-amber-500/10 text-amber-300"
                          : n.type === "SUCCESS" || n.type === "RESULT"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-cyan-500/10 text-cyan-300"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{n.title}</p>
                      <p className="text-[11px] text-slate-300 line-clamp-2">{n.message}</p>
                      <p className="text-[9px] text-slate-500 font-mono mt-1">
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
                        className="text-cyan-400 hover:text-cyan-200 flex-shrink-0"
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
            className="block px-4 py-2.5 text-center text-[11px] font-mono text-cyan-300 hover:bg-slate-900/60 border-t border-white/10"
          >
            View all announcements →
          </Link>
        </div>
      )}
    </div>
  );
}

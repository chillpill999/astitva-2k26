"use client";

// ============================================================================
// ASTITVA 2K26 - Supabase Realtime Hooks for Live Festival Updates
// Path: lib/supabase/hooks.ts
// ============================================================================

import { useEffect, useState } from "react";
import { supabase } from "./client";

export function useRealtimeSchedule<T extends { id: string }>(initialEvents: T[] = []): T[] {
  const [events, setEvents] = useState<T[]>(initialEvents);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-events-schedule")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Event" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setEvents((prev) => [...prev, payload.new as T]);
          } else if (payload.eventType === "UPDATE") {
            setEvents((prev) =>
              prev.map((ev) => (ev.id === (payload.new as T).id ? { ...ev, ...payload.new } : ev))
            );
          } else if (payload.eventType === "DELETE") {
            setEvents((prev) => prev.filter((ev) => ev.id !== (payload.old as { id: string }).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return events;
}

export function useRealtimeAnnouncements<T extends { id: string }>(initialAnnouncements: T[] = []): T[] {
  const [announcements, setAnnouncements] = useState<T[]>(initialAnnouncements);

  useEffect(() => {
    setAnnouncements(initialAnnouncements);
  }, [initialAnnouncements]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-announcements")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Announcement" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setAnnouncements((prev) => [payload.new as T, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setAnnouncements((prev) =>
              prev.map((a) => (a.id === (payload.new as T).id ? { ...a, ...payload.new } : a))
            );
          } else if (payload.eventType === "DELETE") {
            setAnnouncements((prev) => prev.filter((a) => a.id !== (payload.old as { id: string }).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return announcements;
}

export function useRealtimeResults<T extends { id: string }>(initialResults: T[] = []): T[] {
  const [results, setResults] = useState<T[]>(initialResults);

  useEffect(() => {
    setResults(initialResults);
  }, [initialResults]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-results")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Result" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setResults((prev) => [payload.new as T, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setResults((prev) =>
              prev.map((r) => (r.id === (payload.new as T).id ? { ...r, ...payload.new } : r))
            );
          } else if (payload.eventType === "DELETE") {
            setResults((prev) => prev.filter((r) => r.id !== (payload.old as { id: string }).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return results;
}

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

export function useRealtimeLiveScoreboard<T extends { id: string; status?: string; subtitle?: string | null }>(
  initialEvents: T[] = []
): T[] {
  const [events, setEvents] = useState<T[]>(initialEvents);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-live-scores-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Event" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setEvents((prev) => [payload.new as T, ...prev]);
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

export function useRealtimeRegistrations<T extends { id: string; eventId?: string; userId?: string }>(
  initialRegistrations: T[] = [],
  filterEventId?: string
): { registrations: T[]; count: number; lastRegistered: T | null } {
  const [registrations, setRegistrations] = useState<T[]>(initialRegistrations);
  const [lastRegistered, setLastRegistered] = useState<T | null>(null);

  useEffect(() => {
    setRegistrations(initialRegistrations);
  }, [initialRegistrations]);

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-registrations-${filterEventId || "all"}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Registration",
          filter: filterEventId ? `eventId=eq.${filterEventId}` : undefined,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newReg = payload.new as T;
            setLastRegistered(newReg);
            setRegistrations((prev) => {
              const exists = prev.some((r) => r.id === newReg.id);
              if (exists) return prev;
              return [newReg, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as T;
            setRegistrations((prev) =>
              prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
            );
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as { id: string };
            setRegistrations((prev) => prev.filter((r) => r.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filterEventId]);

  return {
    registrations,
    count: registrations.length,
    lastRegistered,
  };
}

export function useRealtimeAttendance<T extends { id: string; eventId?: string | null; participantId?: string }>(
  initialAttendance: T[] = [],
  filterEventId?: string
): { attendanceList: T[]; presentCount: number; lastCheckIn: T | null } {
  const [attendanceList, setAttendanceList] = useState<T[]>(initialAttendance);
  const [lastCheckIn, setLastCheckIn] = useState<T | null>(null);

  useEffect(() => {
    setAttendanceList(initialAttendance);
  }, [initialAttendance]);

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-attendance-${filterEventId || "all"}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Attendance",
          filter: filterEventId ? `eventId=eq.${filterEventId}` : undefined,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newAtt = payload.new as T;
            setLastCheckIn(newAtt);
            setAttendanceList((prev) => {
              const exists = prev.some((a) => a.id === newAtt.id);
              if (exists) return prev;
              return [newAtt, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as T;
            setAttendanceList((prev) =>
              prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a))
            );
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as { id: string };
            setAttendanceList((prev) => prev.filter((a) => a.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filterEventId]);

  return {
    attendanceList,
    presentCount: attendanceList.length,
    lastCheckIn,
  };
}


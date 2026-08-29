// ============================================================================
// ASTITVA 2K26 - Supabase Client for Realtime Updates & Live Schedules
// Path: lib/supabase/client.ts
// ============================================================================

import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://gqtcpbllllaewzwqcyun.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxdGNwYmxsbGxhZXd6d3FjeXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5OTQ2ODgsImV4cCI6MjEwMzU3MDY4OH0.Nc0LgeD1IX8M5lmqF4d2rCHNx5rNLR3Q-FJokxyeYLo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export function getSupabaseClient() {
  return supabase;
}

export default supabase;

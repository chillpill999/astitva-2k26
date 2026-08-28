// ============================================================================
// ASTITVA 2K26 - Public Event Catalog Portal
// Path: app/events/page.tsx
// ============================================================================

import React from "react";
import { Trophy, Sparkles, Layers } from "lucide-react";
import { getEventsCatalog } from "@/lib/events/actions";
import { EventCatalogGrid } from "@/components/events/EventCatalogGrid";

export const metadata = {
  title: "Event Catalog | ASTITVA 2K26 — LNJPIT Chapra",
  description:
    "Browse the events for ASTITVA 2K26, the annual fest of LNJPIT Chapra (4–8 September 2026).",
};

export default async function EventsPage() {
  const eventsResult = await getEventsCatalog();
  const events = eventsResult.data || [];
  const teamEventsCount = events.filter((e) => e.eventType === "TEAM").length;
  const soloEventsCount = events.filter((e) => e.eventType === "INDIVIDUAL").length;

  return (
    <div className="w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="container max-w-7xl mx-auto space-y-10">
        <div className="relative overflow-hidden rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-8 sm:p-12 shadow-sm">
          <div className="relative z-10 space-y-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#EAE7DC] text-[11px] font-mono font-bold text-[#E85A4F] uppercase">
                <Sparkles className="h-3 w-3 text-[#E85A4F]" />
                <span>Official Festival Catalog</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
                Event Catalog
              </h1>
              <p className="text-sm sm:text-base text-[#8E8D8A] leading-relaxed">
                Browse events for ASTITVA 2K26 (4–8 September 2026). Filter by category, sign in
                to register.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#8E8D8A]/15">
              <Stat label="Total Events" value={events.length} />
              <Stat label="Team Events" value={teamEventsCount} />
              <Stat label="Individual Events" value={soloEventsCount} />
              <Stat label="Days" value={5} suffix="4–8 Sept" />
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-[#8E8D8A]/25 bg-[#F6F4EE] p-10 text-center">
            <Layers className="h-8 w-8 text-[#8E8D8A] mx-auto mb-2" />
            <p className="text-base font-bold text-[#1A1918]">Events will be announced soon</p>
            <p className="text-xs text-[#8E8D8A] mt-1">
              The organizing committee will publish the event catalog before registrations open.
            </p>
          </div>
        ) : (
          <EventCatalogGrid initialEvents={events} />
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="space-y-0.5">
      <span className="text-[10px] font-mono text-[#8E8D8A] uppercase">{label}</span>
      <p className="text-2xl font-black font-mono text-[#1A1918]">
        {value > 0 ? value.toLocaleString("en-IN") : "—"}
        {suffix ? (
          <span className="text-xs font-mono text-[#8E8D8A] ml-1">{suffix}</span>
        ) : null}
      </p>
    </div>
  );
}

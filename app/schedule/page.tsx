// ============================================================================
// ASTITVA 2K26 - Public Schedule Page (DB-driven)
// Path: app/schedule/page.tsx
// ============================================================================

import Link from "next/link";
import { Calendar, Clock, MapPin, CalendarOff } from "lucide-react";
import { getFestEvents } from "@/lib/data/fest-data";
import { ScheduleBrowser } from "@/components/schedule/ScheduleBrowser";

import { Metadata } from "next";
import { BreadcrumbsJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "5-Day Event Schedule & Timetable | ASTITVA 2K26 LNJPIT Chapra",
  description:
    "Official 5-day schedule (4–8 September 2026) for ASTITVA 2K26 at LNJPIT Chapra. Day-by-day timetable for cricket, esports, cultural performances, debate, and closing night.",
  alternates: {
    canonical: "/schedule",
  },
  openGraph: {
    title: "5-Day Event Schedule & Timetable — ASTITVA 2K26 LNJPIT",
    description: "Browse the multi-day tournament timetable across all campus arenas and main stage.",
    url: "/schedule",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "5-Day Event Schedule & Timetable — ASTITVA 2K26 LNJPIT",
    description: "Browse the multi-day tournament timetable across all campus arenas and main stage.",
  },
};

export default async function SchedulePage() {
  const events = await getFestEvents();

  return (
    <div className="w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <BreadcrumbsJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Schedule", url: "/schedule" },
        ]}
      />
      <div className="container max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#8E8D8A]/20 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>Festival Schedule</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              5-Day <span className="text-[#E85A4F]">Schedule</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              Browse events day by day (4–8 September 2026). The schedule below reflects events
              added by the organizing committee.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/events"
              className="px-4 py-2 rounded text-xs font-mono font-bold tracking-wider uppercase border border-[#8E8D8A]/35 text-[#1A1918] bg-[#F6F4EE] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all"
            >
              View Events
            </Link>
            <Link
              href="/sign-in"
              className="px-4 py-2 rounded text-xs font-mono font-bold tracking-wider uppercase bg-[#E85A4F] text-white hover:bg-[#C94A40] transition-colors shadow-sm"
            >
              Sign in
            </Link>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25">
            <CalendarOff className="h-10 w-10 text-[#8E8D8A] mx-auto mb-2" />
            <h3 className="text-base font-bold text-[#1A1918]">Schedule coming soon</h3>
            <p className="text-xs text-[#8E8D8A] mt-1">
              The organizing committee will publish the schedule before registrations open.
            </p>
          </div>
        ) : (
          <ScheduleBrowser events={events} />
        )}
      </div>
    </div>
  );
}

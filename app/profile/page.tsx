// ============================================================================
// ASTITVA 2K26 - Profile Hub & Participant ID Pass (Exteta Luxury Aesthetic)
// Path: app/profile/page.tsx
// ============================================================================

import React from "react";
import { Metadata } from "next";
import { getProfile } from "@/lib/profile/actions";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Users,
  Award,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Flame,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Profile & Festival Pass | ASTITVA 2K26 - LNJPIT Chapra",
  description:
    "View your official AST26 participant ID, scannable holographic pass, registered tournaments, and update LNJPIT student profile.",
};

export default async function ProfilePage() {
  const result = await getProfile();

  if (!result.success || !result.data) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#EAE7DC] text-[#1A1918]">
        <div className="max-w-md w-full p-8 rounded-3xl text-center space-y-4 bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-xl">
          <div className="h-12 w-12 rounded-full bg-[#E85A4F]/10 border border-[#E85A4F]/30 flex items-center justify-center mx-auto text-[#E85A4F]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold font-mono text-[#1A1918] uppercase">Authentication Required</h2>
          <p className="text-xs text-[#8E8D8A]">
            Please sign in to access your ASTITVA 2K26 festival pass, registered tournaments, and team roster.
          </p>
          <Link href="/sign-in">
            <button className="w-full py-2.5 rounded-xl bg-[#E85A4F] text-white font-mono text-xs font-bold uppercase hover:bg-[#C94A40] transition-colors">
              Sign In to ASTITVA
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const pass = result.data;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-[#EAE7DC] text-[#1A1918]">
      {/* Admin Quick Action Banner */}
      {pass.role === "ADMIN" && (
        <div className="rounded-3xl bg-[#1A1918] text-[#EAE7DC] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#1A1918] shadow-lg">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E85A4F]/20 border border-[#E85A4F]/40 flex items-center justify-center text-[#E85A4F] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#E85A4F] font-bold">
                  Administrator Privileges Active
                </span>
              </div>
              <p className="text-xs text-[#EAE7DC]/80 font-mono mt-0.5 max-w-2xl">
                You have full access to manage festival registrations, tournaments, QR verification scanners, results, announcements, and data exports.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/admin"
            className="px-5 py-2.5 rounded-xl bg-[#E85A4F] text-white font-mono text-xs font-bold uppercase hover:bg-[#C94A40] transition-colors whitespace-nowrap shadow-sm"
          >
            Launch Admin Panel →
          </Link>
        </div>
      )}

      {/* Top Banner: Profile Completion & Festival Identity */}
      <div className="relative overflow-hidden rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
                ASTITVA 2K26 PASS
              </span>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#EAE7DC] border border-[#8E8D8A]/25 text-[#E85A4F] uppercase">
                LNJPIT Chapra
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight uppercase">
              Welcome, <span className="text-[#E85A4F]">{pass.fullName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#8E8D8A] max-w-xl">
              Your ASTITVA 2K26 festival credential acts as your digital identity across all 16 Sports, Cultural, Gaming, and Literary tournaments.
            </p>
          </div>

          {/* Profile Completion Card */}
          <div className="rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 p-4 min-w-[260px] space-y-2.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-semibold text-[#1A1918] flex items-center">
                <Sparkles className="h-3.5 w-3.5 text-[#E85A4F] mr-1" />
                Profile Strength
              </span>
              <span className="font-bold text-[#E85A4F]">
                {pass.profileCompletionPercentage}%
              </span>
            </div>
            <div className="w-full bg-[#D8C3A5]/40 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#E85A4F] h-full rounded-full transition-all duration-500"
                style={{ width: `${pass.profileCompletionPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-[#8E8D8A] font-mono">
              {pass.profileCompletionPercentage === 100
                ? "🎉 Profile complete! All event permissions active."
                : "Complete LNJPIT credentials to enable 1-click team registration."}
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Festival ID Card & Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          <ProfileCard passData={pass} />

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl p-4 text-center bg-[#F6F4EE] border border-[#8E8D8A]/25">
              <Trophy className="h-4 w-4 text-[#E85A4F] mx-auto mb-1" />
              <span className="text-xl font-bold text-[#1A1918] font-mono block">
                {pass.registeredEventsCount}
              </span>
              <span className="text-[10px] text-[#8E8D8A] font-mono uppercase">Tournaments</span>
            </div>
            <div className="rounded-2xl p-4 text-center bg-[#F6F4EE] border border-[#8E8D8A]/25">
              <Users className="h-4 w-4 text-[#1A1918] mx-auto mb-1" />
              <span className="text-xl font-bold text-[#1A1918] font-mono block">
                {pass.teamsCount}
              </span>
              <span className="text-[10px] text-[#8E8D8A] font-mono uppercase">Teams</span>
            </div>
            <div className="rounded-2xl p-4 text-center bg-[#F6F4EE] border border-[#8E8D8A]/25">
              <Award className="h-4 w-4 text-[#E85A4F] mx-auto mb-1" />
              <span className="text-xl font-bold text-[#1A1918] font-mono block">
                {pass.certificatesCount}
              </span>
              <span className="text-[10px] text-[#8E8D8A] font-mono uppercase">Certificates</span>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Management & Registered Tournaments */}
        <div className="lg:col-span-7">
          <Tabs defaultValue="edit-profile" className="space-y-6">
            <TabsList className="bg-[#F6F4EE] border border-[#8E8D8A]/25 p-1 w-full grid grid-cols-3 rounded-2xl">
              <TabsTrigger
                value="edit-profile"
                className="text-xs font-mono font-bold data-[state=active]:bg-[#1A1918] data-[state=active]:text-[#EAE7DC] rounded-xl py-2"
              >
                EDIT PROFILE
              </TabsTrigger>
              <TabsTrigger
                value="tournaments"
                className="text-xs font-mono font-bold data-[state=active]:bg-[#1A1918] data-[state=active]:text-[#EAE7DC] rounded-xl py-2"
              >
                MY EVENTS ({pass.registeredEventsCount})
              </TabsTrigger>
              <TabsTrigger
                value="guidelines"
                className="text-xs font-mono font-bold data-[state=active]:bg-[#1A1918] data-[state=active]:text-[#EAE7DC] rounded-xl py-2"
              >
                GUIDELINES
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Edit Profile Form */}
            <TabsContent value="edit-profile" className="space-y-6 mt-0">
              <ProfileForm initialData={pass} />
            </TabsContent>

            {/* TAB 2: Registered Tournaments */}
            <TabsContent value="tournaments" className="space-y-4 mt-0">
              {pass.registeredEvents.length > 0 ? (
                <div className="space-y-3">
                  {pass.registeredEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="rounded-2xl p-4 bg-[#F6F4EE] border border-[#8E8D8A]/25 flex items-center justify-between hover:border-[#E85A4F] transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-[#E85A4F] font-bold font-mono uppercase px-2 py-0.5 rounded bg-[#EAE7DC]">
                            {evt.category}
                          </span>
                          <h4 className="text-sm font-bold text-[#1A1918]">{evt.title}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#8E8D8A] font-mono">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 text-[#E85A4F] mr-1" />
                            {evt.venue}
                          </span>
                          {evt.teamName && (
                            <span className="flex items-center text-[#1A1918]">
                              <Users className="h-3 w-3 mr-1 text-[#8E8D8A]" />
                              Team: {evt.teamName}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-[#EAE7DC] text-[#1A1918] uppercase">
                        {evt.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl p-8 text-center bg-[#F6F4EE] border border-[#8E8D8A]/25 space-y-3">
                  <Flame className="h-8 w-8 text-[#E85A4F] mx-auto" />
                  <h3 className="text-base font-bold text-[#1A1918] font-mono uppercase">
                    No Tournaments Registered Yet
                  </h3>
                  <p className="text-xs text-[#8E8D8A] max-w-sm mx-auto font-mono">
                    Explore 16 tournaments across Sports, Cultural, Gaming, and Literary categories and claim your spots!
                  </p>
                  <Link href="/events">
                    <button className="px-4 py-2 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-colors">
                      Explore 16 Events →
                    </button>
                  </Link>
                </div>
              )}
            </TabsContent>

            {/* TAB 3: Fest Guidelines */}
            <TabsContent value="guidelines" className="space-y-4 mt-0">
              <div className="rounded-3xl p-6 bg-[#F6F4EE] border border-[#8E8D8A]/25 space-y-4 text-xs text-[#1A1918] leading-relaxed">
                <h3 className="text-sm font-bold text-[#1A1918] flex items-center font-mono uppercase">
                  <ShieldCheck className="h-4 w-4 text-[#E85A4F] mr-2" />
                  LNJPIT ASTITVA 2K26 Festival Rules &amp; Code of Conduct
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-[#8E8D8A] font-mono">
                  <li>Keep your digital QR badge accessible at all times on mobile or printed pass.</li>
                  <li>Volunteers will scan your QR badge at entry gates and tournament venues.</li>
                  <li>Only verified LNJPIT students and registered participants will be allowed in competition arenas.</li>
                  <li>Decisions of the Faculty and Student Coordinators are final and binding.</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

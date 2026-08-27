// ============================================================================
// ASTITVA 2K26 - Profile Hub & Participant ID Pass
// Path: app/profile/page.tsx
// ============================================================================

import React from "react";
import { Metadata } from "next";
import { getProfile } from "@/lib/profile/actions";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-card max-w-md w-full p-8 rounded-2xl text-center space-y-4 border border-white/10">
          <div className="h-12 w-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Authentication Required</h2>
          <p className="text-sm text-slate-400">
            {result.error || "Please sign in to access your ASTITVA 2K26 festival pass."}
          </p>
          <Link href="/sign-in">
            <Button variant="neonCyan" className="w-full font-bold">
              Sign In to ASTITVA
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const pass = result.data;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner: Profile Completion & Festival Identity */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <Badge variant="cyan" className="text-xs font-mono font-bold">
                ASTITVA 2K26 PASS
              </Badge>
              <Badge variant="outline" className="text-xs text-amber-400 border-amber-500/30">
                LNJPIT Chapra
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome, <span className="cyber-gradient-text">{pass.fullName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Your ASTITVA 2K26 festival credential acts as your digital identity across all 16 Sports, Cultural, Gaming, and Literary tournaments.
            </p>
          </div>

          {/* Profile Completion Card */}
          <div className="rounded-2xl bg-slate-950/80 border border-white/10 p-4 min-w-[260px] space-y-2.5 shadow-lg">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 mr-1" />
                Profile Strength
              </span>
              <span className="font-mono font-bold text-cyan-400">
                {pass.profileCompletionPercentage}%
              </span>
            </div>
            <Progress value={pass.profileCompletionPercentage} className="h-2 bg-slate-800" />
            <p className="text-[11px] text-slate-400">
              {pass.profileCompletionPercentage === 100
                ? "🎉 Profile complete! All event permissions active."
                : "Complete LNJPIT credentials to enable 1-click team registration."}
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Holographic Festival ID Card & Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          <ProfileCard passData={pass} />

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-card rounded-xl p-3 text-center border border-white/5">
              <Trophy className="h-4 w-4 text-cyan-400 mx-auto mb-1" />
              <span className="text-lg font-black text-white font-mono block">
                {pass.registeredEventsCount}
              </span>
              <span className="text-[10px] text-slate-400 uppercase">Tournaments</span>
            </div>
            <div className="glass-card rounded-xl p-3 text-center border border-white/5">
              <Users className="h-4 w-4 text-purple-400 mx-auto mb-1" />
              <span className="text-lg font-black text-white font-mono block">
                {pass.teamsCount}
              </span>
              <span className="text-[10px] text-slate-400 uppercase">Teams</span>
            </div>
            <div className="glass-card rounded-xl p-3 text-center border border-white/5">
              <Award className="h-4 w-4 text-amber-400 mx-auto mb-1" />
              <span className="text-lg font-black text-white font-mono block">
                {pass.certificatesCount}
              </span>
              <span className="text-[10px] text-slate-400 uppercase">Certificates</span>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Management & Registered Tournaments */}
        <div className="lg:col-span-7">
          <Tabs defaultValue="edit-profile" className="space-y-6">
            <TabsList className="bg-slate-900 border border-white/10 p-1 w-full grid grid-cols-3 rounded-xl">
              <TabsTrigger value="edit-profile" className="text-xs font-semibold">
                Edit Profile
              </TabsTrigger>
              <TabsTrigger value="tournaments" className="text-xs font-semibold">
                My Events ({pass.registeredEventsCount})
              </TabsTrigger>
              <TabsTrigger value="guidelines" className="text-xs font-semibold">
                Fest Guidelines
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
                      className="glass-card rounded-xl p-4 border border-white/10 flex items-center justify-between hover:border-cyan-500/40 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-[10px] text-cyan-400 border-cyan-500/30 font-mono">
                            {evt.category}
                          </Badge>
                          <h4 className="text-sm font-bold text-white">{evt.title}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 text-slate-500 mr-1" />
                            {evt.venue}
                          </span>
                          {evt.teamName && (
                            <span className="flex items-center text-purple-300">
                              <Users className="h-3.5 w-3.5 mr-1" />
                              Team: {evt.teamName}
                            </span>
                          )}
                        </div>
                      </div>

                      <Badge variant="cyan" className="text-xs font-mono font-semibold">
                        {evt.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-8 text-center border border-white/10 space-y-3">
                  <Flame className="h-10 w-10 text-cyan-400 mx-auto animate-bounce" />
                  <h3 className="text-base font-bold text-white">No Tournaments Registered Yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Explore 16 tournaments across Sports, Cultural, Gaming, and Literary categories and claim your spots!
                  </p>
                  <Link href="/events">
                    <Button variant="neonCyan" size="sm" className="font-bold text-xs">
                      Explore 16 Events <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            {/* TAB 3: Fest Guidelines */}
            <TabsContent value="guidelines" className="space-y-4 mt-0">
              <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 text-xs text-slate-300 leading-relaxed">
                <h3 className="text-sm font-bold text-white flex items-center">
                  <ShieldCheck className="h-4 w-4 text-cyan-400 mr-2" />
                  LNJPIT ASTITVA 2K26 Festival Rules & Code of Conduct
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-400">
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

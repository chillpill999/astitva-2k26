// ============================================================================
// ASTITVA 2K26 - Mandatory Student Profile Completion (Exteta Luxury Aesthetic)
// Path: app/complete-profile/page.tsx
// ============================================================================

import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { getProfile, checkUserProfileCompletion } from "@/lib/profile/actions";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Complete Student Profile | ASTITVA 2K26 LNJPIT Chapra",
  description:
    "Complete your official LNJPIT Chapra student profile to unlock event registrations, squad creation, and digital passes.",
};

interface CompleteProfilePageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function CompleteProfilePage({
  searchParams,
}: CompleteProfilePageProps) {
  const user = await getCurrentUser();
  const { callbackUrl } = await searchParams;

  if (!user) {
    const nextUrl = callbackUrl
      ? `/complete-profile?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/complete-profile";
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(nextUrl)}`);
  }

  const [profileRes, completion] = await Promise.all([
    getProfile(user.id),
    checkUserProfileCompletion(user.id),
  ]);

  // If already 100% complete and callbackUrl provided, redirect back
  if (completion.isComplete && callbackUrl && callbackUrl !== "/complete-profile") {
    redirect(callbackUrl);
  }

  const passData = profileRes.data || {
    id: user.id,
    userId: user.id,
    participantId: `AST26-${user.id.slice(-4).toUpperCase()}`,
    fullName: user.name || "",
    email: user.email || "",
    role: user.role || "PARTICIPANT",
    collegeId: "",
    collegeName: "LNJPIT Chapra",
    branch: "CSE" as any,
    semester: 1,
    phone: "",
    gender: "MALE" as any,
    isHosteler: false,
    tshirtSize: "L" as any,
    avatarUrl: user.avatarUrl,
    qrPassToken: "",
    registeredEventsCount: 0,
    registeredEvents: [],
    teamsCount: 0,
    certificatesCount: 0,
    profileCompletionPercentage: 20,
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 bg-[#EAE7DC] text-[#1A1918]">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href={callbackUrl || "/events"}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#8E8D8A] hover:text-[#1A1918] transition-colors uppercase font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-10 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
            MANDATORY REQUIREMENT
          </span>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#EAE7DC] border border-[#8E8D8A]/25 text-[#E85A4F] uppercase">
            LNJPIT VERIFICATION
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-[#1A1918]">
          Complete Your <span className="text-[#E85A4F]">Student Profile</span>
        </h1>

        <p className="text-xs sm:text-sm text-[#8E8D8A] font-mono leading-relaxed">
          Before you can register for competitions, form squads, or receive your verifiable certificate,
          LNJPIT requires your full name, university registration number, engineering branch, semester, and active phone number.
        </p>

        {!completion.isComplete && completion.missingFields.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-mono flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold uppercase mb-1">Required Information Pending:</strong>
              <ul className="list-disc list-inside space-y-0.5 text-[#1A1918]">
                {completion.missingFields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Profile Form Card */}
      <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-10 shadow-sm">
        <ProfileForm initialData={passData} />
      </div>
    </div>
  );
}

// ============================================================================
// ASTITVA 2K26 - Smart Root Dashboard Redirector
// Path: app/dashboard/page.tsx
// ============================================================================

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { getRoleDashboardUrl } from "@/lib/auth/profile";
import { prisma } from "@/lib/db/prisma";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Check if the user has completed their profile (branch, roll number, etc.)
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { branch: true, collegeId: true },
    });
    if (!profile || !profile.branch || !profile.collegeId) {
      redirect("/profile");
    }
  } catch {
    // Database not available — redirect to profile as a safe default
    redirect("/profile");
  }

  redirect(getRoleDashboardUrl(user.role));
}

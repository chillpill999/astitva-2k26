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

  // Admins, coordinators, and volunteers skip profile completion — they're staff, not students
  const staffRoles: string[] = ["ADMIN", "EVENT_COORDINATOR", "VOLUNTEER"];
  if (!staffRoles.includes(user.role)) {
    let isProfileIncomplete = false;
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId: user.id },
        select: { branch: true, collegeId: true },
      });
      if (!profile || !profile.branch || !profile.collegeId) {
        isProfileIncomplete = true;
      }
    } catch {
      isProfileIncomplete = false;
    }

    if (isProfileIncomplete) {
      redirect("/complete-profile");
    }
  }

  redirect(getRoleDashboardUrl(user.role));
}

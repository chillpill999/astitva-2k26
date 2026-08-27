// ============================================================================
// ASTITVA 2K26 - Smart Root Dashboard Redirector
// Path: app/dashboard/page.tsx
// ============================================================================

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { getRoleDashboardUrl } from "@/lib/auth/profile";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  redirect(getRoleDashboardUrl(user.role));
}

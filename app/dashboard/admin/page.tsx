// ============================================================================
// ASTITVA 2K26 - Admin Executive Control Center (Exteta Luxury Aesthetic)
// Path: app/dashboard/admin/page.tsx
// ============================================================================

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { getAdminAnalytics } from "@/lib/analytics/actions";
import { AdminRealtimeDeck } from "@/components/admin/AdminRealtimeDeck";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Executive Control Center | ASTITVA 2K26",
  description: "Festival-wide operations, real-time metrics, live scoring supervision, and data exports.",
};

const ADMIN_EMAILS = [
  "aryanrockstar2007@gmail.com",
  "technogamerzthenextlevel@gmail.com",
  ...(process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
];

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/dashboard/admin");

  const isAuthorized =
    user.role === "ADMIN" &&
    ADMIN_EMAILS.includes(user.email.toLowerCase().trim());

  if (!isAuthorized) {
    redirect("/unauthorized?attempted=/dashboard/admin");
  }

  const data = await getAdminAnalytics();

  return <AdminRealtimeDeck initialData={data} user={user} />;
}

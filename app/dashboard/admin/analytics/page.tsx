// ============================================================================
// ASTITVA 2K26 - Admin Analytics (Exteta Luxury Aesthetic)
// Path: app/dashboard/admin/analytics/page.tsx
// ============================================================================

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { getAdminAnalytics } from "@/lib/analytics/actions";
import { AdminAnalyticsRealtimeDeck } from "@/components/admin/AdminAnalyticsRealtimeDeck";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Analytics | ASTITVA 2K26",
  description: "Festival-wide operational analytics and export center.",
};

const ADMIN_EMAILS = [
  "aryanrockstar2007@gmail.com",
  "technogamerzthenextlevel@gmail.com",
  ...(process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
];

export default async function AdminAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/dashboard/admin/analytics");

  const isAuthorized =
    user.role === "ADMIN" &&
    ADMIN_EMAILS.includes(user.email.toLowerCase().trim());

  if (!isAuthorized) {
    redirect("/unauthorized?attempted=/dashboard/admin/analytics");
  }

  const data = await getAdminAnalytics();

  return <AdminAnalyticsRealtimeDeck initialData={data} />;
}

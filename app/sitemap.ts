import { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://astitva-2k26.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Core festival pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/schedule`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/announcements`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sponsors`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.65,
    },
  ];

  // Dynamic tournament routes from database
  let dynamicEventRoutes: MetadataRoute.Sitemap = [];
  try {
    const events = await prisma.event.findMany({
      where: {
        status: { in: ["UPCOMING", "REGISTRATION_OPEN", "ONGOING", "COMPLETED", "REGISTRATION_CLOSED"] },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    dynamicEventRoutes = events.map((event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: event.updatedAt || currentDate,
      changeFrequency: "daily" as const,
      priority: 0.85,
    }));
  } catch (error) {
    console.error("Error generating dynamic event routes for sitemap:", error);
  }

  return [...staticRoutes, ...dynamicEventRoutes];
}

import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://astitva-2k26.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/events",
          "/events/*",
          "/schedule",
          "/results",
          "/leaderboard",
          "/announcements",
          "/faq",
          "/gallery",
          "/sponsors",
          "/team",
          "/verify-certificate/*",
          "/google697f9ae4698f26f3.html",
        ],
        disallow: [
          "/api/",
          "/dashboard/",
          "/profile",
          "/team/join/*",
          "/teams/join/*",
          "/sign-in",
          "/sign-up",
          "/unauthorized",
        ],
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "Applebot",
          "DuckDuckBot",
          "PerplexityBot",
          "GPTBot",
          "ClaudeBot",
        ],
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

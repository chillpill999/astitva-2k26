import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Toaster } from "@/components/ui/sonner";
import { AiChatWidget } from "@/components/ai/AiChatWidgetLoader";
import { MasterFestivalJsonLd } from "@/components/seo/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://astitva-2k26.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "ASTITVA 2K26 — Annual Sports, Cultural, Gaming & Literary Fest | LNJPIT Chapra",
    template: "%s | ASTITVA 2K26",
  },
  description:
    "Official festival management & live scoring platform for ASTITVA 2K26, Lok Nayak Jai Prakash Institute of Technology (LNJPIT), Chapra (4–8 September 2026). Explore 20 tournaments, live match scoring, fixtures, and QR participant passes.",
  keywords: [
    "ASTITVA 2K26",
    "ASTITVA Fest",
    "LNJPIT Chapra",
    "LNJPIT Fest 2026",
    "Lok Nayak Jai Prakash Institute of Technology",
    "College Fest Bihar",
    "Cricket Tournament Bihar",
    "BGMI Tournament College",
    "Badminton Singles Doubles",
    "Sports Fest",
    "Cultural Fest LNJPIT",
    "Esports Tournament",
    "Literary Fest",
  ],
  authors: [{ name: "LNJPIT Organizing Committee", url: "https://lnjpit.ac.in" }],
  creator: "LNJPIT Student Technical Team",
  publisher: "Lok Nayak Jai Prakash Institute of Technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ASTITVA 2K26 — LNJPIT Chapra Mega Fest (4–8 Sept 2026)",
    description:
      "Where Sports, Talent, Creativity & Entertainment Come Together. 20 tournaments, live match scoring, digital QR entry passes, and verifiable certificates.",
    url: baseUrl,
    siteName: "ASTITVA 2K26 LNJPIT",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASTITVA 2K26 — LNJPIT Chapra Mega Fest",
    description:
      "Official festival portal for ASTITVA 2K26, LNJPIT Chapra (4–8 Sept 2026). Tournaments, live scores, QR passes, and certificates.",
    creator: "@lnjpit_chapra",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: "google697f9ae4698f26f3",
  },
};

export const viewport: Viewport = {
  themeColor: "#EAE7DC",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <MasterFestivalJsonLd />
      </head>
      <body className="min-h-screen bg-[#EAE7DC] font-sans text-[#1A1918] antialiased flex flex-col justify-between selection:bg-[#E85A4F] selection:text-white">
        <ClerkProvider>
          {/* Top Navbar */}
          <Navbar />

          {/* Main Application Slot */}
          <main className="flex-1 w-full relative">{children}</main>

          {/* Global Footer */}
          <Footer />

          {/* Sonner Toast Notification Center */}
          <Toaster position="bottom-right" richColors />

          {/* AI Fest Assistant (floating chat widget) */}
          <AiChatWidget />
        </ClerkProvider>
      </body>
    </html>
  );
}
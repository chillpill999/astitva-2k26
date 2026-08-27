import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ASTITVA 2K26 — Annual Sports, Cultural, Gaming & Literary Fest | LNJPIT Chapra",
  description:
    "Official management and participation platform for ASTITVA 2K26, Lok Nayak Jai Prakash Institute of Technology (LNJPIT), Chapra (4–8 September 2026). Explore 16 tournaments, live schedules, brackets, QR pass check-ins, and results.",
  keywords: [
    "ASTITVA 2K26",
    "LNJPIT Chapra",
    "LNJPIT Fest",
    "College Fest Bihar",
    "Sports Fest",
    "Cultural Fest",
    "Esports Tournament",
    "Literary Fest",
  ],
  authors: [{ name: "LNJPIT Organizing Committee" }],
  openGraph: {
    title: "ASTITVA 2K26 — LNJPIT Chapra Mega Fest",
    description:
      "Where Sports, Talent, Creativity & Entertainment Come Together. 4–8 September 2026 at LNJPIT Chapra.",
    url: "https://astitva2k26.lnjpit.ac.in",
    siteName: "ASTITVA 2K26",
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
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
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
        {/* Top Navbar */}
        <Navbar />

        {/* Main Application Slot */}
        <main className="flex-1 w-full relative">{children}</main>

        {/* Global Footer */}
        <Footer />

        {/* Sonner Toast Notification Center */}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}

// ============================================================================
// ASTITVA 2K26 - Public FAQ & Helpdesk Page
// Path: app/faq/page.tsx
// ============================================================================

import { HelpCircle } from "lucide-react";
import { getFestFaqs } from "@/lib/data/fest-data";
import { FaqBrowser } from "@/components/faq/FaqBrowser";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "FAQ & Helpdesk | ASTITVA 2K26",
  description: "Frequently asked questions and helpdesk for ASTITVA 2K26.",
};

export default async function FaqPage() {
  const faqs = await getFestFaqs();

  return (
    <div className="w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="container max-w-5xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#8E8D8A]/20 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <HelpCircle className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>Frequently Asked Questions</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              FAQ &amp; <span className="text-[#E85A4F]">Helpdesk</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              Answers to common questions about registration, team formation, attendance, and
              certificates.
            </p>
          </div>
        </div>

        <FaqBrowser faqs={faqs} />
      </div>
    </div>
  );
}

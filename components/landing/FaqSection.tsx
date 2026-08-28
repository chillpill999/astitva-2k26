"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, Search, ChevronDown, Info } from "lucide-react";
import { FestFaq } from "@/lib/data/fest-data";

interface FaqSectionProps {
  faqs: FestFaq[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(faqs[0]?.id ?? null);

  const filteredFaqs = faqs.filter((faq) => {
    if (searchQuery.trim() === "") return true;
    const q = searchQuery.toLowerCase();
    return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
  });

  return (
    <section
      id="faq"
      className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#EAE7DC] text-[#1A1918] border-b border-[#8E8D8A]/20"
    >
      <div className="container max-w-4xl mx-auto space-y-12">
        <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
            <HelpCircle className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
            Frequently Asked <span className="text-[#E85A4F]">Questions</span>
          </h2>
          <p className="text-sm sm:text-base text-[#8E8D8A]">
            Answers to common questions about registration, team formation, attendance, and
            certificates.
          </p>
        </div>

        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8D8A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 text-[#1A1918] placeholder:text-[#8E8D8A]/70 text-xs font-mono focus:outline-none focus:border-[#E85A4F]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8E8D8A] hover:text-[#1A1918]"
            >
              Clear
            </button>
          )}
        </div>

        {faqs.length === 0 ? (
          <div className="rounded-2xl border border-[#8E8D8A]/25 bg-[#F6F4EE] p-10 text-center">
            <Info className="h-8 w-8 text-[#8E8D8A] mx-auto mb-2" />
            <p className="text-base font-bold text-[#1A1918]">FAQs will be published soon</p>
            <p className="text-xs text-[#8E8D8A] mt-1">
              The organizing committee will add common questions and answers as the fest approaches.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25">
                <p className="text-xs font-mono text-[#8E8D8A]">No matching questions found.</p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-mono text-[#E85A4F] font-bold">Q.</span>
                        <span className="text-sm sm:text-base font-bold text-[#1A1918]">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-[#8E8D8A] transition-transform duration-200 shrink-0 ${
                          isExpanded ? "rotate-180 text-[#E85A4F]" : ""
                        }`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 border-t border-[#8E8D8A]/15 text-xs sm:text-sm text-[#8E8D8A] leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}

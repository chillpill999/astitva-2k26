"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FestFaq } from "@/lib/data/fest-data";

interface FaqSectionProps {
  faqs: FestFaq[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(faqs[0]?.id || null);

  const categories = [
    { label: "All Questions", value: "all" },
    { label: "Eligibility", value: "Eligibility" },
    { label: "Registrations", value: "Registrations" },
    { label: "Teams", value: "Teams" },
    { label: "Attendance & QR", value: "Attendance" },
    { label: "Certificates", value: "Certificates" },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" ||
      faq.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      searchQuery.trim() === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="faq" className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#EAE7DC] text-[#1A1918] border-b border-[#8E8D8A]/20">
      <div className="container max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
            <HelpCircle className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
            <span>KNOWLEDGE BASE &amp; FAQS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
            FREQUENTLY ASKED <span className="text-[#E85A4F]">QUESTIONS</span>
          </h2>
          <p className="text-sm sm:text-base text-[#8E8D8A]">
            Find immediate answers on tournament rules, team formation, campus QR passes, and certificates.
          </p>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8D8A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. invite code, fee, attendance, certificate)..."
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

          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setSelectedCategory(c.value)}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  selectedCategory === c.value
                    ? "bg-[#1A1918] text-[#EAE7DC] font-semibold"
                    : "bg-[#F6F4EE] text-[#8E8D8A] border border-[#8E8D8A]/25 hover:text-[#1A1918]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Questions List */}
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
                  className="rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(faq.id)}
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
      </div>
    </section>
  );
}

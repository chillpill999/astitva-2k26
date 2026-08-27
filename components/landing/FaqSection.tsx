"use client";

// ============================================================================
// ASTITVA 2K26 - Searchable FAQ Accordion Portal
// Path: components/landing/FaqSection.tsx
// ============================================================================

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
    <section className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#05070f] border-b border-white/10">
      <div className="container max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
          <Badge variant="outline" className="px-3.5 py-1 text-xs font-mono font-semibold border-cyan-500/30 text-cyan-400 bg-cyan-950/30">
            <HelpCircle className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
            FREQUENTLY ASKED QUESTIONS
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
            HAVE <span className="cyber-gradient-text">QUESTIONS?</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Find immediate answers on tournament rules, team formation, campus QR passes, and certificates.
          </p>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. invite code, fee, attendance, certificate)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#0d1224] border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                  selectedCategory === c.value
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? "bg-[#0d1224] border-cyan-500/40 shadow-xl shadow-cyan-500/5"
                      : "bg-[#0d1224]/60 border-white/10 hover:border-white/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-[10px] font-mono border-white/15 text-cyan-400 shrink-0 hidden sm:inline-flex">
                        {faq.category}
                      </Badge>
                      <span className="text-base sm:text-lg font-bold text-white tracking-wide">
                        {faq.question}
                      </span>
                    </div>

                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-cyan-400" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-4 animate-in fade-in-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[#0d1224]/50 border border-white/5 space-y-2">
              <p className="text-sm text-slate-300 font-bold">No answers match your search term.</p>
              <p className="text-xs text-slate-500 font-mono">
                Try searching for &quot;team&quot;, &quot;QR&quot;, or &quot;prize&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Helpdesk CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-[#0d1224]/90 border border-white/10 shadow-xl backdrop-blur-xl gap-4">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Still have questions?</h4>
              <p className="text-xs text-slate-400">Ask the AI Fest Assistant or reach out to the helpdesk team.</p>
            </div>
          </div>

          <Link href="/faq">
            <Button variant="neonCyan" size="sm" className="text-xs font-bold shrink-0">
              Ask AI Assistant / Support Desk
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

// ============================================================================
// ASTITVA 2K26 - FAQ Browser (client island)
// Path: components/faq/FaqBrowser.tsx
// ============================================================================

import { useMemo, useState } from "react";
import { Search, ChevronDown, HelpCircle, Info, MessageCircle } from "lucide-react";
import { FestFaq } from "@/lib/data/fest-data";

interface Props {
  faqs: FestFaq[];
}

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Questions",
};

export function FaqBrowser({ faqs }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(faqs[0]?.id ?? null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const f of faqs) set.add(f.category);
    return ["all", ...Array.from(set)];
  }, [faqs]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return faqs.filter((faq) => {
      if (selectedCategory !== "all" && faq.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (q === "") return true;
      return (
        faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)
      );
    });
  }, [faqs, searchQuery, selectedCategory]);

  return (
    <>
      {faqs.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8D8A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] placeholder:text-[#8E8D8A]/70 text-xs font-mono focus:outline-none focus:border-[#E85A4F]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                  selectedCategory === c
                    ? "bg-[#1A1918] text-[#EAE7DC] font-bold"
                    : "bg-[#EAE7DC] text-[#8E8D8A] border border-[#8E8D8A]/25 hover:text-[#1A1918]"
                }`}
              >
                {CATEGORY_LABELS[c] ?? c}
              </button>
            ))}
          </div>
        </div>
      )}

      {faqs.length === 0 ? (
        <div className="rounded-2xl border border-[#8E8D8A]/25 bg-[#F6F4EE] p-10 text-center">
          <Info className="h-8 w-8 text-[#8E8D8A] mx-auto mb-2" />
          <p className="text-base font-bold text-[#1A1918]">FAQs will be published soon</p>
          <p className="text-xs text-[#8E8D8A] mt-1">
            The organizing committee will add common questions and answers as the fest approaches.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#8E8D8A]/25 bg-[#F6F4EE] p-10 text-center">
          <HelpCircle className="h-8 w-8 text-[#8E8D8A] mx-auto mb-2" />
          <p className="text-base font-bold text-[#1A1918]">No matching questions</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
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
          })}
        </div>
      )}

      <div className="p-8 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-2">
        <h3 className="text-base font-bold text-[#1A1918] uppercase flex items-center">
          <MessageCircle className="h-4 w-4 text-[#E85A4F] mr-2" />
          Still have questions?
        </h3>
        <p className="text-sm text-[#8E8D8A]">
          Use the in-app helpdesk (AstitvaBot) once you sign in, or contact the organizing
          committee through your institutional channels.
        </p>
      </div>
    </>
  );
}

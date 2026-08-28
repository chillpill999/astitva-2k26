"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  Send,
  MessageSquare,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { STATIC_FAQS, FestFaq } from "@/lib/data/fest-data";

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(STATIC_FAQS[0]?.id || null);

  // Helpdesk Form state
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [queryCategory, setQueryCategory] = useState("General");
  const [queryText, setQueryText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs: FestFaq[] = STATIC_FAQS;

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

  const handleHelpdeskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !queryText) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Helpdesk ticket submitted successfully!", {
        description: `Ticket #AST26-HD-${Math.floor(1000 + Math.random() * 9000)} created. Response will be sent to ${email}.`,
      });
      setName("");
      setRollNumber("");
      setEmail("");
      setQueryText("");
    }, 600);
  };

  return (
    <div className="w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="container max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#8E8D8A]/20 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <HelpCircle className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>KNOWLEDGE BASE &amp; STUDENT SUPPORT</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              FAQ &amp; <span className="text-[#E85A4F]">HELPDESK</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              Instant answers regarding registration eligibility, invite codes, digital QR passes, and certificates.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8D8A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. invite code, fee, attendance, certificate)..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] placeholder:text-[#8E8D8A]/70 text-xs font-mono focus:outline-none focus:border-[#E85A4F]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setSelectedCategory(c.value)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                  selectedCategory === c.value
                    ? "bg-[#1A1918] text-[#EAE7DC] font-bold"
                    : "bg-[#EAE7DC] text-[#8E8D8A] border border-[#8E8D8A]/25 hover:text-[#1A1918]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 overflow-hidden transition-all duration-200"
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
          })}
        </div>

        {/* Direct Inquiry Form */}
        <div className="p-8 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#1A1918] uppercase">
              Still Have Questions? Submit a Ticket
            </h3>
            <p className="text-xs text-[#8E8D8A]">
              Our student coordinator team will get back to you within 24 hours.
            </p>
          </div>

          <form onSubmit={handleHelpdeskSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name *"
                className="w-full px-4 py-3 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] text-xs font-mono focus:outline-none focus:border-[#E85A4F]"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address *"
                className="w-full px-4 py-3 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] text-xs font-mono focus:outline-none focus:border-[#E85A4F]"
              />
            </div>

            <textarea
              rows={4}
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Describe your question or issue in detail *"
              className="w-full px-4 py-3 rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] text-xs font-mono focus:outline-none focus:border-[#E85A4F]"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#C94A40] transition-colors"
            >
              {isSubmitting ? "Submitting..." : "SUBMIT TICKET →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

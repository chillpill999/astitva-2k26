"use client";

// ============================================================================
// ASTITVA 2K26 - Comprehensive FAQ & Student Support Desk Portal
// Path: app/faq/page.tsx
// ============================================================================

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    // Simulate inquiry submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Helpdesk ticket submitted successfully!", {
        description: `Ticket #AST26-HD-${Math.floor(1000 + Math.random() * 9000)} created. A response will be sent to ${email}.`,
      });
      setName("");
      setRollNumber("");
      setEmail("");
      setQueryText("");
    }, 600);
  };

  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="container max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-3xl">
            <Badge variant="outline" className="px-3.5 py-1 text-xs font-mono font-semibold border-cyan-500/30 text-cyan-400 bg-cyan-950/30">
              <HelpCircle className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
              KNOWLEDGE BASE &amp; STUDENT SUPPORT
            </Badge>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase">
              FAQ &amp; <span className="cyber-gradient-text">HELPDESK</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Instant answers regarding registration eligibility, invite codes, digital QR passes, and certificates.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/events">
              <Button variant="outline" className="border-white/20 hover:border-cyan-400 text-xs font-bold">
                View Tournaments
              </Button>
            </Link>
          </div>
        </div>

        {/* Search & Category Chips */}
        <div className="space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords (e.g. eligibility, team size, invite code, fees, accommodation)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#0d1224] border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setSelectedCategory(c.value)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
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

        {/* FAQ Accordions */}
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
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
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
                    <div className="px-5 sm:px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-4">
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
                Submit an inquiry below and the organizing desk will respond within 24 hours.
              </p>
            </div>
          )}
        </div>

        {/* Submit a Question / Helpdesk Form */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0d1224]/90 border border-white/15 shadow-2xl backdrop-blur-2xl space-y-8">
          <div className="space-y-2 text-center sm:text-left">
            <Badge variant="cyan" className="text-xs font-mono font-bold">
              STUDENT HELPDESK
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Submit an Inquiry to the Organizing Committee
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Have a specific question about team eligibility, hostel accommodation, or match schedules? Let us know.
            </p>
          </div>

          <form onSubmit={handleHelpdeskSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Kumar"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">College Roll No / Branch</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. 22105128005 (Mechanical)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@lnjpit.ac.in"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Inquiry Category</label>
                <select
                  value={queryCategory}
                  onChange={(e) => setQueryCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="General">General Fest Query</option>
                  <option value="Cricket / Sports">Sports Championship</option>
                  <option value="Gaming / LAN">Esports / LAN Arena</option>
                  <option value="Cultural / Dance">Cultural &amp; Stage</option>
                  <option value="Literary / Debate">Literary &amp; Quiz</option>
                  <option value="Accommodation">Hostel &amp; Dining Pass</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Your Question or Query *</label>
              <textarea
                required
                rows={4}
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Describe your inquiry in detail..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="flex items-center justify-end pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="neonCyan"
                className="text-xs font-bold px-6"
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

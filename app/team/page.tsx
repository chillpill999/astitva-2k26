"use client";

// ============================================================================
// ASTITVA 2K26 - Organizing Committee & Leadership Directory Portal
// Path: app/team/page.tsx
// ============================================================================

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Mail,
  Phone,
  Linkedin,
  Github,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATIC_COMMITTEE, FestCommitteeMember } from "@/lib/data/fest-data";

export default function TeamPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const committee: FestCommitteeMember[] = STATIC_COMMITTEE;

  const categories = [
    { label: "All Members", value: "all" },
    { label: "Faculty Patrons", value: "FACULTY" },
    { label: "Student Core", value: "CORE_STUDENT" },
    { label: "Technical & Leads", value: "TECHNICAL" },
    { label: "Volunteers", value: "VOLUNTEER" },
  ];

  const filteredMembers = committee.filter((m) => {
    if (selectedCategory === "all") return true;
    return m.category === selectedCategory;
  });

  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="container max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-3xl">
            <Badge variant="outline" className="px-3.5 py-1 text-xs font-mono font-semibold border-purple-500/30 text-purple-400 bg-purple-950/30">
              <GraduationCap className="mr-1.5 h-3.5 w-3.5 text-purple-400" />
              ORGANIZING COMMITTEE &amp; VOLUNTEERS
            </Badge>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase">
              FESTIVAL <span className="cyber-gradient-text">LEADERSHIP</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              The dedicated faculty advisory and student executive teams making ASTITVA 2K26 a grand reality.
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

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setSelectedCategory(c.value)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                selectedCategory === c.value
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/20"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Committee Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredMembers.map((m) => {
            const isFaculty = m.category === "FACULTY";

            return (
              <div
                key={m.id}
                className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-[#0d1224]/90 border shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
                  isFaculty
                    ? "border-amber-500/30 hover:border-amber-500/60 hover:shadow-amber-500/10"
                    : "border-white/10 hover:border-cyan-500/40 hover:shadow-cyan-500/10"
                }`}
              >
                <div className="space-y-4">
                  {/* Photo Avatar & Badge */}
                  <div className="flex items-start justify-between">
                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-white/15 bg-slate-900 shadow-lg group-hover:scale-105 transition-transform">
                      {m.photoUrl ? (
                        <Image
                          src={m.photoUrl}
                          alt={m.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-slate-800 flex items-center justify-center text-slate-400">
                          <Users className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    <Badge
                      variant={isFaculty ? "amber" : "cyan"}
                      className="text-[9px] font-mono font-bold uppercase"
                    >
                      {m.category.replace("_", " ")}
                    </Badge>
                  </div>

                  {/* Name & Role */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                      {m.name}
                    </h3>
                    <p className="text-xs font-mono font-bold text-cyan-400">
                      {m.role}
                    </p>
                    <p className="text-xs text-slate-400">
                      {m.department}
                    </p>
                  </div>
                </div>

                {/* Contact & Social Strip */}
                <div className="pt-4 border-t border-white/5 mt-6 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-3">
                    {m.email && (
                      <a
                        href={`mailto:${m.email}`}
                        className="hover:text-cyan-400 transition-colors"
                        title={m.email}
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {m.phone && (
                      <a
                        href={`tel:${m.phone}`}
                        className="hover:text-cyan-400 transition-colors"
                        title={m.phone}
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                    {m.linkedinUrl && (
                      <a
                        href={m.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {m.githubUrl && (
                      <a
                        href={m.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors"
                        title="GitHub"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">LNJPIT Chapra</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

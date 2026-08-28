"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Mail,
  GraduationCap,
  Sparkles,
} from "lucide-react";
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
    <div className="w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="container max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#8E8D8A]/20 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <GraduationCap className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>ORGANIZING COMMITTEE &amp; VOLUNTEERS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              FESTIVAL <span className="text-[#E85A4F]">LEADERSHIP</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              The dedicated faculty advisory and student executive teams making ASTITVA 2K26 a grand reality.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/events"
              className="px-4 py-2 rounded text-xs font-mono font-bold tracking-wider uppercase border border-[#8E8D8A]/35 text-[#1A1918] bg-[#F6F4EE] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all"
            >
              VIEW TOURNAMENTS
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
              className={`px-3.5 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                selectedCategory === c.value
                  ? "bg-[#1A1918] text-[#EAE7DC] font-bold"
                  : "bg-[#F6F4EE] text-[#8E8D8A] border border-[#8E8D8A]/25 hover:text-[#1A1918]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Committee Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredMembers.map((m) => (
            <div
              key={m.id}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm hover:border-[#E85A4F] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4">
                <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border border-[#8E8D8A]/30 bg-[#EAE7DC]">
                  {m.photoUrl ? (
                    <Image
                      src={m.photoUrl}
                      alt={m.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[#8E8D8A]">
                      <Users className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#E85A4F] uppercase">
                    {m.role}
                  </span>
                  <h3 className="text-base font-bold text-[#1A1918] group-hover:text-[#E85A4F] transition-colors truncate">
                    {m.name}
                  </h3>
                  <p className="text-xs text-[#8E8D8A] truncate">
                    {m.department}
                  </p>
                </div>
              </div>

              {m.email && (
                <div className="pt-4 border-t border-[#8E8D8A]/15 mt-4 flex items-center justify-between text-xs text-[#8E8D8A] font-mono">
                  <span className="truncate">{m.email}</span>
                  <a href={`mailto:${m.email}`} className="text-[#E85A4F] hover:underline">
                    CONTACT →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

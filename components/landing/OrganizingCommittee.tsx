"use client";

// ============================================================================
// ASTITVA 2K26 - Organizing Committee & Leadership Showcase
// Path: components/landing/OrganizingCommittee.tsx
// ============================================================================

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, Mail, Phone, ExternalLink, Sparkles, Linkedin, Github, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FestCommitteeMember } from "@/lib/data/fest-data";

interface OrganizingCommitteeProps {
  committee: FestCommitteeMember[];
}

export function OrganizingCommittee({ committee }: OrganizingCommitteeProps) {
  const facultyMembers = committee.filter((m) => m.category === "FACULTY");
  const studentMembers = committee.filter((m) => m.category !== "FACULTY");

  return (
    <section className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#05070f] border-b border-white/10">
      <div className="container max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="outline" className="px-3.5 py-1 text-xs font-mono font-semibold border-purple-500/30 text-purple-400 bg-purple-950/30">
              <GraduationCap className="mr-1.5 h-3.5 w-3.5 text-purple-400" />
              LEADERSHIP &amp; ORGANIZING COMMITTEE
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
              MEET THE <span className="cyber-gradient-text">ORGANIZERS</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Guided by distinguished faculty patrons and executed by passionate student leaders across engineering branches.
            </p>
          </div>

          <Link href="/team">
            <Button variant="outline" className="border-white/20 hover:border-cyan-400 text-xs font-bold">
              Full Committee Directory →
            </Button>
          </Link>
        </div>

        {/* Faculty Patrons Row */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-amber-300">
              Faculty Patronage &amp; Convener
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {facultyMembers.map((member) => (
              <div
                key={member.id}
                className="group relative flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 p-6 rounded-2xl bg-[#0d1224]/90 border border-white/10 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1"
              >
                {/* Photo Avatar */}
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-500/30 bg-slate-900 shadow-lg">
                  {member.photoUrl ? (
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-800 flex items-center justify-center text-slate-400">
                      <Users className="h-8 w-8" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                  <Badge variant="amber" className="text-[10px] font-mono font-bold">
                    {member.role}
                  </Badge>

                  <h4 className="text-xl font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                    {member.name}
                  </h4>

                  <p className="text-xs text-slate-400">
                    {member.department || "LNJPIT Chapra"}
                  </p>

                  <div className="pt-2 flex items-center justify-center sm:justify-start space-x-3 text-xs text-slate-400">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="hover:text-cyan-400 transition-colors flex items-center space-x-1"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span className="font-mono">{member.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Core Executive Grid */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-300">
              Student Core Executive Committee
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentMembers.map((member) => (
              <div
                key={member.id}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[#0d1224]/80 border border-white/10 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1 text-center"
              >
                <div className="space-y-3 flex flex-col items-center">
                  {/* Photo */}
                  <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-cyan-500/30 bg-slate-900 shadow-md">
                    {member.photoUrl ? (
                      <Image
                        src={member.photoUrl}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full bg-slate-800 flex items-center justify-center text-slate-400">
                        <Users className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  {/* Badge & Name */}
                  <div className="space-y-1">
                    <Badge variant="cyan" className="text-[9px] font-mono font-bold">
                      {member.role}
                    </Badge>
                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {member.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                      {member.department}
                    </p>
                  </div>
                </div>

                {/* Social Channels */}
                <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-center space-x-3 text-slate-400">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="hover:text-cyan-400 transition-colors"
                      title="Send Email"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  )}
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyan-400 transition-colors"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {member.githubUrl && (
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyan-400 transition-colors"
                      title="GitHub Profile"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

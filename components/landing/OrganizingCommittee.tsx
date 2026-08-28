"use client";

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
    <section id="team" className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#EAE7DC] text-[#1A1918] border-b border-[#8E8D8A]/20">
      <div className="container max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <GraduationCap className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>LEADERSHIP &amp; ORGANIZING COMMITTEE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              MEET THE <span className="text-[#E85A4F]">ORGANIZERS</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              Guided by distinguished faculty patrons and executed by passionate student leaders across engineering branches.
            </p>
          </div>

          <Link href="/team">
            <span className="inline-flex items-center text-xs font-mono font-semibold py-2 px-4 rounded border border-[#8E8D8A]/40 text-[#1A1918] bg-[#F6F4EE] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer">
              COMMITTEE DIRECTORY →
            </span>
          </Link>
        </div>

        {/* Faculty Patrons Row */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 border-b border-[#8E8D8A]/20 pb-3">
            <Sparkles className="h-4 w-4 text-[#E85A4F]" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1918]">
              Faculty Patronage &amp; Convener
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {facultyMembers.map((member) => (
              <div
                key={member.id}
                className="group relative flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm hover:border-[#E85A4F] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Photo Avatar */}
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-2xl overflow-hidden border border-[#8E8D8A]/30 bg-[#EAE7DC]">
                  {member.photoUrl ? (
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full bg-[#EAE7DC] flex items-center justify-center text-[#8E8D8A]">
                      <Users className="h-8 w-8" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] border border-[#8E8D8A]/25 text-[#E85A4F] uppercase">
                    {member.role}
                  </span>

                  <h4 className="text-lg font-bold text-[#1A1918] tracking-tight group-hover:text-[#E85A4F] transition-colors">
                    {member.name}
                  </h4>

                  <p className="text-xs text-[#8E8D8A]">
                    {member.department || "LNJPIT Chapra"}
                  </p>

                  <div className="pt-2 flex items-center justify-center sm:justify-start space-x-3 text-xs text-[#8E8D8A]">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="hover:text-[#E85A4F] transition-colors flex items-center space-x-1"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-mono truncate max-w-[150px]">{member.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Leadership Grid */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 border-b border-[#8E8D8A]/20 pb-3">
            <Users className="h-4 w-4 text-[#E85A4F]" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1918]">
              Core Student Executive Leads
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentMembers.map((member) => (
              <div
                key={member.id}
                className="group relative flex flex-col items-center text-center p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm hover:border-[#E85A4F] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Photo */}
                <div className="relative h-20 w-20 rounded-full overflow-hidden border border-[#8E8D8A]/30 bg-[#EAE7DC] mb-3">
                  {member.photoUrl ? (
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[#8E8D8A]">
                      <Users className="h-6 w-6" />
                    </div>
                  )}
                </div>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#E85A4F] mb-1.5 uppercase">
                  {member.role}
                </span>

                <h4 className="text-sm font-bold text-[#1A1918]">
                  {member.name}
                </h4>

                <p className="text-xs text-[#8E8D8A] mt-0.5">
                  {member.department}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

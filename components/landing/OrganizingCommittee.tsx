"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, Mail, GraduationCap, Info } from "lucide-react";
import { FestCommitteeMember } from "@/lib/data/fest-data";

interface OrganizingCommitteeProps {
  committee: FestCommitteeMember[];
}

export function OrganizingCommittee({ committee }: OrganizingCommitteeProps) {
  const facultyMembers = committee.filter((m) => m.category === "FACULTY");
  const studentMembers = committee.filter((m) => m.category !== "FACULTY");

  return (
    <section
      id="team"
      className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#EAE7DC] text-[#1A1918] border-b border-[#8E8D8A]/20"
    >
      <div className="container max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <GraduationCap className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>Organizing Committee</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              Meet the <span className="text-[#E85A4F]">Organizers</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              Faculty patrons and student leads who run the festival. The list is maintained by
              the organizing committee.
            </p>
          </div>

          <Link href="/team">
            <span className="inline-flex items-center text-xs font-mono font-semibold py-2 px-4 rounded border border-[#8E8D8A]/40 text-[#1A1918] bg-[#F6F4EE] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer">
              Committee Directory →
            </span>
          </Link>
        </div>

        {committee.length === 0 ? (
          <div className="rounded-2xl border border-[#8E8D8A]/25 bg-[#F6F4EE] p-10 text-center">
            <Info className="h-8 w-8 text-[#8E8D8A] mx-auto mb-2" />
            <p className="text-base font-bold text-[#1A1918]">Committee members coming soon</p>
            <p className="text-xs text-[#8E8D8A] mt-1">
              Faculty and student leads will be listed here as the organizing committee is finalised.
            </p>
          </div>
        ) : (
          <>
            {facultyMembers.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-[#8E8D8A]/20 pb-3">
                  <GraduationCap className="h-4 w-4 text-[#E85A4F]" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1918]">
                    Faculty Patrons
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {facultyMembers.map((member) => (
                    <div
                      key={member.id}
                      className="group relative flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm"
                    >
                      <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-2xl overflow-hidden border border-[#8E8D8A]/30 bg-[#EAE7DC]">
                        {member.photoUrl ? (
                          <Image
                            src={member.photoUrl}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-[#EAE7DC] flex items-center justify-center text-[#8E8D8A]">
                            <Users className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] border border-[#8E8D8A]/25 text-[#E85A4F] uppercase">
                          {member.role}
                        </span>
                        <h4 className="text-lg font-bold text-[#1A1918] tracking-tight">
                          {member.name}
                        </h4>
                        <p className="text-xs text-[#8E8D8A]">
                          {member.department ?? "LNJPIT Chapra"}
                        </p>
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="pt-2 inline-flex items-center space-x-1 text-xs text-[#8E8D8A] hover:text-[#E85A4F] transition-colors"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span className="font-mono truncate">{member.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {studentMembers.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 border-b border-[#8E8D8A]/20 pb-3">
                  <Users className="h-4 w-4 text-[#E85A4F]" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1918]">
                    Student Leads
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {studentMembers.map((member) => (
                    <div
                      key={member.id}
                      className="group relative flex flex-col items-center text-center p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm"
                    >
                      <div className="relative h-20 w-20 rounded-full overflow-hidden border border-[#8E8D8A]/30 bg-[#EAE7DC] mb-3">
                        {member.photoUrl ? (
                          <Image
                            src={member.photoUrl}
                            alt={member.name}
                            fill
                            className="object-cover"
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
                      <h4 className="text-sm font-bold text-[#1A1918]">{member.name}</h4>
                      {member.department && (
                        <p className="text-xs text-[#8E8D8A] mt-0.5">{member.department}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// ASTITVA 2K26 - Public Organizing Committee Page
// Path: app/team/page.tsx
// ============================================================================

import { Users, GraduationCap, Mail, Info } from "lucide-react";
import { getFestCommittee, FestCommitteeMember } from "@/lib/data/fest-data";
import { CommitteeBrowser } from "@/components/team/CommitteeBrowser";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Organizing Committee | ASTITVA 2K26",
  description: "Faculty and student leads organizing ASTITVA 2K26.",
};

export default async function TeamPage() {
  const committee = await getFestCommittee();

  return (
    <div className="w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="container max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#8E8D8A]/20 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <GraduationCap className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>Organizing Committee</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              Festival <span className="text-[#E85A4F]">Leadership</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              Faculty patrons and student leads who run ASTITVA 2K26.
            </p>
          </div>
        </div>

        {committee.length === 0 ? (
          <div className="rounded-2xl border border-[#8E8D8A]/25 bg-[#F6F4EE] p-10 text-center">
            <Info className="h-8 w-8 text-[#8E8D8A] mx-auto mb-2" />
            <p className="text-base font-bold text-[#1A1918]">Committee coming soon</p>
            <p className="text-xs text-[#8E8D8A] mt-1">
              Faculty and student leads will be added by the organizing committee.
            </p>
          </div>
        ) : (
          <CommitteeBrowser committee={committee} />
        )}
      </div>
    </div>
  );
}

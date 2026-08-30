import React from "react";
import { Trophy, Medal, Award, FileCheck2, Sparkles, ShieldCheck, Info } from "lucide-react";

interface PrizePoolShowcaseProps {
  totalPrizePool?: number;
}

export function PrizePoolShowcase({ totalPrizePool }: PrizePoolShowcaseProps = {}) {
  return (
    <section
      id="awards"
      className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#EAE7DC] text-[#1A1918] border-b border-[#8E8D8A]/20"
    >
      <div className="container max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
            <span>Awards &amp; Recognition</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
            Awards &amp; <span className="text-[#E85A4F]">Recognition</span>
          </h2>

          <p className="text-base sm:text-lg text-[#8E8D8A] max-w-2xl leading-relaxed">
            Every tournament culminates in institutional recognition. Winners receive championship trophies,
            minted medals, and cryptographically verified digital certificates.
          </p>
        </div>

        <div className="rounded-3xl border border-[#8E8D8A]/25 bg-[#F6F4EE] p-8 sm:p-10 shadow-sm text-center">
          <p className="text-[10px] font-mono tracking-widest text-[#8E8D8A] uppercase">
            Official Accolades &amp; Certification
          </p>
          <p className="mt-2 text-4xl sm:text-5xl font-extrabold text-[#1A1918] font-mono">
            Trophies, Medals &amp; Certificates
          </p>
          <p className="text-xs text-[#8E8D8A] mt-2">
            Verified digital certificates are issued for all registered attendees and podium finishers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AwardCard
            number="01"
            icon={Trophy}
            badge="WINNER"
            title="Winner"
            description="First place in each event receives a Gold Trophy, Gold Medal, and Certificate of Excellence."
          />
          <AwardCard
            number="02"
            icon={Medal}
            badge="RUNNER-UP"
            title="1st &amp; 2nd Runners-Up"
            description="Second and third place finishers receive Silver/Bronze Medals and Certificate of Merit."
          />
          <AwardCard
            number="03"
            icon={Award}
            badge="MERIT"
            title="Merit Award"
            description="Finalists and notable performers receive a Certificate of Commendation for outstanding performance."
          />
          <AwardCard
            number="04"
            icon={FileCheck2}
            badge="ALL ATTENDEES"
            title="Participation"
            description="Every participant who attends receives a digital Certificate of Participation with a verifiable AST26-CERT-XXXXX ID."
          />
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm">
          <p className="text-[10px] font-mono tracking-widest text-[#8E8D8A] uppercase mb-4">
            About the certificates
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-[#1A1918]">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-4 w-4 text-[#E85A4F] mt-0.5 flex-shrink-0" />
              <span>
                Every certificate carries a unique certificate ID and tamper-evident digital verification. The public
                verification page confirms authenticity.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <Info className="h-4 w-4 text-[#E85A4F] mt-0.5 flex-shrink-0" />
              <span>
                Issued automatically by the platform after the event coordinator records the
                podium. No manual request required.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AwardCard({
  number,
  icon: Icon,
  badge,
  title,
  description,
}: {
  number: string;
  icon: React.ElementType;
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl font-bold text-[#D8C3A5]">{number}</span>
          <div className="w-9 h-9 rounded border border-[#8E8D8A]/20 bg-[#EAE7DC] flex items-center justify-center text-[#E85A4F]">
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] border border-[#8E8D8A]/25 text-[#E85A4F] uppercase">
            {badge}
          </span>
          <h3 className="text-base font-bold text-[#1A1918] tracking-tight uppercase mt-2">
            {title}
          </h3>
        </div>
        <p className="text-xs text-[#8E8D8A] leading-relaxed pt-1">{description}</p>
      </div>
    </div>
  );
}

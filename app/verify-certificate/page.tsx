// ============================================================================
// ASTITVA 2K26 - Public Certificate Verification Portal (Exteta Luxury Aesthetic)
// Path: app/verify-certificate/page.tsx
// ============================================================================

import Link from "next/link";
import { Award, ShieldCheck, Search, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Verify Certificate | ASTITVA 2K26",
  description: "Public verification portal for ASTITVA 2K26 certificates.",
};

export default async function VerifyCertificateIndex() {
  const recent = await prisma.certificate.findMany({
    orderBy: { issueDate: "desc" },
    take: 12,
    select: {
      certificateNumber: true,
      recipientName: true,
      eventName: true,
      type: true,
      issueDate: true,
      isRevoked: true,
    },
  });

  return (
    <div className="min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="container max-w-5xl mx-auto space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-8 sm:p-12 shadow-sm">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
              <ShieldCheck className="mr-1.5 h-3 w-3 inline text-[#E85A4F]" /> PUBLIC VERIFICATION PORTAL
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              VERIFY AN <span className="text-[#E85A4F]">AST26-CERT</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8E8D8A] font-mono leading-relaxed">
              Each ASTITVA 2K26 certificate carries a unique cryptographic ID and HMAC-SHA256 signature.
              Employers, universities, and recruiters can confirm authenticity by visiting
              <code className="mx-1 px-1.5 py-0.5 rounded bg-[#EAE7DC] text-[#E85A4F] text-xs">/verify-certificate/&lt;ID&gt;</code>.
            </p>
            <form
              method="get"
              action="/verify-certificate"
              className="flex flex-col sm:flex-row gap-2 pt-2"
            >
              <div className="flex-1">
                <label className="text-[10px] font-mono uppercase text-[#8E8D8A] block mb-1">
                  Enter certificate number
                </label>
                <div className="flex gap-2">
                  <input
                    name="id"
                    type="text"
                    placeholder="AST26-CERT-10492"
                    className="flex-1 rounded-xl border border-[#8E8D8A]/30 bg-[#EAE7DC] px-4 py-2.5 text-xs font-mono text-[#1A1918] placeholder:text-[#8E8D8A]/60 focus:outline-none focus:border-[#E85A4F]"
                  />
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#E85A4F] text-white text-xs font-mono font-bold uppercase hover:bg-[#C94A40] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm">
                    <Search className="h-4 w-4" /> VERIFY
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="border-b border-[#8E8D8A]/20 pb-4">
            <h2 className="text-base font-bold font-mono text-[#1A1918] uppercase flex items-center">
              <Award className="h-4 w-4 text-[#E85A4F] mr-2" /> Recently Issued Certificates
            </h2>
            <p className="text-xs text-[#8E8D8A] font-mono mt-1">
              Click a certificate record to inspect cryptographic validity.
            </p>
          </div>
          <div>
            {recent.length === 0 ? (
              <p className="text-xs font-mono text-[#8E8D8A] italic py-6 text-center">
                No certificates issued yet.
              </p>
            ) : (
              <ul className="divide-y divide-[#8E8D8A]/15 font-mono text-xs">
                {recent.map((c) => (
                  <li key={c.certificateNumber} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-[#1A1918] truncate">
                        {c.recipientName} <span className="text-[#8E8D8A]">· {c.eventName}</span>
                      </p>
                      <p className="text-[10px] text-[#8E8D8A]">
                        {c.certificateNumber} · {formatDate(c.issueDate)} · {c.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.isRevoked && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 uppercase">
                          REVOKED
                        </span>
                      )}
                      <Link href={`/verify-certificate/${c.certificateNumber}`}>
                        <span className="text-xs font-bold text-[#E85A4F] hover:underline flex items-center">
                          Verify <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </span>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

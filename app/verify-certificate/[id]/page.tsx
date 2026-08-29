// ============================================================================
// ASTITVA 2K26 - Public Certificate Verification Record (Exteta Luxury Aesthetic)
// Path: app/verify-certificate/[id]/page.tsx
// ============================================================================

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  ShieldX,
  Award,
  Calendar,
  Hash,
  User,
  Trophy,
  ArrowLeft,
} from "lucide-react";
import { getPublicCertificate } from "@/lib/certificates/actions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `Verify ${id} | ASTITVA 2K26`,
    description: `Verification record for ASTITVA 2K26 certificate ${id}`,
  };
}

export default async function VerifyCertificateById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id || !/^AST26-CERT-\d{4,8}$/i.test(id)) {
    return (
      <div className="min-h-screen bg-[#EAE7DC] text-[#1A1918] flex items-center justify-center p-8">
        <div className="rounded-3xl border border-red-300 bg-[#F6F4EE] p-8 max-w-md text-center space-y-4 shadow-sm">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
            <ShieldX className="h-6 w-6" />
          </div>
          <h2 className="text-base font-bold font-mono text-[#1A1918] uppercase">Invalid Certificate Format</h2>
          <p className="text-xs font-mono text-[#8E8D8A]">
            Certificate numbers follow the format <code className="text-[#E85A4F]">AST26-CERT-XXXXX</code>.
          </p>
          <Link href="/verify-certificate">
            <button className="px-4 py-2 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-xs font-mono font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all">
              ← Back to portal
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const cert = await getPublicCertificate(id.toUpperCase());
  if (!cert) notFound();

  const isGenuine = cert.valid && !cert.isRevoked;

  return (
    <div className="min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="container max-w-3xl mx-auto space-y-6">
        <Link
          href="/verify-certificate"
          className="text-xs font-mono text-[#8E8D8A] hover:text-[#1A1918] inline-flex items-center uppercase font-bold"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to portal
        </Link>

        <div className="rounded-3xl border border-[#8E8D8A]/25 bg-[#F6F4EE] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#8E8D8A]/20 pb-4">
            <div className="flex items-center gap-2">
              {isGenuine ? (
                <ShieldCheck className="h-6 w-6 text-[#E85A4F]" />
              ) : (
                <ShieldX className="h-6 w-6 text-red-600" />
              )}
              <h2 className="text-lg font-bold font-mono text-[#1A1918] uppercase">
                {isGenuine ? "Cryptographically Verified" : "Verification Failed"}
              </h2>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded uppercase ${isGenuine ? "bg-[#EAE7DC] text-[#E85A4F] border border-[#8E8D8A]/20" : "bg-red-100 text-red-700"}`}>
              {isGenuine ? "AUTHENTIC" : "UNVERIFIED"}
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-1">
                <span className="text-[10px] text-[#8E8D8A] uppercase block">Recipient</span>
                <p className="text-sm font-bold text-[#1A1918]">{cert.recipientName}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-1">
                <span className="text-[10px] text-[#8E8D8A] uppercase block">Tournament</span>
                <p className="text-sm font-bold text-[#1A1918]">{cert.eventName}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-1">
                <span className="text-[10px] text-[#8E8D8A] uppercase block">Certificate Type</span>
                <p className="text-sm font-bold text-[#E85A4F]">{cert.type}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-1">
                <span className="text-[10px] text-[#8E8D8A] uppercase block">Date Issued</span>
                <p className="text-sm font-bold text-[#1A1918]">{formatDate(cert.issueDate)}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-1">
              <span className="text-[10px] text-[#8E8D8A] uppercase block">Digital Verification Hash</span>
              <p className="text-[11px] text-[#1A1918] break-all font-mono">{cert.signatureHash}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

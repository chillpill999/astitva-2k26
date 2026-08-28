// ============================================================================
// ASTITVA 2K26 - Public Certificate Verification (by ID)
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center p-8">
        <Card className="glass-panel border-red-500/30 bg-slate-900/80 max-w-md">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center">
              <ShieldX className="h-4 w-4 text-red-300 mr-2" /> Invalid Certificate Format
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Certificate numbers follow the format <code className="text-emerald-300">AST26-CERT-XXXXX</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/verify-certificate">
              <Button variant="outline" size="sm" className="text-xs">
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to portal
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cert = await getPublicCertificate(id.toUpperCase());
  if (!cert) notFound();

  const isGenuine = cert.valid && !cert.isRevoked;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="container max-w-3xl mx-auto space-y-6">
        <Link
          href="/verify-certificate"
          className="text-xs text-slate-400 hover:text-emerald-300 inline-flex items-center"
        >
          <ArrowLeft className="h-3 w-3 mr-1" /> Back to portal
        </Link>

        <Card
          className={`glass-panel border-2 ${
            isGenuine
              ? "border-emerald-500/40 bg-emerald-950/20"
              : "border-red-500/40 bg-red-950/20"
          } shadow-2xl`}
        >
          <CardHeader className="pb-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-white flex items-center">
                {isGenuine ? (
                  <ShieldCheck className="h-5 w-5 text-emerald-300 mr-2" />
                ) : (
                  <ShieldX className="h-5 w-5 text-red-300 mr-2" />
                )}
                {isGenuine ? "Verified Authentic" : "Verification Failed"}
              </CardTitle>
              <Badge
                variant="outline"
                className={`text-[10px] font-mono ${
                  isGenuine
                    ? "border-emerald-500/40 text-emerald-300"
                    : "border-red-500/40 text-red-300"
                }`}
              >
                {isGenuine ? "VALID" : cert.isRevoked ? "REVOKED" : "TAMPERED"}
              </Badge>
            </div>
            <CardDescription className="text-xs text-slate-400 mt-1">
              {isGenuine
                ? "This certificate was issued by ASTITVA 2K26 and its HMAC-SHA256 signature is valid."
                : cert.isRevoked
                ? `This certificate was revoked${cert.revokedReason ? `: ${cert.revokedReason}` : "."}`
                : "The signature on this certificate does not match the canonical payload. The certificate may be tampered with or forged."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            <DetailRow
              icon={<Hash className="h-3.5 w-3.5 text-cyan-300" />}
              label="Certificate Number"
              value={cert.certificateNumber}
              mono
            />
            <DetailRow
              icon={<User className="h-3.5 w-3.5 text-amber-300" />}
              label="Recipient"
              value={`${cert.recipientName} · ${cert.participantId || "—"}`}
            />
            <DetailRow
              icon={<Trophy className="h-3.5 w-3.5 text-emerald-300" />}
              label="Award"
              value={`${cert.title} — ${cert.eventName}`}
            />
            <DetailRow
              icon={<Award className="h-3.5 w-3.5 text-purple-300" />}
              label="Category"
              value={cert.category}
            />
            <DetailRow
              icon={<Calendar className="h-3.5 w-3.5 text-amber-300" />}
              label="Issued On"
              value={formatDate(cert.issueDate)}
            />
            <DetailRow
              icon={<Hash className="h-3.5 w-3.5 text-slate-300" />}
              label="Signature (HMAC-SHA256)"
              value={cert.signatureHash}
              mono
              truncate
            />
          </CardContent>
        </Card>

        <p className="text-[10px] text-slate-500 font-mono text-center">
          Verification URL: <span className="text-slate-400">{cert.verificationUrl}</span>
        </p>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  mono,
  truncate,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  truncate?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-white/5 bg-slate-950/60 px-3 py-2">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p
          className={`text-sm text-white ${
            mono ? "font-mono" : ""
          } ${truncate ? "truncate" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

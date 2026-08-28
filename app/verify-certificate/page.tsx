// ============================================================================
// ASTITVA 2K26 - Public Certificate Verification Portal (List + Lookup)
// Path: app/verify-certificate/page.tsx
// ============================================================================

import Link from "next/link";
import { Award, ShieldCheck, Search, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="container max-w-5xl mx-auto space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-900/90 border border-emerald-500/20 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <Badge variant="outline" className="px-3 py-1 text-xs font-mono border-emerald-500/40 text-emerald-300 bg-emerald-950/40">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> PUBLIC VERIFICATION PORTAL
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              Verify an <span className="text-emerald-300">AST26-CERT-XXXXX</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Each ASTITVA 2K26 certificate carries a unique ID and an HMAC-SHA256 signature.
              Employers, universities, and recruiters can confirm authenticity by visiting
              <code className="mx-1 px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 text-xs">/verify-certificate/&lt;ID&gt;</code>.
            </p>
            <form
              method="get"
              action="/verify-certificate"
              className="flex flex-col sm:flex-row gap-2 pt-2"
            >
              <div className="flex-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Enter certificate number
                </label>
                <div className="flex gap-2">
                  <input
                    name="id"
                    type="text"
                    placeholder="AST26-CERT-10492"
                    className="flex-1 rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-sm font-mono text-white"
                  />
                  <Button type="submit" variant="neonCyan" className="text-xs font-bold">
                    <Search className="h-4 w-4 mr-1.5" /> Verify
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <Card className="glass-panel border-white/10 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center">
              <Award className="h-4 w-4 text-amber-300 mr-2" /> Recently Issued Certificates
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Click a certificate to view its full verification record.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {recent.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-6 text-center">
                No certificates issued yet.
              </p>
            ) : (
              <ul className="divide-y divide-white/5">
                {recent.map((c) => (
                  <li key={c.certificateNumber} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {c.recipientName} <span className="text-slate-400">· {c.eventName}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {c.certificateNumber} · {formatDate(c.issueDate)} · {c.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.isRevoked && (
                        <Badge variant="outline" className="text-[10px] border-red-500/40 text-red-300 font-mono">
                          REVOKED
                        </Badge>
                      )}
                      <Link href={`/verify-certificate/${c.certificateNumber}`}>
                        <Button size="sm" variant="ghost" className="text-xs text-emerald-300 hover:text-emerald-200">
                          Verify <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

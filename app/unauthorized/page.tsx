// ============================================================================
// ASTITVA 2K26 - Unauthorized Access Guard Page (Exteta Luxury Aesthetic)
// Path: app/unauthorized/page.tsx
// ============================================================================

"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldAlert, ArrowLeft, RefreshCw } from "lucide-react";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const attemptedPath = searchParams.get("attempted") || "/dashboard";

  return (
    <div className="min-h-screen bg-[#EAE7DC] text-[#1A1918] flex items-center justify-center px-4 py-12 relative overflow-hidden font-mono">
      <div className="rounded-3xl border border-[#8E8D8A]/30 bg-[#F6F4EE] max-w-lg w-full text-center shadow-2xl p-8 sm:p-10 space-y-6">
        <div className="space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#E85A4F]/10 border border-[#E85A4F]/30 flex items-center justify-center text-[#E85A4F]">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-[#EAE7DC] text-[#E85A4F] uppercase border border-[#8E8D8A]/25 inline-block">
            RBAC ACCESS RESTRICTED
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1918] uppercase tracking-tight">
            Zone Access Denied
          </h1>
          <p className="text-xs text-[#8E8D8A] leading-relaxed">
            Your current authenticated account does not possess the requisite RBAC authorization clearance to access:
          </p>
        </div>

        <div className="rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 p-3 text-xs text-[#E85A4F] font-bold break-all">
          {attemptedPath}
        </div>

        <p className="text-xs text-[#8E8D8A] leading-relaxed">
          If you require access to this committee module, please request authorization from the Chief Patron or Fest Administrator.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/dashboard" className="flex-1">
            <button className="w-full py-2.5 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" /> Return Home
            </button>
          </Link>
          <Link href="/sign-in" className="flex-1">
            <button className="w-full py-2.5 rounded-xl bg-[#E85A4F] text-white text-xs font-bold uppercase hover:bg-[#C94A40] transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" /> Sign In Again
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#EAE7DC] flex items-center justify-center text-[#1A1918] font-mono">Verifying Access Credentials...</div>}>
      <UnauthorizedContent />
    </Suspense>
  );
}

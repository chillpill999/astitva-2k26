// ============================================================================
// ASTITVA 2K26 - Unauthorized Access Guard Page
// Path: app/unauthorized/page.tsx
// ============================================================================

"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldAlert, ArrowLeft, Lock, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const attemptedPath = searchParams.get("attempted") || "/dashboard";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Red ambient warning aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="glass-panel border-red-500/30 bg-slate-950/90 max-w-lg w-full text-center shadow-2xl relative z-10">
        <CardHeader className="space-y-3 pb-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/20 animate-pulse">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <Badge variant="destructive" className="mx-auto text-[11px] font-mono tracking-wider">
            RBAC ACCESS RESTRICTED
          </Badge>
          <CardTitle className="text-2xl font-black text-white tracking-tight">
            Restricted Zone Access Denied
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Your current authenticated role does not possess the requisite RBAC authorization clearance to access:
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-xl bg-slate-900/90 border border-red-500/20 p-3 font-mono text-xs text-red-300 break-all">
            {attemptedPath}
          </div>

          <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
            <p>
              If you require access to this committee module, please request authorization from the Chief Patron or Fest Administrator.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/dashboard/participant" className="flex-1">
              <Button variant="outline" className="w-full text-xs font-semibold">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Return to Dashboard
              </Button>
            </Link>
            <Link href="/sign-in?switch=true" className="flex-1">
              <Button variant="neonCyan" className="w-full text-xs font-bold">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Switch Demo Role
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Loading Access Check...</div>}>
      <UnauthorizedContent />
    </Suspense>
  );
}

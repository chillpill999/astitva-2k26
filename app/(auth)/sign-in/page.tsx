// ============================================================================
// ASTITVA 2K26 - Sign In & 1-Click Role Switcher Deck
// Path: app/(auth)/sign-in/page.tsx
// ============================================================================

"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Trophy,
  UserCheck,
  Users,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Flame,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_USERS } from "@/lib/auth/mock-auth";
import { Role } from "@/lib/auth/types";
import { toast } from "sonner";
import Image from "next/image";

const ROLE_ICONS: Record<Role, React.ElementType> = {
  ADMIN: Shield,
  EVENT_COORDINATOR: Trophy,
  VOLUNTEER: UserCheck,
  TEAM_CAPTAIN: Users,
  PARTICIPANT: Sparkles,
};

const ROLE_BADGE_CLASSES: Record<Role, string> = {
  ADMIN: "border-red-500/40 text-red-400 bg-red-500/10",
  EVENT_COORDINATOR: "border-purple-500/40 text-purple-400 bg-purple-500/10",
  VOLUNTEER: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
  TEAM_CAPTAIN: "border-amber-500/40 text-amber-400 bg-amber-500/10",
  PARTICIPANT: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
};

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSwitchRole, setActiveSwitchRole] = useState<Role | null>(null);

  const handle1ClickRoleLogin = async (role: Role) => {
    setActiveSwitchRole(role);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/mock/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Welcome, ${data.user.name}!`, {
          description: `Logged in as ${role.replace("_", " ")} (${data.user.participantId})`,
        });

        const target = callbackUrl || data.redirectPath || "/dashboard";
        router.push(target);
        router.refresh();
      } else {
        toast.error(data.error || "Authentication failed.");
      }
    } catch {
      toast.error("Network error while connecting to authentication service.");
    } finally {
      setIsLoading(false);
      setActiveSwitchRole(null);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your LNJPIT email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/mock/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Welcome back, ${data.user.name}!`, {
          description: `Authenticated as ${data.user.role} (${data.user.participantId})`,
        });

        const target = callbackUrl || data.redirectPath || "/dashboard";
        router.push(target);
        router.refresh();
      } else {
        toast.error(data.error || "Invalid credentials.");
      }
    } catch {
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-4xl space-y-8 relative z-10">
        {/* Festival Branding Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-wider text-white">
              ASTITVA <span className="text-cyan-400">2K26</span>
            </span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Sign In to Festival Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            LNJPIT Chapra • Annual Sports, Cultural, Gaming & Literary Fest
          </p>
        </div>

        {/* Main Grid: 1-Click Role Switcher + Manual Login */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 1-Click Quick Demo Role Switcher (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold text-white flex items-center">
                    <Zap className="h-4 w-4 text-amber-400 mr-2" />
                    1-Click Demo Role Switcher
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] font-mono border-amber-500/30 text-amber-400">
                    ZERO FRICTION
                  </Badge>
                </div>
                <CardDescription className="text-xs text-slate-400">
                  Select any pre-configured LNJPIT demo account to instantly test that role’s dashboard and RBAC privileges.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(Object.keys(DEMO_USERS) as Role[]).map((role) => {
                  const user = DEMO_USERS[role];
                  const Icon = ROLE_ICONS[role];
                  const isCurrentLoading = isLoading && activeSwitchRole === role;

                  return (
                    <button
                      key={role}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handle1ClickRoleLogin(role)}
                      className="w-full text-left p-3 rounded-xl bg-slate-950/80 border border-white/10 hover:border-cyan-500/40 hover:bg-slate-900 transition-all flex items-center justify-between group cursor-pointer disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="relative h-11 w-11 rounded-full overflow-hidden border border-white/20 bg-slate-800 flex-shrink-0">
                          <Image
                            src={user.avatarUrl}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                              {user.name}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${ROLE_BADGE_CLASSES[role]}`}
                            >
                              {role.replace("_", " ")}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                            {user.participantId} • {user.branch} Sem {user.semester} • {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center pl-2">
                        {isCurrentLoading ? (
                          <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Credentials Login Form (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-white flex items-center">
                  <Lock className="h-4 w-4 text-cyan-400 mr-2" />
                  Credentials Sign In
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Use your registered student or committee email.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-300">
                      College / Fest Email
                    </Label>
                    <div className="relative">
                      <Mail className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@lnjpit.ac.in"
                        className="pl-9 bg-slate-950/70 border-white/10 text-white placeholder:text-slate-500 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-semibold text-slate-300">
                        Password
                      </Label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Demo: <code className="text-cyan-400">Password@123</code>
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-9 bg-slate-950/70 border-white/10 text-white placeholder:text-slate-500 text-xs"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    variant="neonCyan"
                    className="w-full font-bold text-xs py-2.5"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        Sign In with Credentials
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </>
                    )}
                  </Button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-400">
                      New to ASTITVA?{" "}
                      <Link
                        href="/sign-up"
                        className="text-cyan-400 font-semibold hover:underline"
                      >
                        Register LNJPIT Student Pass
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Quick Security Badge */}
            <div className="rounded-xl bg-slate-950/60 border border-white/5 p-3 text-center">
              <span className="text-[11px] font-mono text-slate-400 flex items-center justify-center">
                <Shield className="h-3.5 w-3.5 text-emerald-400 mr-1.5" />
                HMAC-SHA256 Encrypted Session Protocol
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Loading ASTITVA Gate...</div>}>
      <SignInContent />
    </Suspense>
  );
}

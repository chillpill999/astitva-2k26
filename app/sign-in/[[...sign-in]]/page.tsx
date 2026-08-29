"use client";

import React, { useState } from "react";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Sparkles, UserCheck, Trophy, Camera, Users, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const QUICK_ROLES = [
  { role: "ADMIN", label: "Admin Console", desc: "Global fest control & analytics", icon: Shield, route: "/dashboard/admin", badge: "Superuser" },
  { role: "EVENT_COORDINATOR", label: "Coordinator Portal", desc: "Results, bracket & score entry", icon: Trophy, route: "/dashboard/coordinator", badge: "Lead" },
  { role: "VOLUNTEER", label: "Volunteer Pass Scanner", desc: "QR check-in & gate management", icon: Camera, route: "/dashboard/volunteer/scanner", badge: "Ops" },
  { role: "TEAM_CAPTAIN", label: "Team Captain Hub", desc: "Roster management & registrations", icon: Users, route: "/dashboard/captain", badge: "Squad" },
  { role: "PARTICIPANT", label: "Participant Hub", desc: "Encrypted QR pass & certificate verification", icon: UserCheck, route: "/dashboard/participant", badge: "Entry" },
] as const;

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const [loggingInRole, setLoggingInRole] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  const handleQuickLogin = async (role: string, route: string) => {
    setLoggingInRole(role);
    try {
      const res = await fetch("/api/auth/mock/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Logged in as ${role}`);
        const target = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : route;
        router.push(target);
        router.refresh();
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch {
      toast.error("Quick login failed");
    } finally {
      setLoggingInRole(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#EAE7DC] text-[#1A1918] py-12 px-4">
      <div className="mb-6 text-center space-y-1">
        <Link href="/" className="font-mono text-xl font-bold tracking-[0.35em] text-[#1A1918] uppercase">
          A S T I T V A
        </Link>
        <p className="text-xs font-mono tracking-wider text-[#8E8D8A] uppercase">
          LNJPIT CHAPRA · OFFICIAL FESTIVAL PORTAL
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {/* Clerk Sign In Box */}
        <div className="rounded-3xl p-4 bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-xl min-h-[380px] flex items-center justify-center">
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            fallbackRedirectUrl={callbackUrl || "/"}
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none bg-transparent w-full p-0",
                headerTitle: "text-[#1A1918] font-bold font-mono text-lg",
                headerSubtitle: "text-[#8E8D8A] text-xs font-mono",
                formButtonPrimary: "bg-[#E85A4F] hover:bg-[#C94A40] text-xs font-mono uppercase font-bold py-2.5 transition-colors shadow-sm",
                footerActionLink: "text-[#E85A4F] hover:underline font-mono text-xs",
                formFieldInput: "bg-white border-[#8E8D8A]/30 text-[#1A1918] rounded-xl text-xs",
                formFieldLabel: "text-[#1A1918] font-mono text-xs font-semibold",
                socialButtonsBlockButton: "border-[#8E8D8A]/30 hover:bg-[#EAE7DC] text-[#1A1918] text-xs font-mono rounded-xl",
                dividerLine: "bg-[#8E8D8A]/20",
                dividerText: "text-[#8E8D8A] text-[10px] font-mono uppercase",
              },
            }}
          />
        </div>

        {/* 1-Click Quick Demo Login Accordion */}
        <div className="rounded-2xl border border-[#8E8D8A]/25 bg-[#F6F4EE]/80 backdrop-blur-sm p-4">
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#E85A4F]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1A1918] group-hover:text-[#E85A4F] transition-colors">
                Quick 1-Click Demo Login
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#8E8D8A] transition-transform duration-200 ${
                showDemo ? "rotate-180" : ""
              }`}
            />
          </button>

          {showDemo && (
            <div className="mt-3 pt-3 border-t border-[#8E8D8A]/20 space-y-2">
              <p className="text-[11px] font-mono text-[#8E8D8A] mb-2">
                Instant login for testing role-specific features:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {QUICK_ROLES.map((r) => {
                  const Icon = r.icon;
                  const isLoading = loggingInRole === r.role;
                  return (
                    <button
                      key={r.role}
                      type="button"
                      disabled={Boolean(loggingInRole)}
                      onClick={() => handleQuickLogin(r.role, r.route)}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-[#8E8D8A]/20 bg-white hover:bg-[#EAE7DC] hover:border-[#E85A4F]/40 transition-all text-left group disabled:opacity-50 cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#EAE7DC] flex items-center justify-center text-[#1A1918] group-hover:bg-[#E85A4F] group-hover:text-white transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-mono font-bold text-[#1A1918]">
                            {r.label}
                          </div>
                          <div className="text-[10px] text-[#8E8D8A]">
                            {r.desc}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#1A1918] uppercase">
                        {isLoading ? "Signing in..." : r.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs font-mono text-[#8E8D8A] hover:text-[#1A1918] transition-colors"
          >
            ← Return to Festival Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

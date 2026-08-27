// ============================================================================
// ASTITVA 2K26 - Dev Role Switcher Floating Control
// Path: components/dashboard/DevRoleSwitcher.tsx
// ============================================================================

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { RoleBadge, FestRole } from "./RoleBadge";
import { Shield, Trophy, UserCheck, Users, Sparkles, ChevronDown, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface DemoAccount {
  role: FestRole;
  email: string;
  name: string;
  participantId: string;
  route: string;
  icon: React.ElementType;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "ADMIN",
    email: "admin@lnjpit.ac.in",
    name: "Dr. Shailendra Kumar",
    participantId: "AST26-0001",
    route: "/dashboard/admin",
    icon: Shield,
  },
  {
    role: "EVENT_COORDINATOR",
    email: "coordinator@lnjpit.ac.in",
    name: "Prof. Rajesh Ranjan",
    participantId: "AST26-0002",
    route: "/dashboard/coordinator",
    icon: Trophy,
  },
  {
    role: "VOLUNTEER",
    email: "volunteer@lnjpit.ac.in",
    name: "Ananya Sharma",
    participantId: "AST26-0003",
    route: "/dashboard/volunteer",
    icon: UserCheck,
  },
  {
    role: "TEAM_CAPTAIN",
    email: "captain@lnjpit.ac.in",
    name: "Aman Verma",
    participantId: "AST26-0004",
    route: "/dashboard/captain",
    icon: Users,
  },
  {
    role: "PARTICIPANT",
    email: "participant@lnjpit.ac.in",
    name: "Sneha Kumari",
    participantId: "AST26-0005",
    route: "/dashboard/participant",
    icon: Sparkles,
  },
];

export function DevRoleSwitcher({ currentRole }: { currentRole?: FestRole }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const getRoleFromPath = (): FestRole => {
    if (currentRole) return currentRole;
    if (pathname.includes("/admin")) return "ADMIN";
    if (pathname.includes("/coordinator")) return "EVENT_COORDINATOR";
    if (pathname.includes("/volunteer")) return "VOLUNTEER";
    if (pathname.includes("/captain")) return "TEAM_CAPTAIN";
    return "PARTICIPANT";
  };

  const [activeRole, setActiveRole] = useState<FestRole>(getRoleFromPath);

  useEffect(() => {
    setActiveRole(getRoleFromPath());
  }, [pathname, currentRole]);

  const handleRoleSwitch = async (account: DemoAccount) => {
    setIsSwitching(true);
    setActiveRole(account.role);
    setIsExpanded(false);

    try {
      const res = await fetch("/api/auth/mock/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: account.role }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Switched role to ${account.role}`, {
          description: `Logged in as ${account.name} (${account.participantId})`,
        });

        router.push(account.route);
        router.refresh();
      }
    } catch {
      toast.error("Role switch failed.");
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-[#030712]/95 border border-white/15 rounded-xl shadow-2xl p-1.5 backdrop-blur-xl flex flex-col gap-1 transition-all">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={isSwitching}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs font-mono cursor-pointer"
        >
          {isSwitching ? (
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          ) : (
            <span className="text-slate-400 font-bold">DEV SWITCHER:</span>
          )}
          <RoleBadge role={activeRole} />
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {isExpanded && (
          <div className="flex flex-col gap-1 pt-1 border-t border-white/10 mt-1 min-w-[250px]">
            {DEMO_ACCOUNTS.map((acc) => {
              const Icon = acc.icon;
              const isSelected = activeRole === acc.role;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleRoleSwitch(acc)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-cyan-500/20 text-white border border-cyan-500/40 font-semibold"
                      : "hover:bg-white/5 text-slate-300 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-200">{acc.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {acc.participantId}
                      </p>
                    </div>
                  </div>
                  <RoleBadge role={acc.role} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

// ============================================================================
// ASTITVA 2K26 - Fast Dev Role Switcher Widget (Exteta Luxury Aesthetic)
// Path: components/dashboard/DevRoleSwitcher.tsx
// ============================================================================

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ShieldAlert,
  Crown,
  Sparkles,
  QrCode,
  UserCheck,
  ChevronDown,
  RefreshCw,
  Zap,
} from "lucide-react";
import { RoleBadge, FestRole } from "./RoleBadge";
import { toast } from "sonner";

interface DemoAccount {
  role: FestRole;
  name: string;
  collegeId: string;
  participantId: string;
  route: string;
  icon: any;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "ADMIN",
    name: "Dr. Shailendra Kumar",
    collegeId: "LNJPIT-ADMIN-01",
    participantId: "AST26-0001",
    route: "/dashboard/admin",
    icon: ShieldAlert,
  },
  {
    role: "EVENT_COORDINATOR",
    name: "Prof. Rajesh Ranjan",
    collegeId: "LNJPIT-FAC-042",
    participantId: "AST26-0002",
    route: "/dashboard/coordinator",
    icon: Sparkles,
  },
  {
    role: "VOLUNTEER",
    name: "Ananya Sharma",
    collegeId: "23105128014",
    participantId: "AST26-0003",
    route: "/dashboard/volunteer",
    icon: QrCode,
  },
  {
    role: "TEAM_CAPTAIN",
    name: "Aman Verma",
    collegeId: "22105128005",
    participantId: "AST26-0004",
    route: "/dashboard/captain",
    icon: Crown,
  },
  {
    role: "PARTICIPANT",
    name: "Sneha Kumari",
    collegeId: "24105128032",
    participantId: "AST26-0005",
    route: "/dashboard/participant",
    icon: UserCheck,
  },
];

interface DevRoleSwitcherProps {
  currentRole?: FestRole | any;
}

export function DevRoleSwitcher({ currentRole }: DevRoleSwitcherProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  // Identify current active role based on prop or path
  const activeRole: FestRole = currentRole || (pathname.includes("/admin")
    ? "ADMIN"
    : pathname.includes("/coordinator")
    ? "EVENT_COORDINATOR"
    : pathname.includes("/volunteer")
    ? "VOLUNTEER"
    : pathname.includes("/captain")
    ? "TEAM_CAPTAIN"
    : "PARTICIPANT");

  const handleRoleSwitch = async (account: DemoAccount) => {
    setIsSwitching(true);
    setIsExpanded(false);

    try {
      const res = await fetch("/api/auth/mock/login", {
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
      <div className="bg-[#F6F4EE] border border-[#8E8D8A]/30 rounded-2xl shadow-xl p-1.5 backdrop-blur-xl flex flex-col gap-1 transition-all text-[#1A1918]">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={isSwitching}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EAE7DC] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-colors text-xs font-mono cursor-pointer"
        >
          {isSwitching ? (
            <RefreshCw className="w-3.5 h-3.5 text-[#E85A4F] animate-spin" />
          ) : (
            <span className="text-[#8E8D8A] font-bold">DEV SWITCHER:</span>
          )}
          <RoleBadge role={activeRole} />
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#8E8D8A] transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {isExpanded && (
          <div className="flex flex-col gap-1 pt-1 border-t border-[#8E8D8A]/20 mt-1 min-w-[250px] font-mono">
            {DEMO_ACCOUNTS.map((acc) => {
              const Icon = acc.icon;
              const isSelected = activeRole === acc.role;

              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleRoleSwitch(acc)}
                  className={`flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#E85A4F] text-white"
                      : "hover:bg-[#EAE7DC] text-[#1A1918]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? "text-white" : "text-[#E85A4F]"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{acc.name}</p>
                      <p className="text-[10px] opacity-75 truncate">
                        {acc.role} • {acc.participantId}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <Zap className="w-3 h-3 text-white shrink-0 fill-white" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

// ============================================================================
// ASTITVA 2K26 - Dev Role Switcher (development-only fixture switcher)
// Path: components/dashboard/DevRoleSwitcher.tsx
//
// This widget is rendered only in development. It does not display any real
// user data — it switches between the labelled "Development Account · ..."
// fixtures defined in lib/auth/mock-auth.ts.
// ============================================================================

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Crown, UserCheck, Sparkles, QrCode, ChevronDown, RefreshCw, ShieldAlert, FlaskConical } from "lucide-react";
import { RoleBadge, FestRole } from "./RoleBadge";
import { toast } from "sonner";

interface DevAccount {
  role: FestRole;
  label: string;
  route: string;
  icon: React.ElementType;
}

const DEV_ACCOUNTS: DevAccount[] = [
  { role: "ADMIN", label: "Development Account · Admin", route: "/dashboard/admin", icon: ShieldAlert },
  { role: "EVENT_COORDINATOR", label: "Development Account · Coordinator", route: "/dashboard/coordinator", icon: Sparkles },
  { role: "VOLUNTEER", label: "Development Account · Volunteer", route: "/dashboard/volunteer", icon: QrCode },
  { role: "TEAM_CAPTAIN", label: "Development Account · Captain", route: "/dashboard/captain", icon: Crown },
  { role: "PARTICIPANT", label: "Development Account · Participant", route: "/dashboard/participant", icon: UserCheck },
];

export function DevRoleSwitcher({ currentRole }: { currentRole?: FestRole } = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  if (process.env.NODE_ENV === "production") return null;

  const activeRole: FestRole = currentRole || (pathname.includes("/admin")
    ? "ADMIN"
    : pathname.includes("/coordinator")
    ? "EVENT_COORDINATOR"
    : pathname.includes("/volunteer")
    ? "VOLUNTEER"
    : pathname.includes("/captain")
    ? "TEAM_CAPTAIN"
    : "PARTICIPANT");

  const handleRoleSwitch = async (account: DevAccount) => {
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
        toast.success(`Switched to ${account.role}`);
        router.push(account.route);
        router.refresh();
      } else {
        toast.error(data.error ?? "Role switch failed.");
      }
    } catch {
      toast.error("Role switch failed.");
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl shadow-xl p-1.5 backdrop-blur-xl flex flex-col gap-1 transition-all text-white">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={isSwitching}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 transition-colors text-xs font-mono"
          aria-label="Toggle dev role switcher"
        >
          {isSwitching ? (
            <RefreshCw className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          ) : (
            <FlaskConical className="w-3.5 h-3.5 text-amber-300" />
          )}
          <span className="text-amber-300 font-bold">DEV ONLY</span>
          <RoleBadge role={activeRole} />
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {isExpanded && (
          <div className="flex flex-col gap-1 pt-1 border-t border-white/10 mt-1 min-w-[280px] font-mono">
            {DEV_ACCOUNTS.map((acc) => {
              const Icon = acc.icon;
              const isSelected = activeRole === acc.role;

              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleRoleSwitch(acc)}
                  className={`flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                    isSelected
                      ? "bg-amber-500/20 text-white border border-amber-500/40"
                      : "hover:bg-slate-800 text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? "text-amber-300" : "text-cyan-300"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{acc.label}</p>
                      <p className="text-[10px] opacity-75 truncate">{acc.role}</p>
                    </div>
                  </div>
                </button>
              );
            })}
            <p className="text-[9px] text-amber-300/70 px-2 pb-1 pt-1 font-mono leading-relaxed">
              Visible only in development. These are not real users.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

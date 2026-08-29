"use client";

// ============================================================================
// ASTITVA 2K26 - Dev Role Switcher (Warm Sand Palette)
// Path: components/dashboard/DevRoleSwitcher.tsx
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
  { role: "ADMIN", label: "Dev Account · Admin", route: "/dashboard/admin", icon: ShieldAlert },
  { role: "EVENT_COORDINATOR", label: "Dev Account · Coordinator", route: "/dashboard/coordinator", icon: Sparkles },
  { role: "VOLUNTEER", label: "Dev Account · Volunteer", route: "/dashboard/volunteer", icon: QrCode },
  { role: "TEAM_CAPTAIN", label: "Dev Account · Captain", route: "/dashboard/captain", icon: Crown },
  { role: "PARTICIPANT", label: "Dev Account · Participant", route: "/dashboard/participant", icon: UserCheck },
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
      <div className="bg-[#F6F4EE] border border-[#8E8D8A]/35 rounded-2xl shadow-xl p-1.5 backdrop-blur-xl flex flex-col gap-1 transition-all text-[#1A1918]">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={isSwitching}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EAE7DC] hover:bg-[#8E8D8A]/20 transition-colors text-xs font-mono cursor-pointer"
          aria-label="Toggle dev role switcher"
        >
          {isSwitching ? (
            <RefreshCw className="w-3.5 h-3.5 text-[#E85A4F] animate-spin" />
          ) : (
            <FlaskConical className="w-3.5 h-3.5 text-[#E85A4F]" />
          )}
          <span className="text-[#E85A4F] font-bold">DEV FIXTURES</span>
          <RoleBadge role={activeRole} />
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#8E8D8A] transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {isExpanded && (
          <div className="flex flex-col gap-1 pt-1 border-t border-[#8E8D8A]/20">
            {DEV_ACCOUNTS.map((acc) => {
              const Icon = acc.icon;
              const isSelected = activeRole === acc.role;

              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleRoleSwitch(acc)}
                  disabled={isSwitching}
                  className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-mono transition-colors text-left cursor-pointer ${
                    isSelected
                      ? "bg-[#E85A4F] text-white font-bold"
                      : "text-[#1A1918] hover:bg-[#EAE7DC]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{acc.label}</span>
                  </div>
                  {isSelected && <span className="text-[10px]">ACTIVE</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

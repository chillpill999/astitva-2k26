"use client";

import React, { useState } from "react";
import {
  Crown,
  User,
  ShieldAlert,
  Trash2,
  ArrowUpCircle,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TeamMemberData } from "@/lib/teams/types";
import { manageTeamMember } from "@/lib/teams/actions";

interface TeamRosterTableProps {
  teamId: string;
  members: TeamMemberData[];
  isCaptain: boolean;
  onRosterUpdated?: () => void;
}

export function TeamRosterTable({
  teamId,
  members,
  isCaptain,
  onRosterUpdated,
}: TeamRosterTableProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAction = async (memberUserId: string, action: "REMOVE" | "PROMOTE") => {
    const actionKey = `${action}-${memberUserId}`;
    setLoadingAction(actionKey);
    setErrorMessage(null);

    try {
      const res = await manageTeamMember({
        teamId,
        memberUserId,
        action,
      });

      if (res.success) {
        if (onRosterUpdated) {
          onRosterUpdated();
        } else {
          window.location.reload();
        }
      } else {
        setErrorMessage(res.error || "Failed to complete member action.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-4 text-[#1A1918]">
      {errorMessage && (
        <div className="p-3 rounded-2xl bg-red-100 border border-red-300 text-xs font-mono text-red-700 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="rounded-3xl border border-[#8E8D8A]/25 bg-[#F6F4EE] overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-[#EAE7DC] border-b border-[#8E8D8A]/20">
            <TableRow className="border-[#8E8D8A]/20 hover:bg-transparent">
              <TableHead className="text-xs font-mono font-bold text-[#1A1918]">Player</TableHead>
              <TableHead className="text-xs font-mono font-bold text-[#1A1918]">Roll No</TableHead>
              <TableHead className="text-xs font-mono font-bold text-[#1A1918]">Branch &amp; Sem</TableHead>
              <TableHead className="text-xs font-mono font-bold text-[#1A1918]">Role</TableHead>
              <TableHead className="text-xs font-mono font-bold text-[#1A1918]">Status</TableHead>
              {isCaptain && (
                <TableHead className="text-xs font-mono font-bold text-[#1A1918] text-right">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => {
              const isMemCaptain = m.role === "CAPTAIN";
              const isRemoving = loadingAction === `REMOVE-${m.userId}`;
              const isPromoting = loadingAction === `PROMOTE-${m.userId}`;

              return (
                <TableRow key={m.id} className="border-[#8E8D8A]/15 hover:bg-[#EAE7DC]/60 font-mono text-xs">
                  <TableCell className="font-bold text-[#1A1918]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#EAE7DC] border border-[#8E8D8A]/30 flex items-center justify-center text-[10px] text-[#1A1918]">
                        {(m.user?.name || "M").charAt(0)}
                      </div>
                      <span>{m.user?.name || "Participant"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#8E8D8A]">{m.user?.profile?.collegeId || "—"}</TableCell>
                  <TableCell className="text-[#8E8D8A]">
                    {m.user?.profile?.branch ? `${m.user.profile.branch} · Sem ${m.user.profile.semester || 1}` : "—"}
                  </TableCell>
                  <TableCell>
                    {isMemCaptain ? (
                      <span className="bg-[#1A1918] text-[#EAE7DC] text-[9px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 w-max">
                        <Crown className="h-2.5 w-2.5 text-[#E85A4F]" />
                        CAPTAIN
                      </span>
                    ) : (
                      <span className="bg-[#EAE7DC] text-[#8E8D8A] text-[9px] font-bold px-2 py-0.5 rounded uppercase w-max">
                        MEMBER
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-[#E85A4F] font-bold uppercase text-[10px]">
                      {m.status}
                    </span>
                  </TableCell>
                  {isCaptain && (
                    <TableCell className="text-right space-x-2">
                      {!isMemCaptain && (
                        <>
                          <button
                            type="button"
                            disabled={!!loadingAction}
                            onClick={() => handleAction(m.userId, "PROMOTE")}
                            className="px-2.5 py-1 rounded-lg bg-[#EAE7DC] hover:bg-[#1A1918] hover:text-[#EAE7DC] text-[#1A1918] text-[10px] font-bold uppercase transition-colors"
                            title="Make Captain"
                          >
                            {isPromoting ? "..." : "PROMOTE"}
                          </button>
                          <button
                            type="button"
                            disabled={!!loadingAction}
                            onClick={() => handleAction(m.userId, "REMOVE")}
                            className="px-2.5 py-1 rounded-lg bg-[#EAE7DC] hover:bg-[#E85A4F] hover:text-white text-[#E85A4F] text-[10px] font-bold uppercase transition-colors"
                            title="Remove from squad"
                          >
                            {isRemoving ? "..." : "REMOVE"}
                          </button>
                        </>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

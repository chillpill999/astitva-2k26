"use client";

// ============================================================================
// ASTITVA 2K26 - Team Roster Table & Captain Controls Component
// Path: components/teams/TeamRosterTable.tsx
// ============================================================================

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#0b0f19]/80 overflow-hidden backdrop-blur-xl shadow-xl">
        <Table>
          <TableHeader className="bg-slate-900/90 border-b border-white/10">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-xs font-mono font-bold text-slate-300">Player</TableHead>
              <TableHead className="text-xs font-mono font-bold text-slate-300">Roll No</TableHead>
              <TableHead className="text-xs font-mono font-bold text-slate-300">Branch &amp; Sem</TableHead>
              <TableHead className="text-xs font-mono font-bold text-slate-300">Role</TableHead>
              <TableHead className="text-xs font-mono font-bold text-slate-300">Status</TableHead>
              {isCaptain && (
                <TableHead className="text-xs font-mono font-bold text-slate-300 text-right">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const isLead = member.role === "CAPTAIN";
              const isRemoving = loadingAction === `REMOVE-${member.userId}`;
              const isPromoting = loadingAction === `PROMOTE-${member.userId}`;

              return (
                <TableRow
                  key={member.id}
                  className="border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Player Name */}
                  <TableCell className="py-4 font-medium text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-slate-800 border border-white/15 flex items-center justify-center text-xs font-bold text-cyan-400">
                        {member.user?.name?.slice(0, 2).toUpperCase() || "PL"}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {member.user?.name || "Player"}
                          {isLead && <Crown className="h-3.5 w-3.5 text-amber-400 inline" />}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {member.user?.profile?.participantId || member.user?.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Roll No */}
                  <TableCell className="py-4 font-mono text-xs text-slate-300">
                    {member.user?.profile?.collegeId || "—"}
                  </TableCell>

                  {/* Branch & Semester */}
                  <TableCell className="py-4 font-mono text-xs text-slate-300">
                    {member.user?.profile?.branch ? (
                      <span>
                        {member.user.profile.branch} • Sem {member.user.profile.semester || 1}
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  {/* Role Badge */}
                  <TableCell className="py-4">
                    {isLead ? (
                      <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                        <Crown className="mr-1 h-3 w-3 text-amber-400" />
                        CAPTAIN
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-white/5 text-slate-300 border-white/15 text-[10px] font-mono">
                        MEMBER
                      </Badge>
                    )}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="py-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Approved
                    </span>
                  </TableCell>

                  {/* Captain Action Controls */}
                  {isCaptain && (
                    <TableCell className="py-4 text-right">
                      {!isLead && (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={!!loadingAction}
                            onClick={() => handleAction(member.userId, "PROMOTE")}
                            className="h-7 px-2 text-[11px] font-mono text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                            title="Make Captain"
                          >
                            {isPromoting ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <ArrowUpCircle className="mr-1 h-3.5 w-3.5" />
                                Promote
                              </>
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={!!loadingAction}
                            onClick={() => handleAction(member.userId, "REMOVE")}
                            className="h-7 px-2 text-[11px] font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            title="Remove from squad"
                          >
                            {isRemoving ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="mr-1 h-3.5 w-3.5" />
                                Kick
                              </>
                            )}
                          </Button>
                        </div>
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

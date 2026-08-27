// ============================================================================
// ASTITVA 2K26 - Export Data Modal Component
// Path: components/dashboard/ExportDataModal.tsx
// ============================================================================

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportDataModal({ isOpen, onClose }: ExportDataModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<string>("registrations");

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Trigger CSV download
      const csvContent =
        "data:text/csv;charset=utf-8," +
        encodeURIComponent(
          "Participant ID,Full Name,Roll Number,Branch,Semester,Role,Status\n" +
          "AST26-0001,Dr. Shailendra Kumar,LNJPIT-ADMIN-01,CSE,8,ADMIN,Active\n" +
          "AST26-0002,Prof. Rajesh Ranjan,LNJPIT-FAC-042,ECE,8,EVENT_COORDINATOR,Active\n" +
          "AST26-0003,Ananya Sharma,23105128014,EE,4,VOLUNTEER,Active\n" +
          "AST26-0004,Aman Verma,22105128005,ME,6,TEAM_CAPTAIN,Active\n" +
          "AST26-0005,Sneha Kumari,24105128032,CE,2,PARTICIPANT,Active\n"
        );
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `astitva_2k26_${exportType}_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("CSV export generated and downloaded successfully!");
      onClose();
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-panel border-white/10 bg-slate-950/95 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-white flex items-center">
            <FileSpreadsheet className="h-5 w-5 text-cyan-400 mr-2" />
            Export Festival Data
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Download filtered reports in standard CSV / Excel format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="space-y-2">
            <label className="font-semibold text-slate-300">Select Dataset</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: "registrations", label: "Tournament Registrations & Rosters" },
                { id: "attendance", label: "Live Gate & Venue Attendance Logs" },
                { id: "results", label: "Winner Podium & Point Tallies" },
                { id: "volunteers", label: "Volunteer Duty Allocations" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setExportType(item.id)}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                    exportType === item.id
                      ? "bg-cyan-500/15 border-cyan-500/40 text-white font-semibold"
                      : "bg-slate-900 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  {exportType === item.id && <Check className="h-4 w-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs border-white/10"
            >
              Cancel
            </Button>
            <Button
              variant="neonCyan"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
              className="text-xs font-bold"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download CSV
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

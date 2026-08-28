// ============================================================================
// ASTITVA 2K26 - Export Data Modal (Exteta Luxury Aesthetic)
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
import { FileSpreadsheet, Check, Loader2 } from "lucide-react";
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
      <DialogContent className="border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[#1A1918] max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold font-mono uppercase text-[#1A1918] flex items-center">
            <FileSpreadsheet className="h-5 w-5 text-[#E85A4F] mr-2" />
            Export Festival Data
          </DialogTitle>
          <DialogDescription className="text-xs text-[#8E8D8A] font-mono">
            Download filtered reports in standard CSV / Excel format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs font-mono">
          <div className="space-y-2">
            <label className="font-bold uppercase text-[#1A1918]">Select Dataset</label>
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
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    exportType === item.id
                      ? "bg-[#EAE7DC] border-[#E85A4F] text-[#E85A4F] font-bold"
                      : "bg-[#EAE7DC]/40 border-[#8E8D8A]/20 text-[#8E8D8A] hover:text-[#1A1918]"
                  }`}
                >
                  <span>{item.label}</span>
                  {exportType === item.id && <Check className="h-4 w-4 text-[#E85A4F]" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={handleExport}
              className="px-5 py-2.5 rounded-xl bg-[#E85A4F] text-white text-xs font-bold uppercase hover:bg-[#C94A40] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating...
                </>
              ) : (
                <>Download CSV</>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

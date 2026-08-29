"use client";

// ============================================================================
// ASTITVA 2K26 - Export Data Modal (Warm Sand Aesthetic)
// Path: components/dashboard/ExportDataModal.tsx
// ============================================================================

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileSpreadsheet, Check, Loader2, Download } from "lucide-react";
import { toast } from "sonner";

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DATASETS = [
  { id: "registrations", label: "Registrations Roster" },
  { id: "attendance", label: "Attendance Logs" },
  { id: "results", label: "Podium & Match Results" },
  { id: "certificates", label: "Issued Certificate Hashes" },
  { id: "participants", label: "Participant Directory" },
  { id: "teams", label: "Registered Squads" },
];

export function ExportDataModal({ isOpen, onClose }: ExportDataModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<string>("registrations");

  const handleExport = (format: "csv" | "xlsx") => {
    setIsExporting(true);
    const url = `/api/export/${exportType}?format=${format}`;
    fetch(url, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Export failed");
        const blob = await res.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `astitva-2k26-${exportType}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast.success(`${format.toUpperCase()} download started.`);
        onClose();
      })
      .catch(() => toast.error("Export failed. Please try again."))
      .finally(() => setIsExporting(false));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[#1A1918] max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl font-mono">
        <DialogHeader>
          <DialogTitle className="text-base font-bold uppercase flex items-center text-[#1A1918]">
            <FileSpreadsheet className="h-5 w-5 text-[#E85A4F] mr-2" />
            Export Festival Data
          </DialogTitle>
          <DialogDescription className="text-xs text-[#8E8D8A]">
            Download operational data in CSV or Excel format. All downloads are audit-logged.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="space-y-2">
            <label className="font-bold uppercase text-[#1A1918]">Select Dataset</label>
            <div className="grid grid-cols-1 gap-2">
              {DATASETS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setExportType(item.id)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    exportType === item.id
                      ? "bg-[#EAE7DC] border-[#E85A4F] text-[#E85A4F] font-bold shadow-sm"
                      : "bg-[#EAE7DC]/60 border-[#8E8D8A]/25 text-[#1A1918] hover:bg-[#EAE7DC]"
                  }`}
                >
                  <span>{item.label}</span>
                  {exportType === item.id && <Check className="h-4 w-4 text-[#E85A4F]" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#8E8D8A]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleExport("csv")}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] text-xs font-bold uppercase hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all flex items-center gap-1 cursor-pointer"
            >
              {isExporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
              CSV
            </button>
            <button
              type="button"
              onClick={() => handleExport("xlsx")}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl bg-[#E85A4F] text-white text-xs font-bold uppercase hover:bg-[#C94A40] transition-all flex items-center gap-1 cursor-pointer"
            >
              {isExporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
              Excel (XLSX)
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

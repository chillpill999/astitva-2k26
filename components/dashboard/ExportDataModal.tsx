// ============================================================================
// ASTITVA 2K26 - Export Data Modal
// Path: components/dashboard/ExportDataModal.tsx
// ============================================================================

"use client";

import { useState } from "react";
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

const DATASETS = [
  { id: "registrations", label: "Registrations" },
  { id: "attendance", label: "Attendance logs" },
  { id: "results", label: "Results" },
  { id: "certificates", label: "Certificates" },
  { id: "participants", label: "Participants" },
  { id: "teams", label: "Teams" },
];

export function ExportDataModal({ isOpen, onClose }: ExportDataModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<string>("registrations");

  const handleExport = () => {
    setIsExporting(true);
    const url = `/api/export/${exportType}?format=csv`;
    fetch(url, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Export failed");
        const blob = await res.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `astitva-2k26-${exportType}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast.success("CSV download started.");
        onClose();
      })
      .catch(() => toast.error("Export failed. Please try again."))
      .finally(() => setIsExporting(false));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border border-white/10 bg-slate-900 text-slate-100 max-w-md rounded-2xl p-6 sm:p-7 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold uppercase flex items-center">
            <FileSpreadsheet className="h-5 w-5 text-amber-300 mr-2" />
            Export Festival Data
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400 font-mono">
            Download operational data as CSV. The download is audit-logged.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs font-mono">
          <div className="space-y-2">
            <label className="font-bold uppercase">Select Dataset</label>
            <div className="grid grid-cols-1 gap-2">
              {DATASETS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setExportType(item.id)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    exportType === item.id
                      ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-200 font-bold"
                      : "bg-slate-950/50 border-white/10 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span>{item.label}</span>
                  {exportType === item.id && <Check className="h-4 w-4 text-cyan-300" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950/50 text-xs font-bold uppercase hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={handleExport}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold uppercase hover:bg-cyan-400 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Downloading...
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

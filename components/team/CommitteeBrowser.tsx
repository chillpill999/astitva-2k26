"use client";

// ============================================================================
// ASTITVA 2K26 - Committee Browser (client island)
// Path: components/team/CommitteeBrowser.tsx
// ============================================================================

import { useMemo, useState } from "react";
import { Users, Mail } from "lucide-react";
import { FestCommitteeMember } from "@/lib/data/fest-data";

interface Props {
  committee: FestCommitteeMember[];
}

const CATEGORIES = [
  { label: "All Members", value: "all" },
  { label: "Faculty Patrons", value: "FACULTY" },
  { label: "Student Core", value: "CORE_STUDENT" },
  { label: "Technical & Leads", value: "TECHNICAL" },
  { label: "Volunteers", value: "VOLUNTEER" },
];

export function CommitteeBrowser({ committee }: Props) {
  const [selected, setSelected] = useState<string>("all");

  const filtered = useMemo(
    () =>
      committee.filter((m) =>
        selected === "all" ? true : m.category === selected
      ),
    [committee, selected]
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setSelected(c.value)}
            className={`px-3.5 py-1.5 rounded text-xs font-mono transition-colors ${
              selected === c.value
                ? "bg-[#1A1918] text-[#EAE7DC] font-bold"
                : "bg-[#F6F4EE] text-[#8E8D8A] border border-[#8E8D8A]/25 hover:text-[#1A1918]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm hover:border-[#E85A4F] transition-all"
          >
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 shrink-0 rounded-xl border border-[#8E8D8A]/30 bg-[#EAE7DC] flex items-center justify-center text-sm font-mono font-black text-[#1A1918]">
                {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#E85A4F] uppercase">
                  {m.role}
                </span>
                <h3 className="text-base font-bold text-[#1A1918] truncate">{m.name}</h3>
                {m.department && (
                  <p className="text-xs text-[#8E8D8A] truncate">{m.department}</p>
                )}
              </div>
            </div>
            {m.email && (
              <div className="pt-4 border-t border-[#8E8D8A]/15 mt-4 flex items-center justify-between text-xs text-[#8E8D8A] font-mono">
                <span className="truncate">{m.email}</span>
                <a
                  href={`mailto:${m.email}`}
                  className="inline-flex items-center gap-1 text-[#E85A4F] hover:underline"
                >
                  <Mail className="h-3 w-3" /> Contact
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

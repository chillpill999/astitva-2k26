"use client";

// ============================================================================
// ASTITVA 2K26 - Gallery Browser (client island)
// Path: components/gallery/GalleryBrowser.tsx
// ============================================================================

import { useMemo, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { FestGalleryItem } from "@/lib/data/fest-data";
import { GalleryModal } from "@/components/landing/GalleryModal";

interface Props {
  items: FestGalleryItem[];
}

export function GalleryBrowser({ items }: Props) {
  const [selected, setSelected] = useState<string>("all");
  const [active, setActive] = useState<FestGalleryItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const i of items) set.add(i.category);
    return ["all", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(
    () =>
      items.filter((i) =>
        selected === "all" ? true : i.category.toLowerCase() === selected.toLowerCase()
      ),
    [items, selected]
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setSelected(c)}
            className={`px-3.5 py-1.5 rounded text-xs font-mono transition-colors ${
              selected === c
                ? "bg-[#1A1918] text-[#EAE7DC] font-bold"
                : "bg-[#F6F4EE] text-[#8E8D8A] border border-[#8E8D8A]/25 hover:text-[#1A1918]"
            }`}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#8E8D8A]/25 bg-[#F6F4EE] p-10 text-center">
          <Camera className="h-8 w-8 text-[#8E8D8A] mx-auto mb-2" />
          <p className="text-base font-bold text-[#1A1918]">No items in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setActive(item);
                setModalOpen(true);
              }}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer bg-[#D8C3A5]/40 border border-[#8E8D8A]/25 shadow-sm hover:border-[#E85A4F] transition-all"
            >
              <Image
                src={item.mediaUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918]/90 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-[#E85A4F] uppercase font-bold">
                  {item.category}
                </span>
                <h4 className="text-base font-bold mt-1.5 text-white">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && active && (
        <GalleryModal
          isOpen={modalOpen}
          item={active}
          onClose={() => setModalOpen(false)}
          onNext={() => undefined}
          onPrev={() => undefined}
        />
      )}
    </>
  );
}

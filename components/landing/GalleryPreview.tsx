"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Camera, Info } from "lucide-react";
import { FestGalleryItem } from "@/lib/data/fest-data";
import { GalleryModal } from "./GalleryModal";

interface GalleryPreviewProps {
  items: FestGalleryItem[];
}

export function GalleryPreview({ items }: GalleryPreviewProps) {
  const [activeItem, setActiveItem] = useState<FestGalleryItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredItems = items;
  const featured = filteredItems.filter((i) => i.isFeatured).slice(0, 1);
  const display = featured.length > 0 ? featured : filteredItems.slice(0, 1);

  const handleOpenModal = (item: FestGalleryItem) => {
    setActiveItem(item);
    setModalOpen(true);
  };

  return (
    <section
      id="gallery"
      className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#EAE7DC] text-[#1A1918] border-b border-[#8E8D8A]/20"
    >
      <div className="container max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <Camera className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>Festival Gallery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              Festival <span className="text-[#E85A4F]">Gallery</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              Photos and videos from the festival. Highlights will be added during and after the
              event.
            </p>
          </div>

          <Link href="/gallery">
            <span className="inline-flex items-center text-xs font-mono font-semibold py-2 px-4 rounded border border-[#8E8D8A]/40 text-[#1A1918] bg-[#F6F4EE] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer">
              Full Gallery →
            </span>
          </Link>
        </div>

        {display.length === 0 ? (
          <div className="rounded-2xl border border-[#8E8D8A]/25 bg-[#F6F4EE] p-10 text-center">
            <Info className="h-8 w-8 text-[#8E8D8A] mx-auto mb-2" />
            <p className="text-base font-bold text-[#1A1918]">Gallery coming soon</p>
            <p className="text-xs text-[#8E8D8A] mt-1">
              Photos and videos from the festival will appear here as the event unfolds.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {display.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenModal(item)}
                className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer bg-[#D8C3A5]/40 border border-[#8E8D8A]/25 shadow-sm"
              >
                <Image
                  src={item.mediaUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918]/90 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-[#E85A4F] uppercase">
                    {item.category}
                  </span>
                  <h4 className="text-base font-bold mt-1.5 text-white">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && activeItem && (
        <GalleryModal
          isOpen={modalOpen}
          item={activeItem}
          onClose={() => setModalOpen(false)}
          onNext={() => undefined}
          onPrev={() => undefined}
        />
      )}
    </section>
  );
}

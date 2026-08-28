"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Sparkles,
  Maximize2,
  Filter,
} from "lucide-react";
import { STATIC_GALLERY, FestGalleryItem } from "@/lib/data/fest-data";
import { GalleryModal } from "@/components/landing/GalleryModal";

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeItem, setActiveItem] = useState<FestGalleryItem | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const items: FestGalleryItem[] = STATIC_GALLERY;

  const categories = [
    { label: "All Highlights", value: "all" },
    { label: "Sports", value: "Sports" },
    { label: "Cultural", value: "Cultural" },
    { label: "Gaming", value: "Gaming" },
    { label: "Literary", value: "Literary" },
    { label: "Ceremonies", value: "Ceremonies" },
  ];

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleOpen = (item: FestGalleryItem) => {
    setActiveItem(item);
    setModalOpen(true);
  };

  const handleNext = () => {
    if (!activeItem) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === activeItem.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setActiveItem(filteredItems[nextIndex]);
  };

  const handlePrev = () => {
    if (!activeItem) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === activeItem.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setActiveItem(filteredItems[prevIndex]);
  };

  return (
    <div className="w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="container max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#8E8D8A]/20 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <Camera className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>VISUAL REPOSITORIES &amp; ARCHIVES</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              FESTIVAL <span className="text-[#E85A4F]">GALLERY</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              High-resolution snapshots from thrilling athletic victories, theatrical stages, esports LAN arenas, and star night concerts.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/events"
              className="px-4 py-2 rounded text-xs font-mono font-bold tracking-wider uppercase bg-[#E85A4F] text-white hover:bg-[#C94A40] transition-colors shadow-sm"
            >
              JOIN 2026 ARENAS
            </Link>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3.5 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                selectedCategory === c.value
                  ? "bg-[#1A1918] text-[#EAE7DC] font-bold"
                  : "bg-[#F6F4EE] text-[#8E8D8A] border border-[#8E8D8A]/25 hover:text-[#1A1918]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpen(item)}
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
                <h4 className="text-base font-bold mt-1.5 text-white">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && activeItem && (
        <GalleryModal
          isOpen={modalOpen}
          item={activeItem}
          onClose={() => setModalOpen(false)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}

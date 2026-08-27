"use client";

// ============================================================================
// ASTITVA 2K26 - Multimedia Festival Highlights Gallery Portal
// Path: app/gallery/page.tsx
// ============================================================================

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Sparkles,
  Maximize2,
  Filter,
  ArrowRight,
  Share2,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="w-full min-h-screen bg-[#030712] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="container max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-3xl">
            <Badge variant="outline" className="px-3.5 py-1 text-xs font-mono font-semibold border-cyan-500/30 text-cyan-400 bg-cyan-950/30">
              <Camera className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
              VISUAL REPOSITORIES &amp; ARCHIVES
            </Badge>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase">
              FESTIVAL <span className="cyber-gradient-text">GALLERY</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              High-resolution snapshots from thrilling athletic victories, theatrical stages, esports LAN arenas, and star night concerts.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/events">
              <Button variant="outline" className="border-white/20 hover:border-cyan-400 text-xs font-bold">
                Join 2026 Arenas
              </Button>
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
              className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                selectedCategory === c.value
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpen(item)}
              className="group relative h-80 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl cursor-pointer transition-all duration-300 hover:border-cyan-500/50 hover:scale-[1.02]"
            >
              <Image
                src={item.mediaUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-75 group-hover:opacity-100"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Hover Zoom Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/90 text-black shadow-xl">
                  <Maximize2 className="h-7 w-7" />
                </div>
              </div>

              {/* Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <Badge variant="cyan" className="text-[10px] font-mono font-bold">
                    {item.category}
                  </Badge>
                  <span className="text-[11px] font-mono text-slate-400">
                    ASTITVA {item.year}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <GalleryModal
        item={activeItem}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}

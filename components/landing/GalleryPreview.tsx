"use client";

// ============================================================================
// ASTITVA 2K26 - Filterable Multimedia Gallery Preview
// Path: components/landing/GalleryPreview.tsx
// ============================================================================

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Camera, Sparkles, ArrowRight, Eye, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FestGalleryItem } from "@/lib/data/fest-data";
import { GalleryModal } from "./GalleryModal";

interface GalleryPreviewProps {
  items: FestGalleryItem[];
}

export function GalleryPreview({ items }: GalleryPreviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeItem, setActiveItem] = useState<FestGalleryItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const categories = [
    { label: "All Highlights", value: "all" },
    { label: "Sports", value: "Sports" },
    { label: "Cultural", value: "Cultural" },
    { label: "Gaming", value: "Gaming" },
    { label: "Ceremonies", value: "Ceremonies" },
  ];

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleOpenModal = (item: FestGalleryItem) => {
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
    <section className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#030712] border-b border-white/10">
      <div className="container max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="outline" className="px-3.5 py-1 text-xs font-mono font-semibold border-cyan-500/30 text-cyan-400 bg-cyan-950/30">
              <Camera className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
              MEMORIES &amp; MOMENTS
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
              FESTIVAL <span className="cyber-gradient-text">GALLERY</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Relive the electric atmosphere, nail-biting matches, stage performances, and victory celebrations.
            </p>
          </div>

          <Link href="/gallery">
            <Button variant="outline" className="border-white/20 hover:border-cyan-400 text-xs font-bold">
              Full Multimedia Vault <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                selectedCategory === cat.value
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.slice(0, 8).map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenModal(item)}
              className="group relative h-64 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-xl cursor-pointer transition-all duration-300 hover:border-cyan-500/50 hover:scale-[1.02]"
            >
              <Image
                src={item.mediaUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Hover Zoom Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/80 text-black shadow-lg">
                  <Maximize2 className="h-6 w-6" />
                </div>
              </div>

              {/* Caption Overlay */}
              <div className="absolute bottom-3 left-3 right-3 space-y-1">
                <Badge variant="cyan" className="text-[9px] font-mono font-bold">
                  {item.category}
                </Badge>
                <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h4>
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
    </section>
  );
}

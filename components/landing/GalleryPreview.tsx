"use client";

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
    <section id="gallery" className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#EAE7DC] text-[#1A1918] border-b border-[#8E8D8A]/20">
      <div className="container max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <Camera className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>MEMORIES &amp; HIGHLIGHTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              FESTIVAL <span className="text-[#E85A4F]">GALLERY</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              Relive the atmosphere, nail-biting matches, stage performances, and victory celebrations.
            </p>
          </div>

          <Link href="/gallery">
            <span className="inline-flex items-center text-xs font-mono font-semibold py-2 px-4 rounded border border-[#8E8D8A]/40 text-[#1A1918] bg-[#F6F4EE] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer">
              FULL VAULT →
            </span>
          </Link>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                selectedCategory === cat.value
                  ? "bg-[#1A1918] text-[#EAE7DC] font-semibold"
                  : "bg-[#F6F4EE] text-[#8E8D8A] border border-[#8E8D8A]/25 hover:text-[#1A1918]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry / Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.slice(0, 6).map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenModal(item)}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer bg-[#D8C3A5]/40 border border-[#8E8D8A]/25 shadow-sm hover:border-[#E85A4F] transition-all duration-300"
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
    </section>
  );
}

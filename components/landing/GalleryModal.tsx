"use client";

// ============================================================================
// ASTITVA 2K26 - Interactive Media Lightbox Modal (Exteta Luxury Aesthetic)
// Path: components/landing/GalleryModal.tsx
// ============================================================================

import React, { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { FestGalleryItem } from "@/lib/data/fest-data";

interface GalleryModalProps {
  item: FestGalleryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function GalleryModal({ item, isOpen, onClose, onNext, onPrev }: GalleryModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 text-[#1A1918]">
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-[#F6F4EE] border border-[#8E8D8A]/30 text-[#1A1918] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer"
        aria-label="Close Lightbox"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Navigation arrows */}
      {onPrev && (
        <button
          type="button"
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-[#F6F4EE] border border-[#8E8D8A]/30 text-[#1A1918] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer hidden sm:flex items-center justify-center"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {onNext && (
        <button
          type="button"
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-[#F6F4EE] border border-[#8E8D8A]/30 text-[#1A1918] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer hidden sm:flex items-center justify-center"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Modal Container */}
      <div className="relative max-w-4xl w-full rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/30 overflow-hidden shadow-2xl flex flex-col">
        {/* Media Preview Box */}
        <div className="relative h-[55vh] sm:h-[65vh] w-full bg-[#1A1918]">
          <Image
            src={item.mediaUrl}
            alt={item.title}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Media Caption & Tags */}
        <div className="p-6 bg-[#F6F4EE] border-t border-[#8E8D8A]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#E85A4F] uppercase border border-[#8E8D8A]/20">
                {item.category}
              </span>
              <span className="text-xs text-[#8E8D8A]">
                ASTITVA {item.year}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#1A1918] uppercase">{item.title}</h3>
            {item.description && (
              <p className="text-xs text-[#8E8D8A]">{item.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

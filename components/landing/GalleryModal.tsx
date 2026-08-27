"use client";

// ============================================================================
// ASTITVA 2K26 - Interactive Media Lightbox Modal
// Path: components/landing/GalleryModal.tsx
// ============================================================================

import React, { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Calendar, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-slate-900/80 border border-white/20 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        aria-label="Close Lightbox"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation arrows */}
      {onPrev && (
        <button
          type="button"
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-slate-900/80 border border-white/20 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer hidden sm:flex items-center justify-center"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {onNext && (
        <button
          type="button"
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-slate-900/80 border border-white/20 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer hidden sm:flex items-center justify-center"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Modal Container */}
      <div className="relative max-w-4xl w-full rounded-2xl bg-[#0d1224] border border-white/15 overflow-hidden shadow-2xl flex flex-col">
        {/* Media Preview Box */}
        <div className="relative h-[55vh] sm:h-[65vh] w-full bg-black">
          <Image
            src={item.mediaUrl}
            alt={item.title}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Media Caption & Tags */}
        <div className="p-6 bg-[#0d1224] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Badge variant="cyan" className="text-[10px] font-mono font-bold">
                {item.category}
              </Badge>
              <span className="text-xs font-mono text-slate-400">
                ASTITVA {item.year}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">{item.title}</h3>
            {item.description && (
              <p className="text-xs text-slate-300">{item.description}</p>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-white/20 text-xs shrink-0 self-end sm:self-auto"
          >
            Close View
          </Button>
        </div>
      </div>
    </div>
  );
}

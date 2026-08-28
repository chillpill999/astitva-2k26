// ============================================================================
// ASTITVA 2K26 - Public Gallery Page
// Path: app/gallery/page.tsx
// ============================================================================

import { Camera, Info } from "lucide-react";
import { getFestGallery } from "@/lib/data/fest-data";
import { GalleryBrowser } from "@/components/gallery/GalleryBrowser";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Gallery | ASTITVA 2K26",
  description: "Photos and videos from ASTITVA 2K26.",
};

export default async function GalleryPage() {
  const items = await getFestGallery();

  return (
    <div className="w-full min-h-screen bg-[#EAE7DC] text-[#1A1918] py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="container max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#8E8D8A]/20 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <Camera className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>Festival Gallery</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              Festival <span className="text-[#E85A4F]">Gallery</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              Photos and videos from the festival. New material is added as the event unfolds.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-[#8E8D8A]/25 bg-[#F6F4EE] p-10 text-center">
            <Info className="h-8 w-8 text-[#8E8D8A] mx-auto mb-2" />
            <p className="text-base font-bold text-[#1A1918]">Gallery coming soon</p>
            <p className="text-xs text-[#8E8D8A] mt-1">
              Photos and videos will appear here as the event unfolds.
            </p>
          </div>
        ) : (
          <GalleryBrowser items={items} />
        )}
      </div>
    </div>
  );
}

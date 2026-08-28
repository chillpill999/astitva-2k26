"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Music, Gamepad2, BookOpen, ArrowRight, Sparkles, Flame, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FestCategory } from "@/lib/data/fest-data";

interface CategoryPreviewProps {
  categories: FestCategory[];
}

const CATEGORY_THEMES: Record<
  string,
  {
    icon: React.ElementType;
    number: string;
    prizeTag: string;
    events: string[];
  }
> = {
  sports: {
    icon: Trophy,
    number: "01",
    prizeTag: "₹75,000+ Pool",
    events: ["Cricket", "Football", "Volleyball", "Badminton", "Chess"],
  },
  cultural: {
    icon: Music,
    number: "02",
    prizeTag: "₹72,000+ Pool",
    events: ["Solo & Group Dance", "Singing", "Standup Comedy", "Ramp Walk"],
  },
  gaming: {
    icon: Gamepad2,
    number: "03",
    prizeTag: "₹53,000+ Pool",
    events: ["BGMI Squad Battle", "Free Fire Championship"],
  },
  literary: {
    icon: BookOpen,
    number: "04",
    prizeTag: "₹36,000+ Pool",
    events: ["Parliamentary Debate", "Mega Fest Quiz", "Poetry", "Creative Writing"],
  },
};

export function CategoryPreviewGrid({ categories }: CategoryPreviewProps) {
  return (
    <section id="categories" className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#EAE7DC] text-[#1A1918] border-b border-[#8E8D8A]/20">
      <div className="container max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-[#8E8D8A]/30 bg-[#F6F4EE] text-[11px] font-mono tracking-widest text-[#8E8D8A] uppercase">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[#E85A4F]" />
              <span>THE 4 ARENAS OF EXCELLENCE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1918] uppercase">
              FESTIVAL <span className="text-[#E85A4F]">CATEGORIES</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8E8D8A]">
              Select an arena to explore tournament rulebooks, venues, team limits, and prize allocations.
            </p>
          </div>

          <Link href="/events">
            <span className="inline-flex items-center text-xs font-mono font-semibold py-2 px-4 rounded border border-[#8E8D8A]/40 text-[#1A1918] bg-[#F6F4EE] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all cursor-pointer">
              ALL 16 TOURNAMENTS →
            </span>
          </Link>
        </div>

        {/* 4 Luxury Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const theme = CATEGORY_THEMES[category.slug.toLowerCase()] || CATEGORY_THEMES.sports;
            const Icon = theme.icon;

            return (
              <Link
                key={category.id}
                href={`/events?category=${category.slug}`}
                className="group block"
              >
                <div className="relative flex flex-col justify-between h-full p-6 sm:p-7 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm hover:border-[#E85A4F] transition-all duration-300 hover:-translate-y-1.5">
                  <div className="space-y-4">
                    {/* Top Index & Icon */}
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded border border-[#8E8D8A]/25 bg-[#EAE7DC] flex items-center justify-center text-[#E85A4F] group-hover:bg-[#E85A4F] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xl font-bold text-[#D8C3A5] group-hover:text-[#E85A4F] transition-colors">
                        {theme.number}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-[#1A1918] tracking-tight group-hover:text-[#E85A4F] transition-colors uppercase">
                        {category.name}
                      </h3>
                      <p className="text-xs font-mono text-[#E85A4F] font-semibold mt-0.5">
                        {theme.prizeTag}
                      </p>
                    </div>

                    <p className="text-xs text-[#8E8D8A] leading-relaxed line-clamp-2">
                      {category.description}
                    </p>

                    {/* Featured Events Pill List */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {theme.events.slice(0, 3).map((eventName, eIdx) => (
                        <span
                          key={eIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EAE7DC] border border-[#8E8D8A]/20 text-[#1A1918]"
                        >
                          {eventName}
                        </span>
                      ))}
                      {theme.events.length > 3 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EAE7DC] text-[#8E8D8A]">
                          +{theme.events.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-5 border-t border-[#8E8D8A]/15 mt-5 flex items-center justify-between text-xs font-mono font-semibold text-[#1A1918] group-hover:text-[#E85A4F]">
                    <span>BROWSE ARENA</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#E85A4F]" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

// ============================================================================
// ASTITVA 2K26 - 4-Pillar Category Preview Cards Grid
// Path: components/landing/CategoryPreviewGrid.tsx
// ============================================================================

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
    badgeVariant: "amber" | "purple" | "cyan" | "emerald";
    accentColor: string;
    borderGlow: string;
    prizeTag: string;
    gradient: string;
  }
> = {
  sports: {
    icon: Trophy,
    badgeVariant: "amber",
    accentColor: "text-amber-400",
    borderGlow: "group-hover:border-amber-500/50 group-hover:shadow-amber-500/10",
    prizeTag: "₹75,000+ Pool",
    gradient: "from-amber-500/20 via-transparent to-transparent",
  },
  cultural: {
    icon: Music,
    badgeVariant: "purple",
    accentColor: "text-purple-400",
    borderGlow: "group-hover:border-purple-500/50 group-hover:shadow-purple-500/10",
    prizeTag: "₹72,000+ Pool",
    gradient: "from-purple-500/20 via-transparent to-transparent",
  },
  gaming: {
    icon: Gamepad2,
    badgeVariant: "cyan",
    accentColor: "text-cyan-400",
    borderGlow: "group-hover:border-cyan-500/50 group-hover:shadow-cyan-500/10",
    prizeTag: "₹53,000+ Pool",
    gradient: "from-cyan-500/20 via-transparent to-transparent",
  },
  literary: {
    icon: BookOpen,
    badgeVariant: "emerald",
    accentColor: "text-emerald-400",
    borderGlow: "group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/10",
    prizeTag: "₹36,000+ Pool",
    gradient: "from-emerald-500/20 via-transparent to-transparent",
  },
};

export function CategoryPreviewGrid({ categories }: CategoryPreviewProps) {
  return (
    <section className="w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#030712] border-b border-white/10">
      <div className="container max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="outline" className="px-3.5 py-1 text-xs font-mono font-semibold border-cyan-500/30 text-cyan-400 bg-cyan-950/30">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
              THE 4 PILLARS OF EXCELLENCE
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
              EXPLORE FESTIVAL <span className="cyber-gradient-text">ARENAS</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Select an arena to browse tournament rules, venue locations, team size constraints, and prize pools.
            </p>
          </div>

          <Link href="/events">
            <Badge variant="outline" className="text-xs font-mono py-2 px-4 border-white/20 text-slate-300 hover:border-cyan-400 hover:text-white transition-all cursor-pointer">
              View All 16 Tournaments →
            </Badge>
          </Link>
        </div>

        {/* 4 Cards Grid */}
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
                <div
                  className={`h-full relative overflow-hidden rounded-2xl bg-[#0d1224]/90 border border-white/10 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 ${theme.borderGlow} flex flex-col justify-between`}
                >
                  {/* Top Image Preview Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                    {category.coverImage ? (
                      <Image
                        src={category.coverImage}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-80"
                      />
                    ) : (
                      <div className="h-full w-full bg-slate-900" />
                    )}
                    {/* Gradient Fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1224] via-[#0d1224]/40 to-transparent" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950/80 border border-white/15 backdrop-blur-md">
                        <Icon className={`h-4.5 w-4.5 ${theme.accentColor}`} />
                      </div>
                      <Badge variant={theme.badgeVariant} className="text-[10px] font-mono font-bold">
                        {theme.prizeTag}
                      </Badge>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                          {category.name} Arena
                        </h3>
                        <span className="text-[11px] font-mono text-slate-400 font-bold">
                          {category.eventCount || (category.slug === "sports" ? 5 : category.slug === "gaming" ? 3 : 4)} Events
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {category.description}
                      </p>
                    </div>

                    {/* Card Footer CTA */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">
                      <span>Enter Arena</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
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

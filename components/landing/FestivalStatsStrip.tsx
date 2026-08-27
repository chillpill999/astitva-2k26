"use client";

// ============================================================================
// ASTITVA 2K26 - Bento Pill Festival Statistics Strip
// Path: components/landing/FestivalStatsStrip.tsx
// ============================================================================

import React from "react";
import { Trophy, Flame, Layers, Users, Calendar, Coins } from "lucide-react";

interface FestivalStatsProps {
  stats?: {
    totalEvents: number;
    totalPrizePool: number;
    totalCategories: number;
    totalDays: number;
    totalParticipants: number;
  };
}

export function FestivalStatsStrip({ stats }: FestivalStatsProps) {
  const metricItems = [
    {
      icon: Coins,
      value: stats?.totalPrizePool ? `₹${(stats.totalPrizePool / 100000).toFixed(1)}L+` : "₹1.5L+",
      label: "TOTAL CASH PRIZES",
      detail: "Rolling Shields & Medals",
      color: "text-amber-400",
      bgGlow: "group-hover:border-amber-500/40",
      iconBg: "bg-amber-500/10 text-amber-400",
    },
    {
      icon: Trophy,
      value: stats?.totalEvents ? `${stats.totalEvents}+` : "16+",
      label: "TOURNAMENTS",
      detail: "Sports, Gaming & Stage",
      color: "text-cyan-400",
      bgGlow: "group-hover:border-cyan-500/40",
      iconBg: "bg-cyan-500/10 text-cyan-400",
    },
    {
      icon: Layers,
      value: "4 PILLARS",
      label: "COMPETITIVE STREAMS",
      detail: "Sports, Cultural, Gaming, Lit",
      color: "text-purple-400",
      bgGlow: "group-hover:border-purple-500/40",
      iconBg: "bg-purple-500/10 text-purple-400",
    },
    {
      icon: Users,
      value: "2,500+",
      label: "COLLEGIATE ATHLETES",
      detail: "5 Engineering Branches",
      color: "text-emerald-400",
      bgGlow: "group-hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/10 text-emerald-400",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {metricItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`group relative flex items-center space-x-3.5 sm:space-x-4 p-4 sm:p-5 rounded-2xl bg-[#0d1224]/90 border border-white/10 shadow-xl backdrop-blur-xl transition-all duration-300 ${item.bgGlow} hover:-translate-y-0.5 hover:shadow-cyan-500/10`}
            >
              {/* Icon Capsule */}
              <div className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl ${item.iconBg} border border-white/10 group-hover:scale-110 transition-transform`}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>

              {/* Metric Text */}
              <div className="flex flex-col min-w-0">
                <span className={`font-mono text-xl sm:text-2xl lg:text-3xl font-black tracking-tight ${item.color}`}>
                  {item.value}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide truncate">
                  {item.label}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                  {item.detail}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

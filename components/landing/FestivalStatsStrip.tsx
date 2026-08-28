"use client";

import React from "react";
import { Trophy, Award, Layers, Users, ShieldCheck } from "lucide-react";

interface FestivalStatsProps {
  stats?: {
    totalEvents: number;
    totalPrizePool: number;
    totalCategories: number;
    totalDays: number;
    totalParticipants: number;
  };
}

function formatInr(n: number) {
  if (n === 0) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function FestivalStatsStrip({ stats }: FestivalStatsProps) {
  const s = stats ?? {
    totalEvents: 0,
    totalPrizePool: 0,
    totalCategories: 0,
    totalDays: 5,
    totalParticipants: 0,
  };

  const metricItems = [
    {
      icon: Trophy,
      value: s.totalEvents > 0 ? `${s.totalEvents}` : "—",
      label: "EVENTS PUBLISHED",
      detail: "Sports, Cultural, Gaming, Lit",
      color: "text-[#E85A4F]",
      borderHover: "hover:border-[#E85A4F]",
    },
    {
      icon: Award,
      value: formatInr(s.totalPrizePool),
      label: "TOTAL PRIZE POOL",
      detail: "From published events",
      color: "text-[#1A1918]",
      borderHover: "hover:border-[#1A1918]",
    },
    {
      icon: Layers,
      value: s.totalCategories > 0 ? `${s.totalCategories}` : "—",
      label: "CATEGORIES",
      detail: "Sports · Cultural · Gaming · Lit",
      color: "text-[#1A1918]",
      borderHover: "hover:border-[#E85A4F]",
    },
    {
      icon: Users,
      value: s.totalParticipants > 0 ? `${s.totalParticipants}` : "—",
      label: "REGISTERED",
      detail: "Profiles in the database",
      color: "text-[#E85A4F]",
      borderHover: "hover:border-[#E85A4F]",
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
              className={`group relative flex items-center space-x-3.5 sm:space-x-4 p-4 sm:p-5 rounded-2xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm transition-all duration-300 ${item.borderHover} hover:-translate-y-0.5 hover:shadow-md`}
            >
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/20 text-[#E85A4F] group-hover:scale-105 transition-transform">
                <Icon className="h-5 w-5 sm:h-6 sm:h-6" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`font-mono text-lg sm:text-xl lg:text-2xl font-black tracking-tight ${item.color}`}>
                  {item.value}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[#1A1918] tracking-wide truncate uppercase">
                  {item.label}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#8E8D8A] truncate font-mono">
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

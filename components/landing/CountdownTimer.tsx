"use client";

// ============================================================================
// ASTITVA 2K26 - Hydration-Safe Live Countdown Timer
// Path: components/landing/CountdownTimer.tsx
// ============================================================================

import React, { useState, useEffect } from "react";
import { Sparkles, Flame, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Target Festival Opening Timestamp: 4 September 2026 09:00:00 AM IST
const FEST_TARGET_DATE_STR = "2026-09-04T09:00:00+05:30";

interface TimeUnits {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
}

export function CountdownTimer() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeUnits>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLive: false,
  });

  useEffect(() => {
    setMounted(true);
    const targetTimestamp = new Date(FEST_TARGET_DATE_STR).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetTimestamp - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isLive: true,
        });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          isLive: false,
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeCards = [
    { label: "DAYS", value: timeLeft.days, color: "text-cyan-400", border: "hover:border-cyan-500/50" },
    { label: "HOURS", value: timeLeft.hours, color: "text-purple-400", border: "hover:border-purple-500/50" },
    { label: "MINUTES", value: timeLeft.minutes, color: "text-blue-400", border: "hover:border-blue-500/50" },
    { label: "SECONDS", value: timeLeft.seconds, color: "text-amber-400", border: "hover:border-amber-500/50" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* Live Badge Status */}
      <div className="mb-4 flex items-center justify-center">
        {mounted && timeLeft.isLive ? (
          <div className="inline-flex items-center space-x-2 rounded-full border border-red-500/40 bg-red-950/60 px-4 py-1.5 backdrop-blur-md shadow-lg shadow-red-500/20 animate-pulse">
            <span className="flex h-2.5 w-2.5 rounded-full bg-red-400 animate-ping" />
            <span className="text-xs font-black tracking-widest text-red-300 uppercase">
              🔥 FESTIVAL IS LIVE NOW AT LNJPIT!
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-slate-900/80 px-4 py-1 backdrop-blur-md">
            <Clock className="h-3.5 w-3.5 text-cyan-400 animate-spin-slow" />
            <span className="text-xs font-mono font-medium tracking-wide text-cyan-300">
              OFFICIAL COUNTDOWN TO KICKOFF
            </span>
          </div>
        )}
      </div>

      {/* 4-Digit Glass Bento Matrix */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 w-full">
        {timeCards.map((card, idx) => (
          <div
            key={idx}
            className={`relative group flex flex-col items-center justify-center py-4 sm:py-6 px-2 sm:px-4 rounded-2xl bg-[#0d1224]/80 border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300 ${card.border} hover:scale-[1.02] hover:bg-[#141c38]/90`}
          >
            {/* Top Accent Glow Bar */}
            <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent group-hover:via-cyan-400 transition-all" />

            {/* Digit */}
            <span className={`font-mono text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white ${card.color} drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]`}>
              {mounted
                ? String(card.value).padStart(2, "0")
                : "--"}
            </span>

            {/* Sub-label */}
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mt-1.5 sm:mt-2">
              {card.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

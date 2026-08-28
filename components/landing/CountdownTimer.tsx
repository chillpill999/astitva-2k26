"use client";

// ============================================================================
// ASTITVA 2K26 - Hydration-Safe Live Countdown Timer (Exteta Luxury Aesthetic)
// Path: components/landing/CountdownTimer.tsx
// ============================================================================

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

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
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-[#1A1918]">
      {/* Live Badge Status */}
      <div className="mb-4 flex items-center justify-center">
        {mounted && timeLeft.isLive ? (
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#E85A4F]/40 bg-[#F6F4EE] px-4 py-1.5 shadow-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#E85A4F] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#E85A4F] uppercase">
              🔥 FESTIVAL IS LIVE NOW AT LNJPIT!
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#8E8D8A]/25 bg-[#F6F4EE] px-4 py-1">
            <Clock className="h-3.5 w-3.5 text-[#E85A4F]" />
            <span className="text-xs font-mono font-bold tracking-wide text-[#1A1918] uppercase">
              OFFICIAL COUNTDOWN TO KICKOFF
            </span>
          </div>
        )}
      </div>

      {/* 4-Digit Bento Matrix */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 w-full">
        {timeCards.map((card, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center py-4 sm:py-6 px-2 sm:px-4 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm transition-all duration-300 hover:border-[#E85A4F]"
          >
            {/* Digit */}
            <span className="font-mono text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#1A1918]">
              {mounted ? String(card.value).padStart(2, "0") : "--"}
            </span>

            {/* Sub-label */}
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#8E8D8A] uppercase mt-1 sm:mt-2">
              {card.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

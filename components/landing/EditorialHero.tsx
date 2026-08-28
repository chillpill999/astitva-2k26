"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Sparkles, Grid, Shield, Trophy, Users, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EditorialHero() {
  const [activeSwatch, setActiveSwatch] = useState<string>("#E85A4F");
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Parallax Mouse Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), springConfig);
  const glareX = useSpring(useTransform(mouseX, [-300, 300], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [-300, 300], [0, 100]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Swatch colors matching exact reference image
  const swatches = [
    { hex: "#EAE7DC", name: "Alabaster Cream", label: "Overview", link: "#about" },
    { hex: "#D8C3A5", name: "Champagne Sand", label: "Categories", link: "#categories" },
    { hex: "#8E8D8A", name: "Mineral Slate", label: "Schedule", link: "#schedule" },
    { hex: "#E98074", name: "Coral Rose", label: "Prize Pool", link: "#prizes" },
    { hex: "#E85A4F", name: "Crimson Terracotta", label: "Register", link: "#register" },
  ];

  return (
    <section className="relative w-full min-h-[92vh] lg:min-h-screen bg-[#EAE7DC] text-[#1A1918] flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-hidden select-none">
      {/* ----------------------------------------------------------------- */}
      {/* MAIN EDITORIAL FRAME CONTAINER (Matches Reference Image Card)     */}
      {/* ----------------------------------------------------------------- */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-full flex-1 rounded-[1.75rem] sm:rounded-[2.5rem] bg-[#EAE7DC] border border-[#8E8D8A]/25 shadow-[0_20px_60px_-15px_rgba(142,141,138,0.25)] flex flex-col justify-between overflow-hidden"
      >
        {/* Subtle Ambient Architectural Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(142, 141, 138, 0.2) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* --------------------------------------------------------------- */}
        {/* TOP EDITORIAL NAV BAR (Exteta Style)                            */}
        {/* --------------------------------------------------------------- */}
        <div className="relative z-30 flex items-center justify-between px-6 sm:px-10 pt-6 sm:pt-8">
          {/* Top Left Outlined Minimalist Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="#about"
              className="px-3.5 py-1.5 rounded text-[11px] sm:text-xs font-mono font-medium tracking-wider uppercase border border-[#8E8D8A]/35 text-[#1A1918] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all duration-300"
            >
              ABOUT US
            </Link>
            <Link
              href="#events"
              className="px-3.5 py-1.5 rounded text-[11px] sm:text-xs font-mono font-medium tracking-wider uppercase border border-[#8E8D8A]/35 text-[#1A1918] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all duration-300"
            >
              EVENTS
            </Link>
            <Link
              href="#schedule"
              className="hidden md:inline-block px-3.5 py-1.5 rounded text-[11px] sm:text-xs font-mono font-medium tracking-wider uppercase border border-[#8E8D8A]/35 text-[#1A1918] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all duration-300"
            >
              SCHEDULE
            </Link>
          </div>

          {/* Top Center Tracked Brand Mark */}
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="group">
              <span className="font-mono text-sm sm:text-base tracking-[0.35em] sm:tracking-[0.45em] font-bold text-[#1A1918] group-hover:text-[#E85A4F] transition-colors uppercase">
                A S T I T V A
              </span>
              <span className="block text-[8px] sm:text-[9px] font-mono tracking-[0.25em] text-[#8E8D8A] uppercase mt-0.5">
                LNJPIT CHAPRA · 2026
              </span>
            </Link>
          </div>

          {/* Top Right Grid Icon / CTA */}
          <div className="flex items-center space-x-3">
            <Link
              href="/events"
              className="hidden sm:flex items-center space-x-1.5 px-4 py-1.5 rounded text-xs font-mono font-medium tracking-wider uppercase bg-[#E85A4F] text-white hover:bg-[#C94A40] transition-colors shadow-sm"
            >
              <span>EXPLORE</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href="/dashboard"
              className="w-8 h-8 rounded border border-[#8E8D8A]/35 flex items-center justify-center text-[#8E8D8A] hover:text-[#1A1918] hover:border-[#1A1918] transition-colors"
              title="Dashboard Menu"
            >
              <Grid className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* CENTERPIECE: RADIAL CHRONOGRAPH DIAL + 3D LOGO EMBLEM           */}
        {/* --------------------------------------------------------------- */}
        <div className="relative z-20 flex-1 flex items-center justify-center my-4 sm:my-0">
          {/* 1. Large Ghost Watermark Year (2026) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <span
              className="text-[18vw] sm:text-[22vw] lg:text-[18rem] font-bold tracking-tight text-[#D8C3A5]/45 leading-none"
              style={{
                fontFamily: "var(--font-sans, Inter, sans-serif)",
                letterSpacing: "-0.04em",
              }}
            >
              2026
            </span>
          </div>

          {/* 2. Precision Radial Chronograph Gauge (Exact Reference Dial) */}
          <div className="absolute w-[300px] h-[300px] sm:w-[480px] sm:h-[480px] lg:w-[580px] lg:h-[580px] rounded-full pointer-events-none z-10 flex items-center justify-center">
            {/* SVG Calibrated Dial Circle */}
            <svg
              className="w-full h-full animate-[spin_120s_linear_infinite]"
              viewBox="0 0 600 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Center Reference Circle */}
              <circle
                cx="300"
                cy="300"
                r="260"
                stroke="#8E8D8A"
                strokeOpacity="0.2"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* 360-Degree Radial Tick Marks */}
              {Array.from({ length: 120 }).map((_, index) => {
                const angle = (index * 360) / 120;
                const isMajor = index % 10 === 0;
                const isMedium = index % 5 === 0;
                const length = isMajor ? 16 : isMedium ? 10 : 5;
                const strokeColor = isMajor ? "#E85A4F" : isMedium ? "#E98074" : "#8E8D8A";
                const strokeWidth = isMajor ? 1.5 : 0.8;
                const strokeOpacity = isMajor ? 0.9 : 0.45;

                return (
                  <line
                    key={index}
                    x1="300"
                    y1={300 - 260}
                    x2="300"
                    y2={300 - 260 + length}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeOpacity={strokeOpacity}
                    transform={`rotate(${angle} 300 300)`}
                  />
                );
              })}

              {/* Precision Dot Indicators at Cardinal Points */}
              <circle cx="300" cy="40" r="3" fill="#E85A4F" />
              <circle cx="560" cy="300" r="3" fill="#E85A4F" />
              <circle cx="300" cy="560" r="3" fill="#E85A4F" />
              <circle cx="40" cy="300" r="3" fill="#E85A4F" />
            </svg>

            {/* Small Orbiting Compass Accent */}
            <div className="absolute right-[8%] top-[45%] w-3 h-3 rounded-full border border-[#E85A4F] flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-[#E85A4F]" />
            </div>
          </div>

          {/* 3. Interactive 3D Official Astitva Metallic Logo Showcase */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative z-20 flex flex-col items-center text-center px-4 max-w-2xl cursor-pointer"
          >
            {/* Subtle Divine Tilak / Flame Glow Behind Logo */}
            <div className="absolute -top-12 w-44 h-44 rounded-full bg-[#E85A4F]/20 blur-3xl pointer-events-none -z-10 animate-pulse" />

            {/* Official Metallic Logo Image with 3D Pop */}
            <motion.div
              style={{ transform: "translateZ(40px)" }}
              className="relative w-[280px] sm:w-[440px] lg:w-[540px] h-[100px] sm:h-[150px] lg:h-[185px] filter drop-shadow-[0_15px_30px_rgba(232,90,79,0.3)] transition-transform duration-300"
            >
              <Image
                src="/images/astitva-logo-3d.png"
                alt="ASTITVA 2K26 Official Emblem"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 320px, (max-width: 1200px) 500px, 600px"
              />
            </motion.div>

            {/* Editorial Subtitle & Coordinates */}
            <motion.div
              style={{ transform: "translateZ(25px)" }}
              className="mt-3 sm:mt-5 space-y-2"
            >
              <p className="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-[#1A1918] font-semibold uppercase">
                WHERE SPORTS, TALENT &amp; CREATIVITY UNITE
              </p>
              <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.18em] text-[#8E8D8A] uppercase">
                LOCUS SOLUS, GAE AULENTI 1964 · LNJPIT CHAPRA 2026
              </p>
              <p className="text-[10px] font-mono text-[#E85A4F] tracking-[0.15em] font-medium pt-1">
                4 SEPTEMBER – 8 SEPTEMBER 2026
              </p>
            </motion.div>

            {/* Minimalist Micro Arrow Indicator */}
            <motion.div
              style={{ transform: "translateZ(30px)" }}
              className="mt-4 flex items-center justify-center"
            >
              <Link
                href="#events"
                className="w-7 h-7 rounded-full border border-[#E85A4F]/60 flex items-center justify-center text-[#E85A4F] hover:bg-[#E85A4F] hover:text-white transition-all duration-300 group"
              >
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* BOTTOM EDITORIAL FOOTER BAR (Exteta Style)                      */}
        {/* --------------------------------------------------------------- */}
        <div className="relative z-30 flex flex-col sm:flex-row items-center justify-between px-6 sm:px-10 pb-6 sm:pb-8 text-[10px] sm:text-[11px] font-mono text-[#8E8D8A] gap-3">
          {/* Bottom Left Platform Status & Cookies Notice */}
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#E85A4F] animate-ping" />
            <span className="text-[#1A1918] font-medium">OFFICIAL FESTIVAL PORTAL</span>
            <span className="text-[#8E8D8A]/50">•</span>
            <span className="hidden sm:inline">LNJPIT CHAPRA, BIHAR</span>
          </div>

          {/* Bottom Center Quick Category Anchors */}
          <div className="hidden lg:flex items-center space-x-6 text-[#1A1918] uppercase tracking-wider font-semibold">
            <Link href="/events?category=sports" className="hover:text-[#E85A4F] transition-colors">
              CRICKET · FOOTBALL · CHESS
            </Link>
            <span className="text-[#8E8D8A]/40">•</span>
            <Link href="/events?category=cultural" className="hover:text-[#E85A4F] transition-colors">
              DANCE · MUSIC · DRAMA
            </Link>
            <span className="text-[#8E8D8A]/40">•</span>
            <Link href="/events?category=gaming" className="hover:text-[#E85A4F] transition-colors">
              BGMI · FREE FIRE
            </Link>
          </div>

          {/* Bottom Right Credits & Links */}
          <div className="flex items-center space-x-3 tracking-wider">
            <Link href="#about" className="hover:text-[#E85A4F] transition-colors">
              CREDITS
            </Link>
            <span>©</span>
            <span className="text-[#1A1918] font-semibold">ASTITVA LNJPIT</span>
            <span className="text-[#8E8D8A]/50">·</span>
            <span>SEPT 4-8</span>
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* RIGHT-SIDE SIGNATURE PALETTE SWATCH STRIP (Exact Reference)     */}
        {/* --------------------------------------------------------------- */}
        <div className="hidden xl:flex absolute top-0 right-0 bottom-0 w-44 z-40 flex-col border-l border-[#8E8D8A]/30 divide-y divide-[#8E8D8A]/20">
          {swatches.map((swatch, idx) => (
            <Link
              key={idx}
              href={swatch.link}
              onMouseEnter={() => setActiveSwatch(swatch.hex)}
              className="flex-1 flex flex-col justify-center px-4 transition-all duration-300 relative group cursor-pointer"
              style={{
                backgroundColor: swatch.hex,
              }}
            >
              {/* Hex Code Label (Reference Aesthetic) */}
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-xs font-bold tracking-wider"
                  style={{
                    color:
                      swatch.hex === "#1A1918" || swatch.hex === "#E85A4F" || swatch.hex === "#8E8D8A"
                        ? "#FFFFFF"
                        : "#1A1918",
                  }}
                >
                  {swatch.hex}
                </span>
                <span
                  className="text-[10px] font-mono uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    color:
                      swatch.hex === "#1A1918" || swatch.hex === "#E85A4F" || swatch.hex === "#8E8D8A"
                        ? "#FFFFFF"
                        : "#1A1918",
                  }}
                >
                  →
                </span>
              </div>
              {/* Section Sublabel */}
              <span
                className="text-[9px] font-mono tracking-widest uppercase mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity"
                style={{
                  color:
                    swatch.hex === "#1A1918" || swatch.hex === "#E85A4F" || swatch.hex === "#8E8D8A"
                      ? "rgba(255,255,255,0.85)"
                      : "rgba(26,25,24,0.75)",
                }}
              >
                {swatch.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

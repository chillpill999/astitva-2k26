// ============================================================================
// ASTITVA 2K26 - Holographic 3D Festival ID Pass Card
// Path: components/profile/ProfileCard.tsx
// ============================================================================

"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Copy,
  Check,
  QrCode,
  Sparkles,
  Share2,
  RotateCw,
  Building,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BRANCH_METADATA, ParticipantPassData } from "@/lib/profile/schema";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface ProfileCardProps {
  passData: ParticipantPassData;
}

export function ProfileCard({ passData }: ProfileCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Physics via Framer Motion Springs
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  const glareOpacity = useTransform(mouseXSpring, [-0.5, 0, 0.5], [0.3, 0, 0.3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(passData.participantId);
    setCopied(true);
    toast.success("Participant ID copied to clipboard!", {
      description: passData.participantId,
    });
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#06b6d4", "#8b5cf6", "#f59e0b"],
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: `ASTITVA 2K26 Festival Pass - ${passData.fullName}`,
      text: `Check out my official ASTITVA 2K26 Pass (${passData.participantId}) for LNJPIT Chapra Mega Fest!`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Share cancelled
      }
    } else {
      handleCopyId();
    }
  };

  const branchMeta = BRANCH_METADATA[passData.branch] || BRANCH_METADATA.OTHER;

  return (
    <div className="w-full max-w-md mx-auto perspective-1000 flex flex-col items-center">
      {/* 3D Motion Wrapper */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 180 : rotateY,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative w-full rounded-2xl p-0.5 shadow-2xl transition-shadow duration-300"
      >
        {/* Animated Cyber Holographic Border */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-amber-500 opacity-70 blur-sm group-hover:opacity-100 transition duration-1000 animate-pulse-glow" />

        {/* Card Face (Level 2 Glass Surface) */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-slate-950/90 backdrop-blur-2xl border border-white/15 p-6 shadow-2xl">
          {/* Dynamic Glare Overlay */}
          <motion.div
            style={{ opacity: glareOpacity }}
            className="pointer-events-none absolute -inset-full bg-gradient-to-tr from-transparent via-white/10 to-transparent transform rotate-45 transition-opacity"
          />

          {!isFlipped ? (
            /* FRONT FACE: Holographic ID Badge */
            <div className="flex flex-col space-y-5">
              {/* Header: Logo, LNJPIT Title & Hologram Tag */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-purple-600 to-amber-500 p-0.5 shadow-lg shadow-cyan-500/30">
                    <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                      <Sparkles className="h-5 w-5 text-cyan-400" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-black tracking-wider text-white text-base">
                        ASTITVA <span className="text-cyan-400">2K26</span>
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">
                      LNJPIT Chapra • 4–8 Sept 2026
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <Badge variant="outline" className="text-[10px] font-mono border-cyan-500/40 text-cyan-300 bg-cyan-500/10">
                    PASS 2026
                  </Badge>
                  <span className="text-[9px] text-slate-500 font-mono mt-1">OFFICIAL BADGE</span>
                </div>
              </div>

              {/* Central Identity Row */}
              <div className="flex items-center space-x-4">
                {/* Avatar with Branch Glow Ring */}
                <div className="relative group flex-shrink-0">
                  <div
                    className="absolute -inset-1 rounded-full blur-sm opacity-80"
                    style={{ backgroundColor: branchMeta.color }}
                  />
                  <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-white/30 bg-slate-900 flex items-center justify-center">
                    {passData.avatarUrl ? (
                      <Image
                        src={passData.avatarUrl}
                        alt={passData.fullName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-2xl font-black text-white bg-gradient-to-br from-cyan-600 to-purple-700 h-full w-full flex items-center justify-center">
                        {passData.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center" title="Verified LNJPIT Student">
                    <Check className="h-3 w-3 text-slate-950 font-bold" />
                  </div>
                </div>

                {/* Name, AST26 ID & Badges */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-extrabold text-white truncate tracking-tight">
                    {passData.fullName}
                  </h3>

                  {/* AST26-XXXX ID in JetBrains Mono */}
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="font-mono text-base font-black text-cyan-400 tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      {passData.participantId}
                    </span>
                    <button
                      onClick={handleCopyId}
                      className="p-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Copy Participant ID"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Role & Branch Badges */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant="purple" className="text-[10px] py-0 px-2 font-semibold">
                      {passData.role.replace("_", " ")}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] py-0 px-2 font-semibold ${branchMeta.badgeClass}`}
                    >
                      {branchMeta.code}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Student Metadata Strip */}
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-900/80 border border-white/5 p-2.5 text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Roll No</span>
                  <span className="text-xs font-bold text-white truncate block">
                    {passData.collegeId || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Semester</span>
                  <span className="text-xs font-bold text-cyan-300 block">
                    Sem {passData.semester}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">T-Shirt</span>
                  <span className="text-xs font-bold text-amber-400 block">
                    {passData.tshirtSize}
                  </span>
                </div>
              </div>

              {/* QR Pass Matrix & Verification Strip */}
              <div className="flex items-center justify-between rounded-xl bg-slate-900/90 border border-cyan-500/20 p-3">
                <div className="flex items-center space-x-3">
                  <div className="relative h-16 w-16 rounded-lg bg-slate-950 p-1 border border-cyan-500/40 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {passData.qrCodeDataUrl ? (
                      <Image
                        src={passData.qrCodeDataUrl}
                        alt="QR Pass"
                        width={60}
                        height={60}
                        className="rounded"
                      />
                    ) : (
                      <QrCode className="h-10 w-10 text-cyan-400" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white flex items-center">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 mr-1" />
                      Encrypted Gate Pass
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Scan at Volunteer Desk
                    </span>
                    <span className="text-[9px] font-mono text-cyan-400/80 mt-0.5">
                      {passData.registeredEventsCount} Tournaments Registered
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFlipped(true)}
                  className="text-xs text-slate-400 hover:text-cyan-400"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            /* BACK FACE: Campus Details & Security Watermark */
            <div className="flex flex-col space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center">
                  <Building className="h-4 w-4 text-cyan-400 mr-1.5" />
                  Campus & Pass Details
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFlipped(false)}
                  className="text-xs text-slate-400 hover:text-cyan-400 p-1"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-400">Institution:</span>
                  <span className="font-semibold text-white">{passData.collegeName}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-semibold text-cyan-300">{branchMeta.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-400">Residence:</span>
                  <span className="font-semibold text-white">
                    {passData.isHosteler
                      ? `${passData.hostelName || "Hostel"} (${passData.roomNumber || "Room N/A"})`
                      : "Day Scholar"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-mono text-white">{passData.phone}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-400">Fest Dates:</span>
                  <span className="font-semibold text-amber-400">4 – 8 September 2026</span>
                </div>
              </div>

              {/* Security Hash Watermark */}
              <div className="rounded-lg bg-slate-900 p-2.5 border border-white/5 text-[10px] font-mono text-slate-400">
                <span className="block text-slate-500 uppercase text-[9px]">Tamper Proof Hash</span>
                <span className="break-all text-cyan-400/70">
                  {passData.qrPassToken?.slice(0, 48) || "HMAC-SHA256-VERIFIED"}...
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Card Action Controls */}
      <div className="mt-4 flex items-center space-x-3 w-full">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex-1 border-white/10 text-xs font-semibold text-slate-300 hover:text-white"
        >
          <RotateCw className="mr-1.5 h-3.5 w-3.5" />
          {isFlipped ? "Show Front" : "Flip Card"}
        </Button>
        <Button
          variant="neonCyan"
          size="sm"
          onClick={handleShare}
          className="flex-1 text-xs font-bold"
        >
          <Share2 className="mr-1.5 h-3.5 w-3.5" />
          Share Pass
        </Button>
      </div>
    </div>
  );
}

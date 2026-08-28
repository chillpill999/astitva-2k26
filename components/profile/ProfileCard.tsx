// ============================================================================
// ASTITVA 2K26 - Holographic Luxury Festival ID Pass Card (Exteta Aesthetic)
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

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

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
      colors: ["#E85A4F", "#E98074", "#D8C3A5"],
    });
    setTimeout(() => setCopied(false), 2000);
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
        className="relative w-full rounded-3xl p-1 shadow-xl transition-shadow duration-300"
      >
        {/* Card Face */}
        <div className="relative w-full overflow-hidden rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/30 p-6 sm:p-7 shadow-lg text-[#1A1918]">
          {!isFlipped ? (
            /* FRONT FACE: Luxury Editorial ID Badge */
            <div className="flex flex-col space-y-5">
              {/* Header: Logo, LNJPIT Title & Hologram Tag */}
              <div className="flex items-start justify-between border-b border-[#8E8D8A]/20 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAE7DC] border border-[#8E8D8A]/30 p-1">
                    <span className="font-mono font-bold text-xs text-[#E85A4F]">AST</span>
                  </div>
                  <div>
                    <span className="font-mono font-bold tracking-[0.25em] text-[#1A1918] text-sm uppercase">
                      ASTITVA <span className="text-[#E85A4F]">2K26</span>
                    </span>
                    <p className="text-[9px] font-mono text-[#8E8D8A] tracking-wider uppercase">
                      LNJPIT Chapra • 4–8 Sept 2026
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] border border-[#8E8D8A]/25 text-[#E85A4F] uppercase">
                    OFFICIAL PASS
                  </span>
                  <span className="text-[8px] text-[#8E8D8A] font-mono mt-1">VERIFIED BADGE</span>
                </div>
              </div>

              {/* Central Identity Row */}
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-[#8E8D8A]/30 bg-[#EAE7DC] flex items-center justify-center">
                    {passData.avatarUrl ? (
                      <Image
                        src={passData.avatarUrl}
                        alt={passData.fullName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-xl font-bold font-mono text-[#1A1918]">
                        {passData.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#E85A4F] border-2 border-[#F6F4EE] flex items-center justify-center text-white" title="Verified LNJPIT Student">
                    <Check className="h-3 w-3" />
                  </div>
                </div>

                {/* Name, AST26 ID & Badges */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-[#1A1918] truncate tracking-tight uppercase">
                    {passData.fullName}
                  </h3>

                  {/* AST26-XXXX ID */}
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-[#E85A4F] tracking-wider bg-[#EAE7DC] px-2.5 py-0.5 rounded border border-[#8E8D8A]/25">
                      {passData.participantId}
                    </span>
                    <button
                      onClick={handleCopyId}
                      className="p-1 rounded bg-[#EAE7DC] border border-[#8E8D8A]/25 hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-colors cursor-pointer text-[#8E8D8A]"
                      title="Copy Participant ID"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-[#E85A4F]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Role & Branch Badges */}
                  <div className="mt-2 flex flex-wrap gap-1.5 font-mono">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#1A1918] text-[#EAE7DC] uppercase">
                      {passData.role.replace("_", " ")}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#1A1918] border border-[#8E8D8A]/25 uppercase">
                      {branchMeta.code}
                    </span>
                  </div>
                </div>
              </div>

              {/* Student Metadata Strip */}
              <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 p-2.5 text-center font-mono">
                <div>
                  <span className="text-[9px] text-[#8E8D8A] uppercase block">Roll No</span>
                  <span className="text-xs font-bold text-[#1A1918] truncate block">
                    {passData.collegeId || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8E8D8A] uppercase block">Semester</span>
                  <span className="text-xs font-bold text-[#E85A4F] block">
                    Sem {passData.semester}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8E8D8A] uppercase block">Kit Size</span>
                  <span className="text-xs font-bold text-[#1A1918] block">
                    {passData.tshirtSize}
                  </span>
                </div>
              </div>

              {/* QR Pass Matrix & Verification Strip */}
              <div className="flex items-center justify-between rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 p-3">
                <div className="flex items-center space-x-3">
                  <div className="relative h-14 w-14 rounded-xl bg-white p-1 border border-[#8E8D8A]/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {passData.qrCodeDataUrl ? (
                      <Image
                        src={passData.qrCodeDataUrl}
                        alt="QR Pass"
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <QrCode className="h-8 w-8 text-[#1A1918]" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-bold text-[#1A1918] uppercase block">
                      SECURE ENTRY PASS
                    </span>
                    <p className="text-[9px] font-mono text-[#8E8D8A]">
                      Scan at all tournament arenas
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFlipped(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#1A1918] text-[#EAE7DC] text-[10px] font-mono uppercase font-bold hover:bg-[#E85A4F] transition-colors"
                >
                  FULL QR →
                </button>
              </div>
            </div>
          ) : (
            /* BACK FACE: High-Contrast QR Code */
            <div className="flex flex-col items-center justify-center space-y-4 py-4 text-center">
              <span className="text-xs font-mono font-bold text-[#1A1918] uppercase tracking-wider">
                ASTITVA 2K26 EVENT BADGE
              </span>

              <div className="relative h-48 w-48 rounded-2xl bg-white p-2 border border-[#8E8D8A]/30 flex items-center justify-center shadow-md">
                {passData.qrCodeDataUrl ? (
                  <Image
                    src={passData.qrCodeDataUrl}
                    alt="Encrypted QR Badge"
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <QrCode className="h-28 w-28 text-[#1A1918]" />
                )}
              </div>

              <div className="space-y-1 font-mono">
                <p className="text-xs font-bold text-[#E85A4F]">{passData.participantId}</p>
                <p className="text-[10px] text-[#8E8D8A]">Encrypted AES-256 Check-in Token</p>
              </div>

              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className="px-4 py-1.5 rounded-xl bg-[#1A1918] text-[#EAE7DC] text-[10px] font-mono uppercase font-bold hover:bg-[#E85A4F] transition-colors"
              >
                ← BACK TO CARD
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

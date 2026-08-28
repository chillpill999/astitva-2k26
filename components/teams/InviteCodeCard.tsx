"use client";

import React, { useState } from "react";
import { Copy, Check, Share2, MessageSquare, Sparkles } from "lucide-react";

interface InviteCodeCardProps {
  code: string;
  teamName: string;
  eventTitle?: string;
  maxMembers?: number;
}

export function InviteCodeCard({
  code,
  teamName,
  eventTitle,
  maxMembers,
}: InviteCodeCardProps) {
  const [copied, setCopied] = useState(false);

  const joinUrl = typeof window !== "undefined"
    ? `${window.location.origin}/teams/join/${code}`
    : `https://astitva2k26.lnjpit.ac.in/teams/join/${code}`;

  const shareText = encodeURIComponent(
    `🔥 Join my squad *${teamName}* for ${eventTitle || "ASTITVA 2K26"}!\n\n` +
    `⚡ Invite Code: *${code}*\n` +
    `👉 Direct Join Link: ${joinUrl}\n\n` +
    `LNJPIT Chapra Annual Mega Fest (4-8 Sept 2026)`
  );

  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  const handleCopy = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-4 text-[#1A1918]">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAE7DC] text-[#E85A4F] uppercase border border-[#8E8D8A]/20">
            SQUAD INVITE CODE
          </span>
          <p className="text-xs text-[#8E8D8A] font-mono mt-1">Share this 6-character code with your teammates.</p>
        </div>
        <Sparkles className="h-4 w-4 text-[#E85A4F]" />
      </div>

      {/* 6-Character Code Display Box */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/25 shadow-inner">
        <div className="space-y-0.5">
          <span className="text-[9px] font-mono text-[#8E8D8A] uppercase tracking-wider">Access Token</span>
          <div className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-[#E85A4F]">
            {code}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase bg-[#1A1918] hover:bg-[#E85A4F] text-[#EAE7DC] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#E85A4F]" />
              COPIED!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              COPY CODE
            </>
          )}
        </button>
      </div>

      {/* Direct Share Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <button
            type="button"
            className="w-full py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#E85A4F] hover:bg-[#C94A40] text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Share on WhatsApp
          </button>
        </a>

        <button
          type="button"
          onClick={async () => {
            if (typeof window !== "undefined") {
              try {
                await navigator.clipboard.writeText(joinUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch {}
            }
          }}
          className="w-full py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-[#8E8D8A]/35 bg-[#EAE7DC] text-[#1A1918] hover:bg-[#1A1918] hover:text-[#EAE7DC] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Share2 className="h-3.5 w-3.5" />
          Copy Direct Join Link
        </button>
      </div>
    </div>
  );
}

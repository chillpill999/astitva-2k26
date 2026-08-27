"use client";

// ============================================================================
// ASTITVA 2K26 - Team Invite Code Display & WhatsApp Sharing Card
// Path: components/teams/InviteCodeCard.tsx
// ============================================================================

import React, { useState } from "react";
import { Copy, Check, Share2, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    `LNJPIT Chapra Annual Techno-Cultural & Sports Fest (4-8 Sept 2026)`
  );

  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  const handleCopy = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard fallback
      }
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-purple-950/40 border border-cyan-500/30 shadow-2xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Badge variant="outline" className="text-[10px] font-mono bg-cyan-950/50 text-cyan-300 border-cyan-500/40">
            SQUAD INVITE CODE
          </Badge>
          <p className="text-xs text-slate-300">Share this 6-character code with your teammates.</p>
        </div>
        <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse" />
      </div>

      {/* 6-Character Code Display Box */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/90 border border-cyan-500/40 shadow-inner">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Access Token</span>
          <div className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-cyan-300 selection:bg-cyan-500">
            {code}
          </div>
        </div>

        <Button
          onClick={handleCopy}
          size="sm"
          className="text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30"
        >
          {copied ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-300" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5" />
              Copy Code
            </>
          )}
        </Button>
      </div>

      {/* Direct Share Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button
            type="button"
            className="w-full text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Share on WhatsApp
          </Button>
        </a>

        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            if (typeof window !== "undefined") {
              try {
                await navigator.clipboard.writeText(joinUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch {}
            }
          }}
          className="w-full text-xs font-bold border-white/15 bg-white/5 text-slate-200 hover:text-white"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Copy Direct Join Link
        </Button>
      </div>
    </div>
  );
}

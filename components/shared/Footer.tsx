import React from "react";
import Link from "next/link";
import { Sparkles, MapPin, Mail, Phone, ExternalLink, Heart, Trophy, Music, Gamepad2, BookOpen, Camera, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#030712] text-slate-400 relative overflow-hidden">
      {/* Subtle background glow element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1 & 2: Fest Identity & LNJPIT Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-wider">
                  ASTITVA <span className="text-cyan-400">2K26</span>
                </span>
                <p className="text-xs text-slate-400">
                  Annual Sports, Cultural, Gaming &amp; Literary Mega Fest
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Lok Nayak Jai Prakash Institute of Technology (LNJPIT), Chapra brings together over 2,500+ participants across 16 premier tournaments from 4 to 8 September 2026.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
                <a
                  href="https://maps.google.com/?q=Lok+Nayak+Jai+Prakash+Institute+of+Technology+Chapra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                >
                  <span>LNJPIT Campus, NH-19, Chhapra, Saran, Bihar – 841302</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-purple-400 shrink-0" />
                <a href="mailto:astitva2026@lnjpit.ac.in" className="hover:text-purple-300">
                  astitva2026@lnjpit.ac.in
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <span>+91 98765 43210 / +91 98765 43211</span>
              </div>
            </div>
          </div>

          {/* Col 3: Four Pillars */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Festival Streams
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/events?category=sports"
                  className="flex items-center space-x-2 hover:text-cyan-400 transition-colors"
                >
                  <Trophy className="h-3.5 w-3.5 text-amber-400" />
                  <span>Sports Championship</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=cultural"
                  className="flex items-center space-x-2 hover:text-cyan-400 transition-colors"
                >
                  <Music className="h-3.5 w-3.5 text-purple-400" />
                  <span>Cultural Night &amp; Arts</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=gaming"
                  className="flex items-center space-x-2 hover:text-cyan-400 transition-colors"
                >
                  <Gamepad2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Esports &amp; LAN Warfare</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=literary"
                  className="flex items-center space-x-2 hover:text-cyan-400 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Literary &amp; Debates</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Portals & Media */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Portals &amp; Exploration
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/schedule" className="hover:text-cyan-400 transition-colors">
                  5-Day Schedule Matrix
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                  <Camera className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Multimedia Gallery</span>
                </Link>
              </li>
              <li>
                <Link href="/sponsors" className="hover:text-cyan-400 transition-colors">
                  Tiered Sponsor Wall
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-cyan-400 transition-colors">
                  Organizing Committee
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-purple-400" />
                  <span>FAQ &amp; Support Hub</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/verify-certificate/AST26-CERT-10492"
                  className="hover:text-cyan-400 transition-colors flex items-center space-x-1"
                >
                  <span>Verify Certificate</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Governance & Roles */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Portals &amp; Roles
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard/admin" className="hover:text-cyan-400 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/coordinator" className="hover:text-cyan-400 transition-colors">
                  Event Coordinator Desk
                </Link>
              </li>
              <li>
                <Link href="/dashboard/volunteer" className="hover:text-cyan-400 transition-colors">
                  Volunteer QR Scanner
                </Link>
              </li>
              <li>
                <Link href="/dashboard/captain" className="hover:text-cyan-400 transition-colors">
                  Team Captain Console
                </Link>
              </li>
              <li>
                <Link href="/dashboard/participant" className="hover:text-cyan-400 transition-colors">
                  Participant Pass &amp; Hub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Lok Nayak Jai Prakash Institute of Technology (LNJPIT), Chapra. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              Engineered with <Heart className="h-3.5 w-3.5 text-red-500 mx-1 inline fill-current" /> for ASTITVA 2K26
            </span>
            <Badge variant="outline" className="text-[10px] text-slate-400 border-white/10">
              v1.0.0 Stable
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
}

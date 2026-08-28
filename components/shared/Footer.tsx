import React from "react";
import Link from "next/link";
import { Sparkles, MapPin, Mail, Phone, ExternalLink, Trophy, Music, Gamepad2, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#8E8D8A]/25 bg-[#EAE7DC] text-[#8E8D8A] relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1 & 2: Fest Identity & LNJPIT Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-mono text-xl font-bold tracking-[0.3em] text-[#1A1918] uppercase">
                A S T I T V A
              </span>
              <p className="text-xs font-mono text-[#8E8D8A] tracking-wider uppercase mt-0.5">
                LNJPIT CHAPRA · ANNUAL FESTIVAL 2026
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#8E8D8A] leading-relaxed max-w-md">
              Lok Nayak Jai Prakash Institute of Technology (LNJPIT), Chapra brings together over 1,000+ participants across 16 premier tournaments from 4 to 8 September 2026.
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#8E8D8A]">
              <div className="flex items-center space-x-2">
                <MapPin className="h-3.5 w-3.5 text-[#E85A4F] shrink-0" />
                <a
                  href="https://maps.google.com/?q=Lok+Nayak+Jai+Prakash+Institute+of+Technology+Chapra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1A1918] transition-colors flex items-center gap-1"
                >
                  <span>LNJPIT Campus, NH-19, Chhapra, Saran, Bihar – 841302</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3.5 w-3.5 text-[#E85A4F] shrink-0" />
                <a href="mailto:astitva2026@lnjpit.ac.in" className="hover:text-[#1A1918]">
                  astitva2026@lnjpit.ac.in
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Four Pillars */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#1A1918] uppercase tracking-wider">
              Festival Streams
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link href="/events?category=sports" className="hover:text-[#E85A4F] transition-colors">
                  Sports Championship
                </Link>
              </li>
              <li>
                <Link href="/events?category=cultural" className="hover:text-[#E85A4F] transition-colors">
                  Cultural &amp; Arts
                </Link>
              </li>
              <li>
                <Link href="/events?category=gaming" className="hover:text-[#E85A4F] transition-colors">
                  Esports &amp; Gaming
                </Link>
              </li>
              <li>
                <Link href="/events?category=literary" className="hover:text-[#E85A4F] transition-colors">
                  Literary Arena
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#1A1918] uppercase tracking-wider">
              Portals
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link href="/dashboard/participant" className="hover:text-[#E85A4F] transition-colors">
                  Participant Pass
                </Link>
              </li>
              <li>
                <Link href="/dashboard/captain" className="hover:text-[#E85A4F] transition-colors">
                  Team Hub
                </Link>
              </li>
              <li>
                <Link href="/dashboard/volunteer" className="hover:text-[#E85A4F] transition-colors">
                  Volunteer Scanner
                </Link>
              </li>
              <li>
                <Link href="/dashboard/admin" className="hover:text-[#E85A4F] transition-colors">
                  Admin Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Credits */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#1A1918] uppercase tracking-wider">
              Editorial Credits
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link href="/faq" className="hover:text-[#E85A4F] transition-colors">
                  Festival FAQs
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-[#E85A4F] transition-colors">
                  Committee
                </Link>
              </li>
              <li>
                <Link href="/sponsors" className="hover:text-[#E85A4F] transition-colors">
                  Partners &amp; Tiers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#8E8D8A]/20 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#8E8D8A] gap-3">
          <p>© 2026 ASTITVA FESTIVAL COMMITTEE · LNJPIT CHAPRA. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-4">
            <span className="text-[#E85A4F] font-semibold">ASTITVA 2K26</span>
            <span>·</span>
            <span>SEPTEMBER 4–8, 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

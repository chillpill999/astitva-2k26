"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#EAE7DC] text-[#1A1918] py-12 px-4">
      <div className="mb-6 text-center space-y-1">
        <Link href="/" className="font-mono text-xl font-bold tracking-[0.35em] text-[#1A1918] uppercase">
          A S T I T V A
        </Link>
        <p className="text-xs font-mono tracking-wider text-[#8E8D8A] uppercase">
          LNJPIT CHAPRA · OFFICIAL FESTIVAL PORTAL
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {/* Clerk Official Sign In */}
        <div className="rounded-3xl p-4 bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-xl min-h-[380px] flex items-center justify-center">
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            fallbackRedirectUrl={callbackUrl || "/"}
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none bg-transparent w-full p-0",
                headerTitle: "text-[#1A1918] font-bold font-mono text-lg",
                headerSubtitle: "text-[#8E8D8A] text-xs font-mono",
                formButtonPrimary: "bg-[#E85A4F] hover:bg-[#C94A40] text-xs font-mono uppercase font-bold py-2.5 transition-colors shadow-sm",
                footerActionLink: "text-[#E85A4F] hover:underline font-mono text-xs",
                formFieldInput: "bg-white border-[#8E8D8A]/30 text-[#1A1918] rounded-xl text-xs",
                formFieldLabel: "text-[#1A1918] font-mono text-xs font-semibold",
                socialButtonsBlockButton: "border-[#8E8D8A]/30 hover:bg-[#EAE7DC] text-[#1A1918] text-xs font-mono rounded-xl",
                dividerLine: "bg-[#8E8D8A]/20",
                dividerText: "text-[#8E8D8A] text-[10px] font-mono uppercase",
              },
            }}
          />
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs font-mono text-[#8E8D8A] hover:text-[#1A1918] transition-colors"
          >
            ← Return to Festival Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

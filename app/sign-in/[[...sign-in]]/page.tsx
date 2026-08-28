import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
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

      <div className="rounded-3xl p-2 bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-xl">
        <SignIn
          appearance={{
            elements: {
              card: "shadow-none bg-transparent",
              headerTitle: "text-[#1A1918] font-bold font-mono",
              headerSubtitle: "text-[#8E8D8A] text-xs",
              formButtonPrimary: "bg-[#E85A4F] hover:bg-[#C94A40] text-xs font-mono uppercase font-bold",
              footerActionLink: "text-[#E85A4F] hover:underline",
            },
          }}
        />
      </div>
    </div>
  );
}

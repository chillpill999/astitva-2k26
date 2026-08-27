// ============================================================================
// ASTITVA 2K26 - Student Registration & Pass Issuance
// Path: app/(auth)/sign-up/page.tsx
// ============================================================================

"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  User,
  Mail,
  Lock,
  Phone,
  Building,
  Shirt,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BRANCH_METADATA, LNJPIT_HOSTELS, BranchEnum } from "@/lib/profile/schema";
import { toast } from "sonner";
import confetti from "canvas-confetti";

function SignUpContent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "Password@123",
    collegeId: "",
    branch: "CSE",
    semester: "1",
    phone: "",
    gender: "MALE",
    isHosteler: false,
    hostelName: "",
    roomNumber: "",
    tshirtSize: "L",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.collegeId || !formData.phone) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // In mock mode / API, switch or login as participant with updated session data
      const res = await fetch("/api/auth/mock/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "PARTICIPANT" }),
      });

      const data = await res.json();
      if (data.success) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#06b6d4", "#8b5cf6", "#f59e0b"],
        });

        toast.success("Registration Successful!", {
          description: `Issued Pass: AST26-1049 for ${formData.fullName}`,
        });

        router.push("/dashboard/participant");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to create student profile.");
      }
    } catch {
      toast.error("An unexpected error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-wider text-white">
              ASTITVA <span className="text-cyan-400">2K26</span>
            </span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Register LNJPIT Student Festival Pass
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Direct access to all 16 Sports, Cultural, Gaming, and Literary Tournaments
          </p>
        </div>

        {/* Registration Form Card */}
        <Card className="glass-panel border-white/10 bg-slate-900/70 shadow-2xl">
          <CardHeader className="pb-3 border-b border-white/10">
            <CardTitle className="text-base font-bold text-white flex items-center">
              <GraduationCap className="h-5 w-5 text-cyan-400 mr-2" />
              Student Academic & Identity Details
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Your official AST26-XXXX ID will be generated upon form submission.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-semibold text-slate-300">
                    Full Name <span className="text-cyan-400">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="e.g. Sneha Kumari"
                    className="bg-slate-950/70 border-white/10 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-300">
                    Email Address <span className="text-cyan-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="student@lnjpit.ac.in"
                    className="bg-slate-950/70 border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              {/* Roll Number & Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="collegeId" className="text-xs font-semibold text-slate-300">
                    College Roll / Registration No <span className="text-cyan-400">*</span>
                  </Label>
                  <Input
                    id="collegeId"
                    required
                    value={formData.collegeId}
                    onChange={(e) => handleChange("collegeId", e.target.value)}
                    placeholder="e.g. 24105128032"
                    className="font-mono bg-slate-950/70 border-white/10 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    Department / Branch <span className="text-cyan-400">*</span>
                  </Label>
                  <Select
                    value={formData.branch}
                    onValueChange={(val) => handleChange("branch", val)}
                  >
                    <SelectTrigger className="bg-slate-950/70 border-white/10 text-white text-xs">
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white text-xs">
                      {Object.entries(BRANCH_METADATA).map(([k, meta]) => (
                        <SelectItem key={k} value={k}>
                          {meta.code} — {meta.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Semester & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    Current Semester <span className="text-cyan-400">*</span>
                  </Label>
                  <Select
                    value={formData.semester}
                    onValueChange={(val) => handleChange("semester", val)}
                  >
                    <SelectTrigger className="bg-slate-950/70 border-white/10 text-white font-mono text-xs">
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white font-mono text-xs">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <SelectItem key={s} value={String(s)}>
                          Semester {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold text-slate-300">
                    Phone Number (10-Digit) <span className="text-cyan-400">*</span>
                  </Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="9876543214"
                    className="font-mono bg-slate-950/70 border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              {/* Gender & T-Shirt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    Gender <span className="text-cyan-400">*</span>
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(val) => handleChange("gender", val)}
                  >
                    <SelectTrigger className="bg-slate-950/70 border-white/10 text-white text-xs">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white text-xs">
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    Festival Kit T-Shirt Size
                  </Label>
                  <div className="flex gap-1.5">
                    {(["S", "M", "L", "XL", "XXL"] as const).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleChange("tshirtSize", size)}
                        className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                          formData.tshirtSize === size
                            ? "bg-purple-500 text-white shadow-md shadow-purple-500/30 border border-purple-400"
                            : "bg-slate-950/70 text-slate-400 border border-white/10 hover:text-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hosteler Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/5">
                <div>
                  <Label htmlFor="isHosteler" className="text-xs font-semibold text-white block">
                    Campus Hosteler Status
                  </Label>
                  <span className="text-[11px] text-slate-400">
                    Toggle on if residing in LNJPIT hostels.
                  </span>
                </div>
                <Switch
                  id="isHosteler"
                  checked={formData.isHosteler}
                  onCheckedChange={(checked) => handleChange("isHosteler", checked)}
                />
              </div>

              {formData.isHosteler && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in-50">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">
                      Hostel Name
                    </Label>
                    <Select
                      value={formData.hostelName}
                      onValueChange={(val) => handleChange("hostelName", val)}
                    >
                      <SelectTrigger className="bg-slate-950/70 border-white/10 text-white text-xs">
                        <SelectValue placeholder="Select Hostel" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white text-xs">
                        {LNJPIT_HOSTELS.map((h) => (
                          <SelectItem key={h} value={h}>
                            {h}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="roomNumber" className="text-xs font-semibold text-slate-300">
                      Room Number
                    </Label>
                    <Input
                      id="roomNumber"
                      value={formData.roomNumber}
                      onChange={(e) => handleChange("roomNumber", e.target.value)}
                      placeholder="e.g. A-112"
                      className="font-mono bg-slate-950/70 border-white/10 text-white text-xs"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                variant="neonCyan"
                className="w-full font-bold text-xs py-3 mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating AST26 Pass...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Complete Registration & Claim Pass
                  </>
                )}
              </Button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-400">
                  Already registered?{" "}
                  <Link href="/sign-in" className="text-cyan-400 font-semibold hover:underline">
                    Sign In to your Dashboard
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Loading ASTITVA Registration...</div>}>
      <SignUpContent />
    </Suspense>
  );
}

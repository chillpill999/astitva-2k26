// ============================================================================
// ASTITVA 2K26 - LNJPIT Student Profile Form
// Path: components/profile/ProfileForm.tsx
// ============================================================================

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProfileFormSchema,
  ProfileFormValues,
  BranchEnum,
  GenderEnum,
  TshirtSizeEnum,
  LNJPIT_HOSTELS,
  BRANCH_METADATA,
  ParticipantPassData,
} from "@/lib/profile/schema";
import { updateProfile, uploadAvatar } from "@/lib/profile/actions";
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
import {
  User,
  GraduationCap,
  Building,
  Shirt,
  Camera,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ProfileFormProps {
  initialData: ParticipantPassData;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData.avatarUrl || null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      fullName: initialData.fullName || "",
      collegeId: initialData.collegeId === "TBD" ? "" : initialData.collegeId,
      collegeName: initialData.collegeName || "LNJPIT Chapra",
      branch: initialData.branch || "CSE",
      semester: initialData.semester || 1,
      phone: initialData.phone === "9999999999" ? "" : initialData.phone,
      gender: initialData.gender || "MALE",
      isHosteler: initialData.isHosteler || false,
      hostelName: initialData.hostelName || "",
      roomNumber: initialData.roomNumber || "",
      emergencyContact: "",
      tshirtSize: initialData.tshirtSize || "L",
      bio: "",
      avatarUrl: initialData.avatarUrl || "",
    },
  });

  const isHosteler = watch("isHosteler");
  const selectedBranch = watch("branch");
  const selectedTshirt = watch("tshirtSize");

  // Handle Avatar Image File Upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await uploadAvatar(formData);
      if (res.success && res.data?.avatarUrl) {
        setAvatarPreview(res.data.avatarUrl);
        setValue("avatarUrl", res.data.avatarUrl, { shouldDirty: true });
        toast.success("Avatar uploaded successfully!");
      } else {
        toast.error(res.error || "Failed to upload avatar");
      }
    } catch {
      toast.error("An unexpected error occurred during avatar upload");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Form Submit Handler
  const onSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateProfile(values);

      if (result.success) {
        toast.success("LNJPIT Profile updated successfully!", {
          description: `Participant ID: ${result.data?.participantId}`,
        });
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch {
      toast.error("An error occurred while saving profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 1. Academic & Identity Section */}
      <Card className="glass-panel border-white/10 bg-slate-900/60 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-white flex items-center">
            <GraduationCap className="h-5 w-5 text-cyan-400 mr-2" />
            Academic Credentials (LNJPIT Chapra)
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Ensure your roll number and department match your college ID card for verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar & Full Name Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div className="relative group flex-shrink-0">
              <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-cyan-500/40 bg-slate-950 flex items-center justify-center">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Avatar" fill className="object-cover" />
                ) : (
                  <User className="h-8 w-8 text-slate-400" />
                )}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-1 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer shadow-lg transition-transform hover:scale-110"
                title="Change Profile Photo"
              >
                <Camera className="h-3.5 w-3.5" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>

            <div className="flex-1 w-full space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-semibold text-slate-300">
                Full Name <span className="text-cyan-400">*</span>
              </Label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder="e.g. Rahul Kumar"
                className="bg-slate-950/70 border-white/10 text-white placeholder:text-slate-500 text-xs"
              />
              {errors.fullName && (
                <p className="text-[11px] text-red-400">{errors.fullName.message}</p>
              )}
            </div>
          </div>

          {/* Roll Number & Branch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="collegeId" className="text-xs font-semibold text-slate-300">
                College Roll / Reg No <span className="text-cyan-400">*</span>
              </Label>
              <Input
                id="collegeId"
                {...register("collegeId")}
                placeholder="e.g. 22105128001"
                className="font-mono bg-slate-950/70 border-white/10 text-white placeholder:text-slate-500 text-xs"
              />
              {errors.collegeId && (
                <p className="text-[11px] text-red-400">{errors.collegeId.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">
                Branch / Department <span className="text-cyan-400">*</span>
              </Label>
              <Select
                value={selectedBranch}
                onValueChange={(val) => setValue("branch", val as any, { shouldDirty: true })}
              >
                <SelectTrigger className="bg-slate-950/70 border-white/10 text-white text-xs">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white text-xs">
                  {Object.entries(BRANCH_METADATA).map(([key, meta]) => (
                    <SelectItem key={key} value={key}>
                      {meta.code} — {meta.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.branch && (
                <p className="text-[11px] text-red-400">{errors.branch.message}</p>
              )}
            </div>
          </div>

          {/* Semester & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="semester" className="text-xs font-semibold text-slate-300">
                Current Semester (1 - 8) <span className="text-cyan-400">*</span>
              </Label>
              <Select
                value={String(watch("semester"))}
                onValueChange={(val) => setValue("semester", parseInt(val, 10), { shouldDirty: true })}
              >
                <SelectTrigger className="bg-slate-950/70 border-white/10 text-white font-mono text-xs">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white font-mono text-xs">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={String(sem)}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.semester && (
                <p className="text-[11px] text-red-400">{errors.semester.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold text-slate-300">
                Mobile Number (10-Digit) <span className="text-cyan-400">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">+91</span>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="9876543210"
                  className="pl-12 font-mono bg-slate-950/70 border-white/10 text-white placeholder:text-slate-500 text-xs"
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-red-400">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Demographics & Kit Details */}
      <Card className="glass-panel border-white/10 bg-slate-900/60 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-white flex items-center">
            <Shirt className="h-5 w-5 text-purple-400 mr-2" />
            Demographics & Festival Kit
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Selected t-shirt size will be reserved for your official ASTITVA 2K26 kit bag.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">
                Gender <span className="text-cyan-400">*</span>
              </Label>
              <Select
                value={watch("gender")}
                onValueChange={(val) => setValue("gender", val as any, { shouldDirty: true })}
              >
                <SelectTrigger className="bg-slate-950/70 border-white/10 text-white text-xs">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white text-xs">
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other / Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* T-Shirt Size Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">
                Festival T-Shirt Size <span className="text-cyan-400">*</span>
              </Label>
              <div className="flex gap-2">
                {(["S", "M", "L", "XL", "XXL"] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setValue("tshirtSize", size, { shouldDirty: true })}
                    className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                      selectedTshirt === size
                        ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30 scale-105 border border-purple-400"
                        : "bg-slate-950/70 text-slate-400 border border-white/10 hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Campus Residence & Accommodation */}
      <Card className="glass-panel border-white/10 bg-slate-900/60 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-white flex items-center">
            <Building className="h-5 w-5 text-amber-400 mr-2" />
            Campus Accommodation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/5">
            <div>
              <Label htmlFor="isHosteler" className="text-sm font-semibold text-white block">
                Are you an LNJPIT Hosteler?
              </Label>
              <span className="text-xs text-slate-400">
                Toggle on if residing in college campus hostels.
              </span>
            </div>
            <Switch
              id="isHosteler"
              checked={isHosteler}
              onCheckedChange={(checked) => setValue("isHosteler", checked, { shouldDirty: true })}
            />
          </div>

          {isHosteler && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in-50 duration-200">
              <div className="space-y-1.5">
                <Label htmlFor="hostelName" className="text-xs font-semibold text-slate-300">
                  Hostel Name <span className="text-cyan-400">*</span>
                </Label>
                <Select
                  value={watch("hostelName") || ""}
                  onValueChange={(val) => setValue("hostelName", val, { shouldDirty: true })}
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
                {errors.hostelName && (
                  <p className="text-[11px] text-red-400">{errors.hostelName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="roomNumber" className="text-xs font-semibold text-slate-300">
                  Room Number
                </Label>
                <Input
                  id="roomNumber"
                  {...register("roomNumber")}
                  placeholder="e.g. A-112 or G-204"
                  className="bg-slate-950/70 border-white/10 text-white placeholder:text-slate-500 font-mono text-xs"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end space-x-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="neonCyan"
          className="px-6 font-bold text-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Profile...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Save LNJPIT Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// ============================================================================
// ASTITVA 2K26 - LNJPIT Student Profile Form (Exteta Luxury Aesthetic)
// Path: components/profile/ProfileForm.tsx
// ============================================================================

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProfileFormSchema,
  ProfileFormValues,
  LNJPIT_HOSTELS,
  BRANCH_METADATA,
  ParticipantPassData,
} from "@/lib/profile/schema";
import { updateProfile, uploadAvatar } from "@/lib/profile/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-[#1A1918]">
      {/* 1. Academic & Identity Section */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-6">
        <div className="border-b border-[#8E8D8A]/20 pb-4">
          <h3 className="text-base font-bold text-[#1A1918] flex items-center font-mono uppercase tracking-wider">
            <GraduationCap className="h-5 w-5 text-[#E85A4F] mr-2" />
            Student Academic &amp; Identity Details
          </h3>
          <p className="text-xs text-[#8E8D8A] mt-1 font-mono">
            Your official AST26-XXXX ID will be generated upon form submission.
          </p>
        </div>

        <div className="space-y-5">
          {/* Avatar & Full Name Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-[#8E8D8A]/15 pb-4">
            <div className="relative group flex-shrink-0">
              <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-[#8E8D8A]/30 bg-[#EAE7DC] flex items-center justify-center">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Avatar" fill className="object-cover" />
                ) : (
                  <User className="h-8 w-8 text-[#8E8D8A]" />
                )}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-[#1A1918]/60 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#E85A4F] hover:bg-[#C94A40] text-white cursor-pointer shadow-md transition-transform hover:scale-110"
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
              <Label htmlFor="fullName" className="text-xs font-mono font-bold text-[#1A1918] uppercase">
                Full Name <span className="text-[#E85A4F]">*</span>
              </Label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder="e.g. Sneha Kumari"
                className="bg-[#EAE7DC] border-[#8E8D8A]/30 text-[#1A1918] placeholder:text-[#8E8D8A]/60 text-xs font-mono rounded-xl focus-visible:ring-[#E85A4F]"
              />
              {errors.fullName && (
                <p className="text-[11px] font-mono text-[#E85A4F]">{errors.fullName.message}</p>
              )}
            </div>
          </div>

          {/* Roll Number & Branch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="collegeId" className="text-xs font-mono font-bold text-[#1A1918] uppercase">
                College Roll / Registration No <span className="text-[#E85A4F]">*</span>
              </Label>
              <Input
                id="collegeId"
                {...register("collegeId")}
                placeholder="e.g. 24105128032"
                className="font-mono bg-[#EAE7DC] border-[#8E8D8A]/30 text-[#1A1918] placeholder:text-[#8E8D8A]/60 text-xs rounded-xl focus-visible:ring-[#E85A4F]"
              />
              {errors.collegeId && (
                <p className="text-[11px] font-mono text-[#E85A4F]">{errors.collegeId.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-mono font-bold text-[#1A1918] uppercase">
                Department / Branch <span className="text-[#E85A4F]">*</span>
              </Label>
              <Select
                value={selectedBranch}
                onValueChange={(val) => setValue("branch", val as any, { shouldDirty: true })}
              >
                <SelectTrigger className="bg-[#EAE7DC] border-[#8E8D8A]/30 text-[#1A1918] text-xs font-mono rounded-xl">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent className="bg-[#F6F4EE] border-[#8E8D8A]/30 text-[#1A1918] text-xs font-mono">
                  {Object.entries(BRANCH_METADATA).map(([key, meta]) => (
                    <SelectItem key={key} value={key}>
                      {meta.code} — {meta.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.branch && (
                <p className="text-[11px] font-mono text-[#E85A4F]">{errors.branch.message}</p>
              )}
            </div>
          </div>

          {/* Semester & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="semester" className="text-xs font-mono font-bold text-[#1A1918] uppercase">
                Current Semester <span className="text-[#E85A4F]">*</span>
              </Label>
              <Select
                value={String(watch("semester"))}
                onValueChange={(val) => setValue("semester", parseInt(val, 10), { shouldDirty: true })}
              >
                <SelectTrigger className="bg-[#EAE7DC] border-[#8E8D8A]/30 text-[#1A1918] font-mono text-xs rounded-xl">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent className="bg-[#F6F4EE] border-[#8E8D8A]/30 text-[#1A1918] font-mono text-xs">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={String(sem)}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.semester && (
                <p className="text-[11px] font-mono text-[#E85A4F]">{errors.semester.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-mono font-bold text-[#1A1918] uppercase">
                Phone Number (10-Digit) <span className="text-[#E85A4F]">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#8E8D8A] font-mono">+91</span>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="9876543214"
                  className="pl-12 font-mono bg-[#EAE7DC] border-[#8E8D8A]/30 text-[#1A1918] placeholder:text-[#8E8D8A]/60 text-xs rounded-xl focus-visible:ring-[#E85A4F]"
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] font-mono text-[#E85A4F]">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Demographics & Kit Details */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-6">
        <div className="border-b border-[#8E8D8A]/20 pb-4">
          <h3 className="text-base font-bold text-[#1A1918] flex items-center font-mono uppercase tracking-wider">
            <Shirt className="h-5 w-5 text-[#E85A4F] mr-2" />
            Demographics &amp; Festival Kit
          </h3>
          <p className="text-xs text-[#8E8D8A] mt-1 font-mono">
            Selected size will be reserved for your ASTITVA 2K26 kit bag.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-mono font-bold text-[#1A1918] uppercase">
              Gender <span className="text-[#E85A4F]">*</span>
            </Label>
            <Select
              value={watch("gender")}
              onValueChange={(val) => setValue("gender", val as any, { shouldDirty: true })}
            >
              <SelectTrigger className="bg-[#EAE7DC] border-[#8E8D8A]/30 text-[#1A1918] text-xs font-mono rounded-xl">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className="bg-[#F6F4EE] border-[#8E8D8A]/30 text-[#1A1918] text-xs font-mono">
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other / Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* T-Shirt Size Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-mono font-bold text-[#1A1918] uppercase">
              Festival Kit T-Shirt Size <span className="text-[#E85A4F]">*</span>
            </Label>
            <div className="flex gap-2">
              {(["S", "M", "L", "XL", "XXL"] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setValue("tshirtSize", size, { shouldDirty: true })}
                  className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                    selectedTshirt === size
                      ? "bg-[#E85A4F] text-white shadow-sm"
                      : "bg-[#EAE7DC] text-[#1A1918] border border-[#8E8D8A]/25 hover:bg-[#1A1918] hover:text-[#EAE7DC]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Campus Residence & Accommodation */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#F6F4EE] border border-[#8E8D8A]/25 shadow-sm space-y-6">
        <div className="border-b border-[#8E8D8A]/20 pb-4">
          <h3 className="text-base font-bold text-[#1A1918] flex items-center font-mono uppercase tracking-wider">
            <Building className="h-5 w-5 text-[#E85A4F] mr-2" />
            Campus Residence
          </h3>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20">
          <div>
            <Label htmlFor="isHosteler" className="text-xs font-mono font-bold text-[#1A1918] uppercase block">
              Campus Hosteler Status
            </Label>
            <span className="text-[11px] font-mono text-[#8E8D8A]">
              Toggle on if residing in LNJPIT hostels.
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
              <Label htmlFor="hostelName" className="text-xs font-mono font-bold text-[#1A1918] uppercase">
                Hostel Name <span className="text-[#E85A4F]">*</span>
              </Label>
              <Select
                value={watch("hostelName") || ""}
                onValueChange={(val) => setValue("hostelName", val, { shouldDirty: true })}
              >
                <SelectTrigger className="bg-[#EAE7DC] border-[#8E8D8A]/30 text-[#1A1918] text-xs font-mono rounded-xl">
                  <SelectValue placeholder="Select Hostel" />
                </SelectTrigger>
                <SelectContent className="bg-[#F6F4EE] border-[#8E8D8A]/30 text-[#1A1918] text-xs font-mono">
                  {LNJPIT_HOSTELS.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.hostelName && (
                <p className="text-[11px] font-mono text-[#E85A4F]">{errors.hostelName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="roomNumber" className="text-xs font-mono font-bold text-[#1A1918] uppercase">
                Room Number
              </Label>
              <Input
                id="roomNumber"
                {...register("roomNumber")}
                placeholder="e.g. A-112 or G-204"
                className="bg-[#EAE7DC] border-[#8E8D8A]/30 text-[#1A1918] placeholder:text-[#8E8D8A]/60 font-mono text-xs rounded-xl focus-visible:ring-[#E85A4F]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 rounded-2xl bg-[#E85A4F] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#C94A40] transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              SAVING PROFILE...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              SAVE LNJPIT PROFILE
            </>
          )}
        </button>
      </div>
    </form>
  );
}

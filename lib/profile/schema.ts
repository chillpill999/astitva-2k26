// ============================================================================
// ASTITVA 2K26 - Profile Validation Schemas & Types
// Path: lib/profile/schema.ts
// ============================================================================

import { z } from "zod";

export const BranchEnum = z.enum(["CSE", "ME", "CE", "EE", "FPP", "MC", "OTHER"], {
  errorMap: () => ({ message: "Please select a valid LNJPIT branch" }),
});

export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"], {
  errorMap: () => ({ message: "Please select a valid gender" }),
});

export const TshirtSizeEnum = z.enum(["S", "M", "L", "XL", "XXL"], {
  errorMap: () => ({ message: "Please select a valid T-shirt size (S, M, L, XL, XXL)" }),
});

export const LNJPIT_HOSTELS = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "GH1",
  "GH2",
] as const;

export const BRANCH_METADATA: Record<
  z.infer<typeof BranchEnum>,
  {
    name: string;
    code: string;
    color: string;
    badgeClass: string;
    icon: string;
  }
> = {
  CSE: {
    name: "Computer Science & Engineering",
    code: "CSE",
    color: "#06b6d4",
    badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    icon: "Laptop",
  },
  ME: {
    name: "Mechanical Engineering",
    code: "ME",
    color: "#f97316",
    badgeClass: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    icon: "Cog",
  },
  CE: {
    name: "Civil Engineering",
    code: "CE",
    color: "#f59e0b",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    icon: "Building",
  },
  EE: {
    name: "Electrical Engineering",
    code: "EE",
    color: "#eab308",
    badgeClass: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    icon: "Zap",
  },
  FPP: {
    name: "Food Processing & Preservation",
    code: "FPP",
    color: "#10b981",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    icon: "Utensils",
  },
  MC: {
    name: "Mathematics and Computing",
    code: "MC",
    color: "#a855f7",
    badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    icon: "Calculator",
  },
  OTHER: {
    name: "Applied Science & Humanities / Faculty",
    code: "OTHER",
    color: "#94a3b8",
    badgeClass: "bg-slate-500/10 text-slate-400 border-slate-500/30",
    icon: "GraduationCap",
  },
};

/**
 * Core Profile Form Validation Schema
 */
export const ProfileFormSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full Name must be at least 2 characters")
      .max(100, "Full Name cannot exceed 100 characters"),

    collegeId: z
      .string()
      .trim()
      .min(3, "College Roll / Registration number must be at least 3 characters")
      .max(30, "College Roll / Registration number cannot exceed 30 characters"),

    collegeName: z.string().trim().default("LNJPIT Chapra"),

    branch: BranchEnum,

    semester: z.coerce
      .number()
      .int()
      .min(1, "Semester must be between 1 and 8")
      .max(8, "Semester must be between 1 and 8"),

    phone: z
      .string()
      .trim()
      .regex(/^(?:\+91|0)?[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),

    gender: GenderEnum,

    isHosteler: z.boolean().default(false),

    hostelName: z.string().trim().max(100).optional().nullable(),

    roomNumber: z.string().trim().max(20).optional().nullable(),

    emergencyContact: z
      .string()
      .trim()
      .regex(/^(?:\+91|0)?[6-9]\d{9}$/, "Emergency contact must be a valid 10-digit mobile number")
      .optional()
      .nullable()
      .or(z.literal("")),

    tshirtSize: TshirtSizeEnum.default("L"),

    bio: z.string().trim().max(300, "Bio cannot exceed 300 characters").optional().nullable(),

    avatarUrl: z.string().trim().optional().nullable().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.isHosteler && (!data.hostelName || data.hostelName.trim().length === 0)) {
        return false;
      }
      return true;
    },
    {
      message: "Please select your hostel name",
      path: ["hostelName"],
    }
  );

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

/**
 * Avatar File Upload Validation Schema
 */
export const AvatarUploadSchema = z.object({
  size: z.number().max(5 * 1024 * 1024, "Image file size must be less than 5MB"),
  type: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"], {
    errorMap: () => ({ message: "Only JPG, PNG, WebP, and GIF images are supported" }),
  }),
});

/**
 * Extended Participant Pass Data Type
 */
export interface ParticipantPassData {
  participantId: string;
  userId: string;
  fullName: string;
  email: string;
  role: string;
  collegeId: string;
  collegeName: string;
  branch: z.infer<typeof BranchEnum>;
  semester: number;
  phone: string;
  gender: z.infer<typeof GenderEnum>;
  isHosteler: boolean;
  hostelName?: string | null;
  roomNumber?: string | null;
  tshirtSize: z.infer<typeof TshirtSizeEnum>;
  avatarUrl?: string | null;
  qrPassToken?: string | null;
  qrCodeDataUrl?: string | null;
  registeredEventsCount: number;
  registeredEvents: Array<{
    id: string;
    title: string;
    category: string;
    venue: string;
    scheduleStart: string;
    status: string;
    teamName?: string | null;
  }>;
  teamsCount: number;
  certificatesCount: number;
  profileCompletionPercentage: number;
}

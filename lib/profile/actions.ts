// ============================================================================
// ASTITVA 2K26 - Profile Server Actions
// Path: lib/profile/actions.ts
// ============================================================================

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import {
  ProfileFormSchema,
  ProfileFormValues,
  ParticipantPassData,
  BranchEnum,
  GenderEnum,
  TshirtSizeEnum,
} from "./schema";
import { generateNextParticipantId, isValidParticipantId } from "./id-generator";
import { cookies } from "next/headers";
import QRCode from "qrcode";
import * as crypto from "crypto";
import { verifyJWT, SESSION_COOKIE_NAME, getJwtSecret } from "@/lib/auth/jwt";
import { SessionUser } from "@/lib/auth/types";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: Record<string, string[]>;
}

/**
 * Internal Helper: Get active authenticated user ID from session.
 */
async function getAuthUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    
    // 1. Check primary JWT session cookie
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      const payload = await verifyJWT<SessionUser>(token, getJwtSecret());
      if (payload?.id) return payload.id;
    }

    // 2. Check mock user cookie
    const mockAuthCookie = cookieStore.get("astitva_mock_user");
    if (mockAuthCookie?.value) {
      try {
        const parsed = JSON.parse(mockAuthCookie.value);
        if (parsed?.id) return parsed.id;
      } catch {
        // invalid JSON
      }
    }

    // 3. Fallback to participant in development
    if (process.env.NODE_ENV === "development") {
      const demoUser = await prisma.user.findFirst({
        where: { email: "participant@lnjpit.ac.in" },
        select: { id: true },
      });
      return demoUser?.id ?? "usr_part_005";
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Generates an encrypted HMAC-SHA256 QR Pass Token.
 */
function createQRPayloadToken(payload: {
  participantId: string;
  userId: string;
  collegeId: string;
  name: string;
  branch: string;
}): string {
  const secret = process.env.QR_SECRET_KEY || process.env.NEXTAUTH_SECRET || "ASTITVA_2K26_HMAC_SECRET_LNJPIT";
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "AST26_PASS" })).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      ts: Date.now(),
      exp: new Date("2026-09-10T00:00:00Z").getTime(),
    })
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64url");

  return `AST26.${header}.${body}.${signature}`;
}

/**
 * Calculates profile completion percentage (0 - 100).
 */
function calculateProfileCompletion(user: {
  name: string;
  avatarUrl: string | null;
  profile: {
    collegeId: string;
    branch: string;
    semester: number;
    phone: string;
    gender: string;
    bio?: string | null;
    isHosteler: boolean;
    hostelName?: string | null;
  } | null;
}): number {
  if (!user.profile) return 20;

  let score = 0;
  if (user.name && user.name.length > 2) score += 15;
  if (user.avatarUrl) score += 15;
  if (user.profile.collegeId && user.profile.collegeId !== "TBD") score += 20;
  if (user.profile.branch) score += 15;
  if (user.profile.semester > 0) score += 10;
  if (user.profile.phone && user.profile.phone !== "9999999999") score += 10;
  if (user.profile.gender) score += 5;
  if (user.profile.bio) score += 5;
  if (!user.profile.isHosteler || user.profile.hostelName) score += 5;

  return Math.min(100, score);
}

/**
 * Fetch full profile and participant pass data.
 */
export async function getProfile(userId?: string): Promise<ActionResult<ParticipantPassData>> {
  try {
    const targetUserId = userId || (await getAuthUserId());

    if (!targetUserId) {
      return { success: false, error: "Unauthorized. Please sign in to view profile." };
    }

    let user = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        profile: true,
        registrations: {
          include: {
            event: {
              include: { category: true },
            },
            team: true,
          },
          orderBy: { createdAt: "desc" },
        },
        teamMemberships: {
          include: {
            team: {
              include: { event: true },
            },
          },
        },
        certificates: true,
      },
    });

    if (!user) {
      return { success: false, error: "User record not found." };
    }

    let profile = user.profile;
    if (!profile) {
      const newParticipantId = await generateNextParticipantId();
      const newPassToken = createQRPayloadToken({
        participantId: newParticipantId,
        userId: user.id,
        collegeId: "TBD",
        name: user.name,
        branch: "OTHER",
      });

      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          participantId: newParticipantId,
          collegeId: "TBD",
          collegeName: "LNJPIT Chapra",
          branch: "OTHER",
          semester: 1,
          phone: "9999999999",
          gender: "OTHER",
          qrPassToken: newPassToken,
        },
      });

      user = { ...user, profile };
    }

    // Generate Scannable QR Code Data URL
    const passToken = profile.qrPassToken || `AST26.${profile.participantId}.${user.id}`;
    let qrCodeDataUrl: string | null = null;
    try {
      qrCodeDataUrl = await QRCode.toDataURL(passToken, {
        errorCorrectionLevel: "H",
        margin: 1,
        color: {
          dark: "#06b6d4",
          light: "#030712",
        },
        width: 320,
      });
    } catch {
      qrCodeDataUrl = null;
    }

    // Extract T-Shirt size from bio if encoded as JSON, or default to L
    let parsedTshirt: (typeof TshirtSizeEnum)["_type"] = "L";
    let cleanBio = profile.bio || "";
    if (cleanBio.startsWith("{") && cleanBio.includes('"tshirt"')) {
      try {
        const meta = JSON.parse(cleanBio);
        if (meta.tshirt) parsedTshirt = meta.tshirt;
        cleanBio = meta.bio || "";
      } catch {
        // ignore parse error
      }
    }

    const completionPercentage = calculateProfileCompletion(user);

    const passData: ParticipantPassData = {
      participantId: profile.participantId,
      userId: user.id,
      fullName: user.name,
      email: user.email,
      role: user.role,
      collegeId: profile.collegeId,
      collegeName: profile.collegeName,
      branch: profile.branch as (typeof BranchEnum)["_type"],
      semester: profile.semester,
      phone: profile.phone,
      gender: profile.gender as (typeof GenderEnum)["_type"],
      isHosteler: profile.isHosteler,
      hostelName: profile.hostelName,
      roomNumber: profile.roomNumber,
      tshirtSize: parsedTshirt,
      avatarUrl: user.avatarUrl,
      qrPassToken: passToken,
      qrCodeDataUrl,
      registeredEventsCount: user.registrations.length,
      registeredEvents: user.registrations.map((reg) => ({
        id: reg.event.id,
        title: reg.event.title,
        category: reg.event.category.name,
        venue: reg.event.venue,
        scheduleStart: reg.event.scheduleStart.toISOString(),
        status: reg.status,
        teamName: reg.team?.name || null,
      })),
      teamsCount: user.teamMemberships.length,
      certificatesCount: user.certificates.length,
      profileCompletionPercentage: completionPercentage,
    };

    return {
      success: true,
      data: passData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load profile data",
    };
  }
}

/**
 * Update Profile Server Action.
 */
export async function updateProfile(
  formData: ProfileFormValues
): Promise<ActionResult<ParticipantPassData>> {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    // 1. Validate Form Schema
    const validation = ProfileFormSchema.safeParse(formData);
    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed. Please correct the highlighted fields.",
        validationErrors: validation.error.flatten().fieldErrors,
      };
    }

    const data = validation.data;

    // 2. Check College Roll Number collision with other users
    const existingRoll = await prisma.profile.findFirst({
      where: {
        collegeId: data.collegeId,
        userId: { not: userId },
      },
    });

    if (existingRoll) {
      return {
        success: false,
        error: `College Roll Number '${data.collegeId}' is already registered by another student.`,
        validationErrors: {
          collegeId: ["This roll number is already in use by another account."],
        },
      };
    }

    // 3. Retrieve or create Participant ID & QR Pass Token
    const currentProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    let participantId = currentProfile?.participantId;
    if (!participantId || !isValidParticipantId(participantId)) {
      participantId = await generateNextParticipantId();
    }

    const qrPassToken = createQRPayloadToken({
      participantId,
      userId,
      collegeId: data.collegeId,
      name: data.fullName,
      branch: data.branch,
    });

    // Package bio with t-shirt metadata
    const bioMetadata = JSON.stringify({
      tshirt: data.tshirtSize,
      bio: data.bio || "",
    });

    // 4. Atomic Database Update
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          name: data.fullName,
          avatarUrl: data.avatarUrl || undefined,
        },
      });

      await tx.profile.upsert({
        where: { userId },
        create: {
          userId,
          participantId,
          collegeId: data.collegeId,
          collegeName: data.collegeName,
          branch: data.branch,
          semester: data.semester,
          phone: data.phone,
          gender: data.gender,
          isHosteler: data.isHosteler,
          hostelName: data.isHosteler ? data.hostelName : null,
          roomNumber: data.isHosteler ? data.roomNumber : null,
          emergencyContact: data.emergencyContact || null,
          bio: bioMetadata,
          qrPassToken,
        },
        update: {
          collegeId: data.collegeId,
          collegeName: data.collegeName,
          branch: data.branch,
          semester: data.semester,
          phone: data.phone,
          gender: data.gender,
          isHosteler: data.isHosteler,
          hostelName: data.isHosteler ? data.hostelName : null,
          roomNumber: data.isHosteler ? data.roomNumber : null,
          emergencyContact: data.emergencyContact || null,
          bio: bioMetadata,
          qrPassToken,
        },
      });
    });

    // 5. Revalidate paths
    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/participant");

    return await getProfile(userId);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

/**
 * Upload Avatar Server Action (Base64 data URL for instant zero-config storage).
 */
export async function uploadAvatar(
  formData: FormData
): Promise<ActionResult<{ avatarUrl: string }>> {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const file = formData.get("avatar") as File | null;
    if (!file) {
      return { success: false, error: "No image file provided" };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File size exceeds 5MB limit" };
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return { success: false, error: "Invalid image type. Use JPG, PNG, WebP or GIF." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const avatarUrl = `data:${file.type};base64,${base64}`;

    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: { avatarUrl },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload avatar",
    };
  }
}

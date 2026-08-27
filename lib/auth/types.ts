// ============================================================================
// ASTITVA 2K26 - Authentication & RBAC Core Types
// Path: lib/auth/types.ts
// ============================================================================

import { Role as PrismaRole, Branch as PrismaBranch, Gender as PrismaGender } from "@prisma/client";

export type Role = PrismaRole;
export type Branch = PrismaBranch;
export type Gender = PrismaGender;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  participantId?: string; // e.g. "AST26-0001"
  collegeId?: string;     // e.g. "24105128032"
  collegeName?: string;   // "LNJPIT Chapra"
  branch?: Branch;
  semester?: number;
  phone?: string;
  gender?: Gender;
  isHosteler?: boolean;
  hostelName?: string | null;
  roomNumber?: string | null;
  avatarUrl?: string | null;
  clerkId?: string | null;
}

export interface JWTPayload extends SessionUser {
  iat: number;
  exp: number;
}

export interface DemoUserAccount {
  id: string;
  email: string;
  name: string;
  role: Role;
  participantId: string;
  collegeId: string;
  branch: Branch;
  semester: number;
  phone: string;
  gender: Gender;
  isHosteler: boolean;
  hostelName?: string;
  roomNumber?: string;
  bio: string;
  avatarUrl: string;
  redirectPath: string;
  badgeColor: string;
}

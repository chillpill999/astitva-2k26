// ============================================================================
// ASTITVA 2K26 - Team Interfaces & TypeScript Types
// Path: lib/teams/types.ts
// ============================================================================

export type TeamStatus = "FORMING" | "READY" | "REGISTERED" | "DISQUALIFIED";
export type TeamMemberRole = "CAPTAIN" | "MEMBER";
export type MemberStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface TeamMemberData {
  id: string;
  teamId: string;
  userId: string;
  role: TeamMemberRole;
  status: MemberStatus;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
    profile?: {
      participantId: string;
      collegeId: string;
      collegeName: string;
      branch: string;
      semester: number;
      phone: string;
      isHosteler: boolean;
    } | null;
  };
}

export interface TeamData {
  id: string;
  name: string;
  code: string;
  eventId: string;
  captainId: string;
  minMembers: number;
  maxMembers: number;
  status: TeamStatus;
  createdAt: string;
  updatedAt: string;
  event?: {
    id: string;
    slug: string;
    title: string;
    venue: string;
    scheduleStart: string;
    category?: {
      id: string;
      name: string;
      slug: string;
      icon?: string;
    } | null;
  } | null;
  captain?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  } | null;
  members: TeamMemberData[];
  approvedMemberCount: number;
  isCaptain?: boolean;
  isMember?: boolean;
  registrationNumber?: string | null;
}

export interface TeamActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: Record<string, string[]>;
}

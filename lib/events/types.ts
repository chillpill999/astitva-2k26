// ============================================================================
// ASTITVA 2K26 - Event Interfaces & TypeScript Types
// Path: lib/events/types.ts
// ============================================================================

export type EventType = "INDIVIDUAL" | "TEAM";
export type EventStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "REGISTRATION_OPEN"
  | "REGISTRATION_CLOSED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED";

export type RegistrationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED"
  | "ATTENDED";

export interface EventCategory {
  id: string;
  slug: string;
  name: string;
  type?: string;
  description?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

export interface EventCoordinator {
  id?: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  department?: string | null;
  role?: string | null;
}

export interface EventDetailData {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description: string;
  rules: string;
  categoryId: string;
  category?: EventCategory | null;
  venue: string;
  eventType: EventType;
  minTeamSize: number;
  maxTeamSize: number;
  registrationFee: number;
  maxRegistrations: number;
  currentRegistrations: number;
  prizePool: number;
  firstPrize?: string | null;
  secondPrize?: string | null;
  thirdPrize?: string | null;
  scheduleStart: string;
  scheduleEnd: string;
  dayNumber: number;
  status: EventStatus;
  isFeatured: boolean;
  bannerImage?: string | null;
  coordinatorId?: string | null;
  coordinator?: EventCoordinator | null;
  coordinatorName?: string | null;
  coordinatorPhone?: string | null;
  coordinatorEmail?: string | null;
  userRegistration?: {
    id: string;
    registrationNumber: string;
    status: RegistrationStatus;
    qrTicketCode?: string | null;
    createdAt: string;
    teamId?: string | null;
    teamName?: string | null;
  } | null;
  userTeam?: {
    id: string;
    name: string;
    code: string;
    role: "CAPTAIN" | "MEMBER";
    status: string;
    memberCount: number;
    maxMembers: number;
    minMembers: number;
  } | null;
}

export interface RegistrationData {
  id: string;
  eventId: string;
  userId: string;
  teamId?: string | null;
  status: RegistrationStatus;
  registrationNumber: string;
  qrTicketCode?: string | null;
  createdAt: string;
  eventTitle?: string;
  venue?: string;
}

export interface EventActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: Record<string, string[]>;
}

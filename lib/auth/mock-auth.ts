// ============================================================================
// ASTITVA 2K26 - Mock Authentication & Demo Accounts Engine
// Path: lib/auth/mock-auth.ts
// ============================================================================

import { Role, DemoUserAccount, SessionUser } from "./types";
import { signJWT, SESSION_COOKIE_NAME, SESSION_EXPIRY_SECONDS } from "./jwt";

export const DEMO_USERS: Record<Role, DemoUserAccount> = {
  ADMIN: {
    id: "usr_admin_001",
    email: "admin@lnjpit.ac.in",
    name: "Dr. Shailendra Kumar",
    role: "ADMIN",
    participantId: "AST26-0001",
    collegeId: "LNJPIT-ADMIN-01",
    branch: "CSE",
    semester: 8,
    phone: "+91 98765 43210",
    gender: "MALE",
    isHosteler: false,
    bio: "Principal & Chief Patron, ASTITVA 2K26, LNJPIT Chapra.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    redirectPath: "/dashboard/admin",
    badgeColor: "rose",
  },
  EVENT_COORDINATOR: {
    id: "usr_coord_002",
    email: "coordinator@lnjpit.ac.in",
    name: "Prof. Rajesh Ranjan",
    role: "EVENT_COORDINATOR",
    participantId: "AST26-0002",
    collegeId: "LNJPIT-FAC-042",
    branch: "ECE",
    semester: 8,
    phone: "+91 98765 43211",
    gender: "MALE",
    isHosteler: false,
    bio: "Head Event Coordinator for Sports & Cultural streams.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    redirectPath: "/dashboard/coordinator",
    badgeColor: "purple",
  },
  VOLUNTEER: {
    id: "usr_vol_003",
    email: "volunteer@lnjpit.ac.in",
    name: "Ananya Sharma",
    role: "VOLUNTEER",
    participantId: "AST26-0003",
    collegeId: "23105128014",
    branch: "EE",
    semester: 4,
    phone: "+91 98765 43212",
    gender: "FEMALE",
    isHosteler: true,
    hostelName: "Gargi Girls Hostel",
    roomNumber: "G-204",
    bio: "Lead Volunteer for QR Attendance Verification & Stage Logistics.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    redirectPath: "/dashboard/volunteer",
    badgeColor: "amber",
  },
  TEAM_CAPTAIN: {
    id: "usr_capt_004",
    email: "captain@lnjpit.ac.in",
    name: "Aman Verma",
    role: "TEAM_CAPTAIN",
    participantId: "AST26-0004",
    collegeId: "22105128005",
    branch: "ME",
    semester: 6,
    phone: "+91 98765 43213",
    gender: "MALE",
    isHosteler: true,
    hostelName: "Aryabhata Boys Hostel",
    roomNumber: "A-112",
    bio: "Captain of LNJPIT Titans Cricket Squad & Alpha BGMI Warriors.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    redirectPath: "/dashboard/captain",
    badgeColor: "cyan",
  },
  PARTICIPANT: {
    id: "usr_part_005",
    email: "participant@lnjpit.ac.in",
    name: "Sneha Kumari",
    role: "PARTICIPANT",
    participantId: "AST26-0005",
    collegeId: "24105128032",
    branch: "CE",
    semester: 2,
    phone: "+91 98765 43214",
    gender: "FEMALE",
    isHosteler: false,
    bio: "Participant in Tark-Vitark Debate, Singing, and Chess competitions.",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    redirectPath: "/dashboard/participant",
    badgeColor: "blue",
  },
};

export function getDemoUserByRole(role: Role): DemoUserAccount {
  return DEMO_USERS[role] || DEMO_USERS.PARTICIPANT;
}

export function getDemoUserByEmail(email: string): DemoUserAccount | undefined {
  return Object.values(DEMO_USERS).find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

export function getAllDemoUsers(): DemoUserAccount[] {
  return Object.values(DEMO_USERS);
}

export async function createMockSessionToken(user: SessionUser): Promise<string> {
  return signJWT(user);
}

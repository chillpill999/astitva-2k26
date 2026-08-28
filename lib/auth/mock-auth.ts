// ============================================================================
// ASTITVA 2K26 - Development Mock Authentication Engine
// Path: lib/auth/mock-auth.ts
//
// These accounts are STRICTLY development fixtures used to exercise the role
// gates, dashboards, scanner flows, and E2E test harness in environments
// where Clerk has not been configured. They:
//
//   - Are never used in production (the Clerk adapter takes over when
//     NEXT_PUBLIC_AUTH_PROVIDER="clerk").
//   - Use clearly labelled, non-personally-identifying display names.
//   - Do not appear in the production database (the seed file is gated by
//     NODE_ENV=development).
//
// To replace this with real authentication, set
// NEXT_PUBLIC_AUTH_PROVIDER="clerk" and configure Clerk keys in .env.
// ============================================================================

import { Role, DemoUserAccount, SessionUser } from "./types";
import { signJWT } from "./jwt";

const DEV_LABEL = "Development Account";

export const DEMO_USERS: Record<Role, DemoUserAccount> = {
  ADMIN: {
    id: "usr_dev_admin",
    email: "dev-admin@lnjpit.local",
    name: `${DEV_LABEL} · Admin`,
    role: "ADMIN",
    participantId: "AST26-DEV-A1",
    collegeId: "DEV-ADMIN",
    branch: "CSE",
    semester: 1,
    phone: "",
    gender: "OTHER",
    isHosteler: false,
    bio: "Development fixture used to exercise admin role flows.",
    avatarUrl: null,
    redirectPath: "/dashboard/admin",
    badgeColor: "rose",
  },
  EVENT_COORDINATOR: {
    id: "usr_dev_coordinator",
    email: "dev-coordinator@lnjpit.local",
    name: `${DEV_LABEL} · Coordinator`,
    role: "EVENT_COORDINATOR",
    participantId: "AST26-DEV-C1",
    collegeId: "DEV-COORD",
    branch: "CSE",
    semester: 1,
    phone: "",
    gender: "OTHER",
    isHosteler: false,
    bio: "Development fixture used to exercise coordinator role flows.",
    avatarUrl: null,
    redirectPath: "/dashboard/coordinator",
    badgeColor: "purple",
  },
  VOLUNTEER: {
    id: "usr_dev_volunteer",
    email: "dev-volunteer@lnjpit.local",
    name: `${DEV_LABEL} · Volunteer`,
    role: "VOLUNTEER",
    participantId: "AST26-DEV-V1",
    collegeId: "DEV-VOL",
    branch: "CSE",
    semester: 1,
    phone: "",
    gender: "OTHER",
    isHosteler: false,
    bio: "Development fixture used to exercise volunteer scanner flows.",
    avatarUrl: null,
    redirectPath: "/dashboard/volunteer",
    badgeColor: "amber",
  },
  TEAM_CAPTAIN: {
    id: "usr_dev_captain",
    email: "dev-captain@lnjpit.local",
    name: `${DEV_LABEL} · Captain`,
    role: "TEAM_CAPTAIN",
    participantId: "AST26-DEV-T1",
    collegeId: "DEV-CAPT",
    branch: "CSE",
    semester: 1,
    phone: "",
    gender: "OTHER",
    isHosteler: false,
    bio: "Development fixture used to exercise team captain flows.",
    avatarUrl: null,
    redirectPath: "/dashboard/captain",
    badgeColor: "cyan",
  },
  PARTICIPANT: {
    id: "usr_dev_participant",
    email: "dev-participant@lnjpit.local",
    name: `${DEV_LABEL} · Participant`,
    role: "PARTICIPANT",
    participantId: "AST26-DEV-P1",
    collegeId: "DEV-PART",
    branch: "CSE",
    semester: 1,
    phone: "",
    gender: "OTHER",
    isHosteler: false,
    bio: "Development fixture used to exercise participant flows.",
    avatarUrl: null,
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

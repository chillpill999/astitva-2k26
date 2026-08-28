// ============================================================================
// ASTITVA 2K26 - Database Seed
// Path: prisma/seed.ts
//
// This file inserts the bare-minimum structural rows required for the
// development and test environments to function. It intentionally does NOT
// create fabricated events, sponsors, coordinator names,
// team names, gallery images, or announcements. All such content must be
// created in the admin dashboard by an authorized user.
//
// The development account fixture below is used by:
//   - lib/auth/mock-auth.ts (DEV-only login flow)
//   - components/dashboard/DevRoleSwitcher.tsx (role-switching in dev)
//   - tests/m5/attendance-integration.test.ts (integration fixtures)
//
// In production set NEXT_PUBLIC_AUTH_PROVIDER="clerk" and the mock auth
// path is bypassed entirely.
// ============================================================================

import { PrismaClient, Role, Branch, Gender } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("ASTITVA 2K26 - Seeding bare-minimum dev fixtures...");

  // Clean existing data in cascade-safe order.
  await prisma.aiChatMessage.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.result.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.checkInLog.deleteMany({});
  await prisma.registration.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.qrPass.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.sponsor.deleteMany({});
  await prisma.faq.deleteMany({});
  await prisma.galleryItem.deleteMany({});
  await prisma.committeeMember.deleteMany({});
  await prisma.rateLimitEntry.deleteMany({});

  // --------------------------------------------------------------------------
  // 1. Development account fixtures (DEV ONLY — not for production use)
  // --------------------------------------------------------------------------
  console.log("Seeding 5 development account fixtures...");
  const defaultPasswordHash = await bcrypt.hash("Password@123", 10);

  const fixtures = [
    {
      id: "usr_dev_admin",
      email: "dev-admin@lnjpit.local",
      name: "Development Account · Admin",
      role: Role.ADMIN,
      profile: {
        participantId: "AST26-DEV-A1",
        collegeId: "DEV-ADMIN",
        branch: Branch.CSE,
        semester: 1,
        gender: Gender.OTHER,
        bio: "Development fixture.",
      },
    },
    {
      id: "usr_dev_coordinator",
      email: "dev-coordinator@lnjpit.local",
      name: "Development Account · Coordinator",
      role: Role.EVENT_COORDINATOR,
      profile: {
        participantId: "AST26-DEV-C1",
        collegeId: "DEV-COORD",
        branch: Branch.CSE,
        semester: 1,
        gender: Gender.OTHER,
        bio: "Development fixture.",
      },
    },
    {
      id: "usr_dev_volunteer",
      email: "dev-volunteer@lnjpit.local",
      name: "Development Account · Volunteer",
      role: Role.VOLUNTEER,
      profile: {
        participantId: "AST26-DEV-V1",
        collegeId: "DEV-VOL",
        branch: Branch.CSE,
        semester: 1,
        gender: Gender.OTHER,
        bio: "Development fixture.",
      },
    },
    {
      id: "usr_dev_captain",
      email: "dev-captain@lnjpit.local",
      name: "Development Account · Captain",
      role: Role.TEAM_CAPTAIN,
      profile: {
        participantId: "AST26-DEV-T1",
        collegeId: "DEV-CAPT",
        branch: Branch.CSE,
        semester: 1,
        gender: Gender.OTHER,
        bio: "Development fixture.",
      },
    },
    {
      id: "usr_dev_participant",
      email: "dev-participant@lnjpit.local",
      name: "Development Account · Participant",
      role: Role.PARTICIPANT,
      profile: {
        participantId: "AST26-DEV-P1",
        collegeId: "DEV-PART",
        branch: Branch.CSE,
        semester: 1,
        gender: Gender.OTHER,
        bio: "Development fixture.",
      },
    },
  ];

  for (const f of fixtures) {
    await prisma.user.create({
      data: {
        id: f.id,
        email: f.email,
        name: f.name,
        role: f.role,
        passwordHash: defaultPasswordHash,
        isActive: true,
        profile: {
          create: {
            participantId: f.profile.participantId,
            collegeId: f.profile.collegeId,
            collegeName: "LNJPIT Chapra",
            branch: f.profile.branch,
            semester: f.profile.semester,
            phone: "",
            gender: f.profile.gender,
            isHosteler: false,
            bio: f.profile.bio,
          },
        },
      },
    });
  }

  // --------------------------------------------------------------------------
  // Note: Events, sponsors, FAQs, gallery items, and announcements are NOT
  // pre-populated. They must be created through the admin dashboard by an
  // authorized admin/coordinator user. This is intentional to keep the
  // platform free of fabricated festival content until the organizing
  // committee publishes real data.
  // --------------------------------------------------------------------------

  console.log("Seed complete. 5 dev accounts created. No fabricated content.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

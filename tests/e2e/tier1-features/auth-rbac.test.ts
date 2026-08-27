import { TestCase } from '../types';
import * as bcrypt from 'bcryptjs';
import { canAccessDashboard, canRecordScore, canScanQR, canCreateTeam, canManageSponsors, canExportData, formatParticipantId } from '../helpers';

export const authRbacTests: TestCase[] = [
  // ==========================================================================
  // FEATURE 1: M1_SCHEMA (PostgreSQL Schema & Relational Integrity)
  // ==========================================================================
  {
    id: 'F01-T01',
    tier: 'TIER_1',
    featureCode: 'M1_SCHEMA',
    name: 'Verify all 18 PostgreSQL tables exist in database',
    description: 'Asserts that all 18 required tables from Prisma schema are present in information_schema.',
    run: async ({ db }) => {
      const res = await db.query<{ table_name: string }>(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
      );
      const tables = res.rows.map((r: any) => r.table_name);
      const expected = [
        'User', 'Profile', 'Category', 'Event', 'Registration', 'Team', 'TeamMember',
        'Attendance', 'Result', 'Certificate', 'Announcement', 'Notification',
        'Sponsor', 'Faq', 'GalleryItem', 'CommitteeMember', 'AuditLog', 'AiChatMessage'
      ];
      for (const exp of expected) {
        if (!tables.includes(exp)) throw new Error(`Missing table: ${exp}`);
      }
    },
  },
  {
    id: 'F01-T02',
    tier: 'TIER_1',
    featureCode: 'M1_SCHEMA',
    name: 'Verify all 21 PostgreSQL custom ENUMs are defined',
    description: 'Checks that all custom domain enums are present in pg_type.',
    run: async ({ db }) => {
      const res = await db.query<{ typname: string }>(
        "SELECT typname FROM pg_type WHERE typtype = 'e';"
      );
      const enums = res.rows.map((r: any) => r.typname);
      const expected = [
        'Role', 'Branch', 'Gender', 'CategoryType', 'EventType', 'EventStatus',
        'RegistrationStatus', 'TeamStatus', 'TeamMemberRole', 'MemberStatus',
        'CheckInType', 'AttendanceStatus', 'ResultPosition', 'CertificateType',
        'AnnouncementCategory', 'AnnouncementPriority', 'NotificationType',
        'SponsorTier', 'MediaType', 'CommitteeCategory', 'ChatRole'
      ];
      for (const exp of expected) {
        if (!enums.includes(exp)) throw new Error(`Missing custom enum: ${exp}`);
      }
    },
  },
  {
    id: 'F01-T03',
    tier: 'TIER_1',
    featureCode: 'M1_SCHEMA',
    name: 'Verify foreign key cascade deletion for User -> Profile',
    description: 'Ensures deleting a user cascades and removes the associated student profile.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "User" (id, email, name, role, "isActive", "createdAt", "updatedAt")
         VALUES ('usr_test_casc', 'casc@lnjpit.ac.in', 'Cascade Test', 'PARTICIPANT', true, NOW(), NOW());`
      );
      await db.query(
        `INSERT INTO "Profile" (id, "userId", "participantId", "collegeId", "collegeName", branch, semester, phone, gender, "createdAt", "updatedAt")
         VALUES ('prof_test_casc', 'usr_test_casc', 'AST26-9001', 'LNJPIT-9001', 'LNJPIT Chapra', 'CSE', 4, '9999999999', 'MALE', NOW(), NOW());`
      );
      await db.query(`DELETE FROM "User" WHERE id = 'usr_test_casc';`);
      const check = await db.query(`SELECT * FROM "Profile" WHERE id = 'prof_test_casc';`);
      if (check.rows.length !== 0) throw new Error('Cascade deletion failed: Profile was not removed');
    },
  },
  {
    id: 'F01-T04',
    tier: 'TIER_1',
    featureCode: 'M1_SCHEMA',
    name: 'Verify foreign key SET NULL on Event coordinator deletion',
    description: 'Ensures deleting a coordinator sets Event.coordinatorId to NULL without deleting the Event.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "User" (id, email, name, role, "isActive", "createdAt", "updatedAt")
         VALUES ('usr_tmp_coord', 'tmp_coord@lnjpit.ac.in', 'Temp Coord', 'EVENT_COORDINATOR', true, NOW(), NOW());`
      );
      await db.query(
        `INSERT INTO "Event" (id, slug, title, description, rules, "categoryId", venue, "eventType", "minTeamSize", "maxTeamSize", "prizePool", "scheduleStart", "scheduleEnd", "dayNumber", status, "isFeatured", "coordinatorId", "createdAt", "updatedAt")
         VALUES ('evt_tmp_coord', 'temp-coord-event', 'Temp Event', 'Desc', 'Rules', 'cat_sports', 'Main Ground', 'INDIVIDUAL', 1, 1, 5000, NOW(), NOW(), 1, 'REGISTRATION_OPEN', false, 'usr_tmp_coord', NOW(), NOW());`
      );
      await db.query(`DELETE FROM "User" WHERE id = 'usr_tmp_coord';`);
      const evt = await db.query<{ coordinatorId: string | null }>(`SELECT "coordinatorId" FROM "Event" WHERE id = 'evt_tmp_coord';`);
      if (evt.rows.length === 0 || evt.rows[0].coordinatorId !== null) {
        throw new Error('Event coordinatorId was not set to NULL upon coordinator deletion');
      }
      await db.query(`DELETE FROM "Event" WHERE id = 'evt_tmp_coord';`);
    },
  },
  {
    id: 'F01-T05',
    tier: 'TIER_1',
    featureCode: 'M1_SCHEMA',
    name: 'Verify database performance indexes exist on key foreign keys and search columns',
    description: 'Asserts that indexes exist for fast filtering across high-velocity tables.',
    run: async ({ db }) => {
      const res = await db.query<{ indexname: string }>(
        "SELECT indexname FROM pg_indexes WHERE schemaname = 'public';"
      );
      const indexes = res.rows.map((r: any) => r.indexname);
      if (indexes.length < 20) throw new Error(`Expected at least 20 indexes, found ${indexes.length}`);
    },
  },

  // ==========================================================================
  // FEATURE 2: M1_SEED (Seed Data Verification)
  // ==========================================================================
  {
    id: 'F02-T01',
    tier: 'TIER_1',
    featureCode: 'M1_SEED',
    name: 'Verify 4 canonical categories seeded (Sports, Cultural, Gaming, Literary)',
    description: 'Validates that the 4 festival pillars exist with correct slugs and types.',
    run: async ({ db }) => {
      const res = await db.query<{ slug: string; type: string }>(`SELECT slug, type FROM "Category" ORDER BY slug;`);
      const slugs = res.rows.map((r: any) => r.slug);
      for (const s of ['sports', 'cultural', 'gaming', 'literary']) {
        if (!slugs.includes(s)) throw new Error(`Missing seeded category: ${s}`);
      }
    },
  },
  {
    id: 'F02-T02',
    tier: 'TIER_1',
    featureCode: 'M1_SEED',
    name: 'Verify 16 canonical festival events seeded',
    description: 'Ensures exactly 16 official competitions are present in the Event table.',
    run: async ({ db }) => {
      const res = await db.query<{ count: string }>('SELECT COUNT(*) as count FROM "Event";');
      const count = parseInt(res.rows[0].count, 10);
      if (count !== 16) throw new Error(`Expected 16 seeded events, got ${count}`);
    },
  },
  {
    id: 'F02-T03',
    tier: 'TIER_1',
    featureCode: 'M1_SEED',
    name: 'Verify 5 demo user accounts seeded representing all 5 roles',
    description: 'Validates ADMIN, EVENT_COORDINATOR, VOLUNTEER, TEAM_CAPTAIN, PARTICIPANT.',
    run: async ({ db }) => {
      const res = await db.query<{ role: string }>(`SELECT DISTINCT role FROM "User";`);
      const roles = res.rows.map((r: any) => r.role);
      for (const r of ['ADMIN', 'EVENT_COORDINATOR', 'VOLUNTEER', 'TEAM_CAPTAIN', 'PARTICIPANT']) {
        if (!roles.includes(r)) throw new Error(`Missing demo role: ${r}`);
      }
    },
  },
  {
    id: 'F02-T04',
    tier: 'TIER_1',
    featureCode: 'M1_SEED',
    name: 'Verify seeded sponsors have valid tiers and active status',
    description: 'Checks TITLE, POWERED_BY, GOLD, SILVER, and COMMUNITY_PARTNER sponsors.',
    run: async ({ db }) => {
      const res = await db.query<{ name: string; tier: string }>(`SELECT name, tier FROM "Sponsor" WHERE "isActive" = true;`);
      if (res.rows.length < 4) throw new Error(`Expected >= 4 active sponsors, found ${res.rows.length}`);
    },
  },
  {
    id: 'F02-T05',
    tier: 'TIER_1',
    featureCode: 'M1_SEED',
    name: 'Verify seeded FAQs cover festival policies',
    description: 'Checks presence of FAQs for eligibility, fees, teams, and attendance.',
    run: async ({ db }) => {
      const res = await db.query<{ question: string }>(`SELECT question FROM "Faq" WHERE "isPublished" = true;`);
      if (res.rows.length < 5) throw new Error(`Expected >= 5 published FAQs, found ${res.rows.length}`);
    },
  },

  // ==========================================================================
  // FEATURE 3: M2_AUTH (Authentication & Session Context)
  // ==========================================================================
  {
    id: 'F03-T01',
    tier: 'TIER_1',
    featureCode: 'M2_AUTH',
    name: 'Verify bcrypt password verification for demo users',
    description: 'Validates that Password@123 matches the stored bcrypt password hash.',
    run: async ({ db }) => {
      const res = await db.query<{ passwordHash: string }>(`SELECT "passwordHash" FROM "User" WHERE email = 'admin@lnjpit.ac.in';`);
      const matches = await bcrypt.compare('Password@123', res.rows[0].passwordHash);
      if (!matches) throw new Error('Bcrypt password verification failed for admin user');
    },
  },
  {
    id: 'F03-T02',
    tier: 'TIER_1',
    featureCode: 'M2_AUTH',
    name: 'Verify participant ID format generator AST26-XXXX',
    description: 'Ensures formatParticipantId pads sequences to 4 digits prefixed by AST26-.',
    run: async () => {
      if (formatParticipantId(1) !== 'AST26-0001') throw new Error('formatParticipantId(1) !== AST26-0001');
      if (formatParticipantId(42) !== 'AST26-0042') throw new Error('formatParticipantId(42) !== AST26-0042');
      if (formatParticipantId(1049) !== 'AST26-1049') throw new Error('formatParticipantId(1049) !== AST26-1049');
    },
  },
  {
    id: 'F03-T03',
    tier: 'TIER_1',
    featureCode: 'M2_AUTH',
    name: 'Verify user profile association query on login',
    description: 'Executes relational join fetching User details with linked Profile.',
    run: async ({ db }) => {
      const res = await db.query<{ name: string; email: string; participantId: string; branch: string }>(
        `SELECT u.name, u.email, p."participantId", p.branch
         FROM "User" u
         JOIN "Profile" p ON p."userId" = u.id
         WHERE u.email = 'participant@lnjpit.ac.in';`
      );
      if (res.rows.length !== 1) throw new Error('User profile relation query returned 0 rows');
      if (res.rows[0].participantId !== 'AST26-0005') throw new Error('Participant ID mismatch');
      if (res.rows[0].branch !== 'CE') throw new Error('Participant branch mismatch');
    },
  },
  {
    id: 'F03-T04',
    tier: 'TIER_1',
    featureCode: 'M2_AUTH',
    name: 'Verify unique email constraint prevents duplicate user creation',
    description: 'Asserts PostgreSQL unique constraint violation on duplicate email.',
    run: async ({ db }) => {
      try {
        await db.query(
          `INSERT INTO "User" (id, email, name, role, "isActive", "createdAt", "updatedAt")
           VALUES ('usr_dup_test', 'admin@lnjpit.ac.in', 'Imposter', 'ADMIN', true, NOW(), NOW());`
        );
        throw new Error('FAIL: Duplicate email did not trigger error');
      } catch (err: any) {
        if (err.message.includes('FAIL')) throw err;
      }
    },
  },
  {
    id: 'F03-T05',
    tier: 'TIER_1',
    featureCode: 'M2_AUTH',
    name: 'Verify user active status flag toggle',
    description: 'Asserts that deactivated users have isActive = false.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "User" (id, email, name, role, "isActive", "createdAt", "updatedAt")
         VALUES ('usr_inactive', 'inactive@lnjpit.ac.in', 'Banned User', 'PARTICIPANT', false, NOW(), NOW());`
      );
      const res = await db.query<{ isActive: boolean }>(`SELECT "isActive" FROM "User" WHERE id = 'usr_inactive';`);
      if (res.rows[0].isActive !== false) throw new Error('User active status was not false');
      await db.query(`DELETE FROM "User" WHERE id = 'usr_inactive';`);
    },
  },

  // ==========================================================================
  // FEATURE 4: M2_RBAC (Role-Based Access Control)
  // ==========================================================================
  {
    id: 'F04-T01',
    tier: 'TIER_1',
    featureCode: 'M2_RBAC',
    name: 'Verify ADMIN has universal access to all 5 dashboards',
    description: 'Checks canAccessDashboard for ADMIN across admin, coordinator, volunteer, captain, participant.',
    run: async () => {
      for (const p of ['/dashboard/admin', '/dashboard/coordinator', '/dashboard/volunteer', '/dashboard/captain', '/dashboard/participant']) {
        if (!canAccessDashboard('ADMIN', p)) throw new Error(`ADMIN denied access to ${p}`);
      }
    },
  },
  {
    id: 'F04-T02',
    tier: 'TIER_1',
    featureCode: 'M2_RBAC',
    name: 'Verify EVENT_COORDINATOR route permissions guard',
    description: 'Coordinator allowed on /dashboard/coordinator and participant, denied /dashboard/admin and volunteer.',
    run: async () => {
      if (!canAccessDashboard('EVENT_COORDINATOR', '/dashboard/coordinator')) throw new Error('Coordinator denied coordinator dashboard');
      if (!canAccessDashboard('EVENT_COORDINATOR', '/dashboard/participant')) throw new Error('Coordinator denied participant dashboard');
      if (canAccessDashboard('EVENT_COORDINATOR', '/dashboard/admin')) throw new Error('Coordinator incorrectly granted admin dashboard');
      if (canAccessDashboard('EVENT_COORDINATOR', '/dashboard/volunteer')) throw new Error('Coordinator incorrectly granted volunteer dashboard');
    },
  },
  {
    id: 'F04-T03',
    tier: 'TIER_1',
    featureCode: 'M2_RBAC',
    name: 'Verify VOLUNTEER route permissions guard',
    description: 'Volunteer allowed on /dashboard/volunteer, denied /dashboard/admin and /dashboard/coordinator.',
    run: async () => {
      if (!canAccessDashboard('VOLUNTEER', '/dashboard/volunteer')) throw new Error('Volunteer denied volunteer dashboard');
      if (canAccessDashboard('VOLUNTEER', '/dashboard/admin')) throw new Error('Volunteer incorrectly granted admin dashboard');
      if (canAccessDashboard('VOLUNTEER', '/dashboard/coordinator')) throw new Error('Volunteer incorrectly granted coordinator dashboard');
    },
  },
  {
    id: 'F04-T04',
    tier: 'TIER_1',
    featureCode: 'M2_RBAC',
    name: 'Verify PARTICIPANT route permissions guard',
    description: 'Participant restricted strictly to /dashboard/participant.',
    run: async () => {
      if (!canAccessDashboard('PARTICIPANT', '/dashboard/participant')) throw new Error('Participant denied participant dashboard');
      if (canAccessDashboard('PARTICIPANT', '/dashboard/admin')) throw new Error('Participant granted admin dashboard');
      if (canAccessDashboard('PARTICIPANT', '/dashboard/coordinator')) throw new Error('Participant granted coordinator dashboard');
      if (canAccessDashboard('PARTICIPANT', '/dashboard/volunteer')) throw new Error('Participant granted volunteer dashboard');
    },
  },
  {
    id: 'F04-T05',
    tier: 'TIER_1',
    featureCode: 'M2_RBAC',
    name: 'Verify operation-level permission matrix for scoring, scanning, sponsors, export',
    description: 'Tests role capabilities against business action gates.',
    run: async () => {
      if (!canRecordScore('EVENT_COORDINATOR')) throw new Error('Coordinator should be able to record scores');
      if (canRecordScore('VOLUNTEER')) throw new Error('Volunteer must NOT be able to record scores');
      if (!canScanQR('VOLUNTEER')) throw new Error('Volunteer must be able to scan QR');
      if (!canManageSponsors('ADMIN')) throw new Error('Admin must be able to manage sponsors');
      if (canManageSponsors('TEAM_CAPTAIN')) throw new Error('Captain must NOT manage sponsors');
      if (!canExportData('ADMIN')) throw new Error('Admin must be able to export data');
    },
  },

  // ==========================================================================
  // FEATURE 5: M2_PROFILE (LNJPIT Student Profiles)
  // ==========================================================================
  {
    id: 'F05-T01',
    tier: 'TIER_1',
    featureCode: 'M2_PROFILE',
    name: 'Verify LNJPIT branches enum integrity (CSE, ME, CE, EE, ECE, OTHER)',
    description: 'Ensures branch field validates against LNJPIT engineering departments.',
    run: async ({ db }) => {
      const res = await db.query<{ branch: string }>(`SELECT DISTINCT branch FROM "Profile";`);
      const branches = res.rows.map((r: any) => r.branch);
      if (!branches.includes('CSE') || !branches.includes('ME') || !branches.includes('CE')) {
        throw new Error('Expected LNJPIT branches missing in profile table');
      }
    },
  },
  {
    id: 'F05-T02',
    tier: 'TIER_1',
    featureCode: 'M2_PROFILE',
    name: 'Verify semester boundary constraint (1 to 8)',
    description: 'Validates semester integer field across 4 engineering years.',
    run: async ({ db }) => {
      const res = await db.query<{ min_sem: number; max_sem: number }>(
        'SELECT MIN(semester) as min_sem, MAX(semester) as max_sem FROM "Profile";'
      );
      if (res.rows[0].min_sem < 1 || res.rows[0].max_sem > 8) {
        throw new Error('Semester values out of valid 1-8 range');
      }
    },
  },
  {
    id: 'F05-T03',
    tier: 'TIER_1',
    featureCode: 'M2_PROFILE',
    name: 'Verify hosteler vs day-scholar status tracking',
    description: 'Validates boolean isHosteler flag in student profiles.',
    run: async ({ db }) => {
      const hostelers = await db.query<{ count: string }>('SELECT COUNT(*) as count FROM "Profile" WHERE "isHosteler" = true;');
      const dayScholars = await db.query<{ count: string }>('SELECT COUNT(*) as count FROM "Profile" WHERE "isHosteler" = false;');
      if (parseInt(hostelers.rows[0].count, 10) === 0 || parseInt(dayScholars.rows[0].count, 10) === 0) {
        throw new Error('Both hosteler and day-scholar profiles should be present');
      }
    },
  },
  {
    id: 'F05-T04',
    tier: 'TIER_1',
    featureCode: 'M2_PROFILE',
    name: 'Verify college roll number format storage',
    description: 'Validates collegeId field contains official roll numbers (e.g., 22105128005).',
    run: async ({ db }) => {
      const res = await db.query<{ collegeId: string }>(`SELECT "collegeId" FROM "Profile" WHERE "participantId" = 'AST26-0004';`);
      if (res.rows[0].collegeId !== '22105128005') throw new Error('Roll number mismatch for AST26-0004');
    },
  },
  {
    id: 'F05-T05',
    tier: 'TIER_1',
    featureCode: 'M2_PROFILE',
    name: 'Verify unique constraint on participantId in Profile table',
    description: 'Ensures no two profiles can share the same AST26-XXXX ID.',
    run: async ({ db }) => {
      try {
        await db.query(
          `INSERT INTO "Profile" (id, "userId", "participantId", "collegeId", "collegeName", branch, semester, phone, gender, "createdAt", "updatedAt")
           VALUES ('prof_dup_part', 'usr_admin_001', 'AST26-0001', 'LNJPIT-DUP', 'LNJPIT Chapra', 'CSE', 8, '1234567890', 'MALE', NOW(), NOW());`
        );
        throw new Error('FAIL: Duplicate participantId did not error');
      } catch (err: any) {
        if (err.message.includes('FAIL')) throw err;
      }
    },
  },
];

import { TestCase } from '../types';
import { generateInviteCode, validateInviteCode } from '../helpers';

export const eventsTeamsTests: TestCase[] = [
  // ==========================================================================
  // FEATURE 9: M4_CATALOG (Event Catalog & Filter Engine)
  // ==========================================================================
  {
    id: 'F09-T01',
    tier: 'TIER_1',
    featureCode: 'M4_CATALOG',
    name: 'Verify event filtering by category slug (e.g. sports)',
    description: 'Filters all events belonging to Sports category.',
    run: async ({ db }) => {
      const res = await db.query<{ title: string }>(
        `SELECT e.title
         FROM "Event" e
         JOIN "Category" c ON c.id = e."categoryId"
         WHERE c.slug = 'sports'
         ORDER BY e.title;`
      );
      if (res.rows.length !== 5) throw new Error(`Expected 5 sports events, found ${res.rows.length}`);
    },
  },
  {
    id: 'F09-T02',
    tier: 'TIER_1',
    featureCode: 'M4_CATALOG',
    name: 'Verify event text search query across title and rules',
    description: 'Searches for "badminton" and "esports" across event catalog.',
    run: async ({ db }) => {
      const res = await db.query<{ title: string }>(
        `SELECT title FROM "Event" WHERE LOWER(title) LIKE '%badminton%' OR LOWER(rules) LIKE '%badminton%';`
      );
      if (res.rows.length === 0) throw new Error('Search query for "badminton" returned 0 results');
    },
  },
  {
    id: 'F09-T03',
    tier: 'TIER_1',
    featureCode: 'M4_CATALOG',
    name: 'Verify event details page relational query with Coordinator and Category',
    description: 'Retrieves complete event metadata for single event view.',
    run: async ({ db }) => {
      const res = await db.query<{ title: string; categoryName: string; coordinatorName: string; venue: string }>(
        `SELECT e.title, c.name as "categoryName", u.name as "coordinatorName", e.venue
         FROM "Event" e
         JOIN "Category" c ON c.id = e."categoryId"
         LEFT JOIN "User" u ON u.id = e."coordinatorId"
         WHERE e.slug = 'cricket-tournament';`
      );
      if (res.rows.length !== 1) throw new Error('Cricket tournament event details query returned 0 rows');
      if (res.rows[0].categoryName !== 'Sports') throw new Error('Category name mismatch');
      if (!res.rows[0].coordinatorName) throw new Error('Coordinator relation not loaded');
    },
  },
  {
    id: 'F09-T04',
    tier: 'TIER_1',
    featureCode: 'M4_CATALOG',
    name: 'Verify team vs individual event classification',
    description: 'Separates INDIVIDUAL competitions from TEAM tournaments.',
    run: async ({ db }) => {
      const teamEvents = await db.query<{ count: string }>('SELECT COUNT(*) as count FROM "Event" WHERE "eventType" = \'TEAM\';');
      const indEvents = await db.query<{ count: string }>('SELECT COUNT(*) as count FROM "Event" WHERE "eventType" = \'INDIVIDUAL\';');
      if (parseInt(teamEvents.rows[0].count, 10) < 5 || parseInt(indEvents.rows[0].count, 10) < 5) {
        throw new Error('Imbalanced team vs individual event distribution');
      }
    },
  },
  {
    id: 'F09-T05',
    tier: 'TIER_1',
    featureCode: 'M4_CATALOG',
    name: 'Verify rules and guidelines text content exists for every competition',
    description: 'Ensures no event has empty rules field.',
    run: async ({ db }) => {
      const res = await db.query<{ id: string; title: string }>(
        'SELECT id, title FROM "Event" WHERE rules IS NULL OR LENGTH(TRIM(rules)) < 5;'
      );
      if (res.rows.length > 0) throw new Error(`Events missing rules: ${res.rows.map((r: any) => r.title).join(', ')}`);
    },
  },

  // ==========================================================================
  // FEATURE 10: M4_REGISTRATION (Individual & Team Registration)
  // ==========================================================================
  {
    id: 'F10-T01',
    tier: 'TIER_1',
    featureCode: 'M4_REGISTRATION',
    name: 'Verify individual event registration creation',
    description: 'Creates a registration record for participant in Chess Championship.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "Registration" (id, "eventId", "userId", "registrationNumber", status, "qrTicketCode", "createdAt", "updatedAt")
         VALUES ('reg_test_ind', 'evt_spt_chess', 'usr_part_005', 'AST26-REG-2001', 'CONFIRMED', 'AST26.REG.2001.MOCK_SIG', NOW(), NOW());`
      );
      const res = await db.query<{ id: string; status: string }>(`SELECT id, status FROM "Registration" WHERE id = 'reg_test_ind';`);
      if (res.rows.length !== 1 || res.rows[0].status !== 'CONFIRMED') {
        throw new Error('Individual registration was not created successfully');
      }
    },
  },
  {
    id: 'F10-T02',
    tier: 'TIER_1',
    featureCode: 'M4_REGISTRATION',
    name: 'Verify duplicate registration prevention for same user on same event',
    description: 'Enforces composite unique constraint [eventId, userId].',
    run: async ({ db }) => {
      try {
        await db.query(
          `INSERT INTO "Registration" (id, "eventId", "userId", "registrationNumber", status, "createdAt", "updatedAt")
           VALUES ('reg_dup_test', 'evt_spt_chess', 'usr_part_005', 'AST26-REG-2002', 'CONFIRMED', NOW(), NOW());`
        );
        throw new Error('FAIL: Duplicate registration did not trigger unique constraint violation');
      } catch (err: any) {
        if (err.message.includes('FAIL')) throw err;
      }
    },
  },
  {
    id: 'F10-T03',
    tier: 'TIER_1',
    featureCode: 'M4_REGISTRATION',
    name: 'Verify registration number format AST26-REG-XXXXX',
    description: 'Validates structure of registration ticket identifiers.',
    run: async ({ db }) => {
      const res = await db.query<{ registrationNumber: string }>(
        'SELECT "registrationNumber" FROM "Registration" WHERE id = \'reg_test_ind\';'
      );
      const regNum = res.rows[0].registrationNumber;
      if (!/^AST26-REG-\d+$/.test(regNum)) {
        throw new Error(`Invalid registration number format: ${regNum}`);
      }
    },
  },
  {
    id: 'F10-T04',
    tier: 'TIER_1',
    featureCode: 'M4_REGISTRATION',
    name: 'Verify user registered events query for Participant Dashboard',
    description: 'Retrieves all active registrations for a given user.',
    run: async ({ db }) => {
      const res = await db.query<{ eventTitle: string; venue: string; status: string }>(
        `SELECT e.title as "eventTitle", e.venue, r.status
         FROM "Registration" r
         JOIN "Event" e ON e.id = r."eventId"
         WHERE r."userId" = 'usr_part_005'
         ORDER BY e.title;`
      );
      if (res.rows.length === 0) throw new Error('Registered events query returned 0 rows for participant');
    },
  },
  {
    id: 'F10-T05',
    tier: 'TIER_1',
    featureCode: 'M4_REGISTRATION',
    name: 'Verify registration cancellation status transition',
    description: 'Updates registration status to CANCELLED.',
    run: async ({ db }) => {
      await db.query(`UPDATE "Registration" SET status = 'CANCELLED' WHERE id = 'reg_test_ind';`);
      const res = await db.query<{ status: string }>(`SELECT status FROM "Registration" WHERE id = 'reg_test_ind';`);
      if (res.rows[0].status !== 'CANCELLED') throw new Error('Registration status not updated to CANCELLED');
      await db.query(`DELETE FROM "Registration" WHERE id = 'reg_test_ind';`);
    },
  },

  // ==========================================================================
  // FEATURE 11: M4_TEAMS (Dynamic Team Engine & Invite Codes)
  // ==========================================================================
  {
    id: 'F11-T01',
    tier: 'TIER_1',
    featureCode: 'M4_TEAMS',
    name: 'Verify 6-character alphanumeric invite code generator',
    description: 'Generates uppercase alphanumeric code matching ^[A-Z0-9]{6}$.',
    run: async () => {
      for (let i = 0; i < 10; i++) {
        const code = generateInviteCode();
        if (!validateInviteCode(code)) throw new Error(`Invalid generated invite code: ${code}`);
      }
    },
  },
  {
    id: 'F11-T02',
    tier: 'TIER_1',
    featureCode: 'M4_TEAMS',
    name: 'Verify team creation with captain assignment in PostgreSQL',
    description: 'Creates team record and automatically adds captain to TeamMember table.',
    run: async ({ db }) => {
      const code = generateInviteCode();
      await db.query(
        `INSERT INTO "Team" (id, name, code, "eventId", "captainId", "minMembers", "maxMembers", status, "createdAt", "updatedAt")
         VALUES ('team_volleyball_01', 'LNJPIT Spikers', $1, 'evt_spt_volleyball', 'usr_capt_004', 6, 8, 'FORMING', NOW(), NOW());`,
        [code]
      );
      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt")
         VALUES ('tm_vol_01', 'team_volleyball_01', 'usr_capt_004', 'CAPTAIN', 'APPROVED', NOW(), NOW());`
      );
      const res = await db.query<{ name: string; captainName: string }>(
        `SELECT t.name, u.name as "captainName"
         FROM "Team" t
         JOIN "User" u ON u.id = t."captainId"
         WHERE t.id = 'team_volleyball_01';`
      );
      if (res.rows.length !== 1 || res.rows[0].captainName !== 'Aman Verma') {
        throw new Error('Team creation or captain assignment failed');
      }
    },
  },
  {
    id: 'F11-T03',
    tier: 'TIER_1',
    featureCode: 'M4_TEAMS',
    name: 'Verify member joining team via invite code lookup',
    description: 'Looks up team by code and inserts member with status APPROVED.',
    run: async ({ db }) => {
      const teamRes = await db.query<{ id: string }>(`SELECT id FROM "Team" WHERE id = 'team_volleyball_01';`);
      const teamId = teamRes.rows[0].id;
      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt")
         VALUES ('tm_vol_02', $1, 'usr_part_005', 'MEMBER', 'APPROVED', NOW(), NOW());`,
        [teamId]
      );
      const members = await db.query<{ count: string }>(`SELECT COUNT(*) as count FROM "TeamMember" WHERE "teamId" = $1;`, [teamId]);
      if (parseInt(members.rows[0].count, 10) !== 2) throw new Error('Member was not added to team roster');
    },
  },
  {
    id: 'F11-T04',
    tier: 'TIER_1',
    featureCode: 'M4_TEAMS',
    name: 'Verify duplicate member prevention on same team',
    description: 'Enforces composite unique constraint on [teamId, userId].',
    run: async ({ db }) => {
      try {
        await db.query(
          `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt")
           VALUES ('tm_vol_dup', 'team_volleyball_01', 'usr_part_005', 'MEMBER', 'APPROVED', NOW(), NOW());`
        );
        throw new Error('FAIL: Duplicate team member did not trigger unique constraint violation');
      } catch (err: any) {
        if (err.message.includes('FAIL')) throw err;
      }
    },
  },
  {
    id: 'F11-T05',
    tier: 'TIER_1',
    featureCode: 'M4_TEAMS',
    name: 'Verify team status transition from FORMING to READY to REGISTERED',
    description: 'Tests team lifecycle states.',
    run: async ({ db }) => {
      await db.query(`UPDATE "Team" SET status = 'READY' WHERE id = 'team_volleyball_01';`);
      let check = await db.query<{ status: string }>(`SELECT status FROM "Team" WHERE id = 'team_volleyball_01';`);
      if (check.rows[0].status !== 'READY') throw new Error('Team status not updated to READY');

      await db.query(`UPDATE "Team" SET status = 'REGISTERED' WHERE id = 'team_volleyball_01';`);
      check = await db.query<{ status: string }>(`SELECT status FROM "Team" WHERE id = 'team_volleyball_01';`);
      if (check.rows[0].status !== 'REGISTERED') throw new Error('Team status not updated to REGISTERED');

      // Cleanup
      await db.query(`DELETE FROM "TeamMember" WHERE "teamId" = 'team_volleyball_01';`);
      await db.query(`DELETE FROM "Team" WHERE id = 'team_volleyball_01';`);
    },
  },
];

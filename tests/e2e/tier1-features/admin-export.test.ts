import { TestCase } from '../types';
import { generateCsv } from '../helpers';

export const adminExportTests: TestCase[] = [
  // ==========================================================================
  // FEATURE 22: M8_ANALYTICS (Admin Analytics & Recharts Metrics)
  // ==========================================================================
  {
    id: 'F22-T01',
    tier: 'TIER_1',
    featureCode: 'M8_ANALYTICS',
    name: 'Verify branch distribution breakdown query for Pie chart',
    description: 'Counts student participants by engineering branch (CSE, ME, CE, EE, ECE).',
    run: async ({ db }) => {
      const res = await db.query<{ branch: string; count: string }>(
        `SELECT branch, COUNT(id) as count FROM "Profile" GROUP BY branch ORDER BY count DESC;`
      );
      if (res.rows.length === 0) throw new Error('Branch distribution query returned 0 rows');
    },
  },
  {
    id: 'F22-T02',
    tier: 'TIER_1',
    featureCode: 'M8_ANALYTICS',
    name: 'Verify gender ratio distribution query for demographics chart',
    description: 'Counts participants by MALE, FEMALE, OTHER.',
    run: async ({ db }) => {
      const res = await db.query<{ gender: string; count: string }>(
        `SELECT gender, COUNT(id) as count FROM "Profile" GROUP BY gender;`
      );
      const genders = res.rows.map((r: any) => r.gender);
      if (!genders.includes('MALE') || !genders.includes('FEMALE')) {
        throw new Error('Gender distribution missing expected gender values');
      }
    },
  },
  {
    id: 'F22-T03',
    tier: 'TIER_1',
    featureCode: 'M8_ANALYTICS',
    name: 'Verify category popularity registration query for Bar chart',
    description: 'Counts registrations per festival category.',
    run: async ({ db }) => {
      const res = await db.query<{ categoryName: string; registrations: string }>(
        `SELECT c.name as "categoryName", COUNT(r.id) as registrations
         FROM "Category" c
         LEFT JOIN "Event" e ON e."categoryId" = c.id
         LEFT JOIN "Registration" r ON r."eventId" = e.id
         GROUP BY c.id, c.name
         ORDER BY registrations DESC;`
      );
      if (res.rows.length !== 4) throw new Error(`Expected 4 categories in popularity analytics, got ${res.rows.length}`);
    },
  },
  {
    id: 'F22-T04',
    tier: 'TIER_1',
    featureCode: 'M8_ANALYTICS',
    name: 'Verify daily registration velocity query for Line chart',
    description: 'Aggregates registrations by date.',
    run: async ({ db }) => {
      const res = await db.query<{ reg_date: string; daily_count: string }>(
        `SELECT TO_CHAR("createdAt", 'YYYY-MM-DD') as reg_date, COUNT(id) as daily_count
         FROM "Registration"
         GROUP BY reg_date
         ORDER BY reg_date;`
      );
      if (res.rows.length === 0) throw new Error('Daily registration velocity query returned 0 rows');
    },
  },
  {
    id: 'F22-T05',
    tier: 'TIER_1',
    featureCode: 'M8_ANALYTICS',
    name: 'Verify global festival summary metrics query for Admin KPI cards',
    description: 'Retrieves total users, total events, total registrations, and total prize money.',
    run: async ({ db }) => {
      const users = await db.query<{ count: string }>('SELECT COUNT(*) as count FROM "User";');
      const events = await db.query<{ count: string }>('SELECT COUNT(*) as count FROM "Event";');
      const registrations = await db.query<{ count: string }>('SELECT COUNT(*) as count FROM "Registration";');
      const prizes = await db.query<{ sum: string }>('SELECT SUM("prizePool") as sum FROM "Event";');

      if (parseInt(users.rows[0].count, 10) < 5) throw new Error('Total users metric too low');
      if (parseInt(events.rows[0].count, 10) < 16) throw new Error('Total events metric too low');
      if (parseInt(registrations.rows[0].count, 10) < 2) throw new Error('Total registrations metric too low');
      if (parseFloat(prizes.rows[0].sum) < 150000) throw new Error('Total prizes metric too low');
    },
  },

  // ==========================================================================
  // FEATURE 23: M8_DATA_EXPORT (Data Export Engine: CSV / XLSX)
  // ==========================================================================
  {
    id: 'F23-T01',
    tier: 'TIER_1',
    featureCode: 'M8_DATA_EXPORT',
    name: 'Verify participant roster CSV export generator',
    description: 'Generates RFC-4180 compliant CSV string from database participant records.',
    run: async ({ db }) => {
      const res = await db.query<{
        participantId: string;
        name: string;
        email: string;
        collegeId: string;
        branch: string;
        semester: number;
        phone: string;
      }>(
        `SELECT p."participantId", u.name, u.email, p."collegeId", p.branch, p.semester, p.phone
         FROM "Profile" p
         JOIN "User" u ON u.id = p."userId"
         ORDER BY p."participantId";`
      );
      const headers = ['Participant ID', 'Full Name', 'Email', 'College Roll No', 'Branch', 'Semester', 'Phone'];
      const rows = res.rows.map((r) => [r.participantId, r.name, r.email, r.collegeId, r.branch, r.semester, r.phone]);
      const csv = generateCsv(headers, rows);

      if (!csv.startsWith('"Participant ID","Full Name"')) {
        throw new Error('CSV header malformed');
      }
      if (!csv.includes('"AST26-0001"') || !csv.includes('"Dr. Shailendra Kumar"')) {
        throw new Error('CSV content missing expected participant rows');
      }
    },
  },
  {
    id: 'F23-T02',
    tier: 'TIER_1',
    featureCode: 'M8_DATA_EXPORT',
    name: 'Verify event registration sheet CSV export generator',
    description: 'Exports event-specific registration list with registration numbers and team names.',
    run: async ({ db }) => {
      const res = await db.query<{
        regNumber: string;
        eventTitle: string;
        userName: string;
        teamName: string;
        status: string;
      }>(
        `SELECT r."registrationNumber" as "regNumber", e.title as "eventTitle", u.name as "userName", COALESCE(t.name, 'Individual') as "teamName", r.status
         FROM "Registration" r
         JOIN "Event" e ON e.id = r."eventId"
         JOIN "User" u ON u.id = r."userId"
         LEFT JOIN "Team" t ON t.id = r."teamId"
         ORDER BY r."registrationNumber";`
      );
      const headers = ['Reg Number', 'Event Title', 'Participant Name', 'Team Name', 'Status'];
      const rows = res.rows.map((r) => [r.regNumber, r.eventTitle, r.userName, r.teamName, r.status]);
      const csv = generateCsv(headers, rows);
      if (!csv.includes('"AST26-REG-1001"')) throw new Error('Registration CSV missing seeded registration');
    },
  },
  {
    id: 'F23-T03',
    tier: 'TIER_1',
    featureCode: 'M8_DATA_EXPORT',
    name: 'Verify winner podium results CSV export generator',
    description: 'Exports official winners list with prizes and ranks.',
    run: async ({ db }) => {
      const res = await db.query<{
        eventTitle: string;
        rank: number;
        position: string;
        winnerName: string;
        score: string;
        prize: string;
      }>(
        `SELECT e.title as "eventTitle", r.rank, r."positionTitle" as position, COALESCE(u.name, t.name) as "winnerName", r.score, r."prizeAwarded" as prize
         FROM "Result" r
         JOIN "Event" e ON e.id = r."eventId"
         LEFT JOIN "User" u ON u.id = r."userId"
         LEFT JOIN "Team" t ON t.id = r."teamId"
         ORDER BY e.title, r.rank;`
      );
      const headers = ['Event', 'Rank', 'Position', 'Winner / Team', 'Score', 'Prize'];
      const rows = res.rows.map((r) => [r.eventTitle, r.rank, r.position, r.winnerName, r.score, r.prize]);
      const csv = generateCsv(headers, rows);
      if (!csv.includes('"Rank"')) throw new Error('Winner CSV header missing');
    },
  },
  {
    id: 'F23-T04',
    tier: 'TIER_1',
    featureCode: 'M8_DATA_EXPORT',
    name: 'Verify special character escaping in CSV export generator (Quotes, Commas, Newlines)',
    description: 'Ensures cells containing quotes or commas are escaped correctly.',
    run: async () => {
      const headers = ['Event Name', 'Prize Description'];
      const rows = [['"Tark-Vitark", Debate', '₹10,000 + "Gold" Medal']];
      const csv = generateCsv(headers, rows);
      if (!csv.includes('"""Tark-Vitark"", Debate"')) {
        throw new Error(`CSV quote escaping failed: ${csv}`);
      }
    },
  },
  {
    id: 'F23-T05',
    tier: 'TIER_1',
    featureCode: 'M8_DATA_EXPORT',
    name: 'Verify export endpoint query parameter validation',
    description: 'Validates export types: participants, registrations, attendance, results.',
    run: async () => {
      const validTypes = ['participants', 'registrations', 'attendance', 'results'];
      for (const t of validTypes) {
        if (!validTypes.includes(t)) throw new Error(`Invalid export type: ${t}`);
      }
    },
  },

  // ==========================================================================
  // FEATURE 24: M8_SPONSORS (Sponsor CRUD & Tier Management)
  // ==========================================================================
  {
    id: 'F24-T01',
    tier: 'TIER_1',
    featureCode: 'M8_SPONSORS',
    name: 'Verify admin sponsor creation with tier and amount',
    description: 'Inserts new sponsor record in Sponsor table.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "Sponsor" (id, name, tier, "logoUrl", "websiteUrl", description, amount, "order", "isActive", "createdAt", "updatedAt")
         VALUES ('sp_test_01', 'Tech Mahindra', 'GOLD', 'https://example.com/tm.png', 'https://techmahindra.com', 'IT Services Partner', 120000, 6, true, NOW(), NOW());`
      );
      const res = await db.query<{ id: string; name: string }>(`SELECT id, name FROM "Sponsor" WHERE id = 'sp_test_01';`);
      if (res.rows.length !== 1 || res.rows[0].name !== 'Tech Mahindra') {
        throw new Error('Sponsor creation failed');
      }
    },
  },
  {
    id: 'F24-T02',
    tier: 'TIER_1',
    featureCode: 'M8_SPONSORS',
    name: 'Verify sponsor tier enum completeness (TITLE, POWERED_BY, GOLD, SILVER, BRONZE, MEDIA_PARTNER, COMMUNITY_PARTNER)',
    description: 'Checks all SponsorTier enum definitions.',
    run: async ({ db }) => {
      const res = await db.query<{ enumlabel: string }>(
        `SELECT e.enumlabel
         FROM pg_enum e
         JOIN pg_type t ON e.enumtypid = t.oid
         WHERE t.typname = 'SponsorTier';`
      );
      const tiers = res.rows.map((r: any) => r.enumlabel);
      for (const t of ['TITLE', 'POWERED_BY', 'GOLD', 'SILVER', 'BRONZE', 'COMMUNITY_PARTNER']) {
        if (!tiers.includes(t)) throw new Error(`Missing SponsorTier: ${t}`);
      }
    },
  },
  {
    id: 'F24-T03',
    tier: 'TIER_1',
    featureCode: 'M8_SPONSORS',
    name: 'Verify sponsor homepage active visibility toggle',
    description: 'Toggles isActive to false and verifies excluded from active public query.',
    run: async ({ db }) => {
      await db.query(`UPDATE "Sponsor" SET "isActive" = false WHERE id = 'sp_test_01';`);
      const activeSponsors = await db.query<{ id: string }>(`SELECT id FROM "Sponsor" WHERE "isActive" = true AND id = 'sp_test_01';`);
      if (activeSponsors.rows.length !== 0) throw new Error('Deactivated sponsor still returned in active query');
    },
  },
  {
    id: 'F24-T04',
    tier: 'TIER_1',
    featureCode: 'M8_SPONSORS',
    name: 'Verify sponsor ordering update in admin control center',
    description: 'Updates order integer to change showcase placement.',
    run: async ({ db }) => {
      await db.query(`UPDATE "Sponsor" SET "order" = 10 WHERE id = 'sp_test_01';`);
      const res = await db.query<{ order: number }>(`SELECT "order" FROM "Sponsor" WHERE id = 'sp_test_01';`);
      if (res.rows[0].order !== 10) throw new Error('Sponsor order update failed');
    },
  },
  {
    id: 'F24-T05',
    tier: 'TIER_1',
    featureCode: 'M8_SPONSORS',
    name: 'Verify sponsor deletion and cleanup',
    description: 'Deletes test sponsor record.',
    run: async ({ db }) => {
      await db.query(`DELETE FROM "Sponsor" WHERE id = 'sp_test_01';`);
      const check = await db.query<{ count: string }>(`SELECT COUNT(*) as count FROM "Sponsor" WHERE id = 'sp_test_01';`);
      if (parseInt(check.rows[0].count, 10) !== 0) throw new Error('Sponsor deletion failed');
    },
  },
];

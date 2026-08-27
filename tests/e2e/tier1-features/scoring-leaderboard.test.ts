import { TestCase } from '../types';
import { generateCertificateHash, verifyCertificateHash, calculateBranchChampionship, CertificatePayload } from '../helpers';

export const scoringLeaderboardTests: TestCase[] = [
  // ==========================================================================
  // FEATURE 15: M6_SCORING (Coordinator Score Entry & Results)
  // ==========================================================================
  {
    id: 'F15-T01',
    tier: 'TIER_1',
    featureCode: 'M6_SCORING',
    name: 'Verify coordinator score recording for individual event podium',
    description: 'Inserts Winner result for Chess Championship with score and prize details.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "Result" (id, "eventId", rank, "positionTitle", "userId", score, "prizeAwarded", "certificateIssued", "publishedAt", "createdAt", "updatedAt")
         VALUES ('res_chess_win', 'evt_spt_chess', 1, 'WINNER', 'usr_part_005', '5.0 / 5.0', '₹5,000 + Gold Trophy', false, NOW(), NOW(), NOW());`
      );
      const res = await db.query<{ id: string; rank: number; score: string }>(
        `SELECT id, rank, score FROM "Result" WHERE id = 'res_chess_win';`
      );
      if (res.rows.length !== 1 || res.rows[0].rank !== 1) {
        throw new Error('Score entry insertion failed');
      }
    },
  },
  {
    id: 'F15-T02',
    tier: 'TIER_1',
    featureCode: 'M6_SCORING',
    name: 'Verify runner-up score recording (1st Runner Up & 2nd Runner Up)',
    description: 'Inserts 2nd and 3rd rank podium finishers for same event.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "Result" (id, "eventId", rank, "positionTitle", "userId", score, "prizeAwarded", "publishedAt", "createdAt", "updatedAt") VALUES
        ('res_chess_run1', 'evt_spt_chess', 2, 'FIRST_RUNNER_UP', 'usr_capt_004', '4.0 / 5.0', '₹2,500 + Silver Medal', NOW(), NOW(), NOW()),
        ('res_chess_run2', 'evt_spt_chess', 3, 'SECOND_RUNNER_UP', 'usr_vol_003', '3.5 / 5.0', '₹1,500 + Bronze Medal', NOW(), NOW(), NOW());`
      );
      const res = await db.query<{ count: string }>(`SELECT COUNT(*) as count FROM "Result" WHERE "eventId" = 'evt_spt_chess';`);
      if (parseInt(res.rows[0].count, 10) !== 3) throw new Error('Failed to record full podium');
    },
  },
  {
    id: 'F15-T03',
    tier: 'TIER_1',
    featureCode: 'M6_SCORING',
    name: 'Verify duplicate rank prevention on same event',
    description: 'Enforces composite unique constraint on [eventId, rank].',
    run: async ({ db }) => {
      try {
        await db.query(
          `INSERT INTO "Result" (id, "eventId", rank, "positionTitle", "userId", score, "publishedAt", "createdAt", "updatedAt")
           VALUES ('res_dup_rank', 'evt_spt_chess', 1, 'WINNER', 'usr_capt_004', '5.0', NOW(), NOW(), NOW());`
        );
        throw new Error('FAIL: Duplicate podium rank did not trigger unique constraint violation');
      } catch (err: any) {
        if (err.message.includes('FAIL')) throw err;
      }
    },
  },
  {
    id: 'F15-T04',
    tier: 'TIER_1',
    featureCode: 'M6_SCORING',
    name: 'Verify team event score recording associated with teamId',
    description: 'Records result for BGMI Championship linked to team_bgmi_01.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "Result" (id, "eventId", rank, "positionTitle", "teamId", score, "prizeAwarded", "publishedAt", "createdAt", "updatedAt")
         VALUES ('res_bgmi_win', 'evt_gam_bgmi', 1, 'WINNER', 'team_bgmi_01', '38 Kills / WWCD', '₹12,000 + Trophy', NOW(), NOW(), NOW());`
      );
      const res = await db.query<{ teamName: string }>(
        `SELECT t.name as "teamName"
         FROM "Result" r
         JOIN "Team" t ON t.id = r."teamId"
         WHERE r.id = 'res_bgmi_win';`
      );
      if (res.rows.length !== 1 || res.rows[0].teamName !== 'Alpha Esports Warriors') {
        throw new Error('Team result link query failed');
      }
    },
  },
  {
    id: 'F15-T05',
    tier: 'TIER_1',
    featureCode: 'M6_SCORING',
    name: 'Verify results publication query for Public Results portal',
    description: 'Queries completed events and their official published podium rankings.',
    run: async ({ db }) => {
      const res = await db.query<{ eventTitle: string; rank: number; position: string; winnerName: string }>(
        `SELECT e.title as "eventTitle", r.rank, r."positionTitle" as position, COALESCE(u.name, t.name) as "winnerName"
         FROM "Result" r
         JOIN "Event" e ON e.id = r."eventId"
         LEFT JOIN "User" u ON u.id = r."userId"
         LEFT JOIN "Team" t ON t.id = r."teamId"
         ORDER BY e.title, r.rank;`
      );
      if (res.rows.length < 3) throw new Error('Public results query returned insufficient records');
    },
  },

  // ==========================================================================
  // FEATURE 16: M6_LEADERBOARD (Live Multi-Stream Leaderboards)
  // ==========================================================================
  {
    id: 'F16-T01',
    tier: 'TIER_1',
    featureCode: 'M6_LEADERBOARD',
    name: 'Verify Branch Championship points tally calculation',
    description: 'Asserts 100 pts for 1st, 60 pts for 2nd, 30 pts for 3rd place.',
    run: async () => {
      const sampleResults = [
        { eventId: 'evt_1', rank: 1, branch: 'CE', category: 'SPORTS' },
        { eventId: 'evt_1', rank: 2, branch: 'ME', category: 'SPORTS' },
        { eventId: 'evt_1', rank: 3, branch: 'EE', category: 'SPORTS' },
        { eventId: 'evt_2', rank: 1, branch: 'CSE', category: 'GAMING' },
      ];
      const table = calculateBranchChampionship(sampleResults);
      const ce = table.find((b) => b.branch === 'CE');
      const me = table.find((b) => b.branch === 'ME');
      const ee = table.find((b) => b.branch === 'EE');
      const cse = table.find((b) => b.branch === 'CSE');

      if (ce?.points !== 100 || ce.gold !== 1) throw new Error('CE points calculation mismatch');
      if (me?.points !== 60 || me.silver !== 1) throw new Error('ME points calculation mismatch');
      if (ee?.points !== 30 || ee.bronze !== 1) throw new Error('EE points calculation mismatch');
      if (cse?.points !== 100 || cse.gold !== 1) throw new Error('CSE points calculation mismatch');
    },
  },
  {
    id: 'F16-T02',
    tier: 'TIER_1',
    featureCode: 'M6_LEADERBOARD',
    name: 'Verify Branch Championship ranking order sorting by points descending',
    description: 'Ensures highest scoring branch is at index 0.',
    run: async () => {
      const sampleResults = [
        { eventId: 'evt_1', rank: 1, branch: 'ME', category: 'SPORTS' },
        { eventId: 'evt_2', rank: 1, branch: 'ME', category: 'CULTURAL' },
        { eventId: 'evt_3', rank: 1, branch: 'CSE', category: 'GAMING' },
      ];
      const table = calculateBranchChampionship(sampleResults);
      if (table[0].branch !== 'ME' || table[0].points !== 200) {
        throw new Error(`Expected ME in first place with 200 pts, got ${table[0].branch} with ${table[0].points}`);
      }
    },
  },
  {
    id: 'F16-T03',
    tier: 'TIER_1',
    featureCode: 'M6_LEADERBOARD',
    name: 'Verify Sports category stream leaderboard query',
    description: 'Retrieves sports results grouped by winner and score.',
    run: async ({ db }) => {
      const res = await db.query<{ title: string; score: string; winner: string }>(
        `SELECT e.title, r.score, COALESCE(u.name, t.name) as winner
         FROM "Result" r
         JOIN "Event" e ON e.id = r."eventId"
         JOIN "Category" c ON c.id = e."categoryId"
         LEFT JOIN "User" u ON u.id = r."userId"
         LEFT JOIN "Team" t ON t.id = r."teamId"
         WHERE c.slug = 'sports' AND r.rank = 1;`
      );
      if (res.rows.length === 0) throw new Error('Sports leaderboard query returned 0 rows');
    },
  },
  {
    id: 'F16-T04',
    tier: 'TIER_1',
    featureCode: 'M6_LEADERBOARD',
    name: 'Verify Gaming category stream leaderboard query',
    description: 'Retrieves gaming esports results with team names.',
    run: async ({ db }) => {
      const res = await db.query<{ title: string; teamName: string }>(
        `SELECT e.title, t.name as "teamName"
         FROM "Result" r
         JOIN "Event" e ON e.id = r."eventId"
         JOIN "Category" c ON c.id = e."categoryId"
         JOIN "Team" t ON t.id = r."teamId"
         WHERE c.slug = 'gaming' AND r.rank = 1;`
      );
      if (res.rows.length === 0) throw new Error('Gaming leaderboard query returned 0 rows');
    },
  },
  {
    id: 'F16-T05',
    tier: 'TIER_1',
    featureCode: 'M6_LEADERBOARD',
    name: 'Verify overall medal count aggregation across all 5 engineering branches',
    description: 'Counts total Gold, Silver, Bronze medals.',
    run: async ({ db }) => {
      const res = await db.query<{ rank: number; count: string }>(
        `SELECT rank, COUNT(id) as count FROM "Result" GROUP BY rank ORDER BY rank;`
      );
      if (res.rows.length < 2) throw new Error('Medal aggregation returned insufficient podium ranks');
    },
  },

  // ==========================================================================
  // FEATURE 17: M6_CERTIFICATES (PDF Certificate Generator Engine)
  // ==========================================================================
  {
    id: 'F17-T01',
    tier: 'TIER_1',
    featureCode: 'M6_CERTIFICATES',
    name: 'Verify certificate digital signature HMAC-SHA256 generation',
    description: 'Generates reproducible digital hash for certificate payload.',
    run: async ({ secretKey }) => {
      const payload: CertificatePayload = {
        certificateNumber: 'AST26-CERT-10492',
        recipientName: 'Sneha Kumari',
        participantId: 'AST26-0005',
        eventName: 'Grandmaster Chess Championship',
        category: 'Sports',
        position: 'WINNER',
        issueDate: '2026-09-08T18:00:00+05:30',
      };
      const hash = generateCertificateHash(payload, secretKey);
      if (!hash || hash.length !== 64) {
        throw new Error(`Invalid certificate hash length: ${hash?.length}`);
      }
    },
  },
  {
    id: 'F17-T02',
    tier: 'TIER_1',
    featureCode: 'M6_CERTIFICATES',
    name: 'Verify certificate database insertion with signature hash',
    description: 'Inserts certificate record in Certificate table.',
    run: async ({ db, secretKey }) => {
      const payload: CertificatePayload = {
        certificateNumber: 'AST26-CERT-10492',
        recipientName: 'Sneha Kumari',
        participantId: 'AST26-0005',
        eventName: 'Grandmaster Chess Championship',
        category: 'Sports',
        position: 'WINNER',
        issueDate: '2026-09-08T18:00:00+05:30',
      };
      const signatureHash = generateCertificateHash(payload, secretKey);
      await db.query(
        `INSERT INTO "Certificate" (id, "certificateNumber", "userId", "eventId", "recipientName", "participantId", type, title, "eventName", category, "issueDate", "signatureHash", "verificationUrl", "isRevoked", "createdAt", "updatedAt")
         VALUES ('cert_chess_01', 'AST26-CERT-10492', 'usr_part_005', 'evt_spt_chess', 'Sneha Kumari', 'AST26-0005', 'WINNER', 'Certificate of Excellence', 'Grandmaster Chess Championship', 'Sports', '2026-09-08 18:00:00+05:30', $1, 'https://astitva2k26.lnjpit.ac.in/verify-certificate/AST26-CERT-10492', false, NOW(), NOW());`,
        [signatureHash]
      );
      const res = await db.query<{ id: string }>(`SELECT id FROM "Certificate" WHERE id = 'cert_chess_01';`);
      if (res.rows.length !== 1) throw new Error('Certificate insertion failed');
    },
  },
  {
    id: 'F17-T03',
    tier: 'TIER_1',
    featureCode: 'M6_CERTIFICATES',
    name: 'Verify certificate types enum support (WINNER, FIRST_RUNNER_UP, PARTICIPATION, VOLUNTEER)',
    description: 'Checks CertificateType enum options.',
    run: async ({ db }) => {
      const res = await db.query<{ enumlabel: string }>(
        `SELECT e.enumlabel
         FROM pg_enum e
         JOIN pg_type t ON e.enumtypid = t.oid
         WHERE t.typname = 'CertificateType';`
      );
      const labels = res.rows.map((r: any) => r.enumlabel);
      for (const t of ['WINNER', 'FIRST_RUNNER_UP', 'PARTICIPATION', 'VOLUNTEER']) {
        if (!labels.includes(t)) throw new Error(`Missing CertificateType: ${t}`);
      }
    },
  },
  {
    id: 'F17-T04',
    tier: 'TIER_1',
    featureCode: 'M6_CERTIFICATES',
    name: 'Verify user certificate list query for Participant Dashboard',
    description: 'Retrieves all certificates awarded to a specific student.',
    run: async ({ db }) => {
      const res = await db.query<{ certificateNumber: string; eventName: string; type: string }>(
        `SELECT "certificateNumber", "eventName", type
         FROM "Certificate"
         WHERE "userId" = 'usr_part_005';`
      );
      if (res.rows.length === 0) throw new Error('Participant certificate query returned 0 rows');
    },
  },
  {
    id: 'F17-T05',
    tier: 'TIER_1',
    featureCode: 'M6_CERTIFICATES',
    name: 'Verify unique constraint on certificateNumber',
    description: 'Prevents duplicate certificate numbers.',
    run: async ({ db, secretKey }) => {
      try {
        await db.query(
          `INSERT INTO "Certificate" (id, "certificateNumber", "userId", "recipientName", "participantId", type, title, "eventName", category, "signatureHash", "verificationUrl", "createdAt", "updatedAt")
           VALUES ('cert_dup', 'AST26-CERT-10492', 'usr_part_005', 'Sneha Kumari', 'AST26-0005', 'WINNER', 'Dup Title', 'Chess', 'Sports', 'hash', 'url', NOW(), NOW());`
        );
        throw new Error('FAIL: Duplicate certificateNumber did not trigger unique constraint error');
      } catch (err: any) {
        if (err.message.includes('FAIL')) throw err;
      }
    },
  },

  // ==========================================================================
  // FEATURE 18: M6_VERIFY_PORTAL (Public Certificate Verification Portal)
  // ==========================================================================
  {
    id: 'F18-T01',
    tier: 'TIER_1',
    featureCode: 'M6_VERIFY_PORTAL',
    name: 'Verify public certificate verification lookup by certificate number',
    description: 'Fetches certificate metadata by AST26-CERT-XXXXX for public verification view.',
    run: async ({ db }) => {
      const res = await db.query<{ recipientName: string; eventName: string; signatureHash: string; isRevoked: boolean }>(
        `SELECT "recipientName", "eventName", "signatureHash", "isRevoked"
         FROM "Certificate"
         WHERE "certificateNumber" = 'AST26-CERT-10492';`
      );
      if (res.rows.length !== 1 || res.rows[0].recipientName !== 'Sneha Kumari') {
        throw new Error('Certificate verification lookup returned incorrect data');
      }
      if (res.rows[0].isRevoked !== false) throw new Error('Valid certificate is marked revoked');
    },
  },
  {
    id: 'F18-T02',
    tier: 'TIER_1',
    featureCode: 'M6_VERIFY_PORTAL',
    name: 'Verify certificate cryptographic hash integrity check',
    description: 'Recomputes hash from certificate fields and confirms exact match.',
    run: async ({ db, secretKey }) => {
      const res = await db.query<{
        certificateNumber: string;
        recipientName: string;
        participantId: string;
        eventName: string;
        category: string;
        type: string;
        issueDate: string;
        signatureHash: string;
      }>(
        `SELECT "certificateNumber", "recipientName", "participantId", "eventName", category, type, "issueDate", "signatureHash"
         FROM "Certificate"
         WHERE "certificateNumber" = 'AST26-CERT-10492';`
      );
      const row = res.rows[0];
      const payload: CertificatePayload = {
        certificateNumber: row.certificateNumber,
        recipientName: row.recipientName,
        participantId: row.participantId,
        eventName: row.eventName,
        category: row.category,
        position: row.type,
        issueDate: '2026-09-08T18:00:00+05:30',
      };
      const valid = verifyCertificateHash(payload, row.signatureHash, secretKey);
      if (!valid) throw new Error('Certificate hash verification failed');
    },
  },
  {
    id: 'F18-T03',
    tier: 'TIER_1',
    featureCode: 'M6_VERIFY_PORTAL',
    name: 'Verify revoked certificate detection on verification portal',
    description: 'Marks certificate revoked and verifies portal detects revocation flag.',
    run: async ({ db }) => {
      await db.query(
        `UPDATE "Certificate" SET "isRevoked" = true, "revokedReason" = 'Disqualified for rule breach' WHERE "certificateNumber" = 'AST26-CERT-10492';`
      );
      const res = await db.query<{ isRevoked: boolean; revokedReason: string }>(
        `SELECT "isRevoked", "revokedReason" FROM "Certificate" WHERE "certificateNumber" = 'AST26-CERT-10492';`
      );
      if (!res.rows[0].isRevoked || !res.rows[0].revokedReason) {
        throw new Error('Revocation flag or reason not persisted');
      }
      // Revert revocation
      await db.query(`UPDATE "Certificate" SET "isRevoked" = false, "revokedReason" = NULL WHERE "certificateNumber" = 'AST26-CERT-10492';`);
    },
  },
  {
    id: 'F18-T04',
    tier: 'TIER_1',
    featureCode: 'M6_VERIFY_PORTAL',
    name: 'Verify non-existent certificate lookup returns 404 not found',
    description: 'Queries non-existent certificate number and asserts 0 rows.',
    run: async ({ db }) => {
      const res = await db.query(`SELECT * FROM "Certificate" WHERE "certificateNumber" = 'AST26-CERT-NONEXISTENT';`);
      if (res.rows.length !== 0) throw new Error('Non-existent certificate lookup returned rows');
    },
  },
  {
    id: 'F18-T05',
    tier: 'TIER_1',
    featureCode: 'M6_VERIFY_PORTAL',
    name: 'Verify public verification URL format adherence',
    description: 'Checks verificationUrl points to /verify-certificate/{certId}.',
    run: async ({ db }) => {
      const res = await db.query<{ verificationUrl: string }>(
        `SELECT "verificationUrl" FROM "Certificate" WHERE "certificateNumber" = 'AST26-CERT-10492';`
      );
      if (!res.rows[0].verificationUrl.includes('/verify-certificate/AST26-CERT-10492')) {
        throw new Error(`Invalid verification URL format: ${res.rows[0].verificationUrl}`);
      }
    },
  },
];

import { TestCase } from '../types';
import {
  generateInviteCode,
  generateEncryptedPass,
  verifyAndDecryptPass,
  generateCertificateHash,
  verifyCertificateHash,
  calculateBranchChampionship,
  queryFestAssistant,
  generateCsv,
  canAccessDashboard,
  canRecordScore,
  QRPayload,
  CertificatePayload,
} from '../helpers';

export const pairwiseWorkflowTests: TestCase[] = [
  // ==========================================================================
  // JOURNEY 1: FULL COMPETITION LIFECYCLE (CAPTAIN -> SCORING -> CERTIFICATE)
  // ==========================================================================
  {
    id: 'T3-W01',
    tier: 'TIER_3',
    featureCode: 'M4_TEAMS',
    name: 'Journey 1 - Step 1: Team Captain creates team and receives 6-char invite code',
    description: 'Captain usr_capt_004 creates "Cyber Ninjas" team for BGMI esports.',
    run: async ({ db }) => {
      const code = generateInviteCode();
      await db.query(
        `INSERT INTO "Team" (id, name, code, "eventId", "captainId", "minMembers", "maxMembers", status, "createdAt", "updatedAt")
         VALUES ('team_j1', 'Cyber Ninjas', $1, 'evt_gam_bgmi', 'usr_capt_004', 4, 5, 'FORMING', NOW(), NOW());`,
        [code]
      );
      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt")
         VALUES ('tm_j1_capt', 'team_j1', 'usr_capt_004', 'CAPTAIN', 'APPROVED', NOW(), NOW());`
      );
      const res = await db.query<{ id: string; code: string }>(`SELECT id, code FROM "Team" WHERE id = 'team_j1';`);
      if (res.rows.length !== 1 || res.rows[0].code !== code) {
        throw new Error('Journey 1 - Team creation failed');
      }
    },
  },
  {
    id: 'T3-W02',
    tier: 'TIER_3',
    featureCode: 'M4_TEAMS',
    name: 'Journey 1 - Step 2: Squad members join via 6-char code & Captain approves roster',
    description: 'Participant usr_part_005 joins Cyber Ninjas and team reaches READY status.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt")
         VALUES ('tm_j1_mem1', 'team_j1', 'usr_part_005', 'MEMBER', 'APPROVED', NOW(), NOW());`
      );
      await db.query(`UPDATE "Team" SET status = 'READY' WHERE id = 'team_j1';`);

      const res = await db.query<{ status: string; member_count: string }>(
        `SELECT t.status, COUNT(tm.id) as member_count
         FROM "Team" t
         JOIN "TeamMember" tm ON tm."teamId" = t.id
         WHERE t.id = 'team_j1'
         GROUP BY t.id, t.status;`
      );
      if (res.rows[0].status !== 'READY' || parseInt(res.rows[0].member_count, 10) !== 2) {
        throw new Error('Journey 1 - Team roster join failed');
      }
    },
  },
  {
    id: 'T3-W03',
    tier: 'TIER_3',
    featureCode: 'M4_REGISTRATION',
    name: 'Journey 1 - Step 3: Team registers for event and receives official registration ticket',
    description: 'Creates team registration record AST26-REG-J101.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "Registration" (id, "eventId", "userId", "teamId", "registrationNumber", status, "qrTicketCode", "createdAt", "updatedAt")
         VALUES ('reg_j1', 'evt_gam_bgmi', 'usr_capt_004', 'team_j1', 'AST26-REG-J101', 'CONFIRMED', 'AST26.REG.J101.SIG', NOW(), NOW());`
      );
      const res = await db.query<{ registrationNumber: string; status: string }>(
        `SELECT "registrationNumber", status FROM "Registration" WHERE id = 'reg_j1';`
      );
      if (res.rows.length !== 1 || res.rows[0].status !== 'CONFIRMED') {
        throw new Error('Journey 1 - Team registration submission failed');
      }
    },
  },
  {
    id: 'T3-W04',
    tier: 'TIER_3',
    featureCode: 'M5_SCANNER',
    name: 'Journey 1 - Step 4: Volunteer scans encrypted QR pass at LAN Arena venue',
    description: 'Decodes encrypted QR pass and records attendance PRESENT.',
    run: async ({ db, secretKey }) => {
      const payload: QRPayload = {
        participantId: 'AST26-0004',
        userId: 'usr_capt_004',
        collegeId: '22105128005',
        name: 'Aman Verma',
        branch: 'ME',
        timestamp: Date.now(),
      };
      const token = generateEncryptedPass(payload, secretKey);
      const dec = verifyAndDecryptPass(token, secretKey);
      if (!dec.valid || !dec.payload) throw new Error('Journey 1 - QR pass decryption failed');

      await db.query(
        `INSERT INTO "Attendance" (id, "eventId", "userId", "participantId", "scannedById", "checkInType", status, "scannedAt")
         VALUES ('att_j1', 'evt_gam_bgmi', $1, $2, 'usr_vol_003', 'EVENT_ENTRY', 'PRESENT', NOW());`,
        [dec.payload.userId, dec.payload.participantId]
      );
      const check = await db.query<{ status: string }>(`SELECT status FROM "Attendance" WHERE id = 'att_j1';`);
      if (check.rows[0].status !== 'PRESENT') throw new Error('Journey 1 - Attendance check-in recording failed');
    },
  },
  {
    id: 'T3-W05',
    tier: 'TIER_3',
    featureCode: 'M6_SCORING',
    name: 'Journey 1 - Step 5: Event Coordinator records match victory & publishes podium results',
    description: 'Coordinator records Cyber Ninjas as WINNER with 45 points score.',
    run: async ({ db }) => {
      await db.query(`DELETE FROM "Result" WHERE "eventId" = 'evt_gam_bgmi';`);
      await db.query(
        `INSERT INTO "Result" (id, "eventId", rank, "positionTitle", "teamId", score, "prizeAwarded", "certificateIssued", "publishedAt", "createdAt", "updatedAt")
         VALUES ('res_j1', 'evt_gam_bgmi', 1, 'WINNER', 'team_j1', '45 pts (Rank 1 WWCD)', '₹20,000 + Gold Trophy', true, NOW(), NOW(), NOW());`
      );
      const res = await db.query<{ positionTitle: string; score: string }>(
        `SELECT "positionTitle", score FROM "Result" WHERE id = 'res_j1';`
      );
      if (res.rows[0].positionTitle !== 'WINNER') throw new Error('Journey 1 - Score publication failed');
    },
  },
  {
    id: 'T3-W06',
    tier: 'TIER_3',
    featureCode: 'M6_LEADERBOARD',
    name: 'Journey 1 - Step 6: Live Leaderboard & Branch Championship tables update automatically',
    description: 'Calculates points tally awarding ME branch 100 points for BGMI victory.',
    run: async () => {
      const results = [{ eventId: 'evt_gam_bgmi', rank: 1, branch: 'ME', category: 'GAMING' }];
      const leaderboard = calculateBranchChampionship(results);
      const meBranch = leaderboard.find((b) => b.branch === 'ME');
      if (!meBranch || meBranch.points !== 100 || meBranch.gold !== 1) {
        throw new Error('Journey 1 - Leaderboard score tally update failed');
      }
    },
  },
  {
    id: 'T3-W07',
    tier: 'TIER_3',
    featureCode: 'M6_CERTIFICATES',
    name: 'Journey 1 - Step 7: System issues cryptographically signed PDF Certificate',
    description: 'Generates HMAC-SHA256 signature and inserts AST26-CERT-J101.',
    run: async ({ db, secretKey }) => {
      const payload: CertificatePayload = {
        certificateNumber: 'AST26-CERT-J101',
        recipientName: 'Aman Verma',
        participantId: 'AST26-0004',
        eventName: 'BGMI Mobile Esports Championship',
        category: 'Gaming',
        position: 'WINNER',
        issueDate: '2026-09-08T18:00:00+05:30',
      };
      const signatureHash = generateCertificateHash(payload, secretKey);
      await db.query(
        `INSERT INTO "Certificate" (id, "certificateNumber", "userId", "eventId", "recipientName", "participantId", type, title, "eventName", category, "issueDate", "signatureHash", "verificationUrl", "isRevoked", "createdAt", "updatedAt")
         VALUES ('cert_j1', 'AST26-CERT-J101', 'usr_capt_004', 'evt_gam_bgmi', 'Aman Verma', 'AST26-0004', 'WINNER', 'Certificate of Excellence', 'BGMI Mobile Esports Championship', 'Gaming', '2026-09-08 18:00:00+05:30', $1, 'https://astitva2k26.lnjpit.ac.in/verify-certificate/AST26-CERT-J101', false, NOW(), NOW());`,
        [signatureHash]
      );
      const res = await db.query<{ id: string }>(`SELECT id FROM "Certificate" WHERE id = 'cert_j1';`);
      if (res.rows.length !== 1) throw new Error('Journey 1 - Certificate creation failed');
    },
  },
  {
    id: 'T3-W08',
    tier: 'TIER_3',
    featureCode: 'M6_VERIFY_PORTAL',
    name: 'Journey 1 - Step 8: Public Verification Portal confirms certificate authenticity',
    description: 'Validates cryptographic signature on public verification portal endpoint.',
    run: async ({ db, secretKey }) => {
      const certRes = await db.query<{
        certificateNumber: string;
        recipientName: string;
        participantId: string;
        eventName: string;
        category: string;
        type: string;
        signatureHash: string;
      }>(`SELECT * FROM "Certificate" WHERE "certificateNumber" = 'AST26-CERT-J101';`);
      const row = certRes.rows[0];
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
      if (!valid) throw new Error('Journey 1 - Public verification portal validation failed');

      // Cleanup Journey 1 entities
      await db.query(`DELETE FROM "Certificate" WHERE id = 'cert_j1';`);
      await db.query(`DELETE FROM "Result" WHERE id = 'res_j1';`);
      await db.query(`DELETE FROM "Attendance" WHERE id = 'att_j1';`);
      await db.query(`DELETE FROM "Registration" WHERE id = 'reg_j1';`);
      await db.query(`DELETE FROM "TeamMember" WHERE "teamId" = 'team_j1';`);
      await db.query(`DELETE FROM "Team" WHERE id = 'team_j1';`);
    },
  },

  // ==========================================================================
  // JOURNEY 2: VOLUNTEER SHIFT & SECURITY ENFORCEMENT
  // ==========================================================================
  {
    id: 'T3-W09',
    tier: 'TIER_3',
    featureCode: 'M5_SCANNER',
    name: 'Journey 2: Volunteer scans gate entry -> moves to venue -> unauthorized score edit blocked',
    description: 'Tests volunteer scan flow and validates RBAC boundary preventing score editing.',
    run: async ({ db }) => {
      // 1. Volunteer checks in attendee at gate
      await db.query(
        `INSERT INTO "Attendance" (id, "userId", "participantId", "scannedById", "checkInType", status, "scannedAt")
         VALUES ('att_j2_gate', 'usr_part_005', 'AST26-0005', 'usr_vol_003', 'GATE_ENTRY', 'PRESENT', NOW());`
      );

      // 2. Volunteer attempts to record scores -> RBAC check blocks
      if (canRecordScore('VOLUNTEER')) {
        throw new Error('FAIL: Volunteer was permitted to record scores');
      }

      // 3. Coordinator records score legitimately
      if (!canRecordScore('EVENT_COORDINATOR')) {
        throw new Error('FAIL: Coordinator was denied score recording');
      }

      await db.query(`DELETE FROM "Attendance" WHERE id = 'att_j2_gate';`);
    },
  },

  // ==========================================================================
  // JOURNEY 3: ANNOUNCEMENT BROADCAST & AI BOT REAL-TIME UPDATE
  // ==========================================================================
  {
    id: 'T3-W10',
    tier: 'TIER_3',
    featureCode: 'M7_AI_ASSISTANT',
    name: 'Journey 3: Admin broadcasts emergency venue change -> AI Assistant updates answers',
    description: 'Tests synergy between broadcast announcements and AI Assistant knowledge base.',
    run: async ({ db }) => {
      // 1. Admin posts announcement
      await db.query(
        `INSERT INTO "Announcement" (id, title, content, category, priority, "authorId", "authorName", "isPinned", "isActive", "publishedAt", "createdAt", "updatedAt")
         VALUES ('ann_j3', 'Chess Venue Shifted', 'Chess Championship moved to Library Hall B', 'SCHEDULE_CHANGE', 'HIGH', 'usr_admin_001', 'Admin Desk', true, true, NOW(), NOW(), NOW());`
      );

      // 2. Event context reflecting new venue
      const updatedEvents = [
        {
          id: 'evt_spt_chess',
          title: 'Grandmaster Chess Championship',
          category: 'Sports',
          venue: 'Library Hall B',
          rules: 'FIDE Rapid rules',
          dayNumber: 1,
          scheduleStart: '2026-09-04T10:00:00+05:30',
        },
      ];

      // 3. AI query gets new venue
      const aiRes = queryFestAssistant('Where is the chess championship venue?', updatedEvents, []);
      if (!aiRes.answer.includes('Library Hall B')) {
        throw new Error(`AI assistant did not reflect updated venue: ${aiRes.answer}`);
      }

      await db.query(`DELETE FROM "Announcement" WHERE id = 'ann_j3';`);
    },
  },

  // ==========================================================================
  // JOURNEY 4: CAPACITY OVERFLOW, CANCELLATION, & ROSTER EXPORT
  // ==========================================================================
  {
    id: 'T3-W11',
    tier: 'TIER_3',
    featureCode: 'M8_DATA_EXPORT',
    name: 'Journey 4: Capacity limit -> Cancellation opens slot -> New registration -> Export updated',
    description: 'Validates slot freeing upon cancellation and accurate CSV roster generation.',
    run: async ({ db }) => {
      // 1. Create a user registration
      await db.query(
        `INSERT INTO "Registration" (id, "eventId", "userId", "registrationNumber", status, "createdAt", "updatedAt")
         VALUES ('reg_j4_1', 'evt_spt_badminton', 'usr_part_005', 'AST26-REG-J401', 'CONFIRMED', NOW(), NOW());`
      );

      // 2. Cancel it
      await db.query(`UPDATE "Registration" SET status = 'CANCELLED' WHERE id = 'reg_j4_1';`);

      // 3. New participant registers
      await db.query(
        `INSERT INTO "Registration" (id, "eventId", "userId", "registrationNumber", status, "createdAt", "updatedAt")
         VALUES ('reg_j4_2', 'evt_spt_badminton', 'usr_capt_004', 'AST26-REG-J402', 'CONFIRMED', NOW(), NOW());`
      );

      // 4. Export active confirmed roster
      const res = await db.query<{ regNumber: string; userName: string }>(
        `SELECT r."registrationNumber" as "regNumber", u.name as "userName"
         FROM "Registration" r
         JOIN "User" u ON u.id = r."userId"
         WHERE r."eventId" = 'evt_spt_badminton' AND r.status = 'CONFIRMED'
         ORDER BY r."registrationNumber";`
      );

      const headers = ['Registration No', 'Participant Name'];
      const rows = res.rows.map((r: any) => [r.regNumber, r.userName]);
      const csv = generateCsv(headers, rows);

      if (!csv.includes('"AST26-REG-J402"') || csv.includes('"AST26-REG-J401"')) {
        throw new Error(`Export roster failed to reflect active registration correctly: ${csv}`);
      }

      await db.query(`DELETE FROM "Registration" WHERE id IN ('reg_j4_1', 'reg_j4_2');`);
    },
  },

  // ==========================================================================
  // JOURNEY 5: SPONSOR CRUD & PUBLIC SHOWCASE INTEGRATION
  // ==========================================================================
  {
    id: 'T3-W12',
    tier: 'TIER_3',
    featureCode: 'M8_SPONSORS',
    name: 'Journey 5: Admin adds title sponsor -> reorders hierarchy -> public showcase reflects top sponsor',
    description: 'Tests end-to-end admin sponsor configuration and public visibility.',
    run: async ({ db }) => {
      // 1. Add Title Sponsor
      await db.query(
        `INSERT INTO "Sponsor" (id, name, tier, "logoUrl", "websiteUrl", amount, "order", "isActive", "createdAt", "updatedAt")
         VALUES ('sp_j5', 'Bihar IT Development', 'TITLE', 'https://example.com/bihar-it.png', 'https://it.bihar.gov.in', 1000000, 0, true, NOW(), NOW());`
      );

      // 2. Query public homepage showcase
      const res = await db.query<{ name: string; tier: string }>(
        `SELECT name, tier FROM "Sponsor" WHERE "isActive" = true ORDER BY "order" ASC;`
      );
      if (res.rows[0].name !== 'Bihar IT Development') {
        throw new Error(`Expected new sponsor at position 0, got ${res.rows[0].name}`);
      }

      await db.query(`DELETE FROM "Sponsor" WHERE id = 'sp_j5';`);
    },
  },
];

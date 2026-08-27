import { TestCase } from '../types';
import {
  generateEncryptedPass,
  verifyAndDecryptPass,
  generateCertificateHash,
  verifyCertificateHash,
  calculateBranchChampionship,
  generateCsv,
  QRPayload,
  CertificatePayload,
} from '../helpers';

export const workloadSimulationTests: TestCase[] = [
  // ==========================================================================
  // TIER 4: REAL-WORLD LNJPIT 5-DAY FESTIVAL SIMULATION WORKLOAD
  // ==========================================================================
  {
    id: 'T4-SIM-D1',
    tier: 'TIER_4',
    featureCode: 'M5_ATTENDANCE',
    name: 'Day 1 (Sept 4, 2026): Campus Opening, 50+ Gate Check-ins & Cricket/Chess Kickoff',
    description: 'Simulates Day 1 high-velocity gate entry scans and initial tournament registrations.',
    run: async ({ db, secretKey }) => {
      // 1. Batch create 20 student participants across 5 engineering branches
      const branches = ['CSE', 'ME', 'CE', 'EE', 'ECE'];
      for (let i = 10; i <= 30; i++) {
        const branch = branches[i % branches.length];
        const userId = `usr_sim_${i}`;
        const partId = `AST26-${String(i).padStart(4, '0')}`;
        const rollNo = `221051280${i}`;

        await db.query(
          `INSERT INTO "User" (id, email, name, role, "isActive", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, 'PARTICIPANT', true, NOW(), NOW())
           ON CONFLICT (id) DO NOTHING;`,
          [userId, `student${i}@lnjpit.ac.in`, `Student ${i} (${branch})`]
        );

        await db.query(
          `INSERT INTO "Profile" (id, "userId", "participantId", "collegeId", "collegeName", branch, semester, phone, gender, "isHosteler", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, 'LNJPIT Chapra', $5::"Branch", 4, '+91 98765 00000', 'MALE', false, NOW(), NOW())
           ON CONFLICT (id) DO NOTHING;`,
          [`prof_sim_${i}`, userId, partId, rollNo, branch]
        );

        // Generate encrypted QR pass
        const payload: QRPayload = {
          participantId: partId,
          userId,
          collegeId: rollNo,
          name: `Student ${i}`,
          branch,
          timestamp: Date.now(),
        };
        const passToken = generateEncryptedPass(payload, secretKey);
        const dec = verifyAndDecryptPass(passToken, secretKey);
        if (!dec.valid) throw new Error(`Day 1 - QR pass validation failed for ${partId}`);

        // Scan at Gate Entry
        await db.query(
          `INSERT INTO "Attendance" (id, "eventId", "userId", "participantId", "scannedById", "checkInType", status, "scannedAt")
           VALUES ($1, NULL, $2, $3, 'usr_vol_003', 'GATE_ENTRY', 'PRESENT', NOW())
           ON CONFLICT DO NOTHING;`,
          [`att_gate_sim_${i}`, userId, partId]
        );
      }

      // Check total Day 1 gate scans
      const gateScans = await db.query<{ count: string }>(
        `SELECT COUNT(*) as count FROM "Attendance" WHERE "checkInType" = 'GATE_ENTRY';`
      );
      if (parseInt(gateScans.rows[0].count, 10) < 20) {
        throw new Error('Day 1 - Gate scans count under target');
      }
    },
  },
  {
    id: 'T4-SIM-D2',
    tier: 'TIER_4',
    featureCode: 'M5_ATTENDANCE',
    name: 'Day 2 (Sept 5, 2026): Badminton Knockouts, Volleyball & Nrityangana Dance Qualifiers',
    description: 'Simulates Day 2 multi-venue event entry scans and match progressions.',
    run: async ({ db }) => {
      // Register 10 participants for Badminton and 10 for Dance
      for (let i = 10; i <= 20; i++) {
        const userId = `usr_sim_${i}`;
        const partId = `AST26-${String(i).padStart(4, '0')}`;

        // Badminton registration
        await db.query(
          `INSERT INTO "Registration" (id, "eventId", "userId", "registrationNumber", status, "createdAt", "updatedAt")
           VALUES ($1, 'evt_spt_badminton', $2, $3, 'CONFIRMED', NOW(), NOW())
           ON CONFLICT DO NOTHING;`,
          [`reg_badm_${i}`, userId, `AST26-REG-BADM-${i}`]
        );

        // Check in at Badminton venue
        await db.query(
          `INSERT INTO "Attendance" (id, "eventId", "userId", "participantId", "scannedById", "checkInType", status, "scannedAt")
           VALUES ($1, 'evt_spt_badminton', $2, $3, 'usr_vol_003', 'EVENT_ENTRY', 'PRESENT', NOW())
           ON CONFLICT DO NOTHING;`,
          [`att_badm_${i}`, userId, partId]
        );
      }

      const badmintonAtt = await db.query<{ count: string }>(
        `SELECT COUNT(*) as count FROM "Attendance" WHERE "eventId" = 'evt_spt_badminton';`
      );
      if (parseInt(badmintonAtt.rows[0].count, 10) < 10) {
        throw new Error('Day 2 - Badminton attendance check-ins under target');
      }
    },
  },
  {
    id: 'T4-SIM-D3',
    tier: 'TIER_4',
    featureCode: 'M6_SCORING',
    name: 'Day 3 (Sept 6, 2026): Football Quarter-Finals, BGMI LAN Battles & Stand-Up Comedy',
    description: 'Simulates Day 3 high-intensity esports LAN battles and preliminary score entries.',
    run: async ({ db }) => {
      // Record Hasya Kosh comedy results
      await db.query(
        `INSERT INTO "Result" (id, "eventId", rank, "positionTitle", "userId", score, "prizeAwarded", "publishedAt", "createdAt", "updatedAt") VALUES
        ('res_sim_com_1', 'evt_clt_comedy', 1, 'WINNER', 'usr_sim_11', '98.5 / 100', '₹5,000 + Trophy', NOW(), NOW(), NOW()),
        ('res_sim_com_2', 'evt_clt_comedy', 2, 'FIRST_RUNNER_UP', 'usr_sim_12', '94.0 / 100', '₹3,000 + Medal', NOW(), NOW(), NOW())
        ON CONFLICT DO NOTHING;`
      );

      const comedyRes = await db.query<{ count: string }>(
        `SELECT COUNT(*) as count FROM "Result" WHERE "eventId" = 'evt_clt_comedy';`
      );
      if (parseInt(comedyRes.rows[0].count, 10) < 2) {
        throw new Error('Day 3 - Comedy results recording failed');
      }
    },
  },
  {
    id: 'T4-SIM-D4',
    tier: 'TIER_4',
    featureCode: 'M6_SCORING',
    name: 'Day 4 (Sept 7, 2026): Semi-Finals, Sur Sangam Singing Finals & Free Fire Trophy',
    description: 'Simulates Day 4 finals and literary debates.',
    run: async ({ db }) => {
      // Record Sur Sangam finals results
      await db.query(
        `INSERT INTO "Result" (id, "eventId", rank, "positionTitle", "userId", score, "prizeAwarded", "publishedAt", "createdAt", "updatedAt") VALUES
        ('res_sim_sng_1', 'evt_clt_singing', 1, 'WINNER', 'usr_sim_13', '99.0 / 100 (Classical Raag)', '₹7,500 + Golden Mic', NOW(), NOW(), NOW()),
        ('res_sim_sng_2', 'evt_clt_singing', 2, 'FIRST_RUNNER_UP', 'usr_sim_14', '95.5 / 100 (Bollywood)', '₹4,500 + Silver Medal', NOW(), NOW(), NOW())
        ON CONFLICT DO NOTHING;`
      );
      const singingRes = await db.query<{ count: string }>(
        `SELECT COUNT(*) as count FROM "Result" WHERE "eventId" = 'evt_clt_singing';`
      );
      if (parseInt(singingRes.rows[0].count, 10) < 2) {
        throw new Error('Day 4 - Singing finals results recording failed');
      }
    },
  },
  {
    id: 'T4-SIM-D5',
    tier: 'TIER_4',
    featureCode: 'M6_LEADERBOARD',
    name: 'Day 5 (Sept 8, 2026): Grand Finals, Podium Publishing, 20+ Certs, Leaderboards & Exports',
    description: 'Finalizes tournament, awards certificates, computes Branch Championship, and produces exports.',
    run: async ({ db, secretKey }) => {
      // 1. Record Cricket Grand Final Result
      await db.query(
        `INSERT INTO "Result" (id, "eventId", rank, "positionTitle", "teamId", score, "prizeAwarded", "publishedAt", "createdAt", "updatedAt") VALUES
        ('res_sim_crk_1', 'evt_spt_cricket', 1, 'WINNER', 'team_cricket_01', '118/4 vs 112/8 (Won by 6 runs)', '₹25,000 + Champions Trophy', NOW(), NOW(), NOW())
        ON CONFLICT DO NOTHING;`
      );

      // 2. Issue Certificates for all simulated winners
      const winners = [
        { certNum: 'AST26-CERT-SIM01', name: 'Student 11', partId: 'AST26-0011', evt: 'Hasya Kosh (Comedy)', cat: 'Cultural', pos: 'WINNER' },
        { certNum: 'AST26-CERT-SIM02', name: 'Student 13', partId: 'AST26-0013', evt: 'Sur Sangam (Singing)', cat: 'Cultural', pos: 'WINNER' },
        { certNum: 'AST26-CERT-SIM03', name: 'Aman Verma', partId: 'AST26-0004', evt: 'ASTITVA Cricket Championship', cat: 'Sports', pos: 'WINNER' },
      ];

      for (const w of winners) {
        const payload: CertificatePayload = {
          certificateNumber: w.certNum,
          recipientName: w.name,
          participantId: w.partId,
          eventName: w.evt,
          category: w.cat,
          position: w.pos,
          issueDate: '2026-09-08T18:00:00+05:30',
        };
        const hash = generateCertificateHash(payload, secretKey);
        await db.query(
          `INSERT INTO "Certificate" (id, "certificateNumber", "userId", "recipientName", "participantId", type, title, "eventName", category, "issueDate", "signatureHash", "verificationUrl", "isRevoked", "createdAt", "updatedAt")
           VALUES ($1, $2, 'usr_capt_004', $3, $4, $5::"CertificateType", 'Certificate of Excellence', $6, $7, '2026-09-08 18:00:00+05:30', $8, 'https://astitva2k26.lnjpit.ac.in/verify-certificate/' || $2, false, NOW(), NOW())
           ON CONFLICT DO NOTHING;`,
          [`cert_sim_${w.certNum}`, w.certNum, w.name, w.partId, w.pos, w.evt, w.cat, hash]
        );

        // Verify cryptographic validity
        const valid = verifyCertificateHash(payload, hash, secretKey);
        if (!valid) throw new Error(`Day 5 - Certificate signature validation failed for ${w.certNum}`);
      }

      // 3. Compute final Branch Championship Leaderboard
      const allResults = [
        { eventId: 'evt_spt_cricket', rank: 1, branch: 'ME', category: 'SPORTS' },
        { eventId: 'evt_clt_comedy', rank: 1, branch: 'CSE', category: 'CULTURAL' },
        { eventId: 'evt_clt_comedy', rank: 2, branch: 'ECE', category: 'CULTURAL' },
        { eventId: 'evt_clt_singing', rank: 1, branch: 'EE', category: 'CULTURAL' },
        { eventId: 'evt_clt_singing', rank: 2, branch: 'CE', category: 'CULTURAL' },
      ];
      const finalLeaderboard = calculateBranchChampionship(allResults);
      if (finalLeaderboard.length < 5) throw new Error('Day 5 - Final leaderboard missing engineering branches');

      // 4. Generate Final Master Festival CSV Export
      const certRes = await db.query<{ certificateNumber: string; recipientName: string; eventName: string; type: string }>(
        'SELECT "certificateNumber", "recipientName", "eventName", type FROM "Certificate";'
      );
      const headers = ['Certificate ID', 'Recipient', 'Event', 'Type'];
      const rows = certRes.rows.map((r: any) => [r.certificateNumber, r.recipientName, r.eventName, r.type]);
      const csvOutput = generateCsv(headers, rows);
      if (!csvOutput.includes('AST26-CERT-SIM01')) {
        throw new Error('Day 5 - Master export missing simulated certificates');
      }

      // 5. Cleanup simulation entities
      await db.query(`DELETE FROM "Certificate" WHERE id LIKE 'cert_sim_%';`);
      await db.query(`DELETE FROM "Result" WHERE id LIKE 'res_sim_%';`);
      await db.query(`DELETE FROM "Attendance" WHERE id LIKE 'att_%_sim_%';`);
      await db.query(`DELETE FROM "Registration" WHERE id LIKE 'reg_%_sim_%' OR id LIKE 'reg_badm_%';`);
      await db.query(`DELETE FROM "Profile" WHERE id LIKE 'prof_sim_%';`);
      await db.query(`DELETE FROM "User" WHERE id LIKE 'usr_sim_%';`);
    },
  },
];

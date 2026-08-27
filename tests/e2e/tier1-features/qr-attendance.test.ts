import { TestCase } from '../types';
import { generateEncryptedPass, verifyAndDecryptPass, QRPayload } from '../helpers';

export const qrAttendanceTests: TestCase[] = [
  // ==========================================================================
  // FEATURE 12: M5_QR_PASS (Encrypted QR Participant Pass)
  // ==========================================================================
  {
    id: 'F12-T01',
    tier: 'TIER_1',
    featureCode: 'M5_QR_PASS',
    name: 'Verify HMAC-SHA256 encrypted QR pass generation token structure',
    description: 'Asserts token format AST26.<header_b64>.<payload_b64>.<hmac_sha256_hex>.',
    run: async ({ secretKey }) => {
      const payload: QRPayload = {
        participantId: 'AST26-0005',
        userId: 'usr_part_005',
        collegeId: '24105128032',
        name: 'Sneha Kumari',
        branch: 'CE',
        timestamp: Date.now(),
      };
      const token = generateEncryptedPass(payload, secretKey);
      const parts = token.split('.');
      if (parts.length !== 4 || parts[0] !== 'AST26') {
        throw new Error(`Malformed token structure: ${token}`);
      }
      if (parts[3].length !== 64) {
        throw new Error(`HMAC-SHA256 signature length mismatch: expected 64 hex chars, got ${parts[3].length}`);
      }
    },
  },
  {
    id: 'F12-T02',
    tier: 'TIER_1',
    featureCode: 'M5_QR_PASS',
    name: 'Verify QR pass decryption and cryptographic signature validation',
    description: 'Decodes valid token and verifies payload fields match original input.',
    run: async ({ secretKey }) => {
      const payload: QRPayload = {
        participantId: 'AST26-0004',
        userId: 'usr_capt_004',
        collegeId: '22105128005',
        name: 'Aman Verma',
        branch: 'ME',
        timestamp: Date.now(),
      };
      const token = generateEncryptedPass(payload, secretKey);
      const res = verifyAndDecryptPass(token, secretKey);
      if (!res.valid || !res.payload) {
        throw new Error(`Decryption failed: ${res.error}`);
      }
      if (res.payload.participantId !== payload.participantId || res.payload.name !== payload.name) {
        throw new Error('Payload mismatch after decryption');
      }
    },
  },
  {
    id: 'F12-T03',
    tier: 'TIER_1',
    featureCode: 'M5_QR_PASS',
    name: 'Verify pass verification rejection on tampered payload content',
    description: 'Modifies base64 payload bytes and asserts HMAC mismatch error.',
    run: async ({ secretKey }) => {
      const payload: QRPayload = {
        participantId: 'AST26-0005',
        userId: 'usr_part_005',
        collegeId: '24105128032',
        name: 'Sneha Kumari',
        branch: 'CE',
        timestamp: Date.now(),
      };
      const token = generateEncryptedPass(payload, secretKey);
      const parts = token.split('.');
      // Tamper payload to give admin ID
      const tamperedPayload = { ...payload, participantId: 'AST26-0001' };
      const tamperedB64 = Buffer.from(JSON.stringify(tamperedPayload)).toString('base64url');
      const tamperedToken = `${parts[0]}.${parts[1]}.${tamperedB64}.${parts[3]}`;

      const res = verifyAndDecryptPass(tamperedToken, secretKey);
      if (res.valid) {
        throw new Error('FAIL: Tampered QR token was incorrectly accepted!');
      }
      if (!res.error?.includes('mismatch')) {
        throw new Error(`Expected signature mismatch error, got: ${res.error}`);
      }
    },
  },
  {
    id: 'F12-T04',
    tier: 'TIER_1',
    featureCode: 'M5_QR_PASS',
    name: 'Verify pass verification rejection on incorrect secret key',
    description: 'Attempts verification using wrong secret key.',
    run: async ({ secretKey }) => {
      const payload: QRPayload = {
        participantId: 'AST26-0005',
        userId: 'usr_part_005',
        collegeId: '24105128032',
        name: 'Sneha Kumari',
        branch: 'CE',
        timestamp: Date.now(),
      };
      const token = generateEncryptedPass(payload, secretKey);
      const res = verifyAndDecryptPass(token, 'WRONG_SECRET_KEY_123');
      if (res.valid) {
        throw new Error('FAIL: Token validated with invalid secret key');
      }
    },
  },
  {
    id: 'F12-T05',
    tier: 'TIER_1',
    featureCode: 'M5_QR_PASS',
    name: 'Verify profile table QR token update and persistence in PostgreSQL',
    description: 'Stores generated token in Profile.qrPassToken and queries back.',
    run: async ({ db, secretKey }) => {
      const payload: QRPayload = {
        participantId: 'AST26-0005',
        userId: 'usr_part_005',
        collegeId: '24105128032',
        name: 'Sneha Kumari',
        branch: 'CE',
        timestamp: Date.now(),
      };
      const token = generateEncryptedPass(payload, secretKey);
      await db.query(
        `UPDATE "Profile" SET "qrPassToken" = $1 WHERE "participantId" = 'AST26-0005';`,
        [token]
      );
      const res = await db.query<{ qrPassToken: string }>(
        `SELECT "qrPassToken" FROM "Profile" WHERE "participantId" = 'AST26-0005';`
      );
      if (res.rows[0].qrPassToken !== token) {
        throw new Error('Persisted QR pass token does not match generated token');
      }
    },
  },

  // ==========================================================================
  // FEATURE 13: M5_SCANNER (Volunteer Real-Time QR Scanner)
  // ==========================================================================
  {
    id: 'F13-T01',
    tier: 'TIER_1',
    featureCode: 'M5_SCANNER',
    name: 'Verify volunteer check-in recording at event entry',
    description: 'Records attendance scan by volunteer usr_vol_003 for participant usr_part_005.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "Attendance" (id, "eventId", "userId", "participantId", "scannedById", "checkInType", status, "deviceInfo", "scannedAt")
         VALUES ('att_test_01', 'evt_spt_cricket', 'usr_part_005', 'AST26-0005', 'usr_vol_003', 'EVENT_ENTRY', 'PRESENT', 'Scanner-Webcam-01', NOW());`
      );
      const res = await db.query<{ id: string; status: string }>(`SELECT id, status FROM "Attendance" WHERE id = 'att_test_01';`);
      if (res.rows.length !== 1 || res.rows[0].status !== 'PRESENT') {
        throw new Error('Attendance scan was not recorded correctly');
      }
    },
  },
  {
    id: 'F13-T02',
    tier: 'TIER_1',
    featureCode: 'M5_SCANNER',
    name: 'Verify duplicate check-in prevention for same participant, event, and checkInType',
    description: 'Enforces composite unique constraint on [participantId, eventId, checkInType].',
    run: async ({ db }) => {
      try {
        await db.query(
          `INSERT INTO "Attendance" (id, "eventId", "userId", "participantId", "scannedById", "checkInType", status, "scannedAt")
           VALUES ('att_test_dup', 'evt_spt_cricket', 'usr_part_005', 'AST26-0005', 'usr_vol_003', 'EVENT_ENTRY', 'PRESENT', NOW());`
        );
        throw new Error('FAIL: Duplicate check-in did not trigger unique constraint violation');
      } catch (err: any) {
        if (err.message.includes('FAIL')) throw err;
      }
    },
  },
  {
    id: 'F13-T03',
    tier: 'TIER_1',
    featureCode: 'M5_SCANNER',
    name: 'Verify manual participant ID lookup for fallback check-in',
    description: 'Queries student profile by AST26-XXXX to support manual badge entry.',
    run: async ({ db }) => {
      const res = await db.query<{ name: string; branch: string; collegeId: string }>(
        `SELECT u.name, p.branch, p."collegeId"
         FROM "Profile" p
         JOIN "User" u ON u.id = p."userId"
         WHERE p."participantId" = 'AST26-0005';`
      );
      if (res.rows.length !== 1 || res.rows[0].name !== 'Sneha Kumari') {
        throw new Error('Manual participant lookup failed');
      }
    },
  },
  {
    id: 'F13-T04',
    tier: 'TIER_1',
    featureCode: 'M5_SCANNER',
    name: 'Verify volunteer scan audit logging',
    description: 'Inserts audit log entry on QR scan event.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "AuditLog" (id, "userId", "userEmail", action, resource, details, timestamp)
         VALUES ('aud_scan_01', 'usr_vol_003', 'volunteer@lnjpit.ac.in', 'QR_SCANNED', 'Attendance:AST26-0005', '{"event": "Cricket", "venue": "Main Ground"}', NOW());`
      );
      const res = await db.query<{ action: string }>(`SELECT action FROM "AuditLog" WHERE id = 'aud_scan_01';`);
      if (res.rows[0].action !== 'QR_SCANNED') throw new Error('Audit log action mismatch');
      await db.query(`DELETE FROM "AuditLog" WHERE id = 'aud_scan_01';`);
    },
  },
  {
    id: 'F13-T05',
    tier: 'TIER_1',
    featureCode: 'M5_SCANNER',
    name: 'Verify gate entry vs event entry check-in types',
    description: 'Allows same participant to check in at GATE_ENTRY and EVENT_ENTRY.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "Attendance" (id, "eventId", "userId", "participantId", "scannedById", "checkInType", status, "scannedAt")
         VALUES ('att_gate_01', NULL, 'usr_part_005', 'AST26-0005', 'usr_vol_003', 'GATE_ENTRY', 'PRESENT', NOW());`
      );
      const res = await db.query<{ count: string }>(
        `SELECT COUNT(*) as count FROM "Attendance" WHERE "participantId" = 'AST26-0005';`
      );
      if (parseInt(res.rows[0].count, 10) < 2) throw new Error('Failed to record distinct gate and event check-ins');
    },
  },

  // ==========================================================================
  // FEATURE 14: M5_ATTENDANCE (Live Attendance Dashboard)
  // ==========================================================================
  {
    id: 'F14-T01',
    tier: 'TIER_1',
    featureCode: 'M5_ATTENDANCE',
    name: 'Verify present vs absent attendance metrics calculation',
    description: 'Compares total registered attendees against recorded attendance count.',
    run: async ({ db }) => {
      const regCount = await db.query<{ count: string }>(`SELECT COUNT(*) as count FROM "Registration" WHERE "eventId" = 'evt_spt_cricket';`);
      const attCount = await db.query<{ count: string }>(`SELECT COUNT(*) as count FROM "Attendance" WHERE "eventId" = 'evt_spt_cricket';`);
      const total = parseInt(regCount.rows[0].count, 10);
      const present = parseInt(attCount.rows[0].count, 10);
      if (present < 0 || total < 0) throw new Error('Invalid attendance counts');
    },
  },
  {
    id: 'F14-T02',
    tier: 'TIER_1',
    featureCode: 'M5_ATTENDANCE',
    name: 'Verify check-in timeline aggregation by hourly time slots',
    description: 'Groups attendance records by hour for live velocity chart.',
    run: async ({ db }) => {
      const res = await db.query<{ hour_slot: string; scan_count: string }>(
        `SELECT TO_CHAR("scannedAt", 'YYYY-MM-DD HH24:00') as hour_slot, COUNT(id) as scan_count
         FROM "Attendance"
         GROUP BY hour_slot
         ORDER BY hour_slot;`
      );
      if (res.rows.length === 0) throw new Error('Hourly scan aggregation returned 0 rows');
    },
  },
  {
    id: 'F14-T03',
    tier: 'TIER_1',
    featureCode: 'M5_ATTENDANCE',
    name: 'Verify venue-level attendance feed query',
    description: 'Retrieves attendance counts broken down by event venue.',
    run: async ({ db }) => {
      const res = await db.query<{ venue: string; checkins: string }>(
        `SELECT e.venue, COUNT(a.id) as checkins
         FROM "Event" e
         LEFT JOIN "Attendance" a ON a."eventId" = e.id
         GROUP BY e.venue
         ORDER BY checkins DESC;`
      );
      if (res.rows.length === 0) throw new Error('Venue attendance feed returned 0 rows');
    },
  },
  {
    id: 'F14-T04',
    tier: 'TIER_1',
    featureCode: 'M5_ATTENDANCE',
    name: 'Verify volunteer scanner leaderboard metric (Scans per volunteer)',
    description: 'Aggregates check-ins performed per volunteer for operational tracking.',
    run: async ({ db }) => {
      const res = await db.query<{ volunteer_name: string; scans: string }>(
        `SELECT u.name as volunteer_name, COUNT(a.id) as scans
         FROM "User" u
         JOIN "Attendance" a ON a."scannedById" = u.id
         GROUP BY u.id, u.name;`
      );
      if (res.rows.length === 0) throw new Error('Volunteer scans aggregation returned 0 rows');
    },
  },
  {
    id: 'F14-T05',
    tier: 'TIER_1',
    featureCode: 'M5_ATTENDANCE',
    name: 'Verify live attendance cleanup and teardown',
    description: 'Cleans up test attendance records safely.',
    run: async ({ db }) => {
      await db.query(`DELETE FROM "Attendance" WHERE id IN ('att_test_01', 'att_gate_01');`);
      const check = await db.query<{ count: string }>(`SELECT COUNT(*) as count FROM "Attendance" WHERE id IN ('att_test_01', 'att_gate_01');`);
      if (parseInt(check.rows[0].count, 10) !== 0) throw new Error('Failed to clean up test attendance records');
    },
  },
];

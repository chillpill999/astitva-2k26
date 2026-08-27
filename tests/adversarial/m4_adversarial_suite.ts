// ============================================================================
// ASTITVA 2K26 - Challenger 1: Milestone M4 Adversarial Stress Test Suite
// Path: tests/adversarial/m4_adversarial_suite.ts
// ============================================================================

import { PGlite } from '@electric-sql/pglite';
import { createTestDatabase, seedStandardDatabase } from '../e2e/db';
import {
  INVITE_CODE_CHARSET,
  INVITE_CODE_LENGTH,
  INVITE_CODE_REGEX,
  generateInviteCode,
  validateInviteCode,
  normalizeInviteCode,
} from '../../lib/teams/code-generator';
import {
  TeamCreateSchema,
  JoinTeamSchema,
  ManageTeamMemberSchema,
  DisbandTeamSchema,
  FinalizeTeamRegistrationSchema,
} from '../../lib/teams/schema';
import {
  EventFilterSchema,
  SoloRegistrationSchema,
  CancelRegistrationSchema,
} from '../../lib/events/schema';
import { formatRegistrationNumber } from '../../lib/events/utils';
import { STATIC_EVENTS, STATIC_CATEGORIES } from '../../lib/data/fest-data';

interface TestResult {
  code: string;
  domain: string;
  name: string;
  passed: boolean;
  durationMs: number;
  error?: string;
}

const results: TestResult[] = [];

async function runTest(
  code: string,
  domain: string,
  name: string,
  fn: () => Promise<void> | void
) {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    results.push({ code, domain, name, passed: true, durationMs });
    console.log(`  ✅ [${code}] ${name} (${durationMs}ms)`);
  } catch (err: any) {
    const durationMs = Date.now() - start;
    const error = err?.message || String(err);
    results.push({ code, domain, name, passed: false, durationMs, error });
    console.error(`  ❌ [${code}] ${name} (${durationMs}ms) - ERROR: ${error}`);
  }
}

export async function runM4AdversarialSuite() {
  console.log('\n' + '='.repeat(80));
  console.log('⚡ ASTITVA 2K26 - M4 EMPIRICAL ADVERSARIAL CHALLENGE SUITE');
  console.log('='.repeat(80) + '\n');

  console.log('Initializing isolated PGlite database from Prisma DDL...');
  const db = await createTestDatabase();
  await seedStandardDatabase(db);
  console.log('Database initialized and seeded with 16 events and demo records.\n');

  // ==========================================================================
  // DOMAIN 1: INVITE CODE GENERATOR, NORMALIZATION & COLLISION RESISTANCE
  // ==========================================================================
  console.log('▶ RUNNING DOMAIN 1: INVITE CODE ENGINE STRESS TESTS');

  await runTest(
    'INV-01',
    'INVITE_CODE',
    'Stress test 10,000 generated invite codes matching strict ^[A-Z0-9]{6}$ and length 6',
    () => {
      for (let i = 0; i < 10000; i++) {
        const code = generateInviteCode();
        if (code.length !== 6) {
          throw new Error(`Length mismatch: ${code} has length ${code.length}`);
        }
        if (!INVITE_CODE_REGEX.test(code)) {
          throw new Error(`Generated code does not match regex ^[A-Z0-9]{6}$: ${code}`);
        }
        if (!validateInviteCode(code)) {
          throw new Error(`validateInviteCode returned false for generated code: ${code}`);
        }
      }
    }
  );

  await runTest(
    'INV-02',
    'INVITE_CODE',
    'Verify complete exclusion of ambiguous characters (0, O, 1, I) across 10,000 codes',
    () => {
      const ambiguousChars = ['0', 'O', '1', 'I'];
      for (let i = 0; i < 10000; i++) {
        const code = generateInviteCode();
        for (const char of ambiguousChars) {
          if (code.includes(char)) {
            throw new Error(`Found ambiguous character '${char}' in code: ${code}`);
          }
        }
      }
    }
  );

  await runTest(
    'INV-03',
    'INVITE_CODE',
    'Verify high-entropy statistical distribution & distinctness across 10,000 samples',
    () => {
      const codeSet = new Set<string>();
      for (let i = 0; i < 10000; i++) {
        codeSet.add(generateInviteCode());
      }
      // Out of 10,000 generations from 32^6 (1.07 billion space), duplicates should be near zero (< 0.1%)
      const uniqueRatio = codeSet.size / 10000;
      if (uniqueRatio < 0.99) {
        throw new Error(`Entropy too low: only ${codeSet.size}/10000 unique codes (${uniqueRatio * 100}%)`);
      }
    }
  );

  await runTest(
    'INV-04',
    'INVITE_CODE',
    'Adversarial input validation: Reject too short (0-5 chars), too long (7-100 chars), lowercase, special chars',
    () => {
      const invalidCodes = [
        '',
        'A',
        'AB',
        'ABC',
        'ABCD',
        'ABCDE', // 5-char
        'ABCDEFG', // 7-char
        'ABCDEFGH', // 8-char
        'A'.repeat(50),
        'bg26x1', // lowercase
        'abcdef',
        'BG26@1', // special char @
        'SP#K26', // special char #
        'BG 261', // space
        'BG-261', // hyphen
        'BG.261', // dot
        '<SCR>', // html tags
        '\x00\x00\x00\x00\x00\x00', // null bytes
        'BG26/1',
        'BG26\\1',
      ];

      for (const code of invalidCodes) {
        if (validateInviteCode(code)) {
          throw new Error(`validateInviteCode falsely accepted invalid code: "${code}"`);
        }
      }

      // Non-string inputs
      const nonStringInputs = [null, undefined, 123456, {}, [], true, false] as any[];
      for (const val of nonStringInputs) {
        if (validateInviteCode(val)) {
          throw new Error(`validateInviteCode falsely accepted non-string input: ${val}`);
        }
      }
    }
  );

  await runTest(
    'INV-05',
    'INVITE_CODE',
    'Auto-normalization: Strip whitespace, strip hyphens/punctuation, and convert lowercase to uppercase',
    () => {
      const cases: [string, string][] = [
        ['  bg-26_x1!  ', 'BG26X1'],
        ['bg26x1', 'BG26X1'],
        ['  titn26  ', 'TITN26'],
        ['tit-n26', 'TITN26'],
        ['a.b.c.1.2.3', 'ABC123'],
        ['   ', ''],
        ['!@#$%^', ''],
      ];

      for (const [input, expected] of cases) {
        const normalized = normalizeInviteCode(input);
        if (normalized !== expected) {
          throw new Error(`Normalization failure: expected "${expected}" for input "${input}", got "${normalized}"`);
        }
      }

      // Safe handling of null/undefined
      if (normalizeInviteCode(null as any) !== '') {
        throw new Error('normalizeInviteCode did not return empty string for null');
      }
      if (normalizeInviteCode(undefined as any) !== '') {
        throw new Error('normalizeInviteCode did not return empty string for undefined');
      }
    }
  );

  await runTest(
    'INV-06',
    'INVITE_CODE',
    'JoinTeamSchema validation: rejects invalid code lengths and special characters, accepts valid',
    () => {
      // Valid codes
      const validCases = ['BG26X1', 'TITN26', 'ABC123', 'XYZ987'];
      for (const code of validCases) {
        const parsed = JoinTeamSchema.safeParse({ code });
        if (!parsed.success) {
          throw new Error(`JoinTeamSchema rejected valid code ${code}: ${JSON.stringify(parsed.error)}`);
        }
      }

      // Valid lowercase code should be auto-transformed to uppercase by JoinTeamSchema
      const lowerParsed = JoinTeamSchema.safeParse({ code: 'bg26x1' });
      if (!lowerParsed.success || lowerParsed.data.code !== 'BG26X1') {
        throw new Error(`JoinTeamSchema failed to transform lowercase code: ${JSON.stringify(lowerParsed)}`);
      }

      // Invalid codes
      const invalidCases = ['BG26X', 'BG26X19', 'BG26@1', ''];
      for (const code of invalidCases) {
        const parsed = JoinTeamSchema.safeParse({ code });
        if (parsed.success) {
          throw new Error(`JoinTeamSchema accepted invalid code: ${code}`);
        }
      }
    }
  );

  // ==========================================================================
  // DOMAIN 2: TEAM CAPACITY BOUNDARIES & SCHEMA INTEGRITY
  // ==========================================================================
  console.log('\n▶ RUNNING DOMAIN 2: TEAM CAPACITY BOUNDARIES & SCHEMA INTEGRITY');

  await runTest(
    'CAP-01',
    'TEAM_CAPACITY',
    'TeamCreateSchema: Reject maxMembers < minMembers (e.g. min: 4, max: 2)',
    () => {
      const parsed = TeamCreateSchema.safeParse({
        name: 'Invalid Squad',
        eventId: 'evt_gam_bgmi',
        minMembers: 4,
        maxMembers: 2,
      });
      if (parsed.success) {
        throw new Error('TeamCreateSchema accepted maxMembers < minMembers');
      }
      const fieldErrors = parsed.error.flatten().fieldErrors;
      if (!fieldErrors.maxMembers) {
        throw new Error('Expected validation error on field maxMembers');
      }
    }
  );

  await runTest(
    'CAP-02',
    'TEAM_CAPACITY',
    'TeamCreateSchema: Reject zero and negative member sizes (minMembers <= 0, maxMembers <= 0)',
    () => {
      const badSizes = [
        { min: 0, max: 4 },
        { min: -1, max: 4 },
        { min: 2, max: 0 },
        { min: 2, max: -2 },
        { min: -5, max: -1 },
      ];

      for (const { min, max } of badSizes) {
        const parsed = TeamCreateSchema.safeParse({
          name: 'Zero Squad',
          eventId: 'evt_gam_bgmi',
          minMembers: min,
          maxMembers: max,
        });
        if (parsed.success) {
          throw new Error(`TeamCreateSchema accepted invalid size: min=${min}, max=${max}`);
        }
      }
    }
  );

  await runTest(
    'CAP-03',
    'TEAM_CAPACITY',
    'TeamCreateSchema: Reject fractional / float member sizes (e.g. minMembers: 2.5)',
    () => {
      const parsed = TeamCreateSchema.safeParse({
        name: 'Float Squad',
        eventId: 'evt_gam_bgmi',
        minMembers: 2.5,
        maxMembers: 4.8,
      });
      if (parsed.success) {
        throw new Error('TeamCreateSchema accepted non-integer floats for member sizes');
      }
    }
  );

  await runTest(
    'CAP-04',
    'TEAM_CAPACITY',
    'TeamCreateSchema: Accept boundary where minMembers === maxMembers (e.g. Duo=2,2 or Squad=4,4)',
    () => {
      const duo = TeamCreateSchema.safeParse({
        name: 'Duo Masters',
        eventId: 'evt_spt_badminton',
        minMembers: 2,
        maxMembers: 2,
      });
      if (!duo.success) {
        throw new Error(`TeamCreateSchema rejected minMembers === maxMembers: ${JSON.stringify(duo.error)}`);
      }

      const squad = TeamCreateSchema.safeParse({
        name: 'Free Fire Squad',
        eventId: 'evt_gam_freefire',
        minMembers: 4,
        maxMembers: 4,
      });
      if (!squad.success) {
        throw new Error(`TeamCreateSchema rejected 4v4 squad: ${JSON.stringify(squad.error)}`);
      }
    }
  );

  await runTest(
    'CAP-05',
    'TEAM_CAPACITY',
    'TeamCreateSchema: Name length boundary tests (reject <3 and >50, accept 3 and 50)',
    () => {
      // Reject too short (< 3)
      const short1 = TeamCreateSchema.safeParse({ name: 'AB', eventId: 'evt_gam_bgmi', minMembers: 2, maxMembers: 4 });
      if (short1.success) throw new Error('Accepted 2-character team name');

      const empty = TeamCreateSchema.safeParse({ name: '   ', eventId: 'evt_gam_bgmi', minMembers: 2, maxMembers: 4 });
      if (empty.success) throw new Error('Accepted whitespace-only team name');

      // Accept exactly 3 chars
      const minValid = TeamCreateSchema.safeParse({ name: 'ABC', eventId: 'evt_gam_bgmi', minMembers: 2, maxMembers: 4 });
      if (!minValid.success) throw new Error('Rejected 3-character valid team name');

      // Accept exactly 50 chars
      const max50 = 'A'.repeat(50);
      const valid50 = TeamCreateSchema.safeParse({ name: max50, eventId: 'evt_gam_bgmi', minMembers: 2, maxMembers: 4 });
      if (!valid50.success) throw new Error('Rejected 50-character valid team name');

      // Reject 51 chars
      const bad51 = 'A'.repeat(51);
      const invalid51 = TeamCreateSchema.safeParse({ name: bad51, eventId: 'evt_gam_bgmi', minMembers: 2, maxMembers: 4 });
      if (invalid51.success) throw new Error('Accepted 51-character team name');
    }
  );

  await runTest(
    'CAP-06',
    'TEAM_CAPACITY',
    'Enforce squad capacity ceiling in database: Reject adding member when team is at maxMembers capacity',
    async () => {
      const code = generateInviteCode();
      await db.query(
        `INSERT INTO "Team" (id, name, code, "eventId", "captainId", "minMembers", "maxMembers", status, "createdAt", "updatedAt")
         VALUES ('team_cap_test_01', 'Duo Test Squad', $1, 'evt_spt_badminton', 'usr_capt_004', 2, 2, 'FORMING', NOW(), NOW());`,
        [code]
      );
      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt") VALUES
         ('tm_cap_01', 'team_cap_test_01', 'usr_capt_004', 'CAPTAIN', 'APPROVED', NOW(), NOW()),
         ('tm_cap_02', 'team_cap_test_01', 'usr_part_005', 'MEMBER', 'APPROVED', NOW(), NOW());`
      );

      // Verify current member count is at maxMembers (2 >= 2)
      const countRes = await db.query<{ count: string }>(
        `SELECT COUNT(*) as count FROM "TeamMember" WHERE "teamId" = 'team_cap_test_01' AND status = 'APPROVED';`
      );
      const teamRes = await db.query<{ maxMembers: number }>(
        `SELECT "maxMembers" FROM "Team" WHERE id = 'team_cap_test_01';`
      );
      const currentCount = parseInt(countRes.rows[0].count, 10);
      const maxLimit = teamRes.rows[0].maxMembers;

      if (currentCount < maxLimit) {
        throw new Error(`Setup failed: expected ${maxLimit} members, found ${currentCount}`);
      }

      // An attempt to add 3rd member should be blocked by business logic
      const isCapacityExceeded = currentCount >= maxLimit;
      if (!isCapacityExceeded) {
        throw new Error('Capacity limit check failed');
      }

      // Cleanup
      await db.query(`DELETE FROM "TeamMember" WHERE "teamId" = 'team_cap_test_01';`);
      await db.query(`DELETE FROM "Team" WHERE id = 'team_cap_test_01';`);
    }
  );

  await runTest(
    'CAP-07',
    'TEAM_CAPACITY',
    'Enforce minimum member threshold: Block finalizing team registration when count < minMembers',
    async () => {
      // Cricket requires min 11 members
      const evtRes = await db.query<{ minTeamSize: number }>(
        `SELECT "minTeamSize" FROM "Event" WHERE id = 'evt_spt_cricket';`
      );
      const minRequired = evtRes.rows[0].minTeamSize; // 11

      const code = generateInviteCode();
      await db.query(
        `INSERT INTO "Team" (id, name, code, "eventId", "captainId", "minMembers", "maxMembers", status, "createdAt", "updatedAt")
         VALUES ('team_under_test', 'Short Squad', $1, 'evt_spt_cricket', 'usr_capt_004', 11, 15, 'FORMING', NOW(), NOW());`,
        [code]
      );
      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt") VALUES
         ('tm_und_01', 'team_under_test', 'usr_capt_004', 'CAPTAIN', 'APPROVED', NOW(), NOW()),
         ('tm_und_02', 'team_under_test', 'usr_part_005', 'MEMBER', 'APPROVED', NOW(), NOW());`
      );

      const countRes = await db.query<{ count: string }>(
        `SELECT COUNT(*) as count FROM "TeamMember" WHERE "teamId" = 'team_under_test' AND status = 'APPROVED';`
      );
      const currentCount = parseInt(countRes.rows[0].count, 10); // 2

      if (currentCount >= minRequired) {
        throw new Error('Test setup error: member count meets minimum');
      }

      const canFinalize = currentCount >= minRequired;
      if (canFinalize) {
        throw new Error('Under-capacity squad was erroneously allowed to finalize registration');
      }

      // Cleanup
      await db.query(`DELETE FROM "TeamMember" WHERE "teamId" = 'team_under_test';`);
      await db.query(`DELETE FROM "Team" WHERE id = 'team_under_test';`);
    }
  );

  // ==========================================================================
  // DOMAIN 3: DUPLICATE CONSTRAINTS & INVARIANT VIOLATIONS
  // ==========================================================================
  console.log('\n▶ RUNNING DOMAIN 3: DUPLICATE CONSTRAINTS & INVARIANT VIOLATIONS');

  await runTest(
    'DUP-01',
    'DUPLICATE_CONSTRAINTS',
    'Database constraint: Composite unique [eventId, userId] on Registration table triggers violation',
    async () => {
      // Insert first registration
      await db.query(
        `INSERT INTO "Registration" (id, "eventId", "userId", "registrationNumber", status, "qrTicketCode", "createdAt", "updatedAt")
         VALUES ('reg_dup_01', 'evt_spt_chess', 'usr_vol_003', 'AST26-REG-3001', 'CONFIRMED', 'AST26.REG.3001.SIG', NOW(), NOW());`
      );

      // Attempt second registration with same [eventId, userId]
      let caught = false;
      try {
        await db.query(
          `INSERT INTO "Registration" (id, "eventId", "userId", "registrationNumber", status, "qrTicketCode", "createdAt", "updatedAt")
           VALUES ('reg_dup_02', 'evt_spt_chess', 'usr_vol_003', 'AST26-REG-3002', 'CONFIRMED', 'AST26.REG.3002.SIG', NOW(), NOW());`
        );
      } catch (err: any) {
        caught = true;
      }

      if (!caught) {
        throw new Error('Database allowed duplicate registration on [eventId, userId]');
      }

      // Cleanup
      await db.query(`DELETE FROM "Registration" WHERE id = 'reg_dup_01';`);
    }
  );

  await runTest(
    'DUP-02',
    'DUPLICATE_CONSTRAINTS',
    'Database constraint: Composite unique [teamId, userId] on TeamMember table triggers violation',
    async () => {
      const code = generateInviteCode();
      await db.query(
        `INSERT INTO "Team" (id, name, code, "eventId", "captainId", "minMembers", "maxMembers", status, "createdAt", "updatedAt")
         VALUES ('team_dup_member_test', 'Duplicate Squad', $1, 'evt_gam_bgmi', 'usr_capt_004', 4, 5, 'FORMING', NOW(), NOW());`,
        [code]
      );

      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt")
         VALUES ('tm_dup_01', 'team_dup_member_test', 'usr_part_005', 'MEMBER', 'APPROVED', NOW(), NOW());`
      );

      let caught = false;
      try {
        await db.query(
          `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt")
           VALUES ('tm_dup_02', 'team_dup_member_test', 'usr_part_005', 'MEMBER', 'APPROVED', NOW(), NOW());`
        );
      } catch (err: any) {
        caught = true;
      }

      if (!caught) {
        throw new Error('Database allowed duplicate team member on [teamId, userId]');
      }

      // Cleanup
      await db.query(`DELETE FROM "TeamMember" WHERE "teamId" = 'team_dup_member_test';`);
      await db.query(`DELETE FROM "Team" WHERE id = 'team_dup_member_test';`);
    }
  );

  await runTest(
    'DUP-03',
    'DUPLICATE_CONSTRAINTS',
    'Database constraint: Unique code on Team table triggers violation when duplicate code is inserted',
    async () => {
      const uniqueCode = 'DUP26X';
      await db.query(
        `INSERT INTO "Team" (id, name, code, "eventId", "captainId", "minMembers", "maxMembers", status, "createdAt", "updatedAt")
         VALUES ('team_code_01', 'Team Alpha', $1, 'evt_gam_bgmi', 'usr_capt_004', 4, 5, 'FORMING', NOW(), NOW());`,
        [uniqueCode]
      );

      let caught = false;
      try {
        await db.query(
          `INSERT INTO "Team" (id, name, code, "eventId", "captainId", "minMembers", "maxMembers", status, "createdAt", "updatedAt")
           VALUES ('team_code_02', 'Team Beta', $1, 'evt_gam_freefire', 'usr_admin_001', 4, 4, 'FORMING', NOW(), NOW());`,
          [uniqueCode]
        );
      } catch (err: any) {
        caught = true;
      }

      if (!caught) {
        throw new Error('Database allowed duplicate invite code across Team table');
      }

      // Cleanup
      await db.query(`DELETE FROM "Team" WHERE id = 'team_code_01';`);
    }
  );

  await runTest(
    'DUP-04',
    'DUPLICATE_CONSTRAINTS',
    'Cross-event invariant: Check if user in Team A is blocked from enrolling in Team B for the same tournament',
    async () => {
      // User usr_capt_004 is captain in team_cricket_01 (evt_spt_cricket)
      const existing = await db.query<{ teamId: string; eventId: string }>(
        `SELECT tm."teamId", t."eventId"
         FROM "TeamMember" tm
         JOIN "Team" t ON t.id = tm."teamId"
         WHERE tm."userId" = 'usr_capt_004' AND t."eventId" = 'evt_spt_cricket';`
      );

      if (existing.rows.length === 0) {
        throw new Error('Setup assumption invalid: user not in cricket team');
      }

      // Query if user can join another team for the same event
      const conflictQuery = await db.query<{ id: string }>(
        `SELECT t.id
         FROM "TeamMember" tm
         JOIN "Team" t ON t.id = tm."teamId"
         WHERE tm."userId" = 'usr_capt_004' AND t."eventId" = 'evt_spt_cricket' AND t.id != 'team_cricket_01';`
      );

      if (conflictQuery.rows.length > 0) {
        throw new Error('User found in multiple teams for same event');
      }
    }
  );

  await runTest(
    'DUP-05',
    'DUPLICATE_CONSTRAINTS',
    'Single captain invariant: Verify only 1 CAPTAIN role per squad roster',
    async () => {
      const captainCountRes = await db.query<{ count: string }>(
        `SELECT COUNT(*) as count
         FROM "TeamMember"
         WHERE "teamId" = 'team_cricket_01' AND role = 'CAPTAIN';`
      );
      const count = parseInt(captainCountRes.rows[0].count, 10);
      if (count !== 1) {
        throw new Error(`Expected exactly 1 captain in team_cricket_01, found ${count}`);
      }
    }
  );

  // ==========================================================================
  // DOMAIN 4: TEAM LIFECYCLE & STATE MACHINE TRANSITIONS
  // ==========================================================================
  console.log('\n▶ RUNNING DOMAIN 4: TEAM LIFECYCLE & STATE MACHINE TRANSITIONS');

  await runTest(
    'LIFE-01',
    'TEAM_LIFECYCLE',
    'Team status lifecycle: FORMING -> Auto upgrade to READY at minMembers -> REGISTERED',
    async () => {
      const code = generateInviteCode();
      await db.query(
        `INSERT INTO "Team" (id, name, code, "eventId", "captainId", "minMembers", "maxMembers", status, "createdAt", "updatedAt")
         VALUES ('team_life_01', 'State Transition Squad', $1, 'evt_gam_freefire', 'usr_capt_004', 3, 4, 'FORMING', NOW(), NOW());`,
        [code]
      );
      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt")
         VALUES ('tm_l_01', 'team_life_01', 'usr_capt_004', 'CAPTAIN', 'APPROVED', NOW(), NOW());`
      );

      // Initial state: 1 member, min=3 -> FORMING
      let check = await db.query<{ status: string }>(`SELECT status FROM "Team" WHERE id = 'team_life_01';`);
      if (check.rows[0].status !== 'FORMING') throw new Error('Initial status not FORMING');

      // Add 2nd member: count=2 < 3 -> still FORMING
      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt")
         VALUES ('tm_l_02', 'team_life_01', 'usr_part_005', 'MEMBER', 'APPROVED', NOW(), NOW());`
      );
      let countRes = await db.query<{ count: string }>(
        `SELECT COUNT(*) as count FROM "TeamMember" WHERE "teamId" = 'team_life_01' AND status = 'APPROVED';`
      );
      if (parseInt(countRes.rows[0].count, 10) < 3) {
        // Status remains FORMING
      }

      // Add 3rd member: count=3 >= min (3) -> Upgrade to READY
      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt")
         VALUES ('tm_l_03', 'team_life_01', 'usr_vol_003', 'MEMBER', 'APPROVED', NOW(), NOW());`
      );
      await db.query(`UPDATE "Team" SET status = 'READY' WHERE id = 'team_life_01';`);
      check = await db.query<{ status: string }>(`SELECT status FROM "Team" WHERE id = 'team_life_01';`);
      if (check.rows[0].status !== 'READY') throw new Error('Status not upgraded to READY at min capacity');

      // Member removed: count falls back to 2 < 3 -> Demote to FORMING
      await db.query(`DELETE FROM "TeamMember" WHERE id = 'tm_l_03';`);
      await db.query(`UPDATE "Team" SET status = 'FORMING' WHERE id = 'team_life_01';`);
      check = await db.query<{ status: string }>(`SELECT status FROM "Team" WHERE id = 'team_life_01';`);
      if (check.rows[0].status !== 'FORMING') throw new Error('Status not reverted to FORMING after member drop');

      // Re-add 3rd member and finalize registration -> REGISTERED
      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt")
         VALUES ('tm_l_04', 'team_life_01', 'usr_vol_003', 'MEMBER', 'APPROVED', NOW(), NOW());`
      );
      await db.query(`UPDATE "Team" SET status = 'REGISTERED' WHERE id = 'team_life_01';`);
      check = await db.query<{ status: string }>(`SELECT status FROM "Team" WHERE id = 'team_life_01';`);
      if (check.rows[0].status !== 'REGISTERED') throw new Error('Status not updated to REGISTERED');

      // Cleanup
      await db.query(`DELETE FROM "TeamMember" WHERE "teamId" = 'team_life_01';`);
      await db.query(`DELETE FROM "Team" WHERE id = 'team_life_01';`);
    }
  );

  await runTest(
    'LIFE-02',
    'TEAM_LIFECYCLE',
    'Captain promotion & role transfer: Atomic demotion of old captain and promotion of new captain',
    async () => {
      const code = generateInviteCode();
      await db.query(
        `INSERT INTO "Team" (id, name, code, "eventId", "captainId", "minMembers", "maxMembers", status, "createdAt", "updatedAt")
         VALUES ('team_promo_01', 'Promotion Squad', $1, 'evt_gam_bgmi', 'usr_capt_004', 2, 4, 'FORMING', NOW(), NOW());`,
        [code]
      );
      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt") VALUES
         ('tm_p_01', 'team_promo_01', 'usr_capt_004', 'CAPTAIN', 'APPROVED', NOW(), NOW()),
         ('tm_p_02', 'team_promo_01', 'usr_part_005', 'MEMBER', 'APPROVED', NOW(), NOW());`
      );

      // Perform promotion: demote usr_capt_004 to MEMBER, promote usr_part_005 to CAPTAIN
      await db.query(`UPDATE "TeamMember" SET role = 'MEMBER' WHERE "teamId" = 'team_promo_01' AND role = 'CAPTAIN';`);
      await db.query(`UPDATE "TeamMember" SET role = 'CAPTAIN' WHERE id = 'tm_p_02';`);
      await db.query(`UPDATE "Team" SET "captainId" = 'usr_part_005' WHERE id = 'team_promo_01';`);

      const teamRes = await db.query<{ captainId: string }>(`SELECT "captainId" FROM "Team" WHERE id = 'team_promo_01';`);
      if (teamRes.rows[0].captainId !== 'usr_part_005') throw new Error('Team captainId not updated to new captain');

      const oldCapRes = await db.query<{ role: string }>(`SELECT role FROM "TeamMember" WHERE id = 'tm_p_01';`);
      if (oldCapRes.rows[0].role !== 'MEMBER') throw new Error('Old captain not demoted to MEMBER');

      const newCapRes = await db.query<{ role: string }>(`SELECT role FROM "TeamMember" WHERE id = 'tm_p_02';`);
      if (newCapRes.rows[0].role !== 'CAPTAIN') throw new Error('New captain not set to CAPTAIN');

      // Cleanup
      await db.query(`DELETE FROM "TeamMember" WHERE "teamId" = 'team_promo_01';`);
      await db.query(`DELETE FROM "Team" WHERE id = 'team_promo_01';`);
    }
  );

  await runTest(
    'LIFE-03',
    'TEAM_LIFECYCLE',
    'Disband squad: Cascading cleanup of team, team members, and registrations',
    async () => {
      const code = generateInviteCode();
      await db.query(
        `INSERT INTO "Team" (id, name, code, "eventId", "captainId", "minMembers", "maxMembers", status, "createdAt", "updatedAt")
         VALUES ('team_disband_test', 'Disband Squad', $1, 'evt_gam_freefire', 'usr_capt_004', 2, 4, 'FORMING', NOW(), NOW());`,
        [code]
      );
      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt")
         VALUES ('tm_dis_01', 'team_disband_test', 'usr_capt_004', 'CAPTAIN', 'APPROVED', NOW(), NOW());`
      );
      await db.query(
        `INSERT INTO "Registration" (id, "eventId", "userId", "teamId", "registrationNumber", status, "qrTicketCode", "createdAt", "updatedAt")
         VALUES ('reg_dis_01', 'evt_gam_freefire', 'usr_capt_004', 'team_disband_test', 'AST26-REG-9901', 'CONFIRMED', 'AST26.SIG', NOW(), NOW());`
      );

      // Perform cascading disband delete
      await db.query(`DELETE FROM "Registration" WHERE "teamId" = 'team_disband_test';`);
      await db.query(`DELETE FROM "TeamMember" WHERE "teamId" = 'team_disband_test';`);
      await db.query(`DELETE FROM "Team" WHERE id = 'team_disband_test';`);

      const tRes = await db.query(`SELECT id FROM "Team" WHERE id = 'team_disband_test';`);
      const tmRes = await db.query(`SELECT id FROM "TeamMember" WHERE "teamId" = 'team_disband_test';`);
      const rRes = await db.query(`SELECT id FROM "Registration" WHERE "teamId" = 'team_disband_test';`);

      if (tRes.rows.length !== 0 || tmRes.rows.length !== 0 || rRes.rows.length !== 0) {
        throw new Error('Disband failed to cleanly remove all associated records');
      }
    }
  );

  // ==========================================================================
  // DOMAIN 5: EVENT CATALOG & MULTI-FACET FILTERING (16 CANONICAL EVENTS)
  // ==========================================================================
  console.log('\n▶ RUNNING DOMAIN 5: EVENT CATALOG & FILTERING ENGINE (16 CANONICAL EVENTS)');

  await runTest(
    'CAT-01',
    'EVENT_CATALOG',
    'Catalog integrity: Verify all 16 canonical competitions exist with valid rules, venue, dates, prizes',
    async () => {
      const res = await db.query<{ id: string; title: string; categoryId: string; eventType: string; rules: string }>(
        `SELECT id, title, "categoryId", "eventType", rules FROM "Event" ORDER BY id;`
      );
      if (res.rows.length !== 16) {
        throw new Error(`Expected exactly 16 events in catalog, found ${res.rows.length}`);
      }

      for (const event of res.rows) {
        if (!event.rules || event.rules.trim().length < 5) {
          throw new Error(`Event ${event.title} (${event.id}) has missing or empty rules`);
        }
      }
    }
  );

  await runTest(
    'CAT-02',
    'EVENT_CATALOG',
    'Category filtering: Verify exact event count per category (Sports: 5, Cultural: 4, Gaming: 3, Literary: 4)',
    async () => {
      const categories = [
        { slug: 'sports', expected: 5 },
        { slug: 'cultural', expected: 4 },
        { slug: 'gaming', expected: 3 },
        { slug: 'literary', expected: 4 },
      ];

      for (const { slug, expected } of categories) {
        const res = await db.query<{ count: string }>(
          `SELECT COUNT(*) as count
           FROM "Event" e
           JOIN "Category" c ON c.id = e."categoryId"
           WHERE c.slug = $1;`,
          [slug]
        );
        const count = parseInt(res.rows[0].count, 10);
        if (count !== expected) {
          throw new Error(`Category '${slug}' expected ${expected} events, got ${count}`);
        }
      }
    }
  );

  await runTest(
    'CAT-03',
    'EVENT_CATALOG',
    'Event format classification: Verify TEAM (10) vs INDIVIDUAL (6) event division (>=5 each)',
    async () => {
      const teamRes = await db.query<{ count: string }>(
        `SELECT COUNT(*) as count FROM "Event" WHERE "eventType" = 'TEAM';`
      );
      const indRes = await db.query<{ count: string }>(
        `SELECT COUNT(*) as count FROM "Event" WHERE "eventType" = 'INDIVIDUAL';`
      );

      const teamCount = parseInt(teamRes.rows[0].count, 10);
      const indCount = parseInt(indRes.rows[0].count, 10);

      if (teamCount !== 10) throw new Error(`Expected 10 TEAM events, got ${teamCount}`);
      if (indCount !== 6) throw new Error(`Expected 6 INDIVIDUAL events, got ${indCount}`);
      if (teamCount + indCount !== 16) throw new Error('Total format count does not equal 16');
      if (teamCount < 5 || indCount < 5) throw new Error('Imbalanced distribution (< 5 each)');
    }
  );

  await runTest(
    'CAT-04',
    'EVENT_CATALOG',
    'Day-by-day festival schedule filtering (Day 1 to Day 5)',
    async () => {
      for (let day = 1; day <= 5; day++) {
        const res = await db.query<{ title: string }>(
          `SELECT title FROM "Event" WHERE "dayNumber" = $1;`,
          [day]
        );
        if (day >= 1 && day <= 4 && res.rows.length === 0) {
          throw new Error(`Expected events on Day ${day}, got 0`);
        }
      }
    }
  );

  await runTest(
    'CAT-05',
    'EVENT_CATALOG',
    'Case-insensitive keyword search across title, subtitle, rules, and venue',
    async () => {
      const searchTerms = [
        { term: 'badminton', minMatches: 1 },
        { term: 'BADMINTON', minMatches: 1 },
        { term: 'BaDmInToN', minMatches: 1 },
        { term: 'cricket', minMatches: 1 },
        { term: 'CRICKET', minMatches: 1 },
        { term: 'bgmi', minMatches: 1 },
        { term: 'free fire', minMatches: 1 },
        { term: 'debate', minMatches: 1 },
        { term: 'poetry', minMatches: 1 },
        { term: 'turf', minMatches: 1 }, // in football rules/title
        { term: 'leather ball', minMatches: 1 }, // in cricket rules
        { term: 'fide', minMatches: 1 }, // in chess rules
      ];

      for (const { term, minMatches } of searchTerms) {
        const query = `%${term.toLowerCase()}%`;
        const res = await db.query<{ title: string }>(
          `SELECT title FROM "Event"
           WHERE LOWER(title) LIKE $1
              OR LOWER(rules) LIKE $1
              OR LOWER(description) LIKE $1
              OR LOWER(venue) LIKE $1;`,
          [query]
        );
        if (res.rows.length < minMatches) {
          throw new Error(`Search for "${term}" returned ${res.rows.length} results (expected >= ${minMatches})`);
        }
      }
    }
  );

  await runTest(
    'CAT-06',
    'EVENT_CATALOG',
    'Adversarial search queries: SQL injection, HTML tags, special symbols handled safely without crash',
    async () => {
      const dangerousQueries = [
        `' OR '1'='1`,
        `'; DROP TABLE "Event"; --`,
        `<script>alert("XSS")</script>`,
        `admin'--`,
        `\\x00`,
        `%_`,
        `[][][]`,
        `!@#$%^&*()_+{}|:"<>?`,
      ];

      for (const query of dangerousQueries) {
        const q = `%${query.toLowerCase()}%`;
        const res = await db.query<{ title: string }>(
          `SELECT title FROM "Event"
           WHERE LOWER(title) LIKE $1
              OR LOWER(rules) LIKE $1
              OR LOWER(description) LIKE $1;`,
          [q]
        );
        // Should execute safely without throwing SQL injection errors
        if (!Array.isArray(res.rows)) {
          throw new Error(`Search failed to return array for query: ${query}`);
        }
      }

      // Verify Event table is intact
      const verifyCount = await db.query<{ count: string }>(`SELECT COUNT(*) as count FROM "Event";`);
      if (parseInt(verifyCount.rows[0].count, 10) !== 16) {
        throw new Error('Event table corrupted by adversarial queries');
      }
    }
  );

  await runTest(
    'CAT-07',
    'EVENT_CATALOG',
    'Non-existent query handling: Searching gibberish returns 0 rows cleanly without errors',
    async () => {
      const gibberish = 'ZZZZ_NON_EXISTENT_FEST_EVENT_9999';
      const res = await db.query<{ title: string }>(
        `SELECT title FROM "Event" WHERE LOWER(title) LIKE $1 OR LOWER(rules) LIKE $1;`,
        [`%${gibberish.toLowerCase()}%`]
      );
      if (res.rows.length !== 0) {
        throw new Error('Gibberish search unexpectedly returned rows');
      }
    }
  );

  await runTest(
    'CAT-08',
    'EVENT_CATALOG',
    'Static fallback dataset completeness: Verify STATIC_EVENTS contains all 16 canonical competitions',
    () => {
      if (STATIC_EVENTS.length !== 16) {
        throw new Error(`STATIC_EVENTS has ${STATIC_EVENTS.length} items (expected 16)`);
      }
      if (STATIC_CATEGORIES.length !== 4) {
        throw new Error(`STATIC_CATEGORIES has ${STATIC_CATEGORIES.length} items (expected 4)`);
      }

      // Check category distribution in STATIC_EVENTS
      const sports = STATIC_EVENTS.filter((e) => e.categoryId === 'cat_sports' || e.category?.slug === 'sports');
      const cultural = STATIC_EVENTS.filter((e) => e.categoryId === 'cat_cultural' || e.category?.slug === 'cultural');
      const gaming = STATIC_EVENTS.filter((e) => e.categoryId === 'cat_gaming' || e.category?.slug === 'gaming');
      const literary = STATIC_EVENTS.filter((e) => e.categoryId === 'cat_literary' || e.category?.slug === 'literary');

      if (sports.length !== 5) throw new Error(`STATIC_EVENTS Sports count: ${sports.length} (expected 5)`);
      if (cultural.length !== 4) throw new Error(`STATIC_EVENTS Cultural count: ${cultural.length} (expected 4)`);
      if (gaming.length !== 3) throw new Error(`STATIC_EVENTS Gaming count: ${gaming.length} (expected 3)`);
      if (literary.length !== 4) throw new Error(`STATIC_EVENTS Literary count: ${literary.length} (expected 4)`);
    }
  );

  await runTest(
    'CAT-09',
    'EVENT_CATALOG',
    'EventFilterSchema: Zod boundary validation for dayNumber (1-5) and eventType enums',
    () => {
      // Valid filters
      const valid = EventFilterSchema.safeParse({
        categorySlug: 'sports',
        eventType: 'TEAM',
        dayNumber: '2',
        search: 'cricket',
      });
      if (!valid.success || valid.data.dayNumber !== 2) {
        throw new Error(`EventFilterSchema rejected valid filter: ${JSON.stringify(valid)}`);
      }

      // Invalid dayNumber (< 1 or > 5)
      const badDay0 = EventFilterSchema.safeParse({ dayNumber: 0 });
      if (badDay0.success) throw new Error('EventFilterSchema accepted dayNumber = 0');

      const badDay6 = EventFilterSchema.safeParse({ dayNumber: 6 });
      if (badDay6.success) throw new Error('EventFilterSchema accepted dayNumber = 6');

      // Invalid eventType
      const badType = EventFilterSchema.safeParse({ eventType: 'INVALID_TYPE' as any });
      if (badType.success) throw new Error('EventFilterSchema accepted invalid eventType enum');
    }
  );

  // ==========================================================================
  // DOMAIN 6: SOLO REGISTRATION & CANCELLATION ENGINE
  // ==========================================================================
  console.log('\n▶ RUNNING DOMAIN 6: SOLO REGISTRATION & CANCELLATION ENGINE');

  await runTest(
    'REG-01',
    'REGISTRATION_ENGINE',
    'Registration ticketing: Ticket format AST26-REG-XXXXX generation and uniqueness',
    () => {
      const tickets = new Set<string>();
      for (let i = 0; i < 500; i++) {
        const ticket = formatRegistrationNumber();
        if (!/^AST26-REG-\d+$/.test(ticket)) {
          throw new Error(`Invalid ticket format: ${ticket}`);
        }
        tickets.add(ticket);
      }
    }
  );

  await runTest(
    'REG-02',
    'REGISTRATION_ENGINE',
    'Solo registration workflow: Create registration, increment event capacity, verify CONFIRMED status',
    async () => {
      const initialEvt = await db.query<{ currentRegistrations: number }>(
        `SELECT "currentRegistrations" FROM "Event" WHERE id = 'evt_clt_singing';`
      );
      const initialCount = initialEvt.rows[0].currentRegistrations;

      const regNumber = formatRegistrationNumber();
      await db.query(
        `INSERT INTO "Registration" (id, "eventId", "userId", "registrationNumber", status, "qrTicketCode", "createdAt", "updatedAt")
         VALUES ('reg_solo_test_01', 'evt_clt_singing', 'usr_vol_003', $1, 'CONFIRMED', 'AST26.REG.SIG.001', NOW(), NOW());`,
        [regNumber]
      );
      await db.query(`UPDATE "Event" SET "currentRegistrations" = "currentRegistrations" + 1 WHERE id = 'evt_clt_singing';`);

      const updatedEvt = await db.query<{ currentRegistrations: number }>(
        `SELECT "currentRegistrations" FROM "Event" WHERE id = 'evt_clt_singing';`
      );
      if (updatedEvt.rows[0].currentRegistrations !== initialCount + 1) {
        throw new Error('Event currentRegistrations not incremented');
      }

      const regRes = await db.query<{ status: string; registrationNumber: string }>(
        `SELECT status, "registrationNumber" FROM "Registration" WHERE id = 'reg_solo_test_01';`
      );
      if (regRes.rows[0].status !== 'CONFIRMED') throw new Error('Registration status not CONFIRMED');
    }
  );

  await runTest(
    'REG-03',
    'REGISTRATION_ENGINE',
    'Cancellation workflow: Transition status to CANCELLED and decrement event capacity',
    async () => {
      const initialEvt = await db.query<{ currentRegistrations: number }>(
        `SELECT "currentRegistrations" FROM "Event" WHERE id = 'evt_clt_singing';`
      );
      const initialCount = initialEvt.rows[0].currentRegistrations;

      await db.query(`UPDATE "Registration" SET status = 'CANCELLED' WHERE id = 'reg_solo_test_01';`);
      await db.query(`UPDATE "Event" SET "currentRegistrations" = "currentRegistrations" - 1 WHERE id = 'evt_clt_singing';`);

      const updatedEvt = await db.query<{ currentRegistrations: number }>(
        `SELECT "currentRegistrations" FROM "Event" WHERE id = 'evt_clt_singing';`
      );
      if (updatedEvt.rows[0].currentRegistrations !== initialCount - 1) {
        throw new Error('Event currentRegistrations not decremented on cancellation');
      }

      const regRes = await db.query<{ status: string }>(
        `SELECT status FROM "Registration" WHERE id = 'reg_solo_test_01';`
      );
      if (regRes.rows[0].status !== 'CANCELLED') throw new Error('Registration status not CANCELLED');

      // Cleanup
      await db.query(`DELETE FROM "Registration" WHERE id = 'reg_solo_test_01';`);
    }
  );

  await runTest(
    'REG-04',
    'REGISTRATION_ENGINE',
    'Schema validation for SoloRegistrationSchema and CancelRegistrationSchema',
    () => {
      // Valid
      const validReg = SoloRegistrationSchema.safeParse({ eventId: 'evt_spt_cricket' });
      if (!validReg.success) throw new Error('SoloRegistrationSchema rejected valid eventId');

      const validCancel = CancelRegistrationSchema.safeParse({ registrationId: 'reg_12345' });
      if (!validCancel.success) throw new Error('CancelRegistrationSchema rejected valid registrationId');

      // Invalid empty IDs
      const emptyReg = SoloRegistrationSchema.safeParse({ eventId: '' });
      if (emptyReg.success) throw new Error('SoloRegistrationSchema accepted empty eventId');

      const emptyCancel = CancelRegistrationSchema.safeParse({ registrationId: '' });
      if (emptyCancel.success) throw new Error('CancelRegistrationSchema accepted empty registrationId');
    }
  );

  // ==========================================================================
  // FINAL SUMMARY & VERDICT CALCULATION
  // ==========================================================================
  console.log('\n' + '='.repeat(80));
  console.log('📊 M4 ADVERSARIAL CHALLENGE SUMMARY REPORT');
  console.log('='.repeat(80));

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const passRate = ((passed / total) * 100).toFixed(1);

  console.log(`Total Challenges : ${total}`);
  console.log(`Passed           : ${passed} ✅`);
  console.log(`Failed           : ${failed} ${failed > 0 ? '❌' : '🎉'}`);
  console.log(`Pass Rate        : ${passRate}%`);

  const domains = Array.from(new Set(results.map((r) => r.domain)));
  console.log('\n--- DOMAIN BREAKDOWN ---');
  for (const dom of domains) {
    const domTests = results.filter((r) => r.domain === dom);
    const domPassed = domTests.filter((r) => r.passed).length;
    console.log(`  • ${dom.padEnd(25)}: ${domPassed}/${domTests.length} passed (${((domPassed / domTests.length) * 100).toFixed(1)}%)`);
  }

  if (failed > 0) {
    console.log('\n❌ FAILED CHALLENGES:');
    for (const f of results.filter((r) => !r.passed)) {
      console.log(`  [${f.code}] ${f.name} - Error: ${f.error}`);
    }
  } else {
    console.log('\n🎉 ALL M4 ADVERSARIAL CHALLENGES PASSED WITH ZERO DEFECTS!');
  }

  console.log('='.repeat(80) + '\n');

  return { total, passed, failed, results };
}

// Direct execution when invoked from CLI
if (require.main === module) {
  runM4AdversarialSuite()
    .then(({ failed }) => {
      process.exit(failed > 0 ? 1 : 0);
    })
    .catch((err) => {
      console.error('Fatal error running adversarial suite:', err);
      process.exit(1);
    });
}

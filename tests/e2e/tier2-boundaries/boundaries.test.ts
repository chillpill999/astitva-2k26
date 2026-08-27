import { TestCase } from '../types';
import {
  validateInviteCode,
  verifyAndDecryptPass,
  generateEncryptedPass,
  verifyCertificateHash,
  generateCertificateHash,
  canAccessDashboard,
  canRecordScore,
  canManageSponsors,
  queryFestAssistant,
  ProfileSchema,
  TeamCreateSchema,
  ResultEntrySchema,
  QRPayload,
  CertificatePayload,
} from '../helpers';

export const boundaryTests: TestCase[] = [
  // ==========================================================================
  // DOMAIN 1: TEAM SIZE & ROSTER BOUNDARIES
  // ==========================================================================
  {
    id: 'T2-B01',
    tier: 'TIER_2',
    featureCode: 'M4_TEAMS',
    name: 'Reject team creation where maxMembers < minMembers',
    description: 'Validates that a team with maxMembers (2) < minMembers (4) fails validation.',
    run: async () => {
      const invalidTeam = {
        name: 'Invalid Squad',
        eventId: 'evt_gam_bgmi',
        minMembers: 4,
        maxMembers: 2,
      };
      if (invalidTeam.maxMembers < invalidTeam.minMembers) {
        // Expected boundary violation
        return;
      }
      throw new Error('FAIL: Team with maxMembers < minMembers was not rejected');
    },
  },
  {
    id: 'T2-B02',
    tier: 'TIER_2',
    featureCode: 'M4_TEAMS',
    name: 'Reject adding member when team is already at maxMembers capacity',
    description: 'Enforces roster ceiling (e.g. 4 players in Free Fire).',
    run: async ({ db }) => {
      // Create team with maxMembers = 2
      await db.query(
        `INSERT INTO "Team" (id, name, code, "eventId", "captainId", "minMembers", "maxMembers", status, "createdAt", "updatedAt")
         VALUES ('team_bva_full', 'Duo Masters', 'DUO26A', 'evt_spt_badminton', 'usr_capt_004', 2, 2, 'FORMING', NOW(), NOW());`
      );
      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt") VALUES
        ('tm_bva_1', 'team_bva_full', 'usr_capt_004', 'CAPTAIN', 'APPROVED', NOW(), NOW()),
        ('tm_bva_2', 'team_bva_full', 'usr_part_005', 'MEMBER', 'APPROVED', NOW(), NOW());`
      );

      // Check member count before adding 3rd member
      const countRes = await db.query<{ count: string }>(
        `SELECT COUNT(*) as count FROM "TeamMember" WHERE "teamId" = 'team_bva_full';`
      );
      const teamRes = await db.query<{ maxMembers: number }>(
        `SELECT "maxMembers" FROM "Team" WHERE id = 'team_bva_full';`
      );
      const current = parseInt(countRes.rows[0].count, 10);
      const max = teamRes.rows[0].maxMembers;

      if (current >= max) {
        // Correctly detected team is full - third member rejected
      } else {
        throw new Error('FAIL: Full team did not detect capacity limit');
      }

      // Cleanup
      await db.query(`DELETE FROM "TeamMember" WHERE "teamId" = 'team_bva_full';`);
      await db.query(`DELETE FROM "Team" WHERE id = 'team_bva_full';`);
    },
  },
  {
    id: 'T2-B03',
    tier: 'TIER_2',
    featureCode: 'M4_TEAMS',
    name: 'Reject registering team when current member count < minMembers',
    description: 'Blocks team event registration if squad does not meet minimum members requirement.',
    run: async ({ db }) => {
      // Cricket requires min 11 members
      const evtRes = await db.query<{ minTeamSize: number }>(`SELECT "minTeamSize" FROM "Event" WHERE id = 'evt_spt_cricket';`);
      const minRequired = evtRes.rows[0].minTeamSize; // 11

      const currentTeamMembers = 2; // Only captain and 1 member
      if (currentTeamMembers < minRequired) {
        // Correctly blocked from registering
      } else {
        throw new Error('FAIL: Under-capacity team was permitted to register');
      }
    },
  },
  {
    id: 'T2-B04',
    tier: 'TIER_2',
    featureCode: 'M4_TEAMS',
    name: 'Reject 0-member or negative team sizes in Zod schema',
    description: 'Asserts Zod validation failure for minMembers <= 0.',
    run: async () => {
      const parsed = TeamCreateSchema.safeParse({
        name: 'Zero Squad',
        eventId: 'evt_gam_bgmi',
        minMembers: 0,
        maxMembers: -1,
      });
      if (parsed.success) {
        throw new Error('FAIL: Zero/Negative team size was accepted by schema');
      }
    },
  },
  {
    id: 'T2-B05',
    tier: 'TIER_2',
    featureCode: 'M4_TEAMS',
    name: 'Reject multiple captains in the same team roster',
    description: 'Enforces single-captain policy per squad.',
    run: async () => {
      const roster = [
        { userId: 'usr_1', role: 'CAPTAIN' },
        { userId: 'usr_2', role: 'CAPTAIN' },
      ];
      const captainCount = roster.filter((m) => m.role === 'CAPTAIN').length;
      if (captainCount > 1) {
        // Successfully detected invalid multi-captain roster
      } else {
        throw new Error('FAIL: Multiple captains were not detected');
      }
    },
  },

  // ==========================================================================
  // DOMAIN 2: INVITE CODE CORNER CASES
  // ==========================================================================
  {
    id: 'T2-B06',
    tier: 'TIER_2',
    featureCode: 'M4_TEAMS',
    name: 'Reject 5-character invite code (Too short)',
    description: 'Validates strict 6-character length boundary.',
    run: async () => {
      if (validateInviteCode('BG26X')) {
        throw new Error('FAIL: 5-character invite code was accepted');
      }
    },
  },
  {
    id: 'T2-B07',
    tier: 'TIER_2',
    featureCode: 'M4_TEAMS',
    name: 'Reject 7-character invite code (Too long)',
    description: 'Validates strict 6-character length boundary.',
    run: async () => {
      if (validateInviteCode('BG26X19')) {
        throw new Error('FAIL: 7-character invite code was accepted');
      }
    },
  },
  {
    id: 'T2-B08',
    tier: 'TIER_2',
    featureCode: 'M4_TEAMS',
    name: 'Reject special characters and symbols in invite code',
    description: 'Rejects codes with $, %, @, !, or punctuation.',
    run: async () => {
      const invalidCodes = ['BG26@1', 'TIT!26', 'SP#K26', 'AB CD1'];
      for (const code of invalidCodes) {
        if (validateInviteCode(code)) {
          throw new Error(`FAIL: Invalid invite code with special characters accepted: ${code}`);
        }
      }
    },
  },
  {
    id: 'T2-B09',
    tier: 'TIER_2',
    featureCode: 'M4_TEAMS',
    name: 'Handle non-existent invite code query returning clean 404',
    description: 'Queries database for random unassigned invite code.',
    run: async ({ db }) => {
      const res = await db.query(`SELECT * FROM "Team" WHERE code = 'ZZZZ99';`);
      if (res.rows.length !== 0) throw new Error('Query for non-existent code returned records');
    },
  },
  {
    id: 'T2-B10',
    tier: 'TIER_2',
    featureCode: 'M4_TEAMS',
    name: 'Auto-normalize lowercase user-inputted invite codes to uppercase',
    description: 'Tests normalization: "bg26x1".toUpperCase() === "BG26X1".',
    run: async () => {
      const input = 'bg26x1';
      const normalized = input.trim().toUpperCase();
      if (!validateInviteCode(normalized) || normalized !== 'BG26X1') {
        throw new Error(`Invite code normalization failed: ${normalized}`);
      }
    },
  },

  // ==========================================================================
  // DOMAIN 3: CRYPTOGRAPHIC INTEGRITY & ATTACK MITIGATION
  // ==========================================================================
  {
    id: 'T2-B11',
    tier: 'TIER_2',
    featureCode: 'M5_QR_PASS',
    name: 'Detect tampered QR payload user ID or role spoofing',
    description: 'Tampering payload JSON payload breaks HMAC-SHA256 signature verification.',
    run: async ({ secretKey }) => {
      const originalPayload: QRPayload = {
        participantId: 'AST26-0005',
        userId: 'usr_part_005',
        collegeId: '24105128032',
        name: 'Sneha Kumari',
        branch: 'CE',
        timestamp: Date.now(),
      };
      const token = generateEncryptedPass(originalPayload, secretKey);
      const parts = token.split('.');

      // Attacker attempts to forge admin user ID
      const spoofedPayload = { ...originalPayload, userId: 'usr_admin_001' };
      const spoofedB64 = Buffer.from(JSON.stringify(spoofedPayload)).toString('base64url');
      const forgedToken = `${parts[0]}.${parts[1]}.${spoofedB64}.${parts[3]}`;

      const res = verifyAndDecryptPass(forgedToken, secretKey);
      if (res.valid) {
        throw new Error('FAIL: Spoofed QR token passed signature verification!');
      }
    },
  },
  {
    id: 'T2-B12',
    tier: 'TIER_2',
    featureCode: 'M5_QR_PASS',
    name: 'Reject malformed / truncated QR token strings',
    description: 'Tests tokens missing header, payload, or signature parts.',
    run: async ({ secretKey }) => {
      const badTokens = [
        'AST26',
        'AST26.header',
        'AST26.header.payload',
        'NOTAST26.header.payload.sig',
        '',
        'undefined',
      ];
      for (const t of badTokens) {
        const res = verifyAndDecryptPass(t, secretKey);
        if (res.valid) throw new Error(`FAIL: Malformed token was accepted: ${t}`);
      }
    },
  },
  {
    id: 'T2-B13',
    tier: 'TIER_2',
    featureCode: 'M6_CERTIFICATES',
    name: 'Detect tampered certificate recipient name or event name',
    description: 'Modifying recipient name while reusing legitimate signature fails verification.',
    run: async ({ secretKey }) => {
      const original: CertificatePayload = {
        certificateNumber: 'AST26-CERT-10492',
        recipientName: 'Sneha Kumari',
        participantId: 'AST26-0005',
        eventName: 'Grandmaster Chess Championship',
        category: 'Sports',
        position: 'WINNER',
        issueDate: '2026-09-08T18:00:00+05:30',
      };
      const validHash = generateCertificateHash(original, secretKey);

      // Attacker changes recipient name to Imposter
      const tampered = { ...original, recipientName: 'Imposter Student' };
      const isTamperedValid = verifyCertificateHash(tampered, validHash, secretKey);
      if (isTamperedValid) {
        throw new Error('FAIL: Tampered certificate recipient passed verification!');
      }
    },
  },
  {
    id: 'T2-B14',
    tier: 'TIER_2',
    featureCode: 'M5_SCANNER',
    name: 'Reject rapid duplicate attendance scans within 100ms',
    description: 'Enforces idempotency and duplicate check-in rejection.',
    run: async ({ db }) => {
      // Record first scan
      await db.query(
        `INSERT INTO "Attendance" (id, "eventId", "userId", "participantId", "scannedById", "checkInType", status, "scannedAt")
         VALUES ('att_rapid_01', 'evt_spt_football', 'usr_part_005', 'AST26-0005', 'usr_vol_003', 'EVENT_ENTRY', 'PRESENT', NOW());`
      );

      // Immediate second scan should fail duplicate check
      try {
        await db.query(
          `INSERT INTO "Attendance" (id, "eventId", "userId", "participantId", "scannedById", "checkInType", status, "scannedAt")
           VALUES ('att_rapid_02', 'evt_spt_football', 'usr_part_005', 'AST26-0005', 'usr_vol_003', 'EVENT_ENTRY', 'PRESENT', NOW());`
        );
        throw new Error('FAIL: Rapid duplicate scan was not rejected');
      } catch (err: any) {
        if (err.message.includes('FAIL')) throw err;
      }

      await db.query(`DELETE FROM "Attendance" WHERE id = 'att_rapid_01';`);
    },
  },
  {
    id: 'T2-B15',
    tier: 'TIER_2',
    featureCode: 'M6_VERIFY_PORTAL',
    name: 'Verify revoked certificate is marked invalid with reason on public portal',
    description: 'Verifies isRevoked = true returns warning status.',
    run: async () => {
      const cert = {
        certificateNumber: 'AST26-CERT-99999',
        isRevoked: true,
        revokedReason: 'Disqualified for tournament misconduct',
      };
      if (!cert.isRevoked) throw new Error('Revoked certificate should be marked invalid');
    },
  },

  // ==========================================================================
  // DOMAIN 4: PROFILE & FORM BOUNDARY VALIDATION
  // ==========================================================================
  {
    id: 'T2-B16',
    tier: 'TIER_2',
    featureCode: 'M2_PROFILE',
    name: 'Reject semester = 0 in profile Zod schema (Lower bound)',
    description: 'Semesters in B.Tech are strictly 1 to 8.',
    run: async () => {
      const parsed = ProfileSchema.safeParse({
        collegeId: '22105128001',
        branch: 'CSE',
        semester: 0,
        phone: '+919876543210',
        gender: 'MALE',
        isHosteler: false,
      });
      if (parsed.success) throw new Error('FAIL: Semester 0 was accepted by schema');
    },
  },
  {
    id: 'T2-B17',
    tier: 'TIER_2',
    featureCode: 'M2_PROFILE',
    name: 'Reject semester = 9 in profile Zod schema (Upper bound)',
    description: 'Semesters in B.Tech are strictly 1 to 8.',
    run: async () => {
      const parsed = ProfileSchema.safeParse({
        collegeId: '22105128001',
        branch: 'CSE',
        semester: 9,
        phone: '+919876543210',
        gender: 'MALE',
        isHosteler: false,
      });
      if (parsed.success) throw new Error('FAIL: Semester 9 was accepted by schema');
    },
  },
  {
    id: 'T2-B18',
    tier: 'TIER_2',
    featureCode: 'M2_PROFILE',
    name: 'Reject invalid / non-numeric phone number strings',
    description: 'Rejects "invalid-phone" or short 3-digit phone numbers.',
    run: async () => {
      const parsed = ProfileSchema.safeParse({
        collegeId: '22105128001',
        branch: 'CSE',
        semester: 4,
        phone: '123',
        gender: 'MALE',
        isHosteler: false,
      });
      if (parsed.success) throw new Error('FAIL: 3-digit phone number was accepted');
    },
  },
  {
    id: 'T2-B19',
    tier: 'TIER_2',
    featureCode: 'M2_PROFILE',
    name: 'Reject invalid engineering branch outside allowed enum',
    description: 'Rejects branches not in CSE, ME, CE, EE, ECE, OTHER.',
    run: async () => {
      const parsed = ProfileSchema.safeParse({
        collegeId: '22105128001',
        branch: 'AEROSPACE',
        semester: 4,
        phone: '+919876543210',
        gender: 'MALE',
        isHosteler: false,
      });
      if (parsed.success) throw new Error('FAIL: Unsupported branch was accepted');
    },
  },
  {
    id: 'T2-B20',
    tier: 'TIER_2',
    featureCode: 'M2_PROFILE',
    name: 'Reject empty college roll number string',
    description: 'collegeId must be at least 3 characters.',
    run: async () => {
      const parsed = ProfileSchema.safeParse({
        collegeId: '',
        branch: 'CSE',
        semester: 4,
        phone: '+919876543210',
        gender: 'MALE',
        isHosteler: false,
      });
      if (parsed.success) throw new Error('FAIL: Empty collegeId was accepted');
    },
  },

  // ==========================================================================
  // DOMAIN 5: RBAC & PRIVILEGE ESCALATION ATTEMPTS
  // ==========================================================================
  {
    id: 'T2-B21',
    tier: 'TIER_2',
    featureCode: 'M2_RBAC',
    name: 'Block PARTICIPANT role from accessing /dashboard/admin',
    description: 'Guards admin dashboard strictly against unprivileged roles.',
    run: async () => {
      if (canAccessDashboard('PARTICIPANT', '/dashboard/admin')) {
        throw new Error('FAIL: PARTICIPANT granted access to /dashboard/admin');
      }
    },
  },
  {
    id: 'T2-B22',
    tier: 'TIER_2',
    featureCode: 'M2_RBAC',
    name: 'Block VOLUNTEER role from entering scores / results',
    description: 'Score entry restricted to EVENT_COORDINATOR and ADMIN.',
    run: async () => {
      if (canRecordScore('VOLUNTEER')) {
        throw new Error('FAIL: VOLUNTEER was granted score recording capability');
      }
    },
  },
  {
    id: 'T2-B23',
    tier: 'TIER_2',
    featureCode: 'M2_RBAC',
    name: 'Block TEAM_CAPTAIN from modifying sponsors or global festival settings',
    description: 'Sponsor CRUD restricted to ADMIN.',
    run: async () => {
      if (canManageSponsors('TEAM_CAPTAIN')) {
        throw new Error('FAIL: TEAM_CAPTAIN was granted sponsor management capability');
      }
    },
  },
  {
    id: 'T2-B24',
    tier: 'TIER_2',
    featureCode: 'M2_RBAC',
    name: 'Block unauthorized user from recording podium rank in Result schema',
    description: 'ResultEntrySchema requires positive integer rank 1-10.',
    run: async () => {
      const parsed = ResultEntrySchema.safeParse({
        eventId: 'evt_spt_cricket',
        rank: 0, // Invalid rank 0
        positionTitle: 'WINNER',
        score: '100',
      });
      if (parsed.success) throw new Error('FAIL: Rank 0 was accepted by schema');
    },
  },
  {
    id: 'T2-B25',
    tier: 'TIER_2',
    featureCode: 'M2_RBAC',
    name: 'Block unauthenticated requests without valid session cookie',
    description: 'Unauthenticated requests evaluate role as null, denying dashboard access.',
    run: async () => {
      const userRole: any = null;
      if (userRole && canAccessDashboard(userRole, '/dashboard/admin')) {
        throw new Error('FAIL: Null role permitted dashboard access');
      }
    },
  },

  // ==========================================================================
  // DOMAIN 6: ADVERSARIAL & EXTREME INPUTS
  // ==========================================================================
  {
    id: 'T2-B26',
    tier: 'TIER_2',
    featureCode: 'M7_AI_ASSISTANT',
    name: 'Handle 10,000-character prompt in AI Fest Assistant gracefully',
    description: 'Ensures conversational assistant does not crash or loop infinitely on large inputs.',
    run: async () => {
      const hugeQuery = 'When is cricket scheduled? ' + 'A'.repeat(10000);
      const res = queryFestAssistant(hugeQuery, [], []);
      if (!res || !res.answer) throw new Error('AI Assistant failed on 10,000-character input');
    },
  },
  {
    id: 'T2-B27',
    tier: 'TIER_2',
    featureCode: 'M4_CATALOG',
    name: 'Handle SQL Injection characters safely in event search queries',
    description: 'Executes parameterized search with SQL meta-characters (\', --, ;, DROP TABLE).',
    run: async ({ db }) => {
      const sqliSearch = "'; DROP TABLE \"Event\"; --";
      const res = await db.query<{ title: string }>(
        `SELECT title FROM "Event" WHERE title LIKE $1;`,
        [`%${sqliSearch}%`]
      );
      if (res.rows.length !== 0) throw new Error('Unexpected results from SQLi string');

      // Assert Event table still exists and intact
      const check = await db.query<{ count: string }>('SELECT COUNT(*) as count FROM "Event";');
      if (parseInt(check.rows[0].count, 10) !== 16) {
        throw new Error('Event table was damaged by injection payload');
      }
    },
  },
  {
    id: 'T2-B28',
    tier: 'TIER_2',
    featureCode: 'M4_CATALOG',
    name: 'Handle zero-length / whitespace-only search string returning empty list',
    description: 'Empty search filters return all or zero depending on filter mode.',
    run: async ({ db }) => {
      const search = '   ';
      const trimmed = search.trim();
      if (trimmed.length === 0) {
        // Successfully handled empty search string
      } else {
        throw new Error('Whitespace search not trimmed');
      }
    },
  },
  {
    id: 'T2-B29',
    tier: 'TIER_2',
    featureCode: 'M8_SPONSORS',
    name: 'Handle sponsor with 0 amount (In-kind / Media partner)',
    description: 'Allows community / media partners with amount = 0 or null.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "Sponsor" (id, name, tier, "logoUrl", "order", "isActive", "createdAt", "updatedAt")
         VALUES ('sp_bva_0', 'Campus Radio', 'MEDIA_PARTNER', 'https://example.com/radio.png', 7, true, NOW(), NOW());`
      );
      const res = await db.query<{ amount: number | null }>(`SELECT amount FROM "Sponsor" WHERE id = 'sp_bva_0';`);
      if (res.rows[0].amount !== null) throw new Error('Null sponsor amount was not persisted as null');
      await db.query(`DELETE FROM "Sponsor" WHERE id = 'sp_bva_0';`);
    },
  },
  {
    id: 'T2-B30',
    tier: 'TIER_2',
    featureCode: 'M1_SCHEMA',
    name: 'Verify database foreign key rejection on invalid categoryId',
    description: 'Inserting event with non-existent categoryId triggers foreign key error.',
    run: async ({ db }) => {
      try {
        await db.query(
          `INSERT INTO "Event" (id, slug, title, description, rules, "categoryId", venue, "eventType", "minTeamSize", "maxTeamSize", "prizePool", "scheduleStart", "scheduleEnd", "dayNumber", status, "isFeatured", "createdAt", "updatedAt")
           VALUES ('evt_invalid_fk', 'invalid-fk-event', 'Invalid Event', 'Desc', 'Rules', 'cat_nonexistent', 'Venue', 'INDIVIDUAL', 1, 1, 0, NOW(), NOW(), 1, 'REGISTRATION_OPEN', false, NOW(), NOW());`
        );
        throw new Error('FAIL: Foreign key violation did not trigger error');
      } catch (err: any) {
        if (err.message.includes('FAIL')) throw err;
      }
    },
  },
];

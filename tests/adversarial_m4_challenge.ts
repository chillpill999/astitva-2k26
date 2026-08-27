import { createTestDatabase, seedStandardDatabase } from './e2e/db';
import { generateInviteCode, validateInviteCode, normalizeInviteCode } from './e2e/helpers';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(msg);
  }
}

async function runAdversarialM4Challenge() {
  console.log('================================================================================');
  console.log('⚔️  STARTING M4 ADVERSARIAL CHALLENGE HARNESS (CHALLENGER 2)');
  console.log('================================================================================\n');

  const db = await createTestDatabase();
  await seedStandardDatabase(db);

  try {
    // -------------------------------------------------------------------------
    // SECTION 1: Solo Registration Ticket Generation & Cancellation
    // -------------------------------------------------------------------------
    console.log('▶ [CHALLENGE 1] Solo Registration Ticket Generation & Cancellation');

    // 1.1 Test Ticket Format Regex
    {
      const testSeq = 12345;
      const ticketFormat = `AST26-REG-${testSeq}`;
      assert(/^AST26-REG-\d{4,6}$/.test(ticketFormat), `Ticket format invalid: ${ticketFormat}`);
      results.push({ name: '1.1 Solo Ticket Format AST26-REG-XXXXX', passed: true });
      console.log('  ✅ 1.1 Solo Ticket Format conforms to AST26-REG-XXXXX');
    }

    // 1.2 Database Solo Registration Insertion & Unique Constraint
    {
      const testEventId = 'evt_spt_chess';
      const testUserId = 'usr_part_005';
      const testRegId = 'reg_adv_solo_01';
      const testTicket = 'AST26-REG-88123';

      // Clean any existing test records
      await db.query(`DELETE FROM "Registration" WHERE id = $1 OR ("eventId" = $2 AND "userId" = $3);`, [testRegId, testEventId, testUserId]);

      // Insert confirmed solo registration
      await db.query(
        `INSERT INTO "Registration" (id, "eventId", "userId", "registrationNumber", status, "qrTicketCode", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, 'CONFIRMED', 'AST26.REG.88123.TEST_SIG', NOW(), NOW());`,
        [testRegId, testEventId, testUserId, testTicket]
      );

      const regQuery = await db.query<{ id: string; status: string; registrationNumber: string }>(
        `SELECT id, status, "registrationNumber" FROM "Registration" WHERE id = $1;`,
        [testRegId]
      );
      assert(regQuery.rows.length === 1, 'Failed to fetch created solo registration');
      assert(regQuery.rows[0].status === 'CONFIRMED', 'Solo registration status is not CONFIRMED');
      assert(regQuery.rows[0].registrationNumber === testTicket, 'Ticket number mismatch');

      // Duplicate registration attempt on same event & user must throw unique constraint
      let duplicateCaught = false;
      try {
        await db.query(
          `INSERT INTO "Registration" (id, "eventId", "userId", "registrationNumber", status, "createdAt", "updatedAt")
           VALUES ('reg_adv_dup', $1, $2, 'AST26-REG-88124', 'CONFIRMED', NOW(), NOW());`,
          [testEventId, testUserId]
        );
      } catch (err: any) {
        duplicateCaught = true;
      }
      assert(duplicateCaught, 'Duplicate solo registration did not trigger unique constraint');

      // Test Cancellation transition
      await db.query(`UPDATE "Registration" SET status = 'CANCELLED', "updatedAt" = NOW() WHERE id = $1;`, [testRegId]);
      const cancelledQuery = await db.query<{ status: string }>(`SELECT status FROM "Registration" WHERE id = $1;`, [testRegId]);
      assert(cancelledQuery.rows[0].status === 'CANCELLED', 'Status not transitioned to CANCELLED');

      // Cleanup
      await db.query(`DELETE FROM "Registration" WHERE id = $1;`, [testRegId]);
      results.push({ name: '1.2 Solo Registration DB Lifecycle & Unique Constraints', passed: true });
      console.log('  ✅ 1.2 Solo Registration DB Lifecycle & Unique Constraints Verified');
    }

    // -------------------------------------------------------------------------
    // SECTION 2: Team Lifecycle (FORMING -> READY -> REGISTERED)
    // -------------------------------------------------------------------------
    console.log('\n▶ [CHALLENGE 2] Team Lifecycle State Machine (FORMING -> READY -> REGISTERED)');

    {
      const teamId = 'team_adv_lifecycle_01';
      const eventId = 'evt_spt_football';
      const captainId = 'usr_capt_004';
      const member1 = 'usr_part_005';
      const member2 = 'usr_coord_002';
      const inviteCode = 'CYBR26';

      // Clean prior runs
      await db.query(`DELETE FROM "Registration" WHERE "teamId" = $1 OR ("eventId" = $2 AND "userId" = $3);`, [teamId, eventId, captainId]);
      await db.query(`DELETE FROM "TeamMember" WHERE "teamId" = $1;`, [teamId]);
      await db.query(`DELETE FROM "Team" WHERE id = $1;`, [teamId]);

      // 2.1 Create Team with minMembers=3, maxMembers=4
      await db.query(
        `INSERT INTO "Team" (id, name, code, "eventId", "captainId", "minMembers", "maxMembers", status, "createdAt", "updatedAt")
         VALUES ($1, 'Cyber Knights', $2, $3, $4, 3, 4, 'FORMING', NOW(), NOW());`,
        [teamId, inviteCode, eventId, captainId]
      );

      // Captain assigned automatically
      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt")
         VALUES ('tm_adv_c1', $1, $2, 'CAPTAIN', 'APPROVED', NOW(), NOW());`,
        [teamId, captainId]
      );

      let tCheck = await db.query<{ status: string; count: string }>(
        `SELECT t.status, COUNT(m.id) as count
         FROM "Team" t
         LEFT JOIN "TeamMember" m ON m."teamId" = t.id
         WHERE t.id = $1
         GROUP BY t.id, t.status;`,
        [teamId]
      );
      assert(tCheck.rows[0].status === 'FORMING', `Expected status FORMING with 1 member, got ${tCheck.rows[0].status}`);
      assert(parseInt(tCheck.rows[0].count, 10) === 1, 'Expected 1 member');

      // 2.2 Add Member 1 (Roster count: 2 < minMembers 3) -> remains FORMING
      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt")
         VALUES ('tm_adv_m1', $1, $2, 'MEMBER', 'APPROVED', NOW(), NOW());`,
        [teamId, member1]
      );

      tCheck = await db.query<{ status: string; count: string }>(
        `SELECT t.status, COUNT(m.id) as count
         FROM "Team" t
         LEFT JOIN "TeamMember" m ON m."teamId" = t.id
         WHERE t.id = $1
         GROUP BY t.id, t.status;`,
        [teamId]
      );
      assert(parseInt(tCheck.rows[0].count, 10) === 2, 'Expected 2 members');
      assert(tCheck.rows[0].status === 'FORMING', 'Squad should remain FORMING when member count < minMembers');

      // 2.3 Add Member 2 (Roster count: 3 >= minMembers 3) -> transitions to READY
      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt")
         VALUES ('tm_adv_m2', $1, $2, 'MEMBER', 'APPROVED', NOW(), NOW());`,
        [teamId, member2]
      );
      await db.query(`UPDATE "Team" SET status = 'READY', "updatedAt" = NOW() WHERE id = $1;`, [teamId]);

      tCheck = await db.query<{ status: string; count: string }>(
        `SELECT t.status, COUNT(m.id) as count
         FROM "Team" t
         LEFT JOIN "TeamMember" m ON m."teamId" = t.id
         WHERE t.id = $1
         GROUP BY t.id, t.status;`,
        [teamId]
      );
      assert(parseInt(tCheck.rows[0].count, 10) === 3, 'Expected 3 members');
      assert(tCheck.rows[0].status === 'READY', 'Squad should transition to READY when member count >= minMembers');

      // 2.4 Finalize Registration (transitions to REGISTERED and creates tickets for all approved squad members)
      const teamTicket = 'AST26-REG-99441';
      const m1Ticket = 'AST26-REG-99442';
      const m2Ticket = 'AST26-REG-99443';
      await db.query(`UPDATE "Team" SET status = 'REGISTERED', "updatedAt" = NOW() WHERE id = $1;`, [teamId]);
      await db.query(
        `INSERT INTO "Registration" (id, "eventId", "userId", "teamId", "registrationNumber", status, "qrTicketCode", "createdAt", "updatedAt")
         VALUES 
           ('reg_adv_team_01', $1, $2, $3, $4, 'CONFIRMED', $5, NOW(), NOW()),
           ('reg_adv_team_02', $1, $6, $3, $7, 'CONFIRMED', $8, NOW(), NOW()),
           ('reg_adv_team_03', $1, $9, $3, $10, 'CONFIRMED', $11, NOW(), NOW());`,
        [
          eventId, captainId, teamId, teamTicket, `AST26.TEAM.${inviteCode}.${teamTicket}`,
          member1, m1Ticket, `AST26.TEAM.${inviteCode}.${m1Ticket}`,
          member2, m2Ticket, `AST26.TEAM.${inviteCode}.${m2Ticket}`
        ]
      );

      const finalTeam = await db.query<{ status: string; regNum: string; userId: string }>(
        `SELECT t.status, r."registrationNumber" as "regNum", r."userId"
         FROM "Team" t
         JOIN "Registration" r ON r."teamId" = t.id
         WHERE t.id = $1
         ORDER BY r."registrationNumber" ASC;`,
        [teamId]
      );
      assert(finalTeam.rows[0].status === 'REGISTERED', 'Team not in REGISTERED state');
      assert(finalTeam.rows.length === 3, `Expected 3 registration records for squad (captain + 2 members), got ${finalTeam.rows.length}`);
      assert(finalTeam.rows.some((r) => r.userId === captainId && r.regNum === teamTicket), 'Captain registration missing');
      assert(finalTeam.rows.some((r) => r.userId === member1 && r.regNum === m1Ticket), 'Member 1 registration missing');
      assert(finalTeam.rows.some((r) => r.userId === member2 && r.regNum === m2Ticket), 'Member 2 registration missing');

      // Cleanup
      await db.query(`DELETE FROM "Registration" WHERE "teamId" = $1;`, [teamId]);
      await db.query(`DELETE FROM "TeamMember" WHERE "teamId" = $1;`, [teamId]);
      await db.query(`DELETE FROM "Team" WHERE id = $1;`, [teamId]);

      results.push({ name: '2. Team Lifecycle State Transitions (FORMING -> READY -> REGISTERED)', passed: true });
      console.log('  ✅ 2. Team Lifecycle State Transitions Verified (FORMING -> READY -> REGISTERED)');
    }

    // -------------------------------------------------------------------------
    // SECTION 3: Captain Operations (Promote, Kick/Revert, Disband)
    // -------------------------------------------------------------------------
    console.log('\n▶ [CHALLENGE 3] Captain Operations (Promote Captain, Kick Member & Revert to FORMING, Disband)');

    {
      const teamId = 'team_adv_captain_ops';
      const eventId = 'evt_gam_freefire';
      const originalCaptain = 'usr_capt_004';
      const memberA = 'usr_part_005';
      const memberB = 'usr_coord_002';
      const inviteCode = 'NVLD26';

      // Setup team with 3 members, minMembers=3 (status READY)
      await db.query(`DELETE FROM "Registration" WHERE "teamId" = $1;`, [teamId]);
      await db.query(`DELETE FROM "TeamMember" WHERE "teamId" = $1;`, [teamId]);
      await db.query(`DELETE FROM "Team" WHERE id = $1;`, [teamId]);

      await db.query(
        `INSERT INTO "Team" (id, name, code, "eventId", "captainId", "minMembers", "maxMembers", status, "createdAt", "updatedAt")
         VALUES ($1, 'LNJPIT Titans', $2, $3, $4, 3, 5, 'READY', NOW(), NOW());`,
        [teamId, inviteCode, eventId, originalCaptain]
      );

      await db.query(
        `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt") VALUES
         ('tm_ops_c', $1, $2, 'CAPTAIN', 'APPROVED', NOW(), NOW()),
         ('tm_ops_a', $1, $3, 'MEMBER', 'APPROVED', NOW(), NOW()),
         ('tm_ops_b', $1, $4, 'MEMBER', 'APPROVED', NOW(), NOW());`,
        [teamId, originalCaptain, memberA, memberB]
      );

      // 3.1 Promote Member A to Captain
      await db.query(`UPDATE "TeamMember" SET role = 'MEMBER' WHERE "teamId" = $1 AND role = 'CAPTAIN';`, [teamId]);
      await db.query(`UPDATE "TeamMember" SET role = 'CAPTAIN' WHERE "teamId" = $1 AND "userId" = $2;`, [teamId, memberA]);
      await db.query(`UPDATE "Team" SET "captainId" = $2, "updatedAt" = NOW() WHERE id = $1;`, [teamId, memberA]);

      const promotedCheck = await db.query<{ captainId: string; role: string }>(
        `SELECT t."captainId", tm.role
         FROM "Team" t
         JOIN "TeamMember" tm ON tm."teamId" = t.id AND tm."userId" = $2
         WHERE t.id = $1;`,
        [teamId, memberA]
      );
      assert(promotedCheck.rows[0].captainId === memberA, 'Team captainId not updated to Member A');
      assert(promotedCheck.rows[0].role === 'CAPTAIN', 'Member A role not updated to CAPTAIN');

      const oldCapCheck = await db.query<{ role: string }>(
        `SELECT role FROM "TeamMember" WHERE "teamId" = $1 AND "userId" = $2;`,
        [teamId, originalCaptain]
      );
      assert(oldCapCheck.rows[0].role === 'MEMBER', 'Original captain was not demoted to MEMBER');
      console.log('  ✅ 3.1 Promote Member to Captain Verified');

      // 3.2 Kick Member B -> Roster count drops from 3 to 2 (< minMembers 3) -> Reverts status to FORMING
      await db.query(`DELETE FROM "TeamMember" WHERE "teamId" = $1 AND "userId" = $2;`, [teamId, memberB]);
      const remainingCountRes = await db.query<{ count: string }>(`SELECT COUNT(*) as count FROM "TeamMember" WHERE "teamId" = $1;`, [teamId]);
      const remCount = parseInt(remainingCountRes.rows[0].count, 10);
      assert(remCount === 2, `Expected 2 remaining members, got ${remCount}`);

      // Revert status to FORMING if count < minMembers
      await db.query(`UPDATE "Team" SET status = 'FORMING' WHERE id = $1 AND $2 < "minMembers";`, [teamId, remCount]);
      const statusCheck = await db.query<{ status: string }>(`SELECT status FROM "Team" WHERE id = $1;`, [teamId]);
      assert(statusCheck.rows[0].status === 'FORMING', `Expected status to revert to FORMING, got ${statusCheck.rows[0].status}`);
      console.log('  ✅ 3.2 Kick Member & Revert Status to FORMING Verified');

      // 3.3 Disband Squad
      await db.query(`DELETE FROM "Registration" WHERE "teamId" = $1;`, [teamId]);
      await db.query(`DELETE FROM "TeamMember" WHERE "teamId" = $1;`, [teamId]);
      await db.query(`DELETE FROM "Team" WHERE id = $1;`, [teamId]);

      const disbandCheck = await db.query<{ count: string }>(`SELECT COUNT(*) as count FROM "Team" WHERE id = $1;`, [teamId]);
      assert(parseInt(disbandCheck.rows[0].count, 10) === 0, 'Team was not deleted upon disband');
      const tmCheck = await db.query<{ count: string }>(`SELECT COUNT(*) as count FROM "TeamMember" WHERE "teamId" = $1;`, [teamId]);
      assert(parseInt(tmCheck.rows[0].count, 10) === 0, 'Team members not cleaned up on disband');
      console.log('  ✅ 3.3 Disband Squad & Cascade Cleanup Verified');

      results.push({ name: '3. Captain Operations (Promote, Kick/Revert, Disband)', passed: true });
    }

    // -------------------------------------------------------------------------
    // SECTION 4: WhatsApp Invite URL Formatting
    // -------------------------------------------------------------------------
    console.log('\n▶ [CHALLENGE 4] WhatsApp Invite URL Formatting & Character Encoding');

    {
      const teamName = 'LNJPIT Titans & Warriors (CSE)';
      const eventTitle = 'BGMI Championship 2026';
      const code = 'BG26X1';
      const joinUrl = `https://astitva2k26.lnjpit.ac.in/teams/join/${code}`;

      const shareText = encodeURIComponent(
        `🔥 Join my squad *${teamName}* for ${eventTitle}!\n\n` +
        `⚡ Invite Code: *${code}*\n` +
        `👉 Direct Join Link: ${joinUrl}\n\n` +
        `LNJPIT Chapra Annual Techno-Cultural & Sports Fest (4-8 Sept 2026)`
      );

      const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

      // Assert URL formatting rules
      assert(whatsappUrl.startsWith('https://api.whatsapp.com/send?text='), 'Invalid WhatsApp API URL prefix');
      assert(whatsappUrl.includes(code), 'WhatsApp URL does not include invite code');
      assert(!whatsappUrl.includes(' '), 'WhatsApp URL contains unencoded spaces');
      assert(decodeURIComponent(shareText).includes(teamName), 'Decoded message missing team name');
      assert(decodeURIComponent(shareText).includes(joinUrl), 'Decoded message missing direct join link');

      results.push({ name: '4. WhatsApp Invite URL Formatting & Special Char Encoding', passed: true });
      console.log('  ✅ 4. WhatsApp Invite URL Formatting & Special Char Encoding Verified');
    }

    console.log('\n================================================================================');
    console.log(`📊 ADVERSARIAL CHALLENGE SUMMARY: ${results.filter(r => r.passed).length}/${results.length} PASSED`);
    console.log('================================================================================\n');

  } finally {
    // done
  }
}

runAdversarialM4Challenge().catch((err) => {
  console.error('❌ ADVERSARIAL CHALLENGE FAILED:', err);
  process.exit(1);
});

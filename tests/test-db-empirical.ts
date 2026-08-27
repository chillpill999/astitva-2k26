import { execSync } from "child_process";
import { PGlite } from "@electric-sql/pglite";
import * as bcrypt from "bcryptjs";

async function runEmpiricalPostgreSQLTests() {
  console.log("================================================================");
  console.log("🚀 ASTITVA 2K26 - EMPIRICAL DATABASE & SCHEMA TEST SUITE");
  console.log("================================================================");

  // 1. Generate Schema DDL
  console.log("\n[TEST 1] Generating full SQL DDL from prisma/schema.prisma...");
  const sqlDdl = execSync(
    "npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script",
    { encoding: "utf8" }
  );
  console.log(`✅ Schema DDL generated successfully (${sqlDdl.length} characters)`);

  // 2. Initialize in-memory PostgreSQL engine via PGlite
  console.log("\n[TEST 2] Initializing WASM PostgreSQL 16 engine (PGlite)...");
  const db = new PGlite();
  await db.exec(sqlDdl);
  console.log("✅ PostgreSQL schema executed and tables/indexes created cleanly in PostgreSQL engine");

  // 3. Verify Table Creation
  console.log("\n[TEST 3] Verifying created tables in information_schema...");
  const tablesRes = await db.query<{ table_name: string }>(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
  );
  const tableNames = tablesRes.rows.map((r) => r.table_name);
  console.log(`Found ${tableNames.length} tables in PostgreSQL database:`);
  console.log(tableNames.join(", "));

  const expectedTables = [
    "User",
    "Profile",
    "Category",
    "Event",
    "Registration",
    "Team",
    "TeamMember",
    "Attendance",
    "Result",
    "Certificate",
    "Announcement",
    "Notification",
    "Sponsor",
    "Faq",
    "GalleryItem",
    "CommitteeMember",
    "AuditLog",
    "AiChatMessage",
  ];

  for (const table of expectedTables) {
    if (!tableNames.includes(table)) {
      throw new Error(`Expected table '${table}' not found in database!`);
    }
  }
  console.log("✅ All 18 expected models/tables are present in PostgreSQL schema!");

  // 4. Verify Enums in PostgreSQL
  console.log("\n[TEST 4] Verifying PostgreSQL custom ENUM types...");
  const enumsRes = await db.query<{ typname: string }>(
    "SELECT typname FROM pg_type WHERE typtype = 'e' ORDER BY typname;"
  );
  const enumNames = enumsRes.rows.map((r) => r.typname);
  console.log(`Found ${enumNames.length} ENUM types:`);
  console.log(enumNames.join(", "));

  const expectedEnums = [
    "Role",
    "Branch",
    "Gender",
    "CategoryType",
    "EventType",
    "EventStatus",
    "RegistrationStatus",
    "TeamStatus",
    "TeamMemberRole",
    "MemberStatus",
    "CheckInType",
    "AttendanceStatus",
    "ResultPosition",
    "CertificateType",
    "AnnouncementCategory",
    "AnnouncementPriority",
    "NotificationType",
    "SponsorTier",
    "MediaType",
    "CommitteeCategory",
    "ChatRole",
  ];

  for (const e of expectedEnums) {
    if (!enumNames.includes(e)) {
      throw new Error(`Expected enum '${e}' not found in database!`);
    }
  }
  console.log("✅ All 21 expected PostgreSQL ENUMs are defined!");

  // 5. Test Seeding
  console.log("\n[TEST 5] Seeding data matching prisma/seed.ts into PostgreSQL...");

  const passwordHash = await bcrypt.hash("Password@123", 10);

  // Insert Users
  await db.query(
    `INSERT INTO "User" (id, email, name, role, "passwordHash", "isActive", "createdAt", "updatedAt") VALUES
    ('usr_admin_001', 'admin@lnjpit.ac.in', 'Dr. Shailendra Kumar', 'ADMIN', $1, true, NOW(), NOW()),
    ('usr_coord_002', 'coordinator@lnjpit.ac.in', 'Prof. Rajesh Ranjan', 'EVENT_COORDINATOR', $1, true, NOW(), NOW()),
    ('usr_vol_003', 'volunteer@lnjpit.ac.in', 'Ananya Sharma', 'VOLUNTEER', $1, true, NOW(), NOW()),
    ('usr_capt_004', 'captain@lnjpit.ac.in', 'Aman Verma', 'TEAM_CAPTAIN', $1, true, NOW(), NOW()),
    ('usr_part_005', 'participant@lnjpit.ac.in', 'Sneha Kumari', 'PARTICIPANT', $1, true, NOW(), NOW());`,
    [passwordHash]
  );

  // Insert Profiles
  await db.query(
    `INSERT INTO "Profile" (id, "userId", "participantId", "collegeId", "collegeName", branch, semester, phone, gender, "isHosteler", bio, "qrPassToken", "createdAt", "updatedAt") VALUES
    ('prof_001', 'usr_admin_001', 'AST26-0001', 'LNJPIT-ADMIN-01', 'LNJPIT Chapra', 'CSE', 8, '+91 98765 43210', 'MALE', false, 'Principal & Chief Patron', 'AST26.ADMIN.0001.MOCK_SIG', NOW(), NOW()),
    ('prof_002', 'usr_coord_002', 'AST26-0002', 'LNJPIT-FAC-042', 'LNJPIT Chapra', 'ECE', 8, '+91 98765 43211', 'MALE', false, 'Head Event Coordinator', 'AST26.COORD.0002.MOCK_SIG', NOW(), NOW()),
    ('prof_003', 'usr_vol_003', 'AST26-0003', '23105128014', 'LNJPIT Chapra', 'EE', 4, '+91 98765 43212', 'FEMALE', true, 'Lead Volunteer', 'AST26.VOL.0003.MOCK_SIG', NOW(), NOW()),
    ('prof_004', 'usr_capt_004', 'AST26-0004', '22105128005', 'LNJPIT Chapra', 'ME', 6, '+91 98765 43213', 'MALE', true, 'Captain of LNJPIT Titans', 'AST26.CAPT.0004.MOCK_SIG', NOW(), NOW()),
    ('prof_005', 'usr_part_005', 'AST26-0005', '24105128032', 'LNJPIT Chapra', 'CE', 2, '+91 98765 43214', 'FEMALE', false, 'Participant in Debate & Chess', 'AST26.PART.0005.MOCK_SIG', NOW(), NOW());`
  );

  // Insert Categories
  await db.query(
    `INSERT INTO "Category" (id, slug, name, type, description, icon, "order", "isActive", "createdAt", "updatedAt") VALUES
    ('cat_sports', 'sports', 'Sports', 'SPORTS', 'High-voltage athletic championships', 'Trophy', 1, true, NOW(), NOW()),
    ('cat_cultural', 'cultural', 'Cultural', 'CULTURAL', 'Artistic brilliance across music, dance, comedy', 'Music', 2, true, NOW(), NOW()),
    ('cat_gaming', 'gaming', 'Gaming', 'GAMING', 'Esports tournaments and tactical combat', 'Gamepad2', 3, true, NOW(), NOW()),
    ('cat_literary', 'literary', 'Literary', 'LITERARY', 'Debates, quizzes, poetry and writing', 'BookOpen', 4, true, NOW(), NOW());`
  );

  // Insert 16 Events
  const events = [
    // Sports (5)
    ['evt_spt_cricket', 'cricket-tournament', 'ASTITVA Cricket Championship (T10 Knockout)', 'cat_sports', 'TEAM', 11, 15, 25000, 1, true],
    ['evt_spt_football', 'football-championship', 'Inter-Branch Football Cup (7v7 Turf War)', 'cat_sports', 'TEAM', 7, 10, 20000, 1, true],
    ['evt_spt_volleyball', 'volleyball-smash', 'Spike Masters Volleyball Trophy', 'cat_sports', 'TEAM', 6, 8, 12000, 2, false],
    ['evt_spt_badminton', 'badminton-clash', 'Shuttle Smash Badminton Championship', 'cat_sports', 'INDIVIDUAL', 1, 2, 10000, 2, false],
    ['evt_spt_chess', 'grandmaster-chess', 'Grandmaster Chess Championship', 'cat_sports', 'INDIVIDUAL', 1, 1, 8000, 1, false],
    // Cultural (4)
    ['evt_clt_dance', 'nrityangana-dance', 'Nrityangana (Solo & Group Dance Battle)', 'cat_cultural', 'TEAM', 1, 10, 22000, 2, true],
    ['evt_clt_singing', 'sur-sangam-singing', 'Sur Sangam (Voice of Astitva)', 'cat_cultural', 'INDIVIDUAL', 1, 2, 15000, 3, false],
    ['evt_clt_comedy', 'hasya-kosh-comedy', 'Hasya Kosh (Stand-Up & Comic Act)', 'cat_cultural', 'INDIVIDUAL', 1, 1, 10000, 3, false],
    ['evt_clt_rampwalk', 'glamour-grace-rampwalk', 'Glamour & Grace (Ethnic & Cyberpunk Runway)', 'cat_cultural', 'TEAM', 6, 12, 25000, 4, true],
    // Gaming (3)
    ['evt_gam_bgmi', 'bgmi-mobile-battlefield', 'BGMI Mobile Esports Championship', 'cat_gaming', 'TEAM', 4, 5, 20000, 1, true],
    ['evt_gam_freefire', 'free-fire-clash-squad', 'Free Fire Clash Squad Tournament', 'cat_gaming', 'TEAM', 4, 4, 15000, 3, false],
    ['evt_gam_valorant', 'valorant-lan-warfare', 'Valorant Tactical LAN Warfare', 'cat_gaming', 'TEAM', 5, 6, 18000, 2, true],
    // Literary (4)
    ['evt_lit_debate', 'tark-vitark-debate', 'Tark-Vitark (Parliamentary Debate)', 'cat_literary', 'TEAM', 2, 2, 10000, 1, false],
    ['evt_lit_quiz', 'prashnavali-tech-fest-quiz', 'Prashnavali (Mega Tech & Fest Trivia Quiz)', 'cat_literary', 'TEAM', 2, 3, 12000, 2, false],
    ['evt_lit_poetry', 'kavyanjali-poetry-slam', 'Kavyanjali (Hindi & Urdu Poetry Slam)', 'cat_literary', 'INDIVIDUAL', 1, 1, 8000, 3, false],
    ['evt_lit_writing', 'kalamkar-creative-writing', 'Kalamkar (On-the-Spot Creative Writing)', 'cat_literary', 'INDIVIDUAL', 1, 1, 6000, 4, false],
  ];

  for (const e of events) {
    await db.query(
      `INSERT INTO "Event" (id, slug, title, description, rules, "categoryId", venue, "eventType", "minTeamSize", "maxTeamSize", "prizePool", "scheduleStart", "scheduleEnd", "dayNumber", status, "isFeatured", "coordinatorId", "createdAt", "updatedAt") VALUES
      ($1, $2, $3, 'Official tournament description', 'LNJPIT tournament rules', $4, 'LNJPIT Chapra Campus', $5::"EventType", $6, $7, $8, '2026-09-04 09:00:00+05:30', '2026-09-08 18:00:00+05:30', $9, 'REGISTRATION_OPEN', $10, 'usr_coord_002', NOW(), NOW());`,
      e
    );
  }

  // Insert Teams & Team Members
  await db.query(
    `INSERT INTO "Team" (id, name, code, "eventId", "captainId", "minMembers", "maxMembers", status, "createdAt", "updatedAt") VALUES
    ('team_cricket_01', 'LNJPIT Titans ME', 'TITN26', 'evt_spt_cricket', 'usr_capt_004', 11, 15, 'READY', NOW(), NOW()),
    ('team_bgmi_01', 'Alpha Esports Warriors', 'BG26X1', 'evt_gam_bgmi', 'usr_capt_004', 4, 5, 'READY', NOW(), NOW());`
  );

  await db.query(
    `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt") VALUES
    ('tm_01', 'team_cricket_01', 'usr_capt_004', 'CAPTAIN', 'APPROVED', NOW(), NOW()),
    ('tm_02', 'team_cricket_01', 'usr_part_005', 'MEMBER', 'APPROVED', NOW(), NOW()),
    ('tm_03', 'team_bgmi_01', 'usr_capt_004', 'CAPTAIN', 'APPROVED', NOW(), NOW());`
  );

  // Insert Registrations
  await db.query(
    `INSERT INTO "Registration" (id, "eventId", "userId", "teamId", "registrationNumber", status, "qrTicketCode", "createdAt", "updatedAt") VALUES
    ('reg_001', 'evt_spt_cricket', 'usr_capt_004', 'team_cricket_01', 'AST26-REG-1001', 'CONFIRMED', 'AST26.REG.1001.MOCK_SIG', NOW(), NOW()),
    ('reg_002', 'evt_lit_debate', 'usr_part_005', NULL, 'AST26-REG-1002', 'CONFIRMED', 'AST26.REG.1002.MOCK_SIG', NOW(), NOW());`
  );

  // Insert Result & Certificate
  await db.query(
    `INSERT INTO "Result" (id, "eventId", rank, "positionTitle", "userId", score, "prizeAwarded", "certificateIssued", "publishedAt", "createdAt", "updatedAt") VALUES
    ('res_001', 'evt_spt_chess', 1, 'WINNER', 'usr_part_005', '4.5 / 5.0 (Buchholz 18.5)', '₹5,000 + Grandmaster Trophy + Gold Medal', true, NOW(), NOW(), NOW());`
  );

  await db.query(
    `INSERT INTO "Certificate" (id, "certificateNumber", "userId", "eventId", "recipientName", "participantId", type, title, "eventName", category, "issueDate", "signatureHash", "verificationUrl", "isRevoked", "createdAt", "updatedAt") VALUES
    ('cert_001', 'AST26-CERT-10492', 'usr_part_005', 'evt_spt_chess', 'Sneha Kumari', 'AST26-0005', 'WINNER', 'Certificate of Excellence (First Place)', 'Grandmaster Chess Championship', 'Sports', '2026-09-08 18:00:00+05:30', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'https://astitva2k26.lnjpit.ac.in/verify-certificate/AST26-CERT-10492', false, NOW(), NOW());`
  );

  // Insert Announcements, FAQs, Sponsors, Committee
  await db.query(
    `INSERT INTO "Announcement" (id, title, content, category, priority, "authorId", "authorName", "isPinned", "isActive", "publishedAt", "createdAt", "updatedAt") VALUES
    ('ann_001', 'Portal Live', 'Registrations are open!', 'GENERAL', 'HIGH', 'usr_admin_001', 'Dr. Shailendra Kumar', true, true, NOW(), NOW(), NOW()),
    ('ann_002', 'Cricket Jersey Inspection', 'Kit inspection notice', 'EVENT_UPDATE', 'NORMAL', 'usr_coord_002', 'Prof. Rajesh Ranjan', false, true, NOW(), NOW(), NOW()),
    ('ann_003', 'LAN Gaming Ready', '1 Gbps LAN hub configured', 'EVENT_UPDATE', 'NORMAL', 'usr_admin_001', 'Technical Sub-Committee', false, true, NOW(), NOW(), NOW());`
  );

  await db.query(
    `INSERT INTO "Faq" (id, question, answer, category, "order", "isPublished", "createdAt", "updatedAt") VALUES
    ('faq_1', 'Who is eligible?', 'All LNJPIT students.', 'Eligibility', 1, true, NOW(), NOW()),
    ('faq_2', 'Registration fee?', '100% Free.', 'Registrations', 2, true, NOW(), NOW()),
    ('faq_3', 'How to join a team?', 'Use 6-character code.', 'Teams', 3, true, NOW(), NOW()),
    ('faq_4', 'How does QR pass work?', 'Instant digital pass.', 'Attendance', 4, true, NOW(), NOW()),
    ('faq_5', 'How are certificates verified?', 'HMAC-SHA256 signature.', 'Certificates', 5, true, NOW(), NOW());`
  );

  await db.query(
    `INSERT INTO "Sponsor" (id, name, tier, "logoUrl", "websiteUrl", description, "order", "isActive", "createdAt", "updatedAt") VALUES
    ('sp_1', 'BELTRON', 'TITLE', 'https://example.com/beltron.png', 'https://beltron.bihar.gov.in', 'Title Sponsor', 1, true, NOW(), NOW()),
    ('sp_2', 'DSTTE Bihar', 'POWERED_BY', 'https://example.com/dstte.png', 'https://dst.bihar.gov.in', 'Patron Partner', 2, true, NOW(), NOW()),
    ('sp_3', 'SBI Campus Branch', 'GOLD', 'https://example.com/sbi.png', 'https://sbi.co.in', 'Banking Partner', 3, true, NOW(), NOW()),
    ('sp_4', 'Red Bull India', 'SILVER', 'https://example.com/redbull.png', 'https://redbull.com', 'Energy Partner', 4, true, NOW(), NOW());`
  );

  await db.query(
    `INSERT INTO "CommitteeMember" (id, name, role, category, department, "photoUrl", email, "order", "isActive", "createdAt", "updatedAt") VALUES
    ('cm_1', 'Dr. Shailendra Kumar', 'Principal & Chief Patron', 'FACULTY', 'Administration', 'https://example.com/photo.png', 'principal@lnjpit.ac.in', 1, true, NOW(), NOW()),
    ('cm_2', 'Prof. Rajesh Ranjan', 'Faculty Convener & Sports Head', 'FACULTY', 'ECE', 'https://example.com/photo.png', 'coordinator@lnjpit.ac.in', 2, true, NOW(), NOW()),
    ('cm_3', 'Aman Verma', 'Student General Secretary', 'CORE_STUDENT', 'ME', 'https://example.com/photo.png', 'captain@lnjpit.ac.in', 3, true, NOW(), NOW()),
    ('cm_4', 'Ananya Sharma', 'Student Technical Lead', 'TECHNICAL', 'EE', 'https://example.com/photo.png', 'volunteer@lnjpit.ac.in', 4, true, NOW(), NOW());`
  );

  console.log("✅ Seed data inserted cleanly into PostgreSQL engine");

  // --------------------------------------------------------------------------
  // 6. EMPIRICAL QUERY ASSERTIONS & RELATIONS
  // --------------------------------------------------------------------------
  console.log("\n[TEST 6] Executing complex relational queries and joins in PostgreSQL...");

  // 1. Categories & Event counts
  const catQuery = await db.query<{ name: string; type: string; event_count: string }>(
    `SELECT c.name, c.type, COUNT(e.id) as event_count
     FROM "Category" c
     LEFT JOIN "Event" e ON e."categoryId" = c.id
     GROUP BY c.id, c.name, c.type, c."order"
     ORDER BY c."order";`
  );
  console.log("Category breakdown:");
  for (const row of catQuery.rows) {
    console.log(`- ${row.name} (${row.type}): ${row.event_count} events`);
  }
  if (catQuery.rows.length !== 4) throw new Error("Expected 4 categories");

  // 2. Events Count Verification
  const eventCountRes = await db.query<{ count: string }>('SELECT COUNT(*) as count FROM "Event";');
  const totalEvents = parseInt(eventCountRes.rows[0].count, 10);
  console.log(`Total Events in Database: ${totalEvents} (Expected: 16)`);
  if (totalEvents !== 16) throw new Error(`Event count mismatch: ${totalEvents}`);

  // 3. Users with Profiles Join
  const usersRes = await db.query<{ name: string; role: string; email: string; participantId: string; branch: string }>(
    `SELECT u.name, u.role, u.email, p."participantId", p.branch
     FROM "User" u
     JOIN "Profile" p ON p."userId" = u.id
     ORDER BY u.id;`
  );
  console.log(`Found ${usersRes.rows.length} Users with full Profile relations:`);
  for (const u of usersRes.rows) {
    console.log(`- ${u.name} (${u.role}) | ID: ${u.participantId} | Branch: ${u.branch} | Email: ${u.email}`);
  }
  if (usersRes.rows.length !== 5) throw new Error("Expected 5 demo users with profiles");

  // 4. Team with Captain and Members Join
  const teamRes = await db.query<{ team_name: string; code: string; captain_name: string; member_count: string }>(
    `SELECT t.name as team_name, t.code, u.name as captain_name, COUNT(tm.id) as member_count
     FROM "Team" t
     JOIN "User" u ON u.id = t."captainId"
     JOIN "TeamMember" tm ON tm."teamId" = t.id
     GROUP BY t.id, t.name, t.code, u.name;`
  );
  console.log("Team Roster Verification:");
  for (const t of teamRes.rows) {
    console.log(`- Team: ${t.team_name} | Code: ${t.code} | Captain: ${t.captain_name} | Members: ${t.member_count}`);
  }
  if (teamRes.rows.length !== 2) throw new Error("Expected 2 seeded teams");

  // 5. Results and Certificate Verifications
  const certRes = await db.query<{ certificateNumber: string; recipientName: string; eventName: string; signatureHash: string }>(
    `SELECT "certificateNumber", "recipientName", "eventName", "signatureHash"
     FROM "Certificate"
     WHERE "certificateNumber" = 'AST26-CERT-10492';`
  );
  console.log(`Certificate verified: ${certRes.rows[0].certificateNumber} issued to ${certRes.rows[0].recipientName}`);
  if (certRes.rows.length !== 1) throw new Error("Certificate not found");

  // --------------------------------------------------------------------------
  // 7. EMPIRICAL CONSTRAINT STRESS-TESTS
  // --------------------------------------------------------------------------
  console.log("\n[TEST 7] Stress-testing PostgreSQL database constraints & invariants...");

  // Stress 1: Composite Unique Constraint on Registration [eventId, userId]
  console.log("- Stress 1: Duplicate Registration unique constraint [eventId, userId]...");
  try {
    await db.query(
      `INSERT INTO "Registration" (id, "eventId", "userId", "registrationNumber", status, "createdAt", "updatedAt")
       VALUES ('reg_dup', 'evt_spt_cricket', 'usr_capt_004', 'AST26-REG-9999', 'CONFIRMED', NOW(), NOW());`
    );
    throw new Error("FAIL: Duplicate registration did NOT trigger unique constraint error!");
  } catch (err: any) {
    if (err.message.includes("FAIL")) throw err;
    console.log(`  ✅ Successfully caught unique constraint violation: ${err.message}`);
  }

  // Stress 2: Composite Unique Constraint on TeamMember [teamId, userId]
  console.log("- Stress 2: Duplicate TeamMember unique constraint [teamId, userId]...");
  try {
    await db.query(
      `INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "joinedAt", "updatedAt")
       VALUES ('tm_dup', 'team_cricket_01', 'usr_capt_004', 'MEMBER', 'APPROVED', NOW(), NOW());`
    );
    throw new Error("FAIL: Duplicate team member did NOT trigger unique constraint error!");
  } catch (err: any) {
    if (err.message.includes("FAIL")) throw err;
    console.log(`  ✅ Successfully caught unique constraint violation: ${err.message}`);
  }

  // Stress 3: Unique Constraint on User email
  console.log("- Stress 3: Duplicate User email unique constraint...");
  try {
    await db.query(
      `INSERT INTO "User" (id, email, name, role, "passwordHash", "isActive", "createdAt", "updatedAt")
       VALUES ('usr_dup', 'admin@lnjpit.ac.in', 'Imposter Admin', 'ADMIN', 'hash', true, NOW(), NOW());`
    );
    throw new Error("FAIL: Duplicate email did NOT trigger unique constraint error!");
  } catch (err: any) {
    if (err.message.includes("FAIL")) throw err;
    console.log(`  ✅ Successfully caught unique constraint violation: ${err.message}`);
  }

  // Stress 4: Unique Constraint on Profile participantId
  console.log("- Stress 4: Duplicate Participant ID unique constraint...");
  try {
    await db.query(
      `INSERT INTO "Profile" (id, "userId", "participantId", "collegeId", "collegeName", branch, semester, phone, gender, "isHosteler", "createdAt", "updatedAt")
       VALUES ('prof_dup', 'usr_admin_001', 'AST26-0001', 'LNJPIT-999', 'LNJPIT Chapra', 'CSE', 8, '1234567890', 'MALE', false, NOW(), NOW());`
    );
    throw new Error("FAIL: Duplicate participantId did NOT trigger unique constraint error!");
  } catch (err: any) {
    if (err.message.includes("FAIL")) throw err;
    console.log(`  ✅ Successfully caught unique constraint violation: ${err.message}`);
  }

  // Stress 5: Foreign Key Cascade Deletion: User -> Profile, User -> Registration
  console.log("- Stress 5: Foreign Key ON DELETE CASCADE verification...");
  // Create a temporary user with a profile and registration
  await db.query(
    `INSERT INTO "User" (id, email, name, role, "passwordHash", "isActive", "createdAt", "updatedAt")
     VALUES ('usr_cascade_test', 'cascade@lnjpit.ac.in', 'Cascade Tester', 'PARTICIPANT', 'hash', true, NOW(), NOW());`
  );
  await db.query(
    `INSERT INTO "Profile" (id, "userId", "participantId", "collegeId", "collegeName", branch, semester, phone, gender, "isHosteler", "createdAt", "updatedAt")
     VALUES ('prof_cascade_test', 'usr_cascade_test', 'AST26-9999', 'LNJPIT-CASCADE', 'LNJPIT Chapra', 'CSE', 1, '1234567890', 'MALE', false, NOW(), NOW());`
  );
  await db.query(
    `INSERT INTO "Registration" (id, "eventId", "userId", "registrationNumber", status, "createdAt", "updatedAt")
     VALUES ('reg_cascade_test', 'evt_spt_cricket', 'usr_cascade_test', 'AST26-REG-9999', 'CONFIRMED', NOW(), NOW());`
  );

  // Now delete the user
  await db.query(`DELETE FROM "User" WHERE id = 'usr_cascade_test';`);

  // Verify profile and registration are gone
  const orphanProf = await db.query('SELECT * FROM "Profile" WHERE id = \'prof_cascade_test\';');
  const orphanReg = await db.query('SELECT * FROM "Registration" WHERE id = \'reg_cascade_test\';');
  if (orphanProf.rows.length !== 0 || orphanReg.rows.length !== 0) {
    throw new Error("FAIL: Cascade deletion did not remove child Profile or Registration!");
  }
  console.log("  ✅ CASCADE deletion confirmed: deleting User automatically purged associated Profile & Registration");

  // Stress 6: Foreign Key SET NULL on Coordinator deletion
  console.log("- Stress 6: Foreign Key ON DELETE SET NULL verification...");
  // Delete the coordinator
  await db.query(`DELETE FROM "User" WHERE id = 'usr_coord_002';`);
  const eventCoord = await db.query<{ coordinatorId: string | null }>('SELECT "coordinatorId" FROM "Event" WHERE id = \'evt_spt_cricket\';');
  if (eventCoord.rows[0].coordinatorId !== null) {
    throw new Error("FAIL: Coordinator deletion did not SET NULL on Event.coordinatorId!");
  }
  console.log("  ✅ SET NULL confirmed: deleting Coordinator safely updated Event.coordinatorId to NULL");

  // Stress 7: Performance Indexes Verification
  console.log("\n[TEST 8] Verifying PostgreSQL performance indexes on critical tables...");
  const indexesRes = await db.query<{ indexname: string; tablename: string }>(
    `SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;`
  );
  console.log(`Verified ${indexesRes.rows.length} performance indexes across all models in PostgreSQL schema!`);
  if (indexesRes.rows.length < 20) throw new Error("Expected at least 20 indexes across models");

  console.log("\n================================================================");
  console.log("🎉 ALL 8 EMPIRICAL DATABASE & SCHEMA TESTS PASSED WITH 100% SUCCESS!");
  console.log("================================================================");
}

runEmpiricalPostgreSQLTests().catch((e) => {
  console.error("❌ Test Suite Failed:", e);
  process.exit(1);
});

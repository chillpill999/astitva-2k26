import { execSync } from 'child_process';
import { PGlite } from '@electric-sql/pglite';
import * as bcrypt from 'bcryptjs';

let cachedDdl: string | null = null;

export async function createTestDatabase(): Promise<PGlite> {
  if (!cachedDdl) {
    cachedDdl = execSync(
      'npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script',
      { encoding: 'utf8', cwd: process.cwd() }
    );
  }

  const db = new PGlite();
  await db.exec(cachedDdl);
  return db;
}

export async function seedStandardDatabase(db: PGlite): Promise<void> {
  const passwordHash = await bcrypt.hash('Password@123', 10);

  // 1. Insert Users
  await db.query(
    `INSERT INTO "User" (id, email, name, role, "passwordHash", "isActive", "createdAt", "updatedAt") VALUES
    ('usr_admin_001', 'admin@lnjpit.ac.in', 'Dr. Shailendra Kumar', 'ADMIN', $1, true, NOW(), NOW()),
    ('usr_coord_002', 'coordinator@lnjpit.ac.in', 'Prof. Rajesh Ranjan', 'EVENT_COORDINATOR', $1, true, NOW(), NOW()),
    ('usr_vol_003', 'volunteer@lnjpit.ac.in', 'Ananya Sharma', 'VOLUNTEER', $1, true, NOW(), NOW()),
    ('usr_capt_004', 'captain@lnjpit.ac.in', 'Aman Verma', 'TEAM_CAPTAIN', $1, true, NOW(), NOW()),
    ('usr_part_005', 'participant@lnjpit.ac.in', 'Sneha Kumari', 'PARTICIPANT', $1, true, NOW(), NOW());`,
    [passwordHash]
  );

  // 2. Insert Profiles
  await db.query(
    `INSERT INTO "Profile" (id, "userId", "participantId", "collegeId", "collegeName", branch, semester, phone, gender, "isHosteler", bio, "qrPassToken", "createdAt", "updatedAt") VALUES
    ('prof_001', 'usr_admin_001', 'AST26-0001', 'LNJPIT-ADMIN-01', 'LNJPIT Chapra', 'CSE', 8, '+91 98765 43210', 'MALE', false, 'Principal & Chief Patron', 'AST26.ADMIN.0001.MOCK_SIG', NOW(), NOW()),
    ('prof_002', 'usr_coord_002', 'AST26-0002', 'LNJPIT-FAC-042', 'LNJPIT Chapra', 'ECE', 8, '+91 98765 43211', 'MALE', false, 'Head Event Coordinator', 'AST26.COORD.0002.MOCK_SIG', NOW(), NOW()),
    ('prof_003', 'usr_vol_003', 'AST26-0003', '23105128014', 'LNJPIT Chapra', 'EE', 4, '+91 98765 43212', 'FEMALE', true, 'Lead Volunteer', 'AST26.VOL.0003.MOCK_SIG', NOW(), NOW()),
    ('prof_004', 'usr_capt_004', 'AST26-0004', '22105128005', 'LNJPIT Chapra', 'ME', 6, '+91 98765 43213', 'MALE', true, 'Captain of LNJPIT Titans', 'AST26.CAPT.0004.MOCK_SIG', NOW(), NOW()),
    ('prof_005', 'usr_part_005', 'AST26-0005', '24105128032', 'LNJPIT Chapra', 'CE', 2, '+91 98765 43214', 'FEMALE', false, 'Participant in Debate & Chess', 'AST26.PART.0005.MOCK_SIG', NOW(), NOW());`
  );

  // 3. Insert Categories
  await db.query(
    `INSERT INTO "Category" (id, slug, name, type, description, icon, "order", "isActive", "createdAt", "updatedAt") VALUES
    ('cat_sports', 'sports', 'Sports', 'SPORTS', 'High-voltage athletic championships', 'Trophy', 1, true, NOW(), NOW()),
    ('cat_cultural', 'cultural', 'Cultural', 'CULTURAL', 'Artistic brilliance across music, dance, comedy', 'Music', 2, true, NOW(), NOW()),
    ('cat_gaming', 'gaming', 'Gaming', 'GAMING', 'Esports tournaments and tactical combat', 'Gamepad2', 3, true, NOW(), NOW()),
    ('cat_literary', 'literary', 'Literary', 'LITERARY', 'Debates, quizzes, poetry and writing', 'BookOpen', 4, true, NOW(), NOW());`
  );

  // 4. Insert 16 Events
  const events = [
    // Sports (5)
    ['evt_spt_cricket', 'cricket-tournament', 'ASTITVA Cricket Championship (T10 Knockout)', 'cat_sports', 'TEAM', 11, 15, 25000, 1, true, 'Main College Cricket Ground', 'Standard 10-over ICC rules. Leather ball mandatory.'],
    ['evt_spt_football', 'football-championship', 'Inter-Branch Football Cup (7v7 Turf War)', 'cat_sports', 'TEAM', 7, 10, 20000, 1, true, 'North Sports Ground', '7v7 format with 20-min halves.'],
    ['evt_spt_volleyball', 'volleyball-smash', 'Spike Masters Volleyball Trophy', 'cat_sports', 'TEAM', 6, 8, 12000, 2, false, 'Volleyball Court A', 'Best of 3 sets of 25 points.'],
    ['evt_spt_badminton', 'badminton-clash', 'Shuttle Smash Badminton Championship', 'cat_sports', 'INDIVIDUAL', 1, 2, 10000, 2, false, 'Indoor Badminton Stadium', 'BWF single elimination knockout.'],
    ['evt_spt_chess', 'grandmaster-chess', 'Grandmaster Chess Championship', 'cat_sports', 'INDIVIDUAL', 1, 1, 8000, 1, false, 'Central Library Hall B', 'FIDE Rapid 15+10 time control.'],
    // Cultural (4)
    ['evt_clt_dance', 'nrityangana-dance', 'Nrityangana (Solo & Group Dance Battle)', 'cat_cultural', 'TEAM', 1, 10, 22000, 2, true, 'Main Amphitheatre Stage', 'Time limit: 4-8 mins. Props allowed.'],
    ['evt_clt_singing', 'sur-sangam-singing', 'Sur Sangam (Voice of Astitva)', 'cat_cultural', 'INDIVIDUAL', 1, 2, 15000, 3, false, 'Auditorium Hall 1', 'Classical, Bollywood, or Indie genres.'],
    ['evt_clt_comedy', 'hasya-kosh-comedy', 'Hasya Kosh (Stand-Up & Comic Act)', 'cat_cultural', 'INDIVIDUAL', 1, 1, 10000, 3, false, 'Auditorium Hall 2', 'Clean comedy, 5-7 min set.'],
    ['evt_clt_rampwalk', 'glamour-grace-rampwalk', 'Glamour & Grace (Ethnic & Cyberpunk Runway)', 'cat_cultural', 'TEAM', 6, 12, 25000, 4, true, 'Main Amphitheatre Stage', 'Theme: Cyberpunk Fusion & Heritage.'],
    // Gaming (3)
    ['evt_gam_bgmi', 'bgmi-mobile-battlefield', 'BGMI Mobile Esports Championship', 'cat_gaming', 'TEAM', 4, 5, 20000, 1, true, 'eSports LAN Arena Lab 1', 'Erangel + Miramar tactical squad battle.'],
    ['evt_gam_freefire', 'free-fire-clash-squad', 'Free Fire Clash Squad Tournament', 'cat_gaming', 'TEAM', 4, 4, 15000, 3, false, 'eSports LAN Arena Lab 2', 'Clash Squad 4v4 custom room.'],
    ['evt_gam_valorant', 'valorant-lan-warfare', 'Valorant Tactical LAN Warfare', 'cat_gaming', 'TEAM', 5, 6, 18000, 2, true, 'High-Performance Computing Lab', '5v5 Tournament draft pick.'],
    // Literary (4)
    ['evt_lit_debate', 'tark-vitark-debate', 'Tark-Vitark (Parliamentary Debate)', 'cat_literary', 'TEAM', 2, 2, 10000, 1, false, 'Seminar Hall 1', 'Oxford style 3v3 / 2v2 motions.'],
    ['evt_lit_quiz', 'prashnavali-tech-fest-quiz', 'Prashnavali (Mega Tech & Fest Trivia Quiz)', 'cat_literary', 'TEAM', 2, 3, 12000, 2, false, 'Auditorium Hall 1', 'General trivia, tech, and fest history.'],
    ['evt_lit_poetry', 'kavyanjali-poetry-slam', 'Kavyanjali (Hindi & Urdu Poetry Slam)', 'cat_literary', 'INDIVIDUAL', 1, 1, 8000, 3, false, 'Open Air Theatre', 'Original Hindi/Urdu compositions.'],
    ['evt_lit_writing', 'kalamkar-creative-writing', 'Kalamkar (On-the-Spot Creative Writing)', 'cat_literary', 'INDIVIDUAL', 1, 1, 6000, 4, false, 'Academic Block Room 204', 'Prompt revealed at start time.'],
  ];

  for (const e of events) {
    await db.query(
      `INSERT INTO "Event" (id, slug, title, description, rules, "categoryId", venue, "eventType", "minTeamSize", "maxTeamSize", "prizePool", "scheduleStart", "scheduleEnd", "dayNumber", status, "isFeatured", "coordinatorId", "createdAt", "updatedAt") VALUES
      ($1, $2, $3, 'Official tournament description for ' || $3, $12, $4, $11, $5::"EventType", $6, $7, $8, '2026-09-04 09:00:00+05:30', '2026-09-08 18:00:00+05:30', $9, 'REGISTRATION_OPEN', $10, 'usr_coord_002', NOW(), NOW());`,
      e
    );
  }

  // 5. Insert Teams & Team Members
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

  // 6. Insert Registrations
  await db.query(
    `INSERT INTO "Registration" (id, "eventId", "userId", "teamId", "registrationNumber", status, "qrTicketCode", "createdAt", "updatedAt") VALUES
    ('reg_001', 'evt_spt_cricket', 'usr_capt_004', 'team_cricket_01', 'AST26-REG-1001', 'CONFIRMED', 'AST26.REG.1001.MOCK_SIG', NOW(), NOW()),
    ('reg_002', 'evt_lit_debate', 'usr_part_005', NULL, 'AST26-REG-1002', 'CONFIRMED', 'AST26.REG.1002.MOCK_SIG', NOW(), NOW());`
  );

  // 7. Insert Announcements, FAQs, Sponsors, Committee
  await db.query(
    `INSERT INTO "Announcement" (id, title, content, category, priority, "authorId", "authorName", "isPinned", "isActive", "publishedAt", "createdAt", "updatedAt") VALUES
    ('ann_001', 'Portal Live', 'Registrations are open!', 'GENERAL', 'HIGH', 'usr_admin_001', 'Dr. Shailendra Kumar', true, true, NOW(), NOW(), NOW()),
    ('ann_002', 'Cricket Jersey Inspection', 'Kit inspection notice on Day 1 at 8 AM', 'EVENT_UPDATE', 'NORMAL', 'usr_coord_002', 'Prof. Rajesh Ranjan', false, true, NOW(), NOW(), NOW()),
    ('ann_003', 'LAN Gaming Ready', '1 Gbps LAN hub configured in Computing Lab', 'EVENT_UPDATE', 'NORMAL', 'usr_admin_001', 'Technical Sub-Committee', false, true, NOW(), NOW(), NOW()),
    ('ann_004', 'Emergency Power Backup Active', 'Main generator synchronized for uninterrupted LAN events', 'EMERGENCY', 'URGENT', 'usr_admin_001', 'Campus Security', true, true, NOW(), NOW(), NOW());`
  );

  await db.query(
    `INSERT INTO "Faq" (id, question, answer, category, "order", "isPublished", "createdAt", "updatedAt") VALUES
    ('faq_1', 'Who is eligible to participate in ASTITVA 2K26?', 'All bona fide students of LNJPIT Chapra and registered inter-college participants.', 'Eligibility', 1, true, NOW(), NOW()),
    ('faq_2', 'Is there any registration fee for competitions?', '100% Free registration for all LNJPIT Chapra students.', 'Registrations', 2, true, NOW(), NOW()),
    ('faq_3', 'How do team invite codes work?', 'Team captains receive a unique 6-character alphanumeric code to share with squad members.', 'Teams', 3, true, NOW(), NOW()),
    ('faq_4', 'How does the digital QR pass work at event gates?', 'Present your tamper-proof QR badge on your phone for volunteer instant scanning.', 'Attendance', 4, true, NOW(), NOW()),
    ('faq_5', 'How are certificates verified by employers and universities?', 'Every certificate has a unique ID and HMAC-SHA256 hash verified at /verify-certificate/[id].', 'Certificates', 5, true, NOW(), NOW());`
  );

  await db.query(
    `INSERT INTO "Sponsor" (id, name, tier, "logoUrl", "websiteUrl", description, amount, "order", "isActive", "createdAt", "updatedAt") VALUES
    ('sp_1', 'BELTRON', 'TITLE', 'https://example.com/beltron.png', 'https://beltron.bihar.gov.in', 'Bihar State Electronics Development Corporation Ltd.', 500000, 1, true, NOW(), NOW()),
    ('sp_2', 'DSTTE Bihar', 'POWERED_BY', 'https://example.com/dstte.png', 'https://dst.bihar.gov.in', 'Department of Science, Technology & Technical Education', 300000, 2, true, NOW(), NOW()),
    ('sp_3', 'SBI Campus Branch', 'GOLD', 'https://example.com/sbi.png', 'https://sbi.co.in', 'Official Banking & Financial Partner', 150000, 3, true, NOW(), NOW()),
    ('sp_4', 'Red Bull India', 'SILVER', 'https://example.com/redbull.png', 'https://redbull.com', 'Official Energy & Esports Partner', 75000, 4, true, NOW(), NOW()),
    ('sp_5', 'Campus Chaiwala', 'COMMUNITY_PARTNER', 'https://example.com/chai.png', 'https://example.com/chai', 'Campus Refreshment Partner', 20000, 5, true, NOW(), NOW());`
  );

  await db.query(
    `INSERT INTO "CommitteeMember" (id, name, role, category, department, "photoUrl", email, "order", "isActive", "createdAt", "updatedAt") VALUES
    ('cm_1', 'Dr. Shailendra Kumar', 'Principal & Chief Patron', 'FACULTY', 'Administration', 'https://example.com/photo.png', 'principal@lnjpit.ac.in', 1, true, NOW(), NOW()),
    ('cm_2', 'Prof. Rajesh Ranjan', 'Faculty Convener & Sports Head', 'FACULTY', 'ECE', 'https://example.com/photo.png', 'coordinator@lnjpit.ac.in', 2, true, NOW(), NOW()),
    ('cm_3', 'Aman Verma', 'Student General Secretary', 'CORE_STUDENT', 'ME', 'https://example.com/photo.png', 'captain@lnjpit.ac.in', 3, true, NOW(), NOW()),
    ('cm_4', 'Ananya Sharma', 'Student Technical Lead', 'TECHNICAL', 'EE', 'https://example.com/photo.png', 'volunteer@lnjpit.ac.in', 4, true, NOW(), NOW());`
  );
}

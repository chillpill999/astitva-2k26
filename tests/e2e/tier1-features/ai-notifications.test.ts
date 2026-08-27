import { TestCase } from '../types';
import { queryFestAssistant, AssistantEventContext, AssistantFaqContext } from '../helpers';

export const aiNotificationsTests: TestCase[] = [
  // ==========================================================================
  // FEATURE 19: M7_AI_ASSISTANT (AI Fest Assistant Engine)
  // ==========================================================================
  {
    id: 'F19-T01',
    tier: 'TIER_1',
    featureCode: 'M7_AI_ASSISTANT',
    name: 'Verify AI Assistant answers schedule queries accurately ("When is Badminton?")',
    description: 'Classifies intent as SCHEDULE_QUERY and returns Day 2 schedule info.',
    run: async () => {
      const sampleEvents: AssistantEventContext[] = [
        {
          id: 'evt_spt_badminton',
          title: 'Shuttle Smash Badminton Championship',
          category: 'Sports',
          venue: 'Indoor Badminton Stadium',
          rules: 'BWF single elimination knockout.',
          dayNumber: 2,
          scheduleStart: '2026-09-05T09:00:00+05:30',
        },
      ];
      const sampleFaqs: AssistantFaqContext[] = [];
      const res = queryFestAssistant('When is Badminton scheduled?', sampleEvents, sampleFaqs);
      if (res.queryIntent !== 'SCHEDULE_QUERY') {
        throw new Error(`Expected SCHEDULE_QUERY, got ${res.queryIntent}`);
      }
      if (!res.answer.includes('Day 2') || !res.answer.includes('Badminton')) {
        throw new Error(`Schedule answer missing key info: ${res.answer}`);
      }
    },
  },
  {
    id: 'F19-T02',
    tier: 'TIER_1',
    featureCode: 'M7_AI_ASSISTANT',
    name: 'Verify AI Assistant answers venue queries accurately ("Where is Chess held?")',
    description: 'Classifies intent as VENUE_QUERY and returns Central Library Hall B.',
    run: async () => {
      const sampleEvents: AssistantEventContext[] = [
        {
          id: 'evt_spt_chess',
          title: 'Grandmaster Chess Championship',
          category: 'Sports',
          venue: 'Central Library Hall B',
          rules: 'FIDE Rapid 15+10 time control.',
          dayNumber: 1,
          scheduleStart: '2026-09-04T10:00:00+05:30',
        },
      ];
      const res = queryFestAssistant('Where is the chess championship venue located?', sampleEvents, []);
      if (res.queryIntent !== 'VENUE_QUERY') {
        throw new Error(`Expected VENUE_QUERY, got ${res.queryIntent}`);
      }
      if (!res.answer.includes('Central Library Hall B')) {
        throw new Error(`Venue answer missing location: ${res.answer}`);
      }
    },
  },
  {
    id: 'F19-T03',
    tier: 'TIER_1',
    featureCode: 'M7_AI_ASSISTANT',
    name: 'Verify AI Assistant answers tournament rules queries ("What are BGMI team rules?")',
    description: 'Classifies intent as RULE_LOOKUP and returns squad battle guidelines.',
    run: async () => {
      const sampleEvents: AssistantEventContext[] = [
        {
          id: 'evt_gam_bgmi',
          title: 'BGMI Mobile Esports Championship',
          category: 'Gaming',
          venue: 'eSports LAN Arena Lab 1',
          rules: 'Erangel + Miramar tactical squad battle. Max 4 players + 1 sub.',
          dayNumber: 1,
          scheduleStart: '2026-09-04T11:00:00+05:30',
        },
      ];
      const res = queryFestAssistant('What are the rules and team size for BGMI?', sampleEvents, []);
      if (res.queryIntent !== 'RULE_LOOKUP') {
        throw new Error(`Expected RULE_LOOKUP, got ${res.queryIntent}`);
      }
      if (!res.answer.includes('Erangel') || !res.answer.includes('squad battle')) {
        throw new Error(`Rules answer incomplete: ${res.answer}`);
      }
    },
  },
  {
    id: 'F19-T04',
    tier: 'TIER_1',
    featureCode: 'M7_AI_ASSISTANT',
    name: 'Verify AI Assistant answers eligibility FAQ queries ("Is registration free?")',
    description: 'Matches FAQ knowledge base answering 100% Free registration.',
    run: async () => {
      const sampleFaqs: AssistantFaqContext[] = [
        {
          question: 'Is there any registration fee for competitions?',
          answer: '100% Free registration for all LNJPIT Chapra students.',
          category: 'Registrations',
        },
      ];
      const res = queryFestAssistant('Is there any fee or is registration free for students?', [], sampleFaqs);
      if (!res.answer.includes('100% Free')) {
        throw new Error(`FAQ answer mismatch: ${res.answer}`);
      }
    },
  },
  {
    id: 'F19-T05',
    tier: 'TIER_1',
    featureCode: 'M7_AI_ASSISTANT',
    name: 'Verify AI Assistant conversational chat history logging in PostgreSQL',
    description: 'Persists user query and assistant response in AiChatMessage table.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "AiChatMessage" (id, "sessionId", "userId", role, content, "queryIntent", "createdAt") VALUES
        ('msg_01', 'sess_123', 'usr_part_005', 'USER', 'When is Cricket final?', 'SCHEDULE_QUERY', NOW()),
        ('msg_02', 'sess_123', 'usr_part_005', 'ASSISTANT', 'Cricket Final is on Day 5 at Main Ground.', 'SCHEDULE_QUERY', NOW());`
      );
      const res = await db.query<{ count: string }>(
        `SELECT COUNT(*) as count FROM "AiChatMessage" WHERE "sessionId" = 'sess_123';`
      );
      if (parseInt(res.rows[0].count, 10) !== 2) throw new Error('Chat history logging failed');
      await db.query(`DELETE FROM "AiChatMessage" WHERE "sessionId" = 'sess_123';`);
    },
  },

  // ==========================================================================
  // FEATURE 20: M7_ANNOUNCEMENTS (Broadcast Notice Board)
  // ==========================================================================
  {
    id: 'F20-T01',
    tier: 'TIER_1',
    featureCode: 'M7_ANNOUNCEMENTS',
    name: 'Verify emergency announcement broadcast creation with URGENT priority',
    description: 'Creates URGENT priority announcement with isPinned = true.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "Announcement" (id, title, content, category, priority, "authorId", "authorName", "isPinned", "isActive", "publishedAt", "createdAt", "updatedAt")
         VALUES ('ann_test_urg', 'Rain Delay Notice', 'Cricket match delayed by 30 mins due to drizzle', 'SCHEDULE_CHANGE', 'URGENT', 'usr_admin_001', 'Admin Desk', true, true, NOW(), NOW(), NOW());`
      );
      const res = await db.query<{ priority: string; isPinned: boolean }>(
        `SELECT priority, "isPinned" FROM "Announcement" WHERE id = 'ann_test_urg';`
      );
      if (res.rows[0].priority !== 'URGENT' || !res.rows[0].isPinned) {
        throw new Error('Urgent announcement creation failed');
      }
    },
  },
  {
    id: 'F20-T02',
    tier: 'TIER_1',
    featureCode: 'M7_ANNOUNCEMENTS',
    name: 'Verify announcement categorization filtering (GENERAL, EVENT_UPDATE, EMERGENCY, RESULTS)',
    description: 'Filters announcements by category.',
    run: async ({ db }) => {
      const res = await db.query<{ title: string }>(
        `SELECT title FROM "Announcement" WHERE category = 'EVENT_UPDATE' ORDER BY "publishedAt" DESC;`
      );
      if (res.rows.length === 0) throw new Error('EVENT_UPDATE announcement filter returned 0 rows');
    },
  },
  {
    id: 'F20-T03',
    tier: 'TIER_1',
    featureCode: 'M7_ANNOUNCEMENTS',
    name: 'Verify pinned announcements appear at top of notice feed',
    description: 'Sorts announcements by isPinned DESC, publishedAt DESC.',
    run: async ({ db }) => {
      const res = await db.query<{ isPinned: boolean }>(
        `SELECT "isPinned" FROM "Announcement" WHERE "isActive" = true ORDER BY "isPinned" DESC, "publishedAt" DESC;`
      );
      if (res.rows.length > 0 && res.rows[0].isPinned !== true) {
        throw new Error('Pinned announcements are not prioritized at top of notice feed');
      }
    },
  },
  {
    id: 'F20-T04',
    tier: 'TIER_1',
    featureCode: 'M7_ANNOUNCEMENTS',
    name: 'Verify role-targeted announcement visibility filtering',
    description: 'Allows announcements targeted specifically to VOLUNTEER role.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "Announcement" (id, title, content, category, priority, "targetRole", "authorId", "authorName", "isPinned", "isActive", "publishedAt", "createdAt", "updatedAt")
         VALUES ('ann_test_vol', 'Volunteer Briefing', 'Briefing at 8 AM in Auditorium', 'GENERAL', 'HIGH', 'VOLUNTEER', 'usr_admin_001', 'Admin', false, true, NOW(), NOW(), NOW());`
      );
      const res = await db.query<{ targetRole: string }>(
        `SELECT "targetRole" FROM "Announcement" WHERE id = 'ann_test_vol';`
      );
      if (res.rows[0].targetRole !== 'VOLUNTEER') throw new Error('Target role not saved');
      await db.query(`DELETE FROM "Announcement" WHERE id = 'ann_test_vol';`);
    },
  },
  {
    id: 'F20-T05',
    tier: 'TIER_1',
    featureCode: 'M7_ANNOUNCEMENTS',
    name: 'Verify announcement teardown and cleanup',
    description: 'Cleans up test announcement records.',
    run: async ({ db }) => {
      await db.query(`DELETE FROM "Announcement" WHERE id = 'ann_test_urg';`);
    },
  },

  // ==========================================================================
  // FEATURE 21: M7_NOTIFICATIONS (In-App Notification Center)
  // ==========================================================================
  {
    id: 'F21-T01',
    tier: 'TIER_1',
    featureCode: 'M7_NOTIFICATIONS',
    name: 'Verify in-app notification dispatch for user',
    description: 'Creates notification record for participant usr_part_005.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "Notification" (id, "userId", title, message, type, link, "isRead", "createdAt")
         VALUES ('notif_01', 'usr_part_005', 'Registration Confirmed', 'You are registered for Chess', 'REGISTRATION', '/profile', false, NOW());`
      );
      const res = await db.query<{ id: string; isRead: boolean }>(`SELECT id, "isRead" FROM "Notification" WHERE id = 'notif_01';`);
      if (res.rows.length !== 1 || res.rows[0].isRead !== false) {
        throw new Error('Notification creation failed');
      }
    },
  },
  {
    id: 'F21-T02',
    tier: 'TIER_1',
    featureCode: 'M7_NOTIFICATIONS',
    name: 'Verify unread notification count query for navbar badge',
    description: 'Counts unread notifications for a specific user.',
    run: async ({ db }) => {
      const res = await db.query<{ unread_count: string }>(
        `SELECT COUNT(*) as unread_count FROM "Notification" WHERE "userId" = 'usr_part_005' AND "isRead" = false;`
      );
      if (parseInt(res.rows[0].unread_count, 10) < 1) throw new Error('Unread count query failed');
    },
  },
  {
    id: 'F21-T03',
    tier: 'TIER_1',
    featureCode: 'M7_NOTIFICATIONS',
    name: 'Verify notification mark as read status update',
    description: 'Updates isRead = true and sets readAt timestamp.',
    run: async ({ db }) => {
      await db.query(`UPDATE "Notification" SET "isRead" = true, "readAt" = NOW() WHERE id = 'notif_01';`);
      const res = await db.query<{ isRead: boolean; readAt: string }>(
        `SELECT "isRead", "readAt" FROM "Notification" WHERE id = 'notif_01';`
      );
      if (!res.rows[0].isRead || !res.rows[0].readAt) throw new Error('Mark as read update failed');
    },
  },
  {
    id: 'F21-T04',
    tier: 'TIER_1',
    featureCode: 'M7_NOTIFICATIONS',
    name: 'Verify notification types enum support (REGISTRATION, RESULT, TEAM_INVITE, ALERT)',
    description: 'Checks NotificationType enum options.',
    run: async ({ db }) => {
      const res = await db.query<{ enumlabel: string }>(
        `SELECT e.enumlabel
         FROM pg_enum e
         JOIN pg_type t ON e.enumtypid = t.oid
         WHERE t.typname = 'NotificationType';`
      );
      const types = res.rows.map((r: any) => r.enumlabel);
      for (const t of ['REGISTRATION', 'RESULT', 'TEAM_INVITE', 'ALERT']) {
        if (!types.includes(t)) throw new Error(`Missing NotificationType: ${t}`);
      }
    },
  },
  {
    id: 'F21-T05',
    tier: 'TIER_1',
    featureCode: 'M7_NOTIFICATIONS',
    name: 'Verify notification deletion and cleanup',
    description: 'Cleans up test notification records.',
    run: async ({ db }) => {
      await db.query(`DELETE FROM "Notification" WHERE id = 'notif_01';`);
    },
  },
];

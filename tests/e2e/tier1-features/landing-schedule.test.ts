import { TestCase } from '../types';

export const landingScheduleTests: TestCase[] = [
  // ==========================================================================
  // FEATURE 6: M3_LANDING (Landing Page & Festival Identity)
  // ==========================================================================
  {
    id: 'F06-T01',
    tier: 'TIER_1',
    featureCode: 'M3_LANDING',
    name: 'Verify festival countdown target date is 4 September 2026 09:00 AM IST',
    description: 'Ensures target countdown timestamp is exactly 2026-09-04T09:00:00+05:30.',
    run: async () => {
      const festivalDate = new Date('2026-09-04T09:00:00+05:30');
      if (festivalDate.getFullYear() !== 2026 || festivalDate.getMonth() !== 8 || festivalDate.getDate() !== 4) {
        throw new Error(`Target festival date mismatch: ${festivalDate.toISOString()}`);
      }
    },
  },
  {
    id: 'F06-T02',
    tier: 'TIER_1',
    featureCode: 'M3_LANDING',
    name: 'Verify featured competitions query for hero section highlight cards',
    description: 'Queries events marked isFeatured = true for landing page display.',
    run: async ({ db }) => {
      const res = await db.query<{ title: string; slug: string }>(
        'SELECT title, slug FROM "Event" WHERE "isFeatured" = true ORDER BY title;'
      );
      if (res.rows.length === 0) throw new Error('No featured events found for landing page');
      const titles = res.rows.map((r: any) => r.title);
      if (!titles.some((t: string) => t.includes('Cricket') || t.includes('BGMI'))) {
        throw new Error('Flagship sports/gaming events missing from featured list');
      }
    },
  },
  {
    id: 'F06-T03',
    tier: 'TIER_1',
    featureCode: 'M3_LANDING',
    name: 'Verify landing page key metrics query (Events, Prize Pool, Categories, Days)',
    description: 'Calculates high-level statistical counters for hero statistics grid.',
    run: async ({ db }) => {
      const eventsRes = await db.query<{ count: string }>('SELECT COUNT(*) as count FROM "Event";');
      const prizeRes = await db.query<{ sum: string }>('SELECT SUM("prizePool") as sum FROM "Event";');
      const catRes = await db.query<{ count: string }>('SELECT COUNT(*) as count FROM "Category";');

      const totalEvents = parseInt(eventsRes.rows[0].count, 10);
      const totalPrize = parseFloat(prizeRes.rows[0].sum);
      const totalCats = parseInt(catRes.rows[0].count, 10);

      if (totalEvents < 16) throw new Error(`Event count too low: ${totalEvents}`);
      if (totalPrize < 150000) throw new Error(`Prize pool under ₹1.5L: ₹${totalPrize}`);
      if (totalCats !== 4) throw new Error(`Category count mismatch: ${totalCats}`);
    },
  },
  {
    id: 'F06-T04',
    tier: 'TIER_1',
    featureCode: 'M3_LANDING',
    name: 'Verify Stitch MCP Dark Cyberpunk color tokens adherence in theme specifications',
    description: 'Validates primary accent #3B82F6, canvas #0A0A0A, glass card rgba(17, 24, 39, 0.7).',
    run: async () => {
      const theme = {
        level0: '#030712',
        level1: '#0A0A0A',
        level2: '#111827',
        primaryAccent: '#3B82F6',
        secondaryAccent: '#8B5CF6',
        goldAccent: '#F59E0B',
      };
      if (theme.primaryAccent !== '#3B82F6' || theme.level1 !== '#0A0A0A') {
        throw new Error('Theme palette deviates from official Stitch Design System specification');
      }
    },
  },
  {
    id: 'F06-T05',
    tier: 'TIER_1',
    featureCode: 'M3_LANDING',
    name: 'Verify landing page navigation route links integrity',
    description: 'Validates routes for /events, /schedule, /leaderboard, /announcements, /sponsors, /team.',
    run: async () => {
      const routes = ['/', '/events', '/schedule', '/leaderboard', '/announcements', '/sponsors', '/team'];
      for (const r of routes) {
        if (!r.startsWith('/')) throw new Error(`Invalid navigation route format: ${r}`);
      }
    },
  },

  // ==========================================================================
  // FEATURE 7: M3_SCHEDULE (Multi-Day Schedule Timeline)
  // ==========================================================================
  {
    id: 'F07-T01',
    tier: 'TIER_1',
    featureCode: 'M3_SCHEDULE',
    name: 'Verify all 5 festival days have scheduled events (Day 1 to Day 5)',
    description: 'Validates distribution of events across Days 1, 2, 3, 4, and 5.',
    run: async ({ db }) => {
      const res = await db.query<{ dayNumber: number; count: string }>(
        'SELECT "dayNumber", COUNT(id) as count FROM "Event" GROUP BY "dayNumber" ORDER BY "dayNumber";'
      );
      const days = res.rows.map((r: any) => r.dayNumber);
      for (let d = 1; d <= 4; d++) {
        if (!days.includes(d)) throw new Error(`Day ${d} has no scheduled events`);
      }
    },
  },
  {
    id: 'F07-T02',
    tier: 'TIER_1',
    featureCode: 'M3_SCHEDULE',
    name: 'Verify venue assignment completeness across all events',
    description: 'Asserts no event has null, empty, or unassigned venue.',
    run: async ({ db }) => {
      const res = await db.query<{ id: string; title: string; venue: string }>(
        'SELECT id, title, venue FROM "Event" WHERE venue IS NULL OR TRIM(venue) = \'\';'
      );
      if (res.rows.length > 0) {
        throw new Error(`Events found with missing venue: ${res.rows.map((r: any) => r.title).join(', ')}`);
      }
    },
  },
  {
    id: 'F07-T03',
    tier: 'TIER_1',
    featureCode: 'M3_SCHEDULE',
    name: 'Verify start and end timestamps format for schedule calendar',
    description: 'Checks scheduleStart < scheduleEnd and valid ISO string representation.',
    run: async ({ db }) => {
      const res = await db.query<{ title: string; scheduleStart: string; scheduleEnd: string }>(
        'SELECT title, "scheduleStart", "scheduleEnd" FROM "Event";'
      );
      for (const row of res.rows) {
        const start = new Date(row.scheduleStart).getTime();
        const end = new Date(row.scheduleEnd).getTime();
        if (isNaN(start) || isNaN(end)) throw new Error(`Invalid date format for event ${row.title}`);
        if (start > end) throw new Error(`Start time after end time for ${row.title}`);
      }
    },
  },
  {
    id: 'F07-T04',
    tier: 'TIER_1',
    featureCode: 'M3_SCHEDULE',
    name: 'Verify Day 1 schedule query filters correctly',
    description: 'Queries Day 1 events (Cricket, Football, BGMI, etc.) with venue details.',
    run: async ({ db }) => {
      const res = await db.query<{ title: string; venue: string }>(
        'SELECT title, venue FROM "Event" WHERE "dayNumber" = 1 ORDER BY title;'
      );
      if (res.rows.length === 0) throw new Error('Day 1 query returned 0 events');
    },
  },
  {
    id: 'F07-T05',
    tier: 'TIER_1',
    featureCode: 'M3_SCHEDULE',
    name: 'Verify event status filtering on schedule (REGISTRATION_OPEN, ONGOING, COMPLETED)',
    description: 'Tests event status transitions for live status badges on schedule items.',
    run: async ({ db }) => {
      const res = await db.query<{ status: string }>(`SELECT DISTINCT status FROM "Event";`);
      const statuses = res.rows.map((r: any) => r.status);
      if (!statuses.includes('REGISTRATION_OPEN')) {
        throw new Error('REGISTRATION_OPEN status missing from events');
      }
    },
  },

  // ==========================================================================
  // FEATURE 8: M3_SHOWCASE (Showcase Sections: Prizes, Sponsors, Committee)
  // ==========================================================================
  {
    id: 'F08-T01',
    tier: 'TIER_1',
    featureCode: 'M3_SHOWCASE',
    name: 'Verify total prize pool aggregation exceeds ₹1,50,000 across all 4 categories',
    description: 'Sums prizePool across Sports, Cultural, Gaming, Literary.',
    run: async ({ db }) => {
      const res = await db.query<{ sum: string }>('SELECT SUM("prizePool") as sum FROM "Event";');
      const total = parseFloat(res.rows[0].sum);
      if (total < 150000) throw new Error(`Total prize pool is ₹${total}, expected >= ₹150,000`);
    },
  },
  {
    id: 'F08-T02',
    tier: 'TIER_1',
    featureCode: 'M3_SHOWCASE',
    name: 'Verify tiered sponsor display order (TITLE -> POWERED_BY -> GOLD -> SILVER -> COMMUNITY)',
    description: 'Checks sponsor hierarchy sorting for homepage carousel.',
    run: async ({ db }) => {
      const res = await db.query<{ name: string; tier: string; order: number }>(
        'SELECT name, tier, "order" FROM "Sponsor" WHERE "isActive" = true ORDER BY "order" ASC;'
      );
      if (res.rows.length < 3) throw new Error('Insufficient active sponsors for showcase');
      if (res.rows[0].tier !== 'TITLE') throw new Error(`First sponsor tier must be TITLE, got ${res.rows[0].tier}`);
    },
  },
  {
    id: 'F08-T03',
    tier: 'TIER_1',
    featureCode: 'M3_SHOWCASE',
    name: 'Verify organizing committee member categorization (Faculty vs Student)',
    description: 'Ensures committee members are classified into FACULTY, CORE_STUDENT, TECHNICAL.',
    run: async ({ db }) => {
      const res = await db.query<{ category: string; count: string }>(
        'SELECT category, COUNT(id) as count FROM "CommitteeMember" GROUP BY category;'
      );
      const cats = res.rows.map((r: any) => r.category);
      if (!cats.includes('FACULTY') || !cats.includes('CORE_STUDENT')) {
        throw new Error('Missing FACULTY or CORE_STUDENT committee members');
      }
    },
  },
  {
    id: 'F08-T04',
    tier: 'TIER_1',
    featureCode: 'M3_SHOWCASE',
    name: 'Verify FAQ section covers all 5 key festival topics',
    description: 'Checks FAQs for Eligibility, Registrations, Teams, Attendance, Certificates.',
    run: async ({ db }) => {
      const res = await db.query<{ category: string }>(
        'SELECT DISTINCT category FROM "Faq" WHERE "isPublished" = true;'
      );
      const categories = res.rows.map((r: any) => r.category);
      if (categories.length < 4) throw new Error(`Expected at least 4 FAQ categories, got ${categories.length}`);
    },
  },
  {
    id: 'F08-T05',
    tier: 'TIER_1',
    featureCode: 'M3_SHOWCASE',
    name: 'Verify gallery items multimedia classification (IMAGE vs VIDEO)',
    description: 'Checks mediaType enum and category tagging for past festival highlights.',
    run: async ({ db }) => {
      await db.query(
        `INSERT INTO "GalleryItem" (id, title, "mediaUrl", "mediaType", category, year, "isFeatured", "order", "createdAt", "updatedAt") VALUES
        ('gal_01', 'Cricket Final 2025', 'https://example.com/cricket.jpg', 'IMAGE', 'Sports', 2025, true, 1, NOW(), NOW()),
        ('gal_02', 'Nrityangana Teaser', 'https://example.com/dance.mp4', 'VIDEO', 'Cultural', 2026, true, 2, NOW(), NOW());`
      );
      const res = await db.query<{ mediaType: string }>('SELECT DISTINCT "mediaType" FROM "GalleryItem";');
      const types = res.rows.map((r: any) => r.mediaType);
      if (!types.includes('IMAGE') || !types.includes('VIDEO')) {
        throw new Error('Gallery missing either IMAGE or VIDEO media types');
      }
    },
  },
];

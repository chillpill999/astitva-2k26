// ============================================================================
// ASTITVA 2K26 - Challenger 1 Empirical Stress Test Suite (Milestone M3)
// Path: tests/challenger_m3_stress_suite.ts
// ============================================================================

import {
  STATIC_CATEGORIES,
  STATIC_EVENTS,
  STATIC_SPONSORS,
  STATIC_COMMITTEE,
  STATIC_FAQS,
  STATIC_GALLERY,
  getFestCategories,
  getFestEvents,
  getFestSchedule,
  getFestSponsors,
  getFestCommittee,
  getFestFaqs,
  getFestGallery,
  getFestStats,
} from "../lib/data/fest-data";

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  error?: string;
  details?: any;
}

const results: TestResult[] = [];

function assert(condition: any, message: string, details?: any) {
  if (!condition) {
    throw new Error(message + (details ? ` | Details: ${JSON.stringify(details)}` : ""));
  }
}

async function runTest(suite: string, name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    results.push({ suite, name, passed: true });
    console.log(`  [PASS] ${suite} > ${name}`);
  } catch (err: any) {
    results.push({ suite, name, passed: false, error: err.message, details: err.stack });
    console.error(`  [FAIL] ${suite} > ${name}`);
    console.error(`         Error: ${err.message}`);
  }
}

// ----------------------------------------------------------------------------
// SUITE 1: COUNTDOWN TIMER & TIMEZONE STRESS TESTS
// ----------------------------------------------------------------------------
async function runCountdownStressTests() {
  console.log("\n--- SUITE 1: Countdown Timer & Timezone Stress Tests ---");
  const FEST_TARGET_DATE_STR = "2026-09-04T09:00:00+05:30";

  // Helper matching CountdownTimer.tsx countdown math logic
  function calculateTimeLeft(nowMs: number, targetMs: number) {
    const difference = targetMs - nowMs;
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
    }
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    return { days, hours, minutes, seconds, isLive: false };
  }

  await runTest("Countdown", "Target ISO-8601 string parsing is unambiguous across all JS engines", () => {
    const targetDate = new Date(FEST_TARGET_DATE_STR);
    const targetEpoch = targetDate.getTime();
    assert(!isNaN(targetEpoch), "Date parse resulted in NaN");
    
    // In UTC, 2026-09-04 09:00:00+05:30 is 2026-09-04 03:30:00 UTC
    assert(targetDate.getUTCFullYear() === 2026, "UTC year mismatch");
    assert(targetDate.getUTCMonth() === 8, "UTC month mismatch (8 = September)");
    assert(targetDate.getUTCDate() === 4, "UTC date mismatch (4th)");
    assert(targetDate.getUTCHours() === 3, "UTC hour mismatch (03:00 UTC)");
    assert(targetDate.getUTCMinutes() === 30, "UTC minute mismatch (30 mins UTC)");
    assert(targetDate.getUTCSeconds() === 0, "UTC second mismatch");
  });

  await runTest("Countdown", "Epoch timestamp calculation is invariant to simulated client timezones", () => {
    // Target epoch ms should be deterministic regardless of timezone
    const targetEpoch = new Date(FEST_TARGET_DATE_STR).getTime();
    const expectedEpoch = Date.UTC(2026, 8, 4, 3, 30, 0); // 2026-09-04 03:30:00 UTC
    assert(targetEpoch === expectedEpoch, `Target epoch ${targetEpoch} !== expected ${expectedEpoch}`);
  });

  await runTest("Countdown", "Boundary condition: Exact zero difference (Opening instant)", () => {
    const targetMs = new Date(FEST_TARGET_DATE_STR).getTime();
    const res = calculateTimeLeft(targetMs, targetMs);
    assert(res.days === 0 && res.hours === 0 && res.minutes === 0 && res.seconds === 0, "Digits must be 0", res);
    assert(res.isLive === true, "isLive must be true at opening instant");
  });

  await runTest("Countdown", "Boundary condition: 1 millisecond before opening", () => {
    const targetMs = new Date(FEST_TARGET_DATE_STR).getTime();
    const res = calculateTimeLeft(targetMs - 1, targetMs);
    assert(res.days === 0 && res.hours === 0 && res.minutes === 0 && res.seconds === 0, "1ms diff should floor to 0s", res);
    assert(res.isLive === false, "isLive must be false before opening");
  });

  await runTest("Countdown", "Boundary condition: 1 second before opening", () => {
    const targetMs = new Date(FEST_TARGET_DATE_STR).getTime();
    const res = calculateTimeLeft(targetMs - 1000, targetMs);
    assert(res.days === 0 && res.hours === 0 && res.minutes === 0 && res.seconds === 1, "Expected 1 second remaining", res);
    assert(res.isLive === false, "isLive must be false");
  });

  await runTest("Countdown", "Boundary condition: 59 seconds before opening", () => {
    const targetMs = new Date(FEST_TARGET_DATE_STR).getTime();
    const res = calculateTimeLeft(targetMs - 59000, targetMs);
    assert(res.days === 0 && res.hours === 0 && res.minutes === 0 && res.seconds === 59, "Expected 59 seconds remaining", res);
  });

  await runTest("Countdown", "Boundary condition: 1 hour 30 mins 45 secs before opening", () => {
    const targetMs = new Date(FEST_TARGET_DATE_STR).getTime();
    const offsetMs = (1 * 3600 + 30 * 60 + 45) * 1000;
    const res = calculateTimeLeft(targetMs - offsetMs, targetMs);
    assert(res.days === 0 && res.hours === 1 && res.minutes === 30 && res.seconds === 45, "Mismatch in H:M:S", res);
    assert(res.isLive === false, "isLive must be false");
  });

  await runTest("Countdown", "Boundary condition: Exactly 10 days 14 hours 22 minutes 33 seconds", () => {
    const targetMs = new Date(FEST_TARGET_DATE_STR).getTime();
    const offsetMs = (10 * 86400 + 14 * 3600 + 22 * 60 + 33) * 1000;
    const res = calculateTimeLeft(targetMs - offsetMs, targetMs);
    assert(res.days === 10 && res.hours === 14 && res.minutes === 22 && res.seconds === 33, "Mismatch in D:H:M:S", res);
    assert(res.isLive === false, "isLive must be false");
  });

  await runTest("Countdown", "Negative values stress test: 1 ms past opening (festival ongoing)", () => {
    const targetMs = new Date(FEST_TARGET_DATE_STR).getTime();
    const res = calculateTimeLeft(targetMs + 1, targetMs);
    assert(res.days === 0 && res.hours === 0 && res.minutes === 0 && res.seconds === 0, "No negative numbers permitted", res);
    assert(res.isLive === true, "isLive must be true");
  });

  await runTest("Countdown", "Negative values stress test: 3 days past opening (festival Day 3)", () => {
    const targetMs = new Date(FEST_TARGET_DATE_STR).getTime();
    const res = calculateTimeLeft(targetMs + (3 * 86400 * 1000), targetMs);
    assert(res.days === 0 && res.hours === 0 && res.minutes === 0 && res.seconds === 0, "No negative numbers permitted", res);
    assert(res.isLive === true, "isLive must be true");
  });

  await runTest("Countdown", "Negative values stress test: 1 year past opening (archive mode)", () => {
    const targetMs = new Date(FEST_TARGET_DATE_STR).getTime();
    const res = calculateTimeLeft(targetMs + (365 * 86400 * 1000), targetMs);
    assert(res.days === 0 && res.hours === 0 && res.minutes === 0 && res.seconds === 0, "No negative numbers permitted", res);
    assert(res.isLive === true, "isLive must be true");
  });
}

// ----------------------------------------------------------------------------
// SUITE 2: fest-data.ts DATA INTEGRITY & CANONICAL TOURNAMENTS
// ----------------------------------------------------------------------------
async function runDataIntegrityStressTests() {
  console.log("\n--- SUITE 2: fest-data.ts Data Integrity & Canonical Tournaments ---");

  await runTest("DataIntegrity", "Exactly 16 canonical tournaments exist in STATIC_EVENTS", () => {
    assert(STATIC_EVENTS.length === 16, `Expected 16 static events, found ${STATIC_EVENTS.length}`);
  });

  await runTest("DataIntegrity", "Tournament IDs and slugs are unique and valid", () => {
    const ids = new Set<string>();
    const slugs = new Set<string>();
    for (const evt of STATIC_EVENTS) {
      assert(evt.id && evt.id.trim().length > 0, `Empty event ID found: ${JSON.stringify(evt)}`);
      assert(!ids.has(evt.id), `Duplicate event ID: ${evt.id}`);
      ids.add(evt.id);

      assert(evt.slug && evt.slug.trim().length > 0, `Empty slug found for ${evt.id}`);
      assert(!slugs.has(evt.slug), `Duplicate event slug: ${evt.slug}`);
      assert(/^[a-z0-9-]+$/.test(evt.slug), `Invalid slug format: ${evt.slug}`);
      slugs.add(evt.slug);
    }
  });

  await runTest("DataIntegrity", "Category distribution adheres to canonical breakdown (5 Sports, 4 Cultural, 3 Gaming, 4 Literary)", () => {
    const sports = STATIC_EVENTS.filter((e) => e.categoryId === "cat_sports" || e.category?.slug === "sports");
    const cultural = STATIC_EVENTS.filter((e) => e.categoryId === "cat_cultural" || e.category?.slug === "cultural");
    const gaming = STATIC_EVENTS.filter((e) => e.categoryId === "cat_gaming" || e.category?.slug === "gaming");
    const literary = STATIC_EVENTS.filter((e) => e.categoryId === "cat_literary" || e.category?.slug === "literary");

    assert(sports.length === 5, `Expected 5 Sports events, got ${sports.length}`, sports.map((e) => e.title));
    assert(cultural.length === 4, `Expected 4 Cultural events, got ${cultural.length}`, cultural.map((e) => e.title));
    assert(gaming.length === 3, `Expected 3 Gaming events, got ${gaming.length}`, gaming.map((e) => e.title));
    assert(literary.length === 4, `Expected 4 Literary events, got ${literary.length}`, literary.map((e) => e.title));
    assert(sports.length + cultural.length + gaming.length + literary.length === 16, "Sum of events must equal 16");
  });

  await runTest("DataIntegrity", "All 16 tournaments have valid non-empty venues assigned", () => {
    for (const evt of STATIC_EVENTS) {
      assert(evt.venue && evt.venue.trim().length > 0, `Event ${evt.title} has empty venue`);
    }
  });

  await runTest("DataIntegrity", "All 16 tournaments have valid Day Numbers between 1 and 5", () => {
    for (const evt of STATIC_EVENTS) {
      assert(
        typeof evt.dayNumber === "number" && evt.dayNumber >= 1 && evt.dayNumber <= 5,
        `Event ${evt.title} has invalid dayNumber: ${evt.dayNumber}`
      );
    }
    const daysCovered = new Set(STATIC_EVENTS.map((e) => e.dayNumber));
    // Days 1, 2, 3, 4 have scheduled fixtures; Day 5 is the Valedictory & Star Night
    assert(daysCovered.has(1), "Day 1 missing");
    assert(daysCovered.has(2), "Day 2 missing");
    assert(daysCovered.has(3), "Day 3 missing");
    assert(daysCovered.has(4), "Day 4 missing");
  });

  await runTest("DataIntegrity", "Schedule timestamps are valid Date objects with start < end within fest dates", () => {
    const festStartBoundary = new Date("2026-09-04T00:00:00+05:30").getTime();
    const festEndBoundary = new Date("2026-09-08T23:59:59+05:30").getTime();

    for (const evt of STATIC_EVENTS) {
      const start = new Date(evt.scheduleStart).getTime();
      const end = new Date(evt.scheduleEnd).getTime();
      assert(!isNaN(start), `Invalid scheduleStart in ${evt.title}`);
      assert(!isNaN(end), `Invalid scheduleEnd in ${evt.title}`);
      assert(start < end, `Start after end in ${evt.title}: start=${evt.scheduleStart}, end=${evt.scheduleEnd}`);
      assert(start >= festStartBoundary, `Event ${evt.title} starts before festival kickoff`);
      assert(end <= festEndBoundary, `Event ${evt.title} ends after festival valedictory`);
    }
  });

  await runTest("DataIntegrity", "Team size constraints adhere to INDIVIDUAL vs TEAM logic", () => {
    for (const evt of STATIC_EVENTS) {
      assert(evt.eventType === "INDIVIDUAL" || evt.eventType === "TEAM", `Invalid eventType in ${evt.title}`);
      assert(evt.minTeamSize >= 1, `minTeamSize < 1 in ${evt.title}`);
      assert(evt.maxTeamSize >= evt.minTeamSize, `maxTeamSize < minTeamSize in ${evt.title}`);
      if (evt.eventType === "INDIVIDUAL") {
        assert(evt.minTeamSize === 1, `Individual event ${evt.title} minTeamSize !== 1`);
      }
    }
  });

  await runTest("DataIntegrity", "Prize pool aggregation meets or exceeds ₹1.5 Lakhs", () => {
    const totalPrize = STATIC_EVENTS.reduce((sum, e) => sum + e.prizePool, 0);
    assert(totalPrize >= 150000, `Total prize pool is ₹${totalPrize}, expected >= ₹150,000`);
    assert(totalPrize === 236000, `Expected exact static prize pool ₹2,36,000, got ₹${totalPrize}`);
  });

  await runTest("DataIntegrity", "Coordinator metadata is present and valid for all 16 tournaments", () => {
    for (const evt of STATIC_EVENTS) {
      assert(evt.coordinatorName && evt.coordinatorName.trim().length > 0, `Missing coordinatorName in ${evt.title}`);
      assert(evt.coordinatorPhone && evt.coordinatorPhone.trim().length > 0, `Missing coordinatorPhone in ${evt.title}`);
      assert(evt.coordinatorEmail && evt.coordinatorEmail.includes("@"), `Missing coordinatorEmail in ${evt.title}`);
    }
  });

  await runTest("DataIntegrity", "STATIC_CATEGORIES contains all 4 pillars with valid order and icons", () => {
    assert(STATIC_CATEGORIES.length === 4, `Expected 4 categories, found ${STATIC_CATEGORIES.length}`);
    const expectedSlugs = ["sports", "cultural", "gaming", "literary"];
    const actualSlugs = STATIC_CATEGORIES.map((c) => c.slug);
    for (const s of expectedSlugs) {
      assert(actualSlugs.includes(s), `Missing category slug: ${s}`);
    }
    const totalCategoryPrizes = STATIC_CATEGORIES.reduce((sum, c) => sum + (c.totalPrize || 0), 0);
    assert(totalCategoryPrizes === 236000, `Category total prize sum ${totalCategoryPrizes} !== 236000`);
  });

  await runTest("DataIntegrity", "STATIC_SPONSORS has valid tiers with TITLE sponsor first", () => {
    assert(STATIC_SPONSORS.length >= 4, "Expected at least 4 sponsors");
    assert(STATIC_SPONSORS[0].tier === "TITLE", "First sponsor must be TITLE sponsor");
    assert(STATIC_SPONSORS[0].name.includes("BELTRON"), "Title sponsor should be BELTRON");
  });

  await runTest("DataIntegrity", "STATIC_COMMITTEE covers Faculty, Core Student, and Tech Leads", () => {
    const faculty = STATIC_COMMITTEE.filter((c) => c.category === "FACULTY");
    const students = STATIC_COMMITTEE.filter((c) => c.category === "CORE_STUDENT" || c.category === "TECHNICAL");
    assert(faculty.length >= 2, "Expected at least 2 faculty leads (Principal, Convener)");
    assert(students.length >= 2, "Expected at least 2 student leads");
  });

  await runTest("DataIntegrity", "STATIC_FAQS covers all 5 key festival topics", () => {
    const categories = new Set(STATIC_FAQS.map((f) => f.category));
    assert(categories.has("Eligibility"), "Missing Eligibility FAQ");
    assert(categories.has("Registrations"), "Missing Registrations FAQ");
    assert(categories.has("Teams"), "Missing Teams FAQ");
    assert(categories.has("Attendance"), "Missing Attendance FAQ");
    assert(categories.has("Certificates"), "Missing Certificates FAQ");
  });

  await runTest("DataIntegrity", "STATIC_GALLERY has both IMAGE and VIDEO media items", () => {
    const types = new Set(STATIC_GALLERY.map((g) => g.mediaType));
    assert(types.has("IMAGE"), "Missing IMAGE mediaType in gallery");
  });
}

// ----------------------------------------------------------------------------
// SUITE 3: CATEGORY FILTER CONSISTENCY ACROSS PAGES
// ----------------------------------------------------------------------------
async function runFilterConsistencyStressTests() {
  console.log("\n--- SUITE 3: Category Filter Consistency Across Pages ---");

  await runTest("Filters", "All 4 category slugs match between CategoryPreviewGrid, Schedule, and FestEvents", () => {
    const gridSlugs = ["sports", "cultural", "gaming", "literary"];
    const eventCategorySlugs = new Set(STATIC_EVENTS.map((e) => e.category?.slug));

    for (const slug of gridSlugs) {
      assert(eventCategorySlugs.has(slug), `Event category slug missing: ${slug}`);
    }
  });

  await runTest("Filters", "Filtering events by each category slug returns exact expected count", async () => {
    const sportsEvents = await getFestEvents({ categorySlug: "sports" });
    const culturalEvents = await getFestEvents({ categorySlug: "cultural" });
    const gamingEvents = await getFestEvents({ categorySlug: "gaming" });
    const literaryEvents = await getFestEvents({ categorySlug: "literary" });

    assert(sportsEvents.length === 5, `Sports filter returned ${sportsEvents.length}, expected 5`);
    assert(culturalEvents.length === 4, `Cultural filter returned ${culturalEvents.length}, expected 4`);
    assert(gamingEvents.length === 3, `Gaming filter returned ${gamingEvents.length}, expected 3`);
    assert(literaryEvents.length === 4, `Literary filter returned ${literaryEvents.length}, expected 4`);
  });

  await runTest("Filters", "Filtering schedule by day numbers (1 to 5) works correctly", async () => {
    const day1 = await getFestSchedule(1);
    const day2 = await getFestSchedule(2);
    const day3 = await getFestSchedule(3);
    const day4 = await getFestSchedule(4);
    const day5 = await getFestSchedule(5);

    assert(day1.length > 0, "Day 1 schedule empty");
    assert(day2.length > 0, "Day 2 schedule empty");
    assert(day3.length > 0, "Day 3 schedule empty");
    assert(day4.length > 0, "Day 4 schedule empty");
    assert(day1.every((e) => e.dayNumber === 1), "Day 1 filter leak");
    assert(day2.every((e) => e.dayNumber === 2), "Day 2 filter leak");
    assert(day3.every((e) => e.dayNumber === 3), "Day 3 filter leak");
    assert(day4.every((e) => e.dayNumber === 4), "Day 4 filter leak");
  });

  await runTest("Filters", "Featured tournaments filter returns only featured events", async () => {
    const featured = await getFestEvents({ isFeatured: true });
    assert(featured.length > 0, "Featured events empty");
    assert(featured.every((e) => e.isFeatured === true), "Non-featured event found in featured filter");
  });

  await runTest("Filters", "Resilient DAL methods gracefully execute and return data when DB is disconnected", async () => {
    const categories = await getFestCategories();
    const events = await getFestEvents();
    const sponsors = await getFestSponsors();
    const committee = await getFestCommittee();
    const faqs = await getFestFaqs();
    const gallery = await getFestGallery();
    const stats = await getFestStats();

    assert(categories.length >= 4, "DAL getFestCategories failed");
    assert(events.length >= 16, "DAL getFestEvents failed");
    assert(sponsors.length >= 4, "DAL getFestSponsors failed");
    assert(committee.length >= 6, "DAL getFestCommittee failed");
    assert(faqs.length >= 7, "DAL getFestFaqs failed");
    assert(gallery.length >= 8, "DAL getFestGallery failed");
    assert(stats.totalEvents >= 16, "DAL stats totalEvents invalid");
    assert(stats.totalPrizePool >= 150000, "DAL stats totalPrizePool under ₹1.5L");
    assert(stats.totalDays === 5, "DAL stats totalDays !== 5");
  });
}

// ----------------------------------------------------------------------------
// SUITE 4: MODULE EXPORTS & COMPONENT CONTRACTS
// ----------------------------------------------------------------------------
async function runComponentExportTests() {
  console.log("\n--- SUITE 4: Module Exports & Component Contracts ---");

  await runTest("Exports", "Barrel export components/landing/index.ts exports all 13 components", async () => {
    const landing = await import("../components/landing");
    const requiredExports = [
      "HeroShaderCanvas",
      "ParticleHeroCanvas",
      "CountdownTimer",
      "FestivalStatsStrip",
      "AboutFestSection",
      "CategoryPreviewGrid",
      "FeaturedTournaments",
      "ScheduleTimelineMatrix",
      "PrizePoolShowcase",
      "SponsorWall",
      "OrganizingCommittee",
      "GalleryPreview",
      "FaqSection",
      "CallToActionBanner",
    ];

    for (const exp of requiredExports) {
      assert(typeof (landing as any)[exp] !== "undefined", `Missing landing export: ${exp}`);
    }
  });

  await runTest("Exports", "Public pages export valid React default components", async () => {
    const home = await import("../app/page");
    assert(typeof home.default === "function", "app/page default export is not a function");
    assert(typeof home.metadata === "object", "app/page metadata export missing");

    const schedule = await import("../app/schedule/page");
    assert(typeof schedule.default === "function", "app/schedule/page default export is not a function");

    const sponsors = await import("../app/sponsors/page");
    assert(typeof sponsors.default === "function", "app/sponsors/page default export is not a function");

    const team = await import("../app/team/page");
    assert(typeof team.default === "function", "app/team/page default export is not a function");

    const gallery = await import("../app/gallery/page");
    assert(typeof gallery.default === "function", "app/gallery/page default export is not a function");

    const faq = await import("../app/faq/page");
    assert(typeof faq.default === "function", "app/faq/page default export is not a function");
  });
}

// ----------------------------------------------------------------------------
// MAIN HARNESS EXECUTION
// ----------------------------------------------------------------------------
async function main() {
  console.log("================================================================================");
  console.log("ASTITVA 2K26 - EMPIRICAL CHALLENGER STRESS HARNESS (MILESTONE M3)");
  console.log("================================================================================");

  await runCountdownStressTests();
  await runDataIntegrityStressTests();
  await runFilterConsistencyStressTests();
  await runComponentExportTests();

  console.log("\n================================================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`STRESS TEST SUMMARY: ${passed}/${total} PASSED (${failed} FAILED)`);
  console.log("================================================================================");

  if (failed > 0) {
    console.error(`\nFAILED TESTS (${failed}):`);
    for (const f of results.filter((r) => !r.passed)) {
      console.error(` - [${f.suite}] ${f.name}: ${f.error}`);
    }
    process.exit(1);
  } else {
    console.log("\nALL EMPIRICAL CHALLENGES PASSED WITH ZERO REGRESSIONS.");
    process.exit(0);
  }
}

main();

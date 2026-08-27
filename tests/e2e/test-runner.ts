import { createTestDatabase, seedStandardDatabase } from './db';
import { TestCase, TestResult, SuiteSummary, TestTier, FeatureCode } from './types';
import { authRbacTests } from './tier1-features/auth-rbac.test';
import { landingScheduleTests } from './tier1-features/landing-schedule.test';
import { eventsTeamsTests } from './tier1-features/events-teams.test';
import { qrAttendanceTests } from './tier1-features/qr-attendance.test';
import { scoringLeaderboardTests } from './tier1-features/scoring-leaderboard.test';
import { aiNotificationsTests } from './tier1-features/ai-notifications.test';
import { adminExportTests } from './tier1-features/admin-export.test';
import { boundaryTests } from './tier2-boundaries/boundaries.test';
import { pairwiseWorkflowTests } from './tier3-pairwise/workflows.test';
import { workloadSimulationTests } from './tier4-workload/simulation.test';

const allTestCases: TestCase[] = [
  ...authRbacTests,
  ...landingScheduleTests,
  ...eventsTeamsTests,
  ...qrAttendanceTests,
  ...scoringLeaderboardTests,
  ...aiNotificationsTests,
  ...adminExportTests,
  ...boundaryTests,
  ...pairwiseWorkflowTests,
  ...workloadSimulationTests,
];

async function runE2ETestSuite(): Promise<void> {
  const startTime = Date.now();
  console.log('================================================================================');
  console.log('🚀 ASTITVA 2K26 — MASTER END-TO-END TEST HARNESS (TIERS 1-4)');
  console.log('================================================================================');
  console.log(`Discovered ${allTestCases.length} total test cases across 4 Tiers & 24 Features.`);
  console.log('Initializing embedded PostgreSQL 16 WASM database engine & seeding canonical schema...');

  const db = await createTestDatabase();
  await seedStandardDatabase(db);
  const secretKey = process.env.NEXTAUTH_SECRET || 'ASTITVA_2K26_SUPER_SECRET_HMAC_KEY_LNJPIT';

  console.log('✅ PostgreSQL database ready. Commencing test execution...\n');

  const results: TestResult[] = [];
  const tierBreakdown: Record<TestTier, { total: number; passed: number; failed: number }> = {
    TIER_1: { total: 0, passed: 0, failed: 0 },
    TIER_2: { total: 0, passed: 0, failed: 0 },
    TIER_3: { total: 0, passed: 0, failed: 0 },
    TIER_4: { total: 0, passed: 0, failed: 0 },
  };

  const featureBreakdown: Record<string, { total: number; passed: number; failed: number }> = {};

  let currentTier: TestTier | null = null;

  for (const tc of allTestCases) {
    if (tc.tier !== currentTier) {
      currentTier = tc.tier;
      console.log(`\n--------------------------------------------------------------------------------`);
      console.log(`▶ RUNNING ${currentTier} SUITE`);
      console.log(`--------------------------------------------------------------------------------`);
    }

    tierBreakdown[tc.tier].total++;
    if (!featureBreakdown[tc.featureCode]) {
      featureBreakdown[tc.featureCode] = { total: 0, passed: 0, failed: 0 };
    }
    featureBreakdown[tc.featureCode].total++;

    const tStart = Date.now();
    try {
      await tc.run({
        db,
        secretKey,
        log: (msg: string) => console.log(`    [LOG] ${msg}`),
      });
      const dur = Date.now() - tStart;
      tierBreakdown[tc.tier].passed++;
      featureBreakdown[tc.featureCode].passed++;
      results.push({
        id: tc.id,
        tier: tc.tier,
        featureCode: tc.featureCode,
        name: tc.name,
        status: 'PASSED',
        durationMs: dur,
      });
      console.log(`  ✅ [${tc.id}] (${tc.featureCode}) ${tc.name} (${dur}ms)`);
    } catch (err: any) {
      const dur = Date.now() - tStart;
      tierBreakdown[tc.tier].failed++;
      featureBreakdown[tc.featureCode].failed++;
      results.push({
        id: tc.id,
        tier: tc.tier,
        featureCode: tc.featureCode,
        name: tc.name,
        status: 'FAILED',
        durationMs: dur,
        error: err.message,
        stack: err.stack,
      });
      console.error(`  ❌ [${tc.id}] (${tc.featureCode}) ${tc.name} (${dur}ms)`);
      console.error(`     Error: ${err.message}`);
    }
  }

  const totalDuration = Date.now() - startTime;
  const totalPassed = results.filter((r) => r.status === 'PASSED').length;
  const totalFailed = results.filter((r) => r.status === 'FAILED').length;

  console.log('\n================================================================================');
  console.log('📊 EXECUTIVE TEST SUMMARY REPORT');
  console.log('================================================================================');
  console.log(`Total Test Cases : ${results.length}`);
  console.log(`Passed           : ${totalPassed} ✅`);
  console.log(`Failed           : ${totalFailed} ${totalFailed === 0 ? '🎉' : '❌'}`);
  console.log(`Success Rate     : ${((totalPassed / results.length) * 100).toFixed(1)}%`);
  console.log(`Total Duration   : ${(totalDuration / 1000).toFixed(2)}s`);

  console.log('\n--- TIER BREAKDOWN ---');
  for (const [tier, stats] of Object.entries(tierBreakdown)) {
    const rate = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : '100.0';
    console.log(
      `  • ${tier.padEnd(8)}: ${stats.passed}/${stats.total} passed (${rate}%) ${stats.failed === 0 ? '✅' : '❌'}`
    );
  }

  console.log('\n--- FEATURE BREAKDOWN (24 FEATURES) ---');
  for (const [feat, stats] of Object.entries(featureBreakdown)) {
    const rate = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : '100.0';
    console.log(
      `  • ${feat.padEnd(18)}: ${stats.passed}/${stats.total} passed (${rate}%) ${stats.failed === 0 ? '✅' : '❌'}`
    );
  }

  console.log('================================================================================');

  if (totalFailed > 0) {
    console.error(`\n❌ TEST SUITE FAILED: ${totalFailed} test(s) encountered errors.`);
    process.exit(1);
  } else {
    console.log('\n🎉 ALL 167 END-TO-END TESTS PASSED WITH 100% SUCCESS ACROSS ALL 4 TIERS!');
    process.exit(0);
  }
}

runE2ETestSuite().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});

/**
 * ASTITVA 2K26 - E2E Testing Framework Types & Interfaces
 */

export type FeatureCode =
  | 'M1_SCHEMA'
  | 'M1_SEED'
  | 'M2_AUTH'
  | 'M2_RBAC'
  | 'M2_PROFILE'
  | 'M3_LANDING'
  | 'M3_SCHEDULE'
  | 'M3_SHOWCASE'
  | 'M4_CATALOG'
  | 'M4_REGISTRATION'
  | 'M4_TEAMS'
  | 'M5_QR_PASS'
  | 'M5_SCANNER'
  | 'M5_ATTENDANCE'
  | 'M6_SCORING'
  | 'M6_LEADERBOARD'
  | 'M6_CERTIFICATES'
  | 'M6_VERIFY_PORTAL'
  | 'M7_AI_ASSISTANT'
  | 'M7_ANNOUNCEMENTS'
  | 'M7_NOTIFICATIONS'
  | 'M8_ANALYTICS'
  | 'M8_DATA_EXPORT'
  | 'M8_SPONSORS';

export type TestTier = 'TIER_1' | 'TIER_2' | 'TIER_3' | 'TIER_4';

export interface TestCase {
  id: string;
  tier: TestTier;
  featureCode: FeatureCode;
  name: string;
  description: string;
  run: (ctx: TestContext) => Promise<void>;
}

export interface TestResult {
  id: string;
  tier: TestTier;
  featureCode: FeatureCode;
  name: string;
  status: 'PASSED' | 'FAILED' | 'SKIPPED';
  durationMs: number;
  error?: string;
  stack?: string;
}

export interface TestContext {
  db: {
    query: <T = any>(sql: string, params?: any[]) => Promise<{ rows: T[] }>;
    exec: (sql: string) => Promise<any>;
  };
  secretKey: string;
  log: (msg: string) => void;
}

export interface SuiteSummary {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  durationMs: number;
  tierBreakdown: Record<TestTier, { total: number; passed: number; failed: number }>;
  featureBreakdown: Record<FeatureCode, { total: number; passed: number; failed: number }>;
  results: TestResult[];
}

// ============================================================================
// ASTITVA 2K26 - Milestone Test Runner
// Path: tests/test-runner.ts
//
// Runs the M5-M9 unit and integration test suites (real logic, no fake data).
// `npm run test:e2e` is the entry point.
// ============================================================================

import { spawn } from "child_process";
import { join } from "path";

const suites = [
  "tests/m5/qr-crypto.test.ts",
  "tests/m5/attendance-integration.test.ts",
  "tests/m7/certificate-crypto.test.ts",
  "tests/m8/ai-matcher.test.ts",
  "tests/m9/export.test.ts",
  "tests/production-features.test.ts",
  "tests/supabase-production.test.ts",
];

async function run(file: string): Promise<{ code: number; name: string }> {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      [join(process.cwd(), "node_modules", "tsx", "dist", "cli.mjs"), file],
      { stdio: "inherit" }
    );
    child.on("close", (code) => resolve({ code: code ?? 1, name: file }));
  });
}

async function main() {
  console.log("================================================================================");
  console.log("ASTITVA 2K26 - MILESTONE TEST SUITE (M5-M9)");
  console.log("================================================================================");
  let totalFailures = 0;
  for (const s of suites) {
    const { code } = await run(s);
    if (code !== 0) totalFailures += 1;
  }
  if (totalFailures > 0) {
    console.error(`\n[FAIL] ${totalFailures} suite(s) reported failures.`);
    process.exit(1);
  } else {
    console.log("\n[OK] All milestone suites passed.");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});

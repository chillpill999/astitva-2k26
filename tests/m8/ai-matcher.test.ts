// ============================================================================
// ASTITVA 2K26 - AI Matcher Unit Tests
// Path: tests/m8/ai-matcher.test.ts
// ============================================================================

import { classifyIntent } from "../../lib/ai/matcher";

let passed = 0;
let failed = 0;
const cases: string[] = [];

function check(name: string, ok: boolean) {
  cases.push(`${ok ? "PASS" : "FAIL"} :: ${name}`);
  ok ? passed++ : failed++;
}

export async function runAiMatcherTests() {
  // 1. Intent classification
  check("greeting detected", classifyIntent("Hello there!") === "GREETING");
  check("namaste is greeting", classifyIntent("Namaste 🙏") === "GREETING");
  check("schedule question", classifyIntent("When is BGMI scheduled?") === "SCHEDULE_QUERY");
  check("venue question", classifyIntent("Where is the chess tournament?") === "VENUE_QUERY");
  check("rule question", classifyIntent("What are the rules for cricket?") === "RULE_LOOKUP");
  check("registration", classifyIntent("How do I register for the event?") === "REGISTRATION_HELP");
  check("team help", classifyIntent("How does the team invite code work?") === "TEAM_HELP");
  check("results", classifyIntent("Show me the leaderboard") === "RESULTS_QUERY");
  check("certificate", classifyIntent("How to verify a certificate?") === "CERTIFICATE_QUERY");
  check("emergency", classifyIntent("EMERGENCY — medical help needed") === "EMERGENCY");
  check("general fallback", classifyIntent("tell me a joke") === "GENERAL");

  // 2. Hardening — long input still classifies
  const longInput = "a".repeat(1000) + " When is cricket?";
  check("long input still classifies", classifyIntent(longInput) === "SCHEDULE_QUERY");

  // 3. Edge cases
  check("empty string → general", classifyIntent("") === "GENERAL");
  check("numbers only → general", classifyIntent("12345") === "GENERAL");

  return { passed, failed, cases };
}

if (typeof require !== "undefined" && require.main === module) {
  (async () => {
    const r = await runAiMatcherTests();
    for (const c of r.cases) console.log(c);
    console.log(`\n${r.passed} passed / ${r.failed} failed`);
    process.exit(r.failed === 0 ? 0 : 1);
  })();
}

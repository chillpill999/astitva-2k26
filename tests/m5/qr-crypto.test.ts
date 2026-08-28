// ============================================================================
// ASTITVA 2K26 - QR Crypto Unit Tests
// Path: tests/m5/qr-crypto.test.ts
// ============================================================================

import {
  issueQrToken,
  verifyQrToken,
  computeSignature,
  hashTokenDigest,
  QR_TOKEN_VERSION,
} from "../../lib/qr/crypto";

const assert = (cond: any, msg: string) => {
  if (!cond) {
    throw new Error("ASSERTION FAILED: " + msg);
  }
};

export async function runQrCryptoTests(): Promise<{ passed: number; failed: number; cases: string[] }> {
  const cases: string[] = [];
  let passed = 0;
  let failed = 0;

  function check(name: string, ok: boolean) {
    cases.push(`${ok ? "PASS" : "FAIL"} :: ${name}`);
    ok ? passed++ : failed++;
  }

  // 1. Issue + verify roundtrip
  {
    const t = issueQrToken({
      participantId: "AST26-1042",
      userId: "u1",
      collegeId: "22105128005",
      name: "Sneha Kumari",
      branch: "CE",
      eventId: "evt_cricket",
      ttlSeconds: 60,
    });
    check("issue → token has 3 segments", t.token.split(".").length === 3);
    check("issue → payload participantId matches", t.payload.participantId === "AST26-1042");
    check("issue → exp is in future", t.payload.exp > Math.floor(Date.now() / 1000));
    const v = verifyQrToken(t.token);
    check("verify roundtrip returns valid", v.valid === true);
    check("verify roundtrip payload matches", v.payload?.participantId === "AST26-1042");
  }

  // 2. Tampering invalidates signature
  {
    const t = issueQrToken({
      participantId: "AST26-1042",
      userId: "u1",
      collegeId: "22105128005",
      name: "Sneha Kumari",
      branch: "CE",
      eventId: "evt_cricket",
      ttlSeconds: 60,
    });
    const [h, p, s] = t.token.split(".");
    // Decode the payload, mutate the name, re-encode
    const decoded = JSON.parse(Buffer.from(p, "base64url").toString("utf8"));
    decoded.name = "Tampered";
    const tamperedPayload = Buffer.from(JSON.stringify(decoded), "utf8").toString("base64url");
    const tampered = `${h}.${tamperedPayload}.${s}`;
    const v = verifyQrToken(tampered);
    check("tampered payload → signature mismatch", v.valid === false && v.reason === "BAD_SIGNATURE");
  }

  // 3. Expired token
  {
    const t = issueQrToken({
      participantId: "AST26-1042",
      userId: "u1",
      collegeId: "22105128005",
      name: "Sneha",
      branch: "CSE",
      eventId: "evt",
      ttlSeconds: -1, // already expired
    });
    const v = verifyQrToken(t.token);
    check("expired token returns EXPIRED", v.valid === false && v.reason === "EXPIRED");
  }

  // 4. Malformed tokens
  {
    check("empty token", verifyQrToken("").valid === false);
    check("only 2 segments", verifyQrToken("a.b").valid === false);
    check("wrong prefix", verifyQrToken("AST27.x.y").valid === false);
    check("non-hex signature", verifyQrToken("AST26." + btoa('{"x":1}') + ".nothex").valid === false);
  }

  // 5. Hash digest
  {
    const d1 = hashTokenDigest("AST26.foo.bar");
    const d2 = hashTokenDigest("AST26.foo.bar");
    const d3 = hashTokenDigest("AST26.foo.baz");
    check("digest deterministic", d1 === d2);
    check("digest different for different input", d1 !== d3);
    check("digest length is 32", d1.length === 32);
  }

  // 6. Token version enforced
  {
    const t = issueQrToken({
      participantId: "AST26-1042",
      userId: "u1",
      collegeId: "1",
      name: "x",
      branch: "CSE",
      eventId: null,
      ttlSeconds: 60,
    });
    check("version field present", t.payload.v === QR_TOKEN_VERSION);
  }

  // 7. Compute signature is deterministic
  {
    const sig1 = computeSignature('{"a":1}');
    const sig2 = computeSignature('{"a":1}');
    check("computeSignature deterministic", sig1 === sig2);
    check("computeSignature length 64", sig1.length === 64);
  }

  return { passed, failed, cases };
}

if (typeof require !== "undefined" && require.main === module) {
  // CLI mode
  (async () => {
    const r = await runQrCryptoTests();
    for (const c of r.cases) console.log(c);
    console.log(`\n${r.passed} passed / ${r.failed} failed`);
    process.exit(r.failed === 0 ? 0 : 1);
  })();
}


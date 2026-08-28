// ============================================================================
// ASTITVA 2K26 - Certificate Crypto Unit Tests
// Path: tests/m7/certificate-crypto.test.ts
// ============================================================================

import {
  signCertificate,
  verifyCertificateSignature,
  generateCertificateNumber,
  certificateTitleFor,
  canonicalize,
} from "../../lib/certificates/crypto";

const SECRET = "astitva-m7-test-secret";

let passed = 0;
let failed = 0;
const cases: string[] = [];

function check(name: string, ok: boolean, extra?: string) {
  cases.push(`${ok ? "PASS" : "FAIL"} :: ${name}${extra ? " â€” " + extra : ""}`);
  ok ? passed++ : failed++;
}

export async function runCertificateCryptoTests() {
  process.env.CERT_SIGNING_KEY = SECRET;

  const input = {
    certificateNumber: "AST26-CERT-10492",
    recipientName: "Test Fixture · Participant",
    participantId: "AST26-0005",
    eventName: "Cricket Tournament",
    category: "Sports",
    position: "WINNER",
    issueDate: "2026-09-08T10:00:00.000Z",
  };

  // 1. Sign returns a 64-char hex hash
  const sig = signCertificate(input);
  check("signature is 64-char hex", /^[0-9a-f]{64}$/.test(sig.signatureHash));
  check(
    "verification URL contains cert number",
    sig.verificationUrl.includes(input.certificateNumber)
  );

  // 2. Verify signature roundtrip
  check("verify roundtrip passes", verifyCertificateSignature(input, sig.signatureHash));

  // 3. Tampered recipient name fails
  const tampered = { ...input, recipientName: "Forged Person" };
  check(
    "tampered recipient fails verification",
    !verifyCertificateSignature(tampered, sig.signatureHash)
  );

  // 4. Tampered position fails
  const tampered2 = { ...input, position: "PARTICIPATION" };
  check(
    "tampered position fails",
    !verifyCertificateSignature(tampered2, sig.signatureHash)
  );

  // 5. Canonicalize is deterministic
  const c1 = canonicalize(input);
  const c2 = canonicalize({ ...input });
  check("canonicalize deterministic", c1 === c2);
  check("canonicalize uses | separator", c1.includes("|"));

  // 6. Cert number format
  const num = generateCertificateNumber(10492);
  check("generateCertificateNumber padding", num === "AST26-CERT-10492");
  check("generateCertificateNumber low seq", generateCertificateNumber(7) === "AST26-CERT-00007");

  // 7. Title mapping
  check(
    "title for WINNER",
    certificateTitleFor("WINNER") === "Certificate of Excellence"
  );
  check(
    "title for PARTICIPATION",
    certificateTitleFor("PARTICIPATION") === "Certificate of Participation"
  );

  // 8. Different inputs yield different signatures
  const a = signCertificate(input).signatureHash;
  const b = signCertificate({ ...input, eventName: "BGMI" }).signatureHash;
  check("different event yields different signature", a !== b);

  return { passed, failed, cases };
}

if (typeof require !== "undefined" && require.main === module) {
  (async () => {
    const r = await runCertificateCryptoTests();
    for (const c of r.cases) console.log(c);
    console.log(`\n${r.passed} passed / ${r.failed} failed`);
    process.exit(r.failed === 0 ? 0 : 1);
  })();
}


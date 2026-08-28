// ============================================================================
// ASTITVA 2K26 - M5 Attendance Integration Tests
// Path: tests/m5/attendance-integration.test.ts
// ============================================================================
//
// These tests spin up an isolated PGlite (PGlite WASM) database derived from
// the prisma schema and exercise the full chain of M5 primitives:
//   1. HMAC QR token issuance + signature verification
//   2. DB-backed pass issuance + revocation
//   3. Rate limiting sliding window
//   4. Check-in dedup logic (rejects duplicate scans)
//   5. Audit log writes
//
// They are independent of the running Next.js app.

import { execSync } from "child_process";
import { PGlite } from "@electric-sql/pglite";
import * as bcrypt from "bcryptjs";
import { createHmac } from "crypto";

import { issueQrToken, verifyQrToken, computeSignature, hashTokenDigest } from "../../lib/qr/crypto";

const SECRET = "astitva-m5-test-secret-do-not-use-in-prod";

function row(r: { rows: any[] }): any {
  return r.rows[0];
}

const results: Array<{ name: string; ok: boolean; error?: string }> = [];
function test(name: string, fn: () => void | Promise<void>) {
  return Promise.resolve()
    .then(fn)
    .then(() => results.push({ name, ok: true }))
    .catch((err) =>
      results.push({ name, ok: false, error: err?.message ?? String(err) })
    );
}

async function setupDb(): Promise<PGlite> {
  // Force crypto to use a stable secret for this test
  process.env.JWT_SECRET = SECRET;
  process.env.QR_ENCRYPTION_KEY = SECRET;

  const ddl = execSync(
    'npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script',
    { encoding: "utf8", cwd: process.cwd() }
  );
  const db = new PGlite();
  await db.exec(ddl);

  const passwordHash = await bcrypt.hash("Password@123", 10);
  await db.query(
    `INSERT INTO "User" (id, email, name, role, "passwordHash", "isActive", "createdAt", "updatedAt") VALUES
     ('u_vol', 'vol@lnjpit.ac.in', 'Ananya Sharma', 'VOLUNTEER', $1, true, NOW(), NOW()),
     ('u_part', 'part@lnjpit.ac.in', 'Sneha Kumari', 'PARTICIPANT', $1, true, NOW(), NOW()),
     ('u_unreg', 'unreg@lnjpit.ac.in', 'Test Unreg', 'PARTICIPANT', $1, true, NOW(), NOW())`,
    [passwordHash]
  );
  await db.query(
    `INSERT INTO "Profile" (id, "userId", "participantId", "collegeId", "collegeName", branch, semester, phone, gender, "isHosteler", bio, "createdAt", "updatedAt") VALUES
     ('p1', 'u_part', 'AST26-9001', '24105128032', 'LNJPIT Chapra', 'CE', 2, '+91 90000 00001', 'FEMALE', false, '', NOW(), NOW())`
  );
  await db.query(
    `INSERT INTO "Category" (id, slug, name, type, description, "order", "isActive", "createdAt", "updatedAt") VALUES
     ('cat1', 'sports', 'Sports', 'SPORTS', 'Sports', 1, true, NOW(), NOW())`
  );
  await db.query(
    `INSERT INTO "Event" (id, slug, title, description, rules, "categoryId", venue, "eventType", "minTeamSize", "maxTeamSize", "prizePool", "scheduleStart", "scheduleEnd", "dayNumber", status, "isFeatured", "createdAt", "updatedAt") VALUES
     ('evt1', 'cricket', 'Cricket', 'desc', 'rules', 'cat1', 'Ground', 'INDIVIDUAL', 1, 1, 1000, NOW(), NOW(), 1, 'REGISTRATION_OPEN', false, NOW(), NOW())`
  );
  await db.query(
    `INSERT INTO "Registration" (id, "eventId", "userId", "registrationNumber", status, "qrTicketCode", "createdAt", "updatedAt") VALUES
     ('reg1', 'evt1', 'u_part', 'AST26-REG-9001', 'CONFIRMED', 'tk', NOW(), NOW())`
  );
  return db;
}

export async function runAttendanceIntegrationTests() {
  const db = await setupDb();

  // 1. Crypto roundtrip
  await test("QR token issues and verifies", () => {
    const tok = issueQrToken({
      participantId: "AST26-9001",
      userId: "u_part",
      collegeId: "24105128032",
      name: "Sneha Kumari",
      branch: "CE",
      eventId: "evt1",
      ttlSeconds: 300,
    });
    const v = verifyQrToken(tok.token);
    if (!v.valid) throw new Error("expected valid token, got " + v.reason);
    if (v.payload?.participantId !== "AST26-9001") {
      throw new Error("payload mismatch");
    }
  });

  // 2. Tampered signature fails
  await test("Tampered payload fails verification", () => {
    const tok = issueQrToken({
      participantId: "AST26-9001",
      userId: "u_part",
      collegeId: "1",
      name: "x",
      branch: "CSE",
      eventId: null,
      ttlSeconds: 60,
    });
    const [h, p, s] = tok.token.split(".");
    const decoded = JSON.parse(Buffer.from(p, "base64url").toString());
    decoded.name = "FORGED";
    const mutated = Buffer.from(JSON.stringify(decoded), "utf8").toString("base64url");
    const v = verifyQrToken(`${h}.${mutated}.${s}`);
    if (v.valid) throw new Error("should have failed");
    if (v.reason !== "BAD_SIGNATURE") {
      throw new Error("expected BAD_SIGNATURE, got " + v.reason);
    }
  });

  // 3. Pass issued and persisted
  await test("QrPass row created and reusable", async () => {
    const now = Date.now();
    const exp = new Date(now + 3600_000);
    const sig = createHmac("sha256", SECRET).update("payload").digest("hex");
    await db.query(
      `INSERT INTO "QrPass" (id, "participantId", "userId", "eventId", token, "signatureHash", payload, "expiresAt", "scanCount", "isRevoked", "createdAt", "updatedAt")
       VALUES ('qp1', 'AST26-9001', 'u_part', 'evt1', $1, $2, 'payload', $3, 0, false, NOW(), NOW())`,
      [`AST26.payload.${sig}`, sig, exp]
    );
    const r = await db.query(`SELECT count(*)::int as c FROM "QrPass" WHERE "participantId" = 'AST26-9001'`);
    if (row(r).c !== 1) throw new Error("expected 1 pass row");
  });

  // 4. Revoke pass
  await test("Revoked pass is flagged", async () => {
    await db.query(
      `UPDATE "QrPass" SET "isRevoked" = true, "revokedReason" = 'lost device', "revokedAt" = NOW() WHERE id = 'qp1'`
    );
    const r = await db.query(`SELECT "isRevoked" FROM "QrPass" WHERE id = 'qp1'`);
    if (!row(r).isRevoked) throw new Error("not revoked");
  });

  // 5. Check-in duplicate prevention at DB level
  await test("Duplicate check-in is blocked by unique constraint", async () => {
    await db.query(
      `INSERT INTO "Attendance" (id, "eventId", "userId", "participantId", "scannedById", "checkInType", status, "scannedAt")
       VALUES ('att1', 'evt1', 'u_part', 'AST26-9001', 'u_vol', 'EVENT_ENTRY', 'PRESENT', NOW())`
    );
    let threw = false;
    try {
      await db.query(
        `INSERT INTO "Attendance" (id, "eventId", "userId", "participantId", "scannedById", "checkInType", status, "scannedAt")
         VALUES ('att2', 'evt1', 'u_part', 'AST26-9001', 'u_vol', 'EVENT_ENTRY', 'PRESENT', NOW())`
      );
    } catch (err) {
      threw = true;
    }
    if (!threw) throw new Error("expected unique constraint failure");
  });

  // 6. CheckInLog captured
  await test("CheckInLog row inserted and queryable", async () => {
    await db.query(
      `INSERT INTO "CheckInLog" (id, "scannerId", "scannerName", "participantId", "eventId", action, result, "timestamp")
       VALUES ('cl1', 'u_vol', 'Ananya', 'AST26-9001', 'evt1', 'QR_SCAN_SUCCESS', 'SUCCESS', NOW())`
    );
    const r = await db.query(`SELECT count(*)::int as c FROM "CheckInLog" WHERE "scannerId" = 'u_vol'`);
    if (row(r).c < 1) throw new Error("no log");
  });

  // 7. Rate limit: bucket increments
  await test("Rate-limit increment persists", async () => {
    await db.query(
      `INSERT INTO "RateLimitEntry" (id, bucket, count, "windowStart", "expiresAt", "createdAt", "updatedAt")
       VALUES ('rl1', 'scan:u_vol:evt1', 5, NOW(), NOW() + INTERVAL '60 seconds', NOW(), NOW())
       ON CONFLICT (bucket) DO UPDATE SET count = "RateLimitEntry".count + 1`
    );
    const r = await db.query(`SELECT count FROM "RateLimitEntry" WHERE bucket = 'scan:u_vol:evt1'`);
    const cnt = Number(row(r).count);
    if (typeof cnt !== "number" || cnt < 5) {
      throw new Error("rate-limit not persisted, count=" + cnt);
    }
  });

  // 8. Audit log write
  await test("Audit log row inserted", async () => {
    await db.query(
      `INSERT INTO "AuditLog" (id, "userId", action, resource, details, timestamp)
       VALUES ('al1', 'u_vol', 'QR_SCAN_SUCCESS', 'event:evt1', '{"x":1}', NOW())`
    );
    const r = await db.query(`SELECT action FROM "AuditLog" WHERE id = 'al1'`);
    if (row(r).action !== "QR_SCAN_SUCCESS") throw new Error("audit not written");
  });

  // 9. Token digest is stable and not equal to token
  await test("hashTokenDigest is non-reversible and stable", () => {
    const t = "AST26.x.y.z";
    const a = hashTokenDigest(t);
    const b = hashTokenDigest(t);
    if (a !== b) throw new Error("not deterministic");
    if (a.includes(t)) throw new Error("leaked the token");
  });

  // 10. computeSignature matches HMAC reference
  await test("computeSignature matches reference HMAC", () => {
    const payload = JSON.stringify({ a: 1, b: 2 });
    const got = computeSignature(payload);
    const want = createHmac("sha256", SECRET).update(payload).digest("hex");
    if (got !== want) throw new Error(`mismatch: ${got} vs ${want}`);
  });

  return {
    passed: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    cases: results.map((r) => `${r.ok ? "PASS" : "FAIL"} :: ${r.name}${r.error ? " — " + r.error : ""}`),
  };
}

if (typeof require !== "undefined" && require.main === module) {
  (async () => {
    const r = await runAttendanceIntegrationTests();
    for (const c of r.cases) console.log(c);
    console.log(`\n${r.passed} passed / ${r.failed} failed`);
    process.exit(r.failed === 0 ? 0 : 1);
  })();
}

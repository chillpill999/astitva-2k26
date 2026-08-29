import assert from "node:assert";
import { resolveUserRole } from "../lib/auth/clerk";
import { BranchEnum, ProfileFormSchema, BRANCH_METADATA } from "../lib/profile/schema";
import { isValidParticipantId } from "../lib/profile/id-generator";
import { generateInviteCode, normalizeInviteCode, validateInviteCode } from "../lib/teams/code-generator";
import { issueQrToken, verifyQrToken } from "../lib/qr/crypto";
import { signCertificate, verifyCertificateSignature } from "../lib/certificates/crypto";
import { formatRegistrationNumber, createRegistrationQRToken } from "../lib/events/utils";

let passCount = 0;
let failCount = 0;

function it(name: string, fn: () => void | Promise<void>) {
  try {
    const res = fn();
    if (res instanceof Promise) {
      res.then(() => { passCount++; console.log("PASS :: " + name); })
         .catch((err) => { failCount++; console.error("FAIL :: " + name + " -> " + err.message); });
    } else {
      passCount++;
      console.log("PASS :: " + name);
    }
  } catch (err: any) {
    failCount++;
    console.error("FAIL :: " + name + " -> " + err.message);
  }
}

async function runTests() {
  console.log("--------------------------------------------------------------------------------");
  console.log("ASTITVA 2K26 - Production Full-Stack Feature Verification");
  console.log("--------------------------------------------------------------------------------");

  // 1. AUTH & ROLE RESOLUTION
  it("Admin email aryanrockstar2007@gmail.com resolves to ADMIN role", () => {
    const role = resolveUserRole("aryanrockstar2007@gmail.com");
    assert.strictEqual(role, "ADMIN");
  });

  it("Regular student email resolves to PARTICIPANT role", () => {
    const role = resolveUserRole("student123@gmail.com");
    assert.strictEqual(role, "PARTICIPANT");
  });

  // 2. PROFILE & BRANCH OVERHAUL
  it("BranchEnum includes FPP and MC, excludes ECE", () => {
    const parsedFPP = BranchEnum.safeParse("FPP");
    const parsedMC = BranchEnum.safeParse("MC");
    const parsedECE = BranchEnum.safeParse("ECE");
    assert.strictEqual(parsedFPP.success, true);
    assert.strictEqual(parsedMC.success, true);
    assert.strictEqual(parsedECE.success, false);
  });

  it("BRANCH_METADATA has valid configurations for all 6 departments", () => {
    const keys = Object.keys(BRANCH_METADATA);
    assert.ok(keys.includes("CSE"));
    assert.ok(keys.includes("ME"));
    assert.ok(keys.includes("CE"));
    assert.ok(keys.includes("EE"));
    assert.ok(keys.includes("FPP"));
    assert.ok(keys.includes("MC"));
    assert.ok(!keys.includes("ECE"));
    assert.strictEqual(BRANCH_METADATA["FPP"].name, "Food Processing & Preservation");
    assert.strictEqual(BRANCH_METADATA["MC"].name, "Mathematics and Computing");
  });

  it("Participant ID validator recognizes AST26-XXXX format", () => {
    assert.strictEqual(isValidParticipantId("AST26-1001"), true);
    assert.strictEqual(isValidParticipantId("AST26-9999"), true);
    assert.strictEqual(isValidParticipantId("INVALID-123"), false);
  });

  it("ProfileFormSchema validates student registration with FPP branch", () => {
    const res = ProfileFormSchema.safeParse({
      fullName: "Pooja Kumari",
      collegeId: "24105128045",
      collegeName: "LNJPIT Chapra",
      branch: "FPP",
      semester: 4,
      phone: "9876543210",
      gender: "FEMALE",
      isHosteler: false,
      tshirtSize: "M",
    });
    assert.strictEqual(res.success, true);
  });

  // 3. EVENT REGISTRATION
  it("Registration number formatting produces AST26-REG-XXXXX", () => {
    const regNum = formatRegistrationNumber(10042);
    assert.strictEqual(regNum, "AST26-REG-10042");
  });

  it("Event QR Ticket token produces valid deterministic string", () => {
    const token = createRegistrationQRToken({
      eventId: "evt_cricket_01",
      userId: "usr_001",
      registrationNumber: "AST26-REG-00001",
    });
    assert.ok(token.startsWith("AST26.REG."));
  });

  // 4. TEAM REGISTRATION
  it("Unique invite code generates 6 uppercase alphanumeric chars", () => {
    const code = generateInviteCode();
    assert.strictEqual(code.length, 6);
    assert.strictEqual(validateInviteCode(code), true);
  });

  it("Invite code normalizer trims and uppercases input", () => {
    assert.strictEqual(normalizeInviteCode("  bg26x1  "), "BG26X1");
  });

  // 5. QR CODE GENERATION & CRYPTO
  it("HMAC SHA-256 QR Token issues and verifies successfully", () => {
    const { token } = issueQrToken({
      participantId: "AST26-1001",
      userId: "usr_1001",
      collegeId: "24105128032",
      name: "Aryan Kumar",
      branch: "CSE",
      eventId: null,
      ttlSeconds: 3600,
    });
    const result = verifyQrToken(token);
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.payload?.participantId, "AST26-1001");
  });

  it("Tampered QR token fails signature verification", () => {
    const { token } = issueQrToken({
      participantId: "AST26-1001",
      userId: "usr_1001",
      collegeId: "24105128032",
      name: "Aryan Kumar",
      branch: "CSE",
      eventId: null,
      ttlSeconds: 3600,
    });
    const parts = token.split(".");
    const tampered = parts[0] + "." + parts[1] + "." + parts[2].slice(0, -4) + "XXXX";
    const res = verifyQrToken(tampered);
    assert.strictEqual(res.valid, false);
  });

  // 6. CERTIFICATES ENGINE
  it("Cryptographic certificate signing and verification roundtrip", () => {
    const payload = {
      certificateNumber: "AST26-CRT-00001",
      recipientName: "Aditi Singh",
      participantId: "AST26-1002",
      eventName: "Solo Dance",
      category: "CULTURAL",
      position: "WINNER",
      issueDate: "2026-09-08",
    };
    const { signatureHash } = signCertificate(payload);
    assert.strictEqual(signatureHash.length, 64);
    const isValid = verifyCertificateSignature(payload, signatureHash);
    assert.strictEqual(isValid, true);
  });

  setTimeout(() => {
    console.log("--------------------------------------------------------------------------------");
    console.log("Production Features Test Suite: " + passCount + " passed / " + failCount + " failed");
    console.log("--------------------------------------------------------------------------------");
    if (failCount > 0) process.exit(1); else process.exit(0);
  }, 100);
}

runTests();
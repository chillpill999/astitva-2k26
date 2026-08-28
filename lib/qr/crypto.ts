// ============================================================================
// ASTITVA 2K26 - QR Pass Cryptographic Engine (HMAC-SHA256, JWT-style)
// Path: lib/qr/crypto.ts
// ============================================================================

import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { getJwtSecret } from "@/lib/auth/jwt";

const TOKEN_PREFIX = "AST26";
const TOKEN_VERSION = "1.0";

function base64UrlEncode(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return Buffer.from(base64, "base64").toString("utf8");
}

export interface QrPayload {
  participantId: string;
  userId: string;
  eventId: string | null;
  collegeId: string;
  name: string;
  branch: string;
  iat: number;
  exp: number;
  nonce: string;
  v: string;
}

export interface SignedToken {
  token: string;
  payload: QrPayload;
  signatureHex: string;
}

export interface VerificationResult {
  valid: boolean;
  payload?: QrPayload;
  error?: string;
  reason?:
    | "MALFORMED"
    | "BAD_SIGNATURE"
    | "EXPIRED"
    | "FUTURE_ISSUED"
    | "REVOKED"
    | "WRONG_VERSION";
}

const secretFromEnv = (): string => {
  const s =
    process.env.QR_ENCRYPTION_KEY ||
    process.env.QR_HMAC_SECRET ||
    getJwtSecret();
  return s;
};

function canonicalize(payload: QrPayload): string {
  // Canonical JSON: sorted keys, no whitespace, deterministic ordering
  const keys = Object.keys(payload).sort() as Array<keyof QrPayload>;
  const obj: Record<string, unknown> = {};
  for (const k of keys) obj[k as string] = payload[k];
  return JSON.stringify(obj);
}

export function computeSignature(canonicalPayload: string, secret?: string): string {
  const sec = secret ?? secretFromEnv();
  return createHmac("sha256", sec).update(canonicalPayload).digest("hex");
}

export function issueQrToken(params: {
  participantId: string;
  userId: string;
  collegeId: string;
  name: string;
  branch: string;
  eventId: string | null;
  ttlSeconds: number;
}): SignedToken {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + params.ttlSeconds;
  const payload: QrPayload = {
    participantId: params.participantId,
    userId: params.userId,
    eventId: params.eventId,
    collegeId: params.collegeId,
    name: params.name,
    branch: params.branch,
    iat: now,
    exp,
    nonce: randomBytes(8).toString("hex"),
    v: TOKEN_VERSION,
  };
  return signPayload(payload);
}

export function signPayload(payload: QrPayload, secret?: string): SignedToken {
  const canonical = canonicalize(payload);
  const signatureHex = computeSignature(canonical, secret);
  const token = `${TOKEN_PREFIX}.${base64UrlEncode(canonical)}.${signatureHex}`;
  return { token, payload, signatureHex };
}

export function verifyQrToken(token: string, secret?: string): VerificationResult {
  try {
    if (!token || typeof token !== "string") {
      return { valid: false, error: "Token missing", reason: "MALFORMED" };
    }
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false, error: "Token must have 3 segments", reason: "MALFORMED" };
    }
    const [prefix, payloadB64, signatureHex] = parts;
    if (prefix !== TOKEN_PREFIX) {
      return { valid: false, error: "Invalid token prefix", reason: "MALFORMED" };
    }
    if (!/^[0-9a-f]{64}$/i.test(signatureHex)) {
      return { valid: false, error: "Invalid signature length", reason: "MALFORMED" };
    }
    let payload: QrPayload;
    try {
      payload = JSON.parse(base64UrlDecode(payloadB64)) as QrPayload;
    } catch {
      return { valid: false, error: "Bad payload JSON", reason: "MALFORMED" };
    }
    if (!payload.participantId || !payload.userId || !payload.exp || !payload.iat) {
      return { valid: false, error: "Missing required payload fields", reason: "MALFORMED" };
    }
    if (payload.v !== TOKEN_VERSION) {
      return { valid: false, error: "Unsupported token version", reason: "WRONG_VERSION" };
    }
    const canonical = canonicalize(payload);
    const expected = computeSignature(canonical, secret);
    const sigBuf = Buffer.from(signatureHex, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return { valid: false, error: "Signature mismatch", reason: "BAD_SIGNATURE" };
    }
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return { valid: false, error: "Token expired", reason: "EXPIRED" };
    }
    if (payload.iat > now + 60) {
      return { valid: false, error: "Token issued in the future", reason: "FUTURE_ISSUED" };
    }
    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err?.message ?? "Verification crashed", reason: "MALFORMED" };
  }
}

export function hashTokenDigest(token: string): string {
  return createHmac("sha256", secretFromEnv())
    .update(token)
    .digest("hex")
    .slice(0, 32);
}

export function constantTimeEquals(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export const QR_TOKEN_VERSION = TOKEN_VERSION;

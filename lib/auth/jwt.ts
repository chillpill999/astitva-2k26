// ============================================================================
// ASTITVA 2K26 - Edge & Node Universal JWT Engine (HMAC-SHA256)
// Path: lib/auth/jwt.ts
// ============================================================================

import { JWTPayload, SessionUser } from "./types";

export const SESSION_COOKIE_NAME = "ast26_session";
export const DEFAULT_JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "astitva-2k26-super-secret-hmac-sha256-key-lnjpit-chapra-fest";
export const SESSION_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

export function getJwtSecret(): string {
  return (
    process.env.JWT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    DEFAULT_JWT_SECRET
  );
}

function base64UrlEncode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf8").toString("base64url");
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "base64url").toString("utf8");
  }
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return atob(base64);
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(buffer).toString("base64url");
  }
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToArrayBuffer(base64url: string): Uint8Array {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(base64url, "base64url"));
  }
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function signJWT(
  payload: Record<string, any>,
  secret: string = getJwtSecret(),
  expiresInSeconds: number = SESSION_EXPIRY_SECONDS
): Promise<string> {
  const enc = new TextEncoder();
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  } as JWTPayload;

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(fullPayload));
  const data = enc.encode(`${headerB64}.${payloadB64}`);

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, data);
  const signatureB64 = arrayBufferToBase64Url(signature);

  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

export async function verifyJWT<T = JWTPayload>(
  token: string,
  secret: string = getJwtSecret()
): Promise<T | null> {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const enc = new TextEncoder();
    const data = enc.encode(`${headerB64}.${payloadB64}`);

    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBytes = base64UrlToArrayBuffer(signatureB64);
    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes as any, data);
    if (!isValid) return null;

    const payload = JSON.parse(base64UrlDecode(payloadB64)) as JWTPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload as unknown as T;
  } catch {
    return null;
  }
}

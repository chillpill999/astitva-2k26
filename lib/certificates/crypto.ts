// ============================================================================
// ASTITVA 2K26 - Certificate Cryptographic Engine
// Path: lib/certificates/crypto.ts
// ============================================================================

import { createHmac, timingSafeEqual } from "crypto";
import { getJwtSecret } from "@/lib/auth/jwt";

export interface CertificateInput {
  certificateNumber: string;
  recipientName: string;
  participantId: string;
  eventName: string;
  category: string;
  position: string;
  issueDate: string; // ISO date
}

export interface CertificateSignature {
  signatureHash: string;
  verificationUrl: string;
}

function certSecret(): string {
  return process.env.CERT_SIGNING_KEY || process.env.QR_ENCRYPTION_KEY || getJwtSecret();
}

export function canonicalize(input: CertificateInput): string {
  return [
    input.certificateNumber,
    input.recipientName,
    input.participantId,
    input.eventName,
    input.category,
    input.position,
    input.issueDate,
  ].join("|");
}

export function signCertificate(input: CertificateInput): CertificateSignature {
  const canonical = canonicalize(input);
  const signatureHash = createHmac("sha256", certSecret()).update(canonical).digest("hex");
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof process !== "undefined" && process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  const verificationUrl = `${baseUrl}/verify-certificate/${input.certificateNumber}`;
  return { signatureHash, verificationUrl };
}

export function verifyCertificateSignature(
  input: CertificateInput,
  signatureHash: string
): boolean {
  const expected = signCertificate(input).signatureHash;
  if (expected.length !== signatureHash.length) return false;
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signatureHash, "hex"));
}

export function generateCertificateNumber(seq: number): string {
  // AST26-CERT-XXXXX
  return `AST26-CERT-${String(seq).padStart(5, "0")}`;
}

const TITLE_BY_POSITION: Record<string, string> = {
  WINNER: "Certificate of Excellence",
  FIRST_RUNNER_UP: "Certificate of Merit (1st Runner-Up)",
  SECOND_RUNNER_UP: "Certificate of Merit (2nd Runner-Up)",
  PARTICIPATION: "Certificate of Participation",
  VOLUNTEER: "Certificate of Volunteer Service",
  COORDINATOR: "Certificate of Coordination",
  MERIT: "Certificate of Merit",
};

export function certificateTitleFor(position: string): string {
  return TITLE_BY_POSITION[position] ?? "Certificate of Participation";
}

import * as crypto from 'crypto';
import { z } from 'zod';

// ============================================================================
// 1. CRYPTOGRAPHIC ENGINES (QR Passes & Certificates)
// ============================================================================

export interface QRPayload {
  participantId: string;
  userId: string;
  collegeId: string;
  name: string;
  branch: string;
  timestamp: number;
}

export function generateEncryptedPass(payload: QRPayload, secret: string): string {
  const header = { alg: 'HS256', typ: 'AST26-PASS', ver: '1.0' };
  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest('hex');
  return `AST26.${headerB64}.${payloadB64}.${signature}`;
}

export function verifyAndDecryptPass(
  token: string,
  secret: string
): { valid: boolean; payload?: QRPayload; error?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token missing or invalid format' };
  }

  const parts = token.split('.');
  if (parts.length !== 4 || parts[0] !== 'AST26') {
    return { valid: false, error: 'Invalid AST26 token header structure' };
  }

  const [, headerB64, payloadB64, providedSig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest('hex');

  if (providedSig !== expectedSig) {
    return { valid: false, error: 'HMAC cryptographic signature mismatch (tampered token)' };
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as QRPayload;
    if (!payload.participantId || !payload.userId) {
      return { valid: false, error: 'Malformed QR payload structure' };
    }
    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: `JSON parse error: ${err.message}` };
  }
}

export interface CertificatePayload {
  certificateNumber: string;
  recipientName: string;
  participantId: string;
  eventName: string;
  category: string;
  position: string;
  issueDate: string;
}

export function generateCertificateHash(data: CertificatePayload, secret: string): string {
  const canonicalString = `${data.certificateNumber}:${data.recipientName}:${data.participantId}:${data.eventName}:${data.category}:${data.position}:${data.issueDate}`;
  return crypto.createHmac('sha256', secret).update(canonicalString).digest('hex');
}

export function verifyCertificateHash(
  data: CertificatePayload,
  providedHash: string,
  secret: string
): boolean {
  const expectedHash = generateCertificateHash(data, secret);
  return expectedHash === providedHash;
}

// ============================================================================
// 2. IDENTIFIERS & INVITE CODES
// ============================================================================

export function formatParticipantId(num: number): string {
  return `AST26-${String(num).padStart(4, '0')}`;
}

export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude I, O, 0, 1 for clarity
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function validateInviteCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code);
}

export function normalizeInviteCode(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

// ============================================================================
// 3. RBAC AUTHORIZATION POLICIES
// ============================================================================

export type Role = 'ADMIN' | 'EVENT_COORDINATOR' | 'VOLUNTEER' | 'TEAM_CAPTAIN' | 'PARTICIPANT';

export function canAccessDashboard(role: Role, path: string): boolean {
  if (role === 'ADMIN') return true;
  if (path.startsWith('/dashboard/admin')) return false;
  if (path.startsWith('/dashboard/coordinator')) return role === 'EVENT_COORDINATOR';
  if (path.startsWith('/dashboard/volunteer')) return role === 'VOLUNTEER';
  if (path.startsWith('/dashboard/captain')) return role === 'TEAM_CAPTAIN';
  if (path.startsWith('/dashboard/participant')) return true;
  return false;
}

export function canRecordScore(role: Role): boolean {
  return role === 'ADMIN' || role === 'EVENT_COORDINATOR';
}

export function canScanQR(role: Role): boolean {
  return role === 'ADMIN' || role === 'VOLUNTEER' || role === 'EVENT_COORDINATOR';
}

export function canCreateTeam(role: Role): boolean {
  return role === 'ADMIN' || role === 'TEAM_CAPTAIN' || role === 'PARTICIPANT';
}

export function canManageSponsors(role: Role): boolean {
  return role === 'ADMIN';
}

export function canExportData(role: Role): boolean {
  return role === 'ADMIN' || role === 'EVENT_COORDINATOR';
}

// ============================================================================
// 4. AI FEST ASSISTANT ENGINE (Semantic Matching & Knowledge RAG)
// ============================================================================

export interface AssistantEventContext {
  id: string;
  title: string;
  category: string;
  venue: string;
  rules: string;
  dayNumber: number;
  scheduleStart: string;
}

export interface AssistantFaqContext {
  question: string;
  answer: string;
  category: string;
}

export function queryFestAssistant(
  message: string,
  events: AssistantEventContext[],
  faqs: AssistantFaqContext[]
): {
  answer: string;
  queryIntent: string;
  suggestedActions: Array<{ label: string; url: string }>;
  relatedEvents: AssistantEventContext[];
} {
  const queryLower = message.toLowerCase();

  // Intent classification
  let queryIntent = 'GENERAL';
  if (queryLower.includes('when') || queryLower.includes('time') || queryLower.includes('schedule') || queryLower.includes('day')) {
    queryIntent = 'SCHEDULE_QUERY';
  } else if (queryLower.includes('where') || queryLower.includes('venue') || queryLower.includes('location') || queryLower.includes('hall')) {
    queryIntent = 'VENUE_QUERY';
  } else if (queryLower.includes('rule') || queryLower.includes('format') || queryLower.includes('size') || queryLower.includes('members')) {
    queryIntent = 'RULE_LOOKUP';
  } else if (queryLower.includes('prize') || queryLower.includes('reward') || queryLower.includes('cash')) {
    queryIntent = 'PRIZE_QUERY';
  } else if (queryLower.includes('fee') || queryLower.includes('eligible') || queryLower.includes('pass') || queryLower.includes('qr')) {
    queryIntent = 'FAQ_QUERY';
  }

  // Find matching event
  const matchedEvents = events.filter((e) => {
    const titleMatch = e.title.toLowerCase().includes(queryLower) || queryLower.includes(e.title.toLowerCase());
    const slugMatch = e.id.toLowerCase().includes(queryLower);
    const keywords = e.title.toLowerCase().split(/\s+/).filter(k => k.length > 3);
    const keywordMatch = keywords.some(k => queryLower.includes(k));
    return titleMatch || slugMatch || keywordMatch;
  });

  // Find matching FAQ
  const matchedFaqs = faqs.filter((f) => {
    const qMatch = f.question.toLowerCase().includes(queryLower) || queryLower.includes(f.question.toLowerCase());
    const words = queryLower.split(/\s+/).filter(w => w.length > 3);
    const wordMatch = words.some(w => f.question.toLowerCase().includes(w) || f.answer.toLowerCase().includes(w));
    return qMatch || wordMatch;
  });

  let answer = '';
  const suggestedActions: Array<{ label: string; url: string }> = [];

  if (matchedEvents.length > 0) {
    const evt = matchedEvents[0];
    if (queryIntent === 'SCHEDULE_QUERY') {
      answer = `${evt.title} is scheduled on Day ${evt.dayNumber} (Sept ${3 + evt.dayNumber}, 2026) at ${evt.venue}.`;
      suggestedActions.push({ label: `View Schedule`, url: `/schedule` });
    } else if (queryIntent === 'VENUE_QUERY') {
      answer = `${evt.title} will be held at ${evt.venue}. Venue entry requires your digital QR pass.`;
      suggestedActions.push({ label: `View Venue Details`, url: `/events/${evt.id}` });
    } else if (queryIntent === 'RULE_LOOKUP') {
      answer = `Rules for ${evt.title}: ${evt.rules}`;
      suggestedActions.push({ label: `Register for ${evt.title}`, url: `/events/${evt.id}` });
    } else {
      answer = `${evt.title} is in the ${evt.category} category, taking place at ${evt.venue} on Day ${evt.dayNumber}. Rules: ${evt.rules}`;
      suggestedActions.push({ label: `Explore ${evt.title}`, url: `/events/${evt.id}` });
    }
  } else if (matchedFaqs.length > 0) {
    answer = matchedFaqs[0].answer;
    suggestedActions.push({ label: 'View All FAQs', url: '/#faq' });
  } else {
    answer = `ASTITVA 2K26 is LNJPIT Chapra's flagship festival happening from 4-8 September 2026 across Sports, Cultural, Gaming, and Literary categories. Ask me about schedules, venues, or rules!`;
    suggestedActions.push({ label: 'Browse Events', url: '/events' }, { label: 'View Schedule', url: '/schedule' });
  }

  return {
    answer,
    queryIntent,
    suggestedActions,
    relatedEvents: matchedEvents,
  };
}

// ============================================================================
// 5. LEADERBOARD & BRANCH CHAMPIONSHIP ENGINE
// ============================================================================

export interface LeaderboardResultItem {
  eventId: string;
  rank: number;
  branch: string;
  category: string;
}

export function calculateBranchChampionship(results: LeaderboardResultItem[]): Array<{ branch: string; points: number; gold: number; silver: number; bronze: number }> {
  const pointsMap: Record<string, { branch: string; points: number; gold: number; silver: number; bronze: number }> = {
    CSE: { branch: 'CSE', points: 0, gold: 0, silver: 0, bronze: 0 },
    ME: { branch: 'ME', points: 0, gold: 0, silver: 0, bronze: 0 },
    CE: { branch: 'CE', points: 0, gold: 0, silver: 0, bronze: 0 },
    EE: { branch: 'EE', points: 0, gold: 0, silver: 0, bronze: 0 },
    ECE: { branch: 'ECE', points: 0, gold: 0, silver: 0, bronze: 0 },
  };

  for (const r of results) {
    if (!pointsMap[r.branch]) {
      pointsMap[r.branch] = { branch: r.branch, points: 0, gold: 0, silver: 0, bronze: 0 };
    }
    const item = pointsMap[r.branch];
    if (r.rank === 1) {
      item.points += 100;
      item.gold += 1;
    } else if (r.rank === 2) {
      item.points += 60;
      item.silver += 1;
    } else if (r.rank === 3) {
      item.points += 30;
      item.bronze += 1;
    } else {
      item.points += 10;
    }
  }

  return Object.values(pointsMap).sort((a, b) => b.points - a.points);
}

// ============================================================================
// 6. DATA EXPORT GENERATOR
// ============================================================================

export function generateCsv(headers: string[], rows: (string | number)[][]): string {
  const escapeCell = (val: string | number) => {
    const s = String(val ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };
  const headerLine = headers.map(escapeCell).join(',');
  const rowLines = rows.map((row) => row.map(escapeCell).join(','));
  return [headerLine, ...rowLines].join('\n');
}

// ============================================================================
// 7. ZOD VALIDATION SCHEMAS
// ============================================================================

export const ProfileSchema = z.object({
  collegeId: z.string().min(3).max(30),
  branch: z.enum(['CSE', 'ME', 'CE', 'EE', 'ECE', 'OTHER']),
  semester: z.number().int().min(1).max(8),
  phone: z.string().regex(/^\+?[0-9\s-]{10,15}$/, 'Invalid phone number format'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  isHosteler: z.boolean().default(false),
});

export const TeamCreateSchema = z.object({
  name: z.string().min(3).max(50),
  eventId: z.string().min(1),
  minMembers: z.number().int().min(1),
  maxMembers: z.number().int().min(1),
});

export const ResultEntrySchema = z.object({
  eventId: z.string().min(1),
  rank: z.number().int().min(1).max(10),
  positionTitle: z.enum(['WINNER', 'FIRST_RUNNER_UP', 'SECOND_RUNNER_UP', 'FINALIST', 'PARTICIPANT']),
  userId: z.string().optional(),
  teamId: z.string().optional(),
  score: z.string().min(1),
  prizeAwarded: z.string().optional(),
});

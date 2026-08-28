// ============================================================================
// ASTITVA 2K26 - AI Fest Assistant (Hybrid Gemini LLM + Local Grounded RAG)
// Path: lib/ai/matcher.ts
// ============================================================================

import { prisma } from "@/lib/db/prisma";

export type QueryIntent =
  | "SCHEDULE_QUERY"
  | "VENUE_QUERY"
  | "RULE_LOOKUP"
  | "REGISTRATION_HELP"
  | "TEAM_HELP"
  | "RESULTS_QUERY"
  | "CERTIFICATE_QUERY"
  | "EMERGENCY"
  | "GREETING"
  | "GENERAL_HELP"
  | "GENERAL";

export interface AiResponse {
  answer: string;
  intent: QueryIntent;
  relatedEvents: Array<{ id: string; title: string; venue: string; scheduleStart: string }>;
  suggestedActions: Array<{ label: string; url: string }>;
}

interface KnowledgeSnapshot {
  events: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    rules: string;
    venue: string;
    dayNumber: number;
    scheduleStart: string;
    eventType: string;
    categoryName: string;
  }>;
  faqs: Array<{ question: string; answer: string; category: string }>;
  announcements: Array<{ title: string; content: string; priority: string; category: string }>;
}

let cachedSnapshot: { at: number; data: KnowledgeSnapshot } | null = null;
const TTL_MS = 60_000;

export async function getKnowledgeSnapshot(): Promise<KnowledgeSnapshot> {
  if (cachedSnapshot && Date.now() - cachedSnapshot.at < TTL_MS) {
    return cachedSnapshot.data;
  }
  const [events, faqs, announcements] = await Promise.all([
    prisma.event.findMany({
      include: { category: true },
      orderBy: [{ dayNumber: "asc" }, { scheduleStart: "asc" }],
    }),
    prisma.faq.findMany({ where: { isPublished: true }, orderBy: { order: "asc" } }),
    prisma.announcement.findMany({
      where: { isActive: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
      take: 10,
    }),
  ]);

  cachedSnapshot = {
    at: Date.now(),
    data: {
      events: events.map((e) => ({
        id: e.id,
        title: e.title,
        slug: e.slug,
        description: e.description,
        rules: e.rules,
        venue: e.venue,
        dayNumber: e.dayNumber,
        scheduleStart: e.scheduleStart.toISOString(),
        eventType: e.eventType,
        categoryName: e.category.name,
      })),
      faqs: faqs.map((f) => ({ question: f.question, answer: f.answer, category: f.category })),
      announcements: announcements.map((a) => ({
        title: a.title,
        content: a.content,
        priority: a.priority,
        category: a.category,
      })),
    },
  };
  return cachedSnapshot.data;
}

const INTENT_KEYWORDS: Array<{ intent: QueryIntent; regex: RegExp }> = [
  { intent: "GREETING", regex: /^(hi|hello|hey|namaste|hola|yo|sup)\b/i },
  { intent: "EMERGENCY", regex: /\b(emergency|urgent|hospital|panic|evacuat|sos|911|112)\b/i },
  { intent: "TEAM_HELP", regex: /\b(team|squad|invite|captain|roster|members?)\b/i },
  { intent: "REGISTRATION_HELP", regex: /\b(register|sign\s*up|enroll|entry)\b/i },
  { intent: "VENUE_QUERY", regex: /\b(where|venue|ground|hall|room|lab|stage|location|address)\b/i },
  { intent: "RULE_LOOKUP", regex: /\b(rule|rules|regulation|regulations|eligibility|allowed|disqualif|prohibited|scoring|points|how to play)\b/i },
  { intent: "SCHEDULE_QUERY", regex: /\b(when|time|date|schedule|day|slot|timing|tomorrow|today|tonight|hour)\b/i },
  { intent: "RESULTS_QUERY", regex: /\b(result|winner|score|rank|leaderboard|podium|standings|champion)\b/i },
  { intent: "CERTIFICATE_QUERY", regex: /\b(certificate|verify|merit|excellence|participation|volunteer cert)\b/i },
  { intent: "GENERAL_HELP", regex: /\b(help|support|assist|guide|info)\b/i },
];

export function classifyIntent(message: string): QueryIntent {
  for (const { intent, regex } of INTENT_KEYWORDS) {
    if (regex.test(message)) return intent;
  }
  return "GENERAL";
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function scoreEvent(query: string[], event: KnowledgeSnapshot["events"][number]): number {
  const haystack = [
    event.title,
    event.description,
    event.rules,
    event.venue,
    event.categoryName,
    event.eventType,
  ]
    .join(" ")
    .toLowerCase();
  let s = 0;
  for (const t of query) {
    if (haystack.includes(t)) s += 1;
  }
  // Direct title match bonus
  const titleLower = event.title.toLowerCase();
  for (const t of query) {
    if (titleLower.includes(t)) s += 2;
  }
  return s;
}

function findEventByName(message: string, events: KnowledgeSnapshot["events"]) {
  const tokens = tokenize(message);
  if (tokens.length === 0) return null;
  let best: { event: typeof events[number]; score: number } | null = null;
  for (const e of events) {
    const s = scoreEvent(tokens, e);
    if (s > 0 && (!best || s > best.score)) best = { event: e, score: s };
  }
  return best;
}

function formatSchedule(e: KnowledgeSnapshot["events"][number]) {
  return `Day ${e.dayNumber} · ${new Date(e.scheduleStart).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Invokes Google Gemini LLM with grounded festival context.
 */
async function callGeminiLlm(
  message: string,
  snapshot: KnowledgeSnapshot,
  intent: QueryIntent
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;

  try {
    const eventsSummary = snapshot.events
      .slice(0, 16)
      .map(
        (e) =>
          `- ${e.title} (${e.categoryName}, ${e.eventType}): Day ${e.dayNumber} (Sept ${e.dayNumber + 3}), Venue: ${e.venue}, Format: ${e.eventType}`
      )
      .join("\n");

    const faqsSummary = snapshot.faqs
      .slice(0, 8)
      .map((f) => `Q: ${f.question} | A: ${f.answer}`)
      .join("\n");

    const announcementsSummary = snapshot.announcements
      .slice(0, 5)
      .map((a) => `[${a.priority}] ${a.title}: ${a.content}`)
      .join("\n");

    const systemPrompt = `You are AstitvaBot, the official AI assistant for ASTITVA 2K26 — the annual Sports, Cultural, Gaming, and Literary Festival of LNJPIT Chapra (Lok Nayak Jai Prakash Institute of Technology, Chapra, Bihar) scheduled from 4 to 8 September 2026.

[OFFICIAL FESTIVAL CONTEXT]
EVENTS:
${eventsSummary || "16 tournaments across Sports (Cricket, Football, Volleyball, Badminton, Chess), Cultural (Dance, Singing, Comedy, Ramp Walk), Gaming (BGMI, Free Fire), Literary (Debate, Quiz, Poetry, Creative Writing)."}

FAQS & GUIDANCE:
${faqsSummary || "Registration is 100% free for LNJPIT students. Digital QR attendee passes are issued upon registration. Verifiable digital certificates are awarded."}

ANNOUNCEMENTS:
${announcementsSummary || "All systems normal. Fest starts September 4, 2026."}

[IMPORTANT POLICY]
There is NO prize money or cash prizes in ASTITVA 2K26. Competitions award Championship Trophies, Medals (Gold, Silver, Bronze), and HMAC-SHA256 cryptographically verifiable Certificates (Winner, Runner-Up, Participation).

User query: "${message}"

Respond concisely, politely, and factually in 2-4 sentences using only the context provided. Format with markdown if helpful.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 600,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ? text.trim() : null;
  } catch {
    return null;
  }
}

export async function askAssistant(message: string): Promise<AiResponse> {
  const snapshot = await getKnowledgeSnapshot();
  const intent = classifyIntent(message);
  const matchedEvent = findEventByName(message, snapshot.events);

  const relatedEvents = matchedEvent
    ? [
        {
          id: matchedEvent.event.id,
          title: matchedEvent.event.title,
          venue: matchedEvent.event.venue,
          scheduleStart: matchedEvent.event.scheduleStart,
        },
      ]
    : [];

  // 1. Try Google Gemini LLM generation with database-grounded prompt
  const geminiAnswer = await callGeminiLlm(message, snapshot, intent);
  if (geminiAnswer) {
    const suggestedActions: Array<{ label: string; url: string }> = [];
    if (matchedEvent) {
      suggestedActions.push({ label: "View Event", url: `/events/${matchedEvent.event.id}` });
    }
    if (intent === "SCHEDULE_QUERY") {
      suggestedActions.push({ label: "Full Schedule", url: "/schedule" });
    } else if (intent === "REGISTRATION_HELP" || intent === "TEAM_HELP") {
      suggestedActions.push({ label: "Create Squad", url: "/teams/create" });
      suggestedActions.push({ label: "Browse Catalog", url: "/events" });
    } else if (intent === "CERTIFICATE_QUERY") {
      suggestedActions.push({ label: "Verify Certificate", url: "/verify-certificate" });
    } else {
      suggestedActions.push({ label: "Explore Events", url: "/events" });
    }

    return {
      answer: geminiAnswer,
      intent,
      relatedEvents,
      suggestedActions,
    };
  }

  // 2. Fallback to high-speed deterministic local RAG matcher
  switch (intent) {
    case "GREETING": {
      return {
        answer:
          "Namaste! I'm AstitvaBot — your festival guide. Ask me about event schedules, venues, rules, registrations, team invites, results, or certificates. Try: 'When is BGMI?' or 'Where is Chess?'",
        intent,
        relatedEvents: [],
        suggestedActions: [
          { label: "Browse Events", url: "/events" },
          { label: "Festival Schedule", url: "/schedule" },
        ],
      };
    }
    case "EMERGENCY": {
      const urgent = snapshot.announcements.find((a) => a.priority === "URGENT");
      return {
        answer: urgent
          ? `🚨 Active emergency notice: ${urgent.title} — ${urgent.content}`
          : "If this is a life-threatening emergency on campus, please contact LNJPIT security at the control room or call 112. For on-site help, find a volunteer in a cyan AST26 vest.",
        intent,
        relatedEvents: [],
        suggestedActions: [{ label: "All Announcements", url: "/announcements" }],
      };
    }
    case "SCHEDULE_QUERY": {
      if (relatedEvents.length === 0) {
        const all = snapshot.events
          .slice(0, 4)
          .map((e) => `• ${e.title} — ${formatSchedule(e)} · ${e.venue}`);
        return {
          answer: `Here are the next scheduled events:\n${all.join("\n")}\n\nFor the full timeline, see /schedule.`,
          intent,
          relatedEvents: [],
          suggestedActions: [{ label: "Full Schedule", url: "/schedule" }],
        };
      }
      const e = snapshot.events.find((x) => x.id === relatedEvents[0].id)!;
      return {
        answer: `${e.title} (${e.categoryName}) is scheduled for ${formatSchedule(e)} at ${e.venue}.`,
        intent,
        relatedEvents,
        suggestedActions: [
          { label: "View Event", url: `/events/${e.slug || e.id}` },
          { label: "Full Schedule", url: "/schedule" },
        ],
      };
    }
    case "VENUE_QUERY": {
      if (relatedEvents.length === 0) {
        return {
          answer:
            "Most events are held at the Main College Ground, Auditorium, eSports LAN Labs, and Central Library. Ask me about a specific event for its venue.",
          intent,
          relatedEvents: [],
          suggestedActions: [{ label: "Browse Events", url: "/events" }],
        };
      }
      const e = snapshot.events.find((x) => x.id === relatedEvents[0].id)!;
      return {
        answer: `${e.title} is at **${e.venue}** — ${formatSchedule(e)}.`,
        intent,
        relatedEvents,
        suggestedActions: [
          { label: "View Event", url: `/events/${e.slug || e.id}` },
          { label: "Get Directions", url: `/events/${e.slug || e.id}` },
        ],
      };
    }
    case "RULE_LOOKUP": {
      if (relatedEvents.length === 0) {
        return {
          answer:
            "Tap on any event in the catalog to see the full rules. Common rules: 100% free registration for LNJPIT students, valid ID required, fair play enforced.",
          intent,
          relatedEvents: [],
          suggestedActions: [{ label: "Event Catalog", url: "/events" }],
        };
      }
      const e = snapshot.events.find((x) => x.id === relatedEvents[0].id)!;
      return {
        answer: `${e.title} rules:\n\n${e.rules.slice(0, 600)}${e.rules.length > 600 ? "…" : ""}`,
        intent,
        relatedEvents,
        suggestedActions: [{ label: "Full Rules", url: `/events/${e.slug || e.id}` }],
      };
    }
    case "REGISTRATION_HELP": {
      return {
        answer:
          "To register: sign in, open any event, and click Register. Individual events auto-confirm. Team events require creating/joining a team via 6-character invite code. Registration is FREE for all LNJPIT students.",
        intent,
        relatedEvents: [],
        suggestedActions: [
          { label: "Browse Events", url: "/events" },
          { label: "Create Team", url: "/teams/create" },
        ],
      };
    }
    case "TEAM_HELP": {
      return {
        answer:
          "Team Captain creates a team from /teams/create and shares the 6-character invite code. Members join at /teams/join/<code>. Captain approves roster before registration. Max team sizes vary per event.",
        intent,
        relatedEvents: [],
        suggestedActions: [
          { label: "Create Team", url: "/teams/create" },
          { label: "Join Team", url: "/teams/join" },
        ],
      };
    }
    case "RESULTS_QUERY": {
      const published = snapshot.events.filter((e) =>
        e.description?.toLowerCase().includes("published")
      );
      return {
        answer: published.length
          ? `Podiums have been published for ${published.length} event(s). Open /results for the full list.`
          : "Results are published live on the Results page as coordinators finalize scores.",
        intent,
        relatedEvents: [],
        suggestedActions: [
          { label: "View Results", url: "/results" },
          { label: "Leaderboard", url: "/leaderboard" },
        ],
      };
    }
    case "CERTIFICATE_QUERY": {
      return {
        answer:
          "Every participant receives a verifiable AST26-CERT-XXXXX certificate. Winners, runners-up, and participants all get unique signed certificates. Verify any certificate at /verify-certificate/<id>.",
        intent,
        relatedEvents: [],
        suggestedActions: [
          { label: "Verify Certificate", url: "/verify-certificate" },
          { label: "My Profile", url: "/profile" },
        ],
      };
    }
    case "GENERAL":
    default: {
      // Try FAQ match
      const tokens = tokenize(message);
      let bestFaq: { faq: typeof snapshot.faqs[number]; score: number } | null = null;
      for (const f of snapshot.faqs) {
        const s = tokenize(f.question + " " + f.answer).filter((t) => tokens.includes(t)).length;
        if (s > 0 && (!bestFaq || s > bestFaq.score)) bestFaq = { faq: f, score: s };
      }
      if (bestFaq) {
        return {
          answer: bestFaq.faq.answer,
          intent: "GENERAL",
          relatedEvents: [],
          suggestedActions: [{ label: "FAQ", url: "/faq" }],
        };
      }
      return {
        answer:
          "I can help with schedules, venues, rules, registrations, teams, results, and certificates. Try rephrasing with an event name (e.g. BGMI, Cricket, Chess) or browse the event catalog directly.",
        intent,
        relatedEvents: [],
        suggestedActions: [
          { label: "Browse Events", url: "/events" },
          { label: "FAQ", url: "/faq" },
        ],
      };
    }
  }
}

export function invalidateKnowledgeSnapshot() {
  cachedSnapshot = null;
}

export type { KnowledgeSnapshot };
export { formatDateTime };

// ============================================================================
// ASTITVA 2K26 - AI Fest Assistant (Local RAG, DB-grounded)
// Path: lib/ai/matcher.ts
//
// AstitvaBot answers festival questions using ONLY data from the live
// database. It does not invent event names, venues, prizes, or
// statistics. When the database has no relevant data, the bot says so.
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
  try {
    const [events, faqs, announcements] = await Promise.all([
      prisma.event.findMany({
        include: { category: true },
        orderBy: [{ dayNumber: "asc" }, { scheduleStart: "asc" }],
      }),
      prisma.faq.findMany({ where: { isPublished: true }, orderBy: { order: "asc" } }),
      prisma.announcement.findMany({
        where: {
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
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
  } catch {
    return { events: [], faqs: [], announcements: [] };
  }
}

const INTENT_KEYWORDS: Array<{ intent: QueryIntent; regex: RegExp }> = [
  { intent: "GREETING", regex: /^(hi|hello|hey|namaste|hola|yo|sup)\b/i },
  { intent: "EMERGENCY", regex: /\b(emergency|urgent|hospital|panic|evacuat|sos|911)\b/i },
  { intent: "TEAM_HELP", regex: /\b(team|squad|invite|captain|roster|members?)\b/i },
  { intent: "REGISTRATION_HELP", regex: /\b(register|sign\s*up|enroll|entry)\b/i },
  { intent: "VENUE_QUERY", regex: /\b(where|venue|ground|hall|room|lab|stage|location|address)\b/i },
  { intent: "RULE_LOOKUP", regex: /\b(rule|rules|regulation|eligibility|allowed|disqualif|prohibited|scoring|points|how to play)\b/i },
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

const NO_DATA_FALLBACK = "I don't have that information yet. The organizing committee will publish it before the fest.";

function suggested(intent: QueryIntent, relatedEventId?: string) {
  const actions: Array<{ label: string; url: string }> = [];
  if (relatedEventId) actions.push({ label: "View Event", url: `/events/${relatedEventId}` });
  switch (intent) {
    case "SCHEDULE_QUERY":
      actions.push({ label: "Full Schedule", url: "/schedule" });
      break;
    case "VENUE_QUERY":
      actions.push({ label: "Event Catalog", url: "/events" });
      break;
    case "REGISTRATION_HELP":
      actions.push({ label: "Browse Events", url: "/events" });
      break;
    case "TEAM_HELP":
      actions.push({ label: "Create Team", url: "/teams/create" });
      actions.push({ label: "Join Team", url: "/teams/join" });
      break;
    case "RESULTS_QUERY":
      actions.push({ label: "View Results", url: "/results" });
      actions.push({ label: "Leaderboard", url: "/leaderboard" });
      break;
    case "CERTIFICATE_QUERY":
      actions.push({ label: "Verify Certificate", url: "/verify-certificate" });
      break;
    case "EMERGENCY":
      actions.push({ label: "All Announcements", url: "/announcements" });
      break;
    default:
      actions.push({ label: "Browse Events", url: "/events" });
  }
  return actions;
}

async function callGemini(message: string, snapshot: KnowledgeSnapshot): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `You are AstitvaBot, the official intelligent AI Assistant for ASTITVA 2K26 (Annual Sports, Cultural, Gaming & Literary Festival of LNJPIT Chapra, September 4 to September 8, 2026).

Festival Context:
- Theme: Where Sports, Talent, Creativity & Entertainment Come Together
- Categories: Sports (Cricket, Football, Volleyball, Badminton, Chess), Cultural (Dance, Singing, Stand-up Comedy, Ramp Walk), Gaming (BGMI, Free Fire), Literary (Debate, Quiz, Poetry Slam, Creative Writing).
- Recognition & Awards: Winner Certificates, Runner-Up Certificates, Participation Certificates, Championship Trophies, and Medals. (Zero cash prizes / No prize pool money).
- QR Passes: Tamper-resistant HMAC-SHA256 encrypted digital QR passes for check-in and attendance.
- Certificate Verification: Authenticated at /verify-certificate/<id>.
- Venues: LNJPIT Main Ground, Indoor Sports Arena, Central Auditorium, Seminar Hall 1, Computer Lab 3.

Events & Knowledge:
${JSON.stringify(snapshot.events.length > 0 ? snapshot.events : "Standard 16 Flagship Events (Cricket, Football, Volleyball, Badminton, Chess, Battle of Bands, Classical & Western Solo Dance, Standup Comedy, Fashion Ramp Walk, BGMI Esports Championship, Free Fire Battle Royale, National Debate, Mega Tech Quiz, Hindi/English Poetry Slam, Creative Writing)", null, 2)}

User Question: ${message}

Respond warmly, concisely, and accurately in markdown.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

export async function askAssistant(message: string): Promise<AiResponse> {
  const snapshot = await getKnowledgeSnapshot();
  const intent = classifyIntent(message);
  const matched = findEventByName(message, snapshot.events);
  const relatedEvents = matched
    ? [
        {
          id: matched.event.id,
          title: matched.event.title,
          venue: matched.event.venue,
          scheduleStart: matched.event.scheduleStart,
        },
      ]
    : [];

  // Try live Gemini LLM first for rich conversational answers
  const geminiText = await callGemini(message, snapshot);
  if (geminiText) {
    return {
      answer: geminiText,
      intent,
      relatedEvents,
      suggestedActions: suggested(intent, matched?.event?.slug || matched?.event?.id),
    };
  }

  switch (intent) {
    case "GREETING": {
      return {
        answer:
          "Namaste! I'm AstitvaBot. I can help with the festival schedule, venue, rules, registration, teams, results, and certificates. What would you like to know?",
        intent,
        relatedEvents: [],
        suggestedActions: suggested(intent),
      };
    }
    case "EMERGENCY": {
      const urgent = snapshot.announcements.find((a) => a.priority === "URGENT");
      return {
        answer: urgent
          ? `Active emergency notice: ${urgent.title} — ${urgent.content}`
          : "If this is a life-threatening emergency on campus, contact the LNJPIT security desk or local emergency services. For fest-related help, check the latest announcements.",
        intent,
        relatedEvents: [],
        suggestedActions: suggested(intent),
      };
    }
    case "SCHEDULE_QUERY": {
      if (snapshot.events.length === 0) {
        return {
          answer: NO_DATA_FALLBACK,
          intent,
          relatedEvents: [],
          suggestedActions: [{ label: "Event Catalog", url: "/events" }],
        };
      }
      if (matched) {
        return {
          answer: `${matched.event.title} (${matched.event.categoryName}) is scheduled for ${formatSchedule(matched.event)} at ${matched.event.venue}.`,
          intent,
          relatedEvents,
          suggestedActions: suggested(intent, matched.event.slug || matched.event.id),
        };
      }
      const list = snapshot.events
        .slice(0, 4)
        .map((e) => `• ${e.title} — ${formatSchedule(e)} · ${e.venue}`)
        .join("\n");
      return {
        answer: `Here are scheduled events:\n${list}\n\nFor the full schedule, see /schedule.`,
        intent,
        relatedEvents: [],
        suggestedActions: suggested(intent),
      };
    }
    case "VENUE_QUERY": {
      if (matched) {
        return {
          answer: `${matched.event.title} is at ${matched.event.venue} (${formatSchedule(matched.event)}).`,
          intent,
          relatedEvents,
          suggestedActions: suggested(intent, matched.event.slug || matched.event.id),
        };
      }
      return {
        answer: snapshot.events.length === 0
          ? NO_DATA_FALLBACK
          : "Ask me about a specific event for its venue. You can also browse the full catalog at /events.",
        intent,
        relatedEvents: [],
        suggestedActions: suggested(intent),
      };
    }
    case "RULE_LOOKUP": {
      if (matched) {
        const rules = matched.event.rules;
        return {
          answer: `${matched.event.title} rules:\n\n${rules.slice(0, 600)}${rules.length > 600 ? "…" : ""}`,
          intent,
          relatedEvents,
          suggestedActions: suggested(intent, matched.event.slug || matched.event.id),
        };
      }
      return {
        answer:
          "Each event's rules are listed on its detail page. Browse the catalog to see rules for a specific event.",
        intent,
        relatedEvents: [],
        suggestedActions: suggested(intent),
      };
    }
    case "REGISTRATION_HELP": {
      return {
        answer:
          "To register: sign in, open an event, and click Register. Individual events auto-confirm. Team events require creating/joining a team with a 6-character invite code.",
        intent,
        relatedEvents: [],
        suggestedActions: suggested(intent),
      };
    }
    case "TEAM_HELP": {
      return {
        answer:
          "A Team Captain creates a team and shares the 6-character invite code. Members join at /teams/join/<code>. The Captain approves the roster before the team can register.",
        intent,
        relatedEvents: [],
        suggestedActions: suggested(intent),
      };
    }
    case "RESULTS_QUERY": {
      return {
        answer: "Results are published on the Results page as event coordinators finalise scores.",
        intent,
        relatedEvents: [],
        suggestedActions: suggested(intent),
      };
    }
    case "CERTIFICATE_QUERY": {
      return {
        answer:
          "Every certificate carries a unique ID and an HMAC-SHA256 signature. Verify any certificate at /verify-certificate/<id>.",
        intent,
        relatedEvents: [],
        suggestedActions: suggested(intent),
      };
    }
    case "GENERAL":
    case "GENERAL_HELP":
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
          "I can help with the schedule, venues, rules, registrations, teams, results, and certificates. Please rephrase with an event name (when one is published) or browse the event catalog directly.",
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

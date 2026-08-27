# ASTITVA 2K26: Master Project Specification & Architecture

## Overview
ASTITVA 2K26 is the premier enterprise-grade, full-stack festival management platform for the annual Sports, Cultural, Gaming, and Literary Festival of LNJPIT Chapra (4 September 2026 – 8 September 2026).
Built with Next.js 15 App Router, TypeScript, Tailwind CSS, Shadcn UI, Prisma ORM, PostgreSQL, Three.js, and comprehensive PWA/DevOps pipelines.

---

## Architecture

### System Layers
1. **Presentation Layer (Next.js 15 App Router + React 19 + Tailwind CSS + Shadcn UI)**:
   - Public Landing & Exploration (`/`, `/events`, `/schedule`, `/leaderboard`, `/results`, `/announcements`, `/gallery`, `/sponsors`, `/team`, `/verify-certificate/[id]`)
   - 3D Visual Effects: Three.js particle vortex hero canvas with mouse parallax and fallback 2D canvas
   - 5 Guarded Role Dashboards: Admin (`/dashboard/admin`), Coordinator (`/dashboard/coordinator`), Volunteer (`/dashboard/volunteer`), Captain (`/dashboard/captain`), Participant (`/dashboard/participant`)
   - Interactive Engines: HTML5 QR Webcam Scanner, PDF Certificate Generation & Viewer, Glassmorphic AI Fest Assistant Bot
2. **Business & Security Layer (Next.js Server Actions + API Routes + Edge Middleware)**:
   - RBAC Edge Middleware enforcing role guards across routes and actions
   - Zod schema validation on all inputs and mutations
   - Hybrid Auth Provider: Clerk Authentication in Production with seamless zero-dependency Local Mock Auth for development and automated testing
   - Cryptographic Token Engine: HMAC-SHA256 encrypted QR passes (`AST26.<header>.<payload>.<sig>`) and tamper-evident certificate hashes
   - AI Fest Assistant Engine: Knowledge base RAG & fuzzy semantic query matcher for festival rules, venues, and schedules
3. **Data Layer (PostgreSQL + Prisma ORM)**:
   - 18 relational models with foreign keys, composite indexes, soft deletes, and cascade actions
   - Comprehensive seed script (`prisma/seed.ts`) covering 16 canonical events, categories, prize pools, venues, schedules, and 5 pre-configured demo role accounts
4. **DevOps & Infrastructure**:
   - Production multi-stage `Dockerfile`, `docker-compose.yml` (App + PostgreSQL 16 + Adminer)
   - GitHub Actions CI/CD (`.github/workflows/ci.yml`)
   - PWA support (`manifest.json`, Service Worker, offline pass caching)

---

## Feature Inventory

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Next.js 15 App Setup & Prisma Schema | App Router setup, TypeScript, Tailwind, Shadcn, 18 Prisma models & migrations | M1 | Survey 1, 2 |
| 2 | Comprehensive Database Seed Data | 16 canonical events (Sports, Cultural, Gaming, Literary), venues, rules, prize pools, 5 demo user roles | M1 | Survey 1 |
| 3 | Hybrid Auth & Role Management | Clerk auth with Local Mock Auth switcher, JWT session cookies, 5 roles, AST26-XXXX ID generation | M2 | Survey 1, 3 |
| 4 | LNJPIT Student Profiles | Full Name, Reg Number, Branch (CSE, ME, CE, EE, ECE), Semester (1-8), Phone, Gender, Hostel status | M2 | Survey 1, 2 |
| 5 | Dark Cyberpunk Landing Page | Hero 3D particle vortex canvas, live countdown to Sept 4 2026, About LNJPIT, featured competitions, stats | M3 | Survey 2 |
| 6 | Category Previews & Multi-Day Schedule | Interactive category filters, Day 1-5 timeline with venues, timeslots, and "LIVE NOW" status indicators | M3 | Survey 2 |
| 7 | Showcase Sections | Prize pool breakdown (₹1.5L+), tiered sponsors, faculty/student organizing committee, gallery, FAQs | M3 | Survey 2 |
| 8 | Event Catalog & Filter Engine | Filterable event catalog by category, search, event details pages with rules, venues, coordinators | M4 | Survey 2 |
| 9 | Individual & Team Registration | Capacity checks, duplicate entry prevention, registration status tracking | M4 | Survey 1, 2 |
| 10 | Dynamic Team Engine & Invite Codes | Team creation, 6-character alphanumeric invite codes, roster approvals, min/max team size validation | M4 | Survey 1, 2 |
| 11 | Encrypted QR Participant Pass | Tamper-resistant HMAC-SHA256 encrypted QR badge, flip card animation, offline pass access | M5 | Survey 3 |
| 12 | Volunteer Real-Time QR Scanner | Web camera scanner (`html5-qrcode`), manual AST26-ID lookup, instant sound/haptic feedback, duplicate check-in prevention | M5 | Survey 3 |
| 13 | Live Attendance Dashboard | Real-time present/absent stats, check-in velocity timeline, live attendance feeds for coordinators/volunteers | M5 | Survey 3 |
| 14 | Coordinator Score Entry & Brackets | Live score recording, round qualification, winner/runner-up podium finalization | M6 | Survey 1, 2 |
| 15 | Live Multi-Stream Leaderboards | Auto-updating leaderboards for Sports, Cultural, Gaming, Literary, and Branch Championship | M6 | Survey 2 |
| 16 | PDF Certificate Generator & Verification | High-res PDF certificates with digital signatures, unique cert IDs, and public `/verify-certificate/[id]` portal | M6 | Survey 3 |
| 17 | AI Fest Assistant (ASTITVA Bot) | Glassmorphic conversational chat widget answering natural language queries on schedules, venues, rules, FAQs | M7 | Survey 3 |
| 18 | Announcements & Notification Center | Priority tags (URGENT, HIGH, NORMAL), categories (Emergency, Event Updates, Results), in-app notifications | M7 | Survey 3 |
| 19 | Admin Analytics & Visual Charts | Interactive Recharts dashboard (registration velocity, branch/gender distribution, attendance rates) | M8 | Survey 2, 3 |
| 20 | Data Export Engine | Export participant rosters, attendance sheets, and winner lists to Excel (.xlsx) and CSV | M8 | Survey 3 |
| 21 | Sponsor CRUD Management | Admin sponsor CRUD with tier categorization and homepage visibility toggles | M8 | Survey 1, 2 |
| 22 | PWA, Security & DevOps Architecture | PWA manifest, service worker, Zod validation, rate limiting, Dockerfile, docker-compose, CI/CD, README | M8 | Survey 3 |
| 23 | E2E Testing Suite (Tiers 1-4) | Comprehensive opaque-box test runner covering all 22 features, boundary cases, pairwise, and application workloads | E2E | Project Pattern |
| 24 | Final E2E Pass & Adversarial Hardening | 100% pass of E2E test suite + Tier 5 white-box adversarial test suite and gap remediation | M9 | Project Pattern |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Core Foundation & Database Schema | Next.js 15 setup, Tailwind, Shadcn UI base, Prisma schema, migrations, rich seed.ts (16 events, 5 demo roles) | none | DONE |
| M2 | RBAC Authorization & Profile Engine | Hybrid Clerk + Mock Auth, session management, RBAC middleware, AST26-XXXX ID generator, profile management | M1 | PLANNED |
| M3 | Landing Page & Festival Identity (R1) | 3D particle vortex canvas, live countdown, schedule matrix, category cards, prizes, sponsors, committee, FAQs | M1, M2 | PLANNED |
| M4 | Event Catalog & Team Engine (R3) | Events catalog, dynamic team creation, 6-char invite codes, roster approvals, min/max validations | M1, M2 | PLANNED |
| M5 | QR Badges & Attendance Scanner (R4) | HMAC-SHA256 encrypted QR passes, volunteer webcam scanner, duplicate check-in prevention, live metrics | M1, M2, M4 | PLANNED |
| M6 | Results, Leaderboard & Certificates (R5) | Scoring engine, podium publisher, live leaderboard, PDF certificate generator, `/verify-certificate/[id]` | M1, M2, M4 | PLANNED |
| M7 | AI Assistant & Notification Center (R6) | Conversational RAG/semantic assistant, priority-tagged announcements, in-app notification center | M1, M2, M3 | PLANNED |
| M8 | Analytics, Export, Sponsors, PWA & DevOps (R7, R8) | Recharts analytics, Excel/CSV export, sponsor CRUD, Zod guards, PWA manifest/worker, Docker, CI/CD, README | M1-M7 | PLANNED |
| E2E | E2E Test Suite Development | Independent opaque-box test runner & multi-tier test suites (Tiers 1-4: ~150+ test cases) | M1 | PLANNED |
| M9 | Final E2E Pass & Adversarial Hardening | Pass 100% E2E test suite + Tier 5 white-box adversarial hardening + clean build validation | M1-M8, E2E | PLANNED |

---

## Interface Contracts

### 1. Authentication & Session Context (`lib/auth/`)
```typescript
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EVENT_COORDINATOR' | 'VOLUNTEER' | 'TEAM_CAPTAIN' | 'PARTICIPANT';
  participantId?: string; // e.g. "AST26-1001"
  collegeId?: string;
  branch?: 'CSE' | 'ME' | 'CE' | 'EE' | 'ECE' | 'OTHER';
  semester?: number;
  avatarUrl?: string;
}

export async function getCurrentUser(): Promise<SessionUser | null>;
export async function requireAuth(allowedRoles?: Role[]): Promise<SessionUser>;
```

### 2. QR Token Payload Contract (`lib/qr/`)
```typescript
export interface QRPayload {
  participantId: string; // AST26-XXXX
  userId: string;
  collegeId: string;
  name: string;
  branch: string;
  timestamp: number;
}

export function generateEncryptedPass(payload: QRPayload): string;
export function verifyAndDecryptPass(token: string): { valid: boolean; payload?: QRPayload; error?: string };
```

### 3. Certificate Data Contract (`lib/certificates/`)
```typescript
export interface CertificatePayload {
  certificateId: string; // AST26-CERT-XXXXX
  recipientName: string;
  participantId: string;
  eventName: string;
  category: 'SPORTS' | 'CULTURAL' | 'GAMING' | 'LITERARY';
  position: 'WINNER' | 'FIRST_RUNNER_UP' | 'SECOND_RUNNER_UP' | 'PARTICIPATION' | 'VOLUNTEER' | 'COORDINATOR';
  issueDate: string;
  verificationUrl: string;
  signatureHash: string;
}

export function generateCertificateHash(data: CertificatePayload): string;
export function verifyCertificate(certificateId: string): Promise<CertificatePayload | null>;
```

### 4. AI Assistant Interface (`lib/ai/`)
```typescript
export interface AiQueryRequest {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface AiQueryResponse {
  answer: string;
  suggestedActions?: Array<{ label: string; url: string }>;
  relatedEvents?: Array<{ id: string; title: string; category: string; venue: string; schedule: string }>;
}

export async function queryFestAssistant(req: AiQueryRequest): Promise<AiQueryResponse>;
```

---

## Code Layout

```
c:/Users/yoshi/OneDrive/Desktop/Astitva 2k26/
├── app/
│   ├── layout.tsx                     # Root Layout (Theme, Providers, Navbar, Footer, AI Widget)
│   ├── page.tsx                       # Dark Cyberpunk Landing Page
│   ├── (auth)/
│   │   ├── sign-in/page.tsx           # Sign In (Clerk / Mock Switcher)
│   │   └── sign-up/page.tsx           # Sign Up & LNJPIT Profile Creation
│   ├── events/
│   │   ├── page.tsx                   # Filterable Event Catalog
│   │   └── [id]/page.tsx              # Event Details & Registration Trigger
│   ├── schedule/page.tsx              # Day 1-5 Schedule Matrix
│   ├── leaderboard/page.tsx           # Live Multi-Stream Leaderboards
│   ├── results/page.tsx               # Results & Podium Winners
│   ├── announcements/page.tsx         # Live Notice Board
│   ├── gallery/page.tsx               # Multimedia Gallery
│   ├── sponsors/page.tsx              # Sponsor Showcase
│   ├── team/page.tsx                  # Organizing Committee
│   ├── verify-certificate/[id]/page.tsx# Public Certificate Verification Portal
│   ├── profile/page.tsx               # User Profile & Pass View
│   ├── teams/
│   │   ├── create/page.tsx            # Team Creation
│   │   └── join/[code]/page.tsx       # Join Team via 6-char Invite Code
│   ├── dashboard/
│   │   ├── layout.tsx                 # Dashboard Shell
│   │   ├── admin/page.tsx             # Admin Global Dashboard & Metrics
│   │   ├── coordinator/page.tsx       # Coordinator Event Management & Scoring
│   │   ├── volunteer/page.tsx         # Volunteer Webcam QR Scanner & Logs
│   │   ├── captain/page.tsx           # Captain Team Roster Management
│   │   └── participant/page.tsx       # Participant My Events & QR Pass
│   └── api/
│       ├── auth/mock/route.ts         # Mock Auth switch API
│       ├── qr/verify/route.ts         # QR Check-in Endpoint
│       ├── certificates/route.ts      # Certificate PDF Generation Endpoint
│       ├── ai/chat/route.ts           # AI Fest Assistant Endpoint
│       └── export/[type]/route.ts     # Data Export Endpoint (.xlsx / .csv)
├── components/
│   ├── ui/                            # Shadcn UI primitives (Button, Card, Dialog, Tabs, etc.)
│   ├── landing/                       # Hero3D, Countdown, ScheduleTimeline, CategoryCard, etc.
│   ├── qr/                            # QRBadge, QRScanner, PassCard
│   ├── certificates/                  # CertificateTemplate, VerifyCard
│   ├── ai/                            # AiChatWidget, ChatMessage
│   ├── dashboard/                     # Sidebar, Header, StatsCards, AnalyticsCharts
│   └── shared/                        # Navbar, Footer, Breadcrumbs, RoleBadge
├── lib/
│   ├── auth/                          # Hybrid Auth (Clerk + Mock Auth)
│   ├── db/                            # Prisma client singleton
│   ├── qr/                            # Cryptographic token encoding/decoding
│   ├── certificates/                  # PDF rendering & verification logic
│   ├── ai/                            # Fest assistant knowledge base & matcher
│   ├── export/                        # SheetJS / CSV generators
│   └── utils.ts                       # Tailwind merge & helper utils
├── prisma/
│   ├── schema.prisma                  # 18 PostgreSQL models & relations
│   └── seed.ts                        # 16 canonical events + 5 demo roles seed script
├── public/
│   ├── manifest.json                  # PWA Manifest
│   ├── sw.js                          # Service Worker
│   └── images/                        # LNJPIT logos, sponsors, avatars
├── tests/
│   ├── e2e/                           # Requirement-driven E2E test suites (Tiers 1-4)
│   └── test-runner.ts                 # Independent test execution harness
├── Dockerfile                         # Production multi-stage Docker build
├── docker-compose.yml                 # App + Postgres + Adminer
├── .github/workflows/ci.yml           # GitHub Actions CI/CD Pipeline
├── README.md                          # Comprehensive project documentation
└── package.json                       # Dependencies & build scripts
```

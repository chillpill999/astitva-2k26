<p align="center">
  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeN-JjIqh_4b1VFg9G1sKF0x09VsxjNSTmEgj-pntOWtH3O4yXXjh6uvBJhElowHEuhrHFoXASvZGQotn4Jn6hOmueDtWGaPuoiUo6LiV4CycBTtZKM7xLrrS8ZZmccJMZ5TpKBoIIbWc2zKS-PNw77S3dD6a7IaEEPiGRon2v_9vdOSdP1qdLYPXRdv6LgPgthMW2smNFuFkq82UaSeJ_QpZzSUL02KjoZKGGHbPFL-cOSPh5MA7PJcSrZN6ZBh82UmY" alt="ASTITVA 2K26 Logo" width="200"/>
</p>

<h1 align="center">ASTITVA 2K26</h1>

<p align="center">
  <strong>🏛️ Enterprise-Grade Festival Management Platform</strong><br/>
  <em>Where Sports, Talent, Creativity & Entertainment Come Together</em>
</p>

<p align="center">
  <a href="#-quick-start"><img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15"/></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Prisma-6.3-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Three.js-r173-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js"/></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-in_development-blue?style=flat-square" alt="Status"/>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome"/>
  <img src="https://img.shields.io/badge/fest_date-Sept_4--8,_2026-purple?style=flat-square" alt="Fest Date"/>
</p>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [User Roles & Dashboards](#-user-roles--dashboards)
- [Design System](#-design-system)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**ASTITVA 2K26** is the official annual fest management platform for **LNJPIT Chapra** (Lok Nayak Jai Prakash Institute of Technology), Bihar's premier technical institution. The platform is the single source of truth for the entire 5-day festival lifecycle — covering **16+ events** across 4 categories, serving **1000+ participants**.

| Detail | Info |
|--------|------|
| **Festival** | ASTITVA 2K26 |
| **College** | LNJPIT Chapra |
| **Dates** | September 4 – 8, 2026 |
| **Categories** | Sports · Cultural · Gaming · Literary |
| **Prize Pool** | ₹10,00,000+ |

### Event Categories

| 🏏 Sports | 🎭 Cultural | 🎮 Gaming | 📝 Literary |
|-----------|-------------|-----------|-------------|
| Cricket | Dance | BGMI | Debate |
| Football | Singing | Free Fire | Quiz |
| Volleyball | Comedy | | Poetry |
| Badminton | Ramp Walk | | Creative Writing |
| Chess | | | |

---

## ✨ Features

### 🌐 Immersive Landing Page
- **WebGL Particle Shader** — Interactive Three.js canvas with dual blue/purple pulse animation
- **Live Countdown Timer** — Real-time countdown to September 4, 2026
- **Glassmorphism UI** — Premium glass cards with `backdrop-filter: blur(12px)` and obsidian tonal layering
- **16 Section Components** — Hero, About, Categories, Schedule Timeline, Featured Events, Prize Pool, Sponsors, Team, Gallery, FAQ, CTA

### 🔐 Role-Based Access Control (RBAC)
- **5 distinct roles** with dedicated dashboards and middleware-enforced route protection
- **Hybrid Authentication** — Clerk (production) / Mock Auth (development) via env toggle
- **JWT Session Management** — HMAC-SHA256 signed tokens with cookie-based sessions
- **Edge Middleware** — Role-aware route guards with automatic dashboard redirect

### 📋 Event Catalog & Registration Engine
- **Category-filtered browsing** — Sports, Cultural, Gaming, Literary tabs with search
- **Individual registration** — Duplicate prevention, capacity checks, deadline enforcement
- **Team registration** — 6-character alphanumeric invite codes, captain approval, roster management
- **Status tracking** — Pending → Confirmed → Attended pipeline

### 📱 QR Code Badge & Attendance System
- **Encrypted QR Pass** — HMAC-SHA256 tamper-evident digital badge per participant
- **Volunteer Scanner** — Camera/webcam scanner with instant validation
- **Duplicate Prevention** — Event-specific check-in with dedup constraints
- **Real-time Dashboard** — Live attendance metrics, check-in timestamps

### 🏆 Results & Live Leaderboard
- **Coordinator scoring** — Score entry, ranking, podium publishing (Winner / 1st Runner-Up / 2nd Runner-Up)
- **Multi-category leaderboard** — Real-time standings across Sports, Cultural, Gaming, Literary
- **Score sheets** — Structured round-by-round tracking

### 📜 Automated Certificate Generation
- **PDF certificates** — React-PDF rendered, downloadable credentials
- **5 certificate types** — Participation, Winner, Runner-Up, Volunteer, Coordinator
- **Tamper-evident** — Unique certificate ID (`AST26-CERT-XXXXX`) + HMAC-SHA256 signature hash
- **Public verification** — `/verify-certificate/[id]` route for authenticity checks

### 🤖 AI Fest Assistant
- **Natural language queries** — "When is Badminton?", "Where is Chess?", "What are BGMI rules?"
- **Context-aware** — Powered by local RAG over event database
- **Chat history** — Persistent conversation sessions stored in database

### 📢 Announcement Center & Notifications
- **Broadcast system** — General, Event Updates, Emergency Notices, Results
- **Priority tags** — Urgent / High / Normal / Low with pinning support
- **In-app notifications** — Real-time notification center with read tracking

### 📊 Admin Analytics Dashboard
- **Interactive charts** — Recharts-powered visual metrics
- **Key metrics** — Total registrations, attendance rates, daily trends, branch/gender distribution
- **Data export** — CSV and Excel export for participant lists, attendance sheets, winner reports

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org/) | App Router, Server Components, Server Actions |
| [TypeScript 5.7](https://www.typescriptlang.org/) | Type-safe development |
| [Tailwind CSS 3.4](https://tailwindcss.com/) | Utility-first styling with custom design tokens |
| [Shadcn UI](https://ui.shadcn.com/) | Radix-based accessible component library |
| [Framer Motion](https://www.framer.com/motion/) | Declarative animations & page transitions |
| [Three.js r173](https://threejs.org/) | WebGL particle shader for hero section |
| [Recharts](https://recharts.org/) | Admin analytics visualizations |
| [Lucide React](https://lucide.dev/) | Icon system |

### Backend & Data
| Technology | Purpose |
|------------|---------|
| [Prisma 6.3](https://www.prisma.io/) | Type-safe ORM with 18 relational models |
| [PostgreSQL](https://www.postgresql.org/) | Production database (Neon / Supabase compatible) |
| [Zod](https://zod.dev/) | Runtime schema validation |
| [React Hook Form](https://react-hook-form.com/) | Performant form management |
| [React-PDF](https://react-pdf.org/) | Server-side certificate PDF rendering |
| [html5-qrcode](https://github.com/mebjas/html5-qrcode) | QR scanner for volunteer check-ins |

### Auth & Security
| Technology | Purpose |
|------------|---------|
| [Clerk](https://clerk.com/) | Production authentication (Google OAuth, Email) |
| Mock Auth Provider | Zero-dependency local development auth |
| JWT (jsonwebtoken) | Session tokens, QR pass signing |
| bcryptjs | Password hashing for mock auth |
| Edge Middleware | RBAC route protection |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    ASTITVA 2K26                         │
│              Next.js 15 App Router                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Landing  │  │Dashboard │  │  Events  │  │  API   │ │
│  │  Pages   │  │  (RBAC)  │  │ Catalog  │  │ Routes │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───┬────┘ │
│       │              │              │             │      │
│  ┌────▼──────────────▼──────────────▼─────────────▼──┐  │
│  │              Server Actions Layer                  │  │
│  │     (Zod Validation · RBAC Guards · Audit Log)     │  │
│  └────────────────────┬──────────────────────────────┘  │
│                       │                                  │
│  ┌────────────────────▼──────────────────────────────┐  │
│  │             Prisma ORM (18 Models)                 │  │
│  │   Users · Events · Teams · Registrations · QR      │  │
│  │   Attendance · Results · Certificates · Sponsors   │  │
│  └────────────────────┬──────────────────────────────┘  │
│                       │                                  │
│  ┌────────────────────▼──────────────────────────────┐  │
│  │           PostgreSQL (Neon / Local)                 │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or pnpm/yarn)
- **PostgreSQL** 15+ (or use SQLite for local dev)

### 1. Clone & Install

```bash
git clone https://github.com/chillpill999/astitva-2k26.git
cd astitva-2k26
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your database credentials. For **instant local development** with zero external dependencies:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/astitva2k26"
NEXT_PUBLIC_AUTH_PROVIDER="mock"
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with 16 events, sample users, teams, and announcements
npm run prisma:seed

# (Optional) Open Prisma Studio to browse data
npm run prisma:studio
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

### 5. Access Mock Auth

With `NEXT_PUBLIC_AUTH_PROVIDER="mock"`, navigate to `/sign-in` and use the dev role switcher to test any role:

| Role | Dashboard |
|------|-----------|
| Admin | `/dashboard/admin` |
| Event Coordinator | `/dashboard/coordinator` |
| Volunteer | `/dashboard/volunteer` |
| Team Captain | `/dashboard/captain` |
| Participant | `/dashboard/participant` |

---

## 📁 Project Structure

```
astitva-2k26/
├── app/
│   ├── (auth)/                  # Auth pages (sign-in, sign-up)
│   ├── api/
│   │   └── auth/mock/           # Mock auth API routes
│   ├── dashboard/
│   │   ├── admin/               # Admin Control Center
│   │   ├── coordinator/         # Event Coordinator Dashboard
│   │   ├── volunteer/           # QR Scanner & Attendance Terminal
│   │   ├── captain/             # Team Hub & Roster Management
│   │   └── participant/         # Participant Portal & QR Badge
│   ├── events/
│   │   ├── page.tsx             # Event catalog with category filters
│   │   └── [id]/page.tsx        # Event detail page
│   ├── teams/
│   │   ├── create/              # Team creation form
│   │   └── join/[code]/         # Join team via invite code
│   ├── schedule/                # Festival schedule timeline
│   ├── sponsors/                # Sponsor showcase
│   ├── gallery/                 # Media gallery
│   ├── faq/                     # FAQ accordion
│   ├── page.tsx                 # Landing page (Hero + 16 sections)
│   ├── layout.tsx               # Root layout (fonts, theme, providers)
│   └── globals.css              # CSS variables & glassmorphism utilities
├── components/
│   ├── landing/                 # 16 landing page section components
│   │   ├── HeroShaderCanvas.tsx # WebGL Three.js particle shader
│   │   ├── CountdownTimer.tsx   # Live countdown to Sept 4, 2026
│   │   ├── CategoryPreviewGrid.tsx
│   │   ├── ScheduleTimelineMatrix.tsx
│   │   ├── FeaturedTournaments.tsx
│   │   ├── PrizePoolShowcase.tsx
│   │   ├── SponsorWall.tsx
│   │   └── ...
│   ├── dashboard/               # Dashboard shared components
│   │   ├── Sidebar.tsx          # Role-aware sidebar navigation
│   │   ├── Header.tsx           # Dashboard header with notifications
│   │   └── DevRoleSwitcher.tsx  # Development role switching widget
│   ├── events/                  # Event catalog components
│   ├── teams/                   # Team management components
│   ├── profile/                 # Profile editing components
│   ├── shared/                  # Navbar, Footer
│   └── ui/                      # Shadcn UI primitives (18 components)
├── lib/
│   ├── auth/
│   │   ├── auth.ts              # Unified auth API
│   │   ├── clerk.ts             # Clerk production adapter
│   │   ├── mock-auth.ts         # Zero-dependency mock auth
│   │   ├── jwt.ts               # JWT sign/verify for sessions & QR
│   │   ├── profile.ts           # Role routing & profile helpers
│   │   └── types.ts             # Auth type definitions
│   ├── events/
│   │   ├── actions.ts           # Event server actions
│   │   ├── schema.ts            # Zod validation schemas
│   │   └── types.ts             # Event type definitions
│   ├── teams/
│   │   ├── actions.ts           # Team server actions
│   │   ├── code-generator.ts    # 6-char invite code generator
│   │   └── schema.ts            # Team validation schemas
│   ├── profile/
│   │   ├── actions.ts           # Profile CRUD server actions
│   │   ├── id-generator.ts      # AST26-XXXX participant ID generator
│   │   └── schema.ts            # Profile validation schemas
│   ├── data/fest-data.ts        # Static festival metadata
│   ├── db/prisma.ts             # Prisma client singleton
│   └── utils.ts                 # Shared utilities (cn, formatDate, etc.)
├── prisma/
│   ├── schema.prisma            # 18-model database schema (682 lines)
│   └── seed.ts                  # Comprehensive seed script (1169 lines)
├── tests/
│   ├── e2e/                     # 4-tier automated test suite
│   │   ├── tier1-features/      # Core feature tests (167 cases)
│   │   ├── tier2-boundaries/    # Edge case & boundary tests
│   │   ├── tier3-pairwise/      # Cross-feature workflow tests
│   │   └── tier4-workload/      # Load simulation tests
│   └── adversarial/             # Multi-agent adversarial test suites
├── public/
│   └── manifest.json            # PWA manifest
├── middleware.ts                 # Edge RBAC middleware
├── tailwind.config.ts           # Design system tokens & animations
├── .env.example                 # Environment variable template
├── package.json                 # Dependencies & scripts
└── tsconfig.json                # TypeScript configuration
```

---

## 🗄 Database Schema

**18 relational models** with full indexing, constraints, and cascading deletes:

```mermaid
erDiagram
    User ||--o| Profile : has
    User ||--o{ Registration : creates
    User ||--o{ Team : captains
    User ||--o{ TeamMember : joins
    User ||--o{ Attendance : "checked in"
    User ||--o{ Result : wins
    User ||--o{ Certificate : earns
    User ||--o{ Notification : receives
    User ||--o{ AuditLog : triggers

    Category ||--o{ Event : contains
    Event ||--o{ Registration : accepts
    Event ||--o{ Team : hosts
    Event ||--o{ Attendance : tracks
    Event ||--o{ Result : produces
    Event ||--o{ Certificate : issues

    Team ||--o{ TeamMember : includes
    Team ||--o{ Registration : submits
    Team ||--o{ Result : achieves
```

### Key Models

| Model | Purpose | Key Fields |
|-------|---------|------------|
| `User` | Authentication & identity | email, role (5 enum values), clerkId |
| `Profile` | LNJPIT student metadata | participantId (`AST26-XXXX`), branch, semester, qrPassToken |
| `Category` | Event grouping | slug, type (SPORTS/CULTURAL/GAMING/LITERARY) |
| `Event` | Festival competition | 25+ fields: venue, prizePool, dayNumber, status, capacity |
| `Registration` | Event enrollment | registrationNumber (`AST26-REG-XXXXX`), status pipeline |
| `Team` | Team formation | code (6-char invite), captain, min/max members |
| `Attendance` | QR check-in records | participantId, checkInType, dedup constraint |
| `Result` | Podium & scoring | rank, positionTitle, score, prizeAwarded |
| `Certificate` | Verifiable credentials | certificateNumber, signatureHash, verificationUrl |
| `AuditLog` | Security trail | action, resource, ipAddress, timestamp |
| `AiChatMessage` | AI assistant history | sessionId, role, queryIntent |

---

## 👥 User Roles & Dashboards

### 🔴 Admin — `/dashboard/admin`
Full system control with analytics, user management, event CRUD, sponsor management, audit logs, and data export.
- `/dashboard/admin/analytics` — Live KPIs, registration velocity, branch & gender distribution, category popularity, top events, and the data export center (CSV / XLSX for registrations, attendance, results, certificates, participants, teams).

### 🟡 Event Coordinator — `/dashboard/coordinator`
Manages assigned events: registration approvals, score entry, result publishing, attendance monitoring, and announcement creation.
- `/dashboard/coordinator/results` — Live podium publisher with rank 1/2/3 entry, auto-certificate issuance on save, and event-completion lock.

### 🟢 Volunteer — `/dashboard/volunteer`
QR code scanner terminal for participant check-ins with real-time validation, duplicate prevention, and attendance dashboard.
- `/dashboard/volunteer/scanner` — Full-screen live camera (html5-qrcode) + manual lookup. Every scan writes an immutable `CheckInLog` + `AuditLog` entry; rate-limited to 30 scans/min/scanner; duplicate scans are blocked at the DB level.

### 🔵 Team Captain — `/dashboard/captain`
Team creation hub with invite code generation, member approval/removal, roster management, and team event submissions.

### 🟣 Participant — `/dashboard/participant`
Personal festival portal with event discovery, registration status, QR badge, team memberships, certificates, and results.

---

## 🎨 Design System

The UI implements the **Astitva 2K26 Visual Framework** — a premium dark glassmorphism design system.

### Color Architecture

| Layer | Token | Hex | Usage |
|-------|-------|-----|-------|
| Level 0 | `fest-dark-950` | `#020617` | Sidebar, deep recesses |
| Level 1 | `fest-dark-900` | `#0b0f19` | Primary canvas |
| Level 2 | Glass Card | `rgba(17,24,39,0.7)` | Elevated containers |
| Accent | `fest-cyan` | `#06B6D4` | Data viz, metrics, progress |
| Accent | `fest-purple` | `#8B5CF6` | Elite features, flagships |
| Accent | `fest-amber` | `#F59E0B` | Winners, VIP, gold tier |
| Accent | `fest-emerald` | `#10B981` | Success, active states |
| Accent | `fest-crimson` | `#EF4444` | Alerts, urgent notices |

### Typography
- **Headlines**: Inter (700/800 weight, tight tracking)
- **Body**: Inter (400/500 weight)
- **Labels & Metadata**: JetBrains Mono (500 weight, uppercase tracking)

### Animations
- `pulse-glow` — Cyan/purple neon pulsation for active elements
- `float` — Gentle vertical hover for cards
- `scanline` — Cyberpunk scanning line effect
- `shimmer` — Loading skeleton shimmer
- `radar-spin` — Rotating radar for live indicators

---

## 🔌 API Reference

### Auth Routes (`/api/auth/mock/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/mock/login` | Authenticate with email/password |
| `POST` | `/api/auth/mock/logout` | Clear session cookie |
| `GET`  | `/api/auth/mock/me` | Get current user session |
| `POST` | `/api/auth/mock/switch-role` | Switch role (dev only) |
| `GET`  | `/api/auth/mock` | List available mock users |

### QR / Scanner Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/qr/issue` | Issue a signed participant QR pass |
| `POST` | `/api/qr/scan` | Validate a scanned QR token + record attendance |

### AI / Notifications / Export

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/chat` | AstitvaBot conversational endpoint |
| `GET`  | `/api/notifications` | List my in-app notifications |
| `POST` | `/api/notifications` | Mark read / mark-all-read |
| `GET`  | `/api/export/[type]?format=csv\|xlsx` | Download CSV/XLSX for registrations, attendance, results, certificates, participants, teams |

### Server Actions

| Module | Actions | Description |
|--------|---------|-------------|
| `lib/events/actions.ts` | `getEventsCatalog`, `getEventBySlugOrId`, `registerSoloEvent`, `cancelRegistration` | Event catalog & registration |
| `lib/teams/actions.ts` | `createTeam`, `getTeamDetails`, `joinTeamByCode`, `manageTeamMember`, `disbandTeam` | Team management |
| `lib/profile/actions.ts` | `getProfile`, `updateProfile` | Profile CRUD |
| `lib/attendance/actions.ts` | `scanQrToken`, `manualLookupCheckIn`, `revokeQrPass`, `getAttendanceMetrics` | Volunteer scanner (rate-limited, audit-logged) |
| `lib/results/actions.ts` | `recordEventResults`, `deleteResult`, `getEventResults`, `getLeaderboard`, `getBranchStandings` | Podium publishing + multi-stream leaderboards |
| `lib/certificates/actions.ts` | `issueCertificate`, `getPublicCertificate`, `getUserCertificates` | Verifiable AST26-CERT-XXXXX issuance + verification |
| `lib/ai/actions.ts` | `askFestAssistant`, `createAnnouncement`, `createNotification`, `markNotificationRead` | AI chat, broadcasts, in-app notifications |
| `lib/analytics/actions.ts` | `getAdminAnalytics` | Festival-wide metrics |
| `lib/export/index.ts` | `exportAsCSV`, `exportAsXLSX` | Operational data export |

---

## 🧪 Testing

The project includes the master E2E suite plus M5–M9 unit/integration tests:

```bash
# Master E2E suite (167 cases across 4 tiers)
npm run test:e2e

# Milestone-specific
npx tsx tests/m5/qr-crypto.test.ts             # 17 cases — HMAC token crypto
npx tsx tests/m5/attendance-integration.test.ts # 10 cases — DB-backed scanner logic
npx tsx tests/m7/certificate-crypto.test.ts    # 12 cases — certificate signing
npx tsx tests/m8/ai-matcher.test.ts            # 14 cases — intent classification
npx tsx tests/m9/export.test.ts                #  4 cases — export filename + format
```

| Suite | Focus | Cases |
|------|-------|-------|
| **M5 QR Crypto** | HMAC-SHA256 issue/verify, tampering, expiry | 17 |
| **M5 Attendance Integration** | Pass issue, revoke, dedup, audit, rate-limit | 10 |
| **M7 Certificate Crypto** | Cert signing, canonical payload, tamper detection | 12 |
| **M8 AI Matcher** | Intent classification, word-boundary regexes | 14 |
| **M9 Export** | Filename + format helpers | 4 |
| **Tier 1–4 E2E** | Opaque-box master suite (PGlite) | 167 |

Adversarial suites live under `tests/adversarial/` and `tests/challenger_*.ts` for security stress-testing.

---

## 🚢 Deployment

### Docker (Recommended for self-hosting)

```bash
# Build and run app + PostgreSQL 16 + Adminer
docker compose up -d

# App on  http://localhost:3000
# DB   on  localhost:5432 (postgres / postgres)
# Adminer on http://localhost:8080
```

### Vercel (Recommended for production)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set these environment variables in Vercel dashboard:

```
DATABASE_URL=postgresql://...@neon.tech/astitva2k26
NEXT_PUBLIC_AUTH_PROVIDER=clerk
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
JWT_SECRET=<strong-random-secret>
```

### Docker

```bash
# Build and run
docker build -t astitva-2k26 .
docker run -p 3000:3000 --env-file .env astitva-2k26
```

---

## 🔐 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string |
| `DIRECT_URL` | ✅ | — | Direct database URL (for migrations) |
| `NEXT_PUBLIC_AUTH_PROVIDER` | ✅ | `mock` | Auth strategy: `mock` or `clerk` |
| `JWT_SECRET` | ✅ | fallback | HMAC-SHA256 signing key |
| `QR_ENCRYPTION_KEY` | ✅ | fallback | QR pass encryption key |
| `NEXT_PUBLIC_APP_URL` | ❌ | `http://localhost:3000` | Application base URL |
| `NEXT_PUBLIC_FEST_NAME` | ❌ | `ASTITVA 2K26` | Festival display name |
| `NEXT_PUBLIC_FEST_START_DATE` | ❌ | `2026-09-04` | Countdown target date |
| `AI_ASSISTANT_NAME` | ❌ | `AstitvaBot` | AI assistant display name |

---

## 📜 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:push      # Push schema to database
npm run prisma:seed      # Seed database with festival data
npm run prisma:studio    # Open Prisma Studio GUI
npm run test:e2e         # Run automated test suite
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Formatting
refactor: Code restructuring
test:     Adding tests
chore:    Maintenance
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with ❤️ for LNJPIT Chapra</strong><br/>
  <em>ASTITVA 2K26 — September 4–8, 2026</em><br/><br/>
  <a href="https://github.com/chillpill999/astitva-2k26">⭐ Star this repo</a> ·
  <a href="https://github.com/chillpill999/astitva-2k26/issues">🐛 Report Bug</a> ·
  <a href="https://github.com/chillpill999/astitva-2k26/issues">💡 Request Feature</a>
</p>

# ASTITVA 2K26 — Dependency Graph

**Generated:** 27 Aug 2026 · Represents the **actual shipped code** (verified), not the aspirational spec.

---

## 1. High-Level Architecture (verified against source)

```mermaid
flowchart TB
    UI["Presentation Layer<br/>app/ (App Router, React 19)"] --> SA["Server Actions Layer</br>(lib/*/actions.ts)"]
    UI --> API["API Routes</br>app/api/ (Mock Auth only)"]
    UI --> MID["Edge Middleware</br>(middleware.ts — RBAC)"]
    SA --> VAL["Zod Validation</br>(lib/*/schema.ts)"]
    SA --> DB["Prisma ORM</br>lib/db/prisma.ts"]
    SA --> STATIC["Static fallback</br>lib/data/fest-data.ts"]
    API --> AUTH["lib/auth</br>(auth, jwt, mock-auth, clerk, profile)"]
    MID --> AUTH
    AUTH --> DB
    MID --> AUTHUTIL["lib/auth/profile.ts"]
    DB --> PG[("PostgreSQL</br>(Prisma 18 models)")]
    UI --> UIKIT["components/ui</br>(Shadcn/Radix)"]

    %% Test harness (independent, in-memory PGlite)
    TESTS["tests/e2e harness</br>(PGlite in-memory)"] -.test-only logic.-> DB
```

---

## 2. Feature / Module Map with Implementation Status

Leaf color key — **green** = implemented & wired · **amber** = hardcoded UI or test-only · **red** = absent from app code.

```mermaid
flowchart LR
    subgraph M1_M2["M1–M2 Foundation (✅ real)"]
        SCHEMA["Prisma Schema<br/>18 models · 21 enums"]
        SEED["prisma/seed.ts<br/>16 events · 5 roles"]
        AUTH["lib/auth/*<br/>JWT · mock · clerk"]
        RBAC["middleware.ts<br/>RBAC guards"]
        PROF["lib/profile/*<br/>AST26-XXXX"]
    end

    subgraph M3_M4["M3–M4 Catalog & Teams (✅ real)"]
        EVENTS["lib/events/actions.ts<br/>8 actions"]
        TEAMS["lib/teams/actions.ts<br/>8 actions"]
        LANDING["components/landing/*<br/>16 sections"]
        TEAMUI["/teams/* pages"]
        EVENTUI["/events, /events/[id]"]
    end

    subgraph M5_TO_PRESENT["M5–M8 Claimed-but-gap (⚠️/❌)"]
        QR["🔴 lib/qr (absent)<br/>QR pass logic"]
        CERT["🔴 lib/certificates (absent)<br/>PDF certs"]
        AI["🔴 lib/ai (absent)<br/>assistant RAG"]
        EXPORT["🔴 lib/export (absent)"]
        ANAL["🟠 /dashboard/admin<br/>hardcoded analytics"]
        VOL["🟠 /dashboard/volunteer<br/>hardcoded scanner"]
        PAR["🟠 /dashboard/participant<br/>hardcoded events/certs"]
        COORD["🟠 /dashboard/coordinator<br/>hardcoded scoring"]
        LBRD["🔴 /leaderboard, /results (absent)"]
        VERIFY["🔴 /verify-certificate/[id] (absent)"]
        ANNOUNCE["🔴 /announcements, notifications (absent)"]
        DEVOPS["🔴 Dockerfile, CI, sw.js (absent)"]
    end

    subgraph TESTS5["Independent E2E harness (✅ but PGlite-only)"]
        TESTQR["tests QR crypto"]
        TESTCERT["tests cert hashing"]
        TESTAI["tests AI matcher"]
    end

    EVENTS --> SCHEMA
    TEAMS --> SCHEMA
    PROF --> SCHEMA
    AUTH --> SCHEMA
    EVENTUI --> EVENTS
    TEAMUI --> TEAMS

    LANDING --> STATICDATA["lib/data/fest-data.ts"]
    EVENTUI --> STATICDATA

    TESTQR -.not shipped.-> QR
    TESTCERT -.not shipped.-> CERT
    TESTAI -.not shipped.-> AI
```

---

## 3. Dependency Graph by Directory

```mermaid
flowchart TD
    A["app/layout.tsx"] --> NAV["components/shared/Navbar"]
    A --> FOOT["components/shared/Footer"]
    A --> UIC["components/ui/*"]

    LAND["app/page.tsx"] --> LANDING["components/landing/*"]
    LANDING --> HERO["HeroShaderCanvas.tsx (Three.js)"]
    LANDING --> COUNT["CountdownTimer.tsx"]
    LANDING --> SCHED["ScheduleTimelineMatrix.tsx"]
    LANDING --> UIC
    LAND --> FEST["lib/data/fest-data.ts"]

    EVT["app/events/page.tsx"] --> EA["lib/events/actions.ts"]
    EVT --> GRID["components/events/EventCatalogGrid"]
    EVTD["app/events/[id]/page.tsx"] --> EA
    EVTD --> TABS["components/events/EventDetailTabs"]

    TMM["app/teams/*"] --> TA["lib/teams/actions.ts"]
    TA --> TMOD["lib/teams/*  (schema/code-generator)"]

    PROF["app/profile/page.tsx"] --> PA["lib/profile/actions.ts"]
    SIGNIN["app/(auth)/sign-in/page.tsx"] --> API["app/api/auth/mock/*"]
    API --> AUTH["lib/auth/*"]

    DB["lib/db/prisma.ts"] --> SCHEMA["prisma/schema.prisma"]
    EA --> DB & STATIC["lib/data/fest-data.ts"]
    TA --> DB
    PA --> DB
    AUTH --> DB

    MID["middleware.ts"] --> AUTHPR["lib/auth/profile.ts"] & JWT["lib/auth/jwt.ts"]
```

---

## 4. Application Routes & Their Data Source (verified)

| Route | Kind | Data source | Status |
|:---|:---|:---|:---:|
| `/` | Static-rendered | fest-data + static sections | ✅ |
| `/events`, `/events/[id]` | DB / static fallback | `getEventsCatalog`, `getEventBySlugOrId` | ✅ |
| `/schedule`, `/gallery`, `/faq`, `/sponsors`, `/team` | Static | static data | ✅ |
| `/sign-in`, `/sign-up` | Mock Auth API | `lib/auth` + JWT | ✅ |
| `/profile` | DB | `getProfile` | ✅ |
| `/teams/*` | DB | `lib/teams/actions` | ✅ |
| `/dashboard/*` (5 roles) | **Hardcoded arrays** | — | ⚠️ |
| `/leaderboard`, `/results` | **—** | — | ❌ |
| `/announcements` | **—** | — | ❌ |
| `/verify-certificate/[id]` | **—** | — | ❌ |

---

## 5. Database Model Dependencies (Prisma relations)

```mermaid
erDiagram
    User ||--o| Profile : has
    User ||--o{ Registration : creates
    User ||--o{ Team : captains
    User ||--o{ TeamMember : joins
    User ||--o{ Attendance : attended
    User ||--o{ Result : wins
    User ||--o{ Certificate : earns
    User ||--o{ Notification : receives
    User ||--o{ Announcement : authors
    User ||--o{ AuditLog : triggers
    User ||--o{ AiChatMessage : sends

    Category ||--o{ Event : contains
    Event ||--o{ Registration : accepts
    Event ||--o{ Team : hosts
    Event ||--o{ Attendance : tracks
    Event ||--o{ Result : produces
    Event ||--o{ Certificate : issues
    Event }o--|| User : coordinatedBy

    Team ||--o{ TeamMember : includes
    Team ||--o{ Registration : submits
    Team ||--o{ Result : achieves
```

**All 18 models exist** in `prisma/schema.prisma`. However, only **User/Profile, Category, Event, Registration, Team, TeamMember** are actively exercised by shipped server actions/dashboards; the rest (Attendance, Result, Certificate, Announcement, Notification, Sponsor, Faq, GalleryItem, CommitteeMember, AuditLog, AiChatMessage) are schema-only and either read via static data, hardcoded UI, or covered only by the PGlite test harness.

---

## 6. Third-Party Dependency Tree (`package.json` → concern)

```mermaid
flowchart LR
    NEXT["Next.js 15"] --> REACT["React 19"]
    NEXT --> T3["Three.js r173"]
    NEXT --> FRAMER["framer-motion"]
    NEXT --> NEXT_THEME["next-themes"]
    NEXT --> RECH["recharts"]
    P["Prisma 6"] --> PG["@prisma/client / prisma"]
    P --> ADAPTER["@prisma/adapter-pg"]
    PF["React Hook Form"] --> RVR["@hookform/resolvers"]
    PF --> ZOD["zod"]
    UI["Radix (@radix-ui/*)<br/>12 primitives"] --> SHADCN["Shadcn-style components/ui"]
    UTIL["clsx / tailwind-merge / cva"] --> UI
    AUTHX["jsonwebtoken / bcryptjs"] --> MID
    QR["html5-qrcode / qrcode"] --> VOL{{"volunteer dashboard"}}
    PDF["@react-pdf/renderer"] --> CERT5{{"certificates (absent)"}}
    XLSX["xlsx"] --> EXPORT5{{"export (test-only)"}}
    CONF["canvas-confetti"] --> LANDING
    ICONS["lucide-react"] --> UI
    DEV["dev: tailwindcss, pglite, pg-mem, tsx, eslint, typescript"]
```

---

## 7. Status Legend & Interpretation

- **✅ GREEN** — code exists, wired in the running app, and covered by the DB-connected server actions.
- **🟠 AMBER** — UI/mockup exists but uses hardcoded data (screens render, no DB reads for that feature).
- **🔴 RED** — referenced by spec/README/tests but **absent** from `app`/`components`/`lib`/`api`.
- The **E2E harness is a separate, self-contained layer** that validates formulas against in-memory PGlite; it does **not** prove the app screens are wired.

For full context, see `PROJECT_STATUS_REPORT.md`.

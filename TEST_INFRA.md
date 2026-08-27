# ASTITVA 2K26: End-to-End Test Infrastructure Specification (`TEST_INFRA.md`)

## 1. Executive Overview & Test Architecture

The ASTITVA 2K26 E2E Test Suite is an independent, opaque-box testing harness engineered to validate all functional, non-functional, security, and integration requirements of the festival management platform. It operates directly against real relational schemas, real PostgreSQL 16 query execution, cryptographic engines, RBAC policies, and business logic without synthetic mock bypasses.

```
+-----------------------------------------------------------------------------------+
|                           ASTITVA 2K26 E2E TEST HARNESS                           |
|                         `npx tsx tests/e2e/test-runner.ts`                        |
+-----------------------------------------------------------------------------------+
                                         |
     +-----------------------------------+-----------------------------------+
     |                                   |                                   |
     v                                   v                                   v
+-----------------------+   +-----------------------+   +-----------------------+
|  Tier 1: Feature      |   |  Tier 2: Boundary &   |   |  Tier 3: Cross-       |
|  Coverage (24 Feats)  |   |  Corner Cases         |   |  Feature Pairwise     |
|  (>=5 tests/feature)  |   |  (>=5 tests/boundary) |   |  (End-to-End Chains)  |
+-----------------------+   +-----------------------+   +-----------------------+
                                         |
                                         v
                            +-----------------------+
                            |  Tier 4: Real-World   |
                            |  Workload (5-Day      |
                            |  Tournament Sim)      |
                            +-----------------------+
                                         |
     +-----------------------------------+-----------------------------------+
     |                                                                       |
     v                                                                       v
+---------------------------------------------+   +---------------------------------+
| Embedded PostgreSQL 16 WASM Engine (PGlite) |   | Cryptographic & Auth Engines    |
| - 18 Relational Models & Foreign Keys       |   | - HMAC-SHA256 QR Cipher         |
| - 21 Custom Enums & 105 Performance Indexes |   | - Digital Certificate Signatures|
| - Cascade Deletes & Unique Constraints      |   | - RBAC Permission Matrix (5 R)  |
+---------------------------------------------+   +---------------------------------+
```

---

## 2. Feature Inventory Test Matrix (24 Features)

| Feature # | Code | Feature Description | Tier 1 Target | Tier 2 Target | Tier 3 Target | Tier 4 Target |
|:---|:---|:---|:---:|:---:|:---:|:---:|
| **F-01** | `M1_SCHEMA` | Next.js 15 App Setup & 18 Prisma Models / PostgreSQL Schema Integrity | >= 5 | >= 5 | Included | Included |
| **F-02** | `M1_SEED` | Database Seed Data (16 Events, 4 Categories, 5 Demo Roles, Sponsors, FAQs) | >= 5 | >= 5 | Included | Included |
| **F-03** | `M2_AUTH` | Hybrid Auth & Session Management (Clerk + Mock Auth, JWT tokens, Passwords) | >= 5 | >= 5 | Included | Included |
| **F-04** | `M2_RBAC` | Role-Based Access Control (5 Roles: Admin, Coordinator, Volunteer, Captain, Participant) | >= 5 | >= 5 | Included | Included |
| **F-05** | `M2_PROFILE` | LNJPIT Student Profiles (Branch CSE/ME/CE/EE/ECE/OTHER, Semesters 1-8, AST26-XXXX ID) | >= 5 | >= 5 | Included | Included |
| **F-06** | `M3_LANDING` | Dark Cyberpunk Landing Page & 3D Hero Particle Theme, Live Countdown to Sept 4 2026 | >= 5 | >= 5 | Included | Included |
| **F-07** | `M3_SCHEDULE` | Category Previews & Multi-Day Schedule Timeline (Day 1 to Day 5, Venues, Timeslots) | >= 5 | >= 5 | Included | Included |
| **F-08** | `M3_SHOWCASE` | Showcase Sections (₹1.5L+ Prize pool breakdown, Tiered sponsors, Committee, FAQs) | >= 5 | >= 5 | Included | Included |
| **F-09** | `M4_CATALOG` | Event Catalog & Search/Filter Engine (Sports, Cultural, Gaming, Literary) | >= 5 | >= 5 | Included | Included |
| **F-10** | `M4_REGISTRATION` | Individual & Team Registration (Capacity limits, Duplicate registration prevention) | >= 5 | >= 5 | Included | Included |
| **F-11** | `M4_TEAMS` | Dynamic Team Engine & 6-char Alphanumeric Invite Codes (Min/Max size validation) | >= 5 | >= 5 | Included | Included |
| **F-12** | `M5_QR_PASS` | Encrypted QR Participant Pass (HMAC-SHA256 encrypted token AST26.<header>.<payload>.<sig>) | >= 5 | >= 5 | Included | Included |
| **F-13** | `M5_SCANNER` | Volunteer Real-Time QR Scanner (Webcam scan validation, manual participantId lookup) | >= 5 | >= 5 | Included | Included |
| **F-14** | `M5_ATTENDANCE` | Live Attendance Dashboard (Check-in velocity, Present/Absent metrics, Venue feeds) | >= 5 | >= 5 | Included | Included |
| **F-15** | `M6_SCORING` | Coordinator Score Entry & Match Brackets (Round qualifications, podium ranks 1/2/3) | >= 5 | >= 5 | Included | Included |
| **F-16** | `M6_LEADERBOARD` | Live Multi-Stream Leaderboards (Sports, Cultural, Gaming, Literary, Branch Championship) | >= 5 | >= 5 | Included | Included |
| **F-17** | `M6_CERTIFICATES` | Cryptographically Verifiable PDF Certificates (Unique AST26-CERT-XXXXX, HMAC hash) | >= 5 | >= 5 | Included | Included |
| **F-18** | `M6_VERIFY_PORTAL` | Public Certificate Verification Portal (`/verify-certificate/[id]` route, tamper detection) | >= 5 | >= 5 | Included | Included |
| **F-19** | `M7_AI_ASSISTANT` | AI Fest Assistant (ASTITVA Bot knowledge query engine for rules, venues, schedules, FAQs) | >= 5 | >= 5 | Included | Included |
| **F-20** | `M7_ANNOUNCEMENTS` | Announcements Broadcast System (Categories GENERAL, EVENT_UPDATE, EMERGENCY, RESULTS) | >= 5 | >= 5 | Included | Included |
| **F-21** | `M7_NOTIFICATIONS` | In-App Notification Infrastructure (User-targeted alerts, unread status, type routing) | >= 5 | >= 5 | Included | Included |
| **F-22** | `M8_ANALYTICS` | Admin Analytics & Recharts Metrics (Registration velocity, branch/gender distribution) | >= 5 | >= 5 | Included | Included |
| **F-23** | `M8_DATA_EXPORT` | Data Export Engine (CSV and Excel .xlsx formatting for participants, attendance, winners) | >= 5 | >= 5 | Included | Included |
| **F-24** | `M8_SPONSORS` | Sponsor CRUD & Tier Management (TITLE, POWERED_BY, GOLD, SILVER, BRONZE, visibility) | >= 5 | >= 5 | Included | Included |

---

## 3. Test Tier Definitions & Structure

### Tier 1: Feature Coverage Suite (>=5 tests per feature)
Verifies the baseline positive and negative operational behavior of every discrete feature in isolation:
- Schema tables, column types, and foreign key relations.
- User authentication, bcrypt hashing, JWT issuance, and RBAC authorization matrix.
- Event queries, category filtering, search terms, and schedule timelines.
- Team creation, unique 6-character code generation, member joining, and capacity restrictions.
- Cryptographic QR generation, payload encoding, and HMAC signature verification.
- Scanner check-in recording, attendance status updates, and duplicate scan rejection.
- Result recording, podium rank publishing, and branch championship point accumulation.
- Certificate hash generation, verification URL resolution, and revocation flags.
- AI Assistant natural language query routing, intent extraction, and FAQ matching.
- Announcement priority filtering, notification dispatch, analytics metrics, and CSV/XLSX export formatters.

### Tier 2: Boundary & Corner Case Suite (>=5 tests per boundary domain)
Stresses the system under hostile, extreme, and malformed conditions:
- **Team Size Bounds**: Registering 0 members, exceeding `maxTeamSize`, registering below `minTeamSize`.
- **Invite Code Edge Cases**: Lowercase codes, special characters, non-existent codes, expired/closed team codes.
- **Capacity & Expiration**: Exceeding `maxRegistrations` on hot events, registering after `scheduleStart`.
- **Replay & Timing Attacks**: Submitting duplicate QR check-ins within 50ms, duplicate attendance records for the same event.
- **Cryptographic Tampering**: Modifying QR payload JSON after HMAC signing, altering certificate recipient name while retaining signature hash.
- **Malformed Identifiers**: Non-standard participant IDs (e.g. `AST26-INVALID`), malformed college roll numbers, semester out of range (`0` or `9`).
- **RBAC Violations**: PARTICIPANT attempting to publish results or access `/dashboard/admin`, VOLUNTEER attempting to modify event prize pools.
- **Empty / Extreme Inputs**: 0-length search strings, 10,000-character AI query prompts, SQL injection payloads in search filters.

### Tier 3: Cross-Feature Combinations (Pairwise / User Journeys)
Validates multi-module integration chains representing canonical user journeys:
1. **End-to-End Tournament Lifecycle**:
   - Team Captain creates a team for BGMI Mobile Esports -> Generates 6-char code `BG26X1`.
   - Participant 1 & Participant 2 join with code -> Captain reviews and approves members -> Team status transitions to `READY`.
   - Captain registers team for `evt_gam_bgmi` -> Registration confirmed.
   - Volunteer scans Team Captain's encrypted QR pass at LAN Arena -> Attendance marked `PRESENT`.
   - Event Coordinator enters match score `32 kills (Rank 1)` -> Results published.
   - Live Gaming Leaderboard & Branch Championship Leaderboard automatically update scores.
   - Certificate Engine issues verifiable `WINNER` certificate `AST26-CERT-BGMI01`.
   - Public Verification Portal validates digital signature and returns verified certificate details.
2. **Volunteer Attendance & Admin Live Feed Integration**:
   - Volunteer executes rapid check-ins across multiple venues -> Duplicate scans rejected -> Real-time analytics dashboard aggregates velocity.
3. **Announcement & AI Assistant Integration**:
   - Admin publishes `EMERGENCY` schedule update -> Targeted notification created -> AI Assistant knowledge base updates and answers schedule questions with new venue info.
4. **Capacity Exhaustion & Roster Export**:
   - Event capacity reached -> Additional registrations rejected -> Cancellations open slots -> Export engine outputs accurate .xlsx and .csv rosters.

### Tier 4: Real-World Application Workloads (LNJPIT 5-Day Festival Simulation)
Simulates the full 5-day operational festival load for LNJPIT Chapra (4 Sept 2026 - 8 Sept 2026):
- **Day 1 (Sept 4)**: Campus opening ceremony, 150+ gate check-ins, Cricket Tournament kickoff, Grandmaster Chess preliminaries.
- **Day 2 (Sept 5)**: Inter-Branch Football cup turf war, Shuttle Smash Badminton, Nrityangana Dance battle qualifiers, Prashnavali Tech Quiz.
- **Day 3 (Sept 6)**: Hasya Kosh Stand-Up comedy, BGMI Mobile Esports Championship LAN rounds, Tark-Vitark Parliamentary Debate.
- **Day 4 (Sept 7)**: Sur Sangam Voice of Astitva, Free Fire Clash Squad, Kavyanjali Poetry Slam, Kalamkar Creative Writing.
- **Day 5 (Sept 8)**: Glamour & Grace Runway, Grand Finals across all sports, Podium publications for all 16 events, 50+ certificates generated, Admin analytics final audit, Full festival data export to CSV and Excel.

---

## 4. Authoritative Cryptographic & Business Contracts

### 4.1 Encrypted QR Pass Specification
Format: `AST26.<header_b64>.<payload_b64>.<hmac_sha256_hex>`
- **Header**: `{"alg": "HS256", "typ": "AST26-PASS", "ver": "1.0"}`
- **Payload**: `{"participantId": "AST26-XXXX", "userId": "...", "collegeId": "...", "name": "...", "branch": "...", "timestamp": 1725408000000}`
- **Signature**: `HMAC_SHA256(header_b64 + "." + payload_b64, SECRET_KEY)`

### 4.2 Verifiable Digital Certificate Specification
Format: `AST26-CERT-XXXXX`
- **Signature Hash**: `SHA256(certificateNumber + ":" + recipientName + ":" + eventName + ":" + category + ":" + position + ":" + issueDate + ":" + SECRET_KEY)`
- **Verification URL**: `https://astitva2k26.lnjpit.ac.in/verify-certificate/{certificateNumber}`

### 4.3 RBAC Permission Matrix
| Role | Dashboard Access | Event Manage | Team Create | QR Scan | Score Entry | User Manage | Cert Verify |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `ADMIN` | `/dashboard/admin` | Read / Write | Yes | Yes | Yes | Read / Write | Yes |
| `EVENT_COORDINATOR` | `/dashboard/coordinator` | Read / Write (Assigned) | Yes | Yes | Yes | None | Yes |
| `VOLUNTEER` | `/dashboard/volunteer` | Read | Yes | Yes | None | None | Yes |
| `TEAM_CAPTAIN` | `/dashboard/captain` | Read | Yes (Manage Roster) | None | None | None | Yes |
| `PARTICIPANT` | `/dashboard/participant` | Read | No | None | None | None | Yes |

---

## 5. Pass/Fail Semantics & Assertion Guardrails

1. **Zero Mock Policy on Relational Constraints**: All database operations must execute against real PostgreSQL tables with foreign key cascades, unique constraints, and check conditions.
2. **Deterministic Assertions**: Every test must assert strict equality (`===`) or exact error codes against authoritative reference models.
3. **No Flaky Timing**: Timeouts and async operations use structured event triggers or explicit in-memory clocks.
4. **100% Exit Code Integrity**: The test runner returns exit code `0` if and only if all tests pass across all 4 tiers. Any single failure exits with code `1` and prints the offending assertion and stack trace.

---

## 6. Runner Execution Guide

To execute the full E2E test harness:
```bash
npx tsx tests/e2e/test-runner.ts
```

To run individual tiers or feature suites:
```bash
npx tsx tests/e2e/tier1-features/auth-rbac.test.ts
npx tsx tests/e2e/tier2-boundaries/boundaries.test.ts
npx tsx tests/e2e/tier3-pairwise/workflows.test.ts
npx tsx tests/e2e/tier4-workload/simulation.test.ts
```

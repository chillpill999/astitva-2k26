# Original User Request

## 2026-08-27T06:05:59Z

Build ASTITVA 2K26, a complete enterprise-grade full-stack festival management platform for the annual Sports, Cultural, Gaming, and Literary Festival of LNJPIT Chapra, scheduled from 4 September 2026 to 8 September 2026.

The platform serves as the single source of truth for the entire festival lifecycle, including registrations, team management, attendance tracking, event operations, volunteer coordination, results publication, certificate generation, announcements, analytics, and AI-powered assistance.

Working directory: c:/Users/yoshi/OneDrive/Desktop/Astitva 2k26
Integrity mode: development

---

# Festival Details

- Festival Name: ASTITVA 2K26
- College: LNJPIT Chapra
- Duration: 4 September 2026 – 8 September 2026
- Theme: Where Sports, Talent, Creativity & Entertainment Come Together
- Categories:
  - Sports: Cricket, Football, Volleyball, Badminton, Chess
  - Cultural: Dance, Singing, Comedy, Ramp Walk
  - Gaming: BGMI, Free Fire
  - Literary: Debate, Quiz, Poetry, Creative Writing

---

# Technology Stack

- Frontend: Next.js 15 App Router, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, GSAP, Three.js, React Query, React Hook Form, Zod, Lucide React
- Backend: Next.js Server Actions, Next.js API Routes, Prisma ORM, PostgreSQL
- Authentication: Clerk Authentication / Google OAuth / Email Verification with Local Mock Authentication fallback for development
- Storage: Cloudinary / AWS S3 compatible storage with Local Storage fallback
- Notifications: Firebase Cloud Messaging / Email Notifications (Resend/Nodemailer)
- Deployment & DevOps: Docker, docker-compose, Vercel, Neon PostgreSQL, GitHub Actions CI/CD

---

# Requirements

### R1. Landing Page & Festival Identity
Create a premium dark-themed landing page with immersive visual design, particle/3D background effects, and fluid animations:
- Hero Section: Animated 3D/particle visual canvas, live countdown timer to Sept 4 2026, Register Now and Explore Events CTAs.
- About Section: Rich storytelling of ASTITVA and LNJPIT Chapra.
- Event Categories: Interactive category cards with detailed previews and filterable views.
- Schedule Timeline: Multi-day festival timeline (Day 1 to Day 5) with schedule slots, venues, and live status.
- Featured Competitions: Highlighting flagship tournaments and prize pools.
- Prize Pool Section: Categorized prize distribution and medals/trophies overview.
- Sponsors Section: Tiered sponsor showcase (Title, Gold, Silver, Community Partners).
- Organizing Team: Faculty coordinators, core student committee, and contacts.
- Gallery & Highlights: Multimedia festival showcase.
- FAQ & Support: Expandable FAQs and direct contact channel.

### R2. Role-Based Access Control & Profile Management
Implement a strict RBAC authorization system supporting 5 distinct roles:
1. Admin: Manage users, events, registrations, sponsors, announcements, payments, audit logs, and global analytics.
2. Event Coordinator: Manage assigned events, approve/reject registrations, enter scores, publish results, upload score sheets, and monitor attendance.
3. Volunteer: Camera/webcam QR code scanner, participant badge verification, attendance marking, and check-in logs.
4. Team Captain: Team creation, invite code generation, roster management (invite, approve, remove), and team event registration.
5. Participant: Event discovery, individual/team registration, personal encrypted QR badge, certificate downloads, and live result tracking.
- Profile Fields: Full Name, College Registration Number, Branch (CSE, ME, CE, EE, ECE), Semester (1-8), Phone Number, Gender, Hostel/Day Scholar status, Profile Picture, and unique Participant ID generation (AST26-XXXX).
- Hybrid Auth: Seamless switching between Clerk in production and built-in Mock Authentication for local development via .env.

### R3. Event Catalog & Team Registration Engine
- Event Management: CRUD operations for events with rules, venue, schedule, coordinator contact, max/min team size, registration deadlines, and prize details.
- Individual Registration: Duplicate entry prevention, capacity checks, and status tracking.
- Team Registration: Dynamic team creation, unique 6-character alphanumeric invite code, captain controls, member join approvals, min/max team size validation, and team event submission.

### R4. Encrypted QR Badge & Volunteer Attendance System
- Digital QR Badge: Generate unique, encrypted, tamper-resistant QR passes for all registered participants encoding ticket/participant verification payload.
- Volunteer Scanner: Real-time web camera scanner, webcam support, and manual code entry with instant validation, event-specific attendance recording, duplicate scan prevention, and timestamping.
- Attendance Dashboard: Real-time metrics on present vs absent attendees, check-in timelines, and percentage completion.

### R5. Results, Live Leaderboard & Automated Certificate Generator
- Results Management: Coordinator interface to record scores, round qualifications, rankings, and winners (Winner, 1st Runner-up, 2nd Runner-up).
- Live Leaderboard: Real-time auto-updating leaderboard categorized by Sports, Cultural, Gaming, and Literary streams.
- Certificate Engine: PDF certificate generation (Participation, Winner, Runner-Up, Volunteer, Coordinator) with unique Certificate ID, digital signature asset, QR code verification link, and PDF download.
- Public Certificate Verification Page: /verify-certificate/[id] to validate authenticity.

### R6. AI Fest Assistant, Announcements & Notifications
- AI Fest Assistant: Interactive conversational assistant answering natural language questions on schedule ("When is Badminton?"), venues ("Where is Chess?"), rules ("What are BGMI team rules?"), and general festival guidance.
- Announcement Center: Broadcast announcements categorized by General, Event Updates, Emergency Notices, and Results with search, priority tags, and notification badges.
- Notification Infrastructure: In-app notification center, email notification triggers, and FCM push notification architecture.

### R7. Analytics Dashboard, Data Export & Sponsor Management
- Admin Analytics: Visual dashboards with charts for total participants, event registrations, daily registration velocity, branch/gender distribution, category popularity, and attendance rates.
- Data Export: Export participant lists, event registrations, attendance sheets, and winner lists to CSV and Excel formats.
- Sponsor Management: Admin CRUD for sponsors with tier classification and homepage visibility toggles.

### R8. Security, PWA & DevOps Architecture
- Security: Strict RBAC middleware, Zod schema validation, CSRF protection, sanitized HTML/XSS prevention, rate limiting, and audit logging.
- PWA Support: manifest.json, service worker registration, offline caching fallback, and install prompts.
- Database & Prisma: Complete PostgreSQL Prisma schema with relations, indexes, constraints, soft deletes, and a rich database seed script (prisma/seed.ts) covering 15+ standard events, sample users across all roles, teams, and sample announcements.
- DevOps: Dockerfile, docker-compose.yml, .github/workflows/ci.yml, .env.example, and comprehensive README.md.

---

# Acceptance Criteria

- [ ] Complete codebase builds cleanly with npm run build with zero TypeScript or ESLint errors.
- [ ] Prisma schema is fully implemented with migrations and comprehensive seed data for all categories (Sports, Cultural, Gaming, Literary) and user roles.
- [ ] All 5 role-based dashboards (Admin, Coordinator, Volunteer, Team Captain, Participant) are fully functional with appropriate access guards.
- [ ] Team creation and invite code joining workflow validates team capacity constraints correctly.
- [ ] QR code generator generates scannable participant passes, and the scanner records event check-ins with duplicate prevention.
- [ ] PDF certificate generation creates verifiable certificates with unique IDs and working verification route.
- [ ] AI Fest Assistant accurately answers schedule, venue, and rules queries.
- [ ] Fully responsive dark-themed UI with Three.js/Framer Motion visual effects.
- [ ] Docker, docker-compose, and CI/CD pipelines are properly configured and operational.
- [ ] Zero placeholder/stub code — all components, Server Actions, API routes, and database queries are fully functional.

Critical Implementation Instruction:
The final application must be complete, production-grade, and fully functional with no TODO stubs or mock-only placeholders. Generate all source code, Prisma models, seed data, API routes, UI components, Docker setup, and documentation directly into the workspace.

## 2026-08-27T06:57:50Z

CRITICAL DESIGN UPDATE FROM USER:
Incorporate the official Stitch MCP Design System for ASTITVA 2K26 (Project `10141900030791112174` - 'Astitva 2K26 Festival Hub' / 'Astitva 2K26 Visual Framework'):

1. Color Palette & Tonal Layering:
   - Level 0 (Sidebar/Recesses): #030712 / #0b0e15
   - Level 1 (Canvas): #0A0A0A / #10131a
   - Level 2 (Glass Cards/Surfaces): #111827 / rgba(17, 24, 39, 0.7) with 1px solid rgba(255, 255, 255, 0.1) and backdrop-filter: blur(12px)
   - Primary Accent (Electric Blue): #3B82F6 / #adc6ff (with glow box-shadow: 0px 0px 20px rgba(59, 130, 246, 0.3))
   - Secondary Accent (Neon Purple): #8B5CF6 / #d0bcff
   - Tertiary Accent (Cyan): #06B6D4 / #4cd7f6
   - Gold Accent (Winners/VIP): #F59E0B

2. Typography:
   - Display & Headlines: Inter (700/800 bold, tight letter-spacing, metallic gradient text)
   - Body: Inter
   - Labels / Tech Meta / Badges / Numbers: JetBrains Mono

3. Components & Visuals:
   - Hero Section: WebGL/Three.js particle shader with blue/purple pulse, countdown timer cards, and glowing CTA buttons matching Stitch screen `9970fb738aa94514be81f4da6874c9c5`.
   - Participant Dashboard: Side navigation bar with Level 0 styling, Level 2 glass cards, glowing status dots (box-shadow: 0 0 8px currentColor), and quick action controls matching Stitch screen `81fb3a22dc1c4e9bbc5286e0614b65df`.
   - Admin Control Center: High-density operational stats, quick metric cards, analytics graphs matching Stitch screen `bcf81365838f4c8bab210179a7c506df`.

Please ensure all UI components and pages adhere strictly to this design system.

## 2026-08-27T14:48:28Z

The server has restarted and rate limits have reset. Please resume the ASTITVA 2K26 development project from where you left off. Continue executing Milestones M3 through M8, incorporating the Stitch MCP Design System (Astitva 2K26 Visual Framework), and driving all features to 100% completion and verification.

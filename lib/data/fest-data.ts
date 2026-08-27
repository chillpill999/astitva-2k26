// ============================================================================
// ASTITVA 2K26 - Resilient Fest Data Access Layer (DAL)
// Path: lib/data/fest-data.ts
// ============================================================================

import { prisma } from "@/lib/db/prisma";

export interface FestCategory {
  id: string;
  slug: string;
  name: string;
  type: string;
  description: string;
  icon: string;
  coverImage?: string | null;
  order: number;
  isActive: boolean;
  eventCount?: number;
  totalPrize?: number;
}

export interface FestEvent {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description: string;
  rules: string;
  categoryId: string;
  category?: {
    id: string;
    slug: string;
    name: string;
    icon?: string;
  } | null;
  venue: string;
  eventType: "INDIVIDUAL" | "TEAM";
  minTeamSize: number;
  maxTeamSize: number;
  registrationFee: number;
  maxRegistrations: number;
  currentRegistrations: number;
  prizePool: number;
  firstPrize?: string | null;
  secondPrize?: string | null;
  thirdPrize?: string | null;
  scheduleStart: Date;
  scheduleEnd: Date;
  dayNumber: number;
  status: "DRAFT" | "PUBLISHED" | "REGISTRATION_OPEN" | "REGISTRATION_CLOSED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  isFeatured: boolean;
  bannerImage?: string | null;
  coordinatorId?: string | null;
  coordinatorName?: string | null;
  coordinatorPhone?: string | null;
  coordinatorEmail?: string | null;
}

export interface FestSponsor {
  id: string;
  name: string;
  tier: "TITLE" | "POWERED_BY" | "GOLD" | "SILVER" | "BRONZE" | "MEDIA_PARTNER" | "COMMUNITY_PARTNER";
  logoUrl?: string | null;
  websiteUrl?: string | null;
  description?: string | null;
  order: number;
  isActive: boolean;
}

export interface FestCommitteeMember {
  id: string;
  name: string;
  role: string;
  category: "FACULTY" | "CORE_STUDENT" | "TECHNICAL" | "VOLUNTEER";
  department?: string | null;
  photoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  order: number;
  isActive: boolean;
}

export interface FestFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
}

export interface FestGalleryItem {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  category: string;
  year: number;
  isFeatured: boolean;
  order: number;
  description?: string;
}

// ----------------------------------------------------------------------------
// STATIC CANONICAL FALLBACK DATA (100% Matching prisma/seed.ts)
// ----------------------------------------------------------------------------

export const STATIC_CATEGORIES: FestCategory[] = [
  {
    id: "cat_sports",
    slug: "sports",
    name: "Sports",
    type: "SPORTS",
    description: "High-voltage athletic championships testing endurance, team tactics, and sporting excellence.",
    icon: "Trophy",
    coverImage: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80",
    order: 1,
    isActive: true,
    eventCount: 5,
    totalPrize: 75000,
  },
  {
    id: "cat_cultural",
    slug: "cultural",
    name: "Cultural",
    type: "CULTURAL",
    description: "Artistic brilliance across music, classical & modern dance, stand-up comedy, and high fashion.",
    icon: "Music",
    coverImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
    order: 2,
    isActive: true,
    eventCount: 4,
    totalPrize: 72000,
  },
  {
    id: "cat_gaming",
    slug: "gaming",
    name: "Gaming",
    type: "GAMING",
    description: "Esports arenas featuring high-stakes tactical combat, battle royales, and FPS tournaments.",
    icon: "Gamepad2",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    order: 3,
    isActive: true,
    eventCount: 3,
    totalPrize: 53000,
  },
  {
    id: "cat_literary",
    slug: "literary",
    name: "Literary",
    type: "LITERARY",
    description: "Cerebral battles of parliamentary debate, rapid-fire trivia, spoken poetry slams, and creative writing.",
    icon: "BookOpen",
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
    order: 4,
    isActive: true,
    eventCount: 4,
    totalPrize: 36000,
  },
];

export const STATIC_EVENTS: FestEvent[] = [
  // --- SPORTS (5 Events) ---
  {
    id: "evt_spt_cricket",
    slug: "cricket-tournament",
    title: "ASTITVA Cricket Championship (T10 Knockout)",
    subtitle: "The Flagship Inter-Branch Leather Ball Showdown",
    description: "Witness the ultimate inter-branch cricket spectacle. 10-over high-pressure knockout matches played with standard white leather balls on LNJPIT’s manicured turf.",
    rules: "1. Standard ICC T10 rules apply.\n2. 11 players per side + max 4 substitutes.\n3. Maximum 2 overs per bowler.\n4. Proper white team jerseys mandatory.\n5. Super Over in case of match tie.\n6. Umpire decisions are final and binding.",
    categoryId: "cat_sports",
    category: { id: "cat_sports", slug: "sports", name: "Sports", icon: "Trophy" },
    venue: "LNJPIT Main Cricket Oval",
    eventType: "TEAM",
    minTeamSize: 11,
    maxTeamSize: 15,
    registrationFee: 0,
    maxRegistrations: 16,
    currentRegistrations: 8,
    prizePool: 25000,
    firstPrize: "₹15,000 + Champions Rolling Trophy + Gold Medals",
    secondPrize: "₹7,000 + Silver Plate + Silver Medals",
    thirdPrize: "₹3,000 + Bronze Memento",
    scheduleStart: new Date("2026-09-04T09:00:00+05:30"),
    scheduleEnd: new Date("2026-09-07T16:30:00+05:30"),
    dayNumber: 1,
    status: "REGISTRATION_OPEN",
    isFeatured: true,
    bannerImage: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80",
    coordinatorName: "Prof. Rajesh Ranjan",
    coordinatorPhone: "+91 98765 43211",
    coordinatorEmail: "coordinator@lnjpit.ac.in",
  },
  {
    id: "evt_spt_football",
    slug: "football-championship",
    title: "Inter-Branch Football Cup (7v7 Turf War)",
    subtitle: "Fast-Paced 7-a-Side Football Tournament",
    description: "Pure footballing intensity on the LNJPIT grass turf. High speed, technical skill, and branch pride collide over 5 days of thrilling knockout matches.",
    rules: "1. 7-a-side with maximum 3 rolling substitutions.\n2. 25 minutes per half with a 5-minute break.\n3. Stud boots and shin guards compulsory.\n4. Direct penalty shoot-out (5 kicks) in case of a draw in knockout rounds.\n5. Yellow card leads to 2-minute sin-bin.",
    categoryId: "cat_sports",
    category: { id: "cat_sports", slug: "sports", name: "Sports", icon: "Trophy" },
    venue: "LNJPIT Football Arena",
    eventType: "TEAM",
    minTeamSize: 7,
    maxTeamSize: 10,
    registrationFee: 0,
    maxRegistrations: 16,
    currentRegistrations: 6,
    prizePool: 20000,
    firstPrize: "₹12,000 + Golden Boot Trophy + Gold Medals",
    secondPrize: "₹6,000 + Silver Shield",
    thirdPrize: "₹2,000 + Medals",
    scheduleStart: new Date("2026-09-04T14:30:00+05:30"),
    scheduleEnd: new Date("2026-09-08T12:00:00+05:30"),
    dayNumber: 1,
    status: "REGISTRATION_OPEN",
    isFeatured: true,
    bannerImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80",
    coordinatorName: "Sanjay Kumar (Sports Secretary)",
    coordinatorPhone: "+91 98765 43215",
    coordinatorEmail: "football.astitva@lnjpit.ac.in",
  },
  {
    id: "evt_spt_volleyball",
    slug: "volleyball-smash",
    title: "Spike Masters Volleyball Trophy",
    subtitle: "High-Flying Spikes & Rock-Solid Defense",
    description: "Feel the power of tactical setting, soaring spikes, and diving digs under the floodlights at the outdoor volleyball court.",
    rules: "1. Best of 3 sets of 25 points each (Decider set 15 points).\n2. Standard FIVB net height and 6-player rotation rules.\n3. Net contact or crossing center line constitutes a foul.\n4. Maximum 2 timeouts per set per team.",
    categoryId: "cat_sports",
    category: { id: "cat_sports", slug: "sports", name: "Sports", icon: "Trophy" },
    venue: "Outdoor Volleyball Court (Near Hostel 2)",
    eventType: "TEAM",
    minTeamSize: 6,
    maxTeamSize: 8,
    registrationFee: 0,
    maxRegistrations: 12,
    currentRegistrations: 4,
    prizePool: 12000,
    firstPrize: "₹7,000 + Champions Trophy",
    secondPrize: "₹3,500 + Silver Medals",
    thirdPrize: "₹1,500 + Certificate of Merit",
    scheduleStart: new Date("2026-09-05T09:30:00+05:30"),
    scheduleEnd: new Date("2026-09-06T17:00:00+05:30"),
    dayNumber: 2,
    status: "REGISTRATION_OPEN",
    isFeatured: false,
    bannerImage: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80",
    coordinatorName: "Rishi Raj",
    coordinatorPhone: "+91 98765 43216",
    coordinatorEmail: "volleyball.astitva@lnjpit.ac.in",
  },
  {
    id: "evt_spt_badminton",
    slug: "badminton-clash",
    title: "Shuttle Smash Badminton Championship",
    subtitle: "Singles & Doubles Indoor Racket Battle",
    description: "Lightning reflex smashes, tactical drop shots, and intense endurance duels on synthetic indoor courts.",
    rules: "1. BWF 21-point rally scoring system (best of 3 games).\n2. Yonex Mavis 350 nylon shuttles provided by organizing committee.\n3. Non-marking indoor badminton shoes strictly mandatory.\n4. 2-minute interval between games.",
    categoryId: "cat_sports",
    category: { id: "cat_sports", slug: "sports", name: "Sports", icon: "Trophy" },
    venue: "Indoor Sports Complex Hall A",
    eventType: "INDIVIDUAL",
    minTeamSize: 1,
    maxTeamSize: 2,
    registrationFee: 0,
    maxRegistrations: 32,
    currentRegistrations: 14,
    prizePool: 10000,
    firstPrize: "₹6,000 + Gold Trophy",
    secondPrize: "₹3,000 + Silver Medal",
    thirdPrize: "₹1,000 + Bronze Medal",
    scheduleStart: new Date("2026-09-05T10:00:00+05:30"),
    scheduleEnd: new Date("2026-09-07T14:00:00+05:30"),
    dayNumber: 2,
    status: "REGISTRATION_OPEN",
    isFeatured: false,
    bannerImage: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
    coordinatorName: "Neha Singh",
    coordinatorPhone: "+91 98765 43217",
    coordinatorEmail: "badminton.astitva@lnjpit.ac.in",
  },
  {
    id: "evt_spt_chess",
    slug: "grandmaster-chess",
    title: "Grandmaster Chess Championship",
    subtitle: "Battle of 64 Squares: Strategy, Tactics & Mental Grit",
    description: "Step into the silent battlefield of grandmasters. Five rounds of Swiss system rapid chess with digital clocks and fide-standard arbiter supervision.",
    rules: "1. 5-Round FIDE Swiss System with digital chess clocks.\n2. Time control: 15 minutes + 10 seconds increment per move from move 1.\n3. Touch-move rule strictly enforced.\n4. Mobile phones or smartwatches strictly forbidden in the playing hall.\n5. Tie-break via Buchholz and Sonneborn-Berger systems.",
    categoryId: "cat_sports",
    category: { id: "cat_sports", slug: "sports", name: "Sports", icon: "Trophy" },
    venue: "Central Library Reading Hall (AC)",
    eventType: "INDIVIDUAL",
    minTeamSize: 1,
    maxTeamSize: 1,
    registrationFee: 0,
    maxRegistrations: 64,
    currentRegistrations: 28,
    prizePool: 8000,
    firstPrize: "₹5,000 + Grandmaster Trophy + Gold Medal",
    secondPrize: "₹2,000 + Silver Medal",
    thirdPrize: "₹1,000 + Bronze Medal",
    scheduleStart: new Date("2026-09-04T11:00:00+05:30"),
    scheduleEnd: new Date("2026-09-05T16:00:00+05:30"),
    dayNumber: 1,
    status: "REGISTRATION_OPEN",
    isFeatured: false,
    bannerImage: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&auto=format&fit=crop&q=80",
    coordinatorName: "Prof. S. N. Mishra",
    coordinatorPhone: "+91 98765 43218",
    coordinatorEmail: "chess.astitva@lnjpit.ac.in",
  },

  // --- CULTURAL (4 Events) ---
  {
    id: "evt_clt_dance",
    slug: "nrityangana-dance",
    title: "Nrityangana (Solo & Group Dance Battle)",
    subtitle: "Classical Grace, Bollywood Beats & Urban Hip-Hop",
    description: "The mega dance extravaganza of ASTITVA 2K26. Solo performers and dynamic crews light up the grand amphitheatre with choreography, rhythm, and costume splendor.",
    rules: "1. Solo performance: 3 to 5 minutes. Group performance (4-10 members): 6 to 10 minutes.\n2. Audio soundtrack must be submitted 24 hours prior in MP3 320kbps format.\n3. Props allowed with prior safety clearance.\n4. Judging parameters: Choreography, Synchronization, Expressions, Stage Utilization, Costumes.",
    categoryId: "cat_cultural",
    category: { id: "cat_cultural", slug: "cultural", name: "Cultural", icon: "Music" },
    venue: "Open Air Theatre (OAT Main Stage)",
    eventType: "TEAM",
    minTeamSize: 1,
    maxTeamSize: 10,
    registrationFee: 0,
    maxRegistrations: 20,
    currentRegistrations: 11,
    prizePool: 22000,
    firstPrize: "₹12,000 + Nrityangana Rolling Trophy + Gold Medals",
    secondPrize: "₹7,000 + Silver Mementos",
    thirdPrize: "₹3,000 + Bronze Mementos",
    scheduleStart: new Date("2026-09-05T17:30:00+05:30"),
    scheduleEnd: new Date("2026-09-05T21:30:00+05:30"),
    dayNumber: 2,
    status: "REGISTRATION_OPEN",
    isFeatured: true,
    bannerImage: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop&q=80",
    coordinatorName: "Shalini Priya",
    coordinatorPhone: "+91 98765 43219",
    coordinatorEmail: "dance.astitva@lnjpit.ac.in",
  },
  {
    id: "evt_clt_singing",
    slug: "sur-sangam-singing",
    title: "Sur Sangam (Voice of Astitva)",
    subtitle: "Vocal Melody Across Classical, Sufi, Folk & Bollywood",
    description: "Discover the premier singing talents of LNJPIT. Two rounds of pure acoustic mastery featuring eastern classical, semi-classical, folk, and contemporary playback.",
    rules: "1. Round 1: Eastern Classical / Raag / Semi-Classical / Folk (Max 3 mins).\n2. Round 2: Contemporary / Bollywood / Free Choice (Max 4 mins).\n3. Single acoustic instrument (guitar, harmonium, flute) or karaoke backing track permitted.\n4. Autotune or digital voice processors strictly forbidden.",
    categoryId: "cat_cultural",
    category: { id: "cat_cultural", slug: "cultural", name: "Cultural", icon: "Music" },
    venue: "Kalakshetra Auditorium",
    eventType: "INDIVIDUAL",
    minTeamSize: 1,
    maxTeamSize: 2,
    registrationFee: 0,
    maxRegistrations: 30,
    currentRegistrations: 18,
    prizePool: 15000,
    firstPrize: "₹8,000 + Golden Microphone Trophy",
    secondPrize: "₹5,000 + Silver Memento",
    thirdPrize: "₹2,000 + Bronze Memento",
    scheduleStart: new Date("2026-09-06T17:00:00+05:30"),
    scheduleEnd: new Date("2026-09-06T20:30:00+05:30"),
    dayNumber: 3,
    status: "REGISTRATION_OPEN",
    isFeatured: false,
    bannerImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
    coordinatorName: "Abhinav Kashyap",
    coordinatorPhone: "+91 98765 43220",
    coordinatorEmail: "music.astitva@lnjpit.ac.in",
  },
  {
    id: "evt_clt_comedy",
    slug: "hasya-kosh-comedy",
    title: "Hasya Kosh (Stand-Up & Comic Act)",
    subtitle: "Punchlines, Relatable Engineering Humor & Pure Satire",
    description: "An evening of uproarious laughter as LNJPIT comics bring their sharpest observations, engineering hostel tales, and relatable campus humor to the stage.",
    rules: "1. Time limit: 5 to 7 minutes on stage.\n2. Content must be 100% original.\n3. Hate speech, vulgarity, or personal religious attacks result in immediate disqualification.\n4. Judged on punchline timing, delivery cadence, crowd engagement, and originality.",
    categoryId: "cat_cultural",
    category: { id: "cat_cultural", slug: "cultural", name: "Cultural", icon: "Music" },
    venue: "Mini Auditorium (Civil Dept Building)",
    eventType: "INDIVIDUAL",
    minTeamSize: 1,
    maxTeamSize: 1,
    registrationFee: 0,
    maxRegistrations: 20,
    currentRegistrations: 9,
    prizePool: 10000,
    firstPrize: "₹6,000 + Comic Maestro Trophy",
    secondPrize: "₹3,000 + Silver Medal",
    thirdPrize: "₹1,000 + Bronze Medal",
    scheduleStart: new Date("2026-09-06T14:00:00+05:30"),
    scheduleEnd: new Date("2026-09-06T17:00:00+05:30"),
    dayNumber: 3,
    status: "REGISTRATION_OPEN",
    isFeatured: false,
    bannerImage: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&auto=format&fit=crop&q=80",
    coordinatorName: "Kunal Roy",
    coordinatorPhone: "+91 98765 43221",
    coordinatorEmail: "comedy.astitva@lnjpit.ac.in",
  },
  {
    id: "evt_clt_rampwalk",
    slug: "glamour-grace-rampwalk",
    title: "Glamour & Grace (Ethnic & Cyberpunk Runway)",
    subtitle: "Haute Couture, Traditional Roots & Futuristic Fashion",
    description: "The glamour climax of ASTITVA 2K26. Teams showcase striking attire blending authentic Indian handlooms with cutting-edge cyberpunk aesthetics under stadium runway lights.",
    rules: "1. Team composition: 6 to 12 models.\n2. Stage duration: 10 to 12 minutes.\n3. Theme: 'Indian Heritage to Cyberpunk 2026'.\n4. Synchronized theme track & narration submitted 24h prior.\n5. Judged on poise, walk posture, theme interpretation, coordination, and styling.",
    categoryId: "cat_cultural",
    category: { id: "cat_cultural", slug: "cultural", name: "Cultural", icon: "Music" },
    venue: "Central Festival Stage",
    eventType: "TEAM",
    minTeamSize: 6,
    maxTeamSize: 12,
    registrationFee: 0,
    maxRegistrations: 10,
    currentRegistrations: 5,
    prizePool: 25000,
    firstPrize: "₹15,000 + Couture Trophy + Certificates of Excellence",
    secondPrize: "₹7,000 + Silver Mementos",
    thirdPrize: "₹3,000 + Medals",
    scheduleStart: new Date("2026-09-07T19:00:00+05:30"),
    scheduleEnd: new Date("2026-09-07T22:00:00+05:30"),
    dayNumber: 4,
    status: "REGISTRATION_OPEN",
    isFeatured: true,
    bannerImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
    coordinatorName: "Pooja Jha",
    coordinatorPhone: "+91 98765 43222",
    coordinatorEmail: "fashion.astitva@lnjpit.ac.in",
  },

  // --- GAMING (3 Events) ---
  {
    id: "evt_gam_bgmi",
    slug: "bgmi-mobile-battlefield",
    title: "BGMI Mobile Esports Championship",
    subtitle: "Battlegrounds Mobile India 4v4 Squad Showdown",
    description: "The adrenaline-fueled battle royale spectacle. 16 top collegiate squads drop into Erangel and Miramar for the ultimate chicken dinner and championship glory.",
    rules: "1. Squad of 4 main players + 1 registered sub.\n2. Official BGIS scoring matrix (Placement points + 1 point per elimination).\n3. Handheld mobile phones only (Triggers, emulators, iPad views strictly banned).\n4. All players must play over the verified college LAN/Wi-Fi hub.",
    categoryId: "cat_gaming",
    category: { id: "cat_gaming", slug: "gaming", name: "Gaming", icon: "Gamepad2" },
    venue: "LAN Gaming Arena (CSE Dept Lab 1)",
    eventType: "TEAM",
    minTeamSize: 4,
    maxTeamSize: 5,
    registrationFee: 0,
    maxRegistrations: 32,
    currentRegistrations: 16,
    prizePool: 20000,
    firstPrize: "₹12,000 + Esports Champion Shield + Gold Badges",
    secondPrize: "₹6,000 + Silver Badges",
    thirdPrize: "₹2,000 + Bronze Badges",
    scheduleStart: new Date("2026-09-04T13:00:00+05:30"),
    scheduleEnd: new Date("2026-09-05T18:00:00+05:30"),
    dayNumber: 1,
    status: "REGISTRATION_OPEN",
    isFeatured: true,
    bannerImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    coordinatorName: "Aryan Gupta",
    coordinatorPhone: "+91 98765 43223",
    coordinatorEmail: "bgmi.astitva@lnjpit.ac.in",
  },
  {
    id: "evt_gam_freefire",
    slug: "free-fire-clash-squad",
    title: "Free Fire Clash Squad Tournament",
    subtitle: "Fast-Paced 4v4 Intense Tactical Firefights",
    description: "Rapid reflex weapon buys, gloo wall mastery, and clutch team plays in a bracketed 4v4 Clash Squad tournament format.",
    rules: "1. 4v4 Clash Squad custom rooms.\n2. Best of 7 rounds knockout matches; Best of 11 for Grand Finals.\n3. Mobile phones only; third-party GFX tools or macro configs prohibited.\n4. Default competitive room settings (Limited Ammo: Yes, Character Skill: On).",
    categoryId: "cat_gaming",
    category: { id: "cat_gaming", slug: "gaming", name: "Gaming", icon: "Gamepad2" },
    venue: "LAN Gaming Arena (CSE Dept Lab 2)",
    eventType: "TEAM",
    minTeamSize: 4,
    maxTeamSize: 4,
    registrationFee: 0,
    maxRegistrations: 24,
    currentRegistrations: 12,
    prizePool: 15000,
    firstPrize: "₹9,000 + Free Fire Champions Trophy",
    secondPrize: "₹4,500 + Silver Medals",
    thirdPrize: "₹1,500 + Bronze Medals",
    scheduleStart: new Date("2026-09-06T10:30:00+05:30"),
    scheduleEnd: new Date("2026-09-06T15:30:00+05:30"),
    dayNumber: 3,
    status: "REGISTRATION_OPEN",
    isFeatured: false,
    bannerImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
    coordinatorName: "Rahul Tiwari",
    coordinatorPhone: "+91 98765 43224",
    coordinatorEmail: "freefire.astitva@lnjpit.ac.in",
  },
  {
    id: "evt_gam_valorant",
    slug: "valorant-lan-warfare",
    title: "Valorant Tactical LAN Warfare",
    subtitle: "5v5 Spike Plant & Defuse Cyber Combat",
    description: "High-tier tactical FPS competition. 5v5 team lineups, agent utility combos, and precision headshots on high-refresh-rate PC rigs in LNJPIT computing centers.",
    rules: "1. Standard 5v5 competitive mode with coach slot permitted.\n2. Map Pool: Ascent, Bind, Haven, Split, Sunset.\n3. Single elimination BO1 up to Quarterfinals; BO3 for Semifinals & Finals.\n4. Tactical timeouts: 2 per team per map (60 seconds each).",
    categoryId: "cat_gaming",
    category: { id: "cat_gaming", slug: "gaming", name: "Gaming", icon: "Gamepad2" },
    venue: "High-Performance Computing Lab",
    eventType: "TEAM",
    minTeamSize: 5,
    maxTeamSize: 6,
    registrationFee: 0,
    maxRegistrations: 16,
    currentRegistrations: 8,
    prizePool: 18000,
    firstPrize: "₹11,000 + Valorant Radiant Shield + Gold Medals",
    secondPrize: "₹5,000 + Silver Medals",
    thirdPrize: "₹2,000 + Certificates",
    scheduleStart: new Date("2026-09-05T11:00:00+05:30"),
    scheduleEnd: new Date("2026-09-06T18:00:00+05:30"),
    dayNumber: 2,
    status: "REGISTRATION_OPEN",
    isFeatured: true,
    bannerImage: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80",
    coordinatorName: "Devansh Saxena",
    coordinatorPhone: "+91 98765 43225",
    coordinatorEmail: "valorant.astitva@lnjpit.ac.in",
  },

  // --- LITERARY (4 Events) ---
  {
    id: "evt_lit_debate",
    slug: "tark-vitark-debate",
    title: "Tark-Vitark (Parliamentary Debate)",
    subtitle: "Oratory Eloquence, Logic & Critical Cross-Examination",
    description: "The ultimate battle of arguments. Two-member parliamentary teams defend and oppose hot-topic socio-technological motions before a distinguished jury.",
    rules: "1. 2-member teams (1 For the Motion, 1 Against the Motion).\n2. Time format: 3-minute constructive speech + 1-minute interjection + 2-minute rebuttal.\n3. Medium of debate: English or Hindi.\n4. Judged on argumentation, evidence quality, rhetorical style, and rebuttal poise.",
    categoryId: "cat_literary",
    category: { id: "cat_literary", slug: "literary", name: "Literary", icon: "BookOpen" },
    venue: "Senate Hall (Administrative Block)",
    eventType: "TEAM",
    minTeamSize: 2,
    maxTeamSize: 2,
    registrationFee: 0,
    maxRegistrations: 24,
    currentRegistrations: 10,
    prizePool: 10000,
    firstPrize: "₹6,000 + Orator Champions Trophy",
    secondPrize: "₹3,000 + Silver Medal",
    thirdPrize: "₹1,000 + Bronze Medal",
    scheduleStart: new Date("2026-09-04T10:30:00+05:30"),
    scheduleEnd: new Date("2026-09-04T14:30:00+05:30"),
    dayNumber: 1,
    status: "REGISTRATION_OPEN",
    isFeatured: false,
    bannerImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80",
    coordinatorName: "Dr. Suniti Pathak",
    coordinatorPhone: "+91 98765 43226",
    coordinatorEmail: "debate.astitva@lnjpit.ac.in",
  },
  {
    id: "evt_lit_quiz",
    slug: "prashnavali-tech-fest-quiz",
    title: "Prashnavali (Mega Tech & Fest Trivia Quiz)",
    subtitle: "Science, Pop Culture, Current Affairs & Tech Trivia",
    description: "A mind-bending quiz with written screening prelims followed by a thrilling audio-visual buzzer showdown on the big stage.",
    rules: "1. Teams of 2 or 3 members.\n2. Round 1: 30-question written screening test (20 mins).\n3. Top 6 teams qualify for the live on-stage finals.\n4. Finals feature Audio-Visual, Rapid Fire, and Pounce-Bounce rounds.",
    categoryId: "cat_literary",
    category: { id: "cat_literary", slug: "literary", name: "Literary", icon: "BookOpen" },
    venue: "Main Seminar Hall",
    eventType: "TEAM",
    minTeamSize: 2,
    maxTeamSize: 3,
    registrationFee: 0,
    maxRegistrations: 30,
    currentRegistrations: 14,
    prizePool: 12000,
    firstPrize: "₹7,000 + Quiz Whiz Trophy + Gold Medals",
    secondPrize: "₹3,500 + Silver Medals",
    thirdPrize: "₹1,500 + Bronze Medals",
    scheduleStart: new Date("2026-09-05T14:00:00+05:30"),
    scheduleEnd: new Date("2026-09-05T17:30:00+05:30"),
    dayNumber: 2,
    status: "REGISTRATION_OPEN",
    isFeatured: false,
    bannerImage: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=80",
    coordinatorName: "Prakash Jha",
    coordinatorPhone: "+91 98765 43227",
    coordinatorEmail: "quiz.astitva@lnjpit.ac.in",
  },
  {
    id: "evt_lit_poetry",
    slug: "kavyanjali-poetry-slam",
    title: "Kavyanjali (Hindi & Urdu Poetry Slam)",
    subtitle: "Shayari, Nazm, Kavita & Spoken Word Expressions",
    description: "An enchanting evening of soulful verses, rhythmic cadence, and emotive recitation celebrating Hindi and Urdu poetic traditions.",
    rules: "1. Individual performance of 4 to 6 minutes.\n2. Poems must be original compositions by the participant.\n3. Judged on lyrical depth, meter/rhyme, voice modulation, and stage presence.",
    categoryId: "cat_literary",
    category: { id: "cat_literary", slug: "literary", name: "Literary", icon: "BookOpen" },
    venue: "Open Air Amphitheatre Gazebo",
    eventType: "INDIVIDUAL",
    minTeamSize: 1,
    maxTeamSize: 1,
    registrationFee: 0,
    maxRegistrations: 25,
    currentRegistrations: 12,
    prizePool: 8000,
    firstPrize: "₹5,000 + Kavi Ratna Trophy",
    secondPrize: "₹2,000 + Silver Medal",
    thirdPrize: "₹1,000 + Bronze Medal",
    scheduleStart: new Date("2026-09-06T18:00:00+05:30"),
    scheduleEnd: new Date("2026-09-06T21:00:00+05:30"),
    dayNumber: 3,
    status: "REGISTRATION_OPEN",
    isFeatured: false,
    bannerImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
    coordinatorName: "Dr. Anupama Kumari",
    coordinatorPhone: "+91 98765 43228",
    coordinatorEmail: "poetry.astitva@lnjpit.ac.in",
  },
  {
    id: "evt_lit_writing",
    slug: "kalamkar-creative-writing",
    title: "Kalamkar (On-the-Spot Creative Writing)",
    subtitle: "Stories, Essays & Micro-Fiction Under Time Pressure",
    description: "Test your spontaneity and narrative imagination. Secret theme prompts revealed on stage with 90 minutes of focused writing time.",
    rules: "1. 90 minutes time duration.\n2. Word limit: 800 - 1200 words.\n3. Prompt revealed at commencement of the session.\n4. Plagiarism or AI assistance leads to immediate disqualification.",
    categoryId: "cat_literary",
    category: { id: "cat_literary", slug: "literary", name: "Literary", icon: "BookOpen" },
    venue: "Computer Center Examination Hall",
    eventType: "INDIVIDUAL",
    minTeamSize: 1,
    maxTeamSize: 1,
    registrationFee: 0,
    maxRegistrations: 40,
    currentRegistrations: 15,
    prizePool: 6000,
    firstPrize: "₹3,500 + Kalamkar Laurels Trophy",
    secondPrize: "₹1,500 + Silver Medal",
    thirdPrize: "₹1,000 + Bronze Medal",
    scheduleStart: new Date("2026-09-07T10:00:00+05:30"),
    scheduleEnd: new Date("2026-09-07T12:30:00+05:30"),
    dayNumber: 4,
    status: "REGISTRATION_OPEN",
    isFeatured: false,
    bannerImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
    coordinatorName: "Prof. Vinod Pandey",
    coordinatorPhone: "+91 98765 43229",
    coordinatorEmail: "writing.astitva@lnjpit.ac.in",
  },
];

export const STATIC_SPONSORS: FestSponsor[] = [
  {
    id: "sp_01",
    name: "Bihar State Electronics Development Corp (BELTRON)",
    tier: "TITLE",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
    websiteUrl: "https://beltron.bihar.gov.in",
    description: "Title Sponsor powering technology, computing infrastructure, and digital innovation at ASTITVA 2K26.",
    order: 1,
    isActive: true,
  },
  {
    id: "sp_02",
    name: "Department of Science, Technology & Technical Education (DSTTE Bihar)",
    tier: "POWERED_BY",
    logoUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&auto=format&fit=crop&q=80",
    websiteUrl: "https://dst.bihar.gov.in",
    description: "Official Patron & Government Partner supporting engineering youth advancement.",
    order: 2,
    isActive: true,
  },
  {
    id: "sp_03",
    name: "State Bank of India (LNJPIT Campus Branch)",
    tier: "GOLD",
    logoUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&auto=format&fit=crop&q=80",
    websiteUrl: "https://sbi.co.in",
    description: "Official Banking & Prize Distribution Partner for ASTITVA 2K26 champion prize purses.",
    order: 3,
    isActive: true,
  },
  {
    id: "sp_04",
    name: "Red Bull India",
    tier: "SILVER",
    logoUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&auto=format&fit=crop&q=80",
    websiteUrl: "https://redbull.com",
    description: "Official Energy Drink & Esports Partner powering continuous collegiate adrenaline.",
    order: 4,
    isActive: true,
  },
  {
    id: "sp_05",
    name: "LNJPIT Alumni Global Network",
    tier: "COMMUNITY_PARTNER",
    logoUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80",
    websiteUrl: "https://lnjpit.ac.in/alumni",
    description: "Mentorship and career network partner celebrating student engineering excellence.",
    order: 5,
    isActive: true,
  },
];

export const STATIC_COMMITTEE: FestCommitteeMember[] = [
  {
    id: "cm_01",
    name: "Dr. Shailendra Kumar",
    role: "Principal & Chief Patron",
    category: "FACULTY",
    department: "Administration",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    email: "principal@lnjpit.ac.in",
    phone: "+91 98765 43210",
    linkedinUrl: "https://linkedin.com/school/lnjpit-chapra",
    githubUrl: "https://github.com/lnjpit-chapra",
    order: 1,
    isActive: true,
  },
  {
    id: "cm_02",
    name: "Prof. Rajesh Ranjan",
    role: "Faculty Convener & Sports Head",
    category: "FACULTY",
    department: "Electronics & Communication Engineering",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    email: "coordinator@lnjpit.ac.in",
    phone: "+91 98765 43211",
    linkedinUrl: "https://linkedin.com/in/rajesh-ranjan-lnjpit",
    githubUrl: "https://github.com/rajesh-ranjan-lnjpit",
    order: 2,
    isActive: true,
  },
  {
    id: "cm_03",
    name: "Aman Verma",
    role: "Student General Secretary",
    category: "CORE_STUDENT",
    department: "Mechanical Engineering (6th Sem)",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    email: "captain@lnjpit.ac.in",
    phone: "+91 98765 43213",
    linkedinUrl: "https://linkedin.com/in/aman-verma-lnjpit",
    githubUrl: "https://github.com/aman-verma-lnjpit",
    order: 3,
    isActive: true,
  },
  {
    id: "cm_04",
    name: "Ananya Sharma",
    role: "Student Technical & Logistics Lead",
    category: "TECHNICAL",
    department: "Electrical Engineering (4th Sem)",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    email: "volunteer@lnjpit.ac.in",
    phone: "+91 98765 43212",
    linkedinUrl: "https://linkedin.com/in/ananya-sharma-lnjpit",
    githubUrl: "https://github.com/ananya-sharma-lnjpit",
    order: 4,
    isActive: true,
  },
  {
    id: "cm_05",
    name: "Sneha Kumari",
    role: "Cultural & Literary Secretary",
    category: "CORE_STUDENT",
    department: "Civil Engineering (2nd Sem)",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80",
    email: "participant@lnjpit.ac.in",
    phone: "+91 98765 43214",
    linkedinUrl: "https://linkedin.com/in/sneha-kumari-lnjpit",
    githubUrl: "https://github.com/sneha-kumari-lnjpit",
    order: 5,
    isActive: true,
  },
  {
    id: "cm_06",
    name: "Aryan Gupta",
    role: "Esports & LAN Arena Lead",
    category: "VOLUNTEER",
    department: "Computer Science & Engineering",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
    email: "bgmi.astitva@lnjpit.ac.in",
    phone: "+91 98765 43223",
    linkedinUrl: "https://linkedin.com",
    githubUrl: "https://github.com",
    order: 6,
    isActive: true,
  },
];

export const STATIC_FAQS: FestFaq[] = [
  {
    id: "faq_01",
    question: "Who is eligible to participate in ASTITVA 2K26?",
    answer: "All enrolled undergraduate students of LNJPIT Chapra from CSE, ME, CE, EE, and ECE branches across 1st to 8th semesters are eligible with a valid College Roll Number / ID Card.",
    category: "Eligibility",
    order: 1,
    isPublished: true,
  },
  {
    id: "faq_02",
    question: "Is there any registration fee for LNJPIT students?",
    answer: "No, participation in all 16 tournaments across all 4 categories (Sports, Cultural, Gaming, Literary) is 100% free for all bona fide students of LNJPIT Chapra.",
    category: "Registrations",
    order: 2,
    isPublished: true,
  },
  {
    id: "faq_03",
    question: "How do I create or join a team with an invite code?",
    answer: "The team captain creates the squad first, which generates a unique 6-character alphanumeric code (e.g. BG26X1 or TITN26). Other team members use the '/teams/join/[code]' page or enter the code in their dashboard.",
    category: "Teams",
    order: 3,
    isPublished: true,
  },
  {
    id: "faq_04",
    question: "How does the QR participant pass work at event venues?",
    answer: "Once registered, your encrypted digital QR pass is accessible on your profile and participant dashboard. Volunteers at entry gates and stadiums scan your QR code with web cameras for instant contactless check-in.",
    category: "Attendance",
    order: 4,
    isPublished: true,
  },
  {
    id: "faq_05",
    question: "How can certificates be verified by employers or external institutions?",
    answer: "Every certificate generated contains a unique Certificate ID (e.g. AST26-CERT-10492) and an HMAC-SHA256 digital signature that can be verified publicly at '/verify-certificate/[id]'.",
    category: "Certificates",
    order: 5,
    isPublished: true,
  },
  {
    id: "faq_06",
    question: "Can a student participate in multiple tournaments across different categories?",
    answer: "Yes! Students may register for up to 3 individual events and 2 team events, provided the match schedules on Days 1 through 5 do not clash with each other.",
    category: "Eligibility",
    order: 6,
    isPublished: true,
  },
  {
    id: "faq_07",
    question: "What are the accommodation and food arrangements for outstation participants & hostelers?",
    answer: "Free campus dining coupons and allocated resting lounges in Aryabhata and Gargi Hostels are provided to all verified athletes and team captains throughout the 5 festival days.",
    category: "Attendance",
    order: 7,
    isPublished: true,
  },
];

export const STATIC_GALLERY: FestGalleryItem[] = [
  {
    id: "gal_01",
    title: "Championship Cricket Final Match (T10)",
    mediaUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80",
    mediaType: "IMAGE",
    category: "Sports",
    year: 2025,
    isFeatured: true,
    order: 1,
    description: "High-octane last over thriller on the LNJPIT main oval.",
  },
  {
    id: "gal_02",
    title: "Nrityangana Classical & Modern Fusion Showcase",
    mediaUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop&q=80",
    mediaType: "IMAGE",
    category: "Cultural",
    year: 2025,
    isFeatured: true,
    order: 2,
    description: "Vibrant stage choreography and laser lighting at OAT.",
  },
  {
    id: "gal_03",
    title: "LAN Gaming Arena BGMI Esports Finalists",
    mediaUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    mediaType: "IMAGE",
    category: "Gaming",
    year: 2025,
    isFeatured: true,
    order: 3,
    description: "16 squad showdown under high-speed gigabit Wi-Fi.",
  },
  {
    id: "gal_04",
    title: "Tark-Vitark Parliamentary Debate Championship",
    mediaUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80",
    mediaType: "IMAGE",
    category: "Literary",
    year: 2025,
    isFeatured: true,
    order: 4,
    description: "Heated rebuttal exchanges in the administrative Senate Hall.",
  },
  {
    id: "gal_05",
    title: "Grand Inauguration Ceremony & Torch Lighting",
    mediaUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
    mediaType: "IMAGE",
    category: "Ceremonies",
    year: 2025,
    isFeatured: true,
    order: 5,
    description: "Dignitaries, faculty patrons, and student captains igniting the festival torch.",
  },
  {
    id: "gal_06",
    title: "Glamour & Grace Cyberpunk Runway Finale",
    mediaUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
    mediaType: "IMAGE",
    category: "Cultural",
    year: 2025,
    isFeatured: true,
    order: 6,
    description: "Stunning handloom fusion ramp walk under floodlights.",
  },
  {
    id: "gal_07",
    title: "Shuttle Smash Badminton Knockout Action",
    mediaUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
    mediaType: "IMAGE",
    category: "Sports",
    year: 2025,
    isFeatured: false,
    order: 7,
    description: "Indoor sports complex championship matches.",
  },
  {
    id: "gal_08",
    title: "Star Cultural Night & Grand Valedictory DJ Session",
    mediaUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
    mediaType: "IMAGE",
    category: "Ceremonies",
    year: 2025,
    isFeatured: true,
    order: 8,
    description: "Celebration and prize distributions marking the grand fest finale.",
  },
];

// ----------------------------------------------------------------------------
// RESILIENT DATA ACCESS FUNCTIONS
// ----------------------------------------------------------------------------

/**
 * Retrieves festival categories from database with static fallback.
 */
export async function getFestCategories(): Promise<FestCategory[]> {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { events: true } },
        events: { select: { prizePool: true } },
      },
      orderBy: { order: "asc" },
    });

    if (categories && categories.length > 0) {
      return categories.map((cat: any) => ({
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        type: String(cat.type),
        description: cat.description,
        icon: cat.icon,
        coverImage: cat.coverImage,
        order: cat.order,
        isActive: cat.isActive,
        eventCount: cat._count?.events ?? 0,
        totalPrize: cat.events?.reduce((acc: number, e: any) => acc + (e.prizePool || 0), 0) ?? 0,
      }));
    }
  } catch (error) {
    // Database offline or query issue — safely fall back to static constants
  }
  return STATIC_CATEGORIES;
}

/**
 * Retrieves festival events, optionally filtered by category or featured status.
 */
export async function getFestEvents(options?: {
  categoryId?: string;
  categorySlug?: string;
  isFeatured?: boolean;
  dayNumber?: number;
}): Promise<FestEvent[]> {
  try {
    const where: any = {};
    if (options?.categoryId) where.categoryId = options.categoryId;
    if (options?.isFeatured !== undefined) where.isFeatured = options.isFeatured;
    if (options?.dayNumber !== undefined) where.dayNumber = options.dayNumber;

    if (options?.categorySlug) {
      const cat = await prisma.category.findUnique({
        where: { slug: options.categorySlug },
      });
      if (cat) where.categoryId = cat.id;
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        category: {
          select: { id: true, slug: true, name: true, icon: true },
        },
      },
      orderBy: [{ dayNumber: "asc" }, { scheduleStart: "asc" }],
    });

    if (events && events.length > 0) {
      return events.map((e: any) => ({
        id: e.id,
        slug: e.slug,
        title: e.title,
        subtitle: e.subtitle,
        description: e.description,
        rules: e.rules,
        categoryId: e.categoryId,
        category: e.category,
        venue: e.venue,
        eventType: e.eventType as "INDIVIDUAL" | "TEAM",
        minTeamSize: e.minTeamSize,
        maxTeamSize: e.maxTeamSize,
        registrationFee: Number(e.registrationFee || 0),
        maxRegistrations: e.maxRegistrations,
        currentRegistrations: e.currentRegistrations,
        prizePool: Number(e.prizePool || 0),
        firstPrize: e.firstPrize,
        secondPrize: e.secondPrize,
        thirdPrize: e.thirdPrize,
        scheduleStart: new Date(e.scheduleStart),
        scheduleEnd: new Date(e.scheduleEnd),
        dayNumber: e.dayNumber,
        status: e.status,
        isFeatured: e.isFeatured,
        bannerImage: e.bannerImage,
        coordinatorId: e.coordinatorId,
        coordinatorName: e.coordinatorName,
        coordinatorPhone: e.coordinatorPhone,
        coordinatorEmail: e.coordinatorEmail,
      }));
    }
  } catch (error) {
    // Database offline or query issue
  }

  // Fallback to in-memory static items
  let filtered = [...STATIC_EVENTS];
  if (options?.categoryId) {
    filtered = filtered.filter((e) => e.categoryId === options.categoryId);
  }
  if (options?.categorySlug) {
    filtered = filtered.filter((e) => e.category?.slug === options.categorySlug);
  }
  if (options?.isFeatured !== undefined) {
    filtered = filtered.filter((e) => e.isFeatured === options.isFeatured);
  }
  if (options?.dayNumber !== undefined) {
    filtered = filtered.filter((e) => e.dayNumber === options.dayNumber);
  }
  return filtered;
}

/**
 * Retrieves schedule events grouped by day or for a specific day.
 */
export async function getFestSchedule(dayNumber?: number): Promise<FestEvent[]> {
  return getFestEvents({ dayNumber });
}

/**
 * Retrieves active sponsors sorted by tier and display order.
 */
export async function getFestSponsors(): Promise<FestSponsor[]> {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    if (sponsors && sponsors.length > 0) {
      return sponsors.map((s: any) => ({
        id: s.id,
        name: s.name,
        tier: s.tier,
        logoUrl: s.logoUrl,
        websiteUrl: s.websiteUrl,
        description: s.description,
        order: s.order,
        isActive: s.isActive,
      }));
    }
  } catch (error) {
    // Database offline
  }
  return STATIC_SPONSORS;
}

/**
 * Retrieves organizing committee members.
 */
export async function getFestCommittee(): Promise<FestCommitteeMember[]> {
  try {
    const members = await prisma.committeeMember.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    if (members && members.length > 0) {
      return members.map((m: any) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        category: m.category,
        department: m.department,
        photoUrl: m.photoUrl,
        email: m.email,
        phone: m.phone,
        linkedinUrl: m.linkedinUrl,
        githubUrl: m.githubUrl,
        order: m.order,
        isActive: m.isActive,
      }));
    }
  } catch (error) {
    // Database offline
  }
  return STATIC_COMMITTEE;
}

/**
 * Retrieves published FAQs.
 */
export async function getFestFaqs(): Promise<FestFaq[]> {
  try {
    const faqs = await prisma.faq.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    });

    if (faqs && faqs.length > 0) {
      return faqs.map((f: any) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        category: f.category,
        order: f.order,
        isPublished: f.isPublished,
      }));
    }
  } catch (error) {
    // Database offline
  }
  return STATIC_FAQS;
}

/**
 * Retrieves gallery items.
 */
export async function getFestGallery(): Promise<FestGalleryItem[]> {
  try {
    const gallery = await prisma.galleryItem.findMany({
      orderBy: { order: "asc" },
    });

    if (gallery && gallery.length > 0) {
      return gallery.map((g: any) => ({
        id: g.id,
        title: g.title,
        mediaUrl: g.mediaUrl,
        mediaType: g.mediaType as "IMAGE" | "VIDEO",
        category: g.category,
        year: g.year,
        isFeatured: g.isFeatured,
        order: g.order,
        description: g.description,
      }));
    }
  } catch (error) {
    // Database offline
  }
  return STATIC_GALLERY;
}

/**
 * Aggregates high-level festival statistics for hero & bento widgets.
 */
export async function getFestStats(): Promise<{
  totalEvents: number;
  totalPrizePool: number;
  totalCategories: number;
  totalDays: number;
  totalParticipants: number;
}> {
  try {
    const events = await getFestEvents();
    const categories = await getFestCategories();
    const totalPrizePool = events.reduce((sum, e) => sum + e.prizePool, 0);

    return {
      totalEvents: Math.max(events.length, 16),
      totalPrizePool: Math.max(totalPrizePool, 150000),
      totalCategories: Math.max(categories.length, 4),
      totalDays: 5,
      totalParticipants: 2500,
    };
  } catch {
    return {
      totalEvents: 16,
      totalPrizePool: 236000,
      totalCategories: 4,
      totalDays: 5,
      totalParticipants: 2500,
    };
  }
}

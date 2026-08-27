import {
  PrismaClient,
  Role,
  Branch,
  Gender,
  CategoryType,
  EventType,
  EventStatus,
  RegistrationStatus,
  TeamStatus,
  TeamMemberRole,
  MemberStatus,
  CheckInType,
  AttendanceStatus,
  ResultPosition,
  CertificateType,
  AnnouncementCategory,
  AnnouncementPriority,
  SponsorTier,
  CommitteeCategory,
  MediaType,
  ChatRole,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting ASTITVA 2K26 Database Seeding...");

  // --------------------------------------------------------------------------
  // 1. CLEAN EXISTING DATA (Safe cascade deletion order)
  // --------------------------------------------------------------------------
  console.log("🧹 Cleaning existing records...");
  await prisma.aiChatMessage.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.result.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.registration.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.sponsor.deleteMany({});
  await prisma.faq.deleteMany({});
  await prisma.galleryItem.deleteMany({});
  await prisma.committeeMember.deleteMany({});

  // --------------------------------------------------------------------------
  // 2. DEMO USERS & PROFILES (5 Canonical Roles)
  // --------------------------------------------------------------------------
  console.log("👥 Seeding 5 Demo Users with Profiles & Bcrypt Passwords...");
  const defaultPasswordHash = await bcrypt.hash("Password@123", 10);

  // User 1: Admin
  const adminUser = await prisma.user.create({
    data: {
      id: "usr_admin_001",
      email: "admin@lnjpit.ac.in",
      name: "Dr. Shailendra Kumar",
      role: Role.ADMIN,
      passwordHash: defaultPasswordHash,
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isActive: true,
      profile: {
        create: {
          participantId: "AST26-0001",
          collegeId: "LNJPIT-ADMIN-01",
          collegeName: "LNJPIT Chapra",
          branch: Branch.CSE,
          semester: 8,
          phone: "+91 98765 43210",
          gender: Gender.MALE,
          isHosteler: false,
          bio: "Principal & Chief Patron, ASTITVA 2K26, LNJPIT Chapra.",
          qrPassToken: "AST26.ADMIN.0001.MOCK_SIG",
        },
      },
    },
  });

  // User 2: Event Coordinator
  const coordinatorUser = await prisma.user.create({
    data: {
      id: "usr_coord_002",
      email: "coordinator@lnjpit.ac.in",
      name: "Prof. Rajesh Ranjan",
      role: Role.EVENT_COORDINATOR,
      passwordHash: defaultPasswordHash,
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      isActive: true,
      profile: {
        create: {
          participantId: "AST26-0002",
          collegeId: "LNJPIT-FAC-042",
          collegeName: "LNJPIT Chapra",
          branch: Branch.ECE,
          semester: 8,
          phone: "+91 98765 43211",
          gender: Gender.MALE,
          isHosteler: false,
          bio: "Head Event Coordinator for Sports & Cultural streams.",
          qrPassToken: "AST26.COORD.0002.MOCK_SIG",
        },
      },
    },
  });

  // User 3: Volunteer
  const volunteerUser = await prisma.user.create({
    data: {
      id: "usr_vol_003",
      email: "volunteer@lnjpit.ac.in",
      name: "Ananya Sharma",
      role: Role.VOLUNTEER,
      passwordHash: defaultPasswordHash,
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      isActive: true,
      profile: {
        create: {
          participantId: "AST26-0003",
          collegeId: "23105128014",
          collegeName: "LNJPIT Chapra",
          branch: Branch.EE,
          semester: 4,
          phone: "+91 98765 43212",
          gender: Gender.FEMALE,
          isHosteler: true,
          hostelName: "Gargi Girls Hostel",
          roomNumber: "G-204",
          bio: "Lead Volunteer for QR Attendance Verification & Stage Logistics.",
          qrPassToken: "AST26.VOL.0003.MOCK_SIG",
        },
      },
    },
  });

  // User 4: Team Captain
  const captainUser = await prisma.user.create({
    data: {
      id: "usr_capt_004",
      email: "captain@lnjpit.ac.in",
      name: "Aman Verma",
      role: Role.TEAM_CAPTAIN,
      passwordHash: defaultPasswordHash,
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      isActive: true,
      profile: {
        create: {
          participantId: "AST26-0004",
          collegeId: "22105128005",
          collegeName: "LNJPIT Chapra",
          branch: Branch.ME,
          semester: 6,
          phone: "+91 98765 43213",
          gender: Gender.MALE,
          isHosteler: true,
          hostelName: "Aryabhata Boys Hostel",
          roomNumber: "A-112",
          bio: "Captain of LNJPIT Titans Cricket Squad & Alpha BGMI Warriors.",
          qrPassToken: "AST26.CAPT.0004.MOCK_SIG",
        },
      },
    },
  });

  // User 5: Participant
  const participantUser = await prisma.user.create({
    data: {
      id: "usr_part_005",
      email: "participant@lnjpit.ac.in",
      name: "Sneha Kumari",
      role: Role.PARTICIPANT,
      passwordHash: defaultPasswordHash,
      avatarUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
      isActive: true,
      profile: {
        create: {
          participantId: "AST26-0005",
          collegeId: "24105128032",
          collegeName: "LNJPIT Chapra",
          branch: Branch.CE,
          semester: 2,
          phone: "+91 98765 43214",
          gender: Gender.FEMALE,
          isHosteler: false,
          bio: "Participant in Tark-Vitark Debate, Singing, and Chess competitions.",
          qrPassToken: "AST26.PART.0005.MOCK_SIG",
        },
      },
    },
  });

  // --------------------------------------------------------------------------
  // 3. FESTIVAL CATEGORIES (4 Main Pillars)
  // --------------------------------------------------------------------------
  console.log("🏆 Seeding 4 Fest Categories...");
  const catSports = await prisma.category.create({
    data: {
      id: "cat_sports",
      slug: "sports",
      name: "Sports",
      type: CategoryType.SPORTS,
      description:
        "High-voltage athletic championships testing endurance, team tactics, and sporting excellence.",
      icon: "Trophy",
      coverImage:
        "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80",
      order: 1,
      isActive: true,
    },
  });

  const catCultural = await prisma.category.create({
    data: {
      id: "cat_cultural",
      slug: "cultural",
      name: "Cultural",
      type: CategoryType.CULTURAL,
      description:
        "Artistic brilliance across music, classical & modern dance, stand-up comedy, and high fashion.",
      icon: "Music",
      coverImage:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
      order: 2,
      isActive: true,
    },
  });

  const catGaming = await prisma.category.create({
    data: {
      id: "cat_gaming",
      slug: "gaming",
      name: "Gaming",
      type: CategoryType.GAMING,
      description:
        "Esports arenas featuring high-stakes tactical combat, battle royales, and FPS tournaments.",
      icon: "Gamepad2",
      coverImage:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
      order: 3,
      isActive: true,
    },
  });

  const catLiterary = await prisma.category.create({
    data: {
      id: "cat_literary",
      slug: "literary",
      name: "Literary",
      type: CategoryType.LITERARY,
      description:
        "Cerebral battles of parliamentary debate, rapid-fire trivia, spoken poetry slams, and creative writing.",
      icon: "BookOpen",
      coverImage:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
      order: 4,
      isActive: true,
    },
  });

  // --------------------------------------------------------------------------
  // 4. 16 CANONICAL LNJPIT FESTIVAL EVENTS (4 Sept 2026 – 8 Sept 2026)
  // --------------------------------------------------------------------------
  console.log("⚡ Seeding 16 Canonical LNJPIT Events...");

  // --- SPORTS (5 Events) ---
  const eventCricket = await prisma.event.create({
    data: {
      id: "evt_spt_cricket",
      slug: "cricket-tournament",
      title: "ASTITVA Cricket Championship (T10 Knockout)",
      subtitle: "The Flagship Inter-Branch Leather Ball Showdown",
      description:
        "Witness the ultimate inter-branch cricket spectacle. 10-over high-pressure knockout matches played with standard white leather balls on LNJPIT’s manicured turf.",
      rules:
        "1. Standard ICC T10 rules apply.\n2. 11 players per side + max 4 substitutes.\n3. Maximum 2 overs per bowler.\n4. Proper white team jerseys mandatory.\n5. Super Over in case of match tie.\n6. Umpire decisions are final and binding.",
      categoryId: catSports.id,
      venue: "LNJPIT Main Cricket Oval",
      eventType: EventType.TEAM,
      minTeamSize: 11,
      maxTeamSize: 15,
      registrationFee: 0.0,
      maxRegistrations: 16,
      currentRegistrations: 8,
      prizePool: 25000,
      firstPrize: "₹15,000 + Champions Rolling Trophy + Gold Medals",
      secondPrize: "₹7,000 + Silver Plate + Silver Medals",
      thirdPrize: "₹3,000 + Bronze Memento",
      scheduleStart: new Date("2026-09-04T09:00:00+05:30"),
      scheduleEnd: new Date("2026-09-07T16:30:00+05:30"),
      dayNumber: 1,
      status: EventStatus.REGISTRATION_OPEN,
      isFeatured: true,
      bannerImage:
        "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80",
      coordinatorId: coordinatorUser.id,
      coordinatorName: "Prof. Rajesh Ranjan",
      coordinatorPhone: "+91 98765 43211",
      coordinatorEmail: "coordinator@lnjpit.ac.in",
    },
  });

  const eventFootball = await prisma.event.create({
    data: {
      id: "evt_spt_football",
      slug: "football-championship",
      title: "Inter-Branch Football Cup (7v7 Turf War)",
      subtitle: "Fast-Paced 7-a-Side Football Tournament",
      description:
        "Pure footballing intensity on the LNJPIT grass turf. High speed, technical skill, and branch pride collide over 5 days of thrilling knockout matches.",
      rules:
        "1. 7-a-side with maximum 3 rolling substitutions.\n2. 25 minutes per half with a 5-minute break.\n3. Stud boots and shin guards compulsory.\n4. Direct penalty shoot-out (5 kicks) in case of a draw in knockout rounds.\n5. Yellow card leads to 2-minute sin-bin.",
      categoryId: catSports.id,
      venue: "LNJPIT Football Arena",
      eventType: EventType.TEAM,
      minTeamSize: 7,
      maxTeamSize: 10,
      registrationFee: 0.0,
      maxRegistrations: 16,
      currentRegistrations: 6,
      prizePool: 20000,
      firstPrize: "₹12,000 + Golden Boot Trophy + Gold Medals",
      secondPrize: "₹6,000 + Silver Shield",
      thirdPrize: "₹2,000 + Medals",
      scheduleStart: new Date("2026-09-04T14:30:00+05:30"),
      scheduleEnd: new Date("2026-09-08T12:00:00+05:30"),
      dayNumber: 1,
      status: EventStatus.REGISTRATION_OPEN,
      isFeatured: true,
      bannerImage:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80",
      coordinatorId: coordinatorUser.id,
      coordinatorName: "Sanjay Kumar (Sports Secretary)",
      coordinatorPhone: "+91 98765 43215",
      coordinatorEmail: "football.astitva@lnjpit.ac.in",
    },
  });

  const eventVolleyball = await prisma.event.create({
    data: {
      id: "evt_spt_volleyball",
      slug: "volleyball-smash",
      title: "Spike Masters Volleyball Trophy",
      subtitle: "High-Flying Spikes & Rock-Solid Defense",
      description:
        "Feel the power of tactical setting, soaring spikes, and diving digs under the floodlights at the outdoor volleyball court.",
      rules:
        "1. Best of 3 sets of 25 points each (Decider set 15 points).\n2. Standard FIVB net height and 6-player rotation rules.\n3. Net contact or crossing center line constitutes a foul.\n4. Maximum 2 timeouts per set per team.",
      categoryId: catSports.id,
      venue: "Outdoor Volleyball Court (Near Hostel 2)",
      eventType: EventType.TEAM,
      minTeamSize: 6,
      maxTeamSize: 8,
      registrationFee: 0.0,
      maxRegistrations: 12,
      currentRegistrations: 4,
      prizePool: 12000,
      firstPrize: "₹7,000 + Champions Trophy",
      secondPrize: "₹3,500 + Silver Medals",
      thirdPrize: "₹1,500 + Certificate of Merit",
      scheduleStart: new Date("2026-09-05T09:30:00+05:30"),
      scheduleEnd: new Date("2026-09-06T17:00:00+05:30"),
      dayNumber: 2,
      status: EventStatus.REGISTRATION_OPEN,
      isFeatured: false,
      bannerImage:
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80",
      coordinatorId: coordinatorUser.id,
      coordinatorName: "Rishi Raj",
      coordinatorPhone: "+91 98765 43216",
      coordinatorEmail: "volleyball.astitva@lnjpit.ac.in",
    },
  });

  const eventBadminton = await prisma.event.create({
    data: {
      id: "evt_spt_badminton",
      slug: "badminton-clash",
      title: "Shuttle Smash Badminton Championship",
      subtitle: "Singles & Doubles Indoor Racket Battle",
      description:
        "Lightning reflex smashes, tactical drop shots, and intense endurance duels on synthetic indoor courts.",
      rules:
        "1. BWF 21-point rally scoring system (best of 3 games).\n2. Yonex Mavis 350 nylon shuttles provided by organizing committee.\n3. Non-marking indoor badminton shoes strictly mandatory.\n4. 2-minute interval between games.",
      categoryId: catSports.id,
      venue: "Indoor Sports Complex Hall A",
      eventType: EventType.INDIVIDUAL,
      minTeamSize: 1,
      maxTeamSize: 2,
      registrationFee: 0.0,
      maxRegistrations: 32,
      currentRegistrations: 14,
      prizePool: 10000,
      firstPrize: "₹6,000 + Gold Trophy",
      secondPrize: "₹3,000 + Silver Medal",
      thirdPrize: "₹1,000 + Bronze Medal",
      scheduleStart: new Date("2026-09-05T10:00:00+05:30"),
      scheduleEnd: new Date("2026-09-07T14:00:00+05:30"),
      dayNumber: 2,
      status: EventStatus.REGISTRATION_OPEN,
      isFeatured: false,
      bannerImage:
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
      coordinatorId: coordinatorUser.id,
      coordinatorName: "Neha Singh",
      coordinatorPhone: "+91 98765 43217",
      coordinatorEmail: "badminton.astitva@lnjpit.ac.in",
    },
  });

  const eventChess = await prisma.event.create({
    data: {
      id: "evt_spt_chess",
      slug: "grandmaster-chess",
      title: "Grandmaster Chess Championship",
      subtitle: "Battle of 64 Squares: Strategy, Tactics & Mental Grit",
      description:
        "Step into the silent battlefield of grandmasters. Five rounds of Swiss system rapid chess with digital clocks and fide-standard arbiter supervision.",
      rules:
        "1. 5-Round FIDE Swiss System with digital chess clocks.\n2. Time control: 15 minutes + 10 seconds increment per move from move 1.\n3. Touch-move rule strictly enforced.\n4. Mobile phones or smartwatches strictly forbidden in the playing hall.\n5. Tie-break via Buchholz and Sonneborn-Berger systems.",
      categoryId: catSports.id,
      venue: "Central Library Reading Hall (AC)",
      eventType: EventType.INDIVIDUAL,
      minTeamSize: 1,
      maxTeamSize: 1,
      registrationFee: 0.0,
      maxRegistrations: 64,
      currentRegistrations: 28,
      prizePool: 8000,
      firstPrize: "₹5,000 + Grandmaster Trophy + Gold Medal",
      secondPrize: "₹2,000 + Silver Medal",
      thirdPrize: "₹1,000 + Bronze Medal",
      scheduleStart: new Date("2026-09-04T11:00:00+05:30"),
      scheduleEnd: new Date("2026-09-05T16:00:00+05:30"),
      dayNumber: 1,
      status: EventStatus.REGISTRATION_OPEN,
      isFeatured: false,
      bannerImage:
        "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&auto=format&fit=crop&q=80",
      coordinatorId: coordinatorUser.id,
      coordinatorName: "Prof. S. N. Mishra",
      coordinatorPhone: "+91 98765 43218",
      coordinatorEmail: "chess.astitva@lnjpit.ac.in",
    },
  });

  // --- CULTURAL (4 Events) ---
  const eventDance = await prisma.event.create({
    data: {
      id: "evt_clt_dance",
      slug: "nrityangana-dance",
      title: "Nrityangana (Solo & Group Dance Battle)",
      subtitle: "Classical Grace, Bollywood Beats & Urban Hip-Hop",
      description:
        "The mega dance extravaganza of ASTITVA 2K26. Solo performers and dynamic crews light up the grand amphitheatre with choreography, rhythm, and costume splendor.",
      rules:
        "1. Solo performance: 3 to 5 minutes. Group performance (4-10 members): 6 to 10 minutes.\n2. Audio soundtrack must be submitted 24 hours prior in MP3 320kbps format.\n3. Props allowed with prior safety clearance.\n4. Judging parameters: Choreography, Synchronization, Expressions, Stage Utilization, Costumes.",
      categoryId: catCultural.id,
      venue: "Open Air Theatre (OAT Main Stage)",
      eventType: EventType.TEAM,
      minTeamSize: 1,
      maxTeamSize: 10,
      registrationFee: 0.0,
      maxRegistrations: 20,
      currentRegistrations: 11,
      prizePool: 22000,
      firstPrize: "₹12,000 + Nrityangana Rolling Trophy + Gold Medals",
      secondPrize: "₹7,000 + Silver Mementos",
      thirdPrize: "₹3,000 + Bronze Mementos",
      scheduleStart: new Date("2026-09-05T17:30:00+05:30"),
      scheduleEnd: new Date("2026-09-05T21:30:00+05:30"),
      dayNumber: 2,
      status: EventStatus.REGISTRATION_OPEN,
      isFeatured: true,
      bannerImage:
        "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop&q=80",
      coordinatorId: coordinatorUser.id,
      coordinatorName: "Shalini Priya",
      coordinatorPhone: "+91 98765 43219",
      coordinatorEmail: "dance.astitva@lnjpit.ac.in",
    },
  });

  const eventSinging = await prisma.event.create({
    data: {
      id: "evt_clt_singing",
      slug: "sur-sangam-singing",
      title: "Sur Sangam (Voice of Astitva)",
      subtitle: "Vocal Melody Across Classical, Sufi, Folk & Bollywood",
      description:
        "Discover the premier singing talents of LNJPIT. Two rounds of pure acoustic mastery featuring eastern classical, semi-classical, folk, and contemporary playback.",
      rules:
        "1. Round 1: Eastern Classical / Raag / Semi-Classical / Folk (Max 3 mins).\n2. Round 2: Contemporary / Bollywood / Free Choice (Max 4 mins).\n3. Single acoustic instrument (guitar, harmonium, flute) or karaoke backing track permitted.\n4. Autotune or digital voice processors strictly forbidden.",
      categoryId: catCultural.id,
      venue: "Kalakshetra Auditorium",
      eventType: EventType.INDIVIDUAL,
      minTeamSize: 1,
      maxTeamSize: 2,
      registrationFee: 0.0,
      maxRegistrations: 30,
      currentRegistrations: 18,
      prizePool: 15000,
      firstPrize: "₹8,000 + Golden Microphone Trophy",
      secondPrize: "₹5,000 + Silver Memento",
      thirdPrize: "₹2,000 + Bronze Memento",
      scheduleStart: new Date("2026-09-06T17:00:00+05:30"),
      scheduleEnd: new Date("2026-09-06T20:30:00+05:30"),
      dayNumber: 3,
      status: EventStatus.REGISTRATION_OPEN,
      isFeatured: false,
      bannerImage:
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
      coordinatorId: coordinatorUser.id,
      coordinatorName: "Abhinav Kashyap",
      coordinatorPhone: "+91 98765 43220",
      coordinatorEmail: "music.astitva@lnjpit.ac.in",
    },
  });

  const eventComedy = await prisma.event.create({
    data: {
      id: "evt_clt_comedy",
      slug: "hasya-kosh-comedy",
      title: "Hasya Kosh (Stand-Up & Comic Act)",
      subtitle: "Punchlines, Relatable Engineering Humor & Pure Satire",
      description:
        "An evening of uproarious laughter as LNJPIT comics bring their sharpest observations, engineering hostel tales, and relatable campus humor to the stage.",
      rules:
        "1. Time limit: 5 to 7 minutes on stage.\n2. Content must be 100% original.\n3. Hate speech, vulgarity, or personal religious attacks result in immediate disqualification.\n4. Judged on punchline timing, delivery cadence, crowd engagement, and originality.",
      categoryId: catCultural.id,
      venue: "Mini Auditorium (Civil Dept Building)",
      eventType: EventType.INDIVIDUAL,
      minTeamSize: 1,
      maxTeamSize: 1,
      registrationFee: 0.0,
      maxRegistrations: 20,
      currentRegistrations: 9,
      prizePool: 10000,
      firstPrize: "₹6,000 + Comic Maestro Trophy",
      secondPrize: "₹3,000 + Silver Medal",
      thirdPrize: "₹1,000 + Bronze Medal",
      scheduleStart: new Date("2026-09-06T14:00:00+05:30"),
      scheduleEnd: new Date("2026-09-06T17:00:00+05:30"),
      dayNumber: 3,
      status: EventStatus.REGISTRATION_OPEN,
      isFeatured: false,
      bannerImage:
        "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&auto=format&fit=crop&q=80",
      coordinatorId: coordinatorUser.id,
      coordinatorName: "Kunal Roy",
      coordinatorPhone: "+91 98765 43221",
      coordinatorEmail: "comedy.astitva@lnjpit.ac.in",
    },
  });

  const eventRampwalk = await prisma.event.create({
    data: {
      id: "evt_clt_rampwalk",
      slug: "glamour-grace-rampwalk",
      title: "Glamour & Grace (Ethnic & Cyberpunk Runway)",
      subtitle: "Haute Couture, Traditional Roots & Futuristic Fashion",
      description:
        "The glamour climax of ASTITVA 2K26. Teams showcase striking attire blending authentic Indian handlooms with cutting-edge cyberpunk aesthetics under stadium runway lights.",
      rules:
        "1. Team composition: 6 to 12 models.\n2. Stage duration: 10 to 12 minutes.\n3. Theme: 'Indian Heritage to Cyberpunk 2026'.\n4. Synchronized theme track & narration submitted 24h prior.\n5. Judged on poise, walk posture, theme interpretation, coordination, and styling.",
      categoryId: catCultural.id,
      venue: "Central Festival Stage",
      eventType: EventType.TEAM,
      minTeamSize: 6,
      maxTeamSize: 12,
      registrationFee: 0.0,
      maxRegistrations: 10,
      currentRegistrations: 5,
      prizePool: 25000,
      firstPrize: "₹15,000 + Couture Trophy + Certificates of Excellence",
      secondPrize: "₹7,000 + Silver Mementos",
      thirdPrize: "₹3,000 + Medals",
      scheduleStart: new Date("2026-09-07T19:00:00+05:30"),
      scheduleEnd: new Date("2026-09-07T22:00:00+05:30"),
      dayNumber: 4,
      status: EventStatus.REGISTRATION_OPEN,
      isFeatured: true,
      bannerImage:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
      coordinatorId: coordinatorUser.id,
      coordinatorName: "Pooja Jha",
      coordinatorPhone: "+91 98765 43222",
      coordinatorEmail: "fashion.astitva@lnjpit.ac.in",
    },
  });

  // --- GAMING (3 Events) ---
  const eventBgmi = await prisma.event.create({
    data: {
      id: "evt_gam_bgmi",
      slug: "bgmi-mobile-battlefield",
      title: "BGMI Mobile Esports Championship",
      subtitle: "Battlegrounds Mobile India 4v4 Squad Showdown",
      description:
        "The adrenaline-fueled battle royale spectacle. 16 top collegiate squads drop into Erangel and Miramar for the ultimate chicken dinner and championship glory.",
      rules:
        "1. Squad of 4 main players + 1 registered sub.\n2. Official BGIS scoring matrix (Placement points + 1 point per elimination).\n3. Handheld mobile phones only (Triggers, emulators, iPad views strictly banned).\n4. All players must play over the verified college LAN/Wi-Fi hub.",
      categoryId: catGaming.id,
      venue: "LAN Gaming Arena (CSE Dept Lab 1)",
      eventType: EventType.TEAM,
      minTeamSize: 4,
      maxTeamSize: 5,
      registrationFee: 0.0,
      maxRegistrations: 32,
      currentRegistrations: 16,
      prizePool: 20000,
      firstPrize: "₹12,000 + Esports Champion Shield + Gold Badges",
      secondPrize: "₹6,000 + Silver Badges",
      thirdPrize: "₹2,000 + Bronze Badges",
      scheduleStart: new Date("2026-09-04T13:00:00+05:30"),
      scheduleEnd: new Date("2026-09-05T18:00:00+05:30"),
      dayNumber: 1,
      status: EventStatus.REGISTRATION_OPEN,
      isFeatured: true,
      bannerImage:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
      coordinatorId: coordinatorUser.id,
      coordinatorName: "Aryan Gupta",
      coordinatorPhone: "+91 98765 43223",
      coordinatorEmail: "bgmi.astitva@lnjpit.ac.in",
    },
  });

  const eventFreefire = await prisma.event.create({
    data: {
      id: "evt_gam_freefire",
      slug: "free-fire-clash-squad",
      title: "Free Fire Clash Squad Tournament",
      subtitle: "Fast-Paced 4v4 Intense Tactical Firefights",
      description:
        "Rapid reflex weapon buys, gloo wall mastery, and clutch team plays in a bracketed 4v4 Clash Squad tournament format.",
      rules:
        "1. 4v4 Clash Squad custom rooms.\n2. Best of 7 rounds knockout matches; Best of 11 for Grand Finals.\n3. Mobile phones only; third-party GFX tools or macro configs prohibited.\n4. Default competitive room settings (Limited Ammo: Yes, Character Skill: On).",
      categoryId: catGaming.id,
      venue: "LAN Gaming Arena (CSE Dept Lab 2)",
      eventType: EventType.TEAM,
      minTeamSize: 4,
      maxTeamSize: 4,
      registrationFee: 0.0,
      maxRegistrations: 24,
      currentRegistrations: 12,
      prizePool: 15000,
      firstPrize: "₹9,000 + Free Fire Champions Trophy",
      secondPrize: "₹4,500 + Silver Medals",
      thirdPrize: "₹1,500 + Bronze Medals",
      scheduleStart: new Date("2026-09-06T10:30:00+05:30"),
      scheduleEnd: new Date("2026-09-06T15:30:00+05:30"),
      dayNumber: 3,
      status: EventStatus.REGISTRATION_OPEN,
      isFeatured: false,
      bannerImage:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
      coordinatorId: coordinatorUser.id,
      coordinatorName: "Rahul Tiwari",
      coordinatorPhone: "+91 98765 43224",
      coordinatorEmail: "freefire.astitva@lnjpit.ac.in",
    },
  });

  const eventValorant = await prisma.event.create({
    data: {
      id: "evt_gam_valorant",
      slug: "valorant-lan-warfare",
      title: "Valorant Tactical LAN Warfare",
      subtitle: "5v5 Spike Plant & Defuse Cyber Combat",
      description:
        "High-tier tactical FPS competition. 5v5 team lineups, agent utility combos, and precision headshots on high-refresh-rate PC rigs in LNJPIT computing centers.",
      rules:
        "1. Standard 5v5 competitive mode with coach slot permitted.\n2. Map Pool: Ascent, Bind, Haven, Split, Sunset.\n3. Single elimination BO1 up to Quarterfinals; BO3 for Semifinals & Finals.\n4. Tactical timeouts: 2 per team per map (60 seconds each).",
      categoryId: catGaming.id,
      venue: "High-Performance Computing Lab",
      eventType: EventType.TEAM,
      minTeamSize: 5,
      maxTeamSize: 6,
      registrationFee: 0.0,
      maxRegistrations: 16,
      currentRegistrations: 8,
      prizePool: 18000,
      firstPrize: "₹11,000 + Valorant Radiant Shield + Gold Medals",
      secondPrize: "₹5,000 + Silver Medals",
      thirdPrize: "₹2,000 + Certificates",
      scheduleStart: new Date("2026-09-05T11:00:00+05:30"),
      scheduleEnd: new Date("2026-09-06T18:00:00+05:30"),
      dayNumber: 2,
      status: EventStatus.REGISTRATION_OPEN,
      isFeatured: true,
      bannerImage:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80",
      coordinatorId: coordinatorUser.id,
      coordinatorName: "Devansh Saxena",
      coordinatorPhone: "+91 98765 43225",
      coordinatorEmail: "valorant.astitva@lnjpit.ac.in",
    },
  });

  // --- LITERARY (4 Events) ---
  const eventDebate = await prisma.event.create({
    data: {
      id: "evt_lit_debate",
      slug: "tark-vitark-debate",
      title: "Tark-Vitark (Parliamentary Debate)",
      subtitle: "Oratory Eloquence, Logic & Critical Cross-Examination",
      description:
        "The ultimate battle of arguments. Two-member parliamentary teams defend and oppose hot-topic socio-technological motions before a distinguished jury.",
      rules:
        "1. 2-member teams (1 For the Motion, 1 Against the Motion).\n2. Time format: 3-minute constructive speech + 1-minute interjection + 2-minute rebuttal.\n3. Medium of debate: English or Hindi.\n4. Judged on argumentation, evidence quality, rhetorical style, and rebuttal poise.",
      categoryId: catLiterary.id,
      venue: "Senate Hall (Administrative Block)",
      eventType: EventType.TEAM,
      minTeamSize: 2,
      maxTeamSize: 2,
      registrationFee: 0.0,
      maxRegistrations: 24,
      currentRegistrations: 10,
      prizePool: 10000,
      firstPrize: "₹6,000 + Orator Champions Trophy",
      secondPrize: "₹3,000 + Silver Medal",
      thirdPrize: "₹1,000 + Bronze Medal",
      scheduleStart: new Date("2026-09-04T10:30:00+05:30"),
      scheduleEnd: new Date("2026-09-04T14:30:00+05:30"),
      dayNumber: 1,
      status: EventStatus.REGISTRATION_OPEN,
      isFeatured: false,
      bannerImage:
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80",
      coordinatorId: coordinatorUser.id,
      coordinatorName: "Dr. Suniti Pathak",
      coordinatorPhone: "+91 98765 43226",
      coordinatorEmail: "debate.astitva@lnjpit.ac.in",
    },
  });

  const eventQuiz = await prisma.event.create({
    data: {
      id: "evt_lit_quiz",
      slug: "prashnavali-tech-fest-quiz",
      title: "Prashnavali (Mega Tech & Fest Trivia Quiz)",
      subtitle: "Science, Pop Culture, Current Affairs & Tech Trivia",
      description:
        "A mind-bending quiz with written screening prelims followed by a thrilling audio-visual buzzer showdown on the big stage.",
      rules:
        "1. Teams of 2 or 3 members.\n2. Round 1: 30-question written screening test (20 mins).\n3. Top 6 teams qualify for the live on-stage finals.\n4. Finals feature Audio-Visual, Rapid Fire, and Pounce-Bounce rounds.",
      categoryId: catLiterary.id,
      venue: "Main Seminar Hall",
      eventType: EventType.TEAM,
      minTeamSize: 2,
      maxTeamSize: 3,
      registrationFee: 0.0,
      maxRegistrations: 30,
      currentRegistrations: 14,
      prizePool: 12000,
      firstPrize: "₹7,000 + Quiz Whiz Trophy + Gold Medals",
      secondPrize: "₹3,500 + Silver Medals",
      thirdPrize: "₹1,500 + Bronze Medals",
      scheduleStart: new Date("2026-09-05T14:00:00+05:30"),
      scheduleEnd: new Date("2026-09-05T17:30:00+05:30"),
      dayNumber: 2,
      status: EventStatus.REGISTRATION_OPEN,
      isFeatured: false,
      bannerImage:
        "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=80",
      coordinatorId: coordinatorUser.id,
      coordinatorName: "Prakash Jha",
      coordinatorPhone: "+91 98765 43227",
      coordinatorEmail: "quiz.astitva@lnjpit.ac.in",
    },
  });

  const eventPoetry = await prisma.event.create({
    data: {
      id: "evt_lit_poetry",
      slug: "kavyanjali-poetry-slam",
      title: "Kavyanjali (Hindi & Urdu Poetry Slam)",
      subtitle: "Shayari, Nazm, Kavita & Spoken Word Expressions",
      description:
        "An enchanting evening of soulful verses, rhythmic cadence, and emotive recitation celebrating Hindi and Urdu poetic traditions.",
      rules:
        "1. Individual performance of 4 to 6 minutes.\n2. Poems must be original compositions by the participant.\n3. Judged on lyrical depth, meter/rhyme, voice modulation, and stage presence.",
      categoryId: catLiterary.id,
      venue: "Open Air Amphitheatre Gazebo",
      eventType: EventType.INDIVIDUAL,
      minTeamSize: 1,
      maxTeamSize: 1,
      registrationFee: 0.0,
      maxRegistrations: 25,
      currentRegistrations: 12,
      prizePool: 8000,
      firstPrize: "₹5,000 + Kavi Ratna Trophy",
      secondPrize: "₹2,000 + Silver Medal",
      thirdPrize: "₹1,000 + Bronze Medal",
      scheduleStart: new Date("2026-09-06T18:00:00+05:30"),
      scheduleEnd: new Date("2026-09-06T21:00:00+05:30"),
      dayNumber: 3,
      status: EventStatus.REGISTRATION_OPEN,
      isFeatured: false,
      bannerImage:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
      coordinatorId: coordinatorUser.id,
      coordinatorName: "Dr. Anupama Kumari",
      coordinatorPhone: "+91 98765 43228",
      coordinatorEmail: "poetry.astitva@lnjpit.ac.in",
    },
  });

  const eventWriting = await prisma.event.create({
    data: {
      id: "evt_lit_writing",
      slug: "kalamkar-creative-writing",
      title: "Kalamkar (On-the-Spot Creative Writing)",
      subtitle: "Stories, Essays & Micro-Fiction Under Time Pressure",
      description:
        "Test your spontaneity and narrative imagination. Secret theme prompts revealed on stage with 90 minutes of focused writing time.",
      rules:
        "1. 90 minutes time duration.\n2. Word limit: 800 - 1200 words.\n3. Prompt revealed at commencement of the session.\n4. Plagiarism or AI assistance leads to immediate disqualification.",
      categoryId: catLiterary.id,
      venue: "Computer Center Examination Hall",
      eventType: EventType.INDIVIDUAL,
      minTeamSize: 1,
      maxTeamSize: 1,
      registrationFee: 0.0,
      maxRegistrations: 40,
      currentRegistrations: 15,
      prizePool: 6000,
      firstPrize: "₹3,500 + Kalamkar Laurels Trophy",
      secondPrize: "₹1,500 + Silver Medal",
      thirdPrize: "₹1,000 + Bronze Medal",
      scheduleStart: new Date("2026-09-07T10:00:00+05:30"),
      scheduleEnd: new Date("2026-09-07T12:30:00+05:30"),
      dayNumber: 4,
      status: EventStatus.REGISTRATION_OPEN,
      isFeatured: false,
      bannerImage:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
      coordinatorId: coordinatorUser.id,
      coordinatorName: "Prof. Vinod Pandey",
      coordinatorPhone: "+91 98765 43229",
      coordinatorEmail: "writing.astitva@lnjpit.ac.in",
    },
  });

  // --------------------------------------------------------------------------
  // 5. SAMPLE TEAMS & ROSTERS
  // --------------------------------------------------------------------------
  console.log("🛡️ Seeding Sample Teams & Invite Codes...");
  const teamTitans = await prisma.team.create({
    data: {
      id: "team_cricket_01",
      name: "LNJPIT Titans ME",
      code: "TITN26",
      eventId: eventCricket.id,
      captainId: captainUser.id,
      minMembers: 11,
      maxMembers: 15,
      status: TeamStatus.READY,
      members: {
        create: [
          {
            userId: captainUser.id,
            role: TeamMemberRole.CAPTAIN,
            status: MemberStatus.APPROVED,
          },
          {
            userId: participantUser.id,
            role: TeamMemberRole.MEMBER,
            status: MemberStatus.APPROVED,
          },
        ],
      },
    },
  });

  const teamBgmi = await prisma.team.create({
    data: {
      id: "team_bgmi_01",
      name: "Alpha Esports Warriors",
      code: "BG26X1",
      eventId: eventBgmi.id,
      captainId: captainUser.id,
      minMembers: 4,
      maxMembers: 5,
      status: TeamStatus.READY,
      members: {
        create: [
          {
            userId: captainUser.id,
            role: TeamMemberRole.CAPTAIN,
            status: MemberStatus.APPROVED,
          },
        ],
      },
    },
  });

  // --------------------------------------------------------------------------
  // 6. SAMPLE REGISTRATIONS
  // --------------------------------------------------------------------------
  console.log("📝 Seeding Sample Registrations...");
  await prisma.registration.create({
    data: {
      id: "reg_cricket_001",
      eventId: eventCricket.id,
      userId: captainUser.id,
      teamId: teamTitans.id,
      registrationNumber: "AST26-REG-1001",
      status: RegistrationStatus.CONFIRMED,
      qrTicketCode: "AST26.REG.1001.MOCK_SIG",
    },
  });

  await prisma.registration.create({
    data: {
      id: "reg_debate_002",
      eventId: eventDebate.id,
      userId: participantUser.id,
      registrationNumber: "AST26-REG-1002",
      status: RegistrationStatus.CONFIRMED,
      qrTicketCode: "AST26.REG.1002.MOCK_SIG",
    },
  });

  // --------------------------------------------------------------------------
  // 7. SAMPLE RESULTS & VERIFIABLE CERTIFICATE
  // --------------------------------------------------------------------------
  console.log("🏅 Seeding Results & Cryptographically Verifiable Certificate...");
  await prisma.result.create({
    data: {
      id: "res_chess_001",
      eventId: eventChess.id,
      rank: 1,
      positionTitle: ResultPosition.WINNER,
      userId: participantUser.id,
      score: "4.5 / 5.0 (Buchholz 18.5)",
      prizeAwarded: "₹5,000 + Grandmaster Trophy + Gold Medal",
      certificateIssued: true,
      publishedAt: new Date(),
    },
  });

  await prisma.certificate.create({
    data: {
      id: "cert_001",
      certificateNumber: "AST26-CERT-10492",
      userId: participantUser.id,
      eventId: eventChess.id,
      recipientName: "Sneha Kumari",
      participantId: "AST26-0005",
      type: CertificateType.WINNER,
      title: "Certificate of Excellence (First Place)",
      eventName: "Grandmaster Chess Championship",
      category: "Sports",
      issueDate: new Date("2026-09-08T18:00:00+05:30"),
      signatureHash:
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      verificationUrl:
        "https://astitva2k26.lnjpit.ac.in/verify-certificate/AST26-CERT-10492",
    },
  });

  // --------------------------------------------------------------------------
  // 8. BROADCAST ANNOUNCEMENTS
  // --------------------------------------------------------------------------
  console.log("📢 Seeding Broadcast Announcements...");
  await prisma.announcement.createMany({
    data: [
      {
        id: "ann_001",
        title: "ASTITVA 2K26 Portal Registrations Officially LIVE!",
        content:
          "Registrations for all 16 tournaments across Sports, Cultural, Gaming, and Literary are now open for all LNJPIT students. Register your team today!",
        category: AnnouncementCategory.GENERAL,
        priority: AnnouncementPriority.HIGH,
        authorId: adminUser.id,
        authorName: "Dr. Shailendra Kumar (Chief Patron)",
        isPinned: true,
        publishedAt: new Date("2026-08-20T10:00:00+05:30"),
      },
      {
        id: "ann_002",
        title: "Cricket Championship Jersey & Kit Inspection Notice",
        content:
          "All team captains must submit their verified 11-15 player branch roster and collect official match balls from the Sports Complex by 2 Sept 2026.",
        category: AnnouncementCategory.EVENT_UPDATE,
        priority: AnnouncementPriority.NORMAL,
        authorId: coordinatorUser.id,
        authorName: "Prof. Rajesh Ranjan (Sports Head)",
        isPinned: false,
        publishedAt: new Date("2026-08-22T14:00:00+05:30"),
      },
      {
        id: "ann_003",
        title: "LAN Gaming Arena High-Speed Server Hub Configured",
        content:
          "Dedicated 1 Gbps ultra-low latency Wi-Fi/LAN hub configured for BGMI and Valorant tournaments in CSE Dept Labs 1 & 2.",
        category: AnnouncementCategory.EVENT_UPDATE,
        priority: AnnouncementPriority.NORMAL,
        authorId: adminUser.id,
        authorName: "Technical Sub-Committee",
        isPinned: false,
        publishedAt: new Date("2026-08-25T11:00:00+05:30"),
      },
    ],
  });

  // --------------------------------------------------------------------------
  // 9. SEARCHABLE FAQS
  // --------------------------------------------------------------------------
  console.log("❓ Seeding Searchable FAQs...");
  await prisma.faq.createMany({
    data: [
      {
        question: "Who is eligible to participate in ASTITVA 2K26?",
        answer:
          "All enrolled undergraduate students of LNJPIT Chapra from CSE, ME, CE, EE, and ECE branches across 1st to 8th semesters are eligible.",
        category: "Eligibility",
        order: 1,
      },
      {
        question: "Is there any registration fee for LNJPIT students?",
        answer:
          "No, participation in all 16 tournaments across all 4 categories is 100% free for all bona fide students of LNJPIT Chapra.",
        category: "Registrations",
        order: 2,
      },
      {
        question: "How do I create or join a team with an invite code?",
        answer:
          "The team captain registers the team first, which generates a unique 6-character alphanumeric code (e.g. BG26X1). Other team members use the '/teams/join/[code]' page to join.",
        category: "Teams",
        order: 3,
      },
      {
        question: "How does the QR participant pass work at event venues?",
        answer:
          "Once registered, your encrypted digital pass is accessible on your profile and participant dashboard. Volunteers at entry gates scan your QR code with web cameras for instant access.",
        category: "Attendance",
        order: 4,
      },
      {
        question: "How can certificates be verified by employers or external institutions?",
        answer:
          "Every certificate generated contains a unique Certificate ID (e.g. AST26-CERT-10492) and an HMAC-SHA256 digital signature that can be verified publicly at '/verify-certificate/[id]'.",
        category: "Certificates",
        order: 5,
      },
    ],
  });

  // --------------------------------------------------------------------------
  // 10. TIERED SPONSORS
  // --------------------------------------------------------------------------
  console.log("🤝 Seeding Tiered Sponsors...");
  await prisma.sponsor.createMany({
    data: [
      {
        name: "Bihar State Electronics Development Corp (BELTRON)",
        tier: SponsorTier.TITLE,
        logoUrl:
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
        websiteUrl: "https://beltron.bihar.gov.in",
        description: "Title Sponsor supporting technological innovation at LNJPIT.",
        order: 1,
      },
      {
        name: "Department of Science, Technology & Technical Education (DSTTE Bihar)",
        tier: SponsorTier.POWERED_BY,
        logoUrl:
          "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&auto=format&fit=crop&q=80",
        websiteUrl: "https://dst.bihar.gov.in",
        description: "Official Patron & Government Partner.",
        order: 2,
      },
      {
        name: "State Bank of India (LNJPIT Campus Branch)",
        tier: SponsorTier.GOLD,
        logoUrl:
          "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&auto=format&fit=crop&q=80",
        websiteUrl: "https://sbi.co.in",
        description: "Official Banking & Prize Partner.",
        order: 3,
      },
      {
        name: "Red Bull India",
        tier: SponsorTier.SILVER,
        logoUrl:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&auto=format&fit=crop&q=80",
        websiteUrl: "https://redbull.com",
        description: "Official Energy Drink & Esports Partner.",
        order: 4,
      },
    ],
  });

  // --------------------------------------------------------------------------
  // 11. ORGANIZING COMMITTEE MEMBERS
  // --------------------------------------------------------------------------
  console.log("🏛️ Seeding Organizing Committee Members...");
  await prisma.committeeMember.createMany({
    data: [
      {
        name: "Dr. Shailendra Kumar",
        role: "Principal & Chief Patron",
        category: CommitteeCategory.FACULTY,
        department: "Administration",
        photoUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        email: "principal@lnjpit.ac.in",
        order: 1,
      },
      {
        name: "Prof. Rajesh Ranjan",
        role: "Faculty Convener & Sports Head",
        category: CommitteeCategory.FACULTY,
        department: "Electronics & Communication Engineering",
        photoUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        email: "coordinator@lnjpit.ac.in",
        order: 2,
      },
      {
        name: "Aman Verma",
        role: "Student General Secretary",
        category: CommitteeCategory.CORE_STUDENT,
        department: "Mechanical Engineering",
        photoUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
        email: "captain@lnjpit.ac.in",
        order: 3,
      },
      {
        name: "Ananya Sharma",
        role: "Student Technical & Logistics Lead",
        category: CommitteeCategory.TECHNICAL,
        department: "Electrical Engineering",
        photoUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
        email: "volunteer@lnjpit.ac.in",
        order: 4,
      },
    ],
  });

  console.log("✅ ASTITVA 2K26 Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

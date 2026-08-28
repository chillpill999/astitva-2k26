// ============================================================================
// ASTITVA 2K26 - Resilient Fest Data Access Layer (DAL)
// Path: lib/data/fest-data.ts
//
// IMPORTANT: This file provides *type definitions* and DB access functions
// for festival data. The previous "STATIC_*" placeholder arrays containing
// fabricated event names, sponsors, prizes, and organizer names have been
// removed. In production, the UI consumes the database exclusively. If a
// query returns no rows, the UI shows an empty state — never fabricated data.
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
// Static fallback arrays intentionally emptied.
//
// Previous revisions of this file shipped placeholder event names, sponsor
// brands, prize amounts, and organizer personas. Those have been removed.
// The accessors below now return an empty array when the database has no
// rows, so the UI layer renders a real "No data available" state instead of
// fabricated content.
// ----------------------------------------------------------------------------

export const STATIC_CATEGORIES: FestCategory[] = [];
export const STATIC_EVENTS: FestEvent[] = [];
export const STATIC_SPONSORS: FestSponsor[] = [];
export const STATIC_COMMITTEE: FestCommitteeMember[] = [];
export const STATIC_FAQS: FestFaq[] = [];
export const STATIC_GALLERY: FestGalleryItem[] = [];

// ----------------------------------------------------------------------------
// RESILIENT DATA ACCESS FUNCTIONS
// ----------------------------------------------------------------------------

/**
 * Retrieves festival categories from the database.
 * Returns an empty array if the database is unavailable or has no rows —
 * the UI is expected to handle the empty case explicitly.
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
  } catch {
    return [];
  }
}

/**
 * Retrieves festival events from the database.
 * Returns an empty array when the database is empty or unavailable.
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
  } catch {
    return [];
  }
}

/**
 * Retrieves schedule events grouped by day or for a specific day.
 */
export async function getFestSchedule(dayNumber?: number): Promise<FestEvent[]> {
  return getFestEvents({ dayNumber });
}

/**
 * Retrieves active sponsors from the database.
 */
export async function getFestSponsors(): Promise<FestSponsor[]> {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
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
  } catch {
    return [];
  }
}

/**
 * Retrieves organizing committee members from the database.
 */
export async function getFestCommittee(): Promise<FestCommitteeMember[]> {
  try {
    const members = await prisma.committeeMember.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
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
  } catch {
    return [];
  }
}

/**
 * Retrieves published FAQs from the database.
 */
export async function getFestFaqs(): Promise<FestFaq[]> {
  try {
    const faqs = await prisma.faq.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    });
    return faqs.map((f: any) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: f.category,
      order: f.order,
      isPublished: f.isPublished,
    }));
  } catch {
    return [];
  }
}

/**
 * Retrieves gallery items from the database.
 */
export async function getFestGallery(): Promise<FestGalleryItem[]> {
  try {
    const gallery = await prisma.galleryItem.findMany({
      orderBy: { order: "asc" },
    });
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
  } catch {
    return [];
  }
}

/**
 * Aggregates festival-wide statistics from real DB data.
 * Returns zeroed counters when no data is present — never fabricated numbers.
 */
export async function getFestStats(): Promise<{
  totalEvents: number;
  totalPrizePool: number;
  totalCategories: number;
  totalDays: number;
  totalParticipants: number;
}> {
  try {
    const events = await prisma.event.findMany({
      select: { prizePool: true, scheduleStart: true, scheduleEnd: true },
    });
    const categories = await prisma.category.count({ where: { isActive: true } });
    const participants = await prisma.profile.count();

    const totalPrizePool = events.reduce(
      (sum, e) => sum + Number(e.prizePool || 0),
      0
    );

    // Day span derived from actual event dates, never hardcoded.
    let dayCount = 0;
    if (events.length > 0) {
      const start = events.reduce(
        (min, e) => (e.scheduleStart < min ? e.scheduleStart : min),
        events[0].scheduleStart
      );
      const end = events.reduce(
        (max, e) => (e.scheduleEnd > max ? e.scheduleEnd : max),
        events[0].scheduleEnd
      );
      const ms = end.getTime() - start.getTime();
      dayCount = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
    }

    return {
      totalEvents: events.length,
      totalPrizePool,
      totalCategories: categories,
      totalDays: dayCount,
      totalParticipants: participants,
    };
  } catch {
    return {
      totalEvents: 0,
      totalPrizePool: 0,
      totalCategories: 0,
      totalDays: 0,
      totalParticipants: 0,
    };
  }
}

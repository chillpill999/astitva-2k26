// ============================================================================
// ASTITVA 2K26 - Database-Backed Sliding Rate Limiter
// Path: lib/security/rate-limit.ts
// ============================================================================

import { prisma } from "@/lib/db/prisma";

export interface RateLimitConfig {
  bucket: string;
  max: number;
  windowSeconds: number;
}

export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  current: number;
}

export async function checkRateLimit(config: RateLimitConfig): Promise<RateLimitDecision> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + config.windowSeconds * 1000);

  const existing = await prisma.rateLimitEntry.findUnique({
    where: { bucket: config.bucket },
  });

  // No entry or expired window — start fresh
  if (!existing || existing.expiresAt <= now) {
    await prisma.rateLimitEntry.upsert({
      where: { bucket: config.bucket },
      create: {
        bucket: config.bucket,
        count: 1,
        windowStart: now,
        expiresAt,
      },
      update: {
        count: 1,
        windowStart: now,
        expiresAt,
      },
    });
    return {
      allowed: true,
      remaining: config.max - 1,
      resetAt: expiresAt,
      current: 1,
    };
  }

  // Active window
  if (existing.count >= config.max) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.expiresAt,
      current: existing.count,
    };
  }

  const updated = await prisma.rateLimitEntry.update({
    where: { bucket: config.bucket },
    data: { count: { increment: 1 } },
  });

  return {
    allowed: true,
    remaining: config.max - updated.count,
    resetAt: existing.expiresAt,
    current: updated.count,
  };
}

export async function clearRateLimit(bucket: string): Promise<void> {
  await prisma.rateLimitEntry.deleteMany({ where: { bucket } });
}

// Background janitor — invoked on a best-effort basis; safe to no-op on failure.
export async function purgeExpiredRateLimits(): Promise<number> {
  const result = await prisma.rateLimitEntry.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return result.count;
}

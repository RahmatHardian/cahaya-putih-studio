import { prisma } from "./prisma";

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  retryAfterMs?: number;
}

// Default configurations for different actions
export const RATE_LIMIT_CONFIGS = {
  UPLOAD_PAYMENT_PROOF: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5, // 5 uploads per hour
  },
  CREATE_BOOKING: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // 10 bookings per hour per IP
  },
  LOGIN_ATTEMPT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 login attempts per 15 minutes
  },
} as const;

/**
 * Check rate limit for an action
 * @param identifier - IP address, booking ID, or user ID
 * @param action - The action being rate limited
 * @param config - Rate limit configuration
 */
export async function checkRateLimit(
  identifier: string,
  action: keyof typeof RATE_LIMIT_CONFIGS,
  config?: RateLimitConfig
): Promise<RateLimitResult> {
  const rateLimitConfig = config || RATE_LIMIT_CONFIGS[action];
  const { windowMs, maxRequests } = rateLimitConfig;

  // Calculate window start time (floor to window boundary)
  const now = Date.now();
  const windowStart = new Date(Math.floor(now / windowMs) * windowMs);
  const windowEnd = new Date(windowStart.getTime() + windowMs);

  try {
    // Find existing rate limit record
    const existing = await prisma.rateLimit.findFirst({
      where: {
        identifier,
        action,
        windowStart,
      },
    });

    // If no existing record, create one
    if (!existing) {
      await prisma.rateLimit.create({
        data: {
          identifier,
          action,
          windowStart,
          count: 1,
        },
      });

      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetAt: windowEnd,
      };
    }

    // Check if limit exceeded
    if (existing.count >= maxRequests) {
      const retryAfterMs = windowEnd.getTime() - now;
      return {
        allowed: false,
        remaining: 0,
        resetAt: windowEnd,
        retryAfterMs,
      };
    }

    // Increment counter
    await prisma.rateLimit.update({
      where: { id: existing.id },
      data: { count: { increment: 1 } },
    });

    return {
      allowed: true,
      remaining: maxRequests - existing.count - 1,
      resetAt: windowEnd,
    };
  } catch (error) {
    console.error("Rate limit check error:", error);
    // On error, allow the request but log it
    return {
      allowed: true,
      remaining: maxRequests,
      resetAt: windowEnd,
    };
  }
}

/**
 * Reset rate limit for an identifier and action
 */
export async function resetRateLimit(
  identifier: string,
  action: keyof typeof RATE_LIMIT_CONFIGS
): Promise<void> {
  try {
    await prisma.rateLimit.deleteMany({
      where: { identifier, action },
    });
  } catch (error) {
    console.error("Reset rate limit error:", error);
  }
}

/**
 * Clean up expired rate limit records
 * Should be run periodically (e.g., via cron job)
 */
export async function cleanupExpiredRateLimits(): Promise<number> {
  try {
    // Find the oldest window start we want to keep (e.g., 24 hours ago)
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await prisma.rateLimit.deleteMany({
      where: {
        windowStart: {
          lt: cutoff,
        },
      },
    });

    return result.count;
  } catch (error) {
    console.error("Cleanup rate limits error:", error);
    return 0;
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIP(headers: Headers): string {
  // Check various headers that might contain the real IP
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim();
  }

  const realIP = headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback
  return "unknown";
}

/**
 * Format retry after time for display
 */
export function formatRetryAfter(ms: number): string {
  const minutes = Math.ceil(ms / 60000);
  if (minutes === 1) {
    return "1 menit";
  }
  return `${minutes} menit`;
}

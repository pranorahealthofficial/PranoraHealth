// Shared in-memory sliding-window rate limiter (no new dependencies,
// no database, no schema change).
//
// Honest limits of this control:
// - Counters live in one serverless instance's memory. They reset on
//   deploy/restart and are not shared across instances, so this slows
//   bulk abuse from one IP rather than stopping it.
// - Mobile networks share IPs between many people, so limits stay
//   generous to avoid blocking legitimate visitors.
// - A determined attacker calling Supabase Auth directly bypasses
//   this entirely; it is a partial control, not a lockout.
// - The limiter fails OPEN: any internal error lets the request
//   through, so a limiter bug can never block legitimate traffic.

const windows = new Map()
const MAX_TRACKED_KEYS = 5000

function pruneStaleEntries(now) {
  for (const [key, stamps] of windows) {
    if (stamps.length === 0 || now - stamps[stamps.length - 1] > 60 * 60 * 1000) {
      windows.delete(key)
    }
  }
}

export function getClientIp(request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for")
    if (forwarded) return forwarded.split(",")[0].trim()
    return request.headers.get("x-real-ip") || "unknown"
  } catch {
    return "unknown"
  }
}

// Returns true when the key has already used up its allowance in the
// window (request should be rejected with 429). Returns false otherwise
// and records this request. Never throws: on any error it returns false.
export function isRateLimited(key, limit, windowMs) {
  try {
    const now = Date.now()
    const stamps = windows.get(key) || []
    const fresh = stamps.filter((t) => now - t < windowMs)
    if (fresh.length >= limit) {
      windows.set(key, fresh)
      return true
    }
    fresh.push(now)
    if (windows.size >= MAX_TRACKED_KEYS && !windows.has(key)) {
      pruneStaleEntries(now)
    }
    windows.set(key, fresh)
    return false
  } catch {
    return false
  }
}

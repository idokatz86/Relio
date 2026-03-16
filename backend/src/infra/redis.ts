/**
 * Redis Client for Relio
 * 
 * Handles session storage, rate limiting, and WebSocket pub/sub.
 * 
 * Issues #62 (Redis sessions + rate limiting) and #87 (WS pub/sub)
 * @see .github/agents/backend-developer.agent.md — WebSocket Infrastructure
 */

// Note: ioredis must be installed when Redis is enabled
// npm install ioredis

export interface RedisConfig {
  url: string;
}

/**
 * Room presence: track which users are in which rooms across replicas.
 * Uses Redis Sorted Sets with heartbeat timestamps.
 */
export interface RoomPresence {
  joinRoom(roomId: string, userId: string): Promise<void>;
  leaveRoom(roomId: string, userId: string): Promise<void>;
  getRoomMembers(roomId: string): Promise<string[]>;
}

/**
 * Rate limiter: sliding window rate limiting per user.
 */
export interface RateLimiter {
  checkLimit(userId: string, maxRequests: number, windowMs: number): Promise<boolean>;
}

/**
 * Pub/Sub: cross-replica message fan-out for WebSocket rooms.
 * When User A sends on replica 1, User B on replica 2 receives via Redis pub/sub.
 */
export interface PubSub {
  publish(channel: string, message: string): Promise<void>;
  subscribe(channel: string, handler: (message: string) => void): Promise<void>;
  unsubscribe(channel: string): Promise<void>;
}

/**
 * In-memory fallback when Redis is not configured.
 * Used in development and testing.
 */
export class InMemoryStore implements RoomPresence, RateLimiter {
  private rooms = new Map<string, Set<string>>();
  private rateLimits = new Map<string, { count: number; resetAt: number }>();

  async joinRoom(roomId: string, userId: string): Promise<void> {
    if (!this.rooms.has(roomId)) this.rooms.set(roomId, new Set());
    this.rooms.get(roomId)!.add(userId);
  }

  async leaveRoom(roomId: string, userId: string): Promise<void> {
    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(userId);
      if (room.size === 0) this.rooms.delete(roomId);
    }
  }

  async getRoomMembers(roomId: string): Promise<string[]> {
    return Array.from(this.rooms.get(roomId) ?? []);
  }

  async checkLimit(userId: string, maxRequests: number, windowMs: number): Promise<boolean> {
    const now = Date.now();
    const entry = this.rateLimits.get(userId);
    if (!entry || entry.resetAt <= now) {
      this.rateLimits.set(userId, { count: 1, resetAt: now + windowMs });
      return true;
    }
    if (entry.count >= maxRequests) return false;
    entry.count++;
    return true;
  }
}

/**
 * Create a store instance.
 * Uses Redis if REDIS_URL is configured, otherwise falls back to in-memory.
 */
export function createStore(): RoomPresence & RateLimiter {
  const redisUrl = process.env.REDIS_URL;

  if (redisUrl) {
    // TODO: Replace with ioredis implementation when redis is connected
    // For now, log a warning and use in-memory
    console.warn('[Redis] REDIS_URL configured but ioredis not connected yet. Using in-memory fallback.');
  }

  return new InMemoryStore();
}

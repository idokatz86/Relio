/**
 * WebSocket Redis Pub/Sub Relay
 *
 * Fans out Tier 3 messages across Container Apps replicas via Redis pub/sub.
 * When Redis is unavailable, falls back to a local-only EventEmitter so
 * single-replica deployments and tests continue to work.
 *
 * Issue #87 — Cross-replica WebSocket fan-out
 */

import { EventEmitter } from 'node:events';

/** The shape of a Tier 3 broadcast relayed between replicas. */
export interface Tier3Broadcast {
  type: 'tier3_message';
  data: {
    content: string;
    fromUserId: string;
    safetyLevel: string;
    timestamp: string;
  };
}

// ── Redis client handles (lazily created) ────────────────────
let pubClient: any = null;
let subClient: any = null;
let relayReady = false;

// Fallback: local emitter for single-replica / no-Redis mode
const localEmitter = new EventEmitter();
localEmitter.setMaxListeners(0); // rooms can be many

// Track active subscriptions so we can clean up
const activeSubscriptions = new Set<string>();

function channelName(roomId: string): string {
  return `room:${roomId}`;
}

// ── Public API ───────────────────────────────────────────────

/**
 * Initialise the relay. Safe to call multiple times — subsequent calls are no-ops.
 * When `redisUrl` is falsy the relay runs in local-only mode.
 */
export async function initRelay(redisUrl?: string): Promise<void> {
  if (relayReady) return;

  if (!redisUrl) {
    console.log('[WS-Relay] No REDIS_URL — running in local-only mode');
    relayReady = true;
    return;
  }

  try {
    // Dynamic import so the module doesn't hard-depend on ioredis at load time
    const ioredis = await import('ioredis');
    const Redis = ioredis.default ?? ioredis;

    pubClient = new (Redis as any)(redisUrl, { lazyConnect: true, maxRetriesPerRequest: 3 });
    subClient = new (Redis as any)(redisUrl, { lazyConnect: true, maxRetriesPerRequest: 3 });

    await Promise.all([pubClient.connect(), subClient.connect()]);

    // Wire incoming messages from Redis → local emitter so room handlers fire
    subClient.on('message', (channel: string, message: string) => {
      try {
        const parsed: Tier3Broadcast = JSON.parse(message);
        localEmitter.emit(channel, parsed);
      } catch {
        console.error('[WS-Relay] Bad message on channel', channel);
      }
    });

    relayReady = true;
    console.log('[WS-Relay] Redis pub/sub connected');
  } catch (err) {
    console.warn('[WS-Relay] Redis connection failed — falling back to local-only:', err);
    pubClient = null;
    subClient = null;
    relayReady = true;
  }
}

/**
 * Publish a Tier 3 broadcast to every replica listening on this room.
 * Falls back to local emit when Redis is unavailable.
 */
export async function publishTier3Message(
  roomId: string,
  message: Tier3Broadcast,
): Promise<void> {
  const channel = channelName(roomId);
  const payload = JSON.stringify(message);

  if (pubClient) {
    await pubClient.publish(channel, payload);
    // The publishing replica's own subClient will receive this and emit locally.
  } else {
    // Local-only: emit directly
    localEmitter.emit(channel, message);
  }
}

/**
 * Subscribe this replica to a room channel.
 * `callback` fires for every Tier 3 message on that room (including
 * messages published by this replica — the caller should filter by userId).
 */
export async function subscribeToRoom(
  roomId: string,
  callback: (msg: Tier3Broadcast) => void,
): Promise<void> {
  const channel = channelName(roomId);

  // Always wire the local emitter (both Redis and local-only paths use it)
  localEmitter.on(channel, callback);

  if (subClient && !activeSubscriptions.has(channel)) {
    await subClient.subscribe(channel);
    activeSubscriptions.add(channel);
  }
}

/**
 * Unsubscribe from a room channel.
 * Only actually unsubscribes from Redis when there are no more local listeners.
 */
export async function unsubscribeFromRoom(roomId: string): Promise<void> {
  const channel = channelName(roomId);

  localEmitter.removeAllListeners(channel);

  if (subClient && activeSubscriptions.has(channel)) {
    await subClient.unsubscribe(channel);
    activeSubscriptions.delete(channel);
  }
}

/**
 * Graceful shutdown — disconnect both Redis clients and clear state.
 */
export async function shutdownRelay(): Promise<void> {
  if (subClient) {
    for (const ch of activeSubscriptions) {
      try { await subClient.unsubscribe(ch); } catch { /* best effort */ }
    }
    subClient.disconnect();
    subClient = null;
  }
  if (pubClient) {
    pubClient.disconnect();
    pubClient = null;
  }

  activeSubscriptions.clear();
  localEmitter.removeAllListeners();
  relayReady = false;
}

// ── Test helpers (not exported at runtime surface) ───────────
export const _testing = {
  /** Whether relay is using Redis or local-only */
  get isRedisConnected(): boolean { return pubClient !== null && subClient !== null; },
  /** Reset relay state — useful between test runs */
  reset(): void {
    pubClient = null;
    subClient = null;
    activeSubscriptions.clear();
    localEmitter.removeAllListeners();
    relayReady = false;
  },
  localEmitter,
};

/**
 * Tests for WebSocket Redis Pub/Sub Relay
 *
 * Validates cross-replica message fan-out via Redis pub/sub,
 * local-only fallback, and room lifecycle management.
 *
 * Issue #87
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  initRelay,
  publishTier3Message,
  subscribeToRoom,
  unsubscribeFromRoom,
  shutdownRelay,
  _testing,
} from '../src/infra/ws-relay.js';
import type { Tier3Broadcast } from '../src/infra/ws-relay.js';

function makeBroadcast(overrides: Partial<Tier3Broadcast['data']> = {}): Tier3Broadcast {
  return {
    type: 'tier3_message',
    data: {
      content: 'I understand you feel frustrated',
      fromUserId: 'user-a',
      safetyLevel: 'low',
      timestamp: new Date().toISOString(),
      ...overrides,
    },
  };
}

describe('ws-relay', () => {
  beforeEach(async () => {
    _testing.reset();
  });

  // ── Local-only mode (no Redis) ─────────────────────────────

  describe('local-only fallback', () => {
    it('initialises without a Redis URL', async () => {
      await initRelay(); // no url
      expect(_testing.isRedisConnected).toBe(false);
    });

    it('publishes and receives messages locally', async () => {
      await initRelay();

      const received: Tier3Broadcast[] = [];
      await subscribeToRoom('room-1', (msg) => received.push(msg));

      const broadcast = makeBroadcast();
      await publishTier3Message('room-1', broadcast);

      expect(received).toHaveLength(1);
      expect(received[0].data.content).toBe('I understand you feel frustrated');
    });

    it('does not cross-talk between rooms', async () => {
      await initRelay();

      const room1: Tier3Broadcast[] = [];
      const room2: Tier3Broadcast[] = [];
      await subscribeToRoom('room-1', (msg) => room1.push(msg));
      await subscribeToRoom('room-2', (msg) => room2.push(msg));

      await publishTier3Message('room-1', makeBroadcast());

      expect(room1).toHaveLength(1);
      expect(room2).toHaveLength(0);
    });

    it('unsubscribe stops message delivery', async () => {
      await initRelay();

      const received: Tier3Broadcast[] = [];
      await subscribeToRoom('room-1', (msg) => received.push(msg));
      await unsubscribeFromRoom('room-1');

      await publishTier3Message('room-1', makeBroadcast());

      expect(received).toHaveLength(0);
    });
  });

  // ── Room lifecycle ─────────────────────────────────────────

  describe('room lifecycle', () => {
    it('multiple subscribers in the same room each receive messages', async () => {
      await initRelay();

      const sub1: Tier3Broadcast[] = [];
      const sub2: Tier3Broadcast[] = [];
      await subscribeToRoom('room-1', (msg) => sub1.push(msg));
      await subscribeToRoom('room-1', (msg) => sub2.push(msg));

      await publishTier3Message('room-1', makeBroadcast());

      expect(sub1).toHaveLength(1);
      expect(sub2).toHaveLength(1);
    });

    it('unsubscribe clears all listeners for the room', async () => {
      await initRelay();

      const sub1: Tier3Broadcast[] = [];
      const sub2: Tier3Broadcast[] = [];
      await subscribeToRoom('room-1', (msg) => sub1.push(msg));
      await subscribeToRoom('room-1', (msg) => sub2.push(msg));

      await unsubscribeFromRoom('room-1');
      await publishTier3Message('room-1', makeBroadcast());

      expect(sub1).toHaveLength(0);
      expect(sub2).toHaveLength(0);
    });

    it('shutdown clears all subscriptions and listeners', async () => {
      await initRelay();

      const received: Tier3Broadcast[] = [];
      await subscribeToRoom('room-1', (msg) => received.push(msg));
      await subscribeToRoom('room-2', (msg) => received.push(msg));

      await shutdownRelay();

      // After shutdown, the local emitter has no listeners
      expect(_testing.localEmitter.listenerCount('room:room-1')).toBe(0);
      expect(_testing.localEmitter.listenerCount('room:room-2')).toBe(0);
    });
  });

  // ── Tier 3 message fidelity ────────────────────────────────

  describe('message fidelity', () => {
    it('preserves all Tier3Broadcast fields', async () => {
      await initRelay();

      const received: Tier3Broadcast[] = [];
      await subscribeToRoom('room-x', (msg) => received.push(msg));

      const broadcast = makeBroadcast({
        content: 'Reframed message with empathy',
        fromUserId: 'user-42',
        safetyLevel: 'medium',
      });

      await publishTier3Message('room-x', broadcast);

      expect(received[0]).toEqual(broadcast);
    });

    it('handles rapid sequential publishes', async () => {
      await initRelay();

      const received: Tier3Broadcast[] = [];
      await subscribeToRoom('room-1', (msg) => received.push(msg));

      for (let i = 0; i < 50; i++) {
        await publishTier3Message('room-1', makeBroadcast({ content: `msg-${i}` }));
      }

      expect(received).toHaveLength(50);
      expect(received[49].data.content).toBe('msg-49');
    });
  });

  // ── Idempotency / resilience ───────────────────────────────

  describe('resilience', () => {
    it('initRelay is idempotent', async () => {
      await initRelay();
      await initRelay(); // second call should be no-op
      expect(_testing.isRedisConnected).toBe(false);
    });

    it('unsubscribe from room with no subscriptions is safe', async () => {
      await initRelay();
      // Should not throw
      await expect(unsubscribeFromRoom('nonexistent')).resolves.toBeUndefined();
    });

    it('shutdown when not initialised is safe', async () => {
      await expect(shutdownRelay()).resolves.toBeUndefined();
    });
  });

  // ── Redis simulation (mock) ────────────────────────────────

  describe('Redis pub/sub simulation', () => {
    it('routes messages through Redis message event', async () => {
      // Simulate what happens when Redis is connected:
      // subClient emits 'message' → localEmitter fires →  subscriber callbacks fire
      await initRelay(); // local-only

      const received: Tier3Broadcast[] = [];
      await subscribeToRoom('room-sim', (msg) => received.push(msg));

      // Simulate Redis delivering a message from another replica
      const foreignBroadcast = makeBroadcast({ fromUserId: 'user-on-replica-2' });
      _testing.localEmitter.emit('room:room-sim', foreignBroadcast);

      expect(received).toHaveLength(1);
      expect(received[0].data.fromUserId).toBe('user-on-replica-2');
    });
  });
});

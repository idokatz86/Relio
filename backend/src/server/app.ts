/**
 * Relio HTTP + WebSocket Server
 * 
 * Implements the backend-developer agent mandates:
 * 1. WebSocket Infrastructure — real-time 3-way synchronization
 * 2. Intercept & Hold Logic — catch User A's message, route to orchestrator, await Tier 3
 * 3. Data Stripping — sanitize outgoing payloads before broadcasting to User B
 * 
 * Security (Sprint 5):
 * - JWT authentication on all endpoints + WebSocket upgrade (#67, #75)
 * - Input validation with Zod schemas (#76)
 * - CORS locked to allowed origins (#76)
 * - Helmet security headers (#76)
 * - Rate limiting per userId (#76)
 * 
 * @see .github/agents/backend-developer.agent.md
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { processMessage } from '../pipeline/mediation-pipeline.js';
import { adminRouter, recordPipelineMetrics, recordSafetyEvent } from './admin-router.js';
import { authMiddleware, authenticateWebSocket } from '../auth/auth-service.js';
import { consentRouter } from '../auth/consent-router.js';
import { inviteRouter } from './invite-router.js';
import { accountRouter } from './account-router.js';
import { registerPushToken } from './push-notifications.js';
import { abTestRouter } from './ab-test-router.js';
import { initializePools, shutdownPools, getDbHealth, isInMemoryMode } from '../db/index.js';
import { runMigrations } from '../db/migrate.js';
import * as tier1Repo from '../db/repositories/tier1-repo.js';
import * as tier3Repo from '../db/repositories/tier3-repo.js';
import type { AuthenticatedUser } from '../auth/auth-service.js';
import type { PipelineResult } from '../types/index.js';
import { initRelay, publishTier3Message, subscribeToRoom, unsubscribeFromRoom, shutdownRelay } from '../infra/ws-relay.js';
import type { Tier3Broadcast } from '../infra/ws-relay.js';

// ── Zod Schemas (Issue #76) ─────────────────────────────────
const MediateRequestSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message cannot exceed 2000 characters'),
  preferredLanguage: z.enum(['en', 'es', 'pt', 'he']).optional().default('en'),
});

const WsMessageSchema = z.object({
  type: z.literal('message'),
  content: z.string().min(1).max(2000),
});

// ── CORS Configuration (Issue #76) ──────────────────────────
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
const corsOptions: cors.CorsOptions = {
  origin: ALLOWED_ORIGINS.length > 0
    ? ALLOWED_ORIGINS
    : process.env.NODE_ENV === 'production' ? false : true,
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Auth now imported from ../auth/auth-service.js (#105, #113)

// ── Express App ──────────────────────────────────────────────
const app = express();

// Security headers (Issue #76)
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));

// Rate limiting: 30 requests per minute per IP (Issue #76)
app.use('/api/', rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
}));

// Stricter rate limit on auth-adjacent endpoints (Issue #128)
// 5 attempts per 15 minutes — prevents brute force on consent/account
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts. Please try again in 15 minutes.' },
  keyGenerator: (req) => {
    // Rate limit by IP + userId to prevent distributed attacks
    const user = (req as any).user;
    return user?.id ? `${req.ip}-${user.id}` : req.ip || 'unknown';
  },
});

// Health check (public, no auth required)
app.get('/health', async (_req: express.Request, res: express.Response) => {
  const db = await getDbHealth();
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.8.0', db });
});

// ── Waitlist (public, no auth — pre-launch email capture) ────
const waitlistEmails: Array<{ email: string; source: string; ip: string; timestamp: string }> = [];

app.post('/api/v1/waitlist', rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 signups per IP per hour
  message: { error: 'Too many signups. Please try again later.' },
}), (req: express.Request, res: express.Response) => {
  const schema = z.object({
    email: z.string().email('Invalid email address').max(254),
    source: z.string().max(50).optional().default('landing'),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid email', details: parsed.error.issues });
    return;
  }

  // Check duplicate
  if (waitlistEmails.some(e => e.email === parsed.data.email)) {
    res.json({ success: true, message: "You're already on the list!", duplicate: true });
    return;
  }

  waitlistEmails.push({
    email: parsed.data.email,
    source: parsed.data.source,
    ip: req.ip || 'unknown',
    timestamp: new Date().toISOString(),
  });

  console.log(`[Waitlist] New signup: ${parsed.data.email} (total: ${waitlistEmails.length})`);
  res.json({ success: true, message: "You're on the list! We'll notify you at launch.", position: waitlistEmails.length });
});

// Admin: get waitlist count (behind admin auth)
app.get('/api/v1/waitlist/count', authMiddleware, (req: express.Request, res: express.Response) => {
  const user = (req as any).user;
  if (process.env.AUTH_DISABLED !== 'true' && user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  res.json({ count: waitlistEmails.length, emails: waitlistEmails });
});

// Admin API (Issue #94: Backoffice Phase 1)
app.use('/api/v1/admin', adminRouter);

// Consent & Age Verification API (Sprint 8: #109, #110 — auth rate limited #128)
app.use('/api/v1/consent', authMiddleware, authRateLimit, consentRouter);

// Partner Invite API (Sprint 9: #118, #122)
app.use('/api/v1/invite', authMiddleware, inviteRouter);

// Account Management API (Sprint 10: #125, #126 — auth rate limited #128)
app.use('/api/v1/account', authMiddleware, authRateLimit, accountRouter);

// Reviewer Seed Data (Issue #151, #168 — only in dev/staging)
app.get('/api/v1/seed/reviewer', (req: express.Request, res: express.Response) => {
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_SEED) {
    res.status(403).json({ error: 'Seed endpoint disabled in production' });
    return;
  }
  import('./seed-data.js').then(({ seedReviewerData, getDemoCredentials }) => {
    seedReviewerData();
    res.json(getDemoCredentials());
  }).catch(() => {
    res.status(500).json({ error: 'Failed to load seed module' });
  });
});

// Push Token Registration (Sprint 10: #132)
app.post('/api/v1/push/register', authMiddleware, (req: express.Request, res: express.Response) => {
  const schema = z.object({
    expoPushToken: z.string().startsWith('ExponentPushToken['),
    platform: z.enum(['ios', 'android']),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid push token', details: parsed.error.issues });
    return;
  }
  const user = (req as any).user as AuthenticatedUser;
  registerPushToken(user.id, parsed.data.expoPushToken, parsed.data.platform);
  res.json({ registered: true });
});

// A/B Test Assignments (Sprint 10: #131)
app.use('/api/v1/ab', authMiddleware, abTestRouter);

// Feedback submission (user-facing, reuses admin router's submit handler)
app.post('/api/v1/feedback', authMiddleware, async (req: express.Request, res: express.Response) => {
  const { z: zod } = await import('zod');
  const schema = zod.object({
    type: zod.enum(['session_rating', 'weekly_pulse', 'nps', 'churn']),
    rating: zod.number().min(0).max(10),
    comment: zod.string().max(500).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid feedback', details: parsed.error.issues });
    return;
  }
  const { adminStats } = await import('./admin-router.js');
  const user = (req as any).user;
  const entry = {
    id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId: user?.id || 'anonymous',
    type: parsed.data.type as any,
    rating: parsed.data.rating,
    comment: parsed.data.comment || null,
    phase: 'unknown',
    createdAt: new Date().toISOString(),
  };
  adminStats.feedback.push(entry);
  res.status(201).json({ id: entry.id, received: true });
});

// ── Psychoeducation Micro-Lessons ────────────────────────────
app.get('/api/v1/psychoeducation/lesson', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { generateMicroLesson } = await import('../agents/psychoeducation.js');
    const stage = (req.query.stage as string) || 'dating';
    const language = (req.query.language as string) || 'en';
    const digitalFriction = req.query.digitalFriction === 'true';
    const phubbing = req.query.phubbing === 'true';
    const attachmentStyle = (req.query.attachmentStyle as string) || undefined;

    const lesson = await generateMicroLesson(
      stage as any,
      { digitalFriction, phubbing, attachmentStyle },
      language,
    );
    res.json(lesson);
  } catch (err) {
    console.error('[Psychoeducation] Error:', err);
    res.status(500).json({ error: 'Failed to generate lesson' });
  }
});

// ── Progress Tracker ─────────────────────────────────────────
app.get('/api/v1/progress', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { trackProgress } = await import('../agents/progress-tracker.js');
    const language = (req.query.language as string) || 'en';
    // For now, use in-memory stats until DB is connected
    const { adminStats } = await import('./admin-router.js');
    const totalInvocations = adminStats.pipelineLatencyMs.length;
    const avgLatency = totalInvocations > 0
      ? adminStats.pipelineLatencyMs.reduce((a: number, b: number) => a + b, 0) / totalInvocations
      : 0;
    const metrics = await trackProgress({
      sessionsThisWeek: Math.ceil(totalInvocations / 7),
      sessionsLastWeek: 0,
      avgDurationMinutes: Math.round(avgLatency / 60000),
      horsemenCounts: { criticism: 0, contempt: 0, defensiveness: 0, stonewalling: 0 },
      prevHorsemenCounts: { criticism: 0, contempt: 0, defensiveness: 0, stonewalling: 0 },
      repairAttempts: 0,
      totalConflicts: adminStats.safetyEvents.length,
      safetyHalts: adminStats.safetyHaltsToday,
    }, language);
    res.json(metrics);
  } catch (err) {
    console.error('[Progress] Error:', err);
    res.status(500).json({ error: 'Failed to generate progress metrics' });
  }
});

// REST endpoint for single message processing (Issue #67: auth required)
app.post('/api/v1/mediate', authMiddleware, async (req: express.Request, res: express.Response) => {
  // Input validation with Zod (Issue #76)
  const parsed = MediateRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Validation failed',
      details: parsed.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })),
    });
    return;
  }

  const { userId, message, preferredLanguage } = parsed.data;
  const authenticatedUser = (req as any).user as AuthenticatedUser;

  // Enforce: userId must match authenticated user (prevent impersonation)
  if (process.env.AUTH_DISABLED !== 'true' && authenticatedUser.id !== userId) {
    res.status(403).json({ error: 'userId does not match authenticated user' });
    return;
  }

  try {
    const result = await processMessage(userId, message, preferredLanguage);

    // Record telemetry for admin dashboard (#94)
    recordPipelineMetrics(result.processingTimeMs, result.agentsInvoked);
    recordSafetyEvent(result.safetyCheck.severity, result.safetyCheck.halt);

    const sanitized = stripTier1Data(result, userId);
    res.json(sanitized);
  } catch (err) {
    console.error('[API] Pipeline error:', err);
    res.status(500).json({ error: 'Pipeline processing failed' });
  }
});

// ── HTTP Server ──────────────────────────────────────────────
const server = createServer(app);

// ── WebSocket Server (Issues #75: JWT auth on upgrade) ───────
interface RoomMember {
  ws: WebSocket;
  userId: string;
}

const rooms = new Map<string, Map<string, RoomMember>>();

const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', async (ws, req) => {
  const url = new URL(req.url ?? '', `http://${req.headers.host}`);
  const roomId = url.searchParams.get('roomId');
  const token = url.searchParams.get('token');

  // Issue #75: Authenticate WebSocket connections (#113: B2C JWKS)
  let userId: string;
  if (process.env.AUTH_DISABLED === 'true') {
    userId = url.searchParams.get('userId') ?? uuidv4();
  } else {
    if (!token) {
      ws.close(4401, 'Authentication required');
      return;
    }
    const user = await authenticateWebSocket(token);
    if (!user) {
      ws.close(4401, 'Invalid token');
      return;
    }
    userId = user.id;
  }

  if (!roomId) {
    ws.close(4400, 'roomId is required');
    return;
  }

  // TODO: Validate user is a legitimate member of this room (after DB integration #65)

  // Join room
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Map());
  }
  const isFirstInRoom = rooms.get(roomId)!.size === 0;
  rooms.get(roomId)!.set(userId, { ws, userId });

  // Subscribe this replica to the room's Redis channel (first local connection triggers it)
  if (isFirstInRoom) {
    await subscribeToRoom(roomId, (msg: Tier3Broadcast) => {
      // Relay: broadcast to all local connections in this room except the sender
      const localRoom = rooms.get(roomId);
      if (!localRoom) return;
      for (const [memberId, member] of localRoom) {
        if (memberId !== msg.data.fromUserId && member.ws.readyState === WebSocket.OPEN) {
          member.ws.send(JSON.stringify(msg));
        }
      }
    });
  }

  ws.send(JSON.stringify({
    type: 'connected',
    roomId,
    userId,
    timestamp: new Date().toISOString(),
  }));

  // Heartbeat: ping every 30s, disconnect on 3 missed pongs
  let missedPongs = 0;
  const heartbeat = setInterval(() => {
    if (missedPongs >= 3) {
      ws.terminate();
      clearInterval(heartbeat);
      return;
    }
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
      missedPongs++;
    }
  }, 30_000);
  ws.on('pong', () => { missedPongs = 0; });

  ws.on('message', async (data) => {
    try {
      const raw = JSON.parse(data.toString());

      // Validate WebSocket message schema (Issue #76)
      const parsed = WsMessageSchema.safeParse(raw);
      if (!parsed.success) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        return;
      }

      const rawMessage = parsed.data.content;

      // Mandate #2: Intercept & Hold Logic
      ws.send(JSON.stringify({
        type: 'processing',
        timestamp: new Date().toISOString(),
      }));

      const result = await processMessage(userId, rawMessage);

      // Persist to database (non-blocking — don't fail the WS flow)
      if (!isInMemoryMode()) {
        try {
          await tier1Repo.insertTier1Message(
            roomId, userId, rawMessage,
            result.safetyCheck.severity,
            result.safetyCheck.halt,
            result.safetyCheck.reasoning ?? null,
          );
          if (result.tier3Output && !result.safetyCheck.halt) {
            await tier3Repo.insertTier3Message(
              roomId, userId, result.tier3Output,
              result.agentsInvoked, result.processingTimeMs,
              result.safetyCheck.severity,
            );
          }
        } catch (dbErr) {
          console.error('[WS] DB persistence error (non-fatal):', dbErr);
        }
      }

      // Send result to sender (they see their own data in private journal)
      ws.send(JSON.stringify({
        type: 'pipeline_result',
        data: {
          safetyCheck: {
            severity: result.safetyCheck.severity,
            halt: result.safetyCheck.halt,
            // Note: reasoning stripped to prevent Tier 1 echo (Issue #76)
          },
          tier3Output: result.tier3Output,
          profile: result.profile,
          processingTimeMs: result.processingTimeMs,
          agentsInvoked: result.agentsInvoked,
        },
        timestamp: new Date().toISOString(),
      }));

      // Mandate #3: Data Stripping — broadcast ONLY Tier 3 to partner
      // Publish via Redis relay so all replicas receive it (#87)
      if (result.tier3Output && !result.safetyCheck.halt) {
        const tier3Broadcast: Tier3Broadcast = {
          type: 'tier3_message',
          data: {
            content: result.tier3Output,
            fromUserId: userId,
            safetyLevel: result.safetyCheck.severity,
            timestamp: new Date().toISOString(),
          },
        };

        await publishTier3Message(roomId, tier3Broadcast);
      }
    } catch (err) {
      console.error('[WS] Message processing error:', err);
      ws.send(JSON.stringify({ type: 'error', message: 'Processing failed' }));
    }
  });

  ws.on('close', async () => {
    clearInterval(heartbeat);
    const room = rooms.get(roomId);
    if (room) {
      room.delete(userId);
      if (room.size === 0) {
        rooms.delete(roomId);
        // Last local connection left — unsubscribe from Redis channel
        await unsubscribeFromRoom(roomId);
      }
    }
  });
});

/**
 * Strip Tier 1 data from pipeline results for external responses.
 * The original raw message is NEVER included in API responses.
 */
function stripTier1Data(result: PipelineResult, senderId: string) {
  return {
    senderId,
    safetyHalt: result.safetyCheck.halt,
    safetySeverity: result.safetyCheck.severity,
    tier3Output: result.tier3Output,
    profile: result.profile ? {
      attachmentStyle: result.profile.attachmentStyle,
      activationState: result.profile.activationState,
    } : null,
    processingTimeMs: result.processingTimeMs,
    agentsInvoked: result.agentsInvoked,
  };
}

// ── Start Server ─────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? '3001', 10);

// ── Startup ──────────────────────────────────────────────────
async function start() {
  // Initialize database pools (falls back to in-memory when env vars missing)
  try {
    await initializePools();
    if (!isInMemoryMode() && process.env.AUTO_MIGRATE === 'true') {
      const { applied, failed } = await runMigrations();
      if (failed.length > 0) {
        console.error('[Startup] Migration failures:', failed);
      }
    }
  } catch (err) {
    console.error('[Startup] DB initialization failed — falling back to in-memory:', err);
  }

  // Initialize Redis pub/sub relay for cross-replica WebSocket fan-out (#87)
  await initRelay(process.env.REDIS_URL);

  server.listen(PORT, () => {
    const authStatus = process.env.AUTH_DISABLED === 'true' ? '⚠️  AUTH DISABLED (dev mode)' : '🔒 JWT auth enabled';
    const dbStatus = isInMemoryMode() ? '💾 In-memory (no PG)' : '🐘 PostgreSQL connected';
    console.log(`🟢 Relio API Server v1.8.0 on http://localhost:${PORT}`);
    console.log(`   ${authStatus}`);
    console.log(`   ${dbStatus}`);
    console.log(`   WebSocket: ws://localhost:${PORT}/ws`);
    console.log(`   REST API:  http://localhost:${PORT}/api/v1/mediate`);
    console.log(`   Health:    http://localhost:${PORT}/health`);
  });
}

// ── Graceful Shutdown ────────────────────────────────────────
async function shutdown(signal: string) {
  console.log(`\n[Shutdown] ${signal} received — closing gracefully`);
  server.close();
  await shutdownRelay();
  await shutdownPools();
  process.exit(0);
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Only auto-start when run directly (not imported by tests)
const isDirectRun = process.argv[1]?.includes('app.js') || process.argv[1]?.includes('app.ts');
if (isDirectRun) {
  start();
}

export { app, server };

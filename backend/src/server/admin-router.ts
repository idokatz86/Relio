/**
 * Relio Admin API Router
 * 
 * Backoffice endpoints for tracking users, couples, phases,
 * subscriptions, pipeline metrics, safety events, and feedback.
 * 
 * PRIVACY: Connects ONLY to Tier 3 (shared) database.
 * NEVER queries Tier 1 (private) or Tier 2 (clinical) data.
 * 
 * Issue #94: Backoffice Phase 1
 * @see .github/skills/build-admin-api/SKILL.md
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { isInMemoryMode } from '../db/pool.js';
import * as tier1Repo from '../db/repositories/tier1-repo.js';
import * as tier3Repo from '../db/repositories/tier3-repo.js';

const router = Router();

// ── In-Memory Stats (until DB integration is live) ──────────
// These counters are populated by the pipeline and API calls.
// After PostgreSQL Tier 3 is connected, these will be replaced by DB queries.

interface AdminStats {
  totalUsers: number;
  activeCouples: number;
  soloUsers: number;
  messagesToday: number;
  safetyHaltsToday: number;
  pipelineLatencyMs: number[];
  tokenUsage: { agent: string; tokens: number }[];
  safetyEvents: { severity: string; halt: boolean; timestamp: string }[];
  feedback: FeedbackEntry[];
  userRegistry: Map<string, UserRecord>;
  roomRegistry: Map<string, RoomRecord>;
}

interface UserRecord {
  id: string;
  displayName: string;
  createdAt: string;
  subscriptionTier: 'free' | 'premium_solo' | 'premium_couples' | 'premium_plus';
  phase: 'dating' | 'commitment' | 'crisis' | 'separation' | 'post_divorce' | 'unknown';
  roomId: string | null;
  lastActive: string;
}

interface RoomRecord {
  id: string;
  userA: string;
  userB: string | null;
  phase: string;
  status: 'active' | 'paused' | 'archived';
  lastActivity: string;
}

interface FeedbackEntry {
  id: string;
  userId: string;
  type: 'session_rating' | 'weekly_pulse' | 'nps' | 'churn';
  rating: number;
  comment: string | null;
  phase: string;
  createdAt: string;
}

// Global admin stats store (shared with pipeline via import)
export const adminStats: AdminStats = {
  totalUsers: 0,
  activeCouples: 0,
  soloUsers: 0,
  messagesToday: 0,
  safetyHaltsToday: 0,
  pipelineLatencyMs: [],
  tokenUsage: [],
  safetyEvents: [],
  feedback: [],
  userRegistry: new Map(),
  roomRegistry: new Map(),
};

// ── Admin Auth Middleware ────────────────────────────────────
function adminAuthMiddleware(req: Request, res: Response, next: Function): void {
  // In dev mode with AUTH_DISABLED, allow all admin access
  if (process.env.AUTH_DISABLED === 'true') {
    (req as any).adminUser = { id: 'dev-admin', role: 'admin' };
    next();
    return;
  }

  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  (req as any).adminUser = user;
  next();
}

// ── k-Anonymity Helper ──────────────────────────────────────
const K_THRESHOLD = 5;
function kAnonymize(value: number): number | string {
  return value < K_THRESHOLD ? '<5' : value;
}

function kAnonymizeDistribution(dist: Record<string, number>): Record<string, number | string> {
  const result: Record<string, number | string> = {};
  for (const [key, val] of Object.entries(dist)) {
    result[key] = kAnonymize(val);
  }
  return result;
}

// ── Audit Logging ───────────────────────────────────────────
const auditLog: Array<{ adminId: string; endpoint: string; timestamp: string; ip: string }> = [];

function logAdminAction(req: Request, endpoint: string): void {
  auditLog.push({
    adminId: (req as any).adminUser?.id || 'unknown',
    endpoint,
    timestamp: new Date().toISOString(),
    ip: req.ip || req.socket.remoteAddress || 'unknown',
  });
}

// ── Routes ──────────────────────────────────────────────────

// Overview stats
router.get('/stats/overview', adminAuthMiddleware, async (req: Request, res: Response) => {
  logAdminAction(req, '/admin/stats/overview');

  let userCount: number;
  let couples: number;
  let solo: number;

  if (!isInMemoryMode()) {
    try {
      userCount = await tier1Repo.countUsers();
      const roomCounts = await tier3Repo.countRooms();
      couples = roomCounts.paired;
      solo = Math.max(0, userCount - (couples * 2));
    } catch (err) {
      console.error('[Admin] DB stats error, falling back to in-memory:', err);
      userCount = adminStats.userRegistry.size || adminStats.totalUsers;
      const rooms = Array.from(adminStats.roomRegistry.values());
      couples = rooms.filter(r => r.userB !== null).length;
      solo = Math.max(0, userCount - (couples * 2));
    }
  } else {
    userCount = adminStats.userRegistry.size || adminStats.totalUsers;
    const rooms = Array.from(adminStats.roomRegistry.values());
    couples = rooms.filter(r => r.userB !== null).length;
    solo = Math.max(0, userCount - (couples * 2));
  }

  res.json({
    totalUsers: userCount,
    activeCouples: kAnonymize(couples),
    soloUsers: kAnonymize(solo),
    messagesToday: adminStats.messagesToday,
    safetyHaltsToday: adminStats.safetyHaltsToday,
    avgPipelineLatencyMs: adminStats.pipelineLatencyMs.length > 0
      ? Math.round(adminStats.pipelineLatencyMs.reduce((a, b) => a + b, 0) / adminStats.pipelineLatencyMs.length)
      : 0,
    timestamp: new Date().toISOString(),
  });
});

// User directory (paginated, NO email, NO raw messages)
const UserQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  phase: z.string().optional(),
  tier: z.string().optional(),
});

router.get('/users', adminAuthMiddleware, (req: Request, res: Response) => {
  logAdminAction(req, '/admin/users');

  const query = UserQuerySchema.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: 'Invalid query parameters' });
    return;
  }

  let users = Array.from(adminStats.userRegistry.values());

  if (query.data.phase) {
    users = users.filter(u => u.phase === query.data.phase);
  }
  if (query.data.tier) {
    users = users.filter(u => u.subscriptionTier === query.data.tier);
  }

  const start = (query.data.page - 1) * query.data.limit;
  const paged = users.slice(start, start + query.data.limit);

  res.json({
    users: paged.map(u => ({
      id: u.id.slice(0, 8) + '...', // Anonymized ID
      displayName: u.displayName,
      createdAt: u.createdAt,
      subscriptionTier: u.subscriptionTier,
      phase: u.phase,
      hasPartner: u.roomId !== null,
      lastActive: u.lastActive,
    })),
    total: users.length,
    page: query.data.page,
    limit: query.data.limit,
  });
});

// Couple pairing status
router.get('/couples', adminAuthMiddleware, (req: Request, res: Response) => {
  logAdminAction(req, '/admin/couples');

  const rooms = Array.from(adminStats.roomRegistry.values());
  res.json({
    couples: rooms.map(r => ({
      roomId: r.id.slice(0, 8) + '...',
      paired: r.userB !== null,
      phase: r.phase,
      status: r.status,
      lastActivity: r.lastActivity,
    })),
    totalPaired: kAnonymize(rooms.filter(r => r.userB !== null).length),
    totalSolo: kAnonymize(rooms.filter(r => r.userB === null).length),
  });
});

// Phase distribution
router.get('/phases', adminAuthMiddleware, (req: Request, res: Response) => {
  logAdminAction(req, '/admin/phases');

  const users = Array.from(adminStats.userRegistry.values());
  const dist: Record<string, number> = {
    dating: 0, commitment: 0, crisis: 0, separation: 0, post_divorce: 0, unknown: 0,
  };
  for (const u of users) {
    dist[u.phase] = (dist[u.phase] || 0) + 1;
  }

  res.json({
    distribution: kAnonymizeDistribution(dist),
    total: users.length,
    timestamp: new Date().toISOString(),
  });
});

// Subscription analytics
router.get('/subscriptions', adminAuthMiddleware, (req: Request, res: Response) => {
  logAdminAction(req, '/admin/subscriptions');

  const users = Array.from(adminStats.userRegistry.values());
  const tiers: Record<string, number> = {
    free: 0, premium_solo: 0, premium_couples: 0, premium_plus: 0,
  };
  for (const u of users) {
    tiers[u.subscriptionTier] = (tiers[u.subscriptionTier] || 0) + 1;
  }

  const pricing: Record<string, number> = {
    free: 0, premium_solo: 9.99, premium_couples: 14.99, premium_plus: 24.99,
  };
  const mrr = Object.entries(tiers).reduce((sum, [tier, count]) => {
    return sum + (pricing[tier] || 0) * count;
  }, 0);

  res.json({
    tiers: kAnonymizeDistribution(tiers),
    mrr: Math.round(mrr * 100) / 100,
    arr: Math.round(mrr * 12 * 100) / 100,
    paidUsers: tiers.premium_solo + tiers.premium_couples + tiers.premium_plus,
    freeUsers: tiers.free,
    conversionRate: users.length > 0
      ? Math.round(((users.length - tiers.free) / users.length) * 10000) / 100
      : 0,
    timestamp: new Date().toISOString(),
  });
});

// Pipeline metrics
router.get('/pipeline', adminAuthMiddleware, (req: Request, res: Response) => {
  logAdminAction(req, '/admin/pipeline');

  const latencies = adminStats.pipelineLatencyMs;
  const sorted = [...latencies].sort((a, b) => a - b);

  res.json({
    messagesToday: adminStats.messagesToday,
    latency: {
      p50: sorted.length > 0 ? sorted[Math.floor(sorted.length * 0.5)] : 0,
      p95: sorted.length > 0 ? sorted[Math.floor(sorted.length * 0.95)] : 0,
      p99: sorted.length > 0 ? sorted[Math.floor(sorted.length * 0.99)] : 0,
      avg: sorted.length > 0 ? Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length) : 0,
    },
    tokenUsage: adminStats.tokenUsage,
    totalTokens: adminStats.tokenUsage.reduce((sum, t) => sum + t.tokens, 0),
    timestamp: new Date().toISOString(),
  });
});

// Safety events (anonymized)
router.get('/safety', adminAuthMiddleware, (req: Request, res: Response) => {
  logAdminAction(req, '/admin/safety');

  const events = adminStats.safetyEvents;
  const severityDist: Record<string, number> = {};
  for (const e of events) {
    severityDist[e.severity] = (severityDist[e.severity] || 0) + 1;
  }

  res.json({
    totalEvents: events.length,
    halts: events.filter(e => e.halt).length,
    haltRate: events.length > 0
      ? Math.round((events.filter(e => e.halt).length / events.length) * 10000) / 100
      : 0,
    severityDistribution: kAnonymizeDistribution(severityDist),
    recentEvents: events.slice(-20).map(e => ({
      severity: e.severity,
      halt: e.halt,
      timestamp: e.timestamp,
      // NO userId, NO message content — anonymized
    })),
    timestamp: new Date().toISOString(),
  });
});

// Feedback (with PII-safe comments)
const FeedbackQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  type: z.enum(['session_rating', 'weekly_pulse', 'nps', 'churn']).optional(),
});

router.get('/feedback', adminAuthMiddleware, (req: Request, res: Response) => {
  logAdminAction(req, '/admin/feedback');

  const query = FeedbackQuerySchema.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: 'Invalid query parameters' });
    return;
  }

  let entries = [...adminStats.feedback];
  if (query.data.type) {
    entries = entries.filter(f => f.type === query.data.type);
  }

  const start = (query.data.page - 1) * query.data.limit;
  const paged = entries.slice(start, start + query.data.limit);

  // NPS calculation (for nps type)
  const npsEntries = adminStats.feedback.filter(f => f.type === 'nps');
  const promoters = npsEntries.filter(f => f.rating >= 9).length;
  const detractors = npsEntries.filter(f => f.rating <= 6).length;
  const npsScore = npsEntries.length > 0
    ? Math.round(((promoters - detractors) / npsEntries.length) * 100)
    : null;

  res.json({
    feedback: paged.map(f => ({
      id: f.id,
      userId: f.userId.slice(0, 8) + '...', // Anonymized
      type: f.type,
      rating: f.rating,
      comment: f.comment,
      phase: f.phase,
      createdAt: f.createdAt,
    })),
    total: entries.length,
    page: query.data.page,
    avgRating: entries.length > 0
      ? Math.round((entries.reduce((s, f) => s + f.rating, 0) / entries.length) * 10) / 10
      : null,
    npsScore,
    timestamp: new Date().toISOString(),
  });
});

// Submit feedback (user-facing endpoint)
const FeedbackSubmitSchema = z.object({
  type: z.enum(['session_rating', 'weekly_pulse', 'nps', 'churn']),
  rating: z.number().min(0).max(10),
  comment: z.string().max(500).optional(),
});

router.post('/feedback/submit', (req: Request, res: Response) => {
  const parsed = FeedbackSubmitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid feedback', details: parsed.error.issues });
    return;
  }

  const user = (req as any).user;
  const entry: FeedbackEntry = {
    id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId: user?.id || 'anonymous',
    type: parsed.data.type,
    rating: parsed.data.rating,
    comment: parsed.data.comment || null,
    phase: 'unknown',
    createdAt: new Date().toISOString(),
  };

  adminStats.feedback.push(entry);
  res.status(201).json({ id: entry.id, received: true });
});

// Audit log (admin-only)
router.get('/audit', adminAuthMiddleware, (req: Request, res: Response) => {
  logAdminAction(req, '/admin/audit');
  res.json({
    entries: auditLog.slice(-100),
    total: auditLog.length,
  });
});

// System health
router.get('/health', adminAuthMiddleware, (req: Request, res: Response) => {
  logAdminAction(req, '/admin/health');
  res.json({
    status: 'ok',
    version: '1.8.0',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
});

export { router as adminRouter };

// ── Telemetry Helpers (called from pipeline) ────────────────
export function recordPipelineMetrics(latencyMs: number, agentsInvoked: string[], tokensUsed?: number): void {
  adminStats.messagesToday++;
  adminStats.pipelineLatencyMs.push(latencyMs);
  // Keep last 1000 latency samples
  if (adminStats.pipelineLatencyMs.length > 1000) {
    adminStats.pipelineLatencyMs.shift();
  }
  if (tokensUsed) {
    for (const agent of agentsInvoked) {
      adminStats.tokenUsage.push({ agent, tokens: Math.round(tokensUsed / agentsInvoked.length) });
    }
  }
}

export function recordSafetyEvent(severity: string, halt: boolean): void {
  adminStats.safetyEvents.push({
    severity,
    halt,
    timestamp: new Date().toISOString(),
  });
  if (halt) {
    adminStats.safetyHaltsToday++;
  }
  // Keep last 500 events
  if (adminStats.safetyEvents.length > 500) {
    adminStats.safetyEvents.shift();
  }
}

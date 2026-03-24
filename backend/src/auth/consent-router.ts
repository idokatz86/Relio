/**
 * Consent & Age Verification Router
 * 
 * Manages user consent for ToS, Privacy Policy, and age verification.
 * All consent actions are immutably audited per GDPR requirements.
 * 
 * Issues #109 (ConsentScreen API), #110 (consent_audit table)
 * @see .github/skills/implement-consent-audit/SKILL.md
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import type { AuthenticatedUser } from './auth-service.js';
import { isInMemoryMode } from '../db/pool.js';
import * as authRepo from '../db/repositories/auth-repo.js';

const router = Router();

// ── Current Versions ─────────────────────────────────────────
const CURRENT_TOS_VERSION = '1.0.0';
const CURRENT_PRIVACY_VERSION = '1.0.0';
const MIN_AGE = 18;

// ── In-Memory Store (until DB connected) ─────────────────────
interface ConsentRecord {
  userId: string;
  tosVersion: string;
  tosAcceptedAt: string;
  privacyVersion: string;
  privacyAcceptedAt: string;
  ageVerified: boolean;
  ageVerifiedAt: string | null;
  dateOfBirth: string | null;
}

const consentStore = new Map<string, ConsentRecord>();

// Immutable audit log
interface ConsentAuditEntry {
  id: string;
  userId: string;
  action: 'accept_tos' | 'accept_privacy' | 'verify_age' | 'withdraw_consent' | 're_accept_tos' | 're_accept_privacy';
  version: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

const auditLog: ConsentAuditEntry[] = [];

// ── Schemas ──────────────────────────────────────────────────
const AcceptConsentSchema = z.object({
  tosVersion: z.string().min(1),
  privacyVersion: z.string().min(1),
});

const AgeVerifySchema = z.object({
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format'),
});

// ── Helpers ──────────────────────────────────────────────────
function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function logAudit(entry: Omit<ConsentAuditEntry, 'id' | 'timestamp'>): void {
  auditLog.push({
    ...entry,
    id: `ca-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
  });
}

// ── Routes ───────────────────────────────────────────────────

// Get consent status for current user
router.get('/status', async (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;

  let consent: { tosVersion: string | null; tosAcceptedAt: string | null; privacyVersion: string | null; privacyAcceptedAt: string | null; ageVerified: boolean } | null = null;

  if (!isInMemoryMode()) {
    try {
      const record = await authRepo.getConsentRecord(user.id);
      if (record) {
        consent = {
          tosVersion: record.tos_version,
          tosAcceptedAt: record.tos_accepted_at,
          privacyVersion: record.privacy_version,
          privacyAcceptedAt: record.privacy_accepted_at,
          ageVerified: record.age_verified,
        };
      }
    } catch (err) {
      console.error('[Consent] DB status error:', err);
    }
  } else {
    const mem = consentStore.get(user.id);
    if (mem) {
      consent = {
        tosVersion: mem.tosVersion,
        tosAcceptedAt: mem.tosAcceptedAt,
        privacyVersion: mem.privacyVersion,
        privacyAcceptedAt: mem.privacyAcceptedAt,
        ageVerified: mem.ageVerified,
      };
    }
  }

  res.json({
    hasConsented: !!consent,
    tosVersion: consent?.tosVersion || null,
    tosAccepted: !!consent?.tosAcceptedAt,
    tosUpToDate: consent?.tosVersion === CURRENT_TOS_VERSION,
    privacyVersion: consent?.privacyVersion || null,
    privacyAccepted: !!consent?.privacyAcceptedAt,
    privacyUpToDate: consent?.privacyVersion === CURRENT_PRIVACY_VERSION,
    ageVerified: consent?.ageVerified || false,
    currentTosVersion: CURRENT_TOS_VERSION,
    currentPrivacyVersion: CURRENT_PRIVACY_VERSION,
    requiresUpdate: consent ? (
      consent.tosVersion !== CURRENT_TOS_VERSION ||
      consent.privacyVersion !== CURRENT_PRIVACY_VERSION
    ) : true,
  });
});

// Accept ToS + Privacy Policy
router.post('/accept', async (req: Request, res: Response) => {
  const parsed = AcceptConsentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid consent data', details: parsed.error.issues });
    return;
  }

  const user = (req as any).user as AuthenticatedUser;
  const now = new Date().toISOString();

  if (!isInMemoryMode()) {
    try {
      const existing = await authRepo.getConsentRecord(user.id);
      const isReAcceptTos = existing && existing.tos_version !== parsed.data.tosVersion;
      const isReAcceptPrivacy = existing && existing.privacy_version !== parsed.data.privacyVersion;

      await authRepo.insertConsentRecord(
        user.id,
        parsed.data.tosVersion,
        parsed.data.privacyVersion,
        existing?.age_verified ?? false,
      );
      await authRepo.insertConsentAudit(
        user.id,
        isReAcceptTos ? 're_accept_tos' : 'accept_tos',
        parsed.data.tosVersion,
        req.ip || 'unknown',
        req.headers['user-agent'] || 'unknown',
      );
      await authRepo.insertConsentAudit(
        user.id,
        isReAcceptPrivacy ? 're_accept_privacy' : 'accept_privacy',
        parsed.data.privacyVersion,
        req.ip || 'unknown',
        req.headers['user-agent'] || 'unknown',
      );

      res.json({ accepted: true, tosVersion: parsed.data.tosVersion, privacyVersion: parsed.data.privacyVersion });
      return;
    } catch (err) {
      console.error('[Consent] DB accept error:', err);
      res.status(500).json({ error: 'Failed to record consent' });
      return;
    }
  }

  // In-memory fallback
  const existing = consentStore.get(user.id);

  consentStore.set(user.id, {
    userId: user.id,
    tosVersion: parsed.data.tosVersion,
    tosAcceptedAt: now,
    privacyVersion: parsed.data.privacyVersion,
    privacyAcceptedAt: now,
    ageVerified: existing?.ageVerified || false,
    ageVerifiedAt: existing?.ageVerifiedAt || null,
    dateOfBirth: existing?.dateOfBirth || null,
  });

  // Issue #133: Detect re-acceptance (version upgrade) vs first acceptance
  const isReAcceptTos = existing && existing.tosVersion !== parsed.data.tosVersion;
  const isReAcceptPrivacy = existing && existing.privacyVersion !== parsed.data.privacyVersion;

  logAudit({
    userId: user.id,
    action: isReAcceptTos ? 're_accept_tos' : 'accept_tos',
    version: parsed.data.tosVersion,
    ipAddress: req.ip || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
  });
  logAudit({
    userId: user.id,
    action: isReAcceptPrivacy ? 're_accept_privacy' : 'accept_privacy',
    version: parsed.data.privacyVersion,
    ipAddress: req.ip || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
  });

  res.json({ accepted: true, tosVersion: parsed.data.tosVersion, privacyVersion: parsed.data.privacyVersion });
});

// Age verification
router.post('/verify-age', async (req: Request, res: Response) => {
  const parsed = AgeVerifySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid date of birth', details: parsed.error.issues });
    return;
  }

  const age = calculateAge(parsed.data.dateOfBirth);
  if (age < MIN_AGE) {
    res.status(403).json({
      error: `You must be at least ${MIN_AGE} years old to use Relio`,
      verified: false,
    });
    return;
  }

  const user = (req as any).user as AuthenticatedUser;

  if (!isInMemoryMode()) {
    try {
      const existing = await authRepo.getConsentRecord(user.id);
      await authRepo.insertConsentRecord(
        user.id,
        existing?.tos_version ?? '',
        existing?.privacy_version ?? '',
        true,
      );
      await authRepo.insertConsentAudit(
        user.id, 'verify_age', `age=${age}`,
        req.ip || 'unknown', req.headers['user-agent'] || 'unknown',
      );
      res.json({ verified: true, age });
      return;
    } catch (err) {
      console.error('[Consent] DB verify-age error:', err);
      res.status(500).json({ error: 'Failed to verify age' });
      return;
    }
  }

  // In-memory fallback
  const now = new Date().toISOString();
  const existing = consentStore.get(user.id) || {
    userId: user.id, tosVersion: '', tosAcceptedAt: '', privacyVersion: '', privacyAcceptedAt: '',
    ageVerified: false, ageVerifiedAt: null, dateOfBirth: null,
  };

  consentStore.set(user.id, {
    ...existing,
    ageVerified: true,
    ageVerifiedAt: now,
    dateOfBirth: parsed.data.dateOfBirth,
  });

  logAudit({
    userId: user.id,
    action: 'verify_age',
    version: `age=${age}`,
    ipAddress: req.ip || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
  });

  res.json({ verified: true, age });
});

// Withdraw consent (GDPR right)
router.post('/withdraw', async (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;

  if (!isInMemoryMode()) {
    try {
      await authRepo.deleteConsentRecord(user.id);
      await authRepo.insertConsentAudit(
        user.id, 'withdraw_consent', 'all',
        req.ip || 'unknown', req.headers['user-agent'] || 'unknown',
      );
      res.json({ withdrawn: true });
      return;
    } catch (err) {
      console.error('[Consent] DB withdraw error:', err);
      res.status(500).json({ error: 'Failed to withdraw consent' });
      return;
    }
  }

  // In-memory fallback
  consentStore.delete(user.id);

  logAudit({
    userId: user.id,
    action: 'withdraw_consent',
    version: 'all',
    ipAddress: req.ip || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
  });

  res.json({ withdrawn: true });
});

// Admin: get audit log
router.get('/audit', async (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;
  if (process.env.AUTH_DISABLED !== 'true' && user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  if (!isInMemoryMode()) {
    try {
      const entries = await authRepo.getConsentAuditEntries(100);
      res.json({ entries, total: entries.length });
      return;
    } catch (err) {
      console.error('[Consent] DB audit error:', err);
    }
  }

  res.json({ entries: auditLog.slice(-100), total: auditLog.length });
});

export { router as consentRouter };

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
  action: 'accept_tos' | 'accept_privacy' | 'verify_age' | 'withdraw_consent';
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
router.get('/status', (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;
  const consent = consentStore.get(user.id);

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
router.post('/accept', (req: Request, res: Response) => {
  const parsed = AcceptConsentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid consent data', details: parsed.error.issues });
    return;
  }

  const user = (req as any).user as AuthenticatedUser;
  const now = new Date().toISOString();
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

  logAudit({
    userId: user.id,
    action: 'accept_tos',
    version: parsed.data.tosVersion,
    ipAddress: req.ip || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
  });
  logAudit({
    userId: user.id,
    action: 'accept_privacy',
    version: parsed.data.privacyVersion,
    ipAddress: req.ip || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
  });

  res.json({ accepted: true, tosVersion: parsed.data.tosVersion, privacyVersion: parsed.data.privacyVersion });
});

// Age verification
router.post('/verify-age', (req: Request, res: Response) => {
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
router.post('/withdraw', (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;
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
router.get('/audit', (req: Request, res: Response) => {
  const user = (req as any).user as AuthenticatedUser;
  if (process.env.AUTH_DISABLED !== 'true' && user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  res.json({ entries: auditLog.slice(-100), total: auditLog.length });
});

export { router as consentRouter };

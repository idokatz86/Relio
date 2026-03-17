/**
 * Relio Auth Service
 * 
 * Provider-agnostic JWT validation via OIDC JWKS endpoint.
 * Currently configured for Clerk (free tier).
 * Swap to any OIDC provider by changing JWKS_URI + JWT_ISSUER env vars.
 * 
 * Issues #97-#106: Auth provider migration (Azure AD B2C → Clerk)
 * @see .github/agents/chief-info-security-officer.agent.md
 */

import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import type { Request, Response, NextFunction } from 'express';

// ── Clerk / OIDC Configuration ───────────────────────────────
// These work with ANY OIDC provider — just change the env vars.
const JWKS_URI = process.env.JWKS_URI || '';
const ISSUER = process.env.JWT_ISSUER || '';
const AUDIENCE = process.env.AUTH_AUDIENCE || undefined;

// Lazy-initialized JWKS
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(JWKS_URI));
  }
  return jwks;
}

// ── Types ────────────────────────────────────────────────────
export interface AuthenticatedUser {
  id: string;           // B2C object ID (sub claim)
  email?: string;
  displayName?: string;
  role: 'user' | 'admin';
  ageVerified?: boolean;
  consentVersion?: string;
}

export interface AuthTokenPayload extends JWTPayload {
  sub: string;
  email?: string;          // Clerk uses 'email' directly
  name?: string;
  metadata?: {             // Clerk public_metadata via custom JWT template
    role?: string;
    ageVerified?: boolean;
    consentVersion?: string;
  };
  // Clerk-specific claims
  azp?: string;            // Authorized party (Clerk app ID)
}

// ── Token Verification ───────────────────────────────────────

/**
 * Verify a JWT token against the configured OIDC JWKS endpoint.
 * Works with Clerk, Auth0, Supabase, or any OIDC provider.
 */
export async function verifyToken(token: string): Promise<AuthenticatedUser | null> {
  if (!JWKS_URI) {
    // No JWKS configured — cannot validate tokens
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getJWKS(), {
      issuer: ISSUER || undefined,
      audience: AUDIENCE,
    });

    const claims = payload as AuthTokenPayload;
    if (!claims.sub) return null;

    return {
      id: claims.sub,
      email: claims.email,
      displayName: claims.name,
      role: claims.metadata?.role === 'admin' ? 'admin' : 'user',
      ageVerified: claims.metadata?.ageVerified,
      consentVersion: claims.metadata?.consentVersion,
    };
  } catch {
    return null;
  }
}

// ── Express Middleware ────────────────────────────────────────

/**
 * Auth middleware — validates JWT on protected routes.
 * 
 * Dev mode: AUTH_DISABLED=true bypasses validation (for local testing only).
 * Production: Requires valid Clerk (or any OIDC) token.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Dev mode bypass
  if (process.env.AUTH_DISABLED === 'true') {
    (req as any).user = {
      id: req.body?.userId || 'dev-user',
      role: 'user',
    } as AuthenticatedUser;
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.slice(7);
  verifyToken(token).then(user => {
    if (!user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }
    (req as any).user = user;
    next();
  }).catch(() => {
    res.status(401).json({ error: 'Token verification failed' });
  });
}

/**
 * Admin middleware — requires admin role.
 * Must be used AFTER authMiddleware.
 */
export function adminMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Dev mode bypass
  if (process.env.AUTH_DISABLED === 'true') {
    (req as any).user = { ...((req as any).user || {}), role: 'admin' };
    next();
    return;
  }

  const user = (req as any).user as AuthenticatedUser | undefined;
  if (!user || user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
}

/**
 * WebSocket auth — validates JWT from ?token= query param.
 * Returns authenticated user or null.
 */
export async function authenticateWebSocket(token: string | null): Promise<AuthenticatedUser | null> {
  if (process.env.AUTH_DISABLED === 'true') {
    return null; // Handled by caller in dev mode
  }
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Relio API Client
 *
 * Follows backend-developer agent mandates:
 * - WebSocket Infrastructure for real-time 3-way sync
 * - Intercept & Hold Logic via REST fallback
 * - Data Stripping: server handles this, client trusts response
 *
 * Auth: JWT token stored in expo-secure-store, sent as
 * Bearer header (REST) and ?token= query param (WebSocket).
 */

import type { MediationResponse, WSIncoming, WSOutgoing } from '../types';
import * as SecureStore from 'expo-secure-store';

// Azure Container Apps backend (Sweden Central)
const AZURE_HOST = 'relio-backend.livelytree-6981c681.swedencentral.azurecontainerapps.io';
const LOCAL_HOST = 'localhost';

// Clerk publishable key (free tier)
export const CLERK_PUBLISHABLE_KEY = 'pk_test_c2V0LWJvYS01LmNsZXJrLmFjY291bnRzLmRldiQ';

// Toggle for local development (use `adb reverse tcp:3001 tcp:3001` for Android emulator)
const USE_LOCAL = false;
const LOCAL_PORT = '3001';

const DEV_HOST = USE_LOCAL ? LOCAL_HOST : AZURE_HOST;
const DEV_SCHEME = USE_LOCAL ? 'http' : 'https';
const DEV_WS_SCHEME = USE_LOCAL ? 'ws' : 'wss';

const API_BASE = __DEV__
  ? `${DEV_SCHEME}://${DEV_HOST}${USE_LOCAL ? `:${LOCAL_PORT}` : ''}`
  : `https://${AZURE_HOST}`;

const WS_BASE = __DEV__
  ? `${DEV_WS_SCHEME}://${DEV_HOST}${USE_LOCAL ? `:${LOCAL_PORT}` : ''}`
  : `wss://${AZURE_HOST}`;

// ── Auth Token Helpers ───────────────────────────────────────
const AUTH_TOKEN_KEY = 'relio_auth_token';

export async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
}

export async function clearAuthToken(): Promise<void> {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
}

/**
 * Build headers with Authorization if token is available.
 */
async function authHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = await getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ── REST API ─────────────────────────────────────────────────

/**
 * Accept consent (ToS + Privacy Policy + AI Disclosure)
 */
export async function acceptConsent(
  tosVersion: string,
  privacyVersion: string,
  ageVerified: boolean,
): Promise<void> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/api/v1/consent/accept`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ tosVersion, privacyVersion, ageVerified }),
  });
  if (!response.ok) throw new Error(`Consent error: ${response.status}`);
}

/**
 * Verify age
 */
export async function verifyAge(dateOfBirth: string): Promise<void> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/api/v1/consent/verify-age`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ dateOfBirth }),
  });
  if (!response.ok) throw new Error(`Age verify error: ${response.status}`);
}

/**
 * Create a partner invite
 */
export async function createInvite(): Promise<{ inviteCode: string; deepLink: string }> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/api/v1/invite/create`, {
    method: 'POST',
    headers,
  });
  if (!response.ok) throw new Error(`Invite error: ${response.status}`);
  return response.json();
}

/**
 * Accept a partner invite
 */
export async function acceptInvite(inviteCode: string): Promise<{ roomId: string }> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/api/v1/invite/accept`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ inviteCode }),
  });
  if (!response.ok) throw new Error(`Invite accept error: ${response.status}`);
  return response.json();
}

/**
 * Delete user account — Apple 5.1.1(v) compliant.
 * Schedules account for deletion with 24h grace period.
 * Issue #160: Server-side account deletion
 */
export async function deleteAccount(): Promise<{ scheduled: boolean; scheduledPurgeAt: string }> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/api/v1/account`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) throw new Error(`Delete account error: ${response.status}`);
  return response.json();
}

/**
 * Send a message through the 5-agent pipeline via REST.
 * Used as fallback when WebSocket is unavailable.
 */
export async function sendMessage(
  userId: string,
  message: string,
): Promise<MediationResponse> {
  console.log(`[API] Sending to ${API_BASE}/api/v1/mediate`);
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/api/v1/mediate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ userId, message }),
  });

  if (response.status === 401) {
    console.error('[API] Unauthorized — token may be expired');
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    console.error(`[API] Error: ${response.status} ${text}`);
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  console.log(`[API] Response:`, JSON.stringify(data).slice(0, 200));
  return data;
}

/**
 * Health check
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}

// ── Trial API (Issue #200 — Sprint 15) ───────────────────────

export interface TrialStatus {
  active: boolean;
  daysRemaining: number;
  sessionsRemaining: number;
  startedAt: string | null;
  expiresAt: string | null;
  eligible: boolean;
}

/**
 * Start 14-day free SharedChat trial.
 */
export async function startTrial(): Promise<TrialStatus & { started: boolean }> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/api/v1/trial/start`, {
    method: 'POST',
    headers,
  });
  return response.json();
}

/**
 * Get current trial status.
 */
export async function getTrialStatus(): Promise<TrialStatus> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/api/v1/trial/status`, { headers });
  if (!response.ok) throw new Error(`Trial status error: ${response.status}`);
  return response.json();
}

// ── Solo Translation API (Issue #197 — Sprint 15) ────────────

export interface SoloTranslation {
  translated: boolean;
  safetyHalt: boolean;
  id?: string;
  tier3Output: string | null;
  severity?: string;
  processingTimeMs: number;
  usage?: {
    used: number;
    limit: number | null;
    remaining: number | null;
    tier: string;
  };
}

export interface TranslationHistoryItem {
  id: string;
  tier1Input: string;
  tier3Output: string;
  language: string;
  createdAt: string;
}

export interface UsageStatus {
  used: number;
  limit: number | null;
  remaining: number | null;
  tier: string;
  resetsAt: string;
}

/**
 * Translate raw frustration (Tier 1) into constructive message (Tier 3).
 * Free users: 5/week. Paid users: unlimited.
 */
export async function translateSolo(
  message: string,
  preferredLanguage: string = 'en',
): Promise<SoloTranslation> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/api/v1/solo/translate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message, preferredLanguage }),
  });

  if (response.status === 429) {
    const data = await response.json();
    return {
      translated: false,
      safetyHalt: false,
      tier3Output: null,
      processingTimeMs: 0,
      usage: data,
    };
  }

  if (!response.ok) {
    throw new Error(`Translation error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get past translation history.
 */
export async function getTranslationHistory(): Promise<{ translations: TranslationHistoryItem[]; total: number }> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/api/v1/solo/history`, { headers });
  if (!response.ok) throw new Error(`History error: ${response.status}`);
  return response.json();
}

/**
 * Get current week's usage status.
 */
export async function getUsageStatus(): Promise<UsageStatus> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/api/v1/solo/usage`, { headers });
  if (!response.ok) throw new Error(`Usage error: ${response.status}`);
  return response.json();
}

// ── Pattern Tracking API (Issue #206 — Sprint 16) ────────────

export interface WeeklyPattern {
  week: string;
  summary: string;
  themes: string[];
  avgIntensity: number;
  horsemen: string[];
  translationCount: number;
  improvement: number | null;
}

export interface TrendData {
  trends: Array<{
    week: string;
    translationCount: number;
    avgIntensity: number;
    themes: string[];
    horsemen: string[];
  }>;
  totalWeeks: number;
}

export async function getWeeklyPattern(): Promise<WeeklyPattern> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/api/v1/patterns/weekly`, { headers });
  if (!response.ok) throw new Error(`Pattern error: ${response.status}`);
  return response.json();
}

export async function getPatternTrends(): Promise<TrendData> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/api/v1/patterns/trends`, { headers });
  if (!response.ok) throw new Error(`Trends error: ${response.status}`);
  return response.json();
}

// ── Attachment Profiling API (Issue #207 — Sprint 17) ────────

export interface AttachmentProfile {
  ready: boolean;
  translationsNeeded?: number;
  message?: string;
  primaryStyle?: string;
  confidence?: number;
  subState?: string;
  dataPoints?: number;
  title?: string;
  description?: string;
  tip?: string;
  disclaimer?: string;
}

export async function getAttachmentProfile(): Promise<AttachmentProfile> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE}/api/v1/attachment/profile`, { headers });
  if (!response.ok) throw new Error(`Attachment error: ${response.status}`);
  return response.json();
}

// ── Social Proof API (Issue #210 — Sprint 17) ────────────────

export interface SocialProof {
  couplesThisMonth: number;
  translationsThisWeek: number;
  frameworks: string[];
}

export async function getSocialProof(): Promise<SocialProof> {
  const response = await fetch(`${API_BASE}/api/v1/social-proof`);
  if (!response.ok) throw new Error(`Social proof error: ${response.status}`);
  return response.json();
}

// ── WebSocket ────────────────────────────────────────────────

/**
 * WebSocket connection manager
 *
 * Follows implement-secure-websocket skill:
 * - JWT auth via ?token= query param (matches backend app.ts WS auth)
 * - Exponential backoff reconnection (1s→2s→4s→8s→30s max)
 * - Replay missed Tier 3 messages on reconnect
 */
export class RelioSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectDelay = 30000;
  private listeners: Map<string, Set<(data: WSIncoming) => void>> = new Map();

  constructor(
    private roomId: string,
    private userId: string,
  ) {}

  async connect(): Promise<void> {
    // Get auth token for WebSocket handshake
    const token = await getAuthToken();
    let url = `${WS_BASE}/ws?roomId=${encodeURIComponent(this.roomId)}&userId=${encodeURIComponent(this.userId)}`;
    if (token) {
      url += `&token=${encodeURIComponent(token)}`;
    }

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('[WS] Connected to', this.roomId);
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data: WSIncoming = JSON.parse(event.data as string);
        this.emit(data.type, data);
      } catch {
        // ignore malformed messages
      }
    };

    this.ws.onclose = (event) => {
      console.log(`[WS] Closed: code=${event.code}`);
      if (event.code === 4401) {
        // Auth failure — don't reconnect, surface to UI
        this.emit('error', { type: 'error', message: 'Authentication failed' } as WSIncoming);
        return;
      }
      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  send(message: string): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn('[WS] Cannot send — not connected');
      return;
    }
    const payload: WSOutgoing = { type: 'message', content: message };
    this.ws.send(JSON.stringify(payload));
  }

  on(event: string, callback: (data: WSIncoming) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.listeners.get(event)?.delete(callback);
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
    this.listeners.clear();
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private emit(event: string, data: WSIncoming): void {
    this.listeners.get(event)?.forEach((cb) => cb(data));
    this.listeners.get('*')?.forEach((cb) => cb(data));
  }

  private scheduleReconnect(): void {
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay,
    );
    this.reconnectAttempts++;
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    setTimeout(() => this.connect(), delay);
  }
}

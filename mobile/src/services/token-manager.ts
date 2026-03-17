/**
 * Auth Token Manager
 * 
 * Manages JWT token lifecycle: storage, retrieval, refresh, and expiry.
 * Uses expo-secure-store for encrypted token persistence.
 * 
 * Issue #112: Token storage in expo-secure-store + refresh logic
 * @see .github/agents/native-mobile-developer.agent.md — At-Rest Encryption
 */

import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS_TOKEN: 'relio_access_token',
  REFRESH_TOKEN: 'relio_refresh_token',
  TOKEN_EXPIRY: 'relio_token_expiry',
  USER_ID: 'relio_user_id',
} as const;

export interface TokenSet {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // Unix timestamp ms
  userId: string;
}

// ── Store Tokens ─────────────────────────────────────────────

export async function storeTokens(tokens: TokenSet): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, tokens.accessToken),
    SecureStore.setItemAsync(KEYS.TOKEN_EXPIRY, String(tokens.expiresAt)),
    SecureStore.setItemAsync(KEYS.USER_ID, tokens.userId),
    tokens.refreshToken
      ? SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, tokens.refreshToken)
      : Promise.resolve(),
  ]);
}

// ── Retrieve Tokens ──────────────────────────────────────────

export async function getAccessToken(): Promise<string | null> {
  try {
    const token = await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
    if (!token) return null;

    // Check expiry
    const expiryStr = await SecureStore.getItemAsync(KEYS.TOKEN_EXPIRY);
    if (expiryStr) {
      const expiry = parseInt(expiryStr, 10);
      if (Date.now() > expiry) {
        // Token expired — try refresh
        const refreshed = await refreshAccessToken();
        return refreshed;
      }
    }

    return token;
  } catch {
    return null;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  } catch {
    return null;
  }
}

export async function getUserId(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(KEYS.USER_ID);
  } catch {
    return null;
  }
}

// ── Refresh Token ────────────────────────────────────────────

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    await clearTokens();
    return null;
  }

  try {
    // TODO: Call B2C token refresh endpoint
    // For now, clear and force re-login
    console.log('[Auth] Token expired, clearing tokens');
    await clearTokens();
    return null;
  } catch {
    await clearTokens();
    return null;
  }
}

// ── Check Auth State ─────────────────────────────────────────

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken();
  return token !== null;
}

export async function getAuthState(): Promise<{
  authenticated: boolean;
  userId: string | null;
  tokenExpired: boolean;
}> {
  const token = await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
  const userId = await SecureStore.getItemAsync(KEYS.USER_ID);
  const expiryStr = await SecureStore.getItemAsync(KEYS.TOKEN_EXPIRY);

  if (!token) {
    return { authenticated: false, userId: null, tokenExpired: false };
  }

  const expired = expiryStr ? Date.now() > parseInt(expiryStr, 10) : false;
  return { authenticated: !expired, userId, tokenExpired: expired };
}

// ── Clear Tokens (Logout) ────────────────────────────────────

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
    SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
    SecureStore.deleteItemAsync(KEYS.TOKEN_EXPIRY),
    SecureStore.deleteItemAsync(KEYS.USER_ID),
  ]);
}
